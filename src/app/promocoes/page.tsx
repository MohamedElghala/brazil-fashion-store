"use client";

export const dynamic = 'force-static';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Percent,
  Star,
  ShoppingBag,
  Eye,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBRL, calculateInstallments } from '@/lib/brazil';

export default function PromocoesPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPromos() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          // Filtrar produtos com desconto original ou badges de promoção
          const promos = data.products.filter(
            (p: any) => p.originalPrice || (p.badge && p.badge.includes('OFF'))
          );
          setProducts(promos);
        }
      } catch (e) {
        console.error('Erro ao carregar promoções:', e);
      } finally {
        setLoading(false);
      }
    }
    loadPromos();
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      size: product.variants[0]?.size || 'M',
      color: product.variants[0]?.color || 'Padrão',
      colorHex: product.variants[0]?.colorHex || '#000000',
      image: product.images[0]?.url,
    });
  };

  return (
    <div className="space-y-10">
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white transition">
          Início
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-yellow-400 font-semibold">Outlet & Promoções</span>
      </nav>

      <div className="bg-gradient-to-r from-yellow-950/60 via-slate-900 to-emerald-950/60 border border-yellow-500/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-300 font-bold text-xs px-3 py-1 rounded-full border border-yellow-500/30">
            <Percent className="w-3.5 h-3.5" />
            <span>OUTLET EXCLUSIVO • ATÉ 30% OFF</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Ofertas & Descontos Imperdíveis
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Peças selecionadas com condições especiais por tempo limitado. Aproveite o parcelamento sem juros e mais 5% de desconto extra pagando via Pix!
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl">
          <p className="text-white font-bold">Nenhuma promoção ativa no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const installment = calculateInstallments(product.price, 12)[11] || {
              installmentValue: product.price / 12,
            };

            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 20;

            return (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition group flex flex-col justify-between shadow-xl"
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

                    <div className="absolute top-3 left-3 bg-yellow-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md">
                      -{discountPercent}% OFF
                    </div>

                    <Link
                      href={`/produto/${product.slug}`}
                      className="absolute bottom-3 right-3 bg-slate-900/90 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition"
                    >
                      <Eye className="w-4 h-4 text-yellow-400" />
                    </Link>
                  </div>

                  <div className="p-4 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {product.category.name}
                    </span>
                    <Link href={`/produto/${product.slug}`}>
                      <h3 className="font-bold text-sm text-white hover:text-yellow-400 transition line-clamp-1">
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
                        12x de {formatBRL(installment.installmentValue)} sem juros
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
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
