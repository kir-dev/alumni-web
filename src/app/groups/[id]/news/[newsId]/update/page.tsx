import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { UpdateNewsForm } from '@/components/group/update-news-form';
import Providers from '@/components/providers';
import Forbidden from '@/components/sites/forbidden';
import { prismaClient } from '@/config/prisma.config';
import { canEdit, getGroup } from '@/lib/server-utils';

export const metadata: Metadata = {
  title: 'Hír szerkesztése',
  description: 'Frissítsd a csoportod híreit!',
};

export default async function UpdateNewsPage({ params }: { params: { id: string; newsId: string } }) {
  const userCanEdit = await canEdit(params.id);

  if (!userCanEdit) return <Forbidden />;

  const news = await getNews(params.newsId);

  if (!news) return notFound();

  const group = await getGroup(params.id);

  if (!group) return notFound();

  return (
    <main>
      <h1>{news.title}</h1>
      <Providers>
        <UpdateNewsForm news={news} group={group} />
      </Providers>
    </main>
  );
}

async function getNews(newsId: string) {
  return prismaClient.news.findUnique({
    where: {
      id: newsId,
    },
  });
}
