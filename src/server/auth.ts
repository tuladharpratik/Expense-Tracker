import { PrismaAdapter } from '@auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import NextAuth, { type DefaultSession, type NextAuthOptions, RequestInternal } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      accountType: string;
    } & DefaultSession['user'];
  }
}

interface User {
  id: string;
  username: string;
  accountType: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === 'update') {
        const updatedUser = await db.user.findUnique({
          where: { email: token.email as string },
          select: {
            id: true,
            email: true,
            username: true,
            accountType: true,
          },
        });
        if (updatedUser) {
          token.username = updatedUser.username;
          token.email = updatedUser.email;
          token.accountType = updatedUser.accountType;
        }
      } else if (user) {
        token.username = (user as User).username;
        token.accountType = (user as User).accountType;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.username = token.username as string;
        session.user.accountType = token.accountType as string;
        session.user.email = token.email;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      authorize: authorize(db),
    }),
  ],
};

function authorize(prisma: PrismaClient) {
  return async (
    credentials: (Record<'email' | 'password', string> & Partial<Record<'username' | 'isSignUp', string>>) | undefined,
    _req: Pick<RequestInternal, 'query' | 'body' | 'headers' | 'method'>
  ) => {
    if (!credentials?.email) throw new Error('"email" is required');
    if (!credentials?.password) throw new Error('"password" is required');

    // Handle signup
    if (credentials.isSignUp === 'true') {
      const existingUser = await prisma.user.findFirst({
        where: { email: credentials.email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await hash(credentials.password, 12);
      const newUser = await prisma.user.create({
        data: {
          email: credentials.email,
          password: hashedPassword,
          username: credentials.username || '',
          accountType: 'USER',
          budgetPreference: {
            create: {
              strategy: 'FIFTY_THIRTY_TWENTY',
              needsPercentage: 50,
              wantsPercentage: 30,
              savingsPercentage: 20,
            },
          },
        },
        select: {
          id: true,
          email: true,
          username: true,
          accountType: true,
        },
      });

      return newUser;
    }

    // Handle login (existing code)
    const maybeUser = await prisma.user.findFirst({
      where: { email: credentials.email },
      select: { id: true, email: true, password: true, username: true, accountType: true },
    });

    if (!maybeUser?.password) return null;
    const isValid = await compare(credentials.password, maybeUser.password);
    if (!isValid) return null;

    return {
      id: maybeUser.id,
      email: maybeUser.email,
      username: maybeUser.username,
      accountType: maybeUser.accountType,
    };
  };
}

export default NextAuth(authOptions);
