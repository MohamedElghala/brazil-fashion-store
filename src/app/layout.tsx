import './globals.css';
import React from 'react';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata = {
  title: 'Brasil Chic | Moda & Estilo Brasileiro - Masculino, Feminino e Infantil',
  description:
    'Sua loja online de roupas brasileira. Tecidos nobres como linho puro e algodão pima. Frete para todo o Brasil, Pix com 5% de desconto e parcelamento em até 12x sem juros.',
  keywords:
    'moda brasileira, roupas masculinas, vestidos femininos, moda infantil, linho, algodão pima, comprar roupas online brasil, pix',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
        <CartProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <CartDrawer />
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
