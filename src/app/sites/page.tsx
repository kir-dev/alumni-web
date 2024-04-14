import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { TbPlus } from 'react-icons/tb';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SiteListItem } from '@/components/sites/site-list-item';
import { Button } from '@/components/ui/button';
import { prismaClient } from '@/config/prisma.config';

export const dynamic = 'force-dynamic';

export default async function SitesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isSuperAdmin) {
    return notFound();
  }

  const sites = await prismaClient.staticSite.findMany();

  return (
    <main>
      <div className='flex items-center justify-between'>
        <h1>Statikus oldalak</h1>
        {session && session.user.isSuperAdmin && (
          <Button asChild>
            <Link href='/sites/new'>
              <TbPlus /> Új statikus oldal
            </Link>
          </Button>
        )}
      </div>
      <div className='mt-10'>
        {sites.map((site) => (
          <SiteListItem key={site.id} site={site} />
        ))}
      </div>
    </main>
  );
}
