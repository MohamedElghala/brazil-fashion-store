import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';
import * as bcrypt from 'bcryptjs';
import { validateCPF, generatePixEMVCo } from '@/lib/brazil';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { route: string[] } }
) {
  try {
    const route = params.route || [];
    const { searchParams } = new URL(request.url);

    // 1. /api/products
    if (route[0] === 'products' && route.length === 1) {
      const category = searchParams.get('category') || undefined;
      const search = searchParams.get('search') || undefined;
      const featured = searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined;
      const isNew = searchParams.get('isNew') ? searchParams.get('isNew') === 'true' : undefined;
      const sort = searchParams.get('sort') || undefined;
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

      const products = dataStore.getProducts({
        category,
        search,
        featured,
        isNew,
        sort,
        limit,
      });

      return NextResponse.json({ success: true, products });
    }

    // 2. /api/products/[slug]
    if (route[0] === 'products' && route.length === 2) {
      const slug = route[1];
      const product = dataStore.getProductBySlug(slug);

      if (!product) {
        return NextResponse.json({ success: false, error: 'Produto não encontrado' }, { status: 404 });
      }

      const relatedProducts = dataStore.getRelatedProducts(product.categoryId, product.id, 4);

      return NextResponse.json({ success: true, product, relatedProducts });
    }

    // 3. /api/categories
    if (route[0] === 'categories') {
      const categories = dataStore.getCategories();
      return NextResponse.json({ success: true, categories });
    }

    // 4. /api/cep/[cep]
    if (route[0] === 'cep' && route.length === 2) {
      const rawCep = route[1].replace(/\D/g, '');
      if (rawCep.length !== 8) {
        return NextResponse.json({ success: false, error: 'CEP inválido' }, { status: 400 });
      }

      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        return NextResponse.json({ success: false, error: 'Erro ViaCEP' }, { status: 502 });
      }
      const data = await res.json();
      if (data.erro) {
        return NextResponse.json({ success: false, error: 'CEP não encontrado' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        address: {
          cep: data.cep,
          street: data.logradouro,
          complement: data.complemento,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          ibge: data.ibge,
          ddd: data.ddd,
        },
      });
    }

    // 5. /api/orders/[orderNumber]
    if (route[0] === 'orders' && route.length === 2) {
      const orderNumber = route[1];
      const order = dataStore.getOrderByNumber(orderNumber);
      if (!order) {
        return NextResponse.json({ success: false, error: 'Pedido não encontrado' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    // 6. /api/admin/overview
    if (route[0] === 'admin' && route[1] === 'overview') {
      const stats = dataStore.getStats();
      return NextResponse.json({
        success: true,
        stats: {
          totalRevenue: stats.totalRevenue,
          totalOrders: stats.totalOrders,
          pendingOrdersCount: stats.pendingOrdersCount,
          productsCount: stats.productsCount,
          averageTicket: stats.averageTicket,
        },
        recentOrders: stats.recentOrders,
      });
    }

    // 7. /api/admin/orders
    if (route[0] === 'admin' && route[1] === 'orders') {
      const orders = dataStore.getOrders();
      return NextResponse.json({ success: true, orders });
    }

    // 8. /api/admin/products
    if (route[0] === 'admin' && route[1] === 'products') {
      const products = dataStore.getProducts();
      return NextResponse.json({ success: true, products });
    }

    // 9. /api/admin/coupons
    if (route[0] === 'admin' && route[1] === 'coupons') {
      const coupons = dataStore.getCoupons();
      return NextResponse.json({ success: true, coupons });
    }

    // 10. /api/admin/shipping-rates
    if (route[0] === 'admin' && route[1] === 'shipping-rates') {
      const rates = dataStore.getShippingRates();
      return NextResponse.json({ success: true, rates });
    }

    // 11. /api/admin/settings
    if (route[0] === 'admin' && route[1] === 'settings') {
      const settingsMap = dataStore.getSettings();
      return NextResponse.json({ success: true, settings: settingsMap });
    }

    return NextResponse.json({ error: 'Endpoint não encontrado' }, { status: 404 });
  } catch (error: any) {
    console.error('Erro na API unificada (GET):', error);
    return NextResponse.json({ success: false, error: error.message || 'Erro interno' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { route: string[] } }
) {
  try {
    const route = params.route || [];
    const body = await request.json();

    // 1. /api/shipping/calculate
    if (route[0] === 'shipping' && route[1] === 'calculate') {
      const { cep, state, subtotal } = body;
      const cleanCep = (cep || '').replace(/\D/g, '');
      let uf = (state || '').toUpperCase();

      if (!uf && cleanCep.length === 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const cepData = await res.json();
          if (cepData && cepData.uf) uf = cepData.uf;
        } catch (e) {}
      }

      const orderSubtotal = Number(subtotal) || 0;
      const matchedRate = dataStore.getShippingRateForState(uf || 'SP') || {
        id: 'def',
        state: 'TODOS',
        name: 'Envio Padrão Nacional',
        price: 22.90,
        estimatedDays: 6,
        freeShippingMin: 250,
        isActive: true,
      };

      const isFree = matchedRate.freeShippingMin !== null && orderSubtotal >= (matchedRate.freeShippingMin || 250);
      const standardOption = {
        id: 'pac',
        name: matchedRate.name,
        service: 'PAC / Econômico',
        price: isFree ? 0 : matchedRate.price,
        originalPrice: matchedRate.price,
        isFree,
        estimatedDays: matchedRate.estimatedDays,
        estimatedLabel: `${matchedRate.estimatedDays} a ${matchedRate.estimatedDays + 2} dias úteis`,
      };
      const expressPrice = Number((matchedRate.price * 1.6).toFixed(2));
      const expressOption = {
        id: 'sedex',
        name: `SEDEX Expresso (${uf || 'BR'})`,
        service: 'SEDEX Expresso',
        price: isFree ? Math.max(9.90, expressPrice - matchedRate.price) : expressPrice,
        originalPrice: expressPrice,
        isFree: false,
        estimatedDays: Math.max(1, Math.floor(matchedRate.estimatedDays / 2)),
        estimatedLabel: `${Math.max(1, Math.floor(matchedRate.estimatedDays / 2))} a ${Math.max(2, Math.floor(matchedRate.estimatedDays / 2) + 1)} dias úteis`,
      };

      return NextResponse.json({
        success: true,
        state: uf || 'BR',
        options: [standardOption, expressOption],
        freeShippingThreshold: matchedRate.freeShippingMin || 250,
        remainingForFreeShipping: Math.max(0, (matchedRate.freeShippingMin || 250) - orderSubtotal),
      });
    }

    // 2. /api/coupons/validate
    if (route[0] === 'coupons' && route[1] === 'validate') {
      const { code, subtotal } = body;
      if (!code) return NextResponse.json({ success: false, error: 'Código obrigatório' }, { status: 400 });
      const cleanCode = code.trim().toUpperCase();
      const orderSubtotal = Number(subtotal) || 0;

      const coupon = dataStore.getCouponByCode(cleanCode);
      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ success: false, error: 'Cupom inválido ou inativo' }, { status: 400 });
      }
      if (orderSubtotal < coupon.minOrderValue) {
        return NextResponse.json(
          { success: false, error: `Valor mínimo para este cupom é de R$ ${coupon.minOrderValue.toFixed(2)}` },
          { status: 400 }
        );
      }

      const discount = coupon.discountType === 'PERCENTAGE'
        ? Number(((orderSubtotal * coupon.discountValue) / 100).toFixed(2))
        : Math.min(coupon.discountValue, orderSubtotal);

      return NextResponse.json({
        success: true,
        coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
        discount,
        message: `Cupom ${coupon.code} aplicado com sucesso! Desconto de R$ ${discount.toFixed(2)}`,
      });
    }

    // 3. /api/orders
    if (route[0] === 'orders' && route.length === 1) {
      const { customer, items, shippingOption, paymentMethod, couponCode, installments = 1 } = body;
      if (!customer || !customer.name || !customer.cpf || !validateCPF(customer.cpf)) {
        return NextResponse.json({ success: false, error: 'Dados ou CPF do cliente inválidos' }, { status: 400 });
      }

      const subtotal = items.reduce((sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
      const shippingCost = Number(shippingOption?.price) || 0;
      let discount = 0;

      if (couponCode) {
        const coupon = dataStore.getCouponByCode(couponCode.trim().toUpperCase());
        if (coupon && coupon.isActive) {
          discount = coupon.discountType === 'PERCENTAGE'
            ? Number(((subtotal * coupon.discountValue) / 100).toFixed(2))
            : Math.min(coupon.discountValue, subtotal);
        }
      }

      if (paymentMethod === 'PIX') {
        discount += Number(((subtotal - discount) * 0.05).toFixed(2));
      }
      const total = Math.max(0, Number((subtotal + shippingCost - discount).toFixed(2)));

      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const orderNumber = `BR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;

      const settingsMap = dataStore.getSettings();

      let pixQrCode = null;
      let pixCopiaECola = null;
      let boletoBarcode = null;
      let paymentStatus = 'PENDING';
      let orderStatus = 'PENDENTE';

      if (paymentMethod === 'PIX') {
        const pixData = generatePixEMVCo({
          key: settingsMap['pix_key'] || 'contato@brasilchic.com.br',
          name: settingsMap['pix_receiver_name'] || 'Brasil Chic Moda Ltda',
          city: settingsMap['pix_receiver_city'] || 'SAO PAULO',
          amount: total,
          txid: `PED${randomSuffix}`,
        });
        pixCopiaECola = pixData.copiaECola;
        pixQrCode = pixData.qrCodeUrl;
      } else if (paymentMethod === 'BOLETO') {
        boletoBarcode = `34191.09008 00000.123456 78900.123456 1 890000000${Math.round(total * 100)}`;
      } else if (paymentMethod === 'CREDIT_CARD') {
        paymentStatus = 'PAID';
        orderStatus = 'PAGO';
      }

      const order = dataStore.createOrder({
        orderNumber,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || '',
        customerCpf: customer.cpf,
        postalCode: customer.cep || '',
        street: customer.street || '',
        number: customer.number || '',
        complement: customer.complement || '',
        neighborhood: customer.neighborhood || '',
        city: customer.city || '',
        state: customer.state || '',
        shippingMethod: shippingOption?.name || 'PAC',
        shippingCost,
        discount,
        couponCode,
        subtotal,
        total,
        paymentMethod,
        paymentStatus,
        orderStatus,
        pixPayload: pixCopiaECola,
        pixQrCodeUrl: pixQrCode,
        boletoBarcode,
        installments: Number(installments) || 1,
        items,
      });

      return NextResponse.json({
        success: true,
        orderNumber: order.orderNumber,
        orderId: order.id,
        total: order.total,
        pixCopiaECola,
        pixQrCode,
        boletoBarcode,
        paymentMethod,
        orderStatus,
      });
    }

    // 4. /api/admin/login
    if (route[0] === 'admin' && route[1] === 'login') {
      const { email, password } = body;
      const admin = dataStore.findAdminByEmail(email || '');
      if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
        return NextResponse.json({ success: false, error: 'Credenciais inválidas' }, { status: 401 });
      }
      return NextResponse.json({
        success: true,
        admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      });
    }

    // 5. /api/admin/products
    if (route[0] === 'admin' && route[1] === 'products') {
      const { name, price, originalPrice, badge, categoryId, description, images = [], variants = [] } = body;
      const generatedSlug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
      const prod = dataStore.createProduct({
        name,
        slug: `${generatedSlug}-${Date.now().toString().slice(-4)}`,
        description: description || '',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        badge: badge || null,
        categoryId: categoryId || 'cat_masculino',
        images,
        variants,
      });
      return NextResponse.json({ success: true, product: prod });
    }

    // 6. /api/admin/coupons
    if (route[0] === 'admin' && route[1] === 'coupons') {
      const { code, discountType, discountValue, minOrderValue } = body;
      const c = dataStore.createCoupon({
        code: code.trim().toUpperCase(),
        discountType: discountType || 'PERCENTAGE',
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue) || 0,
      });
      return NextResponse.json({ success: true, coupon: c });
    }

    // 7. /api/admin/settings
    if (route[0] === 'admin' && route[1] === 'settings') {
      for (const [key, value] of Object.entries(body)) {
        dataStore.updateSetting(key, String(value));
      }
      return NextResponse.json({ success: true, message: 'Configurações salvas' });
    }

    return NextResponse.json({ error: 'Endpoint POST não encontrado' }, { status: 404 });
  } catch (err: any) {
    console.error('Erro na API unificada (POST):', err);
    return NextResponse.json({ success: false, error: err.message || 'Erro no processamento' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { route: string[] } }
) {
  try {
    const route = params.route || [];
    const body = await request.json();

    if (route[0] === 'admin' && route[1] === 'orders') {
      const { orderNumber, orderStatus, trackingCode } = body;
      const updated = dataStore.updateOrderStatus(orderNumber, orderStatus, trackingCode);
      return NextResponse.json({ success: true, order: updated });
    }

    return NextResponse.json({ error: 'Endpoint PUT não encontrado' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Erro na atualização' }, { status: 500 });
  }
}
