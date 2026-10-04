"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Truck,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  QrCode,
  CreditCard,
  DollarSign,
  TrendingUp,
  Search,
  Lock,
  Eye,
  Loader2,
  RefreshCw,
  Building2,
  Phone,
  Mail,
  Save,
} from 'lucide-react';
import { formatBRL } from '@/lib/brazil';

export default function AdminPage() {
  // Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('admin@brazilfashion.com.br');
  const [loginPassword, setLoginPassword] = useState('AdminPassword2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navegação Interna
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'coupons' | 'shipping' | 'settings'
  >('overview');

  // Estados dos Dados
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [settingsData, setSettingsData] = useState<any>({});

  const [loadingData, setLoadingData] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Modais de Criação
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isNewCouponOpen, setIsNewCouponOpen] = useState(false);

  // Formulário Novo Produto
  const [newProduct, setNewProduct] = useState({
    name: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    badge: '',
    description: '',
    imageUrl: '',
    sizes: 'P, M, G, GG',
    colors: 'Preto, Branco, Azul',
  });

  // Formulário Novo Cupom
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderValue: '100',
  });

  // Checar sessão ao carregar
  useEffect(() => {
    const savedAdmin = localStorage.getItem('brasil_chic_admin');
    if (savedAdmin) {
      try {
        setAdminUser(JSON.parse(savedAdmin));
        setIsAuthenticated(true);
      } catch (e) {}
    }
  }, []);

  // Carregar dados quando autenticado ou mudar de aba
  useEffect(() => {
    if (isAuthenticated) {
      loadAllAdminData();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success && data.admin) {
        setIsAuthenticated(true);
        setAdminUser(data.admin);
        localStorage.setItem('brasil_chic_admin', JSON.stringify(data.admin));
      } else {
        setLoginError(data.error || 'Credenciais inválidas.');
      }
    } catch (err) {
      setLoginError('Falha ao conectar com o servidor.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('brasil_chic_admin');
  };

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      if (activeTab === 'overview') {
        const res = await fetch('/api/admin/overview');
        const data = await res.json();
        if (data.success) {
          setOverviewStats(data.stats);
          setOrders(data.recentOrders || []);
        }
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        if (data.success) setOrders(data.orders || []);
      } else if (activeTab === 'products') {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        if (data.success) setProducts(data.products || []);
      } else if (activeTab === 'coupons') {
        const res = await fetch('/api/admin/coupons');
        const data = await res.json();
        if (data.success) setCoupons(data.coupons || []);
      } else if (activeTab === 'shipping') {
        const res = await fetch('/api/admin/shipping');
        const data = await res.json();
        if (data.success) setShippingRates(data.rates || []);
      } else if (activeTab === 'settings') {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success) setSettingsData(data.settings || {});
      }
    } catch (e) {
      console.error('Erro ao buscar dados admin:', e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, orderStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, orderStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus } : o))
        );
      }
    } catch (e) {
      alert('Erro ao atualizar status');
    }
  };

  const handleUpdateTrackingCode = async (orderId: string, trackingCode: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, trackingCode }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, trackingCode } : o))
        );
        alert('Código de rastreamento salvo com sucesso!');
      }
    } catch (e) {
      alert('Erro ao salvar rastreamento');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta peça do catálogo?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (e) {
      alert('Erro ao excluir produto');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sizesArray = newProduct.sizes.split(',').map((s) => s.trim());
      const colorsArray = newProduct.colors.split(',').map((c) => c.trim());

      const variants = sizesArray.flatMap((size) =>
        colorsArray.map((color) => ({
          size,
          color,
          colorHex: color.toLowerCase() === 'branco' ? '#FFFFFF' : '#111827',
          stock: 15,
        }))
      );

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          categoryId: newProduct.categoryId || 'todos',
          price: parseFloat(newProduct.price),
          originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
          badge: newProduct.badge || null,
          description: newProduct.description,
          images: [newProduct.imageUrl || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'],
          variants,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsNewProductOpen(false);
        loadAllAdminData();
        alert('Produto cadastrado com sucesso!');
      }
    } catch (err) {
      alert('Erro ao cadastrar produto');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });
      const data = await res.json();
      if (data.success) {
        setIsNewCouponOpen(false);
        setNewCoupon({ code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderValue: '100' });
        loadAllAdminData();
      }
    } catch (e) {
      alert('Erro ao cadastrar cupom');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Remover este cupom?')) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      alert('Erro ao deletar cupom');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('Configurações bancárias e da loja salvas com sucesso no banco!');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      }
    } catch (e) {
      alert('Erro ao salvar configurações');
    }
  };

  // TELA DE LOGIN DO ADMIN
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl mx-auto shadow-lg shadow-emerald-500/20">
            🇧🇷
          </div>
          <h1 className="text-2xl font-black text-white">Painel do Lojista</h1>
          <p className="text-xs text-slate-400">
            Acesso restrito para administração de vendas, pedidos e configurações bancárias no Brasil
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">E-mail Administrativo</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Senha de Acesso</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/20 p-2.5 rounded-xl">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </form>

          <div className="text-[11px] text-slate-500 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <p><strong>Credenciais Padrão do Sistema:</strong></p>
            <p>E-mail: <code className="text-emerald-400">admin@brazilfashion.com.br</code></p>
            <p>Senha: <code className="text-emerald-400">AdminPassword2026!</code></p>
          </div>
        </div>
      </div>
    );
  }

  // PAINEL AUTENTICADO
  return (
    <div className="space-y-8">
      {/* Top Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            🇧🇷
          </div>
          <div>
            <h1 className="text-base font-black text-white">Painel de Gestão da Loja</h1>
            <p className="text-[11px] text-slate-400">
              Conectado como <strong className="text-slate-200">{adminUser?.name || 'Administrador'}</strong> ({adminUser?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllAdminData}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 transition"
            title="Atualizar Dados"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Barra de Abas do Admin */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {[
          { id: 'overview', label: 'Visão Geral & Métricas', icon: LayoutDashboard },
          { id: 'orders', label: 'Gestão de Pedidos', icon: ShoppingBag },
          { id: 'products', label: 'Catálogo & Estoque', icon: Package },
          { id: 'coupons', label: 'Cupons de Desconto', icon: Tag },
          { id: 'shipping', label: 'Tabela de Fretes', icon: Truck },
          { id: 'settings', label: 'Configurações & Bancos', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. ABA: VISÃO GERAL */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Cards de Métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Faturamento Total</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {formatBRL(overviewStats?.totalRevenue || 0)}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                ● Vendas aprovadas e entregues
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total de Pedidos</span>
                <ShoppingBag className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {overviewStats?.totalOrders || 0}
              </div>
              <span className="text-[10px] text-slate-400">
                {overviewStats?.pendingOrdersCount || 0} aguardando pagamento
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Ticket Médio</span>
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {formatBRL(overviewStats?.averageTicket || 0)}
              </div>
              <span className="text-[10px] text-slate-400">Por pedido pago</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Peças no Catálogo</span>
                <Package className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {overviewStats?.productsCount || 0}
              </div>
              <span className="text-[10px] text-emerald-400">100% ativas para venda</span>
            </div>
          </div>

          {/* Tabela de Pedidos Recentes */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white">Últimos Pedidos Registrados</h3>
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Nenhum pedido recebido ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="p-3 rounded-l-xl">Pedido</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">CPF</th>
                      <th className="p-3">Método</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {orders.slice(0, 8).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-white">{order.orderNumber}</td>
                        <td className="p-3">{order.customerName}</td>
                        <td className="p-3 font-mono text-slate-400">{order.customerCpf}</td>
                        <td className="p-3 font-semibold text-emerald-400">{order.paymentMethod}</td>
                        <td className="p-3 font-mono font-bold">{formatBRL(order.total)}</td>
                        <td className="p-3">
                          <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <Link
                            href={`/pedido/${order.orderNumber}`}
                            className="text-emerald-400 hover:underline"
                          >
                            Ver Detalhes
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. ABA: GESTÃO DE PEDIDOS */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Todos os Pedidos Recebidos</h3>
            <span className="text-xs text-slate-400">{orders.length} pedidos no total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="p-3 rounded-l-xl">Número</th>
                  <th className="p-3">Cliente & Contato</th>
                  <th className="p-3">Cidade / UF</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status Atual</th>
                  <th className="p-3">Rastreio (Correios)</th>
                  <th className="p-3 rounded-r-xl">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-white">
                      <Link href={`/pedido/${o.orderNumber}`} className="hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{o.customerName}</div>
                      <div className="text-[11px] text-slate-400">{o.customerPhone}</div>
                    </td>
                    <td className="p-3">
                      {o.addressCity} / {o.addressState}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {formatBRL(o.total)}
                    </td>
                    <td className="p-3">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2 py-1 text-white focus:outline-none focus:border-emerald-400"
                      >
                        <option value="PENDENTE">Pendente</option>
                        <option value="PAGO">Pago</option>
                        <option value="EM_SEPARACAO">Em Separação</option>
                        <option value="ENVIADO">Enviado</option>
                        <option value="ENTREGUE">Entregue</option>
                        <option value="CANCELADO">Cancelado</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="text"
                          defaultValue={o.trackingCode || ''}
                          placeholder="Ex: QB123456789BR"
                          onBlur={(e) => handleUpdateTrackingCode(o.id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-slate-200 px-2 py-1 rounded text-[11px] font-mono uppercase w-32 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/pedido/${o.orderNumber}`}
                        className="text-emerald-400 hover:underline font-semibold"
                      >
                        Abrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ABA: PRODUTOS & ESTOQUE */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Catálogo de Produtos</h3>
              <p className="text-xs text-slate-400">Gerencie fotos, preços e variações</p>
            </div>
            <button
              onClick={() => setIsNewProductOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Produto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-3 items-center justify-between shadow-lg"
              >
                <img
                  src={p.images[0]?.url}
                  alt={p.name}
                  className="w-16 h-20 object-cover rounded-xl bg-slate-800 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold">
                    {p.category.name}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    {formatBRL(p.price)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {p.variants?.length || 0} variações de tamanho/cor
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                  title="Excluir Peça"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Modal Novo Produto */}
          {isNewProductOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
                <h3 className="font-bold text-base text-white">Cadastrar Nova Peça no Catálogo</h3>
                <form onSubmit={handleCreateProduct} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-300">Nome do Produto *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Camisa de Linho Manga Longa"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-300">Preço de Venda (R$) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="149.90"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300">Preço Original (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="199.90"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">URL da Imagem *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Descrição do Produto</label>
                    <textarea
                      rows={2}
                      placeholder="100% Linho puro, caimento impecável..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewProductOpen(false)}
                      className="bg-slate-800 text-white text-xs px-4 py-2 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-500 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl"
                    >
                      Salvar Produto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. ABA: CUPONS DE DESCONTO */}
      {activeTab === 'coupons' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Cupons Ativos</h3>
            <button
              onClick={() => setIsNewCouponOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cupom</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-bold text-emerald-400 text-base">{c.code}</span>
                  <p className="text-xs text-slate-300 mt-1">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `R$ ${c.discountValue} OFF`}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Mínimo: R$ {c.minOrderValue.toFixed(2)} • Usado: {c.usedCount}x
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCoupon(c.id)}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Modal Novo Cupom */}
          {isNewCouponOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
                <h3 className="font-bold text-white text-sm">Criar Cupom Promocional</h3>
                <form onSubmit={handleCreateCoupon} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-300">Código (ex: VERÃO10)</label>
                    <input
                      type="text"
                      required
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300">Desconto (% ou R$)</label>
                    <input
                      type="number"
                      required
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewCouponOpen(false)}
                      className="bg-slate-800 text-white text-xs px-3 py-2 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      Salvar Cupom
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. ABA: TABELA DE FRETES */}
      {activeTab === 'shipping' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white">Taxas de Frete por Estado / Região</h3>
          <p className="text-xs text-slate-400">
            Valores base cobrados no checkout antes da ativação da integração dos Correios / Melhor Envio
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="p-3 rounded-l-xl">Estado / Região</th>
                  <th className="p-3">Serviço</th>
                  <th className="p-3">Valor Base</th>
                  <th className="p-3">Prazo Estimado</th>
                  <th className="p-3 rounded-r-xl">Frete Grátis A Partir De</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {shippingRates.map((r) => (
                  <tr key={r.id}>
                    <td className="p-3 font-bold font-mono text-white">{r.state}</td>
                    <td className="p-3">{r.name}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{formatBRL(r.price)}</td>
                    <td className="p-3">{r.estimatedDays} dias úteis</td>
                    <td className="p-3 font-mono">
                      {r.freeShippingMin ? formatBRL(r.freeShippingMin) : 'Não aplicável'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. ABA: CONFIGURAÇÕES BANCÁRIAS & GATEWAYS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {saveSuccessMsg && (
            <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-4 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Configurações Pix do Banco Central */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-800 pb-3">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <span>Configuração Oficial da Chave Pix (Banco Central do Brasil)</span>
            </div>
            <p className="text-xs text-slate-400">
              Esses dados alimentam a geração do QR Code EMVCo e do código Copia e Cola para depósitos diretos na sua conta bancária no Brasil.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Chave Pix (E-mail, CNPJ, Celular ou EVP) *
                </label>
                <input
                  type="text"
                  required
                  value={settingsData['pix_key'] || ''}
                  onChange={(e) => setSettingsData({ ...settingsData, pix_key: e.target.value })}
                  placeholder="contato@brasilchic.com.br"
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Nome do Favorecido (Como no Banco) *
                </label>
                <input
                  type="text"
                  required
                  value={settingsData['pix_receiver_name'] || ''}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, pix_receiver_name: e.target.value })
                  }
                  placeholder="Brasil Chic Moda Ltda"
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Cidade Cadastrada da Chave *
                </label>
                <input
                  type="text"
                  required
                  value={settingsData['pix_receiver_city'] || ''}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, pix_receiver_city: e.target.value })
                  }
                  placeholder="SAO PAULO"
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white uppercase"
                />
              </div>
            </div>
          </div>

          {/* Configurações Mercado Pago & Stripe */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-800 pb-3">
              <CreditCard className="w-5 h-5 text-teal-400" />
              <span>Gateways de Pagamento (Mercado Pago & Stripe Brasil)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Mercado Pago - Public Key
                </label>
                <input
                  type="text"
                  value={settingsData['mercadopago_public_key'] || ''}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, mercadopago_public_key: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Mercado Pago - Access Token
                </label>
                <input
                  type="password"
                  value={settingsData['mercadopago_access_token'] || ''}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, mercadopago_access_token: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Stripe - Publishable Key
                </label>
                <input
                  type="text"
                  value={settingsData['stripe_public_key'] || ''}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, stripe_public_key: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Stripe - Secret Key
                </label>
                <input
                  type="password"
                  value={settingsData['stripe_secret_key'] || ''}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, stripe_secret_key: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Dados Fiscais da Loja */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-800 pb-3">
              <Building2 className="w-5 h-5 text-yellow-400" />
              <span>Dados Fiscais & Contato da Empresa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Nome Comercial</label>
                <input
                  type="text"
                  value={settingsData['store_name'] || ''}
                  onChange={(e) => setSettingsData({ ...settingsData, store_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">CNPJ da Empresa</label>
                <input
                  type="text"
                  value={settingsData['store_cnpj'] || ''}
                  onChange={(e) => setSettingsData({ ...settingsData, store_cnpj: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">WhatsApp de Atendimento</label>
                <input
                  type="text"
                  value={settingsData['store_phone'] || ''}
                  onChange={(e) => setSettingsData({ ...settingsData, store_phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Todas as Configurações</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
