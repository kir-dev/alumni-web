import { Metadata } from 'next';
import Link from 'next/link';
import { TbPlus } from 'react-icons/tb';

import { GroupListItem } from '@/components/group/group-list-item';
import { Button } from '@/components/ui/button';
import { prismaClient } from '@/config/prisma.config';
import { isSuperAdmin } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Csoportok'),
  description: 'Tekintsd meg a csoportokat.',
};

export default async function GroupsPage() {
  const userCanEdit = await isSuperAdmin();

  const groups = await prismaClient.group.findMany({
    where: {
      parentGroupId: null,
    },
  });

  return (
    <main>
      <div className='flex items-center justify-between'>
        <h1>Fő csoportok</h1>
        {userCanEdit && (
          <Button asChild>
            <Link href='/groups/new'>
              <TbPlus /> Új csoport
            </Link>
          </Button>
        )}
      </div>
      <div className='mt-10'>
        {groups.map((group) => (
          <GroupListItem key={group.id} group={group} />
        ))}
      </div>
    </main>
  );
}
