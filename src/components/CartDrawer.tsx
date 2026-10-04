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
  ShoppingBag,
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

  // CEP Estimator
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
  const pixPrice = total * 0.95;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#18181B]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] border-l border-[#E7E2D8] text-[#18181B] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#E7E2D8] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C26D53]" />
              <h2 className="font-serif text-xl font-bold text-[#18181B] tracking-tight">Sua Sacola</h2>
              <span className="text-[11px] bg-[#F5F2EB] text-[#71717A] px-2.5 py-0.5 rounded-full font-mono font-medium border border-[#E7E2D8]">
                {cart.length} {cart.length === 1 ? 'peça' : 'peças'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#71717A] hover:text-[#18181B] rounded-lg hover:bg-[#F5F2EB] transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Progresso de Frete Grátis */}
          <div className="bg-[#F5F2EB] p-4 border-b border-[#E7E2D8]">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#52525B]">
                    Faltam <strong className="text-[#C26D53] font-semibold">{formatBRL(remainingForFreeShipping)}</strong> para{' '}
                    <strong className="text-[#18181B]">Frete Grátis</strong>
                  </span>
                  <span className="text-[#71717A] font-mono text-[11px] font-medium">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-[#E7E2D8] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C26D53] h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#2C4A3E] font-bold justify-center bg-[#EBF3ED] py-2 px-3 rounded-lg border border-[#CDE0D3]">
                <CheckCircle2 className="w-4 h-4 text-[#2C4A3E]" />
                <span>Parabéns! Você ganhou FRETE GRÁTIS para todo o Brasil! ✨</span>
              </div>
            )}
          </div>

          {/* Itens do Carrinho */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-[#71717A] space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F5F2EB] mx-auto flex items-center justify-center text-3xl border border-[#E7E2D8]">
                  🛍️
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-[#18181B]">Sua sacola está vazia</p>
                  <p className="text-xs text-[#71717A] mt-1 max-w-xs mx-auto">
                    Conheça nossa seleção de alta costura e adicione suas peças favoritas.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#18181B] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#C26D53] transition"
                >
                  Explorar Coleção
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}-${index}`}
                  className="bg-white border border-[#E7E2D8] rounded-xl p-3.5 flex gap-3.5 items-center hover:border-[#D6CEC1] transition shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-lg bg-[#F5F2EB] flex-shrink-0 border border-[#E7E2D8]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-[#18181B] truncate">{item.name}</h4>
                    <div className="flex flex-wrap gap-1.5 text-[10px] text-[#71717A] mt-1">
                      <span className="bg-[#F5F2EB] px-2 py-0.5 rounded text-[#18181B] font-medium border border-[#E7E2D8]">
                        Tam: <strong>{item.size}</strong>
                      </span>
                      <span className="bg-[#F5F2EB] px-2 py-0.5 rounded text-[#18181B] font-medium border border-[#E7E2D8]">
                        Cor: <strong>{item.color}</strong>
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[#18181B] mt-1.5">
                      {formatBRL(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* Controle de Quantidade */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-[#A1A1AA] hover:text-[#C26D53] p-1 transition"
                      aria-label="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-[#E7E2D8] rounded-lg bg-[#FBF9F5] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="px-2 py-1 text-[#71717A] hover:bg-[#E7E2D8] transition"
                        aria-label="Diminuir"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-1 text-xs font-semibold text-[#18181B] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="px-2 py-1 text-[#71717A] hover:bg-[#E7E2D8] transition"
                        aria-label="Aumentar"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer com Cálculos e Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-[#E7E2D8] bg-white space-y-3">
              {/* Cupom de Desconto */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between bg-[#EBF3ED] text-[#2C4A3E] px-3 py-2 rounded-lg text-xs border border-[#CDE0D3]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      Cupom <strong>{coupon.code}</strong> ({coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `R$ ${coupon.discountValue} OFF`})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-[#C26D53] hover:underline font-semibold text-[11px]"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código do Cupom"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#F5F2EB] border border-[#E7E2D8] rounded-lg px-3 py-2 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:border-[#C26D53]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon}
                      className="bg-[#18181B] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#C26D53] transition disabled:opacity-50"
                    >
                      {isApplyingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Aplicar'}
                    </button>
                  </form>
                )}
                {couponMessage && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      couponMessage.type === 'success' ? 'text-[#2C4A3E]' : 'text-red-600'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Totais */}
              <div className="space-y-1.5 pt-2 border-t border-[#F5F2EB] text-xs">
                <div className="flex justify-between text-[#71717A]">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#18181B]">{formatBRL(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#2C4A3E] font-medium">
                    <span>Desconto do Cupom:</span>
                    <span>-{formatBRL(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#71717A]">
                  <span>Frete estimado:</span>
                  <span>
                    {selectedShipping ? (
                      selectedShipping.price === 0 ? (
                        <strong className="text-[#2C4A3E]">Grátis</strong>
                      ) : (
                        formatBRL(selectedShipping.price)
                      )
                    ) : (
                      'Calculado no checkout'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#18181B] pt-2 border-t border-[#E7E2D8]">
                  <span>Total:</span>
                  <span>{formatBRL(total)}</span>
                </div>
                <div className="bg-[#EBF3ED] text-[#2C4A3E] p-2 rounded-lg flex items-center justify-between text-[11px] font-medium border border-[#CDE0D3]">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    No Pix com 5% de desconto:
                  </span>
                  <strong className="text-xs">{formatBRL(pixPrice)}</strong>
                </div>
              </div>

              {/* Botão Finalizar Compra */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#18181B] hover:bg-[#C26D53] text-white py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-300 shadow-md group"
              >
                <span>Avançar para Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
