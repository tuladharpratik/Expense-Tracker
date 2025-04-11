import { PrismaClient } from '@prisma/client';
import { startOfMonth, subMonths, addMonths } from 'date-fns';

const prisma = new PrismaClient();

export async function monthlyBudgetSeed() {
  const user = await prisma.user.findFirst({
    where: { email: 'john.doe@example.com' },
  });

  if (!user) {
    console.log('❌ Regular user not found for seeding monthly budgets');
    return;
  }

  // Get user's budget preference
  const budgetPreference = await prisma.userBudgetPreference.findUnique({
    where: { userId: user.id },
  });

  if (!budgetPreference) {
    console.log('❌ Budget preference not found');
    return;
  }

  const currentMonth = startOfMonth(new Date());
  const monthlyBudgets = [];

  // Create budgets for past 12 months, current month, and next month
  for (let i = -12; i <= 1; i++) {
    const monthYear = i < 0 ? subMonths(currentMonth, Math.abs(i)) : addMonths(currentMonth, i);

    // Vary the monthly income slightly to simulate real-world scenarios
    const baseIncome = 5000;
    const variationPercentage = Math.random() * 20 - 10; // Random variation between -10% and +10%
    const monthlyIncome = baseIncome * (1 + variationPercentage / 100);

    monthlyBudgets.push({
      userId: user.id,
      monthYear,
      totalIncome: Math.round(monthlyIncome * 100) / 100, // Round to 2 decimal places
      needsBudget: Math.round(((monthlyIncome * budgetPreference.needsPercentage) / 100) * 100) / 100,
      wantsBudget: Math.round(((monthlyIncome * budgetPreference.wantsPercentage) / 100) * 100) / 100,
      savingsBudget: Math.round(((monthlyIncome * budgetPreference.savingsPercentage) / 100) * 100) / 100,
    });
  }

  try {
    await prisma.monthlyIncomeBudget.createMany({
      data: monthlyBudgets,
      skipDuplicates: true,
    });
    console.log(`✅ Created ${monthlyBudgets.length} monthly budgets spanning ${monthlyBudgets.length} months`);
  } catch (error) {
    console.error('🚨 Error seeding monthly budgets:', error);
    throw error;
  }
}
