import { notFound } from 'next/navigation';
import React from 'react';

import { getGroup } from '@/lib/server-utils';

export default async function GroupLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const groupExists = await getGroup(params.id);
  if (!groupExists) {
    return notFound();
  }
  return children;
}
