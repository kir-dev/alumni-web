import { getServerSession } from 'next-auth/next';
import React from 'react';

import { UserList } from '@/components/admin/user-list';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.isSuperAdmin) {
    return <Forbidden />;
  }
  const users = await prismaClient.user.findMany();
  return (
    <main>
      <h1>Felhasználók</h1>
      <Providers>
        <UserList currentUserId={session.user.id} users={users} />
      </Providers>
    </main>
  );
}
