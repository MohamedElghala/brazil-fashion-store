"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Zap,
  Ruler,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  Loader2,
  Share2,
  Heart,
  X,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBRL, calculateInstallments, maskCEP } from '@/lib/brazil';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Seleções do cliente
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Modais
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isInstallmentsModalOpen, setIsInstallmentsModalOpen] = useState(false);

  // Simulador de Frete
  const [cepInput, setCepInput] = useState('');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingResults, setShippingResults] = useState<any[]>([]);
  const [shippingError, setShippingError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          if (data.product.images?.length > 0) {
            setSelectedImage(data.product.images[0].url);
          }
          if (data.product.variants?.length > 0) {
            setSelectedSize(data.product.variants[0].size);
            setSelectedColor(data.product.variants[0]);
          }
        }
      } catch (e) {
        console.error('Erro ao carregar detalhes:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C26D53]" />
        <p className="font-serif text-lg text-[#18181B]">Carregando peça exclusiva...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center space-y-4 bg-white border border-[#E7E2D8] rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
        <h2 className="font-serif text-2xl font-bold text-[#18181B]">Peça não encontrada</h2>
        <p className="text-xs text-[#71717A]">A peça que você procura pode ter esgotado em nossa coleção ou mudado de link.</p>
        <Link
          href="/"
          className="inline-block bg-[#18181B] hover:bg-[#C26D53] text-white font-semibold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const pixPrice = product.price * 0.95;
  const installmentOptions = calculateInstallments(product.price, 12);
  const maxInstallment = installmentOptions[installmentOptions.length - 1];

  const uniqueColors = Array.from(
    new Map(product.variants.map((v: any) => [v.color, v])).values()
  );
  const uniqueSizes = Array.from(new Set(product.variants.map((v: any) => v.size)));

  const handleAddToCart = (andCheckout = false) => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      size: selectedSize || 'M',
      color: selectedColor?.color || 'Padrão',
      colorHex: selectedColor?.colorHex || '#18181B',
      image: selectedImage || product.images[0]?.url,
      quantity,
    });

    if (andCheckout) {
      router.push('/checkout');
    } else {
      setIsCartOpen(true);
    }
  };

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cepInput.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setShippingError('Digite um CEP válido com 8 dígitos.');
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);

    try {
      const res = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cleanCep, subtotal: product.price }),
      });
      const data = await res.json();
      if (data.success && data.options) {
        setShippingResults(data.options);
      } else {
        setShippingError('Não foi possível calcular o frete para este CEP.');
      }
    } catch (err) {
      setShippingError('Erro ao consultar frete.');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#71717A]">
        <Link href="/" className="hover:text-[#18181B] transition">
          Início
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6CEC1]" />
        <Link
          href={`/categoria/${product.category.slug}`}
          className="hover:text-[#C26D53] transition uppercase font-medium text-[#71717A]"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6CEC1]" />
        <span className="text-[#18181B] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Grid Principal do Produto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Galeria de Fotos */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F5F2EB] border border-[#E7E2D8] shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover transition duration-700 hover:scale-105"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#18181B] text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full shadow-md">
                {product.badge}
              </span>
            )}
            <span className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-[#2C4A3E] text-[10px] font-bold px-2.5 py-1 rounded shadow-sm">
              5% OFF no Pix
            </span>
          </div>

          {/* Miniaturas */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                    selectedImage === img.url
                      ? 'border-[#C26D53] ring-1 ring-[#C26D53]'
                      : 'border-[#E7E2D8] hover:border-[#D6CEC1] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações da Peça & Compra */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-medium text-[#C26D53] tracking-widest block">
              {product.category.name} • Coleção Resort
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181B] leading-tight">
              {product.name}
            </h1>

            {/* Avaliações */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-[#B45309]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[#B45309]" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#18181B]">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-[#71717A] font-light">
                ({product.reviewCount} avaliações de clientes verificados)
              </span>
            </div>
          </div>

          {/* Preços e Condições de Pagamento */}
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#18181B]">
                {formatBRL(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[#A1A1AA] line-through">
                  {formatBRL(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Caixa Pix */}
            <div className="bg-[#EBF3ED] border border-[#CDE0D3] rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-[#2C4A3E] fill-current flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#2C4A3E]">
                    {formatBRL(pixPrice)} no Pix à vista (5% OFF)
                  </div>
                  <div className="text-[11px] text-[#52525B]">
                    Aprovação imediata e envio prioritário
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-[#2C4A3E] text-white font-semibold px-2 py-0.5 rounded">
                ECONOMIZE
              </span>
            </div>

            {/* Parcelamento no Cartão */}
            <div className="flex items-center justify-between text-xs text-[#52525B] pt-1">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#71717A]" />
                ou em até <strong className="text-[#18181B] font-semibold">{maxInstallment?.label}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsInstallmentsModalOpen(true)}
                className="text-[#C26D53] hover:underline text-[11px] font-semibold"
              >
                Ver parcelas
              </button>
            </div>
          </div>

          {/* Seleção de Cores */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#71717A]">
                Cor selecionada: <strong className="text-[#18181B] font-semibold">{selectedColor?.color}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {uniqueColors.map((col: any) => (
                <button
                  key={col.color}
                  onClick={() => setSelectedColor(col)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs transition ${
                    selectedColor?.color === col.color
                      ? 'border-[#18181B] bg-white text-[#18181B] shadow-sm font-semibold'
                      : 'border-[#E7E2D8] bg-[#F5F2EB] text-[#71717A] hover:border-[#D6CEC1]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: col.colorHex }}
                  />
                  <span>{col.color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de Tamanhos e Guia de Medidas */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#71717A]">
                Tamanho: <strong className="text-[#18181B] font-semibold">{selectedSize}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="flex items-center gap-1 text-[#C26D53] hover:underline text-[11px] font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Tabela de Medidas</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {uniqueSizes.map((sz: any) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-12 h-11 rounded-xl text-xs font-semibold transition border flex items-center justify-center ${
                    selectedSize === sz
                      ? 'bg-[#18181B] text-white border-[#18181B] shadow-md'
                      : 'bg-white text-[#18181B] border-[#E7E2D8] hover:border-[#18181B]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade e Botões de Compra */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#E7E2D8] rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#71717A] hover:text-[#18181B] transition"
                  aria-label="Diminuir"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-semibold text-[#18181B] min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#71717A] hover:text-[#18181B] transition"
                  aria-label="Aumentar"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(false)}
                className="flex-1 bg-white hover:bg-[#FAF8F5] text-[#18181B] font-semibold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#18181B] transition active:scale-95 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-[#C26D53]" />
                <span>Adicionar à Sacola</span>
              </button>
            </div>

            <button
              onClick={() => handleAddToCart(true)}
              className="w-full bg-[#18181B] hover:bg-[#C26D53] text-white font-semibold py-4 px-6 rounded-full text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition duration-300 transform active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Comprar Agora (Checkout Expresso)</span>
            </button>
          </div>

          {/* Simulador de Frete por CEP */}
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#18181B]">
              <Truck className="w-4 h-4 text-[#C26D53]" />
              <span>Calcular Frete e Prazo de Entrega</span>
            </div>

            <form onSubmit={handleCalculateShipping} className="flex gap-2">
              <input
                type="text"
                placeholder="Digite seu CEP (ex: 01310-200)"
                value={cepInput}
                onChange={(e) => setCepInput(maskCEP(e.target.value))}
                maxLength={9}
                className="flex-1 bg-[#F5F2EB] border border-[#E7E2D8] text-xs rounded-xl px-3 py-2.5 text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:border-[#C26D53]"
              />
              <button
                type="submit"
                disabled={isCalculatingShipping || cepInput.replace(/\D/g, '').length !== 8}
                className="bg-[#18181B] hover:bg-[#C26D53] text-white font-semibold px-4 py-2.5 rounded-xl text-xs disabled:opacity-50 transition"
              >
                {isCalculatingShipping ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Calcular'}
              </button>
            </form>

            {shippingError && (
              <p className="text-xs text-red-600">{shippingError}</p>
            )}

            {shippingResults.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#F5F2EB]">
                {shippingResults.map((opt: any) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between text-xs bg-[#FBF9F5] p-2.5 rounded-xl border border-[#E7E2D8]"
                  >
                    <div>
                      <span className="font-semibold text-[#18181B] block">{opt.service}</span>
                      <span className="text-[11px] text-[#71717A]">{opt.estimatedLabel}</span>
                    </div>
                    <span className="font-bold text-[#2C4A3E] text-sm">
                      {opt.isFree ? 'GRÁTIS' : formatBRL(opt.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vantagens e Garantias */}
          <div className="grid grid-cols-2 gap-3 text-xs text-[#52525B] pt-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#C26D53] flex-shrink-0" />
              <span>Troca grátis em até 7 dias corridos</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C26D53] flex-shrink-0" />
              <span>Garantia de 30 dias de fábrica</span>
            </div>
          </div>
        </div>
      </div>

      {/* Abas de Detalhes da Peça */}
      <div className="bg-white border border-[#E7E2D8] rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
        <h3 className="font-serif text-2xl font-bold text-[#18181B]">Detalhes & Composição de Alta Costura</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#52525B]">
          <div className="space-y-2">
            <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#C26D53]">
              Descrição da Peça
            </h4>
            <p className="leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#C26D53]">
              Composição & Tecido
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-[#71717A]">
              <li>Fibras 100% nobres selecionadas (linho e algodão nobre)</li>
              <li>Toque macio com sensação térmica refrescante no clima brasileiro</li>
              <li>Modelagem pré-lavada e pré-encolhida (não deforma)</li>
              <li>Costuras reforçadas em alfaiataria fina</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#C26D53]">
              Cuidados de Preservação
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-[#71717A]">
              <li>Lavar à mão ou em ciclo suave para tecidos finos</li>
              <li>Não utilizar alvejantes ou compostos clorados</li>
              <li>Secagem natural à sombra recomendada</li>
              <li>Passar a ferro suave em temperatura média</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Tabela de Medidas (Size Guide) */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FBF9F5] border border-[#E7E2D8] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#C26D53]" />
                <h3 className="font-serif text-lg font-bold text-[#18181B]">Tabela de Medidas (cm)</h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-[#71717A] hover:text-[#18181B] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#71717A] leading-relaxed">
              Consulte a tabela abaixo para escolher o tamanho ideal de acordo com as medidas do seu corpo:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F5F2EB] text-[#18181B]">
                  <tr>
                    <th className="p-2.5 rounded-l-lg font-semibold">Tamanho</th>
                    <th className="p-2.5 font-semibold">Tórax / Busto</th>
                    <th className="p-2.5 font-semibold">Cintura</th>
                    <th className="p-2.5 rounded-r-lg font-semibold">Quadril</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E2D8] text-[#52525B]">
                  <tr>
                    <td className="p-2.5 font-bold text-[#18181B]">P (36-38)</td>
                    <td className="p-2.5">88 - 94 cm</td>
                    <td className="p-2.5">74 - 80 cm</td>
                    <td className="p-2.5">92 - 98 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#18181B]">M (40-42)</td>
                    <td className="p-2.5">95 - 102 cm</td>
                    <td className="p-2.5">81 - 88 cm</td>
                    <td className="p-2.5">99 - 106 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#18181B]">G (44-46)</td>
                    <td className="p-2.5">103 - 110 cm</td>
                    <td className="p-2.5">89 - 96 cm</td>
                    <td className="p-2.5">107 - 114 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#18181B]">GG (48-50)</td>
                    <td className="p-2.5">111 - 118 cm</td>
                    <td className="p-2.5">97 - 104 cm</td>
                    <td className="p-2.5">115 - 122 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-[#E7E2D8] text-right">
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="bg-[#18181B] text-white font-semibold px-5 py-2.5 rounded-full text-xs hover:bg-[#C26D53] transition"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Parcelamento Completo */}
      {isInstallmentsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FBF9F5] border border-[#E7E2D8] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C26D53]" />
                <h3 className="font-serif text-lg font-bold text-[#18181B]">Opções de Parcelamento</h3>
              </div>
              <button
                onClick={() => setIsInstallmentsModalOpen(false)}
                className="text-[#71717A] hover:text-[#18181B] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#71717A]">
              Parcelamento no cartão de crédito em até 12x sem juros:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 divide-y divide-[#E7E2D8] text-xs">
              {installmentOptions.map((opt) => (
                <div key={opt.installments} className="flex justify-between py-2 text-[#52525B]">
                  <span>{opt.installments}x de {formatBRL(opt.installmentValue)}</span>
                  <span className="text-[#2C4A3E] font-semibold">sem juros</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E7E2D8] text-right">
              <button
                onClick={() => setIsInstallmentsModalOpen(false)}
                className="bg-[#18181B] hover:bg-[#C26D53] text-white font-semibold px-5 py-2.5 rounded-full text-xs transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 border-t border-[#E7E2D8] pt-12">
          <h2 className="font-serif text-2xl font-bold text-[#18181B]">
            Você Também Pode Gostar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rel: any) => (
              <Link
                key={rel.id}
                href={`/produto/${rel.slug}`}
                className="bg-white border border-[#E7E2D8] rounded-2xl overflow-hidden hover:border-[#C26D53] transition-all group flex flex-col justify-between p-3.5 shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F2EB] mb-3">
                  <img
                    src={rel.images[0]?.url}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-semibold text-[#18181B] line-clamp-1">{rel.name}</h4>
                  <div className="text-xs font-bold text-[#18181B] mt-1">
                    {formatBRL(rel.price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
