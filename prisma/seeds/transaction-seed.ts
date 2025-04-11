import { PrismaClient, TransactionType } from '@prisma/client';
import { subMonths, subDays, addDays, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

// Configuration for generating transactions
const SEED_CONFIG = {
  monthsOfHistory: 2, // Generate data for the past 6 months
  maxTransactionsPerDay: 5, // Maximum transactions per day
  probabilityAdjustment: 1.0, // Adjust probability of transactions
};

// Spending patterns to simulate real-world behavior
const SPENDING_PATTERNS = {
  // Pattern 1: High Essential Spending (Budget Warning)
  GROCERIES: {
    baseAmount: 800, // High spending on groceries
    variance: 100, // Random variation
    frequency: 0.9, // Almost daily groceries
  },

  // Pattern 2: Extreme Weekend Spending
  DINING: {
    weekdayAmount: 25, // Coffee/lunch on weekdays
    weekendAmount: 400, // Expensive weekend dining
    frequency: 1.0, // Guaranteed transactions
  },

  // Pattern 3: Rapidly Increasing Entertainment
  ENTERTAINMENT: {
    baseAmount: 100,
    monthlyIncrease: 0.8, // 80% increase each month
    frequency: 0.8,
    variance: 50,
  },

  // Pattern 4: Frequent Small Shopping
  SHOPPING: {
    baseAmount: 50, // Small amounts
    frequency: 1.0, // Daily shopping
    variance: 30,
    increasingFrequency: true,
  },

  // Pattern 5: High Fixed Costs
  UTILITIES: {
    baseAmount: 500, // High utilities
    variance: 50,
    frequency: 1.0, // Monthly
    monthlyIncrease: 0.2, // 20% monthly increase
  },

  // Pattern 6: Rent/Mortgage
  RENT: {
    baseAmount: 2000, // High fixed cost
    frequency: 1.0, // Monthly
    variance: 0,
  },
};

export async function transactionSeed() {
  const user = await prisma.user.findFirst({
    where: { email: 'john.doe@example.com' },
  });

  if (!user) {
    console.log('❌ Regular user not found');
    return;
  }

  const categories = await prisma.category.findMany();
  const findCategoryByName = (name: string) => categories.find((c) => c.name === name);

  // Get all required categories
  const categoryMap = {
    groceries: findCategoryByName('Groceries'),
    utilities: findCategoryByName('Utilities'),
    entertainment: findCategoryByName('Entertainment'),
    transport: findCategoryByName('Transportation'),
    rent: findCategoryByName('Rent/Mortgage'),
    dining: findCategoryByName('Dining Out'),
    shopping: findCategoryByName('Shopping'),
    healthcare: findCategoryByName('Healthcare'),
  };

  if (Object.values(categoryMap).some((cat) => !cat)) {
    console.log('❌ Required categories not found');
    return;
  }

  const transactions = [];
  const currentDate = new Date();

  // Generate transactions for each month
  for (let i = 0; i < SEED_CONFIG.monthsOfHistory; i++) {
    const monthDate = subMonths(currentDate, i);
    const daysInMonth = endOfMonth(monthDate).getDate();

    // Monthly salary
    const salaryDate = startOfMonth(addDays(monthDate, 5));
    transactions.push(createIncomeTransaction(user.id, 5000, salaryDate, 'Monthly Salary', 'Regular monthly salary'));

    // Fixed monthly expenses
    transactions.push(
      createExpenseTransaction(
        user.id,
        1200,
        addDays(startOfMonth(monthDate), 1),
        categoryMap.rent?.id || '',
        'Monthly Rent'
      )
    );

    // Daily transactions
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      let dailyTransactions = 0;

      // Groceries - High essential spending
      if (
        Math.random() < SPENDING_PATTERNS.GROCERIES.frequency * SEED_CONFIG.probabilityAdjustment &&
        dailyTransactions < SEED_CONFIG.maxTransactionsPerDay
      ) {
        transactions.push(
          createExpenseTransaction(
            user.id,
            SPENDING_PATTERNS.GROCERIES.baseAmount + (Math.random() - 0.5) * SPENDING_PATTERNS.GROCERIES.variance,
            currentDate,
            categoryMap.groceries?.id || '',
            'Groceries'
          )
        );
        dailyTransactions++;
      }

      // Dining - Weekend vs Weekday pattern
      if (
        Math.random() < SPENDING_PATTERNS.DINING.frequency * SEED_CONFIG.probabilityAdjustment &&
        dailyTransactions < SEED_CONFIG.maxTransactionsPerDay
      ) {
        const amount = isWeekend ? SPENDING_PATTERNS.DINING.weekendAmount : SPENDING_PATTERNS.DINING.weekdayAmount;
        transactions.push(
          createExpenseTransaction(
            user.id,
            amount,
            currentDate,
            categoryMap.dining?.id || '',
            isWeekend ? 'Weekend dining' : 'Weekday lunch'
          )
        );
        dailyTransactions++;
      }

      // Entertainment - Increasing trend
      if (
        Math.random() < SPENDING_PATTERNS.ENTERTAINMENT.frequency * SEED_CONFIG.probabilityAdjustment &&
        dailyTransactions < SEED_CONFIG.maxTransactionsPerDay
      ) {
        const monthProgress = i / SEED_CONFIG.monthsOfHistory;
        const increasedAmount =
          SPENDING_PATTERNS.ENTERTAINMENT.baseAmount *
          (1 + SPENDING_PATTERNS.ENTERTAINMENT.monthlyIncrease * monthProgress);

        transactions.push(
          createExpenseTransaction(
            user.id,
            increasedAmount,
            currentDate,
            categoryMap.entertainment?.id || '',
            'Entertainment'
          )
        );
        dailyTransactions++;
      }

      // Shopping - Variable amounts
      if (
        Math.random() < SPENDING_PATTERNS.SHOPPING.frequency * SEED_CONFIG.probabilityAdjustment &&
        dailyTransactions < SEED_CONFIG.maxTransactionsPerDay
      ) {
        transactions.push(
          createExpenseTransaction(
            user.id,
            SPENDING_PATTERNS.SHOPPING.baseAmount + (Math.random() - 0.5) * SPENDING_PATTERNS.SHOPPING.variance,
            currentDate,
            categoryMap.shopping?.id || '',
            'Shopping'
          )
        );
        dailyTransactions++;
      }
    }

    // Monthly utilities with trend
    transactions.push(
      createExpenseTransaction(
        user.id,
        SPENDING_PATTERNS.UTILITIES.baseAmount * (1 + SPENDING_PATTERNS.UTILITIES.monthlyIncrease * i),
        addDays(startOfMonth(monthDate), 15),
        categoryMap.utilities?.id || '',
        'Monthly utilities'
      )
    );
  }

  try {
    // Sort transactions by date
    transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Process in smaller batches
    const batchSize = 50;
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);

      // Process each batch using the unified model
      for (const t of batch) {
        await createTransactionDB(t);
      }

      // Small delay between batches to prevent connection issues
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log(`Processed batch ${i / batchSize + 1} of ${Math.ceil(transactions.length / batchSize)}`);
    }

    console.log(`✅ Created ${transactions.length} transactions`);
  } catch (error) {
    console.error('🚨 Error seeding transactions:', error);
    throw error;
  }
}

// Helper functions for creating transaction objects
function createIncomeTransaction(userId: string, amount: number, date: Date, source: string, description: string) {
  return {
    userId,
    amount: Math.round(amount * 100) / 100,
    type: TransactionType.INCOME,
    source,
    description,
    date,
  };
}

function createExpenseTransaction(
  userId: string,
  amount: number,
  date: Date,
  categoryId: string,
  description: string,
) {
  return {
    userId,
    amount: Math.round(Math.max(0, amount) * 100) / 100,
    type: TransactionType.EXPENSE,
    categoryId,
    description,
    date,
  };
}

// Database creation helpers
async function createTransactionDB(transactionData: any) {
  await prisma.transaction.create({
    data: transactionData,
  });
}

function createTransaction(
  userId: string,
  amount: number,
  type: TransactionType,
  date: Date,
  categoryId?: string,
  description?: string,
  source?: string,
  debtId?: string,
  savingGoalId?: string
) {
  return {
    userId,
    amount: Math.round(Math.max(0, amount) * 100) / 100,
    type,
    categoryId,
    description,
    source,
    debtId,
    savingGoalId,
    date,
  };
}
