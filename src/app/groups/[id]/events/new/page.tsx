import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { CreateEventForm } from '@/components/group/create-event-form';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Új esemény'),
  description: 'Hozz létre egy új eseményt a csoportod számára.',
};

export default async function CreateEventPage({ params }: { params: { id: string } }) {
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

  return (
    <main>
      <h1>Új esemény</h1>
      <Providers>
        <CreateEventForm groupId={params.id} />
      </Providers>
    </main>
  );
}
