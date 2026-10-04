"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Copy,
  Check,
  Zap,
  FileText,
  CreditCard,
  Loader2,
  ArrowLeft,
  Printer,
} from 'lucide-react';
import { formatBRL } from '@/lib/brazil';

export default function OrderPage({ params }: { params: { orderNumber: string } }) {
  const { orderNumber } = params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedPix, setCopiedPix] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderNumber}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (e) {
        console.error('Erro ao carregar pedido:', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber]);

  const handleCopyPix = () => {
    if (order?.pixCopiaECola) {
      navigator.clipboard.writeText(order.pixCopiaECola);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto" />
        <p className="text-sm text-slate-400">Buscando dados do pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white">Pedido não encontrado</h2>
        <p className="text-xs text-slate-400">Verifique o número digitado ou entre em contato com nosso suporte.</p>
        <Link href="/" className="inline-block bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs">
          Voltar à Loja
        </Link>
      </div>
    );
  }

  const statusMap: any = {
    PENDENTE: { label: 'Aguardando Pagamento', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
    PAGO: { label: 'Pagamento Confirmado', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    EM_SEPARACAO: { label: 'Em Separação no Estoque', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    ENVIADO: { label: 'Enviado / Em Trânsito', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    ENTREGUE: { label: 'Entregue com Sucesso', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
    CANCELADO: { label: 'Cancelado', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  };

  const currentStatus = statusMap[order.orderStatus] || statusMap.PENDENTE;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Página Inicial</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Imprimir Comprovante</span>
        </button>
      </div>

      {/* Cartão de Status Principal */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Detalhes do Pedido
            </span>
            <h1 className="text-2xl font-black text-white font-mono">{order.orderNumber}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')} às{' '}
              {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </div>

        {/* Linha do Tempo / Timeline */}
        <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto font-bold">
              ✓
            </div>
            <span className="text-white font-semibold">Realizado</span>
          </div>

          <div className="space-y-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto font-bold ${
                ['PAGO', 'EM_SEPARACAO', 'ENVIADO', 'ENTREGUE'].includes(order.orderStatus)
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {['PAGO', 'EM_SEPARACAO', 'ENVIADO', 'ENTREGUE'].includes(order.orderStatus) ? '✓' : '2'}
            </div>
            <span className="text-slate-300">Pago</span>
          </div>

          <div className="space-y-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto font-bold ${
                ['ENVIADO', 'ENTREGUE'].includes(order.orderStatus)
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {['ENVIADO', 'ENTREGUE'].includes(order.orderStatus) ? '✓' : '3'}
            </div>
            <span className="text-slate-300">Enviado</span>
          </div>

          <div className="space-y-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto font-bold ${
                order.orderStatus === 'ENTREGUE'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {order.orderStatus === 'ENTREGUE' ? '✓' : '4'}
            </div>
            <span className="text-slate-300">Entregue</span>
          </div>
        </div>

        {/* Código de Rastreio */}
        {order.trackingCode && (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs text-slate-400">Código de Rastreamento (Correios):</span>
                <span className="font-mono font-bold text-white block text-sm">{order.trackingCode}</span>
              </div>
            </div>
            <a
              href={`https://rastreamento.correios.com.br/app/index.php?codigo=${order.trackingCode}`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition"
            >
              Rastrear no Correios
            </a>
          </div>
        )}

        {/* Se for Pix pendente, exibe QR Code */}
        {order.paymentMethod === 'PIX' && order.orderStatus === 'PENDENTE' && order.pixQrCode && (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Zap className="w-4 h-4" />
                <span>QR Code Pix para Pagamento</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">
                Expira em 30 min
              </span>
            </div>

            <div className="flex justify-center py-2">
              <div className="p-3 bg-white rounded-2xl shadow-lg">
                <img src={order.pixQrCode} alt="QR Code Pix" className="w-44 h-44" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pix Copia e Cola:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={order.pixCopiaECola}
                  className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyPix}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Itens do Pedido */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white">Peças Compradas</h3>
          <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl p-4 bg-slate-950/60">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{item.productName}</h4>
                  <p className="text-[11px] text-slate-400">
                    Tamanho: {item.size} • Cor: {item.color} • Quantidade: {item.quantity}
                  </p>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {formatBRL(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Informações de Entrega e Pagamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400">
              Endereço de Entrega
            </h4>
            <p><strong>Destinatário:</strong> {order.customerName}</p>
            <p>
              {order.addressStreet}, nº {order.number}
              {order.addressComplement ? ` - ${order.addressComplement}` : ''}
            </p>
            <p>{order.addressNeighborhood} - {order.addressCity} / {order.addressState}</p>
            <p className="font-mono text-slate-400">CEP: {order.addressCep}</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400">
              Resumo Financeiro
            </h4>
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal:</span>
              <span className="font-mono">{formatBRL(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Frete:</span>
              <span className="font-mono">{order.shippingCost === 0 ? 'GRÁTIS' : formatBRL(order.shippingCost)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Descontos:</span>
                <span className="font-mono">-{formatBRL(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800 text-sm">
              <span>Total Pago:</span>
              <span className="text-emerald-400 font-mono">{formatBRL(order.total)}</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Método: <strong>{order.paymentMethod}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
