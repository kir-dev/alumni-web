import { StaticSite } from '@prisma/client';
import Link from 'next/link';
import { TbChevronRight } from 'react-icons/tb';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { SpecialtyOptions } from '@/lib/static-site';

interface SiteListItemProps {
  site: StaticSite;
}

export function SiteListItem({ site }: SiteListItemProps) {
  const specialtyLabel = SpecialtyOptions.find((option) => option.value === site.specialty)?.label;
  return (
    <Link href={`/sites/edit/${site.id}`}>
      <Card className='mt-2'>
        <CardHeader className='flex-row justify-between items-center'>
          <div className='flex gap-5'>
            <CardTitle className='text-lg'>{site.title}</CardTitle>
            {specialtyLabel && <Badge>{specialtyLabel}</Badge>}
          </div>
          <TbChevronRight className='text-slate-500' />
        </CardHeader>
      </Card>
    </Link>
  );
}
