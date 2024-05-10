import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { UpdateEventForm } from '@/components/group/update-event-form';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Esemény szerkesztése'),
  description: 'Frissítsd az esemény adatait.',
};

export default async function UpdateEventPage({ params }: { params: { id: string; eventId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
    },
    include: {
      parentGroup: true,
      subGroups: true,
    },
  });

  if (!group) return notFound();

  const adminMembership = await prismaClient.membership.findFirst({
    where: {
      groupId: params.id,
      userId: session.user.id,
      isAdmin: true,
    },
  });

  if (!adminMembership && !session.user.isSuperAdmin) return <Forbidden />;

  const event = await prismaClient.event.findUnique({
    where: {
      id: params.eventId,
    },
  });

  if (!event) return notFound();

  return (
    <main>
      <h1>{event.name} szerkesztése</h1>
      <Providers>
        <UpdateEventForm event={event} groupId={params.id} />
      </Providers>
    </main>
  );
}
