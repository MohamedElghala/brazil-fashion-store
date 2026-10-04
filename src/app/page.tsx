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
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBRL, calculateInstallments } from '@/lib/brazil';

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

  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedSize, setSelectedSize] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [searchFilter, setSearchFilter] = useState(searchParam);

  // Seleções ativas por produto (tamanho e cor)
  const [selections, setSelections] = useState<{
    [productId: string]: { size: string; color: string; colorHex: string };
  }>({});

  useEffect(() => {
    setSearchFilter(searchParam);
  }, [searchParam]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);

          // Inicializar seleção padrão para cada produto
          const initialSel: any = {};
          data.products.forEach((p: Product) => {
            if (p.variants && p.variants.length > 0) {
              initialSel[p.id] = {
                size: p.variants[0].size,
                color: p.variants[0].color,
                colorHex: p.variants[0].colorHex,
              };
            }
          });
          setSelections(initialSel);
        }
      } catch (e) {
        console.error('Erro ao carregar produtos:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

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
      colorHex: product.variants[0]?.colorHex || '#000000',
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
    return b.reviewCount - a.reviewCount; // Mais populares
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
    <div className="space-y-16">
      {/* 1. Hero Banner Principal */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-8 sm:p-14 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ALTO VERÃO BRASIL 2026 • COLEÇÃO EXCLUSIVA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Moda Brasileira com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-yellow-300">
              Alma, Elegância
            </span>{' '}
            & Frescor
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
            Descubra peças confeccionadas em <strong className="text-white font-semibold">100% linho puro</strong> e{' '}
            <strong className="text-white font-semibold">algodão pima nobre</strong>. Cortes desenhados para o estilo de vida contemporâneo brasileiro com envio rápido e compra 100% segura.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#catalogo"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition transform active:scale-95"
            >
              <span>Ver Coleção Completa</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setSelectedCategory('promocoes')}
              className="bg-slate-800/80 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs border border-slate-700 transition flex items-center gap-2"
            >
              <Percent className="w-4 h-4 text-yellow-400" />
              <span>Ver Ofertas de até 30% OFF</span>
            </button>
          </div>

          {/* Destaques de Benefícios */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Pix 5% OFF</span>
                <span className="text-[10px] text-slate-400">Aprovação imediata</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Frete Grátis</span>
                <span className="text-[10px] text-slate-400">Acima de R$ 250</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Troca Fácil</span>
                <span className="text-[10px] text-slate-400">7 dias sem custo (CDC)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Até 12x Sem Juros</span>
                <span className="text-[10px] text-slate-400">No cartão de crédito</span>
              </div>
            </div>
          </div>
        </div>

        {/* Efeito Glow de Fundo */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Vitrine de Categorias em Destaque */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Departamentos da Loja
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Escolha a seção ideal para renovar seu guarda-roupa com o melhor da moda brasileira
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => {
              setSelectedCategory('masculino');
              const el = document.getElementById('catalogo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative h-48 sm:h-60 rounded-2xl overflow-hidden border border-slate-800 text-left transition transform hover:-translate-y-1 shadow-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80"
              alt="Moda Masculina"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Coleção Urbana
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">Masculino</h3>
              <p className="text-[11px] text-slate-300 line-clamp-1">Camisas de linho, camisetas pima e chinos</p>
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedCategory('feminino');
              const el = document.getElementById('catalogo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative h-48 sm:h-60 rounded-2xl overflow-hidden border border-slate-800 text-left transition transform hover:-translate-y-1 shadow-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
              alt="Moda Feminina"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Leveza & Frescor
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">Feminino</h3>
              <p className="text-[11px] text-slate-300 line-clamp-1">Vestidos midi, macacões e alfaiataria</p>
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedCategory('infantil');
              const el = document.getElementById('catalogo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative h-48 sm:h-60 rounded-2xl overflow-hidden border border-slate-800 text-left transition transform hover:-translate-y-1 shadow-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80"
              alt="Moda Infantil"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Conforto Total
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">Infantil & Kids</h3>
              <p className="text-[11px] text-slate-300 line-clamp-1">Conjuntos leves, antialérgicos e duráveis</p>
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedCategory('calcados-acessorios');
              const el = document.getElementById('catalogo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative h-48 sm:h-60 rounded-2xl overflow-hidden border border-slate-800 text-left transition transform hover:-translate-y-1 shadow-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"
              alt="Calçados & Acessórios"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Estilo Completo
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">Calçados & Acessórios</h3>
              <p className="text-[11px] text-slate-300 line-clamp-1">Sandálias de couro, tênis casuais e bolsas</p>
            </div>
          </button>
        </div>
      </section>

      {/* 3. Catálogo de Roupas com Filtros */}
      <section id="catalogo" className="space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Catálogo de Produtos</h2>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono font-bold">
                {filteredProducts.length} peças
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Selecione o departamento, tamanho ou ordene por menor preço
            </p>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400"
            >
              <option value="popular">Mais Populares</option>
              <option value="price_asc">Menor Preço (R$)</option>
              <option value="price_desc">Maior Preço (R$)</option>
              <option value="rating">Melhores Avaliações ★</option>
            </select>
          </div>
        </div>

        {/* Abas de Departamentos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesTabs.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setSelectedCategory(tab.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                selectedCategory === tab.slug
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filtro Rápido de Tamanho */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Tamanho:
          </span>
          {sizeFilters.map((sz) => (
            <button
              key={sz}
              onClick={() => setSelectedSize(sz)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition border ${
                selectedSize === sz
                  ? 'bg-slate-100 text-slate-950 font-bold border-white'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {sz.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grid de Produtos */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-96 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <p className="text-base font-bold text-white">Nenhum produto encontrado</p>
            <p className="text-xs text-slate-400">
              Tente selecionar outro departamento ou remover o filtro de tamanho.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSelectedSize('todos');
                setSearchFilter('');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl transition font-medium"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const currentSel = selections[product.id] || {
                size: product.variants[0]?.size || 'M',
                color: product.variants[0]?.color || 'Padrão',
                colorHex: product.variants[0]?.colorHex || '#000000',
              };

              const installment = calculateInstallments(product.price, 12)[11] || {
                installments: 12,
                installmentValue: product.price / 12,
              };

              const pixPrice = product.price * 0.95;

              // Cores únicas do produto
              const uniqueColors = Array.from(
                new Map(product.variants.map((v) => [v.color, v])).values()
              );

              // Tamanhos únicos do produto
              const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));

              return (
                <div
                  key={product.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition group flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {/* Imagem do Produto com Badge */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
                      <Link href={`/produto/${product.slug}`}>
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </Link>

                      {/* Selo do Produto */}
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                          {product.badge}
                        </div>
                      )}

                      {/* Botão Ver Detalhes */}
                      <Link
                        href={`/produto/${product.slug}`}
                        className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-950 text-white p-2 rounded-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition shadow-lg"
                        title="Ver detalhes da peça"
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                      </Link>
                    </div>

                    {/* Informações do Produto */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="uppercase font-semibold tracking-wider text-emerald-400">
                          {product.category.name}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-3.5 h-3.5 fill-yellow-400" />
                          <span className="font-bold text-slate-200">{product.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
                        </div>
                      </div>

                      <Link href={`/produto/${product.slug}`}>
                        <h3 className="font-bold text-sm text-white hover:text-emerald-400 transition line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Preço e Parcelamento */}
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-white font-mono">
                            {formatBRL(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-500 line-through font-mono">
                              {formatBRL(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-emerald-400 font-medium">
                          {formatBRL(pixPrice)} à vista no <strong>Pix (5% OFF)</strong>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          ou 12x de {formatBRL(installment.installmentValue)} sem juros
                        </p>
                      </div>

                      {/* Seletor de Cores */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Cor:</span>
                          <span className="text-slate-200 font-semibold">{currentSel.color}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {uniqueColors.map((col) => (
                            <button
                              key={col.color}
                              onClick={() =>
                                handleSelectVariant(
                                  product.id,
                                  currentSel.size,
                                  col.color,
                                  col.colorHex
                                )
                              }
                              className={`w-5 h-5 rounded-full border-2 transition ${
                                currentSel.color === col.color
                                  ? 'border-emerald-400 scale-110 shadow-sm'
                                  : 'border-slate-700 hover:border-slate-500'
                              }`}
                              style={{ backgroundColor: col.colorHex }}
                              title={col.color}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Seletor de Tamanhos */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Tamanho:</span>
                          <span className="text-slate-200 font-semibold">{currentSel.size}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {uniqueSizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() =>
                                handleSelectVariant(
                                  product.id,
                                  sz,
                                  currentSel.color,
                                  currentSel.colorHex
                                )
                              }
                              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition border ${
                                currentSel.size === sz
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão Adicionar à Sacola */}
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-emerald-400 transition shadow-md active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Adicionar à Sacola</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Banner Pix Promocional */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5" />
            <span>Pague com Pix</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Economize 5% Extra em Qualquer Peça no Pix
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ao finalizar a sua compra selecionando o Pix, o desconto é aplicado automaticamente. A confirmação é instantânea pelo Banco Central e seu pedido entra em separação prioritária no mesmo dia!
          </p>
          <div className="pt-2">
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs transition uppercase tracking-wide"
            >
              <span>Aproveitar Desconto</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block text-emerald-500/10 text-9xl font-black select-none pointer-events-none">
          PIX
        </div>
      </section>

      {/* 5. Depoimentos de Clientes Brasileiros */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Quem Compra, Recomenda
          </h2>
          <p className="text-xs text-slate-400">
            Veja a opinião de clientes reais que compraram e aprovaram nossas roupas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-yellow-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "A camisa de linho chegou super rápida aqui em São Paulo! O tecido é leve e o caimento ficou impecável. Paguei no Pix e ainda ganhei o desconto."
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Rodrigo Silveira</span>
              <span className="text-slate-500">São Paulo, SP</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-yellow-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Comprei o vestido midi floral para uma festa no Rio e recebi inúmeros elogios. A qualidade das costuras é surpreendente, vale cada centavo."
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Camila Meireles</span>
              <span className="text-slate-500">Rio de Janeiro, RJ</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-yellow-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "O conjuntinho infantil de algodão é super macio, não irrita a pele do meu filho. O atendimento no WhatsApp também foi nota dez para tirar dúvidas de tamanho."
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Juliana Costa</span>
              <span className="text-slate-500">Belo Horizonte, MG</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <React.Suspense fallback={<div className="py-24 text-center text-slate-400">Carregando catálogo de roupas...</div>}>
      <HomeContent />
    </React.Suspense>
  );
}
