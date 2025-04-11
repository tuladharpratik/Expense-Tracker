'use client';
import React from 'react';
import { Icon } from '@iconify/react';
import Typography from '../Typography/Typography';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

interface DashboardMenuProps {
  item: {
    name: string;
    path: string;
    icon: string;
  };
  showText?: boolean;
}

export default function DashboardMenu({ item, showText = true }: DashboardMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname === item.path;

  function handleClick() {
    if (item.name === 'Logout') {
      signOut();
      toast.success('Signed out successfully');
      router.push('/auth/signin');
      return;
    }
    return router.push(`${item.path}`);
  }

  return (
    <button
      onClick={handleClick}
      className={clsx('flex items-center gap-2 rounded-full p-4 transition-colors', {
        'bg-primary-600 text-white': isActive,
        'hover:bg-primary-500': !isActive,
        'justify-center': !showText,
      })}
    >
      <span>
        <Icon icon={item.icon} width={24} height={24} />
      </span>
      <Typography
        variant="body1"
        className={clsx('origin-left transition-all duration-300', {
          'scale-x-100 opacity-100': showText,
          'scale-x-0 opacity-0': !showText,
        })}
        style={{ width: showText ? 'auto' : 0 }} // Prevents text from taking space when hidden
      >
        {item.name}
      </Typography>
    </button>
  );
}
