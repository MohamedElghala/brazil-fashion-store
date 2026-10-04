"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Filter,
  Star,
  ShoppingBag,
  Eye,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBRL, calculateInstallments } from '@/lib/brazil';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [selectedSize, setSelectedSize] = useState('todos');
  const [sortBy, setSortBy] = useState('popular');

  const [selections, setSelections] = useState<{
    [productId: string]: { size: string; color: string; colorHex: string };
  }>({});

  useEffect(() => {
    async function loadCategoryProducts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?category=${slug}`);
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
          if (data.products.length > 0) {
            setCategoryName(data.products[0].category.name);
            setCategoryDesc(data.products[0].category.description || '');
          }

          const initSel: any = {};
          data.products.forEach((p: any) => {
            if (p.variants?.length > 0) {
              initSel[p.id] = {
                size: p.variants[0].size,
                color: p.variants[0].color,
                colorHex: p.variants[0].colorHex,
              };
            }
          });
          setSelections(initSel);
        }
      } catch (err) {
        console.error('Erro ao buscar produtos da categoria:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryProducts();
  }, [slug]);

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

  const handleAddToCart = (product: any) => {
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
      image: product.images[0]?.url,
    });
  };

  const filtered = products.filter((p) => {
    if (selectedSize === 'todos') return true;
    return p.variants.some((v: any) => v.size.toLowerCase() === selectedSize.toLowerCase());
  });

  filtered.sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewCount - a.reviewCount;
  });

  const sizesList = ['todos', 'P', 'M', 'G', 'GG', '2A', '4A', '6A', '8A', '37', '38', '39', '40', '41'];

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white transition">
          Início
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-semibold capitalize">
          {categoryName || slug}
        </span>
      </nav>

      {/* Header da Categoria */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 rounded-3xl p-8 sm:p-10">
        <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
          Departamento
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white mt-1 capitalize">
          {categoryName || slug}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          {categoryDesc ||
            'Explore nossa seleção de roupas desenhadas para garantir máximo estilo e conforto com tecidos nobres.'}
        </p>
      </div>

      {/* Filtros e Ordenação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Filtro de Tamanho */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Tamanho:
          </span>
          {sizesList.map((sz) => (
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

        {/* Ordenação */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-400"
          >
            <option value="popular">Mais Populares</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
            <option value="rating">Melhor Avaliação</option>
          </select>
        </div>
      </div>

      {/* Grid de Produtos */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
          <p className="text-base font-bold text-white">Nenhuma peça encontrada com estes filtros</p>
          <button
            onClick={() => setSelectedSize('todos')}
            className="bg-slate-800 text-white text-xs px-4 py-2 rounded-xl"
          >
            Ver todos os tamanhos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const currentSel = selections[product.id] || {
              size: product.variants[0]?.size || 'M',
              color: product.variants[0]?.color || 'Padrão',
              colorHex: product.variants[0]?.colorHex || '#000000',
            };

            const installment = calculateInstallments(product.price, 12)[11] || {
              installmentValue: product.price / 12,
            };

            const uniqueColors = Array.from(
              new Map(product.variants.map((v: any) => [v.color, v])).values()
            );
            const uniqueSizes = Array.from(new Set(product.variants.map((v: any) => v.size)));

            return (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition group flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
                    <Link href={`/produto/${product.slug}`}>
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </Link>

                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md">
                        {product.badge}
                      </div>
                    )}

                    <Link
                      href={`/produto/${product.slug}`}
                      className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-950 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition shadow-lg"
                    >
                      <Eye className="w-4 h-4 text-emerald-400" />
                    </Link>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="uppercase font-semibold text-emerald-400">
                        {product.category.name}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" />
                        <span className="font-bold text-slate-200">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <Link href={`/produto/${product.slug}`}>
                      <h3 className="font-bold text-sm text-white hover:text-emerald-400 transition line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

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
                      <p className="text-[10px] text-slate-400">
                        ou 12x de {formatBRL(installment.installmentValue)} sem juros
                      </p>
                    </div>

                    {/* Variações */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        {uniqueColors.map((col: any) => (
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
                            className={`w-4 h-4 rounded-full border transition ${
                              currentSel.color === col.color
                                ? 'border-emerald-400 scale-110'
                                : 'border-slate-700'
                            }`}
                            style={{ backgroundColor: col.colorHex }}
                            title={col.color}
                          />
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {uniqueSizes.map((sz: any) => (
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
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition border ${
                              currentSel.size === sz
                                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-emerald-400 transition"
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
    </div>
  );
}
