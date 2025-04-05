import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DeleteNews } from '@/components/group/delete-news';
import Providers from '@/components/providers';
import { TextRenderer } from '@/components/sites/render/text-renderer';
import { Button } from '@/components/ui/button';
import { UpdatedAt } from '@/components/ui/updated-at';
import { prismaClient } from '@/config/prisma.config';
import { canEdit, isApprovedGroupMember } from '@/lib/server-utils';
import { formatHu, getSuffixedTitle } from '@/lib/utils';

interface NewsPageProps {
  params: {
    id: string;
    newsId: string;
  };
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const userCanEdit = await canEdit(params.id);
  const userIsMember = await isApprovedGroupMember(params.id);

  const news = await getNews(params.newsId, userIsMember, userCanEdit);

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
  const userCanEdit = await canEdit(params.id);
  const userIsMember = await isApprovedGroupMember(params.id);

  const news = await getNews(params.newsId, userIsMember, userCanEdit);

  if (!news) return notFound();

  return (
    <main>
      <h1>{news.title}</h1>
      <p>{formatHu(news.publishDate, 'yyyy. MMMM dd. HH:mm')}</p>
      <TextRenderer content={news.content} />
      <UpdatedAt date={news.updatedAt} className='mt-5' />
      <Providers>
        {userCanEdit && (
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

async function getNews(newsId: string, isMember: boolean, isAdmin: boolean) {
  return prismaClient.news.findUnique({
    where: {
      id: newsId,
      isPrivate: isMember ? undefined : false,
      publishDate: isAdmin
        ? undefined
        : {
            lte: new Date(),
          },
    },
  });
}
