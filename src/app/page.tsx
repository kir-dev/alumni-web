import { Metadata } from 'next';

import { prismaClient } from '@/config/prisma.config';
import { BlockMap } from '@/lib/static-site';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Kezdőlap'),
  description: 'A Schönherz és a VIK Alumni oldala.',
};

export default async function Home() {
  const site = await prismaClient.staticSite.findFirst({
    where: {
      url: 'fooldal',
    },
    include: {
      siteBlocks: true,
    },
  });

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
