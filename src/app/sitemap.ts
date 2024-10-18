import { MetadataRoute } from 'next';

import { prismaClient } from '@/config/prisma.config';

const baseUrl = process.env.SITE_URL ?? '';

export const revalidate = 60 * 60 * 24;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const promises = await Promise.all([getMainSites(), getGroups(), getNews(), getEvents(), getStaticSites()]);

  const [mainSites, groups, news, events, staticSites] = promises;

  return [...mainSites, ...groups, ...news, ...events, ...staticSites];
}

const getMainSites = async () => {
  return [
    {
      url: baseUrl,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/register`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/groups`,
      priority: 0.8,
    },
  ];
};

const getGroups = async () => {
  const groups = await prismaClient.group.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  return groups.map((group) => ({
    url: `${baseUrl}/groups/${group.id}`,
    lastModified: group.updatedAt,
    priority: 0.7,
  }));
};

const getNews = async () => {
  const news = await prismaClient.news.findMany({
    where: {
      publishDate: {
        lte: new Date(),
      },
    },
    select: {
      id: true,
      updatedAt: true,
      groupId: true,
    },
  });

  return news.map((news) => ({
    url: `${baseUrl}/groups/${news.groupId}/news/${news.id}`,
    lastModified: news.updatedAt,
    priority: 0.6,
  }));
};

const getEvents = async () => {
  const events = await prismaClient.event.findMany({
    where: {
      endDate: {
        gte: new Date(),
      },
      isPrivate: false,
    },
    select: {
      id: true,
      updatedAt: true,
      groupId: true,
    },
  });

  return events.map((event) => ({
    url: `${baseUrl}/groups/${event.groupId}/events/${event.id}`,
    lastModified: event.updatedAt,
    priority: 0.6,
  }));
};

const getStaticSites = async () => {
  const staticSites = await prismaClient.staticSite.findMany({
    select: {
      url: true,
      updatedAt: true,
    },
  });

  return staticSites.map((site) => ({
    url: `${baseUrl}/sites/${site.url}`,
    lastModified: site.updatedAt,
    priority: 0.9,
  }));
};
