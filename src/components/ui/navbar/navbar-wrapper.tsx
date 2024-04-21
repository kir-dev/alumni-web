import { getServerSession } from 'next-auth/next';

import { Navbar } from '@/components/ui/navbar/navbar';
import { authOptions } from '@/config/auth.config';

export async function NavbarWrapper() {
  const session = await getServerSession(authOptions);
  return <Navbar isLoggedIn={Boolean(session)} isAdmin={Boolean(session?.user.isSuperAdmin)} />;
}
