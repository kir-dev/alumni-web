import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Providers from '@/components/providers';
import { CreateSiteForm } from '@/components/sites/create-site-form';

export default async function CreateSitePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isSuperAdmin) {
    return notFound();
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
