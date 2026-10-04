import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed do banco de dados...");

  // Limpar tabelas existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.shippingRate.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.setting.deleteMany();

  // 1. Criar Categorias
  const catMasculino = await prisma.category.create({
    data: {
      name: "Masculino",
      slug: "masculino",
      description: "Moda masculina brasileira com estilo, conforto e versatilidade.",
      imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
    },
  });

  const catFeminino = await prisma.category.create({
    data: {
      name: "Feminino",
      slug: "feminino",
      description: "Coleções femininas leves, elegantes e vibrantes para todas as ocasiões.",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    },
  });

  const catInfantil = await prisma.category.create({
    data: {
      name: "Infantil",
      slug: "infantil",
      description: "Roupas infantis confortáveis, alegres e de alta durabilidade.",
      imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80",
    },
  });

  const catCalcados = await prisma.category.create({
    data: {
      name: "Calçados & Acessórios",
      slug: "calcados-acessorios",
      description: "Sandálias, tênis, bolsas e acessórios com a alma tropical do Brasil.",
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    },
  });

  // 2. Criar Produtos com Variações
  const productsData = [
    // MASCULINO
    {
      name: "Camisa de Linho Manga Curta Tropical",
      slug: "camisa-linho-manga-curta-tropical",
      description: "Camisa confeccionada em 100% linho puro, ideal para o clima tropical brasileiro. Corte impecável, respirável e extremamente confortável.",
      price: 159.90,
      originalPrice: 199.90,
      badge: "Mais Vendido",
      featured: true,
      isNew: false,
      rating: 4.9,
      reviewCount: 38,
      categoryId: catMasculino.id,
      images: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
      ],
      variants: [
        { size: "P", color: "Branco Areia", colorHex: "#F5F5DC", stock: 15 },
        { size: "M", color: "Branco Areia", colorHex: "#F5F5DC", stock: 22 },
        { size: "G", color: "Branco Areia", colorHex: "#F5F5DC", stock: 18 },
        { size: "GG", color: "Branco Areia", colorHex: "#F5F5DC", stock: 10 },
        { size: "M", color: "Azul Marinho", colorHex: "#1E3A8A", stock: 14 },
        { size: "G", color: "Azul Marinho", colorHex: "#1E3A8A", stock: 12 },
        { size: "M", color: "Verde Oliva", colorHex: "#556B2F", stock: 8 },
      ],
    },
    {
      name: "Camiseta Pima Cotton Premium",
      slug: "camiseta-pima-cotton-premium",
      description: "A maciez lendária do algodão pima peruano em uma camiseta de caimento impecável. Não deforma e não perde o brilho após lavagens.",
      price: 89.90,
      originalPrice: 119.90,
      badge: "Destaque",
      featured: true,
      isNew: true,
      rating: 5.0,
      reviewCount: 52,
      categoryId: catMasculino.id,
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      ],
      variants: [
        { size: "P", color: "Preto Ébano", colorHex: "#111827", stock: 20 },
        { size: "M", color: "Preto Ébano", colorHex: "#111827", stock: 35 },
        { size: "G", color: "Preto Ébano", colorHex: "#111827", stock: 25 },
        { size: "GG", color: "Preto Ébano", colorHex: "#111827", stock: 15 },
        { size: "M", color: "Branco Puro", colorHex: "#FFFFFF", stock: 30 },
        { size: "G", color: "Branco Puro", colorHex: "#FFFFFF", stock: 28 },
      ],
    },
    {
      name: "Bermuda Sarja Chino Flex Confort",
      slug: "bermuda-sarja-chino-flex-confort",
      description: "Bermuda chino em algodão com elastano. Bolsos faca funcionais, fechamento por zíper e botão de madrepérola. Perfeita para fins de semana e passeios.",
      price: 129.90,
      originalPrice: 159.90,
      badge: "-20% OFF",
      featured: false,
      isNew: false,
      rating: 4.8,
      reviewCount: 24,
      categoryId: catMasculino.id,
      images: [
        "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
      ],
      variants: [
        { size: "P", color: "Cáqui Claro", colorHex: "#C3B091", stock: 12 },
        { size: "M", color: "Cáqui Claro", colorHex: "#C3B091", stock: 18 },
        { size: "G", color: "Cáqui Claro", colorHex: "#C3B091", stock: 16 },
        { size: "M", color: "Azul Marinho", colorHex: "#1E3A8A", stock: 14 },
      ],
    },
    {
      name: "Jaqueta Corta-Vento Street Rio",
      slug: "jaqueta-corta-vento-street-rio",
      description: "Corta-vento ultraleve resistente à água, perfeito para treinos ao ar livre e passeios noturnos. Capuz ajustável e bolsos com zíper vedado.",
      price: 219.90,
      originalPrice: 269.90,
      badge: "Novo",
      featured: true,
      isNew: true,
      rating: 4.9,
      reviewCount: 19,
      categoryId: catMasculino.id,
      images: [
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
      ],
      variants: [
        { size: "M", color: "Preto Fosco", colorHex: "#18181B", stock: 15 },
        { size: "G", color: "Preto Fosco", colorHex: "#18181B", stock: 20 },
        { size: "GG", color: "Preto Fosco", colorHex: "#18181B", stock: 8 },
      ],
    },

    // FEMININO
    {
      name: "Vestido Midi Floral Frescor Carioca",
      slug: "vestido-midi-floral-frescor-carioca",
      description: "Vestido fluido com estampa botânica tropical exclusiva. Decote suave em V com alças reguláveis e fenda lateral sutil. Tecido leve que valoriza o movimento.",
      price: 199.90,
      originalPrice: 249.90,
      badge: "Mais Vendido",
      featured: true,
      isNew: false,
      rating: 5.0,
      reviewCount: 64,
      categoryId: catFeminino.id,
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
      ],
      variants: [
        { size: "P", color: "Floral Tropical", colorHex: "#E11D48", stock: 14 },
        { size: "M", color: "Floral Tropical", colorHex: "#E11D48", stock: 28 },
        { size: "G", color: "Floral Tropical", colorHex: "#E11D48", stock: 19 },
        { size: "GG", color: "Floral Tropical", colorHex: "#E11D48", stock: 9 },
      ],
    },
    {
      name: "Macacão Pantalona Linho Elegance",
      slug: "macacao-pantalona-linho-elegance",
      description: "Macacão confeccionado em viscolinho premium com faixa para amarração na cintura. Perfeito para eventos especiais, jantares e passeios à beira-mar.",
      price: 249.90,
      originalPrice: 299.90,
      badge: "Elegance",
      featured: true,
      isNew: true,
      rating: 4.9,
      reviewCount: 29,
      categoryId: catFeminino.id,
      images: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
      ],
      variants: [
        { size: "P", color: "Verde Esmeralda", colorHex: "#047857", stock: 10 },
        { size: "M", color: "Verde Esmeralda", colorHex: "#047857", stock: 16 },
        { size: "G", color: "Verde Esmeralda", colorHex: "#047857", stock: 12 },
        { size: "M", color: "Terracota", colorHex: "#C2410C", stock: 15 },
      ],
    },
    {
      name: "Calça Alfaiataria Wide Leg Confort",
      slug: "calca-alfaiataria-wide-leg-confort",
      description: "Calça wide leg com caimento estruturado e toque suave. Cintura alta, passantes para cinto e bolsos funcionais. Combina elegância e frescor.",
      price: 179.90,
      originalPrice: 219.90,
      badge: "Tendência",
      featured: false,
      isNew: true,
      rating: 4.8,
      reviewCount: 33,
      categoryId: catFeminino.id,
      images: [
        "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80",
      ],
      variants: [
        { size: "P", color: "Bege Areia", colorHex: "#D2B48C", stock: 15 },
        { size: "M", color: "Bege Areia", colorHex: "#D2B48C", stock: 22 },
        { size: "G", color: "Bege Areia", colorHex: "#D2B48C", stock: 18 },
        { size: "M", color: "Preto Clássico", colorHex: "#111827", stock: 20 },
      ],
    },
    {
      name: "Cropped Tricot Trançado Solar",
      slug: "cropped-tricot-trancado-solar",
      description: "Top cropped em tricot leve com ponto trançado artesanal. Fresco, moderno e ideal para compor looks com calças ou saias de cintura alta.",
      price: 89.90,
      originalPrice: 119.90,
      badge: "-25% OFF",
      featured: true,
      isNew: false,
      rating: 4.7,
      reviewCount: 41,
      categoryId: catFeminino.id,
      images: [
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
      ],
      variants: [
        { size: "P", color: "Amarelo Mostarda", colorHex: "#EAB308", stock: 18 },
        { size: "M", color: "Amarelo Mostarda", colorHex: "#EAB308", stock: 24 },
        { size: "G", color: "Amarelo Mostarda", colorHex: "#EAB308", stock: 12 },
        { size: "M", color: "Off-White", colorHex: "#FAF9F6", stock: 20 },
      ],
    },

    // INFANTIL
    {
      name: "Conjunto Menino Camiseta Algodão + Bermuda Linho",
      slug: "conjunto-menino-camiseta-bermuda",
      description: "Conjunto infantil masculino confeccionado em algodão antialérgico respirável com bermuda em linho com cós elástico. Conforto total para brincar com estilo.",
      price: 109.90,
      originalPrice: 139.90,
      badge: "Mais Vendido",
      featured: true,
      isNew: false,
      rating: 4.9,
      reviewCount: 45,
      categoryId: catInfantil.id,
      images: [
        "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80",
      ],
      variants: [
        { size: "2A", color: "Azul Céu / Bege", colorHex: "#38BDF8", stock: 10 },
        { size: "4A", color: "Azul Céu / Bege", colorHex: "#38BDF8", stock: 15 },
        { size: "6A", color: "Azul Céu / Bege", colorHex: "#38BDF8", stock: 12 },
        { size: "8A", color: "Azul Céu / Bege", colorHex: "#38BDF8", stock: 10 },
        { size: "10A", color: "Azul Céu / Bege", colorHex: "#38BDF8", stock: 8 },
      ],
    },
    {
      name: "Vestido Menina Algodão Girassol",
      slug: "vestido-menina-algodao-girassol",
      description: "Vestidinho leve com estampa delicada de girassóis e acabamento em babados nos ombros. 100% algodão super macio que não irrita a pele infantil.",
      price: 89.90,
      originalPrice: 119.90,
      badge: "Novo",
      featured: true,
      isNew: true,
      rating: 5.0,
      reviewCount: 36,
      categoryId: catInfantil.id,
      images: [
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80",
      ],
      variants: [
        { size: "2A", color: "Amarelo Floral", colorHex: "#FACC15", stock: 12 },
        { size: "4A", color: "Amarelo Floral", colorHex: "#FACC15", stock: 18 },
        { size: "6A", color: "Amarelo Floral", colorHex: "#FACC15", stock: 14 },
        { size: "8A", color: "Amarelo Floral", colorHex: "#FACC15", stock: 10 },
      ],
    },
    {
      name: "Macacão Bebê Algodão Confortável",
      slug: "macacao-bebe-algodao-confortavel",
      description: "Macacão unissex com botões de pressão na parte inferior para facilitar a troca de fraldas. Tecido canelado elástico de alta suavidade.",
      price: 69.90,
      originalPrice: 89.90,
      badge: "Essencial",
      featured: false,
      isNew: false,
      rating: 4.9,
      reviewCount: 50,
      categoryId: catInfantil.id,
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
      ],
      variants: [
        { size: "0-3M", color: "Verde Menta", colorHex: "#A7F3D0", stock: 15 },
        { size: "3-6M", color: "Verde Menta", colorHex: "#A7F3D0", stock: 20 },
        { size: "6-12M", color: "Verde Menta", colorHex: "#A7F3D0", stock: 18 },
        { size: "3-6M", color: "Cinza Mescla", colorHex: "#9CA3AF", stock: 15 },
      ],
    },

    // CALÇADOS & ACESSÓRIOS
    {
      name: "Sandália Rasteira Couro Tropical",
      slug: "sandalia-rasteira-couro-tropical",
      description: "Rasteira feita à mão em couro legítimo macio com detalhe em nós delicados. Solado antiderrapante e palmilha acolchoada para máxima leveza.",
      price: 139.90,
      originalPrice: 169.90,
      badge: "Artesanal",
      featured: true,
      isNew: false,
      rating: 4.8,
      reviewCount: 27,
      categoryId: catCalcados.id,
      images: [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
      ],
      variants: [
        { size: "35", color: "Caramelo Natural", colorHex: "#B45309", stock: 10 },
        { size: "36", color: "Caramelo Natural", colorHex: "#B45309", stock: 14 },
        { size: "37", color: "Caramelo Natural", colorHex: "#B45309", stock: 16 },
        { size: "38", color: "Caramelo Natural", colorHex: "#B45309", stock: 12 },
        { size: "39", color: "Caramelo Natural", colorHex: "#B45309", stock: 8 },
      ],
    },
    {
      name: "Tênis Casual Urbano Branco Rio",
      slug: "tenis-casual-urbano-branco-rio",
      description: "Tênis unissex em lona premium reforçada com detalhes em couro sintético e sola vulcanizada. Combina perfeitamente com bermuda, jeans ou vestidos.",
      price: 219.90,
      originalPrice: 259.90,
      badge: "Coringa",
      featured: true,
      isNew: true,
      rating: 4.9,
      reviewCount: 42,
      categoryId: catCalcados.id,
      images: [
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
      ],
      variants: [
        { size: "38", color: "Branco Neve", colorHex: "#FFFFFF", stock: 10 },
        { size: "39", color: "Branco Neve", colorHex: "#FFFFFF", stock: 15 },
        { size: "40", color: "Branco Neve", colorHex: "#FFFFFF", stock: 18 },
        { size: "41", color: "Branco Neve", colorHex: "#FFFFFF", stock: 14 },
        { size: "42", color: "Branco Neve", colorHex: "#FFFFFF", stock: 12 },
      ],
    },
  ];

  for (const prod of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice,
        badge: prod.badge,
        featured: prod.featured,
        isNew: prod.isNew,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        categoryId: prod.categoryId,
        images: {
          create: prod.images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            alt: prod.name,
          })),
        },
        variants: {
          create: prod.variants.map((v) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            stock: v.stock,
            sku: `${prod.slug.slice(0, 4).toUpperCase()}-${v.size}-${v.color.slice(0, 3).toUpperCase()}`,
          })),
        },
      },
    });
    console.log(`Produto criado: ${createdProduct.name}`);
  }

  // 3. Criar Cupons de Desconto Brasileiros
  await prisma.coupon.createMany({
    data: [
      {
        code: "BEMVINDO10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 100,
        isActive: true,
      },
      {
        code: "BRASIL15",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minOrderValue: 200,
        isActive: true,
      },
      {
        code: "PRIMEIRACOMPRA",
        discountType: "FIXED",
        discountValue: 25,
        minOrderValue: 150,
        isActive: true,
      },
    ],
  });
  console.log("Cupons criados com sucesso.");

  // 4. Criar Tabela de Frete Nacional (Estados e Regiões)
  await prisma.shippingRate.createMany({
    data: [
      { state: "SP", name: "SEDEX São Paulo", price: 14.90, estimatedDays: 2, freeShippingMin: 199.00, isActive: true },
      { state: "RJ", name: "SEDEX Rio de Janeiro", price: 18.90, estimatedDays: 3, freeShippingMin: 220.00, isActive: true },
      { state: "MG", name: "PAC Minas Gerais", price: 21.90, estimatedDays: 4, freeShippingMin: 250.00, isActive: true },
      { state: "SUL", name: "PAC Região Sul (RS, SC, PR)", price: 24.90, estimatedDays: 5, freeShippingMin: 250.00, isActive: true },
      { state: "NORDESTE", name: "PAC Região Nordeste", price: 32.90, estimatedDays: 7, freeShippingMin: 299.00, isActive: true },
      { state: "CENTRO_OESTE", name: "PAC Centro-Oeste / DF", price: 28.90, estimatedDays: 5, freeShippingMin: 270.00, isActive: true },
      { state: "NORTE", name: "PAC Região Norte", price: 39.90, estimatedDays: 9, freeShippingMin: 350.00, isActive: true },
      { state: "TODOS", name: "Envio Econômico Nacional", price: 22.90, estimatedDays: 6, freeShippingMin: 250.00, isActive: true },
    ],
  });
  console.log("Tabela de fretes criada.");

  // 5. Criar Usuário Administrador
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("AdminPassword2026!", salt);

  await prisma.adminUser.create({
    data: {
      name: "Administrador da Loja",
      email: "admin@brazilfashion.com.br",
      passwordHash: passwordHash,
      role: "ADMIN",
    },
  });
  console.log("Usuário Admin criado: admin@brazilfashion.com.br / AdminPassword2026!");

  // 6. Criar Configurações da Loja
  const settingsList = [
    { key: "store_name", value: "Brasil Chic Moda & Estilo", description: "Nome comercial da loja" },
    { key: "store_cnpj", value: "45.123.789/0001-90", description: "CNPJ da empresa para notas e rodapé" },
    { key: "store_phone", value: "+55 11 98765-4321", description: "WhatsApp oficial de atendimento" },
    { key: "store_email", value: "contato@brasilchic.com.br", description: "E-mail de suporte ao cliente" },
    { key: "store_address", value: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP, CEP 01310-200", description: "Endereço físico fiscal" },
    { key: "pix_key", value: "contato@brasilchic.com.br", description: "Chave Pix oficial da loja (E-mail ou CNPJ)" },
    { key: "pix_receiver_name", value: "Brasil Chic Moda Ltda", description: "Nome do favorecido da chave Pix" },
    { key: "pix_receiver_city", value: "SAO PAULO", description: "Cidade cadastrada da chave Pix" },
    { key: "mercadopago_public_key", value: "TEST-mp-public-brazil-fashion-demo", description: "Mercado Pago Public Key" },
    { key: "mercadopago_access_token", value: "TEST-mp-access-brazil-fashion-demo", description: "Mercado Pago Access Token" },
    { key: "stripe_public_key", value: "pk_test_stripe_brazil_fashion_demo", description: "Stripe Publishable Key" },
    { key: "stripe_secret_key", value: "sk_test_stripe_brazil_fashion_demo", description: "Stripe Secret Key" },
  ];

  for (const s of settingsList) {
    await prisma.setting.create({
      data: s,
    });
  }
  console.log("Configurações da loja salvas com sucesso.");
  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
