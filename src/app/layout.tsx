import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import React from 'react';

import { NavbarWrapper } from '@/components/navbar/navbar-wrapper';
import { Footer } from '@/components/ui/footer';
import { ANALYTICS_URL } from '@/config/environment.config';
import { getDomainForHost } from '@/lib/server-utils';

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
  const domain = await getDomainForHost();

  return (
    <html lang='hu'>
      {ANALYTICS_URL && <Script defer data-domain={ANALYTICS_URL} src='https://visit.kir-dev.hu/js/script.js' />}
      <body className={inter.className}>
        <NavbarWrapper group={domain?.group} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
