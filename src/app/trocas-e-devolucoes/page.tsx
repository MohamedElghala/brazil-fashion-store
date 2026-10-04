import React from 'react';
import Link from 'next/link';
import { RotateCcw, ChevronRight } from 'lucide-react';

export const dynamic = 'force-static';

export default function TrocasEDevolucoesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white transition">Início</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-semibold">Trocas e Devoluções</span>
      </nav>

      <div className="space-y-3">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
          Garantia Legal • Artigo 49 da Lei nº 8.078/1990 (CDC)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Política de Trocas e Devoluções
        </h1>
        <p className="text-xs text-slate-400">
          Processo 100% gratuito, transparente e sem burocracia para clientes em todo o Brasil.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Direito de Arrependimento (7 Dias Corridos)</h2>
          <p>
            Conforme prevê o Artigo 49 do Código de Defesa do Consumidor (CDC), o cliente tem até <strong>7 (sete) dias corridos</strong>, contados a partir da data de recebimento do produto no endereço de entrega, para solicitar a devolução ou troca por qualquer motivo, sem qualquer ônus financeiro.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Como Solicitar a Troca ou Devolução</h2>
          <p>O processo é simples e rápido:</p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-2">
            <li>Entre em contato com nossa equipe pelo WhatsApp <strong>(11) 98765-4321</strong> ou e-mail <strong>trocas@brasilchic.com.br</strong> com o número do seu pedido.</li>
            <li>Enviaremos uma etiqueta de postagem reversa pré-paga dos Correios.</li>
            <li>Embale a peça (com etiquetas intactas e sem sinais de uso ou lavagem) e leve até qualquer agência dos Correios.</li>
            <li>Assim que a peça chegar ao nosso centro de distribuição, você poderá escolher entre: troca de tamanho/cor, vale-compras com bônus ou reembolso integral do valor pago.</li>
          </ol>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Prazos de Reembolso</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li><strong>Pix:</strong> Reembolso creditado na mesma conta de origem em até 24 horas úteis após a conferência do produto.</li>
            <li><strong>Cartão de Crédito:</strong> O estorno será solicitado junto à operadora do cartão e constará em até 2 faturas subsequentes.</li>
            <li><strong>Boleto:</strong> Transferência Pix ou TED para a conta bancária do titular da compra em até 48 horas úteis.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Garantia Contra Defeitos de Fabricação</h2>
          <p>
            Todas as nossas roupas e acessórios possuem <strong>30 dias de garantia</strong> contra eventuais defeitos de costura, tecido ou acabamento, conforme Artigo 26 do CDC.
          </p>
        </section>
      </div>
    </div>
  );
}
