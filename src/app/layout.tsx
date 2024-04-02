import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import { Navbar } from '@/components/ui/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Villanykari Alumni Információs Rendszer',
  description: 'Villanykari Alumni Információs Rendszer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='hu'>
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
