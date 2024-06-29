import { Membership } from '@prisma/client';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { TbBrowserPlus, TbCalendarPlus, TbEdit, TbTextPlus, TbUsersGroup } from 'react-icons/tb';

import { EventListItem } from '@/components/group/event-list-item';
import { GroupListItem } from '@/components/group/group-list-item';
import { JoinButton } from '@/components/group/join-button';
import { NewsListItem } from '@/components/group/news-list-item';
import Providers from '@/components/providers';
import { SiteListItem } from '@/components/sites/site-list-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';
import { generateGlobalThemePalette, getSuffixedTitle } from '@/lib/utils';

const SendEmail = dynamic(() => import('@/components/group/send-email'), { ssr: false });
const DomainSettings = dynamic(() => import('@/components/group/domain-settings'), { ssr: false });

interface GroupPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: GroupPageProps): Promise<Metadata> {
  const group = await prismaClient.group.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!group) return notFound();

  return {
    title: getSuffixedTitle(group.name),
    description: group.description,
  };
}

export default async function GroupDetailPage({ params }: GroupPageProps) {
  const session = await getServerSession(authOptions);

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
    },
    include: {
      parentGroup: true,
      subGroups: true,
      domain: true,
    },
  });

  if (!group) {
    return notFound();
  }

  let membership: Membership | null = null;

  if (session) {
    membership = await prismaClient.membership.findFirst({
      where: {
        groupId: params.id,
        userId: session.user.id,
      },
    });
  }

  const events = await prismaClient.event.findMany({
    where: {
      groupId: params.id,
      isPrivate: membership ? undefined : false,
    },
  });

  const canEdit = membership?.isAdmin || session?.user.isSuperAdmin;

  const news = await prismaClient.news.findMany({
    where: {
      groupId: params.id,
      isPrivate: membership ? undefined : false,
      publishDate: canEdit
        ? undefined
        : {
            lte: new Date(),
          },
    },
  });

  const staticSites = await prismaClient.staticSite.findMany({
    where: {
      groupId: params.id,
    },
  });

  const sortedEvents = events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const sortedNews = news.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());

  return (
    <main>
      {group.color && <style>{generateGlobalThemePalette(group.color)}</style>}
      <Card>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between overflow-hidden gap-5 flex-col md:flex-row'>
            <div>
              {group.parentGroup && (
                <p className='truncate'>
                  Szülő csoport:{' '}
                  <Link className='underline' href={`/groups/${group.parentGroup.id}`}>
                    {group.parentGroup.name}
                  </Link>
                </p>
              )}
              <p>{group.description}</p>
            </div>
            <div className='flex flex-col gap-2'>
              {canEdit && (
                <Button variant='outline' asChild>
                  <Link href={`/groups/${group.id}/edit`}>
                    <TbEdit />
                    Szerkesztés
                  </Link>
                </Button>
              )}
              {canEdit && (
                <Button variant='outline' asChild>
                  <Link href={`/groups/${group.id}/members`}>
                    <TbUsersGroup />
                    Tagok kezelése
                  </Link>
                </Button>
              )}
              {canEdit && (
                <Providers>
                  <SendEmail groupId={params.id} />
                  <DomainSettings domain={group.domain} groupId={params.id} />
                </Providers>
              )}
              {session && (
                <Providers>
                  <JoinButton membership={membership} groupId={params.id} />
                </Providers>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className='flex gap-5 items-center mt-10'>
        <h2>Események</h2>
        {canEdit && (
          <Button asChild>
            <Link href={`/groups/${group.id}/events/new`}>
              <TbCalendarPlus />
              Új esemény
            </Link>
          </Button>
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
        {sortedEvents.map((event) => (
          <EventListItem event={event} key={event.id} />
        ))}
        {sortedEvents.length === 0 && <p>Nincsenek események.</p>}
      </div>
      <div className='flex gap-5 items-center mt-10'>
        <h2>Hírek</h2>
        {canEdit && (
          <Button asChild>
            <Link href={`/groups/${group.id}/news/new`}>
              <TbTextPlus />
              Új hír
            </Link>
          </Button>
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
        {sortedNews.map((news) => (
          <NewsListItem news={news} key={news.id} />
        ))}
        {sortedNews.length === 0 && <p>Nincsenek hírek.</p>}
      </div>
      {group.subGroups.length > 0 && (
        <>
          <h2 className='mt-10'>Alcsoportok</h2>
          <div className='mt-5'>
            {group.subGroups.map((subGroup) => (
              <GroupListItem group={subGroup} key={subGroup.id} />
            ))}
          </div>
        </>
      )}
      {canEdit && (
        <>
          <div className='flex gap-5 items-center mt-10'>
            <h2>Statikus oldalak</h2>
            {canEdit && (
              <Button asChild>
                <Link href={`/groups/${group.id}/sites/new`}>
                  <TbBrowserPlus />
                  Új statikus oldal
                </Link>
              </Button>
            )}
          </div>
          <div className='mt-5'>
            {staticSites.map((site) => (
              <SiteListItem key={site.id} site={site} />
            ))}
            {staticSites.length === 0 && <p>Nincsenek statikus oldalak.</p>}
          </div>
        </>
      )}
    </main>
  );
}
