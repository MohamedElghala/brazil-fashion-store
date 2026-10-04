"use client";

export const dynamic = 'force-static';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  Truck,
  CreditCard,
  QrCode,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowLeft,
  Loader2,
  Check,
  Zap,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  formatBRL,
  validateCPF,
  maskCPF,
  maskCEP,
  maskPhone,
  calculateInstallments,
} from '@/lib/brazil';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    coupon,
    couponDiscount,
    selectedShipping,
    setSelectedShipping,
    clearCart,
  } = useCart();

  // Estados dos formulários
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [cpfError, setCpfError] = useState<string | null>(null);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);

  // Pagamento
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD' | 'BOLETO'>('PIX');
  const [installments, setInstallments] = useState(1);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  // Estado de envio
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Redirecionar se carrinho estiver vazio e nenhum pedido tiver acabado de ser feito
  useEffect(() => {
    if (cart.length === 0 && !orderResult) {
      // Deixar na tela caso queira navegar
    }
  }, [cart, orderResult]);

  // Consulta automática do ViaCEP
  const handleCepChange = async (val: string) => {
    const masked = maskCEP(val);
    setCustomer((prev) => ({ ...prev, cep: masked }));

    const clean = masked.replace(/\D/g, '');
    if (clean.length === 8) {
      setIsSearchingCep(true);
      try {
        const res = await fetch(`/api/cep/${clean}`);
        const data = await res.json();
        if (data.success && data.address) {
          setCustomer((prev) => ({
            ...prev,
            street: data.address.street || '',
            neighborhood: data.address.neighborhood || '',
            city: data.address.city || '',
            state: data.address.state || '',
          }));

          // Buscar opções de frete para este estado
          const shipRes = await fetch('/api/shipping/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cep: clean, state: data.address.state, subtotal }),
          });
          const shipData = await shipRes.json();
          if (shipData.success && shipData.options) {
            setShippingOptions(shipData.options);
            setSelectedShipping(shipData.options[0]);
          }
        }
      } catch (e) {
        console.error('Erro ao buscar CEP:', e);
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  const handleCpfChange = (val: string) => {
    const masked = maskCPF(val);
    setCustomer((prev) => ({ ...prev, cpf: masked }));

    const clean = masked.replace(/\D/g, '');
    if (clean.length === 11) {
      if (!validateCPF(clean)) {
        setCpfError('CPF inválido. Verifique os dígitos informados.');
      } else {
        setCpfError(null);
      }
    } else {
      setCpfError(null);
    }
  };

  // Cálculos financeiros finais
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const pixDiscount = paymentMethod === 'PIX' ? Number(((subtotal - couponDiscount) * 0.05).toFixed(2)) : 0;
  const finalTotal = Math.max(0, Number((subtotal + shippingCost - couponDiscount - pixDiscount).toFixed(2)));

  const installmentOptions = calculateInstallments(subtotal + shippingCost - couponDiscount, 12);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!customer.name.trim()) {
      alert('Por favor, informe seu nome completo.');
      return;
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      alert('Por favor, informe um e-mail válido para receber a confirmação.');
      return;
    }
    if (!validateCPF(customer.cpf)) {
      alert('Por favor, informe um CPF brasileiro válido.');
      return;
    }
    if (!customer.cep || !customer.street || !customer.number || !customer.city) {
      alert('Por favor, preencha o endereço completo de entrega.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: cart,
          shippingOption: selectedShipping,
          paymentMethod,
          couponCode: coupon?.code,
          installments,
          cardDetails: paymentMethod === 'CREDIT_CARD' ? cardData : null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderResult(data);
        clearCart();
      } else {
        alert(data.error || 'Erro ao processar pedido.');
      }
    } catch (err) {
      console.error('Erro na submissão:', err);
      alert('Falha na comunicação com o servidor. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPix = () => {
    if (orderResult?.pixCopiaECola) {
      navigator.clipboard.writeText(orderResult.pixCopiaECola);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  // TELA DE SUCESSO DO PEDIDO
  if (orderResult) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Pedido Registrado com Sucesso
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Obrigado pela sua compra!
            </h1>
            <p className="text-xs text-slate-400">
              Número do Pedido: <strong className="text-white font-mono text-sm">{orderResult.orderNumber}</strong>
            </p>
          </div>

          {/* Instruções do PIX */}
          {paymentMethod === 'PIX' && orderResult.pixCopiaECola && (
            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 text-left space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>PAGAMENTO VIA PIX (Aguardando)</span>
                </div>
                <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/20">
                  Expira em 30 min
                </span>
              </div>

              <div className="flex flex-col items-center justify-center py-2 space-y-3">
                <div className="p-3 bg-white rounded-2xl shadow-xl">
                  <img
                    src={orderResult.pixQrCode}
                    alt="QR Code Pix"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-xs text-slate-400 text-center max-w-sm">
                  Abra o aplicativo do seu banco, escolha <strong>Pagar com Pix</strong> e aponte a câmera para o QR Code acima.
                </p>
              </div>

              {/* Chave Copia e Cola */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ou copie o código Pix Copia e Cola:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={orderResult.pixCopiaECola}
                    className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2.5 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl text-[11px] text-slate-400 space-y-1">
                <p>• A aprovação é automática em poucos segundos pelo Banco Central.</p>
                <p>• Assim que compensar, você receberá a confirmação no e-mail informado.</p>
              </div>
            </div>
          )}

          {/* Instruções do Boleto */}
          {paymentMethod === 'BOLETO' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-left space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Boleto Bancário Gerado</span>
              </div>
              <p className="text-xs text-slate-400">
                Linha Digitável para Pagamento:
              </p>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
                {orderResult.boletoBarcode}
              </div>
              <p className="text-[11px] text-slate-500">
                Vencimento em 3 dias úteis. A compensação bancária ocorre em até 48 horas úteis.
              </p>
            </div>
          )}

          {/* Cartão de Crédito Aprovado */}
          {paymentMethod === 'CREDIT_CARD' && (
            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 text-left space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pagamento Aprovado no Cartão!</span>
              </div>
              <p className="text-xs text-slate-300">
                Seu pagamento foi confirmado com sucesso. Seu pedido já foi encaminhado para a equipe de separação e envio!
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800">
            <Link
              href={`/pedido/${orderResult.orderNumber}`}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl text-xs transition"
            >
              Acompanhar Pedido
            </Link>
            <Link
              href="/"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs transition uppercase"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // TELA DO FORMULÁRIO DE CHECKOUT
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white">Sua sacola está vazia</h2>
        <p className="text-xs text-slate-400">
          Adicione ao menos uma peça ao carrinho antes de prosseguir para o checkout.
        </p>
        <Link
          href="/"
          className="inline-block bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs"
        >
          Voltar às Compras
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Loja</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <Shield className="w-4 h-4" />
          <span>Ambiente Seguro com Criptografia 256-bit</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Coluna Esquerda: Dados e Pagamento (7 colunas) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Dados Pessoais */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Identificação & Contato</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-300">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome e Sobrenome"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">E-mail *</label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com.br"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">WhatsApp / Celular *</label>
                <input
                  type="text"
                  required
                  placeholder="(11) 99999-9999"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: maskPhone(e.target.value) })}
                  maxLength={15}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  CPF (Necessário para Nota Fiscal e Envio) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={customer.cpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  maxLength={14}
                  className={`w-full bg-slate-800 border text-xs rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none ${
                    cpfError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-700 focus:border-emerald-400'
                  }`}
                />
                {cpfError && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{cpfError}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Endereço de Entrega no Brasil */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Endereço de Entrega (Brasil)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>CEP *</span>
                  {isSearchingCep && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Buscando...
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  placeholder="00000-000"
                  value={customer.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  maxLength={9}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-300">Rua / Logradouro *</label>
                <input
                  type="text"
                  required
                  placeholder="Av. Paulista"
                  value={customer.street}
                  onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Número *</label>
                <input
                  type="text"
                  required
                  placeholder="1578"
                  value={customer.number}
                  onChange={(e) => setCustomer({ ...customer, number: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-300">Complemento (Opcional)</label>
                <input
                  type="text"
                  placeholder="Apto 42, Bloco B"
                  value={customer.complement}
                  onChange={(e) => setCustomer({ ...customer, complement: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Bairro *</label>
                <input
                  type="text"
                  required
                  placeholder="Bela Vista"
                  value={customer.neighborhood}
                  onChange={(e) => setCustomer({ ...customer, neighborhood: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Cidade *</label>
                <input
                  type="text"
                  required
                  placeholder="São Paulo"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Estado (UF) *</label>
                <input
                  type="text"
                  required
                  placeholder="SP"
                  maxLength={2}
                  value={customer.state}
                  onChange={(e) => setCustomer({ ...customer, state: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Opções de Envio Selecionadas */}
            {shippingOptions.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <label className="text-xs font-bold text-white block">Escolha a Opção de Envio:</label>
                <div className="space-y-2">
                  {shippingOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                        selectedShipping?.id === opt.id
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-white shadow-md'
                          : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={selectedShipping?.id === opt.id}
                          onChange={() => setSelectedShipping(opt)}
                          className="text-emerald-500 focus:ring-emerald-400"
                        />
                        <div>
                          <span className="font-bold block">{opt.name}</span>
                          <span className="text-[11px] text-slate-400">Prazo: {opt.estimatedLabel}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {opt.isFree ? 'GRÁTIS' : formatBRL(opt.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Forma de Pagamento */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Forma de Pagamento no Brasil</span>
            </h2>

            {/* Tabs de Seleção de Pagamento */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('PIX')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'PIX'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold">PIX</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-extrabold">
                  5% OFF
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-teal-400" />
                <span className="text-xs font-bold">Cartão</span>
                <span className="text-[10px] text-slate-300">Até 12x</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('BOLETO')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'BOLETO'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-5 h-5 text-slate-300" />
                <span className="text-xs font-bold">Boleto</span>
                <span className="text-[10px] text-slate-400">3 dias</span>
              </button>
            </div>

            {/* Painel do PIX */}
            {paymentMethod === 'PIX' && (
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>Pagamento Instantâneo via Pix com 5% de Desconto</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ao finalizar a compra, o QR Code e o código Pix Copia e Cola serão gerados imediatamente na tela. A aprovação é realizada em tempo real pelo Banco Central do Brasil.
                </p>
                <div className="text-[11px] text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  Desconto aplicado no Pix: <strong className="text-emerald-400">{formatBRL(pixDiscount)}</strong>
                </div>
              </div>
            )}

            {/* Painel do Cartão de Crédito */}
            {paymentMethod === 'CREDIT_CARD' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Número do Cartão *</label>
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Nome Impresso no Cartão *</label>
                  <input
                    type="text"
                    required
                    placeholder="NOME COMO NO CARTAO"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white uppercase focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Validade *</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      maxLength={5}
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">CVV *</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      maxLength={4}
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Seletor de Parcelas */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Parcelamento *</label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  >
                    {installmentOptions.map((opt) => (
                      <option key={opt.installments} value={opt.installments}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Painel do Boleto */}
            {paymentMethod === 'BOLETO' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs text-slate-300">
                <p>• O boleto será gerado ao concluir o pedido com vencimento para 3 dias úteis.</p>
                <p>• Pode ser pago em qualquer banco, casa lotérica ou aplicativo bancário.</p>
                <p>• A confirmação pode levar de 1 a 2 dias úteis.</p>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Resumo do Pedido (5 colunas) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 sticky top-24 shadow-xl">
            <h3 className="font-black text-base text-white border-b border-slate-800 pb-3">
              Resumo da Sacola
            </h3>

            {/* Lista dos Itens */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-800/80">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-2 flex gap-3 items-center text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded-lg bg-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      Tam: {item.size} • Cor: {item.color} • Qtd: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-slate-200">
                    {formatBRL(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Linhas de Preço */}
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-200">{formatBRL(subtotal)}</span>
              </div>

              {coupon && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Cupom ({coupon.code}):</span>
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
                    : 'A calcular'}
                </span>
              </div>

              {paymentMethod === 'PIX' && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Desconto Pix (5% OFF):</span>
                  <span className="font-mono">-{formatBRL(pixDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
                <span>Total a Pagar:</span>
                <span className="text-emerald-400 font-mono text-xl">{formatBRL(finalTotal)}</span>
              </div>

              {paymentMethod === 'CREDIT_CARD' && (
                <p className="text-[10px] text-slate-400 text-right">
                  em {installments}x de {formatBRL(finalTotal / installments)} sem juros
                </p>
              )}
            </div>

            {/* Botão de Finalizar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-4 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processando Pedido...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Finalizar e Pagar ({formatBRL(finalTotal)})</span>
                </>
              )}
            </button>

            <div className="text-center">
              <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Seus dados cadastrais e de pagamento estão 100% seguros.
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
