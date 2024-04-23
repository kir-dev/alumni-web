import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { LoginForm } from '@/app/login/login-form';
import Providers from '@/components/providers';
import { authOptions } from '@/config/auth.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Bejelentkezés'),
  description: 'Jelentkezz be az Alumni rendszerbe.',
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return redirect('/profile');
  }

  return (
    <main>
      <h1>Bejelentkezés</h1>
      <Providers>
        <LoginForm />
      </Providers>
    </main>
  );
}
