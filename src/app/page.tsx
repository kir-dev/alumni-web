import { Metadata } from 'next';

import { prismaClient } from '@/config/prisma.config';
import { getDomainForHost } from '@/lib/server-utils';
import { BlockMap } from '@/lib/static-site';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Kezdőlap'),
  description: 'A Schönherz és a VIK Alumni oldala.',
};

export default async function Home() {
  const site = await getHomeSiteForDomain();

  if (!site) {
    await prismaClient.staticSite.findFirst({
      where: {
        url: 'fooldal',
        groupId: null,
      },
      include: {
        siteBlocks: true,
      },
    });
  }

  if (!site) return <main className='flex min-h-screen flex-col items-center justify-between p-24' />;
  return (
    <main>
      {site.siteBlocks.map((block) => {
        const Renderer = BlockMap[block.type];
        return <Renderer key={block.id} content={block.content} />;
      })}
    </main>
  );
}

async function getHomeSiteForDomain() {
  const domain = await getDomainForHost();
  if (!domain) return null;
  return prismaClient.staticSite.findFirst({
    where: {
      url: 'fooldal',
      group: {
        domain: {
          domain: domain.domain,
        },
      },
    },
    include: {
      siteBlocks: true,
    },
  });
}
