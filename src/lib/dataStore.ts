import fs from 'fs';
import path from 'path';
import * as bcrypt from 'bcryptjs';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  badge: string;
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  isActive: boolean;
}

export interface ShippingRate {
  id: string;
  state: string;
  name: string;
  price: number;
  estimatedDays: number;
  freeShippingMin: number;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpf: string;
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  shippingMethod: string;
  shippingCost: number;
  discount: number;
  couponCode?: string;
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  pixPayload?: string;
  pixQrCodeUrl?: string;
  boletoBarcode?: string;
  trackingCode?: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

export interface StoreData {
  categories: Category[];
  products: Product[];
  coupons: Coupon[];
  shippingRates: ShippingRate[];
  settings: Setting[];
  adminUsers: AdminUser[];
  orders: Order[];
}

// Initial Seed Data
const initialCategories: Category[] = [
  {
    id: "cat_masculino",
    name: "Masculino",
    slug: "masculino",
    description: "Moda masculina brasileira com estilo, conforto e versatilidade.",
    imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
  },
  {
    id: "cat_feminino",
    name: "Feminino",
    slug: "feminino",
    description: "Coleções femininas leves, elegantes e vibrantes para todas as ocasiões.",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
  },
  {
    id: "cat_infantil",
    name: "Infantil",
    slug: "infantil",
    description: "Roupas infantis confortáveis, alegres e de alta durabilidade.",
    imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80",
  },
  {
    id: "cat_calcados",
    name: "Calçados & Acessórios",
    slug: "calcados-acessorios",
    description: "Sandálias, tênis, bolsas e acessórios com a alma tropical do Brasil.",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
  },
];

const initialProducts: Product[] = [
  // MASCULINO
  {
    id: "prod_1",
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
    categoryId: "cat_masculino",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_1_1", url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", isPrimary: true, alt: "Camisa de Linho" },
      { id: "img_1_2", url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", isPrimary: false, alt: "Camisa de Linho Lateral" },
    ],
    variants: [
      { id: "var_1_1", size: "P", color: "Branco Areia", colorHex: "#F5F5DC", stock: 15, sku: "CAMI-P-BRA" },
      { id: "var_1_2", size: "M", color: "Branco Areia", colorHex: "#F5F5DC", stock: 22, sku: "CAMI-M-BRA" },
      { id: "var_1_3", size: "G", color: "Branco Areia", colorHex: "#F5F5DC", stock: 18, sku: "CAMI-G-BRA" },
      { id: "var_1_4", size: "GG", color: "Branco Areia", colorHex: "#F5F5DC", stock: 10, sku: "CAMI-GG-BRA" },
      { id: "var_1_5", size: "M", color: "Azul Marinho", colorHex: "#1E3A8A", stock: 14, sku: "CAMI-M-AZU" },
      { id: "var_1_6", size: "G", color: "Azul Marinho", colorHex: "#1E3A8A", stock: 12, sku: "CAMI-G-AZU" },
      { id: "var_1_7", size: "M", color: "Verde Oliva", colorHex: "#556B2F", stock: 8, sku: "CAMI-M-VER" },
    ],
  },
  {
    id: "prod_2",
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
    categoryId: "cat_masculino",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_2_1", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80", isPrimary: true, alt: "Camiseta Pima Preta" },
      { id: "img_2_2", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", isPrimary: false, alt: "Camiseta Pima Branca" },
    ],
    variants: [
      { id: "var_2_1", size: "P", color: "Preto Ébano", colorHex: "#111827", stock: 20, sku: "PIMA-P-PRE" },
      { id: "var_2_2", size: "M", color: "Preto Ébano", colorHex: "#111827", stock: 35, sku: "PIMA-M-PRE" },
      { id: "var_2_3", size: "G", color: "Preto Ébano", colorHex: "#111827", stock: 25, sku: "PIMA-G-PRE" },
      { id: "var_2_4", size: "GG", color: "Preto Ébano", colorHex: "#111827", stock: 15, sku: "PIMA-GG-PRE" },
      { id: "var_2_5", size: "M", color: "Branco Puro", colorHex: "#FFFFFF", stock: 30, sku: "PIMA-M-BRA" },
      { id: "var_2_6", size: "G", color: "Branco Puro", colorHex: "#FFFFFF", stock: 28, sku: "PIMA-G-BRA" },
    ],
  },
  {
    id: "prod_3",
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
    categoryId: "cat_masculino",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_3_1", url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80", isPrimary: true, alt: "Bermuda Chino Cáqui" },
    ],
    variants: [
      { id: "var_3_1", size: "P", color: "Cáqui Claro", colorHex: "#C3B091", stock: 12, sku: "BERM-P-CAQ" },
      { id: "var_3_2", size: "M", color: "Cáqui Claro", colorHex: "#C3B091", stock: 18, sku: "BERM-M-CAQ" },
      { id: "var_3_3", size: "G", color: "Cáqui Claro", colorHex: "#C3B091", stock: 16, sku: "BERM-G-CAQ" },
      { id: "var_3_4", size: "M", color: "Azul Marinho", colorHex: "#1E3A8A", stock: 14, sku: "BERM-M-AZU" },
    ],
  },
  {
    id: "prod_4",
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
    categoryId: "cat_masculino",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_4_1", url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80", isPrimary: true, alt: "Jaqueta Corta Vento" },
    ],
    variants: [
      { id: "var_4_1", size: "M", color: "Preto Fosco", colorHex: "#18181B", stock: 15, sku: "JAQU-M-PRE" },
      { id: "var_4_2", size: "G", color: "Preto Fosco", colorHex: "#18181B", stock: 20, sku: "JAQU-G-PRE" },
      { id: "var_4_3", size: "GG", color: "Preto Fosco", colorHex: "#18181B", stock: 8, sku: "JAQU-GG-PRE" },
    ],
  },
  // FEMININO
  {
    id: "prod_5",
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
    categoryId: "cat_feminino",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_5_1", url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", isPrimary: true, alt: "Vestido Midi Floral" },
      { id: "img_5_2", url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80", isPrimary: false, alt: "Vestido Midi Floral Modelo" },
    ],
    variants: [
      { id: "var_5_1", size: "P", color: "Floral Tropical", colorHex: "#E11D48", stock: 14, sku: "VEST-P-FLO" },
      { id: "var_5_2", size: "M", color: "Floral Tropical", colorHex: "#E11D48", stock: 28, sku: "VEST-M-FLO" },
      { id: "var_5_3", size: "G", color: "Floral Tropical", colorHex: "#E11D48", stock: 19, sku: "VEST-G-FLO" },
      { id: "var_5_4", size: "GG", color: "Floral Tropical", colorHex: "#E11D48", stock: 9, sku: "VEST-GG-FLO" },
    ],
  },
  {
    id: "prod_6",
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
    categoryId: "cat_feminino",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_6_1", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80", isPrimary: true, alt: "Macacão Pantalona" },
    ],
    variants: [
      { id: "var_6_1", size: "P", color: "Verde Esmeralda", colorHex: "#047857", stock: 10, sku: "MACA-P-VER" },
      { id: "var_6_2", size: "M", color: "Verde Esmeralda", colorHex: "#047857", stock: 16, sku: "MACA-M-VER" },
      { id: "var_6_3", size: "G", color: "Verde Esmeralda", colorHex: "#047857", stock: 12, sku: "MACA-G-VER" },
      { id: "var_6_4", size: "M", color: "Terracota", colorHex: "#C2410C", stock: 15, sku: "MACA-M-TER" },
    ],
  },
  {
    id: "prod_7",
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
    categoryId: "cat_feminino",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_7_1", url: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80", isPrimary: true, alt: "Calça Wide Leg" },
    ],
    variants: [
      { id: "var_7_1", size: "P", color: "Bege Areia", colorHex: "#D2B48C", stock: 15, sku: "CALC-P-BEG" },
      { id: "var_7_2", size: "M", color: "Bege Areia", colorHex: "#D2B48C", stock: 22, sku: "CALC-M-BEG" },
      { id: "var_7_3", size: "G", color: "Bege Areia", colorHex: "#D2B48C", stock: 18, sku: "CALC-G-BEG" },
      { id: "var_7_4", size: "M", color: "Preto Clássico", colorHex: "#111827", stock: 20, sku: "CALC-M-PRE" },
    ],
  },
  {
    id: "prod_8",
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
    categoryId: "cat_feminino",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_8_1", url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80", isPrimary: true, alt: "Cropped Tricot" },
    ],
    variants: [
      { id: "var_8_1", size: "P", color: "Amarelo Mostarda", colorHex: "#EAB308", stock: 18, sku: "CROP-P-AMA" },
      { id: "var_8_2", size: "M", color: "Amarelo Mostarda", colorHex: "#EAB308", stock: 24, sku: "CROP-M-AMA" },
      { id: "var_8_3", size: "G", color: "Amarelo Mostarda", colorHex: "#EAB308", stock: 12, sku: "CROP-G-AMA" },
      { id: "var_8_4", size: "M", color: "Off-White", colorHex: "#FAF9F6", stock: 20, sku: "CROP-M-OFF" },
    ],
  },
  // INFANTIL
  {
    id: "prod_9",
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
    categoryId: "cat_infantil",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_9_1", url: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80", isPrimary: true, alt: "Conjunto Infantil Menino" },
    ],
    variants: [
      { id: "var_9_1", size: "2A", color: "Azul Céu / Bege", colorHex: "#38BDF8", stock: 10, sku: "CONJ-2A-AZU" },
      { id: "var_9_2", size: "4A", color: "Azul Céu / Bege", colorHex: "#38BDF8", stock: 15, sku: "CONJ-4A-AZU" },
      { id: "var_9_3", size: "6A", color: "Azul Céu / Bege", colorHex: "#38BDF8", stock: 12, sku: "CONJ-6A-AZU" },
      { id: "var_9_4", size: "8A", color: "Azul Céu / Bege", colorHex: "#38BDF8", stock: 10, sku: "CONJ-8A-AZU" },
      { id: "var_9_5", size: "10A", color: "Azul Céu / Bege", colorHex: "#38BDF8", stock: 8, sku: "CONJ-10A-AZU" },
    ],
  },
  {
    id: "prod_10",
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
    categoryId: "cat_infantil",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_10_1", url: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80", isPrimary: true, alt: "Vestido Menina Girassol" },
    ],
    variants: [
      { id: "var_10_1", size: "2A", color: "Amarelo Floral", colorHex: "#FACC15", stock: 12, sku: "VEST-2A-AMA" },
      { id: "var_10_2", size: "4A", color: "Amarelo Floral", colorHex: "#FACC15", stock: 18, sku: "VEST-4A-AMA" },
      { id: "var_10_3", size: "6A", color: "Amarelo Floral", colorHex: "#FACC15", stock: 14, sku: "VEST-6A-AMA" },
      { id: "var_10_4", size: "8A", color: "Amarelo Floral", colorHex: "#FACC15", stock: 10, sku: "VEST-8A-AMA" },
    ],
  },
  {
    id: "prod_11",
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
    categoryId: "cat_infantil",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_11_1", url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", isPrimary: true, alt: "Macacão Bebê" },
    ],
    variants: [
      { id: "var_11_1", size: "0-3M", color: "Verde Menta", colorHex: "#A7F3D0", stock: 15, sku: "MACA-03M-VER" },
      { id: "var_11_2", size: "3-6M", color: "Verde Menta", colorHex: "#A7F3D0", stock: 20, sku: "MACA-36M-VER" },
      { id: "var_11_3", size: "6-12M", color: "Verde Menta", colorHex: "#A7F3D0", stock: 18, sku: "MACA-612M-VER" },
      { id: "var_11_4", size: "3-6M", color: "Cinza Mescla", colorHex: "#9CA3AF", stock: 15, sku: "MACA-36M-CIN" },
    ],
  },
  // CALÇADOS & ACESSÓRIOS
  {
    id: "prod_12",
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
    categoryId: "cat_calcados",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_12_1", url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", isPrimary: true, alt: "Sandália Rasteira" },
    ],
    variants: [
      { id: "var_12_1", size: "35", color: "Caramelo Natural", colorHex: "#B45309", stock: 10, sku: "SAND-35-CAR" },
      { id: "var_12_2", size: "36", color: "Caramelo Natural", colorHex: "#B45309", stock: 14, sku: "SAND-36-CAR" },
      { id: "var_12_3", size: "37", color: "Caramelo Natural", colorHex: "#B45309", stock: 16, sku: "SAND-37-CAR" },
      { id: "var_12_4", size: "38", color: "Caramelo Natural", colorHex: "#B45309", stock: 12, sku: "SAND-38-CAR" },
      { id: "var_12_5", size: "39", color: "Caramelo Natural", colorHex: "#B45309", stock: 8, sku: "SAND-39-CAR" },
    ],
  },
  {
    id: "prod_13",
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
    categoryId: "cat_calcados",
    createdAt: new Date().toISOString(),
    images: [
      { id: "img_13_1", url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80", isPrimary: true, alt: "Tênis Branco Urbano" },
    ],
    variants: [
      { id: "var_13_1", size: "38", color: "Branco Neve", colorHex: "#FFFFFF", stock: 10, sku: "TENI-38-BRA" },
      { id: "var_13_2", size: "39", color: "Branco Neve", colorHex: "#FFFFFF", stock: 15, sku: "TENI-39-BRA" },
      { id: "var_13_3", size: "40", color: "Branco Neve", colorHex: "#FFFFFF", stock: 18, sku: "TENI-40-BRA" },
      { id: "var_13_4", size: "41", color: "Branco Neve", colorHex: "#FFFFFF", stock: 14, sku: "TENI-41-BRA" },
      { id: "var_13_5", size: "42", color: "Branco Neve", colorHex: "#FFFFFF", stock: 12, sku: "TENI-42-BRA" },
    ],
  },
];

