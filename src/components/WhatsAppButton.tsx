"use client";

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  const phone = '5511987654321';
  const message = encodeURIComponent('Olá! Estou no site da Brasil Chic e gostaria de ajuda com um pedido.');
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2">
      {showTooltip && (
        <div className="bg-slate-900 border border-slate-700 text-white text-xs py-2 px-3 rounded-2xl shadow-xl flex items-center gap-2 max-w-xs animate-bounce">
          <span>Dúvidas sobre tamanho ou frete? <strong>Fale conosco!</strong></span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5"
            aria-label="Fechar balão"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 bg-gradient-to-tr from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition transform duration-200 border-2 border-white/20 group"
        title="Atendimento via WhatsApp Oficial"
        aria-label="Atendimento via WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-600" />
        <span className="sr-only">WhatsApp</span>
      </a>
    </div>
  );
}
