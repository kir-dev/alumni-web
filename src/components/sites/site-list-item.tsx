import { Group, StaticSite } from '@prisma/client';
import Link from 'next/link';
import { TbChevronRight, TbExternalLink } from 'react-icons/tb';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface SiteListItemProps {
  site: StaticSite & { group?: Group | null };
}

export function SiteListItem({ site }: SiteListItemProps) {
  const link = site.groupId ? `/groups/${site.groupId}/sites/edit/${site.id}` : `/sites/edit/${site.id}`;
  return (
    <Link href={link}>
      <Card className='mt-2 overflow-hidden'>
        <CardHeader className='flex-row justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <CardTitle className='text-lg'>{site.title}</CardTitle>
            {site.group && (
              <Badge className='hidden md:block' variant='outline'>
                {site.group.name}
              </Badge>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='link' asChild>
              <Link href={site.groupId ? `/groups/${site.groupId}/sites/${site.url}` : `/sites/${site.url}`} passHref>
                Oldal megtekintése
                <TbExternalLink />
              </Link>
            </Button>
            <TbChevronRight className='text-slate-500' />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
