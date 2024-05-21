import { getServerSession } from 'next-auth/next';
import React from 'react';

import Forbidden from '@/components/sites/forbidden';
import { authOptions } from '@/config/auth.config';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.isSuperAdmin) {
    return <Forbidden />;
  }
  return children;
}
