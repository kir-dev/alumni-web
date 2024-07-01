import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SitePage } from '@/components/sites/site-page';
import { prismaClient } from '@/config/prisma.config';
import { getSuffixedTitle } from '@/lib/utils';

interface SitePageProps {
  params: {
    url: string;
    id: string;
  };
}

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const site = await prismaClient.staticSite.findFirst({
    where: {
      url: params.url,
      groupId: params.id,
    },
    include: {
      group: true,
    },
  });

  if (!site || !site.group)
    return {
      title: 'Oldal nem található',
    };

  return {
    title: getSuffixedTitle(site.title),
    description: `${site.group.name} oldala.`,
  };
}

export default async function GroupSitePage({ params }: SitePageProps) {
  const site = await prismaClient.staticSite.findFirst({
    where: {
      url: params.url,
      groupId: params.id,
    },
    include: {
      siteBlocks: true,
      group: true,
    },
  });

  if (!site || !site.group) return notFound();

  return <SitePage site={site} />;
}
