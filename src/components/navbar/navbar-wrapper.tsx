import { Group } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

import { Navbar } from '@/components/navbar/navbar';
import { authOptions } from '@/config/auth.config';

interface NavbarWrapperProps {
  group?: Group;
}

export async function NavbarWrapper({ group }: NavbarWrapperProps) {
  const session = await getServerSession(authOptions);
  return <Navbar group={group} isLoggedIn={Boolean(session)} isAdmin={Boolean(session?.user.isSuperAdmin)} />;
}
