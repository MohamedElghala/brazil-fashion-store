"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Zap,
  Ruler,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  Loader2,
  Share2,
  Heart,
  X,
  CreditCard,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBRL, calculateInstallments, maskCEP } from '@/lib/brazil';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Seleções do cliente
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Modais
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isInstallmentsModalOpen, setIsInstallmentsModalOpen] = useState(false);

  // Simulador de Frete
  const [cepInput, setCepInput] = useState('');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingResults, setShippingResults] = useState<any[]>([]);
  const [shippingError, setShippingError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          if (data.product.images?.length > 0) {
            setSelectedImage(data.product.images[0].url);
          }
          if (data.product.variants?.length > 0) {
            setSelectedSize(data.product.variants[0].size);
            setSelectedColor(data.product.variants[0]);
          }
        }
      } catch (e) {
        console.error('Erro ao carregar detalhes:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto" />
        <p className="text-sm text-slate-400">Carregando detalhes da peça...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-white">Produto não encontrado</h2>
        <p className="text-xs text-slate-400">A peça que você procura pode ter esgotado ou mudado de link.</p>
        <Link
          href="/"
          className="inline-block bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const pixPrice = product.price * 0.95;
  const installmentOptions = calculateInstallments(product.price, 12);
  const maxInstallment = installmentOptions[installmentOptions.length - 1];

  // Cores e tamanhos únicos
  const uniqueColors = Array.from(
    new Map(product.variants.map((v: any) => [v.color, v])).values()
  );
  const uniqueSizes = Array.from(new Set(product.variants.map((v: any) => v.size)));

  const handleAddToCart = (andCheckout = false) => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      size: selectedSize || 'M',
      color: selectedColor?.color || 'Padrão',
      colorHex: selectedColor?.colorHex || '#000000',
      image: selectedImage || product.images[0]?.url,
      quantity,
    });

    if (andCheckout) {
      router.push('/checkout');
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
        body: JSON.stringify({ cep: cleanCep, subtotal: product.price * quantity }),
      });
      const data = await res.json();
      if (data.success && data.options) {
        setShippingResults(data.options);
      } else {
        setShippingError('Não foi possível calcular o frete para este CEP.');
      }
    } catch (err) {
      setShippingError('Erro ao consultar frete.');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white transition">
          Início
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link
          href={`/categoria/${product.category.slug}`}
          className="hover:text-white transition uppercase font-semibold text-emerald-400"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Grid Principal do Produto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Galeria de Fotos */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-emerald-500 text-slate-950 font-black text-xs uppercase px-3 py-1.5 rounded-lg shadow-lg">
                {product.badge}
              </span>
            )}
          </div>

          {/* Miniaturas */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                    selectedImage === img.url
                      ? 'border-emerald-400 ring-2 ring-emerald-500/30'
                      : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações da Peça & Compra */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
              {product.category.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {product.name}
            </h1>

            {/* Avaliações */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-white">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-500 font-medium">
                ({product.reviewCount} avaliações de clientes verificados)
              </span>
            </div>
          </div>

          {/* Preços e Condições de Pagamento */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white font-mono">
                {formatBRL(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through font-mono">
                  {formatBRL(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Caixa Pix */}
            <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">
                    {formatBRL(pixPrice)} no Pix à vista
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Aprovação instantânea com 5% de desconto
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded">
                ECONOMIZE
              </span>
            </div>

            {/* Parcelamento no Cartão */}
            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-slate-400" />
                ou em até <strong>{maxInstallment?.label}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsInstallmentsModalOpen(true)}
                className="text-emerald-400 hover:underline text-[11px] font-semibold"
              >
                Ver parcelas
              </button>
            </div>
          </div>

          {/* Seleção de Cores */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">
                Cor selecionada: <strong className="text-white">{selectedColor?.color}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {uniqueColors.map((col: any) => (
                <button
                  key={col.color}
                  onClick={() => setSelectedColor(col)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition ${
                    selectedColor?.color === col.color
                      ? 'border-emerald-400 bg-slate-800 text-white shadow-md'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-600 shadow-sm"
                    style={{ backgroundColor: col.colorHex }}
                  />
                  <span>{col.color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de Tamanhos e Guia de Medidas */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">
                Tamanho: <strong className="text-white">{selectedSize}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="flex items-center gap-1 text-emerald-400 hover:underline text-[11px] font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Tabela de Medidas</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {uniqueSizes.map((sz: any) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-12 h-11 rounded-xl text-xs font-mono font-bold transition border flex items-center justify-center ${
                    selectedSize === sz
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade e Botões de Compra */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-700 rounded-xl bg-slate-900 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-400 hover:text-white transition"
                  aria-label="Diminuir"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-white font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-400 hover:text-white transition"
                  aria-label="Aumentar"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition active:scale-95 shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Adicionar à Sacola</span>
              </button>
            </div>

            <button
              onClick={() => handleAddToCart(true)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-4 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition transform active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Comprar Agora (Checkout Rápido)</span>
            </button>
          </div>

          {/* Simulador de Frete por CEP */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Calcular Frete e Prazo de Entrega</span>
            </div>

            <form onSubmit={handleCalculateShipping} className="flex gap-2">
              <input
                type="text"
                placeholder="Digite seu CEP (ex: 01310-200)"
                value={cepInput}
                onChange={(e) => setCepInput(maskCEP(e.target.value))}
                maxLength={9}
                className="flex-1 bg-slate-800 border border-slate-700 text-xs rounded-xl px-3 py-2.5 text-white placeholder-slate-400 font-mono focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={isCalculatingShipping || cepInput.replace(/\D/g, '').length !== 8}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs disabled:opacity-50 transition"
              >
                {isCalculatingShipping ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Calcular'}
              </button>
            </form>

            {shippingError && (
              <p className="text-xs text-red-400">{shippingError}</p>
            )}

            {shippingResults.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {shippingResults.map((opt: any) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800"
                  >
                    <div>
                      <span className="font-bold text-white block">{opt.service}</span>
                      <span className="text-[11px] text-slate-400">{opt.estimatedLabel}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {opt.isFree ? 'GRÁTIS' : formatBRL(opt.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vantagens e Garantias */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Troca grátis em até 7 dias corridos</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Garantia de 30 dias contra defeitos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Abas de Detalhes da Peça */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <h3 className="text-xl font-black text-white">Detalhes & Composição</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-300">
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-emerald-400">
              Descrição do Produto
            </h4>
            <p className="leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-emerald-400">
              Composição & Tecido
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>100% Fibras Nobres selecionadas</li>
              <li>Toque macio com sensação térmica refrescante</li>
              <li>Modelagem pré-encolhida (não deforma na lavagem)</li>
              <li>Costuras reforçadas padrão alfaiataria</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-emerald-400">
              Cuidados de Lavagem
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>Lavar à mão ou em ciclo delicado na máquina</li>
              <li>Não utilizar alvejantes à base de cloro</li>
              <li>Secagem natural à sombra recomendada</li>
              <li>Passar a ferro em temperatura máxima de 110°C</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Tabela de Medidas (Size Guide) */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Tabela de Medidas (cm)</h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Consulte a tabela abaixo para escolher o tamanho ideal de acordo com as medidas do seu corpo:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800 text-slate-200">
                  <tr>
                    <th className="p-2.5 rounded-l-lg">Tamanho</th>
                    <th className="p-2.5">Tórax / Busto</th>
                    <th className="p-2.5">Cintura</th>
                    <th className="p-2.5 rounded-r-lg">Quadril</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-white">P (36-38)</td>
                    <td className="p-2.5">88 - 94 cm</td>
                    <td className="p-2.5">74 - 80 cm</td>
                    <td className="p-2.5">92 - 98 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">M (40-42)</td>
                    <td className="p-2.5">95 - 102 cm</td>
                    <td className="p-2.5">81 - 88 cm</td>
                    <td className="p-2.5">99 - 106 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">G (44-46)</td>
                    <td className="p-2.5">103 - 110 cm</td>
                    <td className="p-2.5">89 - 96 cm</td>
                    <td className="p-2.5">107 - 114 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">GG (48-50)</td>
                    <td className="p-2.5">111 - 118 cm</td>
                    <td className="p-2.5">97 - 104 cm</td>
                    <td className="p-2.5">115 - 122 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Parcelamento Completo */}
      {isInstallmentsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Opções de Parcelamento</h3>
              </div>
              <button
                onClick={() => setIsInstallmentsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Parcelamento no cartão de crédito em até 12x sem juros:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800 text-xs">
              {installmentOptions.map((opt) => (
                <div key={opt.installments} className="flex justify-between py-2 text-slate-300">
                  <span>{opt.installments}x de {formatBRL(opt.installmentValue)}</span>
                  <span className="text-emerald-400 font-semibold">sem juros</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setIsInstallmentsModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 border-t border-slate-800 pt-12">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Você Também Pode Gostar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rel: any) => (
              <Link
                key={rel.id}
                href={`/produto/${rel.slug}`}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition group flex flex-col justify-between p-3"
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 mb-3">
                  <img
                    src={rel.images[0]?.url}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{rel.name}</h4>
                  <div className="text-xs font-mono font-black text-emerald-400 mt-1">
                    {formatBRL(rel.price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
