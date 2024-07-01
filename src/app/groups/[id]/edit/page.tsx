import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EditGroupForm } from '@/components/group/edit-group-form';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { prismaClient } from '@/config/prisma.config';
import { canEdit } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Csoport szerkesztése'),
  description: 'Tartsd naprakészen a csoport adatait.',
};

export default async function EditGroupPage({ params }: { params: { id: string } }) {
  const userCanEdit = await canEdit(params.id);

  if (!userCanEdit) {
    return <Forbidden />;
  }

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!group) {
    return notFound();
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
