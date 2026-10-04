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
      {/* Top Bar Editorial de Benefícios */}
      <div className="bg-[#18181B] text-[#FBF9F5] text-[11px] py-2 px-4 border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-light tracking-wide text-[#E4E4E7]">
              <Truck className="w-3.5 h-3.5 text-[#C26D53]" />
              <strong className="font-semibold text-white">Frete Grátis</strong> acima de R$ 250 para todo o Brasil
            </span>
            <span className="hidden md:flex items-center gap-1.5 font-light tracking-wide text-[#E4E4E7]">
              <Percent className="w-3.5 h-3.5 text-[#C26D53]" />
              <strong className="font-semibold text-white">5% de desconto</strong> no Pix à vista
            </span>
            <span className="hidden lg:flex items-center gap-1.5 font-light tracking-wide text-[#E4E4E7]">
              <CreditCard className="w-3.5 h-3.5 text-[#C26D53]" />
              Até <strong className="font-semibold text-white">12x sem juros</strong> no cartão
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium tracking-wide">
            <Link
              href="/rastreio"
              className="text-[#A1A1AA] hover:text-white transition-colors"
            >
              Rastrear Pedido
            </Link>
            <span className="text-[#3F3F46]">•</span>
            <a
              href="https://wa.me/5511987654321?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20a%20loja."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#C26D53] hover:text-[#D97757] transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span>WhatsApp (11) 98765-4321</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E2D8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Botão Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#18181B] p-2 rounded-lg hover:bg-[#F5F2EB] transition"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logomarca Brasil Chic (Estilo Editorial Luxo) */}
          <Link href="/" className="flex flex-col items-start group">
            <span className="font-serif text-2xl font-semibold tracking-[0.18em] text-[#18181B] group-hover:text-[#C26D53] transition-colors leading-none">
              BRASIL CHIC
            </span>
            <span className="text-[9px] tracking-[0.28em] text-[#71717A] uppercase font-medium mt-1">
              Moda & Estilo Brasileiro
            </span>
          </Link>

          {/* Barra de Pesquisa */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative mx-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar camisas de linho, vestidos, conjuntos..."
              className="w-full bg-[#F5F2EB] border border-[#E7E2D8] text-[#18181B] text-xs rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:border-[#18181B] focus:bg-white transition placeholder-[#71717A]"
            />
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-[#71717A] hover:text-[#18181B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Ações da Direita */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 text-xs text-[#52525B] hover:text-[#18181B] px-3 py-2 rounded-full border border-[#E7E2D8] hover:border-[#18181B] transition"
              title="Painel Administrativo do Lojista"
            >
              <Settings className="w-3.5 h-3.5 text-[#71717A]" />
              <span className="font-medium text-[11px] uppercase tracking-wider">Lojista</span>
            </Link>

            {/* Sacola de Compras */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-[#18181B] hover:bg-[#27272A] text-white px-4 py-2.5 rounded-full transition shadow-sm group"
              aria-label="Abrir Sacola de Compras"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#FBF9F5] group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C26D53] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#A1A1AA] font-semibold leading-none">
                  Sacola
                </span>
                <span className="text-xs font-semibold text-white leading-tight mt-0.5">
                  {formatBRL(subtotal)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Barra de Categorias Horizontal (Desktop) */}
        <nav className="hidden md:block border-t border-[#F0ECE1] bg-[#FBF9F5]/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center gap-8 py-2.5 text-xs uppercase tracking-widest font-medium text-[#3F3F46]">
              {navCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className={`transition-colors py-1 relative hover:text-[#18181B] ${
                      cat.highlight
                        ? 'text-[#C26D53] font-semibold'
                        : 'text-[#52525B]'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Menu Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E7E2D8] bg-white px-4 py-4 space-y-4 shadow-xl">
            {/* Pesquisa no Mobile */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar roupas no Brasil..."
                className="w-full bg-[#F5F2EB] border border-[#E7E2D8] text-[#18181B] text-xs rounded-full pl-9 pr-9 py-2.5 focus:outline-none focus:border-[#18181B]"
              />
              <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-3" />
            </form>

            <ul className="space-y-1 divide-y divide-[#F0ECE1] text-xs uppercase tracking-wider font-medium">
              {navCategories.map((cat) => (
                <li key={cat.href} className="pt-2.5 pb-2">
                  <Link
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1 ${
                      cat.highlight ? 'text-[#C26D53] font-semibold' : 'text-[#27272A]'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-[#71717A] py-1"
                >
                  <Settings className="w-4 h-4" />
                  <span>Painel do Lojista</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
