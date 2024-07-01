import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Providers from '@/components/providers';
import { EditGlobalSite } from '@/components/sites/edit-global-site';
import Forbidden from '@/components/sites/forbidden';
import { prismaClient } from '@/config/prisma.config';
import { isSuperAdmin } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Statikus oldal szerkesztése'),
  description: 'Tartsd karban a statikus oldalakat.',
};

export default async function EditSitePage({ params }: { params: { id: string } }) {
  const userCanEdit = await isSuperAdmin();

  if (!userCanEdit) {
    return <Forbidden />;
  }

  const site = await prismaClient.staticSite.findUnique({
    where: {
      id: params.id,
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
        <EditGlobalSite site={site} />
      </Providers>
    </main>
  );
}
