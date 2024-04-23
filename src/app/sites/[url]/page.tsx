import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { prismaClient } from '@/config/prisma.config';
import { BlockMap } from '@/lib/static-site';
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
    },
  });

  if (!site) return notFound();

  return {
    title: getSuffixedTitle(site.title),
    description: 'Schönherz és a VIK Alumni oldala.',
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const site = await prismaClient.staticSite.findFirst({
    where: {
      url: params.url,
    },
    include: {
      siteBlocks: true,
    },
  });

  if (!site) return notFound();

  return (
    <main className='space-y-10'>
      <h1>{site.title}</h1>
      {site.siteBlocks.map((block) => {
        const Renderer = BlockMap[block.type];
        return <Renderer key={block.id} content={block.content} />;
      })}
    </main>
  );
}
