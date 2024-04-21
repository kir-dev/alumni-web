import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticator } from 'otplib';

import { prismaClient } from '@/config/prisma.config';
import { hashPassword } from '@/lib/utils';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Jelszó', type: 'password' },
        token: { label: 'Token', type: 'text', required: false },
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
          include: {
            TfaToken: {
              where: {
                isEnabled: true,
              },
            },
          },
        });
        if (user?.TfaToken) {
          if (!credentials.token) throw new Error('token_required');
          const isValidToken = authenticator.verify({
            token: credentials.token,
            secret: user.TfaToken.secret,
          });
          if (!isValidToken) throw new Error('invalid_token');
        }

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (!token.sub) return session;
      const user = await prismaClient.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      session.user = {
        id: token.sub,
        email: session.user?.email,
        isSuperAdmin: user?.isSuperAdmin ?? false,
      };
      return session;
    },
  },
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
