'use client';

import { Group } from '@prisma/client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { TbChevronRight } from 'react-icons/tb';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const MembershipCounter = dynamic(() => import('./membership-counter'), { ssr: false });

interface GroupListItemProps {
  group: Pick<Group, 'id' | 'name'>;
  approvedCount?: number;
}

export function GroupListItem({ group, approvedCount }: GroupListItemProps) {
  return (
    <Link href={`/groups/${group.id}`}>
      <Card className='mt-2'>
        <CardHeader className='flex-row justify-between items-center'>
          <CardTitle className='text-lg'>{group.name}</CardTitle>
          <div className='flex gap-2 items-center'>
            {typeof approvedCount === 'number' && <MembershipCounter approvedCount={approvedCount} />}
            <TbChevronRight className='text-slate-500' />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
