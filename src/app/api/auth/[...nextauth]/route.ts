import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { prismaClient } from '@/config/prisma.config';
import { hashPassword } from '@/lib/utils';

const handler = NextAuth({
  adapter: PrismaAdapter(prismaClient),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Jelszó', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const hashedPassword = hashPassword(credentials.password);
        const user = await prismaClient.user.findFirst({
          where: {
            email: credentials.email,
            password: hashedPassword,
          },
        });

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
