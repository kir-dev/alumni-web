import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CreateGroupForm } from '@/app/groups/new/create-group-form';
import Providers from '@/components/providers';

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