const initialCoupons: Coupon[] = [
  { id: "coup_1", code: "BEMVINDO10", discountType: "PERCENTAGE", discountValue: 10, minOrderValue: 100, isActive: true },
  { id: "coup_2", code: "BRASIL15", discountType: "PERCENTAGE", discountValue: 15, minOrderValue: 200, isActive: true },
  { id: "coup_3", code: "PRIMEIRACOMPRA", discountType: "FIXED", discountValue: 25, minOrderValue: 150, isActive: true },
];

const initialShippingRates: ShippingRate[] = [
  { id: "ship_1", state: "SP", name: "SEDEX São Paulo", price: 14.90, estimatedDays: 2, freeShippingMin: 199.00, isActive: true },
  { id: "ship_2", state: "RJ", name: "SEDEX Rio de Janeiro", price: 18.90, estimatedDays: 3, freeShippingMin: 220.00, isActive: true },
  { id: "ship_3", state: "MG", name: "PAC Minas Gerais", price: 21.90, estimatedDays: 4, freeShippingMin: 250.00, isActive: true },
  { id: "ship_4", state: "SUL", name: "PAC Região Sul (RS, SC, PR)", price: 24.90, estimatedDays: 5, freeShippingMin: 250.00, isActive: true },
  { id: "ship_5", state: "NORDESTE", name: "PAC Região Nordeste", price: 32.90, estimatedDays: 7, freeShippingMin: 299.00, isActive: true },
  { id: "ship_6", state: "CENTRO_OESTE", name: "PAC Centro-Oeste / DF", price: 28.90, estimatedDays: 5, freeShippingMin: 270.00, isActive: true },
  { id: "ship_7", state: "NORTE", name: "PAC Região Norte", price: 39.90, estimatedDays: 9, freeShippingMin: 350.00, isActive: true },
  { id: "ship_8", state: "TODOS", name: "Envio Econômico Nacional", price: 22.90, estimatedDays: 6, freeShippingMin: 250.00, isActive: true },
];

