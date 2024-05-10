import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';

import Providers from '@/components/providers';
import { CreateSiteForm } from '@/components/sites/create-site-form';
import Forbidden from '@/components/sites/forbidden';
import { authOptions } from '@/config/auth.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Statikus oldal létrehozása'),
  description: 'Hozz létre egy új statikus oldalt!',
};

export default async function CreateSitePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isSuperAdmin) {
    return <Forbidden />;
  }

  return (
    <main>
      <h1>Új statikus oldal</h1>
      <Providers>
        <CreateSiteForm />
      </Providers>
    </main>
  );
}
