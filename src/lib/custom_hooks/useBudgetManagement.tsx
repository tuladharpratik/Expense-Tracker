import {
  useUpdateMonthlyIncomeBudget,
  useFindUniqueUserBudgetPreference,
  useFindManyTransaction,
  useCreateMonthlyIncomeBudget,
  useFindFirstMonthlyIncomeBudget,
} from '@/lib/hooks';
import { toast } from 'sonner';
import { TransactionType } from '@prisma/client';
import { startOfMonth } from 'date-fns';
import { endOfMonth } from 'date-fns';

export const useBudgetManagement = (userId: string) => {
  const { mutateAsync: createMonthlyBudget, isPending: isCreatingMonthlyBudget } = useCreateMonthlyIncomeBudget();
  const { mutateAsync: updateMonthlyBudget, isPending: isUpdatingMonthlyBudget } = useUpdateMonthlyIncomeBudget();
  const currentDate = new Date();

  const { data: existingBudget } = useFindFirstMonthlyIncomeBudget({
    where: {
      userId,
      monthYear: {
        gte: startOfMonth(new Date()),
        lt: endOfMonth(new Date()),
      },
    },
  });

  const { data: userPreference } = useFindUniqueUserBudgetPreference({
    where: { userId },
  });

  const { data: transactions } = useFindManyTransaction({
    where: {
      userId,
      type: TransactionType.INCOME,
    },
  });

  const calculateMonthlyIncome = (monthYear: Date) => {
    const startOfMonth = new Date(monthYear.getFullYear(), monthYear.getMonth(), 1);
    const endOfMonth = new Date(monthYear.getFullYear(), monthYear.getMonth() + 1, 0);

    const monthlyIncomes = transactions?.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
    });

    return monthlyIncomes?.reduce((total, transaction) => total + transaction.amount, 0) || 0;
  };

  const calculateBudgetAllocations = (totalIncome: number, recentlyUpdated?: any) => {
    if (!userPreference) {
      return {
        needsBudget: totalIncome * 0.5,
        wantsBudget: totalIncome * 0.3,
        savingsBudget: totalIncome * 0.2,
      };
    }

    if (recentlyUpdated) {
      return {
        needsBudget: totalIncome * (recentlyUpdated?.needsPercentage / 100),
        wantsBudget: totalIncome * (recentlyUpdated?.wantsPercentage / 100),
        savingsBudget: totalIncome * (recentlyUpdated?.savingsPercentage / 100),
      };
    }

    return {
      needsBudget: totalIncome * (userPreference.needsPercentage / 100),
      wantsBudget: totalIncome * (userPreference.wantsPercentage / 100),
      savingsBudget: totalIncome * (userPreference.savingsPercentage / 100),
    };
  };

  const updateMonthlyBudgetData = async (monthYear: Date, recentlyUpdated?: any) => {
    try {
      const totalIncome = calculateMonthlyIncome(monthYear);
      const allocations = calculateBudgetAllocations(totalIncome, recentlyUpdated);

      if (existingBudget) {
        const updatedBudget = await updateMonthlyBudget({
          where: { id: existingBudget.id },
          data: {
            totalIncome,
            ...allocations,
          },
        });
        console.log('updatedBudget', updatedBudget);
      } else {
        const newBudget = await createMonthlyBudget({
          data: {
            userId,
            monthYear,
            totalIncome,
            ...allocations,
          },
        });
      }
      toast.success('Monthly budget updated successfully!');
    } catch (error) {
      toast.error(`Failed to update monthly budget: ${(error as Error).message}`);
      throw error;
    }
  };

  return {
    updateMonthlyBudget: updateMonthlyBudgetData,
    existingBudget,
    isLoading: isCreatingMonthlyBudget || isUpdatingMonthlyBudget,
  };
};
