import { Membership } from '@prisma/client';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { MembersList } from '@/app/groups/[id]/members/members-list';
import Providers from '@/components/providers';
import { prismaClient } from '@/config/prisma.config';

export default async function GroupMembersPage({ params }: { params: { id: string } }) {
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

  const canEdit = membership?.isAdmin || session?.user.isSuperAdmin;

  if (!canEdit) {
    return notFound();
  }

  const members = await prismaClient.membership.findMany({
    where: {
      groupId: params.id,
    },
    include: {
      user: true,
    },
  });

  return (
    <main>
      <h1>{group.name} tagjai</h1>
      <Providers>
        <MembersList memberships={members} groupId={params.id} />
      </Providers>
    </main>
  );
}
