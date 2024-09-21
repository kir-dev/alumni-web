import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TbBrowserPlus, TbCalendarPlus, TbEdit, TbNotes, TbTextPlus, TbUsersGroup } from 'react-icons/tb';

import { EventListItem } from '@/components/group/event-list-item';
import { GroupListItem } from '@/components/group/group-list-item';
import { JoinButton } from '@/components/group/join-button';
import { NewsListItem } from '@/components/group/news-list-item';
import Providers from '@/components/providers';
import { SiteListItem } from '@/components/sites/site-list-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prismaClient } from '@/config/prisma.config';
import { canEdit, getGroup, getMembership, getSession, isApprovedGroupMember, isSuperAdmin } from '@/lib/server-utils';
import { generateGlobalThemePalette, getSuffixedTitle } from '@/lib/utils';

const SendEmail = dynamic(() => import('@/components/group/send-email'), { ssr: false });
const DomainSettings = dynamic(() => import('@/components/group/domain-settings'), { ssr: false });
const DeleteGroup = dynamic(() => import('@/components/group/delete-group'), { ssr: false });

interface GroupPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: GroupPageProps): Promise<Metadata> {
  const group = await getGroup(params.id);

  if (!group)
    return {
      title: 'Csoport nem található',
    };

  return {
    title: getSuffixedTitle(group.name),
    description: group.description,
  };
}

export default async function GroupDetailPage({ params }: GroupPageProps) {
  const userCanEdit = await canEdit(params.id);
  const userIsMember = await isApprovedGroupMember(params.id);
  const userIsSuperAdmin = await isSuperAdmin();
  const session = await getSession();
  const membership = await getMembership(params.id);

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
    },
    include: {
      parentGroup: true,
      subGroups: { orderBy: { name: 'asc' } },
      domain: true,
    },
  });

  if (!group) {
    return notFound();
  }

  const events = await getSortedEvents(params.id, userIsMember);

  const news = await getSortedNews(params.id, userIsMember, userCanEdit);

  const staticSites = userCanEdit ? await getSites(params.id) : [];

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
              {userCanEdit && (
                <>
                  <Button variant='outline' asChild>
                    <Link href={`/groups/${group.id}/edit`}>
                      <TbEdit />
                      Szerkesztés
                    </Link>
                  </Button>
                  <Button variant='outline' asChild>
                    <Link href={`/groups/${group.id}/members`}>
                      <TbUsersGroup />
                      Tagok kezelése
                    </Link>
                  </Button>
                  <Button variant='outline' asChild>
                    <Link href={`/groups/${group.id}/logs`}>
                      <TbNotes />
                      Audit napló
                    </Link>
                  </Button>
                </>
              )}
              <Providers>
                {userCanEdit && (
                  <>
                    <SendEmail groupId={params.id} />
                    <DomainSettings domain={group.domain} groupId={params.id} />
                  </>
                )}
                {session && <JoinButton membership={membership} groupId={params.id} />}
                {userIsSuperAdmin && <DeleteGroup groupId={params.id} />}
              </Providers>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className='flex gap-5 items-center mt-10'>
        <h2>Események</h2>
        {userCanEdit && (
          <Button asChild>
            <Link href={`/groups/${group.id}/events/new`}>
              <TbCalendarPlus />
              Új esemény
            </Link>
          </Button>
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
        {events.map((event) => (
          <EventListItem event={event} key={event.id} />
        ))}
        {events.length === 0 && <p>Nincsenek események.</p>}
      </div>
      <div className='flex gap-5 items-center mt-10'>
        <h2>Hírek</h2>
        {userCanEdit && (
          <Button asChild>
            <Link href={`/groups/${group.id}/news/new`}>
              <TbTextPlus />
              Új hír
            </Link>
          </Button>
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
        {news.map((news) => (
          <NewsListItem news={news} key={news.id} />
        ))}
        {news.length === 0 && <p>Nincsenek hírek.</p>}
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
      {userCanEdit && (
        <>
          <div className='flex gap-5 items-center mt-10'>
            <h2>Statikus oldalak</h2>
            {userCanEdit && (
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

async function getSortedEvents(groupId: string, userIsMember: boolean) {
  return prismaClient.event.findMany({
    where: {
      groupId: groupId,
      isPrivate: userIsMember ? undefined : false,
    },
    orderBy: {
      startDate: 'asc',
    },
  });
}

async function getSortedNews(groupId: string, userIsMember: boolean, userCanEdit: boolean) {
  return prismaClient.news.findMany({
    where: {
      groupId: groupId,
      isPrivate: userIsMember ? undefined : false,
      publishDate: userCanEdit
        ? undefined
        : {
            lte: new Date(),
          },
    },
    orderBy: {
      publishDate: 'asc',
    },
  });
}

async function getSites(groupId: string) {
  return prismaClient.staticSite.findMany({
    where: {
      groupId: groupId,
    },
  });
}
