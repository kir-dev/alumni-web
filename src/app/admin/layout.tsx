import React from 'react';

import Forbidden from '@/components/sites/forbidden';
import { isSuperAdmin } from '@/lib/server-utils';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const superAdmin = await isSuperAdmin();
  if (!superAdmin) {
    return <Forbidden />;
  }
  return children;
}
