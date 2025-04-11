import { BudgetAllocationStrategy, PrismaClient, AccountType, TransactionType } from '@prisma/client';
import { ExpenseTypes } from '../../src/constants/constants';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

interface UserSeedData {
  email: string;
  password: string;
  username: string;
  accountType: AccountType;
}

const users: UserSeedData[] = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    username: 'admin',
    accountType: AccountType.ADMIN,
  },
  {
    email: 'john.doe@example.com',
    password: 'password123',
    username: 'johndoe',
    accountType: AccountType.USER,
  },
];

export async function userSeed() {
  try {
    const createdUsers = [];

    // First ensure categories exist
    const categories = await prisma.category.findMany({
      where: {
        name: {
          in: ['Groceries', 'Dining Out', 'Shopping', 'Entertainment', 'Utilities'],
        },
      },
    });

    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          password: await hash(userData.password, 12),
          username: userData.username,
          accountType: userData.accountType,
          budgetPreference: {
            create: {
              strategy: BudgetAllocationStrategy.FIFTY_THIRTY_TWENTY,
              needsPercentage: 50,
              wantsPercentage: 30,
              savingsPercentage: 20,
            },
          },
        },
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.email}`);
      console.log(`Password: ${userData.password}`);
    }

    // Create initial transactions only for regular users
    const regularUsers = createdUsers.filter((user) => user.accountType === AccountType.USER);
    for (const user of regularUsers) {
      await createInitialTransactions(user.id);
    }

    console.log('✅ User seeding completed');
  } catch (error) {
    console.error('🚨 Error seeding users:', error);
    throw error;
  }
}

async function createInitialTransactions(userId: string) {
  const categories = await prisma.category.findMany();
  const findCategoryByName = (name: string) => categories.find((c) => c.name === name);

  try {
    // Create income transaction
    await prisma.transaction.create({
      data: {
        userId,
        amount: 5000,
        type: TransactionType.INCOME,
        source: 'Salary',
        description: 'Monthly salary',
        date: new Date(),
      },
    });

    // Create basic expenses
    const expenses = [
      {
        amount: 800,
        category: 'Rent/Mortgage',
        description: 'Monthly rent',
      },
      {
        amount: 200,
        category: 'Groceries',
        description: 'Weekly groceries',
      },
    ];

    for (const expense of expenses) {
      const categoryId = findCategoryByName(expense.category)?.id;
      if (!categoryId) continue;

      await prisma.transaction.create({
        data: {
          userId,
          amount: expense.amount,
          type: TransactionType.EXPENSE,
          categoryId,
          description: expense.description,
          date: new Date(),
        },
      });
    }

    console.log(`✅ Created initial transactions for user ${userId}`);
  } catch (error) {
    console.error('🚨 Error creating initial transactions:', error);
    throw error;
  }
}
