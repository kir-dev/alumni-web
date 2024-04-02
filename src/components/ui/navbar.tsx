import Link from 'next/link';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className='flex justify-between items-center p-3 container'>
      <div>VAIR</div>
      <div className='flex gap-3'>
        <Link href='/groups'>Csoportok</Link>
        {session?.user ? <Link href='/profile'>Profil</Link> : <Link href='/login'>Bejelentkezés</Link>}
      </div>
    </nav>
  );
}
