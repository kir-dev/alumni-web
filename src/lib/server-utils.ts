import { headers } from 'next/headers';

import { prismaClient } from '@/config/prisma.config';

export async function getDomainForHost() {
  const host = headers().get('host');

  return host
    ? await prismaClient.groupDomain.findFirst({
        where: {
          domain: host,
        },
        include: {
          group: true,
        },
      })
    : null;
}
