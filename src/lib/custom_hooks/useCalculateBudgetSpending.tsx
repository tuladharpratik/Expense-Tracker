import { BudgetType } from '@prisma/client';
import { useState, useEffect, useMemo } from 'react';
import { useFindManyTransaction } from '../hooks';

interface BudgetSpending {
  needs: number;
  wants: number;
  savings: number;
  isLoading: boolean;
}

export const useCalculateBudgetSpending = (userId: string, monthYear: { gte: Date; lte: Date }) => {
  const { data: transactions, isLoading } = useFindManyTransaction({
    where: {
      userId,
      date: {
        gte: monthYear.gte,
        lte: monthYear.lte,
      },
    },
    include: {
      category: true,
    },
    // enabled: !!userId && !!monthYear,
  });

  // Move the spending calculation to useMemo
  const spendingCalculation = useMemo(() => {
    if (!transactions) {
      return {
        needs: 0,
        wants: 0,
        savings: 0,
      };
    }

    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type !== 'EXPENSE' || !transaction.category) {
          return acc;
        }

        const budgetType = transaction.category.budgetType;
        switch (budgetType) {
          case BudgetType.NEEDS:
            acc.needs += transaction.amount;
            break;
          case BudgetType.WANTS:
            acc.wants += transaction.amount;
            break;
          case BudgetType.SAVINGS:
            acc.savings += transaction.amount;
            break;
        }
        return acc;
      },
      { needs: 0, wants: 0, savings: 0 }
    );
  }, [transactions]);

  // Return the calculated values directly with isLoading
  return { ...spendingCalculation, isLoading };
};
