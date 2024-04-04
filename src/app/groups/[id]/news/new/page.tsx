import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CreateNewsForm } from '@/app/groups/[id]/news/new/create-news-form';
import Providers from '@/components/providers';
import { prismaClient } from '@/config/prisma.config';

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
