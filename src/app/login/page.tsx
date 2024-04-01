import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { LoginForm } from '@/app/login/login-form';
import Providers from '@/components/providers';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return redirect('/profile');
  }

  return (
    <main className='container'>
      <h1>Bejelentkezés</h1>
      <Providers>
        <LoginForm />
      </Providers>
    </main>
  );
}
