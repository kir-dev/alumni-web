import { TRPCError } from '@trpc/server';

import { prismaClient } from '@/config/prisma.config';
import { groupAdminProcedure } from '@/trpc/trpc';
import { CreateNewsDto, DeleteNewsDto, UpdateNewsDto } from '@/types/news.types';

export const createNews = groupAdminProcedure.input(CreateNewsDto).mutation(async (opts) => {
  const { groupId, publishDate, ...data } = opts.input;
  const group = await prismaClient.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!group) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Group not found',
    });
  }

  const news = await prismaClient.news.create({
    data: {
      ...data,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      group: {
        connect: {
          id: groupId,
        },
      },
    },
  });

  // const emailRecipients = group.members.filter(({ user }) => Boolean(user.emailVerified)).map(({ user }) => user.email);

  // batchSendEmail({
  //   to: emailRecipients,
  //   subject: news.title,
  //   html: render(
  //     NewNewsEmail({ news, newsLink: `${SITE_URL}/groups/${group.id}/news/${news.id}`, groupName: group.name })
  //   ),
  // });

  return news;
});

export const updateNews = groupAdminProcedure.input(UpdateNewsDto).mutation(async (opts) => {
  const { groupId, id, ...data } = opts.input;

  const news = await prismaClient.news.update({
    where: {
      id,
      groupId,
    },
    data,
  });

  if (!news) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'News not found',
    });
  }

  return news;
});

export const deleteNews = groupAdminProcedure.input(DeleteNewsDto).mutation(async (opts) => {
  const { groupId, newsId } = opts.input;

  await prismaClient.news.delete({
    where: {
      id: newsId,
      groupId,
    },
  });
});
