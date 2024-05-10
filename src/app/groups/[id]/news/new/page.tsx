import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { CreateNewsForm } from '@/components/group/create-news-form';
import Providers from '@/components/providers';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';

export const metadata: Metadata = {
  title: 'Új hír',
  description: 'Hozz létre egy új hírt a csoportod számára.',
};

export default async function CreateNewsPage({ params }: { params: { id: string } }) {
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

  if (!adminMembership && !session.user.isSuperAdmin) return notFound();

  return (
    <main>
      <h1>Új hír</h1>
      <Providers>
        <CreateNewsForm groupId={params.id} />
      </Providers>
    </main>
  );
}
