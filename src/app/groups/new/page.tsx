import { Metadata } from 'next';

import { CreateGroupForm } from '@/components/group/create-group-form';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { isSuperAdmin } from '@/lib/server-utils';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Új csoport'),
  description: 'Hozz létre egy új csoportot.',
};

export default async function CreateGroupPage() {
  const userCanEdit = await isSuperAdmin();
  if (!userCanEdit) {
    return <Forbidden />;
  }

  return (
    <main>
      <h1>Új csoport</h1>
      <Providers>
        <CreateGroupForm />
      </Providers>
    </main>
  );
}
