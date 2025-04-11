import { useMemo } from 'react';
import { useFindManyTransaction } from '../hooks';
import { useFindUniqueUserBudgetPreference } from '../hooks/user-budget-preference';
import { useFindFirstMonthlyIncomeBudget } from '../hooks/monthly-income-budget';
import RecommendationEngine from '../algorithms/recommendationEngine';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const useBudgetRecommendations = (userId: string) => {
  const { data: transactions, isLoading: transactionsLoading } = useFindManyTransaction({
    where: {
      userId,
      date: {
        gte: startOfMonth(subMonths(new Date(), 6)), // Start of the month, 6 months ago
        lte: endOfMonth(new Date()), // End of the current month
      },
    },
    include: {
      category: true,
    },
  });

  const { data: budgetPreference, isLoading: budgetPreferenceLoading } = useFindUniqueUserBudgetPreference({
    where: { userId },
  });

  const { data: monthlyIncome, isLoading: monthlyIncomeLoading } = useFindFirstMonthlyIncomeBudget({
    where: {
      userId,
      monthYear: {
        gte: startOfMonth(new Date()),
        lte: endOfMonth(new Date()),
      },
    },
  });

  const recommendations = useMemo(() => {
    if (!transactions || !budgetPreference || !monthlyIncome || 
        transactionsLoading || budgetPreferenceLoading || monthlyIncomeLoading) {
      return [];
    }

    const engine = new RecommendationEngine(transactions, {
      strategy: budgetPreference.strategy,
      needsPercentage: budgetPreference.needsPercentage,
      wantsPercentage: budgetPreference.wantsPercentage,
      savingsPercentage: budgetPreference.savingsPercentage,
      monthlyIncome: monthlyIncome.totalIncome,
    });

    return engine.generateRecommendations();
  }, [
    transactions,
    budgetPreference,
    monthlyIncome,
    transactionsLoading,
    budgetPreferenceLoading,
    monthlyIncomeLoading,
  ]);

  return {
    recommendations,
    isLoading: transactionsLoading || budgetPreferenceLoading || monthlyIncomeLoading,
  };
};
