import { NextRequest } from 'next/server';

import { prismaClient } from '@/config/prisma.config';

export const GET = async (
  _: NextRequest,
  {
    params: { token },
  }: {
    params: {
      token: string;
    };
  }
) => {
  try {
    await verifyToken(token);
    return Response.redirect('http://localhost:3000/login?verified=true');
  } catch (error) {
    return Response.redirect('http://localhost:3000/login?verified=false');
  }
};

async function verifyToken(token: string) {
  const verificationToken = await prismaClient.verificationToken.findUnique({
    where: {
      token,
    },
  });

  if (!verificationToken) {
    throw new Error('Invalid token');
  }

  await prismaClient.user.update({
    where: {
      id: verificationToken.userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await prismaClient.verificationToken.delete({
    where: {
      token,
    },
  });
}
