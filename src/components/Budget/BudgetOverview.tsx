'use client';

import { useState, useEffect, useMemo } from 'react';
import Typography from '@/components/Typography/Typography';
import { Progress } from '@/components/Progress/Progress';
import { useFindFirstMonthlyIncomeBudget, useFindUniqueUserBudgetPreference } from '@/lib/hooks';
import { useSession } from 'next-auth/react';
import { useCalculateBudgetSpending } from '@/lib/custom_hooks/useCalculateBudgetSpending';

interface BudgetCategoryProps {
  label: string;
  allocated: number;
  spent: number;
  total: number;
}

const BudgetCategory = ({ label, allocated, spent, total }: BudgetCategoryProps) => {
  const percentage = (spent / allocated) * 100;
  const remainingAmount = allocated - spent;

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">
          Rs. {spent.toFixed(2)} / Rs. {allocated.toFixed(2)}
        </Typography>
      </div>
      <Progress value={percentage} max={100} />
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{percentage.toFixed(1)}% used</span>
        <span className={`${remainingAmount < 0 ? 'text-red-500' : 'text-green-500'}`}>
          Rs. {Math.abs(remainingAmount).toFixed(2)} {remainingAmount < 0 ? 'over' : 'remaining'}
        </span>
      </div>
    </div>
  );
};

export default function BudgetOverview() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id || '';
  const [currentDate] = useState(new Date());

  // Create start and end of month dates for comparison
  const dateRange = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return {
      gte: startOfMonth,
      lte: endOfMonth,
    };
  }, [currentDate]);

  const { data: monthlyBudget, isLoading: budgetLoading } = useFindFirstMonthlyIncomeBudget({
    where: {
      userId,
      monthYear: {
        gte: dateRange.gte,
        lte: dateRange.lte,
      },
    },
  });

  const { data: userPreference } = useFindUniqueUserBudgetPreference({
    where: { userId: userId },
    // enabled: !!userId,
  });

  const {
    needs: needsSpent,
    wants: wantsSpent,
    savings: savingsSpent,
    isLoading: spendingLoading,
  } = useCalculateBudgetSpending(userId, dateRange);

  if (budgetLoading || spendingLoading) {
    return <div>Loading budget information...</div>;
  }

  if (!monthlyBudget) {
    return <div>No budget found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h3">
          Budget Overview - {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>
        <Typography variant="body2">Total Income: Rs. {monthlyBudget.totalIncome.toFixed(2)}</Typography>
      </div>

      <div className="space-y-6">
        <BudgetCategory
          label={`Needs (${userPreference?.needsPercentage.toFixed(2)}%)`}
          allocated={monthlyBudget.needsBudget}
          spent={needsSpent}
          total={monthlyBudget.totalIncome}
        />
        <BudgetCategory
          label={`Wants (${userPreference?.wantsPercentage.toFixed(2)}%)`}
          allocated={monthlyBudget.wantsBudget}
          spent={wantsSpent}
          total={monthlyBudget.totalIncome}
        />
        <BudgetCategory
          label={`Savings (${userPreference?.savingsPercentage.toFixed(2)}%)`}
          allocated={monthlyBudget.savingsBudget}
          spent={savingsSpent}
          total={monthlyBudget.totalIncome}
        />
      </div>
    </div>
  );
}
