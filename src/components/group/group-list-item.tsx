import { Group } from '@prisma/client';
import Link from 'next/link';
import { TbChevronRight } from 'react-icons/tb';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface GroupListItemProps {
  group: Group;
}

export function GroupListItem({ group }: GroupListItemProps) {
  return (
    <Link href={`/groups/${group.id}`}>
      <Card className='mt-2'>
        <CardHeader className='flex-row justify-between items-center'>
          <CardTitle className='text-lg'>{group.name}</CardTitle>
          <TbChevronRight className='text-slate-500' />
        </CardHeader>
      </Card>
    </Link>
  );
}
