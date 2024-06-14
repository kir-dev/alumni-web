import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import Providers from '@/components/providers';
import { EditGroupSite } from '@/components/sites/edit-group-site';
import Forbidden from '@/components/sites/forbidden';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Statikus csoport oldal szerkesztése'),
  description: 'Tartsd karban a statikus csoport oldalakat.',
};

export default async function EditGroupSitePage({ params }: { params: { id: string; siteId: string } }) {
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
