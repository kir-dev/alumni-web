import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Providers from '@/components/providers';
import { EditGroupSite } from '@/components/sites/edit-group-site';
import Forbidden from '@/components/sites/forbidden';
import { prismaClient } from '@/config/prisma.config';
import { canEdit } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Statikus csoport oldal szerkesztése'),
  description: 'Tartsd karban a statikus csoport oldalakat.',
};

export default async function EditGroupSitePage({ params }: { params: { id: string; siteId: string } }) {
  const userCanEdit = await canEdit(params.id);

  if (!userCanEdit) return <Forbidden />;

  const site = await prismaClient.staticSite.findUnique({
    where: {
      id: params.siteId,
      groupId: params.id,
    },
    include: {
      siteBlocks: true,
    },
  });

  if (!site) {
    return notFound();
  }

  return (
    <main>
      <Providers>
        <EditGroupSite groupId={params.id} site={site} />
      </Providers>
    </main>
  );
}
