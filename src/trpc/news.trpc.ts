import { prismaClient } from '@/config/prisma.config';
import { groupAdminProcedure } from '@/trpc/trpc';
import { CreateNewsDto } from '@/types/news.types';

export const createNews = groupAdminProcedure.input(CreateNewsDto).mutation(async (opts) => {
  const { groupId, publishDate, ...data } = opts.input;
  return prismaClient.news.create({
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
});
