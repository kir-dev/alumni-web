import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { TbHome, TbMail, TbPhone } from 'react-icons/tb';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { EventListItem } from '@/components/group/event-list-item';
import { GroupListItem } from '@/components/group/group-list-item';
import { SignOut } from '@/components/profile/sign-out';
import { Tfa } from '@/components/profile/tfa';
import Providers from '@/components/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prismaClient } from '@/config/prisma.config';

const UpdateProfileForm = dynamic(() => import('@/app/profile/update-profile-form'), { ssr: false });

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return redirect('/login');
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      TfaToken: true,
    },
  });

  const memberships = await prismaClient.membership.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      group: true,
    },
  });

  const eventRegistrations = await prismaClient.eventApplication.findMany({
    where: {
      userId: session.user.id,
      event: {
        endDate: {
          gt: new Date(),
        },
      },
    },
    include: {
      event: true,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <main>
      <h1>Profil</h1>
      <Card className='mt-5'>
        <CardHeader className='flex flex-row justify-between items-center gap-5'>
          <CardTitle>
            {user.firstName} {user.lastName}
          </CardTitle>
          <div className='flex flex-col gap-2'>
            <SignOut />
            <Providers>
              <Tfa token={user.TfaToken} />
              <UpdateProfileForm user={user} />
            </Providers>
          </div>
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
      {eventRegistrations.length > 0 && (
        <>
          <h2 className='mt-10'>Jelentkezéseid eseményekre</h2>
          <div className='mt-5'>
            {eventRegistrations.map((eventRegistration) => (
              <EventListItem event={eventRegistration.event} key={eventRegistration.event.id} />
            ))}
          </div>
        </>
      )}
      <h2 className='mt-10'>Csoport tagságok</h2>
      <div className='mt-5'>
        {memberships.map((membership) => (
          <GroupListItem key={membership.group.id} group={membership.group} />
        ))}
      </div>
    </main>
  );
}
