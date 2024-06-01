import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import Providers from '@/components/providers';
import { EditSiteForm } from '@/components/sites/edit-site-form';
import Forbidden from '@/components/sites/forbidden';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Statikus oldal szerkesztése'),
  description: 'Tartsd karban a statikus oldalakat.',
};

export default async function EditSitePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isSuperAdmin) {
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
        <EditSiteForm site={site} />
      </Providers>
    </main>
  );
}
