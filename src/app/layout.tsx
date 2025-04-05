import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import React from 'react';

import { NavbarWrapper } from '@/components/navbar/navbar-wrapper';
import { Footer } from '@/components/ui/footer';
import { Toaster } from '@/components/ui/toaster';
import { ANALYTICS_URL, GOOGLE_SITE_VERIFICATION } from '@/config/environment.config';
import { getDomainForHost } from '@/lib/server-utils';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const domain = await getDomainForHost();
  const groupName = domain?.group?.name ?? 'Schönherz';
  const title = `${groupName} Alumni Információs Rendszer`;
  const description =
    domain?.group?.description ??
    'A Schönherz Alumni Információs Rendszer összeköti a jelenlegi és egykori kollégistákat, lehetőséget biztosítva a kapcsolattartásra, eseményekre és hírekre.';

  return {
    title,
    description,
    verification: {
      google: GOOGLE_SITE_VERIFICATION,
    },
    keywords: [
      groupName,
      'Alumni',
      'Információs',
      'Rendszer',
      'sch',
      'bme vik',
      'bme',
      'vik',
      'események',
      'hírek',
      'egyetem',
      'alumni',
      'közösség',
      'jelentkezés',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'hu_HU',
      siteName: `${groupName} Alumni`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

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
        <Footer groupId={domain?.group?.id} />
        <Toaster />
      </body>
    </html>
  );
}
