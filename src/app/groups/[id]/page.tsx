import { Membership } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { TbEdit, TbUserPlus, TbUsers, TbUsersGroup } from 'react-icons/tb';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { JoinButton } from '@/app/groups/[id]/join-button';
import { GroupListItem } from '@/components/group/group-list-item';
import Providers from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prismaClient } from '@/config/prisma.config';

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
    },
    include: {
      parentGroup: true,
      subGroups: true,
    },
  });

  if (!group) {
    return notFound();
  }

  let membership: Membership | null = null;

  if (session) {
    membership = await prismaClient.membership.findFirst({
      where: {
        groupId: params.id,
        userId: session.user.id,
      },
    });
  }

  const canEdit = membership?.isAdmin || session?.user.isSuperAdmin;

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between overflow-hidden gap-5'>
            <div>
              {group.parentGroup && (
                <p className='truncate'>
                  Szülő csoport:{' '}
                  <Link className='underline' href={`/groups/${group.parentGroup.id}`}>
                    {group.parentGroup.name}
                  </Link>
                </p>
              )}
              <p>{group.description}</p>
            </div>
            <div className='flex flex-col gap-2'>
              {canEdit && (
                <Button variant='outline' asChild>
                  <Link href={`/groups/${group.id}/edit`}>
                    <TbEdit />
                    Szerkesztés
                  </Link>
                </Button>
              )}
              {canEdit && (
                <Button variant='outline' asChild>
                  <Link href={`/groups/${group.id}/members`}>
                    <TbUsersGroup />
                    Tagok kezelése
                  </Link>
                </Button>
              )}
              {session && (
                <Providers>
                  <JoinButton membership={membership} groupId={params.id} />
                </Providers>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {group.subGroups.length > 0 && (
        <>
          <h2 className='mt-10'>Alcsoportok</h2>
          <div className='mt-5'>
            {group.subGroups.map((subGroup) => (
              <GroupListItem group={subGroup} key={subGroup.id} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
