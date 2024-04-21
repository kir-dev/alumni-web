import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { CreateGroupForm } from '@/app/groups/new/create-group-form';
import Providers from '@/components/providers';
import { authOptions } from '@/config/auth.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Új csoport'),
  description: 'Hozz létre egy új csoportot.',
};

export default async function CreateGroupPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.isSuperAdmin) {
    return notFound();
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
