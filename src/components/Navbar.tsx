"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Settings,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  Truck,
  CreditCard,
  Percent,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBRL } from '@/lib/brazil';

export default function Navbar() {
  const router = useRouter();
  const { cartCount, setIsCartOpen, subtotal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navCategories = [
    { name: 'Início', href: '/' },
    { name: 'Masculino', href: '/categoria/masculino' },
    { name: 'Feminino', href: '/categoria/feminino' },
    { name: 'Infantil', href: '/categoria/infantil' },
    { name: 'Calçados & Acessórios', href: '/categoria/calcados-acessorios' },
    { name: 'Promoções', href: '/promocoes', highlight: true },
  ];

  return (
    <>
      {/* Top Banner de Vantagens Brasileiras */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-[11px] py-1.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <Truck className="w-3.5 h-3.5" />
              <strong>Frete Grátis</strong> para todo Brasil em compras acima de R$ 250
            </span>
            <span className="hidden md:flex items-center gap-1 font-medium text-emerald-100">
              <Percent className="w-3.5 h-3.5 text-yellow-300" />
              <strong>5% OFF</strong> no Pix à vista
            </span>
            <span className="hidden lg:flex items-center gap-1 font-medium text-emerald-100">
              <CreditCard className="w-3.5 h-3.5" />
              Até <strong>12x sem juros</strong> no cartão
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <Link
              href="/rastreio"
              className="hover:underline flex items-center gap-1 text-emerald-100 hover:text-white"
            >
              <span>Rastrear Pedido</span>
            </Link>
            <span className="text-emerald-300">•</span>
            <a
              href="https://wa.me/5511987654321?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20a%20loja."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-bold text-yellow-300 hover:underline"
            >
              <PhoneCall className="w-3 h-3" />
              <span>WhatsApp (11) 98765-4321</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
          {/* Botão Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logomarca Brasil Chic */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition transform">
              🇧🇷
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-white leading-none">
                BRASIL <span className="text-emerald-400">CHIC</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium mt-0.5">
                Moda & Conforto
              </span>
            </div>
          </Link>

          {/* Barra de Pesquisa */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar camisas de linho, vestidos, conjuntos infantis..."
              className="w-full bg-slate-800/90 border border-slate-700 text-slate-100 text-xs rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition placeholder-slate-400 shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Ações da Direita */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 transition"
              title="Painel Administrativo do Lojista"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">Painel Lojista</span>
            </Link>

            {/* Botão de Sacola / Carrinho */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-extrabold uppercase tracking-wide">
                Sacola
              </span>
              {cartCount > 0 && (
                <span className="bg-slate-950 text-emerald-400 text-[11px] font-black rounded-full px-2 py-0.5 border border-emerald-400 font-mono">
                  {cartCount}
                </span>
              )}
              {subtotal > 0 && (
                <span className="hidden xl:inline text-slate-950 font-black border-l border-slate-950/20 pl-2 font-mono">
                  {formatBRL(subtotal)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Categorias Desktop */}
        <div className="hidden md:block bg-slate-950/80 border-t border-slate-800/80 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 py-2.5 text-xs font-semibold">
            {navCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`transition uppercase tracking-wider ${
                  cat.highlight
                    ? 'text-yellow-400 hover:text-yellow-300 font-extrabold flex items-center gap-1'
                    : 'text-slate-300 hover:text-emerald-400'
                }`}
              >
                {cat.highlight && <Sparkles className="w-3 h-3 animate-pulse" />}
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Menu Mobile Retrátil */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-t border-slate-800 p-4 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar roupas..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-emerald-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>

            <nav className="flex flex-col space-y-2">
              {navCategories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                    cat.highlight
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      : 'text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.highlight && <Sparkles className="w-4 h-4" />}
                </Link>
              ))}

              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                <Link
                  href="/rastreio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 flex items-center gap-2"
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Rastrear Pedido</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg text-xs font-medium text-emerald-400 hover:bg-slate-900 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Painel do Lojista</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
