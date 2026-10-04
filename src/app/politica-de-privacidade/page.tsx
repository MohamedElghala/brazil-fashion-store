import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const dynamic = 'force-static';

export default function PoliticaPrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white transition">Início</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-semibold">Política de Privacidade</span>
      </nav>

      <div className="space-y-3">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
          Em Conformidade com a Lei nº 13.709/2018 (LGPD)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Política de Privacidade & Proteção de Dados
        </h1>
        <p className="text-xs text-slate-400">Última atualização: Outubro de 2026</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Introdução e Compromisso</h2>
          <p>
            A <strong>BRASIL CHIC COMÉRCIO VAREJISTA DE MODA LTDA</strong>, inscrita no CNPJ sob o nº <strong>45.123.789/0001-90</strong>, com sede na Av. Paulista, 1578, São Paulo - SP, reconhece a importância da privacidade de seus clientes e se compromete a proteger os dados pessoais coletados de acordo com a Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018 - LGPD).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Dados Pessoais Coletados</h2>
          <p>Coletamos apenas os dados estritamente necessários para a execução do contrato de compra e venda:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li><strong>Identificação:</strong> Nome completo e Cadastro de Pessoas Físicas (CPF), obrigatório por exigência fiscal da Receita Federal do Brasil para emissão da Nota Fiscal Eletrônica (NF-e).</li>
            <li><strong>Contato:</strong> E-mail e telefone/WhatsApp para envio de notificações do status do pedido e código de rastreamento.</li>
            <li><strong>Entrega:</strong> Endereço completo com CEP para viabilizar a remessa física pelos Correios e transportadoras parceiras.</li>
            <li><strong>Pagamento:</strong> Dados processados em ambiente seguro e criptografado pelos gateways de pagamento homologados (Mercado Pago, Stripe, Banco Central do Brasil para Pix). Não armazenamos números de cartão de crédito em nossos servidores.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Finalidade do Tratamento dos Dados</h2>
          <p>
            Os dados coletados destinam-se exclusivamente a: processar transações comerciais, emitir documentos fiscais, realizar entregas, prestar suporte ao cliente e cumprir obrigações legais brasileiras.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Seus Direitos como Titular de Dados</h2>
          <p>Conforme previsto no Art. 18 da LGPD, você possui direito a:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li>Confirmar a existência de tratamento de dados;</li>
            <li>Acessar e retificar seus dados pessoais a qualquer momento;</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>Revogar o consentimento para comunicações de marketing.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">5. Encarregado pelo Tratamento de Dados (DPO)</h2>
          <p>
            Para exercer quaisquer dos seus direitos ou esclarecer dúvidas, entre em contato com nosso Encarregado de Dados pelo e-mail: <strong className="text-emerald-400">privacidade@brasilchic.com.br</strong> ou pelo WhatsApp oficial (11) 98765-4321.
          </p>
        </section>
      </div>
    </div>
  );
}
