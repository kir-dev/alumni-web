import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { prismaClient } from '@/config/prisma.config';
import { hashPassword } from '@/lib/utils';

export const authOptions: AuthOptions = {
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
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    newUser: '/register',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
