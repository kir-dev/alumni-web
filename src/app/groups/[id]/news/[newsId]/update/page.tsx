import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { UpdateNewsForm } from '@/components/group/update-news-form';
import Providers from '@/components/providers';
import { authOptions } from '@/config/auth.config';
import { prismaClient } from '@/config/prisma.config';

export const metadata: Metadata = {
  title: 'Hír szerkesztése',
  description: 'Frissítsd a csoportod híreit!',
};

export default async function UpdateNewsPage({ params }: { params: { id: string; newsId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const group = await prismaClient.group.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!group) return notFound();

  const adminMembership = await prismaClient.membership.findFirst({
    where: {
      groupId: params.id,
      userId: session.user.id,
      isAdmin: true,
    },
  });

  if (!adminMembership && !session.user.isSuperAdmin) return notFound();

  const news = await prismaClient.news.findUnique({
    where: {
      id: params.newsId,
    },
  });

  if (!news) return notFound();

  return (
    <main>
      <h1>{news.title}</h1>
      <Providers>
        <UpdateNewsForm news={news} />
      </Providers>
    </main>
  );
}
