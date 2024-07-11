import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { UpdateEventForm } from '@/components/group/update-event-form';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { prismaClient } from '@/config/prisma.config';
import { canEdit, getGroup } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Esemény szerkesztése'),
  description: 'Frissítsd az esemény adatait.',
};

export default async function UpdateEventPage({ params }: { params: { id: string; eventId: string } }) {
  const userCanEdit = await canEdit(params.id);

  if (!userCanEdit) return <Forbidden />;

  const event = await prismaClient.event.findUnique({
    where: {
      id: params.eventId,
    },
  });

  if (!event) return notFound();

  const group = await getGroup(params.id);

  if (!group) return notFound();

  return (
    <main>
      <h1>{event.name} szerkesztése</h1>
      <Providers>
        <UpdateEventForm event={event} groupId={params.id} group={group} />
      </Providers>
    </main>
  );
}
