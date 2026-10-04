"use client";

export const dynamic = 'force-static';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  ShoppingBag,
  ArrowRight,
  Filter,
  Check,
  Eye,
  Percent,
  Heart,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBRL, calculateInstallments } from '@/lib/brazil';
import FabricCanvas from '@/components/FabricCanvas';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: { url: string; isPrimary: boolean }[];
  variants: { size: string; color: string; colorHex: string; stock: number }[];
}

function HomeContent() {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get('search') || '';

  const { addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedSize, setSelectedSize] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [searchFilter, setSearchFilter] = useState(searchParam);

  // Seleção de variante por produto no card rápido
  const [selections, setSelections] = useState<{
    [productId: string]: { size: string; color: string; colorHex: string };
  }>({});

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
          // Inicializar seleções padrões
          const initialMap: Record<string, { size: string; color: string; colorHex: string }> = {};
          data.products.forEach((p: Product) => {
            const firstVariant = p.variants[0];
            if (firstVariant) {
              initialMap[p.id] = {
                size: firstVariant.size,
                color: firstVariant.color,
                colorHex: firstVariant.colorHex,
              };
            }
          });
          setSelections(initialMap);
        }
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    setSearchFilter(searchParam);
  }, [searchParam]);

  const handleSelectVariant = (
    productId: string,
    size: string,
    color: string,
    colorHex: string
  ) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: { size, color, colorHex },
    }));
  };

  const handleAddToCart = (product: Product) => {
    const sel = selections[product.id] || {
      size: product.variants[0]?.size || 'M',
      color: product.variants[0]?.color || 'Padrão',
      colorHex: product.variants[0]?.colorHex || '#18181B',
    };

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      size: sel.size,
      color: sel.color,
      colorHex: sel.colorHex,
      image: product.images[0]?.url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    });

    setIsCartOpen(true);
  };

  // Filtragem e ordenação
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'todos' || p.category.slug === selectedCategory;

    const matchSize =
      selectedSize === 'todos' ||
      p.variants.some((v) => v.size.toLowerCase() === selectedSize.toLowerCase());

    const matchSearch =
      !searchFilter ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.name.toLowerCase().includes(searchFilter.toLowerCase());

    return matchCategory && matchSize && matchSearch;
  });

  filteredProducts.sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewCount - a.reviewCount;
  });

  const categoriesTabs = [
    { label: 'Todos os Produtos', slug: 'todos' },
    { label: 'Masculino', slug: 'masculino' },
    { label: 'Feminino', slug: 'feminino' },
    { label: 'Infantil & Kids', slug: 'infantil' },
    { label: 'Calçados & Acessórios', slug: 'calcados-acessorios' },
  ];

  const sizeFilters = ['todos', 'P', 'M', 'G', 'GG', '2A', '4A', '6A', '8A', '37', '38', '39', '40', '41'];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. DIDONE MULTIPLY HERO (Prompt #2 & #5 Hybrid Masterpiece) */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] bg-[#F5F2EB] border-b border-[#E7E2D8] flex flex-col justify-between overflow-hidden">
        {/* Animated Fabric Canvas Background */}
        <FabricCanvas
          className="opacity-60"
          lineColor="rgba(24, 24, 27, 0.05)"
          accentColor="rgba(194, 109, 83, 0.18)"
          density={26}
        />

        {/* Top Meta Strap */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#71717A]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C26D53] animate-pulse"></span>
            <span>COLEÇÃO RESORT 2026</span>
          </span>
          <span className="hidden sm:inline">ALFAIATARIA BRASILEIRA • 100% LINHO PURO</span>
          <span className="text-[#C26D53] font-semibold">ED. LIMITADA</span>
        </div>

        {/* Massive Multiply Blended Hero Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1">
          {/* Left: Didone Typography & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#E7E2D8] text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C26D53]">
              <Sparkles className="w-3.5 h-3.5 text-[#C26D53]" />
              <span>Design Autoral Brasileiro</span>
            </div>

            {/* Poster Scale Didone Typography */}
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-[#18181B] leading-[0.92] tracking-[-0.04em] font-normal">
              A elegância <br />
              <span className="italic font-light text-[#C26D53]">solar</span> do linho.
            </h1>

            <p className="text-[#52525B] text-sm sm:text-base leading-relaxed max-w-lg font-light pt-2">
              Tecidos nobres pensados para a brisa e o sol. O frescor do <strong className="text-[#18181B] font-medium">100% linho puro</strong> entrelaçado ao toque aveludado do <strong className="text-[#18181B] font-medium">algodão pima</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/categoria/feminino"
                data-cursor-text="VER"
                className="bg-[#18181B] hover:bg-[#27272A] text-white px-8 py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-md hover:shadow-xl flex items-center gap-2 group"
              >
                <span>Coleção Feminina</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/categoria/masculino"
                data-cursor-text="VER"
                className="bg-white/80 hover:bg-white text-[#18181B] border border-[#18181B] px-8 py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-sm"
              >
                <span>Coleção Masculina</span>
              </Link>
            </div>
          </div>

          {/* Right: Multiply Blended Photography (Prompt #2 Feature) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[40px] overflow-hidden border border-[#E7E2D8] shadow-2xl bg-[#EBE7DE] group">
              {/* Product Photograph in Multiply Blend Mode */}
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85"
                alt="Moda Solar Brasileira"
                className="w-full h-full object-cover object-top blend-multiply editorial-img-transition"
              />

              {/* Float Glass Badge */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E7E2D8] shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#71717A] block">
                    PEÇA PRINCIPAL • RESORT
                  </span>
                  <p className="font-serif text-sm font-semibold text-[#18181B]">
                    Vestido Midi Linho Floral
                  </p>
                  <p className="text-xs text-[#C26D53] font-semibold">
                    R$ 199,90 <span className="text-[#2C4A3E] font-normal">• 5% OFF Pix</span>
                  </p>
                </div>
                <Link
                  href="/produto/vestido-midi-floral-frescor-carioca"
                  data-cursor-text="VER"
                  className="bg-[#18181B] hover:bg-[#C26D53] text-white p-3 rounded-xl transition-colors shadow-sm"
                  aria-label="Ver Vestido Midi"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Brazilian Trust Bar */}
        <div className="relative z-10 border-t border-[#E7E2D8] bg-white/70 backdrop-blur-sm py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] text-[#52525B]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#EBF3EE] text-[#2C4A3E] flex items-center justify-center font-bold">
                ⚡
              </div>
              <div>
                <strong className="block text-[#18181B] font-semibold">5% de Desconto Pix</strong>
                <span>Aprovação e envio imediato</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FDF5F2] text-[#C26D53] flex items-center justify-center font-bold">
                💳
              </div>
              <div>
                <strong className="block text-[#18181B] font-semibold">Até 12x Sem Juros</strong>
                <span>Em todos os cartões de crédito</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#F5F2EB] text-[#18181B] flex items-center justify-center font-bold">
                🚚
              </div>
              <div>
                <strong className="block text-[#18181B] font-semibold">Frete Grátis</strong>
                <span>Nas compras acima de R$ 250</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#F5F2EB] text-[#18181B] flex items-center justify-center font-bold">
                🛡️
              </div>
              <div>
                <strong className="block text-[#18181B] font-semibold">Troca Fácil em 7 Dias</strong>
                <span>Garantia CDC Art. 49</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE EDITORIAL LUXURY MARQUEE (Prompt #5 Master Feature) */}
      <section className="overflow-hidden bg-[#18181B] text-[#FBF9F5] py-4 shadow-inner select-none border-y border-[#27272A]">
        <div className="animate-marquee flex items-center gap-8 text-xs sm:text-sm uppercase font-mono tracking-[0.28em]">
          <span>COLEÇÃO RESORT 2026</span>
          <span className="text-[#C26D53]">•</span>
          <span>100% LINHO PURO BRASILEIRO</span>
          <span className="text-[#C26D53]">•</span>
          <span>ALGODÃO PIMA PERUANO</span>
          <span className="text-[#C26D53]">•</span>
          <span>FEITO NO BRASIL</span>
          <span className="text-[#C26D53]">•</span>
          <span>5% OFF NO PIX À VISTA</span>
          <span className="text-[#C26D53]">•</span>
          <span>PARCELAMENTO EM ATÉ 12X</span>
          <span className="text-[#C26D53]">•</span>
          <span>ENVIO EXPRESSO SEDEX</span>
          <span className="text-[#C26D53]">•</span>
          <span>COLEÇÃO RESORT 2026</span>
          <span className="text-[#C26D53]">•</span>
          <span>100% LINHO PURO BRASILEIRO</span>
          <span className="text-[#C26D53]">•</span>
          <span>ALGODÃO PIMA PERUANO</span>
          <span className="text-[#C26D53]">•</span>
          <span>FEITO NO BRASIL</span>
          <span className="text-[#C26D53]">•</span>
        </div>
      </section>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-28">
        {/* 3. ASYMMETRICAL EDITORIAL LOOKBOOK CARDS (Prompt #5 & #2 Asymmetric Shapes) */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[#E7E2D8]">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C26D53] font-semibold font-mono">
                EDITORIAL • DEPARTAMENTOS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] mt-1 font-normal">
                Curadoria de Estilo
              </h2>
            </div>
            <Link
              href="#catalogo"
              data-cursor-text="CATÁLOGO"
              className="text-xs uppercase tracking-widest text-[#52525B] hover:text-[#18181B] font-semibold flex items-center gap-1 mt-2 md:mt-0 group"
            >
              <span>Ver Coleção Completa</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feminino (Asymmetrical Radius 1) */}
            <Link
              href="/categoria/feminino"
              data-cursor-text="EXPLORAR"
              className="group relative asymmetric-radius-1 overflow-hidden aspect-[4/5] bg-white border border-[#E7E2D8] shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"
                alt="Moda Feminina"
                className="w-full h-full object-cover editorial-img-transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C26D53]">
                  DEPARTAMENTO
                </span>
                <h3 className="font-serif text-2xl font-normal">Feminino</h3>
                <p className="text-xs text-[#D4D4D8] mt-1 font-light">Linho floral, vestidos e alfaiataria leve.</p>
                <span className="text-xs text-white font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver Coleção →
                </span>
              </div>
            </Link>

            {/* Masculino (Asymmetrical Radius 2) */}
            <Link
              href="/categoria/masculino"
              data-cursor-text="EXPLORAR"
              className="group relative asymmetric-radius-2 overflow-hidden aspect-[4/5] bg-white border border-[#E7E2D8] shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80"
                alt="Moda Masculina"
                className="w-full h-full object-cover editorial-img-transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C26D53]">
                  DEPARTAMENTO
                </span>
                <h3 className="font-serif text-2xl font-normal">Masculino</h3>
                <p className="text-xs text-[#D4D4D8] mt-1 font-light">Camisas linho puro, bermudas chino e pima.</p>
                <span className="text-xs text-white font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver Coleção →
                </span>
              </div>
            </Link>

            {/* Infantil (Asymmetrical Radius 1) */}
            <Link
              href="/categoria/infantil"
              data-cursor-text="EXPLORAR"
              className="group relative asymmetric-radius-1 overflow-hidden aspect-[4/5] bg-white border border-[#E7E2D8] shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80"
                alt="Moda Infantil"
                className="w-full h-full object-cover editorial-img-transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C26D53]">
                  DEPARTAMENTO
                </span>
                <h3 className="font-serif text-2xl font-normal">Infantil & Kids</h3>
                <p className="text-xs text-[#D4D4D8] mt-1 font-light">Algodão suave e peças para brincar com conforto.</p>
                <span className="text-xs text-white font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver Coleção →
                </span>
              </div>
            </Link>

            {/* Calçados & Acessórios (Asymmetrical Radius 3) */}
            <Link
              href="/categoria/calcados-acessorios"
              data-cursor-text="EXPLORAR"
              className="group relative asymmetric-radius-3 overflow-hidden aspect-[4/5] bg-white border border-[#E7E2D8] shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"
                alt="Calçados e Acessórios"
                className="w-full h-full object-cover editorial-img-transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C26D53]">
                  DEPARTAMENTO
                </span>
                <h3 className="font-serif text-2xl font-normal">Calçados & Bolsas</h3>
                <p className="text-xs text-[#D4D4D8] mt-1 font-light">Couro legítimo e acabamentos artesanais.</p>
                <span className="text-xs text-white font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver Coleção →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* 4. MAIN PRODUCT CATALOG & INTERACTIVE STOREFRONT */}
        <section id="catalogo" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E7E2D8]">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C26D53] font-semibold font-mono">
                CATÁLOGO EXCLUSIVO
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] mt-1 font-normal">
                Peças em Destaque
              </h2>
            </div>

            {/* Department Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categoriesTabs.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  data-cursor-text="FILTRAR"
                  className={`text-xs uppercase tracking-wider px-4 py-2.5 rounded-full font-semibold transition ${
                    selectedCategory === cat.slug
                      ? 'bg-[#18181B] text-white shadow-sm'
                      : 'bg-white text-[#52525B] hover:text-[#18181B] border border-[#E7E2D8] hover:border-[#18181B]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Controls Bar: Sizes & Ordering */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-5 bg-white rounded-2xl border border-[#E7E2D8] shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto text-xs py-1">
              <span className="text-[#71717A] text-[11px] uppercase tracking-wider font-mono mr-1">
                Tamanho:
              </span>
              {sizeFilters.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1 rounded-lg text-xs transition ${
                    selectedSize === sz
                      ? 'bg-[#18181B] text-white font-semibold'
                      : 'bg-[#F5F2EB] text-[#52525B] hover:bg-[#E7E2D8]'
                  }`}
                >
                  {sz === 'todos' ? 'Todos' : sz}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#71717A] text-[11px] uppercase tracking-wider font-mono">
                Ordenar:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F5F2EB] border border-[#E7E2D8] text-[#18181B] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#18181B]"
              >
                <option value="popular">Mais Populares</option>
                <option value="rating">Melhor Avaliados</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-2 border-[#18181B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs uppercase tracking-widest text-[#71717A] font-mono">
                Carregando coleção Brasil Chic...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-[#E7E2D8] p-8">
              <p className="font-serif text-xl text-[#18181B]">
                Nenhum produto encontrado com estes filtros.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('todos');
                  setSelectedSize('todos');
                  setSearchFilter('');
                }}
                className="mt-4 bg-[#18181B] text-white px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const sel = selections[product.id] || {
                  size: product.variants[0]?.size || 'M',
                  color: product.variants[0]?.color || 'Padrão',
                  colorHex: product.variants[0]?.colorHex || '#18181B',
                };
                const pixPrice = product.price * 0.95;
                const installmentsList = calculateInstallments(product.price);
                const bestInstallment = installmentsList[installmentsList.length - 1] || {
                  installments: 1,
                  installmentValue: product.price,
                };

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#E7E2D8] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                  >
                    {/* Imagem do Produto */}
                    <div className="relative aspect-[3/4] bg-[#F5F2EB] overflow-hidden">
                      <Link
                        href={`/produto/${product.slug}`}
                        data-cursor-text="VER PEÇA"
                        className="block w-full h-full"
                      >
                        <img
                          src={
                            product.images[0]?.url ||
                            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
                          }
                          alt={product.name}
                          className="w-full h-full object-cover editorial-img-transition"
                        />
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.badge && (
                          <span className="bg-[#18181B] text-white text-[10px] uppercase font-mono tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            {product.badge}
                          </span>
                        )}
                        {product.isNew && (
                          <span className="bg-[#C26D53] text-white text-[10px] uppercase font-mono tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            Novo
                          </span>
                        )}
                      </div>

                      {/* Selo Pix Instantâneo */}
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[#2C4A3E] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-[#2C4A3E]/20">
                        ⚡ 5% OFF Pix
                      </div>
                    </div>

                    {/* Informações Comerciais */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-[#71717A] mb-1">
                          <span className="uppercase font-mono tracking-widest">{product.category.name}</span>
                          <span className="flex items-center gap-1 text-[#B45309]">
                            <Star className="w-3 h-3 fill-current" />
                            <strong>{product.rating.toFixed(1)}</strong>
                            <span className="text-[#A1A1AA]">({product.reviewCount})</span>
                          </span>
                        </div>

                        <Link href={`/produto/${product.slug}`} className="block">
                          <h3 className="font-serif text-base font-medium text-[#18181B] group-hover:text-[#C26D53] transition-colors leading-snug line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Preço BRL & Parcelamento BACEN */}
                        <div className="mt-2.5">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#18181B]">
                              {formatBRL(product.price)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs text-[#A1A1AA] line-through">
                                {formatBRL(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#52525B] mt-0.5">
                            ou <strong className="text-[#18181B] font-semibold">{bestInstallment.installments}x de {formatBRL(bestInstallment.installmentValue)}</strong> sem juros
                          </div>
                          <div className="text-[11px] text-[#2C4A3E] font-medium mt-0.5 flex items-center gap-1">
                            <span>⚡</span> {formatBRL(pixPrice)} no Pix à vista
                          </div>
                        </div>

                        {/* Seleção Rápida de Tamanho */}
                        <div className="mt-3.5 pt-3 border-t border-[#F0ECE1]">
                          <span className="text-[10px] text-[#71717A] uppercase font-mono tracking-wider block mb-1.5">
                            Tamanho:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {product.variants.map((v) => (
                              <button
                                key={v.size}
                                onClick={() => handleSelectVariant(product.id, v.size, v.color, v.colorHex)}
                                className={`w-7 h-7 rounded text-xs flex items-center justify-center transition ${
                                  sel.size === v.size
                                    ? 'bg-[#18181B] text-white font-bold'
                                    : 'border border-[#E7E2D8] text-[#18181B] hover:border-[#18181B]'
                                }`}
                              >
                                {v.size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Botão Adicionar à Sacola */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        data-cursor-text="COMPRAR"
                        className="w-full mt-4 bg-[#18181B] hover:bg-[#27272A] text-white py-3 rounded-xl text-xs uppercase tracking-widest font-semibold transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Comprar Agora</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 5. BRAND MANIFESTO & FABRIC EXCELLENCE */}
        <section className="bg-[#18181B] text-white rounded-3xl p-8 sm:p-14 overflow-hidden relative shadow-2xl">
          <FabricCanvas
            className="opacity-25"
            lineColor="rgba(255, 255, 255, 0.08)"
            accentColor="rgba(194, 109, 83, 0.35)"
            density={20}
          />
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#C26D53] font-semibold">
              MANIFESTO DA MARCA
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl leading-tight font-normal">
              Moda desenhada para durar, respirar e celebrar o bem-viver.
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-light">
              Nossas roupas são feitas para quem aprecia o luxo do conforto. O linho natural absorve a umidade e mantém o corpo fresco sob o sol brasileiro, enquanto o algodão pima oferece maciez que não desgasta com as lavagens.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/sobre"
                data-cursor-text="HISTÓRIA"
                className="bg-white hover:bg-[#FAF8F5] text-[#18181B] px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition shadow-md"
              >
                Conheça Nossa História
              </Link>
            </div>
          </div>
        </section>

        {/* 6. VERIFIED REVIEWS & SOCIAL PROOF */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] uppercase font-mono tracking-[0.25em] text-[#C26D53] font-semibold">
              AVALIAÇÕES REAIS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] font-normal">
              Quem Compra, Recomenda
            </h2>
            <p className="text-xs text-[#71717A]">
              Mais de 15.000 clientes atendidos com nota média de 4.9/5 estrelas em todo o Brasil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7E2D8] shadow-sm space-y-3">
              <div className="flex text-[#B45309] text-xs">★★★★★</div>
              <p className="text-xs text-[#3F3F46] leading-relaxed italic">
                "A camisa de linho tem um caimento impecável! Comprei pelo Pix e recebi o código de rastreio no mesmo dia. Entrega super rápida em São Paulo."
              </p>
              <div className="pt-2 border-t border-[#F0ECE1] text-[11px]">
                <strong className="text-[#18181B] block font-semibold">Juliana M.</strong>
                <span className="text-[#71717A]">São Paulo - SP • Compra Verificada</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E7E2D8] shadow-sm space-y-3">
              <div className="flex text-[#B45309] text-xs">★★★★★</div>
              <p className="text-xs text-[#3F3F46] leading-relaxed italic">
                "A bermuda chino e a camiseta de algodão pima viraram minhas peças favoritas. O tecido é muito macio e não amassa fácil. Recomendo de olhos fechados!"
              </p>
              <div className="pt-2 border-t border-[#F0ECE1] text-[11px]">
                <strong className="text-[#18181B] block font-semibold">Rodrigo S.</strong>
                <span className="text-[#71717A]">Rio de Janeiro - RJ • Compra Verificada</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E7E2D8] shadow-sm space-y-3">
              <div className="flex text-[#B45309] text-xs">★★★★★</div>
              <p className="text-xs text-[#3F3F46] leading-relaxed italic">
                "O vestido floral é ainda mais maravilhoso pessoalmente. Costura refinada e tecido super leve. Amei o cupom de primeira compra BEMVINDO10!"
              </p>
              <div className="pt-2 border-t border-[#F0ECE1] text-[11px]">
                <strong className="text-[#18181B] block font-semibold">Camila B.</strong>
                <span className="text-[#71717A]">Belo Horizonte - MG • Compra Verificada</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. NEWSLETTER & VIP CLUB (10% OFF Coupon) */}
        <section className="bg-[#F5F2EB] rounded-3xl p-8 sm:p-12 border border-[#E7E2D8] text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[11px] uppercase font-mono tracking-[0.25em] text-[#C26D53] font-semibold">
            CLUBE BRASIL CHIC
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#18181B] font-normal">
            Ganhe 10% de desconto na sua primeira compra.
          </h2>
          <p className="text-xs text-[#52525B] max-w-md mx-auto">
            Cadastre seu e-mail e use o cupom <strong className="text-[#18181B] font-semibold">BEMVINDO10</strong> no checkout para garantir seu desconto de boas-vindas.
          </p>
          <div className="flex max-w-md mx-auto gap-2 pt-2">
            <input
              type="email"
              placeholder="Digite seu melhor e-mail..."
              className="flex-1 bg-white border border-[#E7E2D8] rounded-xl px-4 py-3 text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            />
            <button
              data-cursor-text="CUPOM"
              className="bg-[#18181B] hover:bg-[#27272A] text-white px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold shadow-sm transition"
            >
              Cadastrar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center text-xs uppercase tracking-widest text-[#71717A]">Carregando Brasil Chic...</div>}>
      <HomeContent />
    </React.Suspense>
  );
}
