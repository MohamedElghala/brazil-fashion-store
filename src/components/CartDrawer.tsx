"use client";

import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Zap,
  Tag,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBRL, maskCEP } from '@/lib/brazil';
import Link from 'next/link';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    coupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    selectedShipping,
    setSelectedShipping,
    total,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // CEP Estimator dentro do carrinho
  const [cepInput, setCepInput] = useState('');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [shippingError, setShippingError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponMessage(null);
    const res = await applyCoupon(couponCodeInput.trim());
    setIsApplyingCoupon(false);

    if (res.success) {
      setCouponMessage({ type: 'success', text: res.message });
      setCouponCodeInput('');
    } else {
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cepInput.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setShippingError('Digite um CEP válido com 8 dígitos.');
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);

    try {
      const res = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cleanCep, subtotal }),
      });
      const data = await res.json();
      if (data.success && data.options) {
        setShippingOptions(data.options);
        // Seleciona a opção econômica por padrão
        setSelectedShipping(data.options[0]);
      } else {
        setShippingError('Não foi possível calcular o frete para este CEP.');
      }
    } catch (err) {
      setShippingError('Erro ao consultar frete.');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const freeShippingGoal = 250;
  const remainingForFreeShipping = Math.max(0, freeShippingGoal - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingGoal) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-white tracking-tight">Sua Sacola</h2>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono border border-emerald-500/20">
                {cart.length} {cart.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Progresso de Frete Grátis */}
          <div className="bg-slate-800/80 p-3 border-b border-slate-700/60">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">
                    Faltam <strong className="text-emerald-400">{formatBRL(remainingForFreeShipping)}</strong> para{' '}
                    <strong className="text-white">Frete Grátis</strong>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold justify-center">
                <CheckCircle2 className="w-4 h-4" />
                <span>Parabéns! Você ganhou FRETE GRÁTIS! 🎉</span>
              </div>
            )}
          </div>

          {/* Itens do Carrinho */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-3xl border border-slate-700">
                  🛍️
                </div>
                <div>
                  <p className="text-base font-bold text-white">Sua sacola está vazia</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Navegue por nossas coleções e escolha suas peças favoritas.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-emerald-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-400 transition"
                >
                  Explorar Roupas
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}-${index}`}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex gap-3 items-center hover:border-slate-600 transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-lg bg-slate-700 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-400 mt-1">
                      <span className="bg-slate-700/80 px-2 py-0.5 rounded text-slate-200">
                        Tamanho: <strong>{item.size}</strong>
                      </span>
                      <span className="bg-slate-700/80 px-2 py-0.5 rounded text-slate-200">
                        Cor: <strong>{item.color}</strong>
                      </span>
                    </div>
                    <div className="text-xs font-black text-emerald-400 mt-1.5 font-mono">
                      {formatBRL(item.price * item.quantity)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-slate-400 hover:text-red-400 p-1 transition"
                      title="Remover peça"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                        }
                        className="px-2 py-0.5 text-slate-400 hover:text-white text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-200 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                        }
                        className="px-2 py-0.5 text-slate-400 hover:text-white text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer do Carrinho */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3.5">
              {/* Cupom de Desconto */}
              <div>
                {coupon ? (
                  <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>
                        Cupom <strong>{coupon.code}</strong> aplicado (-{formatBRL(couponDiscount)})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-red-400 text-[11px] underline"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Cupom (ex: BEMVINDO10)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-400 uppercase font-mono focus:outline-none focus:border-emerald-400"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponCodeInput}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 disabled:opacity-50 transition"
                    >
                      {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
                    </button>
                  </form>
                )}
                {couponMessage && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      couponMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Calcular Frete */}
              <div className="border-t border-slate-800/80 pt-3">
                <form onSubmit={handleCalculateShipping} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Calcular CEP (ex: 01310-200)"
                      value={cepInput}
                      onChange={(e) => setCepInput(maskCEP(e.target.value))}
                      maxLength={9}
                      className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-400 font-mono focus:outline-none focus:border-emerald-400"
                    />
                    <Truck className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={isCalculatingShipping || cepInput.replace(/\D/g, '').length !== 8}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 disabled:opacity-50 transition"
                  >
                    {isCalculatingShipping ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Calcular'}
                  </button>
                </form>

                {shippingError && (
                  <p className="text-[11px] text-red-400 mt-1">{shippingError}</p>
                )}

                {shippingOptions.length > 0 && (
                  <div className="mt-2 space-y-1.5 bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
                    {shippingOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition ${
                          selectedShipping?.id === opt.id
                            ? 'bg-emerald-950/60 border border-emerald-500/30 text-white'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shippingSelect"
                            checked={selectedShipping?.id === opt.id}
                            onChange={() => setSelectedShipping(opt)}
                            className="text-emerald-500 focus:ring-emerald-400"
                          />
                          <div>
                            <span className="font-semibold">{opt.service}</span>
                            <span className="text-[10px] text-slate-400 block">{opt.estimatedLabel}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">
                          {opt.isFree ? 'GRÁTIS' : formatBRL(opt.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Destaque Pix */}
              <div className="bg-emerald-950/50 border border-emerald-500/20 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-300">
                <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Ganhe <strong>5% OFF extra</strong> pagando no <strong>Pix</strong> no checkout!
                </span>
              </div>

              {/* Totais */}
              <div className="space-y-1 text-xs border-t border-slate-800 pt-2.5">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-200">{formatBRL(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Desconto Cupom:</span>
                    <span className="font-mono">-{formatBRL(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Frete:</span>
                  <span className="font-mono text-slate-200">
                    {selectedShipping
                      ? selectedShipping.isFree
                        ? 'GRÁTIS'
                        : formatBRL(selectedShipping.price)
                      : 'A calcular no checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Previsto:</span>
                  <span className="text-emerald-400 font-mono text-lg">{formatBRL(total)}</span>
                </div>
              </div>

              {/* Botão de Finalizar */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition transform active:scale-95 uppercase tracking-wider"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
