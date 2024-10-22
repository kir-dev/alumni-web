import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { MembersList } from '@/components/group/members-list';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { prismaClient } from '@/config/prisma.config';
import { canEdit } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Csoport tagjai'),
  description: 'A csoport tagjainak kezelése.',
};

export default async function GroupMembersPage({ params }: { params: { id: string } }) {
  const userCanEdit = await canEdit(params.id);

  if (!userCanEdit) return <Forbidden />;

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!group) return notFound();

  return (
    <main>
      <h1>{group.name} tagjai</h1>
      <Providers>
        <MembersList groupId={params.id} />
      </Providers>
    </main>
  );
}
