import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { TbHome, TbMail, TbPhone } from 'react-icons/tb';

import { EventListItem } from '@/components/group/event-list-item';
import { GroupListItem } from '@/components/group/group-list-item';
import { SignOut } from '@/components/profile/sign-out';
import { Tfa } from '@/components/profile/tfa';
import Providers from '@/components/providers';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { IconValueDisplay } from '@/components/ui/icon-value-display';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';
import { getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Profilom'),
  description: 'Tekintsd meg a profilodat.',
};

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
        <CardContent className='flex flex-col md:flex-row justify-between md:items-center gap-5 pt-5'>
          <div>
            <CardTitle>
              {user.firstName} {user.lastName}
            </CardTitle>
            <div className='mt-5'>
              <IconValueDisplay icon={TbMail} value={user.email} type='email' />
              <IconValueDisplay icon={TbPhone} value={user.phone} type='tel' />
              <IconValueDisplay icon={TbHome} value={user.address} type='address' />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <SignOut />
            <Providers>
              <UpdateProfileForm user={user} />
              <Tfa token={user.TfaToken} />
            </Providers>
          </div>
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
