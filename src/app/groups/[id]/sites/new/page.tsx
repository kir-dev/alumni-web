import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import Providers from '@/components/providers';
import { CreateGroupSite } from '@/components/sites/create-group-site';
import Forbidden from '@/components/sites/forbidden';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Statikus oldal létrehozása csoportnak'),
  description: 'Hozz létre egy új statikus oldalt a csoportnak!',
};

export default async function CreateGroupSitePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
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
      <Providers>
        <CreateGroupSite groupId={params.id} />
      </Providers>
    </main>
  );
}
