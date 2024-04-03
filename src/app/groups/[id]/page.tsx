import { Membership } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { TbCalendarPlus, TbEdit, TbUsersGroup } from 'react-icons/tb';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { JoinButton } from '@/app/groups/[id]/join-button';
import { EventListItem } from '@/components/group/event-list-item';
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

  const events = await prismaClient.event.findMany({
    where: {
      groupId: params.id,
      isPrivate: membership ? undefined : false,
    },
  });

  const sortedEvents = events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

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
      <div className='flex gap-5 items-center mt-10'>
        <h2>Események</h2>
        {canEdit && (
          <Button asChild>
            <Link href={`/groups/${group.id}/events/new`}>
              <TbCalendarPlus />
              Új esemény
            </Link>
          </Button>
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
        {sortedEvents.map((event) => (
          <EventListItem event={event} key={event.id} />
        ))}
        {sortedEvents.length === 0 && <p>Nincsenek események.</p>}
      </div>
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
