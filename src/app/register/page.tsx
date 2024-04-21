import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { RegisterForm } from '@/app/register/register-form';
import Providers from '@/components/providers';
import { authOptions } from '@/config/auth.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Regisztráció'),
  description: 'Készíts felhasználót az Alumni rendszerbe.',
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return redirect('/profile');
  }

  return (
    <main className='container'>
      <h1>Regisztráció</h1>
      <Providers>
        <RegisterForm />
      </Providers>
    </main>
  );
}
