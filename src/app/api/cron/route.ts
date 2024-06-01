import { render } from '@react-email/render';
import { subYears } from 'date-fns';
import { NextResponse } from 'next/server';

import { prismaClient } from '@/config/prisma.config';
import GeneralEmail from '@/emails/general';
import { batchSendEmail } from '@/lib/email';

export async function GET() {
  await notifyOutdatedProfiles();
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
