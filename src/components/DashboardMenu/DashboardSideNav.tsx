'use client';

import React, { useState } from 'react';
import DashboardMenu from './DashboardMenu';
import { cn } from '@/utils/utils';
import { adminMenuItems, menuItems, secondaryMenu } from '@/constants/navConstants';
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';

export default function DashboardSideNav({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const { user } = session || {};
  const isAdmin = user?.accountType === 'ADMIN';
  const [isCollapsed, setIsCollapsed] = useState(false);

  function handleToggle() {
    setIsCollapsed((prev) => !prev);
  }

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen flex-col justify-between gap-14 bg-primary-200 px-4 py-6 transition-all duration-300',
        className,
        {
          'w-64': !isCollapsed,
          'w-20': isCollapsed,
        }
      )}
    >
      <h3>PFMS</h3>
      <div className="relative flex h-full flex-col justify-between">
        <button
          onClick={handleToggle}
          className={cn(
            'absolute right-2 top-[-3rem] flex h-8 w-8 items-center justify-center rounded-full border border-neutral-500 p-1 transition-transform duration-300',
            {
              'rotate-180': isCollapsed,
            }
          )}
        >
          <Icon icon="weui:back-filled" fontSize={'1.5rem'} />
        </button>
        <div className="flex flex-col gap-3">
          {!isAdmin &&
            menuItems.map((item, index) => <DashboardMenu item={item} key={index} showText={!isCollapsed} />)}
          {isAdmin &&
            adminMenuItems.map((item, index) => <DashboardMenu item={item} key={index} showText={!isCollapsed} />)}
        </div>
        <div className="flex flex-col gap-2">
          {secondaryMenu.map((item, index) => (
            <DashboardMenu item={item} key={index} showText={!isCollapsed} />
          ))}
        </div>
      </div>
    </aside>
  );
}
