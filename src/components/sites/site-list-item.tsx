import { StaticSite } from '@prisma/client';
import Link from 'next/link';
import { TbChevronRight } from 'react-icons/tb';

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
          <TbChevronRight className='text-slate-500' />
        </CardHeader>
      </Card>
    </Link>
  );
}
