"use client";

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Lock,
  CreditCard,
  QrCode,
  FileText,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-20">
      {/* Selos de Confiança e Benefícios */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Frete Rápido Brasil</h4>
              <p className="text-xs text-slate-400 mt-0.5">Envio com rastreio via Correios & Transportadoras</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Troca Grátis 7 Dias</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direito de arrependimento pelo CDC sem custo</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Compra 100% Segura</h4>
              <p className="text-xs text-slate-400 mt-0.5">Criptografia SSL de ponta a ponta</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Suporte Humanizado</h4>
              <p className="text-xs text-slate-400 mt-0.5">Atendimento via WhatsApp e E-mail dedicado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Institucional */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Coluna 1: Sobre */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-400 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-sm">
                🇧🇷
              </div>
              <span className="font-black text-lg tracking-tight text-white">
                BRASIL <span className="text-emerald-400">CHIC</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A marca que traduz o espírito livre, elegante e solar do Brasil. Tecidos nobres
              como linho puro e algodão pima, modelagens exclusivas e foco total em conforto.
            </p>
            <div className="space-y-1 text-xs text-slate-400">
              <p>
                <strong className="text-slate-300">WhatsApp:</strong> (11) 98765-4321
              </p>
              <p>
                <strong className="text-slate-300">E-mail:</strong> contato@brasilchic.com.br
              </p>
              <p>
                <strong className="text-slate-300">Atendimento:</strong> Seg. a Sex. das 09h às 18h
              </p>
            </div>
          </div>

          {/* Coluna 2: Departamentos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Departamentos</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/categoria/masculino" className="hover:text-emerald-400 transition">
                  Moda Masculina
                </Link>
              </li>
              <li>
                <Link href="/categoria/feminino" className="hover:text-emerald-400 transition">
                  Moda Feminina
                </Link>
              </li>
              <li>
                <Link href="/categoria/infantil" className="hover:text-emerald-400 transition">
                  Linha Infantil & Kids
                </Link>
              </li>
              <li>
                <Link href="/categoria/calcados-acessorios" className="hover:text-emerald-400 transition">
                  Calçados & Acessórios
                </Link>
              </li>
              <li>
                <Link href="/promocoes" className="hover:text-yellow-400 transition text-yellow-500 font-semibold">
                  Outlet & Promoções
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Ajuda & Suporte */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Ajuda & Suporte</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/rastreio" className="hover:text-emerald-400 transition">
                  Rastrear Meu Pedido
                </Link>
              </li>
              <li>
                <Link href="/trocas-e-devolucoes" className="hover:text-emerald-400 transition">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/5511987654321"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition"
                >
                  Falar no WhatsApp
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-emerald-400 hover:underline">
                  Acesso Administrativo
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Institucional & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Políticas & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-emerald-400 transition">
                  Privacidade (LGPD)
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="hover:text-emerald-400 transition">
                  Termos e Condições de Uso
                </Link>
              </li>
              <li>
                <Link href="/trocas-e-devolucoes" className="hover:text-emerald-400 transition">
                  Código de Defesa do Consumidor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Formas de Pagamento e Selos de Segurança */}
        <div className="border-t border-slate-800/80 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Formas de Pagamento Aceitas:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" /> Pix (Instantâneo)
              </span>
              <span className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Cartão até 12x
              </span>
              <span className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Boleto Bancário
              </span>
              <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded text-[11px]">
                Visa • Master • Elo • Hipercard
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Segurança & Certificações:
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg flex items-center gap-1.5 text-[11px]">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                SSL 256-Bit Protegido
              </span>
              <span className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Mercado Pago / Stripe
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé Jurídico Obrigatório no Brasil (Lei do E-commerce nº 7.962/2013) */}
        <div className="border-t border-slate-800/80 mt-8 pt-6 text-center text-[11px] text-slate-500 space-y-1.5">
          <p>
            <strong>BRASIL CHIC COMÉRCIO VAREJISTA DE MODA LTDA</strong> — CNPJ: 45.123.789/0001-90
          </p>
          <p>
            Av. Paulista, 1578, Bela Vista, São Paulo - SP, CEP: 01310-200 • Todos os direitos reservados © {new Date().getFullYear()}
          </p>
          <p className="text-[10px] text-slate-600">
            Os preços, promoções e condições de pagamento são válidos exclusivamente para compras realizadas neste site.
          </p>
        </div>
      </div>
    </footer>
  );
}
