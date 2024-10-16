import { getServerSession } from 'next-auth/next';
import React from 'react';

import { UserList } from '@/components/admin/user-list';
import Providers from '@/components/providers';
import { authOptions } from '@/config/auth.config';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <h1>Felhasználók</h1>
      <Providers>
        <UserList currentUserId={session?.user.id} />
      </Providers>
    </main>
  );
}
