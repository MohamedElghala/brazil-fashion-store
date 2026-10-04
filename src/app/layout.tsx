import './globals.css';
import React from 'react';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import DifferenceCursor from '@/components/DifferenceCursor';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FBF9F5] text-[#18181B] min-h-screen flex flex-col antialiased selection:bg-[#C26D53] selection:text-white font-sans">
        <CartProvider>
          <DifferenceCursor />
          <Navbar />
          <main className="flex-1 w-full mx-auto">
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
