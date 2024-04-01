import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SignOut } from '@/app/login/sign-out';
import { prismaClient } from '@/config/prisma.config';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    console.log(session);
    return redirect('/login');
  }

  const user = await prismaClient.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <main>
      <h1>Profil</h1>
      <p>
        {user.firstName} {user.lastName}
      </p>
      <SignOut />
    </main>
  );
}
