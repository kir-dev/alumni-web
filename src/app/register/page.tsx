import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import Providers from '@/components/providers';
import { RegisterForm } from '@/components/register/register-form';
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
    <main className='max-w-lg'>
      <h1>Regisztráció</h1>
      <Providers>
        <RegisterForm />
      </Providers>
    </main>
  );
}
