'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import Typography from '../Typography/Typography';
import { cn } from '@/utils/utils';

export default function DashboardHeader({
  className,
  heading,
  subheading,
}: {
  className?: string;
  heading?: string;
  subheading?: string;
}) {
  const { data: session, status } = useSession();
  const username = session?.user?.username || '';

  const headingText = heading || `Welcome back, ${username}`;
  const subheadingText = subheading || 'It is the best time to manage your finances now.';

  return (
    <nav className={cn('flex w-full items-center justify-between gap-10', className)}>
      <div>
        <Typography variant={'h3'} element={'h3'} className="capitalize">
          {headingText}
        </Typography>
        <Typography variant={'caption'} className="mt-1 text-neutral-300">
          {subheadingText}
        </Typography>
      </div>
    </nav>
  );
}
