import { Membership } from '@prisma/client';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { DeleteNews } from '@/components/group/delete-news';
import Providers from '@/components/providers';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';
import { formatHu, getSuffixedTitle } from '@/lib/utils';

interface NewsPageProps {
  params: {
    id: string;
    newsId: string;
  };
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions);

  const group = await prismaClient.group.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!group)
    return {
      title: 'Csoport nem található',
      description: 'A csoport nem található.',
    };

  let membership: Membership | null = null;

  if (session) {
    membership = await prismaClient.membership.findFirst({
      where: {
        groupId: params.id,
        userId: session.user.id,
      },
    });
  }

  const news = await prismaClient.news.findUnique({
    where: {
      id: params.newsId,
      isPrivate: membership ? undefined : false,
    },
  });

  if (!news)
    return {
      title: 'Hír nem található',
      description: 'A hír nem található.',
    };

  return {
    title: getSuffixedTitle(news.content),
    description: news.content,
  };
}

export default async function NewsDetailsPage({ params }: { params: { id: string; newsId: string } }) {
  const session = await getServerSession(authOptions);

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
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

  const news = await prismaClient.news.findUnique({
    where: {
      id: params.newsId,
      isPrivate: membership ? undefined : false,
      publishDate: {
        lte: new Date(),
      },
    },
  });

  if (!news) return notFound();

  const canEdit = membership?.isAdmin || session?.user.isSuperAdmin;

  return (
    <main>
      <h1>{news.title}</h1>
      <p>{formatHu(news.publishDate, 'yyyy. MMMM dd. HH:mm')}</p>
      <p>{news.content}</p>
      <Providers>
        {canEdit && (
          <div className='flex justify-end items-center gap-2 mt-5'>
            <DeleteNews groupId={params.id} newsId={params.newsId} />
            <Button asChild>
              <Link href={`/groups/${params.id}/news/${params.newsId}/update`}>Szerkesztés</Link>
            </Button>
          </div>
        )}
      </Providers>
    </main>
  );
}
