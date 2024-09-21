import { isBefore, subYears } from 'date-fns';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import { TbHome, TbMailCheck, TbMailExclamation, TbMailX, TbPhone, TbUserExclamation } from 'react-icons/tb';

import { EventListItem } from '@/components/group/event-list-item';
import { GroupListItem } from '@/components/group/group-list-item';
import { RequestEmailVerification } from '@/components/profile/request-email-verification';
import { SignOut } from '@/components/profile/sign-out';
import { Tfa } from '@/components/profile/tfa';
import Providers from '@/components/providers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { IconValueDisplay } from '@/components/ui/icon-value-display';
import { prismaClient } from '@/config/prisma.config';
import { getSession } from '@/lib/server-utils';
import { cn, getSuffixedTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: getSuffixedTitle('Profilom'),
  description: 'Tekintsd meg a profilodat.',
};

const UpdateProfileForm = dynamic(() => import('@/components/profile/update-profile-form'), { ssr: false });
const PasswordChangeDialog = dynamic(() => import('@/components/profile/password-change-dialog'), { ssr: false });

export default async function ProfilePage() {
  const session = await getSession();
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

  if (!user) {
    return notFound();
  }

  const memberships = await prismaClient.membership.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      group: true,
    },
    orderBy: {
      group: {
        name: 'asc',
      },
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

  const emailVerified = Boolean(user.emailVerified);
  const profileOutdated = isBefore(new Date(user.updatedAt), subYears(new Date(), 1));

  return (
    <main>
      <h1>Profil</h1>
      {!emailVerified && (
        <Providers>
          <Alert variant='error' className='mt-5'>
            <TbMailExclamation />
            <AlertTitle>Kérjük, erősítsd meg az email címedet!</AlertTitle>
            <RequestEmailVerification />
          </Alert>
        </Providers>
      )}
      {profileOutdated && (
        <Alert variant='warning' className='mt-5'>
          <TbUserExclamation />
          <AlertTitle>Ellenőrizd a profilod adatait!</AlertTitle>
          <AlertDescription>
            A profilod adatai több mint egy éve nem frissültek. Kérjük, hogy frissítsd és ments rá az adataidra!
          </AlertDescription>
        </Alert>
      )}
      <Card className='mt-5'>
        <CardContent className='flex flex-col md:flex-row justify-between md:items-center gap-5 pt-5'>
          <div>
            <CardTitle>
              {user.lastName} {user.firstName}
              {user.nickname && ` (${user.nickname})`}
            </CardTitle>
            <div className='mt-5'>
              <IconValueDisplay
                className={cn({
                  'text-green-500 dark:text-green-300': emailVerified,
                  'text-red-500 dark:text-red-300': !emailVerified,
                })}
                icon={emailVerified ? TbMailCheck : TbMailX}
                value={user.email}
                type='email'
              />
              <IconValueDisplay icon={TbPhone} value={user.phone} type='tel' />
              <IconValueDisplay icon={TbHome} value={user.address} type='address' />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <SignOut />
            <Providers>
              <UpdateProfileForm user={user} />
              <PasswordChangeDialog />
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
