import { PrismaClient } from '@prisma/client';
import { userSeed } from './seeds/user-seed';
import { monthlyBudgetSeed } from './seeds/monthly-budget-seed';
import { categorySeed } from './seeds/category-seed';
import { transactionSeed } from './seeds/transaction-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  console.log('🌱 Running category seeder...');
  await categorySeed();

  console.log('🌱 Running user seeder...');
  await userSeed();

  console.log('🌱 Running monthly budget seeder...');
  await monthlyBudgetSeed();

  console.log('🌱 Running transaction seeder...');
  await transactionSeed();


  console.log('✅ All seeders completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
