import { PrismaClient, BudgetType } from '@prisma/client';

const prisma = new PrismaClient();

export async function categorySeed() {
  const categories = [
    // NEEDS Categories
    {
      name: 'Groceries',
      budgetType: BudgetType.NEEDS,
      description: 'Essential food and household items',
    },
    {
      name: 'Utilities',
      budgetType: BudgetType.NEEDS,
      description: 'Water, electricity, and gas bills',
    },
    {
      name: 'Rent/Mortgage',
      budgetType: BudgetType.NEEDS,
      description: 'Housing payments',
    },
    {
      name: 'Transportation',
      budgetType: BudgetType.NEEDS,
      description: 'Public transport and fuel costs',
    },
    {
      name: 'Healthcare',
      budgetType: BudgetType.NEEDS,
      description: 'Medical expenses and insurance',
    },

    // WANTS Categories
    {
      name: 'Entertainment',
      budgetType: BudgetType.WANTS,
      description: 'Movies, games, and leisure activities',
    },
    {
      name: 'Dining Out',
      budgetType: BudgetType.WANTS,
      description: 'Restaurants and cafes',
    },
    {
      name: 'Shopping',
      budgetType: BudgetType.WANTS,
      description: 'Non-essential purchases',
    },
    {
      name: 'Subscriptions',
      budgetType: BudgetType.WANTS,
      description: 'Streaming services and memberships',
    },
    {
      name: 'Hobbies',
      budgetType: BudgetType.WANTS,
      description: 'Personal interests and activities',
    },

    // SAVINGS Categories
    {
      name: 'Emergency Fund',
      budgetType: BudgetType.SAVINGS,
      description: 'Emergency savings',
    },
    {
      name: 'Investments',
      budgetType: BudgetType.SAVINGS,
      description: 'Stocks, bonds, and other investments',
    },
    {
      name: 'Retirement',
      budgetType: BudgetType.SAVINGS,
      description: 'Retirement savings',
    },
    {
      name: 'Education',
      budgetType: BudgetType.SAVINGS,
      description: 'Education and skill development savings',
    },
  ];

  try {
    const result = await prisma.category.createMany({
      data: categories,
      skipDuplicates: true,
    });
    console.log(`✅ Created ${result.count} categories`);
    return categories; // Return for use in other seeders
  } catch (error) {
    console.error('🚨 Error seeding categories:', error);
    throw error; // Propagate error to main seeder
  }
}
