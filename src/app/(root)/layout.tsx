import DashboardMobileNavbar from '@/components/DashboardMenu/DashboardMobileNavbar';
import DashboardNavbar from '@/components/DashboardMenu/DashboardHeader';
import DashboardSideNav from '@/components/DashboardMenu/DashboardSideNav';
import { DateFilterProvider } from '@/providers/DateFilterProvider';
import React from 'react';
import CategoriesProvider from '@/providers/CategoriesProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen lg:flex">
      <DashboardSideNav className="hidden min-w-16 lg:flex" />
      <div className="flex flex-1 flex-col gap-6 lg:gap-0">
        <DashboardMobileNavbar className="lg:hidden" />
        <DateFilterProvider>
          <CategoriesProvider>
            <div className="container mt-4">{children}</div>
          </CategoriesProvider>
        </DateFilterProvider>
      </div>
    </main>
  );
}
