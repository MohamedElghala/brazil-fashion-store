import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-static';

export default function TermosDeUsoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white transition">Início</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-semibold">Termos de Uso</span>
      </nav>

      <div className="space-y-3">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
          Condições Gerais de Compra e Navegação
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Termos e Condições de Uso
        </h1>
        <p className="text-xs text-slate-400">Vigência: 2026 • Legislação Brasileira Aplicável</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Objeto e Aplicação</h2>
          <p>
            O presente documento estabelece os Termos e Condições Gerais aplicáveis ao uso do site de comércio eletrônico operado por <strong>BRASIL CHIC COMÉRCIO VAREJISTA DE MODA LTDA</strong> (CNPJ 45.123.789/0001-90). Ao navegar pelo site ou efetuar compras, o usuário concorda integralmente com as condições estipuladas.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Preços e Formas de Pagamento</h2>
          <p>
            Todos os preços divulgados na plataforma estão expressos em Moeda Corrente Nacional (Reais - R$) e incluem os tributos aplicáveis no Brasil.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li><strong>Pix:</strong> Processamento em tempo real com QR Code dinâmico regulamentado pelo Banco Central do Brasil, concedendo desconto promocional de 5% à vista.</li>
            <li><strong>Cartão de Crédito:</strong> Parcelamento em até 12x sem juros, condicionado à análise antifraude e aprovação da emissora do cartão.</li>
            <li><strong>Boleto Bancário:</strong> Vencimento em até 3 dias úteis. Não havendo quitação até o vencimento, o pedido será cancelado automaticamente.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Prazos e Condições de Entrega</h2>
          <p>
            Os prazos de entrega informados no cálculo por CEP começam a contar a partir do primeiro dia útil seguinte à confirmação do pagamento. As entregas são realizadas via Correios (SEDEX / PAC) ou transportadoras privadas homologadas em território nacional.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Foro de Eleição</h2>
          <p>
            Fica eleito o Foro da Comarca de São Paulo - SP para dirimir qualquer dúvida ou litígio decorrente destes Termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja, ressalvadas as disposições protetivas ao consumidor do CDC.
          </p>
        </section>
      </div>
    </div>
  );
}
