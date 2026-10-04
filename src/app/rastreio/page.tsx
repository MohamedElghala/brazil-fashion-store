"use client";

export const dynamic = 'force-static';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Search, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RastreioPage() {
  const router = useRouter();
  const [orderQuery, setOrderQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = orderQuery.trim().toUpperCase();

    if (!clean) {
      setError('Por favor, informe o número do pedido.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${clean}`);
      const data = await res.json();
      if (data.success && data.order) {
        router.push(`/pedido/${clean}`);
      } else {
        setError('Pedido não encontrado. Verifique o código (ex: BR-202610-123456).');
      }
    } catch (err) {
      setError('Erro ao consultar o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Rastrear Meu Pedido</h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Digite o número do seu pedido recebido no e-mail para acompanhar a separação, envio e código dos Correios.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Número do Pedido (ex: BR-202610-849201)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="BR-XXXXXX-XXXXXX"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
                className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl pl-10 pr-4 py-3 text-white font-mono uppercase focus:outline-none focus:border-emerald-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-500/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !orderQuery.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Consultar Status</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>Precisa de ajuda com seu pedido? </span>
          <a
            href="https://wa.me/5511987654321"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 font-bold hover:underline"
          >
            Chame no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
