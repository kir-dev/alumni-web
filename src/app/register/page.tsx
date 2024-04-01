import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RegisterForm } from '@/app/register/register-form';
import Providers from '@/components/providers';

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
