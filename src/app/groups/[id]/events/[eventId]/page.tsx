import { EventApplication, Membership, User } from '@prisma/client';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { TbMapPin } from 'react-icons/tb';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Rsvp from '@/app/groups/[id]/events/[eventId]/rsvp';
import Providers from '@/components/providers';
import { IconValueDisplay } from '@/components/ui/icon-value-display';
import { prismaClient } from '@/config/prisma.config';
import { getFormattedDateInterval } from '@/lib/utils';

const AttendeeList = dynamic(() => import('@/app/groups/[id]/events/[eventId]/attendee-list'), { ssr: false });

export default async function EventDetailsPage({ params }: { params: { id: string; eventId: string } }) {
  const session = await getServerSession(authOptions);

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
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

  const event = await prismaClient.event.findUnique({
    where: {
      id: params.eventId,
      isPrivate: membership ? undefined : false,
    },
  });

  if (!event) return notFound();

  const canEdit = membership?.isAdmin || session?.user.isSuperAdmin;

  let applications: (EventApplication & { user: User })[] = [];
  if (canEdit) {
    applications = await prismaClient.eventApplication.findMany({
      where: {
        eventId: event.id,
      },
      include: {
        user: true,
      },
    });
  }

  return (
    <main>
      <h1>{event.name}</h1>
      <p>{getFormattedDateInterval(event.startDate, event.endDate)}</p>
      <IconValueDisplay className='text-slate-700 mt-5' icon={TbMapPin} value={event.location} type='address' />
      <p>{event.description}</p>
      <Providers>
        <Rsvp className='mt-5' eventId={params.eventId} disabled={!session} />
      </Providers>
      {canEdit && <AttendeeList eventApplications={applications} eventName={event.name} />}
    </main>
  );
}
