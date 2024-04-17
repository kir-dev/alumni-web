import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import { Footer } from '@/components/ui/footer';
import { NavbarWrapper } from '@/components/ui/navbar/navbar-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Villanykari Alumni Információs Rendszer',
  description: 'Villanykari Alumni Információs Rendszer',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='hu'>
      <body className={inter.className}>
        <NavbarWrapper />
        {children}
        <Footer />
      </body>
    </html>
  );
}
