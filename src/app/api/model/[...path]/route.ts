import { authOptions } from '@/server/auth';
import { db } from '@/server/db';
import { enhance } from '@zenstackhq/runtime';
import { NextRequestHandler } from '@zenstackhq/server/next';
import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';

async function getPrisma() {
  const session = await getServerSession(authOptions);
  const user = session
    ? {
        id: session.user.id,
        accountType: session.user.accountType as Role,
      }
    : undefined;
  return enhance(db, { user });
}

const handler = NextRequestHandler({ getPrisma, useAppDir: true });

export { handler as DELETE, handler as GET, handler as PATCH, handler as POST, handler as PUT };