const initialSettings: Setting[] = [
  { id: "set_1", key: "store_name", value: "Brasil Chic Moda & Estilo", description: "Nome comercial da loja" },
  { id: "set_2", key: "store_cnpj", value: "45.123.789/0001-90", description: "CNPJ da empresa para notas e rodapé" },
  { id: "set_3", key: "store_phone", value: "+55 11 98765-4321", description: "WhatsApp oficial de atendimento" },
  { id: "set_4", key: "store_email", value: "contato@brasilchic.com.br", description: "E-mail de suporte ao cliente" },
  { id: "set_5", key: "store_address", value: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP, CEP 01310-200", description: "Endereço físico fiscal" },
  { id: "set_6", key: "pix_key", value: "contato@brasilchic.com.br", description: "Chave Pix oficial da loja (E-mail ou CNPJ)" },
  { id: "set_7", key: "pix_receiver_name", value: "Brasil Chic Moda Ltda", description: "Nome do favorecido da chave Pix" },
  { id: "set_8", key: "pix_receiver_city", value: "SAO PAULO", description: "Cidade cadastrada da chave Pix" },
  { id: "set_9", key: "mercadopago_public_key", value: "TEST-mp-public-brazil-fashion-demo", description: "Mercado Pago Public Key" },
  { id: "set_10", key: "mercadopago_access_token", value: "TEST-mp-access-brazil-fashion-demo", description: "Mercado Pago Access Token" },
  { id: "set_11", key: "stripe_public_key", value: "pk_test_stripe_brazil_fashion_demo", description: "Stripe Publishable Key" },
  { id: "set_12", key: "stripe_secret_key", value: "sk_test_stripe_brazil_fashion_demo", description: "Stripe Secret Key" },
];

// Pre-hashed bcrypt for "AdminPassword2026!"
const defaultAdminHash = bcrypt.hashSync("AdminPassword2026!", 10);

const initialAdminUsers: AdminUser[] = [
  {
    id: "admin_1",
    name: "Administrador da Loja",
    email: "admin@brazilfashion.com.br",
    passwordHash: defaultAdminHash,
    role: "ADMIN",
  },
];

// In-memory singleton state
let globalStore: StoreData = {
  categories: initialCategories,
  products: initialProducts,
  coupons: initialCoupons,
  shippingRates: initialShippingRates,
  settings: initialSettings,
  adminUsers: initialAdminUsers,
  orders: [],
};

// Persistence helper
function getStoreFilePath(): string {
  if (process.env.VERCEL && process.platform !== 'win32') {
    return path.join('/tmp', 'store_data.json');
  }
  return path.join(process.cwd(), 'prisma', 'store_data.json');
}

function loadPersistedStore() {
  try {
    const filePath = getStoreFilePath();
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (data && data.products && data.products.length > 0) {
        globalStore = data;
        return;
      }
    }
  } catch (err) {
    console.error("Erro ao carregar store persistido:", err);
  }
}

