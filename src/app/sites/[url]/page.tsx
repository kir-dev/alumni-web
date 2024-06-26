import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SitePage } from '@/components/sites/site-page';
import { prismaClient } from '@/config/prisma.config';
import { getSuffixedTitle } from '@/lib/utils';

interface SitePageProps {
  params: {
    url: string;
  };
}

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const site = await prismaClient.staticSite.findFirst({
    where: {
      url: params.url,
      groupId: null,
    },
  });

  if (!site) return notFound();

  return {
    title: getSuffixedTitle(site.title),
    description: 'Schönherz és a VIK Alumni oldala.',
  };
}

export default async function GlobalSitePage({ params }: SitePageProps) {
  const site = await prismaClient.staticSite.findFirst({
    where: {
      url: params.url,
    },
    include: {
      siteBlocks: true,
      group: true,
    },
  });

  if (!site) return notFound();

  return <SitePage site={site} />;
}
