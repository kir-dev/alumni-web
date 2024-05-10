import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import { NavbarWrapper } from '@/components/navbar/navbar-wrapper';
import { Footer } from '@/components/ui/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Schönherz Alumni Információs Rendszer',
  description: 'Schönherz Alumni Információs Rendszer',
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
