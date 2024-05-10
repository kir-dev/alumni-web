import { Membership } from '@prisma/client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { EditGroupForm } from '@/app/groups/[id]/edit/edit-group-form';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Csoport szerkesztése'),
  description: 'Tartsd naprakészen a csoport adatait.',
};

export default async function EditGroupPage({ params }: { params: { id: string } }) {
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
    return <Forbidden />;
  }

  return (
    <main>
      <h1>{group.name} szerkesztése</h1>
      <Providers>
        <EditGroupForm group={group} />
      </Providers>
    </main>
  );
}
