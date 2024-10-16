import React from 'react';

import { UserImport } from '@/components/admin/user-import';
import Providers from '@/components/providers';

export default async function UsersImportPage() {
  return (
    <main>
      <h1>Felhasználók importálása</h1>
      <Providers>
        <UserImport />
      </Providers>
    </main>
  );
}
