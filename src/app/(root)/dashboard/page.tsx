import React from 'react';
import TopStatsCards from '../../../components/Cards/TopStatsCards';
import IncomeExpenseChart from '@/components/Charts/IncomeExpenseChart';
import ExpenseOverview from '@/components/Charts/ExpenseOverview';
import DashboardHeader from '@/components/DashboardMenu/DashboardHeader';
import DateFilter from '@/components/Filters/DateFilter';

export default function page() {
  return (
    <section className="flex flex-col gap-8">
      <DashboardHeader className="hidden py-6 lg:flex" />
      <DateFilter />
      <TopStatsCards />
      <div className="lg:flex lg:gap-4">
        <IncomeExpenseChart title="Money Flow" className="lg:basis-7/12" />
        <ExpenseOverview title="Expenses" className="lg:basis-5/12" />
      </div>
      <div></div>
    </section>
  );
}