function saveStore() {
  try {
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(globalStore, null, 2), 'utf-8');
  } catch (err) {
    console.error("Erro ao salvar store:", err);
  }
}

// Initial load
loadPersistedStore();

export const dataStore = {
  // Categorias
  getCategories(): Category[] {
    return globalStore.categories;
  },

  getCategoryBySlug(slug: string): Category | undefined {
    return globalStore.categories.find(c => c.slug === slug);
  },

  // Produtos
  getProducts(params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    isNew?: boolean;
    sort?: string;
    limit?: number;
  }): Product[] {
    let result = [...globalStore.products];

    // Populate category on each product
    result = result.map(p => ({
      ...p,
      category: globalStore.categories.find(c => c.id === p.categoryId),
    }));

    if (params?.category && params.category !== 'todos') {
      const cat = globalStore.categories.find(c => c.slug === params.category);
      if (cat) {
        result = result.filter(p => p.categoryId === cat.id);
      }
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (params?.featured !== undefined) {
      result = result.filter(p => p.featured === params.featured);
    }

    if (params?.isNew !== undefined) {
      result = result.filter(p => p.isNew === params.isNew);
    }

    if (params?.sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (params?.sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (params?.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (params?.limit) {
      result = result.slice(0, params.limit);
    }

    return result;
  },

  getProductBySlug(slug: string): Product | undefined {
    const prod = globalStore.products.find(p => p.slug === slug);
    if (!prod) return undefined;
    return {
      ...prod,
      category: globalStore.categories.find(c => c.id === prod.categoryId),
    };
  },

  getRelatedProducts(categoryId: string, excludeId: string, limit = 4): Product[] {
    return globalStore.products
      .filter(p => p.categoryId === categoryId && p.id !== excludeId)
      .slice(0, limit)
      .map(p => ({
        ...p,
        category: globalStore.categories.find(c => c.id === p.categoryId),
      }));
  },

  createProduct(prodData: any): Product {
    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: prodData.name,
      slug: prodData.slug,
      description: prodData.description || '',
      price: Number(prodData.price),
      originalPrice: prodData.originalPrice ? Number(prodData.originalPrice) : Number(prodData.price),
      badge: prodData.badge || '',
      featured: Boolean(prodData.featured),
      isNew: Boolean(prodData.isNew),
      rating: 5.0,
      reviewCount: 1,
      categoryId: prodData.categoryId || globalStore.categories[0].id,
      images: (prodData.images || []).map((img: any, i: number) => ({
        id: `img_${Date.now()}_${i}`,
        url: typeof img === 'string' ? img : img.url,
        isPrimary: i === 0,
        alt: prodData.name,
      })),
      variants: (prodData.variants || []).map((v: any, i: number) => ({
        id: `var_${Date.now()}_${i}`,
        size: v.size || 'M',
        color: v.color || 'Padrão',
        colorHex: v.colorHex || '#111827',
        stock: Number(v.stock || 10),
        sku: `${prodData.slug.slice(0, 4).toUpperCase()}-${v.size}-${i}`,
      })),
      createdAt: new Date().toISOString(),
    };

    globalStore.products.unshift(newProd);
    saveStore();
    return newProd;
  },

  // Cupons
  getCoupons(): Coupon[] {
    return globalStore.coupons;
  },

  getCouponByCode(code: string): Coupon | undefined {
    return globalStore.coupons.find(
      c => c.code.toUpperCase() === code.toUpperCase() && c.isActive
    );
  },

  createCoupon(couponData: any): Coupon {
    const newCoupon: Coupon = {
      id: `coup_${Date.now()}`,
      code: couponData.code.toUpperCase().trim(),
      discountType: couponData.discountType,
      discountValue: Number(couponData.discountValue),
      minOrderValue: Number(couponData.minOrderValue || 0),
      isActive: Boolean(couponData.isActive ?? true),
    };
    globalStore.coupons.push(newCoupon);
    saveStore();
    return newCoupon;
  },

  // Frete
  getShippingRates(): ShippingRate[] {
    return globalStore.shippingRates;
  },

  getShippingRateForState(stateCode: string): ShippingRate | undefined {
    const upper = stateCode.toUpperCase();
    const exact = globalStore.shippingRates.find(r => r.state === upper && r.isActive);
    if (exact) return exact;

    // Regiões brasileiras
    const sul = ['RS', 'SC', 'PR'];
    const nordeste = ['BA', 'PE', 'CE', 'MA', 'PB', 'RN', 'AL', 'SE', 'PI'];
    const centroOeste = ['GO', 'MT', 'MS', 'DF'];
    const norte = ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'];

    if (sul.includes(upper)) return globalStore.shippingRates.find(r => r.state === 'SUL');
    if (nordeste.includes(upper)) return globalStore.shippingRates.find(r => r.state === 'NORDESTE');
    if (centroOeste.includes(upper)) return globalStore.shippingRates.find(r => r.state === 'CENTRO_OESTE');
    if (norte.includes(upper)) return globalStore.shippingRates.find(r => r.state === 'NORTE');

    return globalStore.shippingRates.find(r => r.state === 'TODOS');
  },

  updateShippingRate(rateData: any): ShippingRate {
    const idx = globalStore.shippingRates.findIndex(r => r.id === rateData.id || r.state === rateData.state);
    if (idx >= 0) {
      globalStore.shippingRates[idx] = { ...globalStore.shippingRates[idx], ...rateData };
      saveStore();
      return globalStore.shippingRates[idx];
    }
    const newRate: ShippingRate = {
      id: `ship_${Date.now()}`,
      state: rateData.state,
      name: rateData.name,
      price: Number(rateData.price),
      estimatedDays: Number(rateData.estimatedDays),
      freeShippingMin: Number(rateData.freeShippingMin || 250),
      isActive: true,
    };
    globalStore.shippingRates.push(newRate);
    saveStore();
    return newRate;
  },

  // Pedidos
  getOrders(): Order[] {
    return [...globalStore.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getOrderByNumber(orderNumber: string): Order | undefined {
    return globalStore.orders.find(
      o => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()
    );
  },

  createOrder(orderData: any): Order {
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      customerCpf: orderData.customerCpf,
      postalCode: orderData.postalCode,
      street: orderData.street,
      number: orderData.number,
      complement: orderData.complement,
      neighborhood: orderData.neighborhood,
      city: orderData.city,
      state: orderData.state,
      shippingMethod: orderData.shippingMethod,
      shippingCost: Number(orderData.shippingCost),
      discount: Number(orderData.discount || 0),
      couponCode: orderData.couponCode,
      subtotal: Number(orderData.subtotal),
      total: Number(orderData.total),
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus || 'PENDENTE',
      orderStatus: orderData.orderStatus || 'PENDENTE',
      pixPayload: orderData.pixPayload,
      pixQrCodeUrl: orderData.pixQrCodeUrl,
      boletoBarcode: orderData.boletoBarcode,
      trackingCode: orderData.trackingCode,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      items: (orderData.items || []).map((it: any, i: number) => ({
        id: `item_${Date.now()}_${i}`,
        orderId: `ord_${Date.now()}`,
        productId: it.productId,
        productName: it.productName,
        productImage: it.productImage || '',
        size: it.size || 'M',
        color: it.color || 'Padrão',
        price: Number(it.price),
        quantity: Number(it.quantity),
        subtotal: Number(it.subtotal || it.price * it.quantity),
      })),
    };

    globalStore.orders.unshift(newOrder);
    saveStore();
    return newOrder;
  },

  updateOrderStatus(orderNumber: string, status: string, trackingCode?: string): Order | undefined {
    const order = globalStore.orders.find(
      o => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()
    );
    if (order) {
      order.orderStatus = status;
      if (status === 'PAGO') order.paymentStatus = 'PAGO';
      if (trackingCode) order.trackingCode = trackingCode;
      saveStore();
      return order;
    }
    return undefined;
  },

  // Configurações
  getSettings(): Record<string, string> {
    return globalStore.settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  },

  updateSetting(key: string, value: string): void {
    const existing = globalStore.settings.find(s => s.key === key);
    if (existing) {
      existing.value = value;
    } else {
      globalStore.settings.push({
        id: `set_${Date.now()}`,
        key,
        value,
      });
    }
    saveStore();
  },

  // Admin User
  findAdminByEmail(email: string): AdminUser | undefined {
    return globalStore.adminUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
  },

  // Stats
  getStats() {
    const orders = globalStore.orders;
    const paidOrders = orders.filter(o => o.paymentStatus === 'PAGO' || o.orderStatus === 'PAGO');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const pendingOrdersCount = orders.filter(o => o.orderStatus === 'PENDENTE').length;
    const productsCount = globalStore.products.length;
    const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
    const recentOrders = orders.slice(0, 10);

    return {
      totalRevenue,
      totalOrders,
      pendingOrdersCount,
      productsCount,
      averageTicket,
      recentOrders,
    };
  },
};
