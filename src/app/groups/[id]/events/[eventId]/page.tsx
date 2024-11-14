import { EventApplication, User } from '@prisma/client';
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
import { canEdit, getGroup, isApprovedGroupMember } from '@/lib/server-utils';
import { getFormattedDateInterval, getSuffixedTitle } from '@/lib/utils';

interface EventPageProps {
  params: {
    id: string;
    eventId: string;
  };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const group = await getGroup(params.id);

  if (!group)
    return {
      title: 'Esemény nem található',
      description: 'Az esemény nem található.',
    };

  const userIsMember = await isApprovedGroupMember(params.id);

  const event = await prismaClient.event.findUnique({
    where: {
      id: params.eventId,
      isPrivate: userIsMember ? undefined : false,
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
  const userCanEdit = await canEdit(params.id);

  const userIsMember = await isApprovedGroupMember(params.id);

  const event = await prismaClient.event.findUnique({
    where: {
      id: params.eventId,
      isPrivate: userIsMember ? undefined : false,
    },
  });

  if (!event) return notFound();

  let applications: (EventApplication & { user: User })[] = [];
  if (userCanEdit) {
    applications = await prismaClient.eventApplication.findMany({
      where: {
        eventId: event.id,
      },
      include: {
        user: true,
      },
    });
  }

  const isPast = new Date() > event.endDate;

  const descriptionParagraphs = event.description.split('\n');

  return (
    <main>
      <h1>{event.name}</h1>
      <p>{getFormattedDateInterval(event.startDate, event.endDate)}</p>
      <IconValueDisplay className='text-slate-700 mt-5' icon={TbMapPin} value={event.location} type='address' />
      {descriptionParagraphs.map((paragraph, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <p key={index}>{paragraph}</p>
      ))}
      <UpdatedAt date={event.updatedAt} className='mt-5' />
      <Providers>
        {!isPast && <Rsvp className='mt-5' eventId={params.eventId} disabled={!session} />}
        {userCanEdit && <AttendeeList eventApplications={applications} />}
        {userCanEdit && (
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
