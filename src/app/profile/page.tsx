import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { TbHome, TbMail, TbPhone } from 'react-icons/tb';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SignOut } from '@/app/login/sign-out';
import { UpdateProfileForm } from '@/app/profile/update-profile-form';
import Providers from '@/components/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prismaClient } from '@/config/prisma.config';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
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
      <Card className='mt-10'>
        <CardHeader className='flex flex-row justify-between items-center gap-5'>
          <CardTitle>
            {user.firstName} {user.lastName}
          </CardTitle>
          <SignOut />
        </CardHeader>
        <CardContent>
          <p>
            <TbMail className='inline' /> {user.email}
          </p>
          <p>
            <TbPhone className='inline' /> {user.phone}
          </p>
          <p>
            <TbHome className='inline' /> {user.address}
          </p>
        </CardContent>
      </Card>
      <Providers>
        <UpdateProfileForm />
      </Providers>
    </main>
  );
}
