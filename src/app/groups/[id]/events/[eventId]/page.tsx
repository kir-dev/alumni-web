import { EventApplication, Membership, User } from '@prisma/client';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { TbMapPin } from 'react-icons/tb';

import { DeleteEvent } from '@/components/group/delete-event';
import Rsvp from '@/components/group/rsvp';
import Providers from '@/components/providers';
import { Button } from '@/components/ui/button';
import { IconValueDisplay } from '@/components/ui/icon-value-display';
import { UpdatedAt } from '@/components/ui/updated-at';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';
import { getFormattedDateInterval, getSuffixedTitle } from '@/lib/utils';

interface EventPageProps {
  params: {
    id: string;
    eventId: string;
  };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions);

  const group = await prismaClient.group.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!group)
    return {
      title: 'Esemény nem található',
      description: 'Az esemény nem található.',
    };

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

  if (!event)
    return {
      title: 'Esemény nem található',
      description: 'Az esemény nem található.',
    };

  return {
    title: getSuffixedTitle(event.name),
    description: event.description,
  };
}

const AttendeeList = dynamic(() => import('@/components/group/attendee-list'), { ssr: false });

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
      <UpdatedAt date={event.updatedAt} className='mt-5' />
      <Providers>
        <Rsvp className='mt-5' eventId={params.eventId} disabled={!session} />
        {canEdit && <AttendeeList eventApplications={applications} />}
        {canEdit && (
          <div className='flex justify-end items-center gap-2 mt-5'>
            <DeleteEvent eventId={params.eventId} groupId={params.id} />
            <Button asChild>
              <Link href={`/groups/${params.id}/events/${params.eventId}/update`}>Szerkesztés</Link>
            </Button>
          </div>
        )}
      </Providers>
    </main>
  );
}
