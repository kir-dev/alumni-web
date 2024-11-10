import { MembershipStatus } from '@prisma/client';
import { render } from '@react-email/render';
import { addDays, subDays, subMonths, subYears } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

import { SITE_URL } from '@/config/environment.config';
import { prismaClient } from '@/config/prisma.config';
import EventNotificationEmail from '@/emails/event-notification';
import GeneralEmail from '@/emails/general';
import NewNewsEmail from '@/emails/new-news';
import { batchSendEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('Unauthorized request to cron job');
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  await notifyOutdatedProfiles();
  await notifyPublishedNews();
  await notifyUpcomingEvents();
  await cleanAuditLogs();
  return new NextResponse();
}

async function notifyOutdatedProfiles() {
  const outdatedProfiles = await prismaClient.user.findMany({
    where: {
      NOT: {
        emailVerified: null,
      },
      updatedAt: {
        lt: subYears(new Date(), 1),
        gt: subDays(subYears(new Date(), 1), 1),
      },
    },
  });

  await batchSendEmail({
    to: outdatedProfiles.map((user) => user.email),
    subject: 'Profil frissítése',
    html: render(
      GeneralEmail({
        content:
          'A profilod több mint egy éve nem frissült.\nKérjük, hogy ellenőrizd az adataidat, frissítsd őket ha szükséges, és kattints a mentés gombra.\nFigyelem: a mentés szükséges akkor is, ha nem történt változás!',
      })
    ),
  });
}

async function notifyPublishedNews() {
  const newsFromPastDay = await prismaClient.news.findMany({
    where: {
      publishDate: {
        gt: subDays(new Date(), 1),
        lt: new Date(),
      },
      shouldNotify: true,
    },
    include: {
      group: {
        include: {
          members: {
            where: {
              status: MembershipStatus.Approved,
              enableNewsNotification: true,
            },
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  for (const news of newsFromPastDay) {
    await batchSendEmail({
      to: news.group.members.map((member) => member.user.email),
      subject: news.title,
      html: render(
        NewNewsEmail({
          groupName: news.group.name,
          news,
          newsLink: `${SITE_URL}/news/${news.id}`,
        })
      ),
    });
  }
}

async function notifyUpcomingEvents() {
  const upcomingEvents = await prismaClient.event.findMany({
    where: {
      startDate: {
        gt: new Date(),
        lt: addDays(new Date(), 1),
      },
    },
    include: {
      group: {
        select: {
          name: true,
          id: true,
        },
      },
      EventApplication: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  for (const { EventApplication, ...event } of upcomingEvents) {
    await batchSendEmail({
      to: EventApplication.map((application) => application.user.email),
      subject: `${event.name} hamarosan kezdődik!`,
      html: render(
        EventNotificationEmail({
          groupName: event.group.name,
          event,
          eventLink: `${SITE_URL}/groups/${event.group.id}/events/${event.id}`,
        })
      ),
    });
  }
}

async function cleanAuditLogs() {
  await prismaClient.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: subMonths(new Date(), 1),
      },
    },
  });
}
