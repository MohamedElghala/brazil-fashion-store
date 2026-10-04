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
          const initialMap: any = {};
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
    <div className="space-y-20">
      {/* 1. Hero Editorial Split Banner (Estilo Amaro & Osklen) */}
      <section className="relative bg-[#F5F2EB] border-b border-[#E7E2D8] overflow-hidden">
        <FabricCanvas
          className="opacity-70"
          lineColor="rgba(24, 24, 27, 0.04)"
          accentColor="rgba(194, 109, 83, 0.16)"
          density={24}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Lado Esquerdo: Tipografia & Ação */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#E7E2D8] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C26D53]">
              <Sparkles className="w-3.5 h-3.5 text-[#C26D53]" />
              <span>Coleção Verão 2026 • Edição Especial</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-[#18181B] leading-[1.1] tracking-tight font-medium">
              A elegância solar do Brasil em tecidos nobres.
            </h1>

            <p className="text-[#52525B] text-sm sm:text-base leading-relaxed max-w-xl font-light">
              Descubra o toque inconfundível do <strong className="text-[#18181B] font-semibold">100% linho puro</strong> e a maciez lendária do <strong className="text-[#18181B] font-semibold">algodão pima</strong>. Peças desenhadas para vestir com leveza, frescor e alta sofisticação.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/categoria/feminino"
                className="bg-[#18181B] hover:bg-[#27272A] text-white px-8 py-4 rounded-lg text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-sm flex items-center gap-2 group"
              >
                <span>Comprar Feminino</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/categoria/masculino"
                className="bg-white hover:bg-[#FAF8F5] text-[#18181B] border border-[#18181B] px-8 py-4 rounded-lg text-xs uppercase tracking-[0.2em] font-semibold transition-all"
              >
                <span>Comprar Masculino</span>
              </Link>
            </div>

            {/* Micro Benefícios no Hero */}
            <div className="pt-8 border-t border-[#E7E2D8] grid grid-cols-3 gap-6 text-[11px] text-[#71717A]">
              <div>
                <strong className="block text-sm text-[#18181B] font-semibold">5% OFF no Pix</strong>
                <span>Desconto imediato à vista</span>
              </div>
              <div>
                <strong className="block text-sm text-[#18181B] font-semibold">Até 12x Sem Juros</strong>
                <span>Em todos os cartões</span>
              </div>
              <div>
                <strong className="block text-sm text-[#18181B] font-semibold">Frete Grátis</strong>
                <span>Acima de R$ 250</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Imagem Editorial de Alta Resolução */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-[#E7E2D8] bg-white">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=85"
                alt="Moda Brasileira Elegante"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-[#E7E2D8] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#71717A] font-semibold">Destaque da Semana</span>
                  <p className="font-serif text-sm font-semibold text-[#18181B]">Vestido Midi Linho Floral</p>
                  <p className="text-xs text-[#C26D53] font-semibold">R$ 199,90 • 12x de R$ 16,65</p>
                </div>
                <Link
                  href="/produto/vestido-midi-floral-frescor-carioca"
                  className="bg-[#18181B] hover:bg-[#27272A] text-white p-2.5 rounded-lg text-xs"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* 2. Categorias em Destaque (Visual Cards) */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E7E2D8]">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C26D53] font-semibold">Descubra Nossos Departamentos</span>
              <h2 className="font-serif text-3xl text-[#18181B] mt-1">Categorias em Destaque</h2>
            </div>
            <Link href="#catalogo" className="text-xs uppercase tracking-widest text-[#52525B] hover:text-[#18181B] font-semibold flex items-center gap-1 mt-2 md:mt-0">
              <span>Ver Catálogo Geral</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Feminino */}
            <Link
              href="/categoria/feminino"
              className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-white border border-[#E7E2D8] shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"
                alt="Moda Feminina"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#E7E2D8]">Coleção</span>
                <h3 className="font-serif text-xl font-semibold">Feminino</h3>
                <span className="text-xs text-[#D4D4D8] mt-1 group-hover:underline">Explorar Peças →</span>
              </div>
            </Link>

            {/* Masculino */}
            <Link
              href="/categoria/masculino"
              className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-white border border-[#E7E2D8] shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80"
                alt="Moda Masculina"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#E7E2D8]">Coleção</span>
                <h3 className="font-serif text-xl font-semibold">Masculino</h3>
                <span className="text-xs text-[#D4D4D8] mt-1 group-hover:underline">Explorar Peças →</span>
              </div>
            </Link>

            {/* Infantil */}
            <Link
              href="/categoria/infantil"
              className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-white border border-[#E7E2D8] shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80"
                alt="Moda Infantil"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#E7E2D8]">Coleção</span>
                <h3 className="font-serif text-xl font-semibold">Infantil & Kids</h3>
                <span className="text-xs text-[#D4D4D8] mt-1 group-hover:underline">Explorar Peças →</span>
              </div>
            </Link>

            {/* Calçados & Acessórios */}
            <Link
              href="/categoria/calcados-acessorios"
              className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-white border border-[#E7E2D8] shadow-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"
                alt="Calçados e Acessórios"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#E7E2D8]">Coleção</span>
                <h3 className="font-serif text-xl font-semibold">Calçados & Bolsas</h3>
                <span className="text-xs text-[#D4D4D8] mt-1 group-hover:underline">Explorar Peças →</span>
              </div>
            </Link>
          </div>
        </section>

        {/* 3. Catálogo Principal de Produtos */}
        <section id="catalogo" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E7E2D8]">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C26D53] font-semibold">Vitrine Exclusiva</span>
              <h2 className="font-serif text-3xl text-[#18181B] mt-1">Peças em Destaque</h2>
            </div>

            {/* Abas de Categorias */}
            <div className="flex flex-wrap items-center gap-2">
              {categoriesTabs.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full font-semibold transition ${
                    selectedCategory === cat.slug
                      ? 'bg-[#18181B] text-white'
                      : 'bg-white text-[#52525B] hover:text-[#18181B] border border-[#E7E2D8]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtros Secundários (Tamanho e Ordenação) */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 bg-white rounded-xl border border-[#E7E2D8]">
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[#71717A] text-[11px] uppercase tracking-wider font-semibold mr-1">Tamanho:</span>
              {sizeFilters.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    selectedSize === sz
                      ? 'bg-[#18181B] text-white font-bold'
                      : 'bg-[#F5F2EB] text-[#52525B] hover:bg-[#E7E2D8]'
                  }`}
                >
                  {sz === 'todos' ? 'Todos' : sz}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#71717A] text-[11px] uppercase tracking-wider font-semibold">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F5F2EB] border border-[#E7E2D8] text-[#18181B] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#18181B]"
              >
                <option value="popular">Mais Populares</option>
                <option value="rating">Melhor Avaliados</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Grid de Cards de Produtos */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#18181B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs uppercase tracking-widest text-[#71717A]">Carregando coleção...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-[#E7E2D8] p-8">
              <p className="font-serif text-lg text-[#18181B]">Nenhum produto encontrado com estes filtros.</p>
              <button
                onClick={() => {
                  setSelectedCategory('todos');
                  setSelectedSize('todos');
                  setSearchFilter('');
                }}
                className="mt-4 bg-[#18181B] text-white px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold"
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
                const bestInstallment = installmentsList[installmentsList.length - 1] || { installments: 1, installmentValue: product.price };

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#E7E2D8] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                  >
                    {/* Imagem do Produto */}
                    <div className="relative aspect-[3/4] bg-[#F5F2EB] overflow-hidden">
                      <Link href={`/produto/${product.slug}`} className="block w-full h-full">
                        <img
                          src={product.images[0]?.url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.badge && (
                          <span className="bg-[#18181B] text-white text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            {product.badge}
                          </span>
                        )}
                        {product.isNew && (
                          <span className="bg-[#C26D53] text-white text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            Novo
                          </span>
                        )}
                      </div>

                      {/* Selo Pix */}
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[#2C4A3E] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        5% OFF no Pix
                      </div>
                    </div>

                    {/* Informações do Produto */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-[#71717A] mb-1">
                          <span className="uppercase tracking-widest">{product.category.name}</span>
                          <span className="flex items-center gap-1 text-[#B45309]">
                            <Star className="w-3 h-3 fill-current" />
                            <strong>{product.rating.toFixed(1)}</strong>
                            <span className="text-[#A1A1AA]">({product.reviewCount})</span>
                          </span>
                        </div>

                        <Link href={`/produto/${product.slug}`} className="block">
                          <h3 className="font-serif text-base font-semibold text-[#18181B] group-hover:text-[#C26D53] transition-colors leading-snug line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Preço e Parcelamento */}
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

                        {/* Seleção de Tamanho Rápida */}
                        <div className="mt-3.5 pt-3 border-t border-[#F0ECE1]">
                          <span className="text-[10px] text-[#71717A] uppercase tracking-wider block mb-1.5 font-medium">
                            Selecione o Tamanho:
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
                        className="w-full mt-4 bg-[#18181B] hover:bg-[#27272A] text-white py-3 rounded-lg text-xs uppercase tracking-widest font-semibold transition flex items-center justify-center gap-2 active:scale-95"
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

        {/* 4. Banner Editorial Storytelling (O Estilo de Vida Solar do Brasil) */}
        <section className="bg-[#18181B] text-white rounded-3xl p-8 sm:p-14 overflow-hidden relative shadow-2xl">
          <FabricCanvas
            className="opacity-25"
            lineColor="rgba(255, 255, 255, 0.08)"
            accentColor="rgba(194, 109, 83, 0.35)"
            density={20}
          />
          <div className="max-w-2xl space-y-5 relative z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C26D53] font-semibold">
              Manifesto da Marca
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl leading-tight">
              Moda desenhada para durar, respirar e celebrar o bem-viver.
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-light">
              Nossas roupas são feitas para quem aprecia o luxo do conforto. O linho natural absorve a umidade e mantém o corpo fresco sob o sol brasileiro, enquanto o algodão pima oferece maciez que não desgasta com as lavagens.
            </p>
            <div className="pt-3 flex flex-wrap gap-4">
              <Link
                href="/sobre"
                className="bg-white hover:bg-[#FAF8F5] text-[#18181B] px-6 py-3 rounded-lg text-xs uppercase tracking-widest font-semibold transition"
              >
                Conheça Nossa História
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Depoimentos de Clientes Verificados (Prova Social) */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C26D53] font-semibold">
              Avaliações Reais
            </span>
            <h2 className="font-serif text-3xl text-[#18181B]">Quem Compra, Recomenda</h2>
            <p className="text-xs text-[#71717A]">
              Mais de 15.000 clientes atendidos com nota média de 4.9/5 estrelas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7E2D8] shadow-sm space-y-3">
              <div className="flex text-[#B45309] text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-[#3F3F46] leading-relaxed italic">
                "A camisa de linho tem um caimento impecável! Comprei pelo Pix e recebi o código de rastreio no mesmo dia. Entrega super rápida em São Paulo."
              </p>
              <div className="pt-2 border-t border-[#F0ECE1] text-[11px]">
                <strong className="text-[#18181B] block">Juliana M.</strong>
                <span className="text-[#71717A]">São Paulo - SP • Compra Verificada</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E7E2D8] shadow-sm space-y-3">
              <div className="flex text-[#B45309] text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-[#3F3F46] leading-relaxed italic">
                "A bermuda chino e a camiseta de algodão pima viraram minhas peças favoritas. O tecido é muito macio e não amassa fácil. Recomendo de olhos fechados!"
              </p>
              <div className="pt-2 border-t border-[#F0ECE1] text-[11px]">
                <strong className="text-[#18181B] block">Rodrigo S.</strong>
                <span className="text-[#71717A]">Rio de Janeiro - RJ • Compra Verificada</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E7E2D8] shadow-sm space-y-3">
              <div className="flex text-[#B45309] text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-[#3F3F46] leading-relaxed italic">
                "O vestido floral é ainda mais maravilhoso pessoalmente. Costura refinada e tecido super leve. Amei o cupom de primeira compra BEMVINDO10!"
              </p>
              <div className="pt-2 border-t border-[#F0ECE1] text-[11px]">
                <strong className="text-[#18181B] block">Camila B.</strong>
                <span className="text-[#71717A]">Belo Horizonte - MG • Compra Verificada</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Newsletter VIP Club com Cupom Imediato */}
        <section className="bg-[#F5F2EB] rounded-3xl p-8 sm:p-12 border border-[#E7E2D8] text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C26D53] font-semibold">
            Clube Brasil Chic
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#18181B]">
            Ganhe 10% de desconto na sua primeira compra.
          </h2>
          <p className="text-xs text-[#52525B] max-w-md mx-auto">
            Cadastre seu e-mail e use o cupom <strong className="text-[#18181B] font-semibold">BEMVINDO10</strong> no checkout para garantir seu desconto de boas-vindas.
          </p>
          <div className="flex max-w-md mx-auto gap-2 pt-2">
            <input
              type="email"
              placeholder="Digite seu melhor e-mail..."
              className="flex-1 bg-white border border-[#E7E2D8] rounded-lg px-4 py-3 text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
            />
            <button className="bg-[#18181B] hover:bg-[#27272A] text-white px-6 py-3 rounded-lg text-xs uppercase tracking-widest font-semibold">
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
