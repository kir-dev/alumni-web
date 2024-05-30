import { Event, MembershipStatus, News } from '@prisma/client';

import { prismaClient } from '@/config/prisma.config';

export type EventFeedItem = {
  type: 'event';
  groupName: string;
  date: Date;
  event: Event;
};

export type NewsFeedItem = {
  type: 'news';
  groupName: string;
  date: Date;
  news: News;
};

export function getFeed(userId: string): Promise<(EventFeedItem | NewsFeedItem)[]> {
  return Promise.all([getEventFeedItems(userId), getNewsFeedItems(userId)]).then(([eventFeedItems, newsFeedItems]) => {
    const feedItems = [...eventFeedItems, ...newsFeedItems];
    feedItems.sort((a, b) => b.date.getTime() - a.date.getTime());
    return feedItems;
  });
}

async function getEventFeedItems(userId: string): Promise<EventFeedItem[]> {
  const memberShips = await prismaClient.membership.findMany({
    where: {
      userId,
      status: MembershipStatus.Approved,
    },
  });

  const events = await prismaClient.event.findMany({
    where: {
      groupId: {
        in: memberShips.map((membership) => membership.groupId),
      },
    },
    include: {
      group: true,
    },
  });

  return events.map((event) => ({
    type: 'event',
    groupName: event.group.name,
    date: event.createdAt,
    event,
  }));
}

async function getNewsFeedItems(userId: string): Promise<NewsFeedItem[]> {
  const memberShips = await prismaClient.membership.findMany({
    where: {
      userId,
      status: MembershipStatus.Approved,
    },
  });

  const news = await prismaClient.news.findMany({
    where: {
      groupId: {
        in: memberShips.map((membership) => membership.groupId),
      },
      publishDate: {
        lte: new Date(),
      },
    },
    include: {
      group: true,
    },
  });

  return news.map((news) => ({
    type: 'news',
    title: news.title,
    groupName: news.group.name,
    date: news.createdAt,
    news,
  }));
}
