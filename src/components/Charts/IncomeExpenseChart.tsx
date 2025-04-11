'use client';

import React from 'react';
import { useDateFilter } from '@/providers/DateFilterProvider'; // Import the DateFilter context
import Typography from '../Typography/Typography';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './Chart';
import { CartesianGrid, Bar, BarChart, XAxis, YAxis } from 'recharts';
import clsx from 'clsx';
import { useFindManyTransaction } from '@/lib/hooks';
import { cn } from '@/utils/utils';
import { IncomeExpenseChartSkeleton } from '../skeletons/IncomeExpenseChartSkeleton';
import { TransactionType } from '@prisma/client';

// Configuration for different data categories
const chartConfig = {
  income: {
    label: 'Income',
    color: 'var(--income)',
  },
  expense: {
    label: 'Expense',
    color: 'var(--expense)',
  },
} satisfies ChartConfig;

interface IncomeExpenseChartProps {
  title: string;
  className?: string;
}

export default function IncomeExpenseChart({ title, className }: IncomeExpenseChartProps) {
  const { dateRange } = useDateFilter();

  // Fetch all transactions within date range
  const {
    data: transactions,
    error: transactionError,
    isLoading: isLoadingTransactions,
  } = useFindManyTransaction({
    where: {
      date: {
        gte: dateRange?.startDate,
        lt: dateRange?.endDate,
      },
      type: {
        in: [TransactionType.INCOME, TransactionType.EXPENSE],
      },
    },
  });

  // Check if data is loading or if there's an error
  if (isLoadingTransactions) {
    return <IncomeExpenseChartSkeleton />;
  }

  if (transactionError) {
    return <div>Error loading data</div>;
  }

  // Aggregate income data by month and year
  const incomeChartData =
    transactions
      ?.filter((t) => t.type === TransactionType.INCOME)
      .reduce((acc: any, income) => {
        const date = new Date(income.date);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        acc[monthYear] = (acc[monthYear] || 0) + income.amount;
        return acc;
      }, {}) || {};

  // Aggregate expense data by month and year
  const expenseChartData =
    transactions
      ?.filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((acc: any, expense) => {
        const date = new Date(expense.date);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
        return acc;
      }, {}) || {};

  // Get unique month-year combinations from the date range
  const chartData = [];
  const startDate = new Date(dateRange?.startDate || new Date());
  const currentDate = new Date(startDate);
  const endDate = new Date(dateRange?.endDate || new Date());

  while (currentDate <= endDate) {
    const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    chartData.push({
      monthYear,
      income: incomeChartData[monthYear] || 0,
      expense: expenseChartData[monthYear] || 0,
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const comparisionKeys = Object.keys(chartConfig);

  return (
    <div className={cn('rounded-lg border border-neutral-200 p-4', className)}>
      <div className="flex items-center justify-between gap-4">
        <Typography variant={'body1'} element={'p'} className="font-semibold tracking-wide">
          {title}
        </Typography>
        {comparisionKeys && comparisionKeys.length > 0 && (
          <div className="flex items-center gap-4">
            {comparisionKeys.map((key, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className={clsx(`h-4 w-4 rounded-full`, {
                    'bg-[var(--income)]': key === 'income',
                    'bg-[var(--expense)]': key === 'expense',
                  })}
                ></span>
                {chartConfig[key as keyof typeof chartConfig].label}
              </div>
            ))}
          </div>
        )}
      </div>
      <ChartContainer config={chartConfig} className="mt-6 min-h-[200px] w-full">
        <BarChart data={chartData} margin={{ left: 60, right: 20, top: 10, bottom: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="monthYear"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.split(' ')[0].slice(0, 3)}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toLocaleString()}`}
            tickMargin={10}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {comparisionKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={chartConfig[key as keyof typeof chartConfig].color}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}
