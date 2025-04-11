import { useState, useEffect } from 'react';
import { useFindManyTransaction } from '@/lib/hooks';
import { TransactionType } from '@prisma/client';

interface IncomeExpenseRecord {
  amount: number;
  date: string;
}

interface IncomeExpenseData {
  current: {
    income: IncomeExpenseRecord[];
    expense: IncomeExpenseRecord[];
  };
  previous: {
    income: IncomeExpenseRecord[];
    expense: IncomeExpenseRecord[];
  };
}

function calculateDateRange(monthsAgo = 0): { startDate: Date; endDate: Date } {
  const startDate = new Date();
  const endDate = new Date();

  startDate.setMonth(startDate.getMonth() - monthsAgo);
  startDate.setDate(1);
  endDate.setDate(0);

  return { startDate, endDate };
}

const previousDateRange = calculateDateRange(1);

export function useIncomeAndExpense(dateRange: { startDate: Date; endDate: Date } | null) {
  const [data, setData] = useState<IncomeExpenseData>({
    current: { income: [], expense: [] },
    previous: { income: [], expense: [] },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch current transactions
  const currentTransactions = useFindManyTransaction({
    where: {
      date: {
        gte: dateRange?.startDate,
        lte: dateRange?.endDate,
      },
    },
    select: {
      amount: true,
      date: true,
      type: true,
    },
  });

  // Fetch previous transactions
  const previousTransactions = useFindManyTransaction({
    where: {
      date: {
        gte: previousDateRange.startDate,
        lte: previousDateRange.endDate,
      },
    },
    select: {
      amount: true,
      date: true,
      type: true,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange) return;

      setIsLoading(true);
      setError(null);

      try {
        if (
          !currentTransactions.isLoading &&
          !previousTransactions.isLoading &&
          currentTransactions.data &&
          previousTransactions.data
        ) {
          const mapToRecord = (item: { amount: number; date: Date }): IncomeExpenseRecord => ({
            amount: item.amount,
            date: item.date.toISOString(),
          });

          setData({
            current: {
              income: currentTransactions.data.filter((tx) => tx.type === TransactionType.INCOME).map(mapToRecord),
              expense: currentTransactions.data.filter((tx) => tx.type === TransactionType.EXPENSE).map(mapToRecord),
            },
            previous: {
              income: previousTransactions.data.filter((tx) => tx.type === TransactionType.INCOME).map(mapToRecord),
              expense: previousTransactions.data.filter((tx) => tx.type === TransactionType.EXPENSE).map(mapToRecord),
            },
          });
        }
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    currentTransactions.isLoading,
    previousTransactions.isLoading,
    currentTransactions.data,
    previousTransactions.data,
    dateRange,
  ]);

  return { data, isLoading, error };
}
