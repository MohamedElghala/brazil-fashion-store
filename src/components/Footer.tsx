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
    <footer className="mt-20 border-t border-[#E7E2D8]">
      {/* 4 Pilares de Confiança e Benefícios (Estilo Amaro / Osklen) */}
      <div className="bg-[#F5F2EB] border-b border-[#E7E2D8] py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#E7E2D8] flex items-center justify-center text-[#C26D53] flex-shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">Frete Rápido Brasil</h4>
              <p className="text-[11px] text-[#71717A] mt-1">Rastreamento via Correios SEDEX e PAC</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#E7E2D8] flex items-center justify-center text-[#C26D53] flex-shrink-0 shadow-sm">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">Troca Fácil 7 Dias</h4>
              <p className="text-[11px] text-[#71717A] mt-1">Primeira troca sem custo (CDC Art. 49)</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#E7E2D8] flex items-center justify-center text-[#2C4A3E] flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">Compra 100% Segura</h4>
              <p className="text-[11px] text-[#71717A] mt-1">Criptografia SSL de ponta a ponta</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#E7E2D8] flex items-center justify-center text-[#C26D53] flex-shrink-0 shadow-sm">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">Suporte Especializado</h4>
              <p className="text-[11px] text-[#71717A] mt-1">Atendimento humanizado via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="bg-[#18181B] text-[#A1A1AA] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Coluna 1: Marca & Missão */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-[0.2em] text-white">
                BRASIL CHIC
              </span>
            </Link>
            <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-sm">
              A marca que traduz o espírito livre, elegante e solar do Brasil. Tecidos nobres como 100% linho puro e algodão pima peruano, modelagens impecáveis e foco total no conforto do dia a dia.
            </p>
            <div className="pt-2 text-xs text-[#D4D4D8] space-y-1">
              <p><strong>WhatsApp:</strong> (11) 98765-4321</p>
              <p><strong>E-mail:</strong> contato@brasilchic.com.br</p>
              <p><strong>Horário:</strong> Segunda a Sexta, 09h às 18h (Brasília)</p>
            </div>
          </div>

          {/* Coluna 2: Departamentos */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Coleções
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/categoria/masculino" className="hover:text-white transition">
                  Moda Masculina
                </Link>
              </li>
              <li>
                <Link href="/categoria/feminino" className="hover:text-white transition">
                  Moda Feminina
                </Link>
              </li>
              <li>
                <Link href="/categoria/infantil" className="hover:text-white transition">
                  Moda Infantil
                </Link>
              </li>
              <li>
                <Link href="/categoria/calcados-acessorios" className="hover:text-white transition">
                  Calçados & Acessórios
                </Link>
              </li>
              <li>
                <Link href="/promocoes" className="text-[#C26D53] hover:text-[#D97757] font-semibold transition">
                  Promoções Especiais
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento & Ajuda */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Ajuda & Suporte
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/rastreio" className="hover:text-white transition">
                  Rastrear Meu Pedido
                </Link>
              </li>
              <li>
                <Link href="/trocas-e-devolucoes" className="hover:text-white transition">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-white transition">
                  Política de Privacidade (LGPD)
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="hover:text-white transition">
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#71717A] hover:text-white transition">
                  Acesso Administrativo
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Meios de Pagamento & Segurança */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Pagamento & Segurança
            </h5>
            <div className="space-y-3">
              <div className="bg-[#27272A] rounded-xl p-3 border border-[#3F3F46]">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <QrCode className="w-4 h-4 text-[#C26D53]" />
                  <span>Pix Banco Central</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] mt-1">5% OFF à vista com aprovação instantânea</p>
              </div>

              <div className="bg-[#27272A] rounded-xl p-3 border border-[#3F3F46]">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <CreditCard className="w-4 h-4 text-[#C26D53]" />
                  <span>Cartões de Crédito</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] mt-1">Parcelamento em até 12x sem juros</p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#71717A] pt-1">
                <Lock className="w-3.5 h-3.5 text-[#2C4A3E]" />
                <span>Ambiente Seguro SSL 256 bits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Legal Obrigatório (Decreto Federal nº 7.962/2013) */}
        <div className="mt-12 pt-8 border-t border-[#27272A] text-[11px] text-[#71717A] leading-relaxed flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} <strong>Brasil Chic Comércio de Roupas Ltda.</strong> — Todos os direitos reservados.
            <br />
            CNPJ: <strong>45.123.789/0001-90</strong> | Av. Paulista, 1578, Bela Vista, São Paulo - SP, CEP 01310-200.
          </p>
          <div className="flex items-center gap-4 text-[#A1A1AA]">
            <span>🇧🇷 Feito com alma brasileira</span>
            <span>•</span>
            <span>Correios SEDEX / PAC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
