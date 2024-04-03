// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      isSuperAdmin: boolean;
    };
  }
}
