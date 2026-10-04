"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  size: string;
  color: string;
  colorHex?: string;
  image: string;
  quantity: number;
}

export interface CouponData {
  code: string;
  discountType: string;
  discountValue: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  service: string;
  price: number;
  originalPrice: number;
  isFree: boolean;
  estimatedDays: number;
  estimatedLabel: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  coupon: CouponData | null;
  couponDiscount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  selectedShipping: ShippingOption | null;
  setSelectedShipping: (option: ShippingOption | null) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<CouponData | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  // Carregar carrinho e cupom do LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('brasil_chic_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao ler carrinho do cache:', e);
      }
    }

    const savedCoupon = localStorage.getItem('brasil_chic_coupon');
    if (savedCoupon) {
      try {
        const parsed = JSON.parse(savedCoupon);
        setCoupon(parsed.coupon);
        setCouponDiscount(parsed.discount);
      } catch (e) {
        console.error('Erro ao ler cupom do cache:', e);
      }
    }
  }, []);

  // Salvar no LocalStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('brasil_chic_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qty = product.quantity || 1;
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.size === product.size && item.color === product.color
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size && item.color === product.color
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size && item.color === color)));
  };

  const updateQuantity = (id: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.color === color ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    setCouponDiscount(0);
    setSelectedShipping(null);
    localStorage.removeItem('brasil_chic_cart');
    localStorage.removeItem('brasil_chic_coupon');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Recalcular desconto do cupom se o subtotal mudar
  useEffect(() => {
    if (coupon) {
      if (coupon.discountType === 'PERCENTAGE') {
        const disc = Number(((subtotal * coupon.discountValue) / 100).toFixed(2));
        setCouponDiscount(disc);
      } else {
        setCouponDiscount(Math.min(coupon.discountValue, subtotal));
      }
    } else {
      setCouponDiscount(0);
    }
  }, [subtotal, coupon]);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupon(data.coupon);
        setCouponDiscount(data.discount);
        localStorage.setItem(
          'brasil_chic_coupon',
          JSON.stringify({ coupon: data.coupon, discount: data.discount })
        );
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Cupom inválido' };
      }
    } catch (err: any) {
      return { success: false, message: 'Erro ao validar cupom' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponDiscount(0);
    localStorage.removeItem('brasil_chic_coupon');
  };

  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const total = Math.max(0, Number((subtotal + shippingCost - couponDiscount).toFixed(2)));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        coupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        selectedShipping,
        setSelectedShipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return context;
};
