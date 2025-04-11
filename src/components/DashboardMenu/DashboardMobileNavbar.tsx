'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/utils/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../Sheet/Sheet';
import { adminMenuItems, menuItems, secondaryMenu } from '@/constants/navConstants';
import DashboardMenu from './DashboardMenu';
import { useSession } from 'next-auth/react';

export default function DashboardMobileNavbar({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const { user } = session || {};
  const isAdmin = user?.accountType === 'ADMIN';

  return (
    <nav className={cn('bg-primary-600', className)}>
      <div className="container flex items-center justify-between py-2">
        <Sheet>
          <SheetTrigger>
            <div>
              <Icon icon="solar:hamburger-menu-broken" className="text-4xl text-white" />
            </div>
          </SheetTrigger>
          <SheetContent side={'left'} className="flex w-[400px] flex-col bg-white sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>PFMS</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                {!isAdmin && menuItems.map((item, index) => <DashboardMenu item={item} key={index} />)}
                {isAdmin && adminMenuItems.map((item, index) => <DashboardMenu item={item} key={index} />)}
              </div>
              <div className="mt-auto flex flex-col gap-2">
                {secondaryMenu.map((item, index) => (
                  <DashboardMenu item={item} key={index} />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-neutral-300 p-2">
            <Icon icon="ic:baseline-search" className="text-2xl text-white" />
          </div>
        </div>
      </div>
    </nav>
  );
}
