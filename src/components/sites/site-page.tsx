import { Group, SiteBlock, StaticSite } from '@prisma/client';

import { UpdatedAt } from '@/components/ui/updated-at';
import { BlockMap } from '@/lib/static-site';
import { generateGlobalThemePalette } from '@/lib/utils';

interface SitePageProps {
  site: StaticSite & {
    group: Group | null;
    siteBlocks: SiteBlock[];
  };
}

export function SitePage({ site }: SitePageProps) {
  return (
    <main className='space-y-10'>
      {site.group?.color && <style>{generateGlobalThemePalette(site.group.color)}</style>}
      <h1>{site.title}</h1>
      {site.group && <p>{site.group.name}</p>}
      {site.siteBlocks.map((block) => {
        const Renderer = BlockMap[block.type];
        return <Renderer key={block.id} content={block.content} />;
      })}
      <UpdatedAt date={site.updatedAt} className='mt-5' />
    </main>
  );
}
