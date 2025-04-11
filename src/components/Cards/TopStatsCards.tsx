'use client';

import StatsCard from '@/components/Cards/StatsCard';
import { useIncomeAndExpense } from '@/lib/custom_hooks/useFindIncomeAndExpense';
import { useDateFilter } from '@/providers/DateFilterProvider';
import React from 'react';
import { TopStatsCardsSkeleton } from '../skeletons/TopStatsCardsSkeleton';

export default function TopStatsCards() {
  const { dateRange } = useDateFilter();

  // Use the combined hook
  const { data, isLoading, error } = useIncomeAndExpense(dateRange);

  // Handle loading state
  if (!data || isLoading) {
    return <TopStatsCardsSkeleton />;
  }

  // Handle error state
  if (error) {
    return <div>Error fetching data</div>;
  }

  // Calculate current and previous income and expense
  const currentIncomeAmount = data.current.income.reduce((total, income) => total + income.amount, 0);
  const currentExpenseAmount = data.current.expense.reduce((total, expense) => total + expense.amount, 0);
  const currentBalance = currentIncomeAmount - currentExpenseAmount;

  // Define card information
  const cards = [
    {
      title: 'Total Balance',
      description: 'The total balance available',
      data: currentBalance,
    },
    {
      title: 'Income',
      description: 'Total income recorded for the selected date range',
      data: currentIncomeAmount,
    },
    {
      title: 'Expense',
      description: 'Total expense recorded for the selected date range',
      data: currentExpenseAmount,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 lg:justify-between">
      {cards.map((card, index) => (
        <StatsCard cardInfo={card} key={index} />
      ))}
    </div>
  );
}
