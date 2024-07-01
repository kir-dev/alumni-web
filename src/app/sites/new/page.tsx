import { Metadata } from 'next';

import Providers from '@/components/providers';
import { CreateGlobalSite } from '@/components/sites/create-global-site';
import Forbidden from '@/components/sites/forbidden';
import { isSuperAdmin } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Statikus oldal létrehozása'),
  description: 'Hozz létre egy új statikus oldalt!',
};

export default async function CreateSitePage() {
  const userCanEdit = await isSuperAdmin();

  if (!userCanEdit) {
    return <Forbidden />;
  }

  return (
    <main>
      <Providers>
        <CreateGlobalSite />
      </Providers>
    </main>
  );
}
