import { z } from 'zod';

import { prismaClient } from '@/config/prisma.config';
import { publicProcedure } from '@/trpc/trpc';

export const publicSearch = publicProcedure.input(z.string()).query(async ({ input }) => {
  const news = await prismaClient.news.findMany({
    where: {
      title: {
        contains: input,
        mode: 'insensitive',
      },
      publishDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      publishDate: 'desc',
    },
  });

  const events = await prismaClient.event.findMany({
    where: {
      name: {
        contains: input,
        mode: 'insensitive',
      },
      isPrivate: false,
      endDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      startDate: 'asc',
    },
  });

  const groups = await prismaClient.group.findMany({
    where: {
      name: {
        contains: input,
        mode: 'insensitive',
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return {
    news,
    events,
    groups,
  };
});
