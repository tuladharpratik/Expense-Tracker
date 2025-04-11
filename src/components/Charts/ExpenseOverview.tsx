'use client';

import { useFindManyTransaction } from '@/lib/hooks';
import { useDateFilter } from '@/providers/DateFilterProvider';
import React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './Chart';
import { cn, formatLargeNumber } from '@/utils/utils';
import Typography from '../Typography/Typography';
import { ExpenseOverviewSkeleton } from '../skeletons/ExpenseOverviewSkeleton';
import { TransactionType } from '@prisma/client';

export const description = 'A donut chart with expense data';

const chartConfig = {
  amount: {
    label: 'Amount',
  },
} satisfies ChartConfig;

interface ChartData {
  category: string;
  amount: number;
  fill: string;
}

export default function ExpenseOverview({ title, className }: { title: string; className?: string }) {
  const { dateRange } = useDateFilter();

  const {
    data: expenseData,
    error: expenseError,
    isLoading: isLoadingExpense,
  } = useFindManyTransaction({
    where: {
      type: TransactionType.EXPENSE,
      date: {
        gte: dateRange?.startDate,
        lt: dateRange?.endDate,
      },
    },
    include: {
      category: true,
    },
  });

  // Process expense data to group by category name and sum amounts
  const chartData = React.useMemo<ChartData[]>(() => {
    if (!expenseData) return [];

    const groupedData = expenseData.reduce<Record<string, ChartData>>((acc, expense) => {
      if (!expense.category) return acc;
      const categoryName = expense.category.name;
      if (!acc[categoryName]) {
        const colorIndex = (Object.keys(acc).length % 5) + 1; // 5 colors available
        acc[categoryName] = {
          category: categoryName,
          amount: 0,
          fill: `hsl(var(--chart-${colorIndex}))`,
        };
      }
      acc[categoryName].amount += expense.amount;
      return acc;
    }, {});

    return Object.values(groupedData);
  }, [expenseData]);

  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [chartData]);

  if (!expenseData || isLoadingExpense) {
    return <ExpenseOverviewSkeleton />;
  }

  return (
    <div className={cn('flex flex-col justify-between rounded-lg border border-neutral-200 p-4', className)}>
      <div className="items-center pb-0">
        <Typography variant={'body1'} element={'p'} className="font-semibold tracking-wide">
          {title}
        </Typography>
        <div>
          Showing expenses from {dateRange?.startDate?.toLocaleDateString()} to{' '}
          {dateRange?.endDate?.toLocaleDateString()}
        </div>
      </div>
      <div className="">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[360px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="amount" nameKey="category" innerRadius={80} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          NPR {formatLargeNumber(totalAmount)}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Total Expense
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
      <div className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">Showing total expenses for the selected period</div>
      </div>
    </div>
  );
}
