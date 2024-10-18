import { MembershipStatus } from '@prisma/client';
import { z } from 'zod';

import { prismaClient } from '@/config/prisma.config';
import { publicProcedure } from '@/trpc/trpc';

export const publicSearch = publicProcedure.input(z.string()).query(async ({ input }) => {
  const [news, events, groups] = await Promise.all([getNews(input), getEvents(input), getGroups(input)]);

  return {
    news,
    events,
    groups,
  };
});

export const privateSearch = publicProcedure.input(z.string()).query(async (opts) => {
  const userId = opts.ctx.session?.user.id;

  const [news, events, groups] = await Promise.all([
    getNews(opts.input),
    getEvents(opts.input, userId),
    getGroups(opts.input),
  ]);

  return {
    news,
    events,
    groups,
  };
});

const getNews = async (input: string) => {
  return prismaClient.news.findMany({
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
};

const getEvents = async (input: string, userId?: string) => {
  const memberShips = userId
    ? await prismaClient.membership.findMany({
        where: {
          userId,
          status: MembershipStatus.Approved,
        },
      })
    : [];

  return prismaClient.event.findMany({
    where: {
      name: {
        contains: input,
        mode: 'insensitive',
      },
      endDate: {
        gte: new Date(),
      },
      OR: [
        {
          groupId: {
            in: memberShips.map((membership) => membership.groupId),
          },
        },
        {
          isPrivate: false,
        },
      ],
    },
    orderBy: {
      startDate: 'asc',
    },
  });
};

const getGroups = async (input: string) => {
  return prismaClient.group.findMany({
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
};
