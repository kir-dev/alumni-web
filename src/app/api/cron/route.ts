import { render } from '@react-email/render';
import { addDays, subDays, subYears } from 'date-fns';
import { NextResponse } from 'next/server';

import { SITE_URL } from '@/config/environment.config';
import { prismaClient } from '@/config/prisma.config';
import EventNotificationEmail from '@/emails/event-notification';
import GeneralEmail from '@/emails/general';
import NewNewsEmail from '@/emails/new-news';
import { batchSendEmail } from '@/lib/email';

export async function GET() {
  await notifyOutdatedProfiles();
  await notifyPublishedNews();
  await notifyUpcomingEvents();
  return new NextResponse();
}

async function notifyOutdatedProfiles() {
  const outdatedProfiles = await prismaClient.user.findMany({
    where: {
      updatedAt: {
        lt: subYears(new Date(), 1),
      },
    },
  });

  batchSendEmail({
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
      createdAt: {
        gt: subDays(new Date(), 1),
        lt: new Date(),
      },
    },
    include: {
      group: {
        include: {
          members: {
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

  newsFromPastDay.forEach(({ group, ...news }) => {
    batchSendEmail({
      to: group.members.map((member) => member.user.email),
      subject: news.title,
      html: render(
        NewNewsEmail({
          groupName: group.name,
          news,
          newsLink: `${SITE_URL}/news/${news.id}`,
        })
      ),
    });
  });
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

  upcomingEvents.forEach(({ EventApplication, ...event }) => {
    batchSendEmail({
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
  });
}
