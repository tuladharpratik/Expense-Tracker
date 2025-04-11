import DashboardHeader from '@/components/DashboardMenu/DashboardHeader';
import React from 'react';
import TransactionTable from './TransactionTable';

export default function page() {
  return (
    <section className="flex flex-col gap-6">
      <DashboardHeader
        className="hidden py-6 lg:flex"
        heading="Transactions"
        subheading="View, create and manage your transactions"
      />
      <TransactionTable />
    </section>
  );
}
