import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Navbar } from '@/components/ui/navbar/navbar';

export async function NavbarWrapper() {
  const session = await getServerSession(authOptions);
  return <Navbar isLoggedIn={Boolean(session)} />;
}
