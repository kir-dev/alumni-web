import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import React from 'react';

import { NavbarWrapper } from '@/components/navbar/navbar-wrapper';
import { Footer } from '@/components/ui/footer';
import { prismaClient } from '@/config/prisma.config';

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
      <body className={inter.className}>
        <NavbarWrapper group={domain?.group} />
        {children}
        <Footer />
      </body>
    </html>
  );
}

async function getDomainForHost() {
  const host = headers().get('host');

  return host
    ? await prismaClient.groupDomain.findFirst({
        where: {
          domain: host,
        },
        include: {
          group: true,
        },
      })
    : null;
}
