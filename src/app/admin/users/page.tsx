import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import React from 'react';
import { TbUserPlus } from 'react-icons/tb';

import { UserList } from '@/components/admin/user-list';
import Providers from '@/components/providers';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/config/auth.config';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <div className='flex items-center justify-between'>
        <h1>Felhasználók</h1>
        <Button asChild>
          <Link href='/admin/users/import'>
            <TbUserPlus /> Felhasználók importálása
          </Link>
        </Button>
      </div>
      <Providers>
        <UserList currentUserId={session?.user.id} />
      </Providers>
    </main>
  );
}
