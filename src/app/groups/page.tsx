import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { TbPlus } from 'react-icons/tb';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { GroupListItem } from '@/components/group/group-list-item';
import { Button } from '@/components/ui/button';
import { prismaClient } from '@/config/prisma.config';

export default async function GroupsPage() {
  const session = await getServerSession(authOptions);

  const groups = await prismaClient.group.findMany({
    where: {
      parentGroupId: null,
    },
  });

  return (
    <main>
      <div className='flex items-center justify-between'>
        <h1>Fő csoportok</h1>
        {session && session.user.isSuperAdmin && (
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
