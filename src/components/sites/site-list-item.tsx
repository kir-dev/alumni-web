import { StaticSite } from '@prisma/client';
import Link from 'next/link';
import { TbChevronRight, TbExternalLink } from 'react-icons/tb';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface SiteListItemProps {
  site: StaticSite;
}

export function SiteListItem({ site }: SiteListItemProps) {
  return (
    <Link href={`/sites/edit/${site.id}`}>
      <Card className='mt-2'>
        <CardHeader className='flex-row justify-between items-center'>
          <CardTitle className='text-lg'>{site.title}</CardTitle>
          <Button variant='link' asChild>
            <Link href={`/sites/${site.url}`} passHref>
              Oldal megtekintése
              <TbExternalLink />
            </Link>
          </Button>
          <TbChevronRight className='text-slate-500' />
        </CardHeader>
      </Card>
    </Link>
  );
}
