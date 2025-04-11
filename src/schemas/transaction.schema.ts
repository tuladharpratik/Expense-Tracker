import { TransactionType } from '@prisma/client';
import { z } from 'zod';

// Base schema for common fields
const baseTransactionSchema = z.object({
  amount: z.number().min(1, { message: 'Amount is required' }),
  date: z.date(),
  description: z.string().max(100, { message: 'Description cannot exceed 100 characters' }).optional(),
  categoryId: z.string().optional(),
});

// Combined transaction schema
export const transactionSchema = baseTransactionSchema.extend({
  type: z.enum([
    TransactionType.INCOME,
    TransactionType.EXPENSE,
  ]),
  source: z.string().optional(),
  debtId: z.string().optional(),
  savingGoalId: z.string().optional(),
});

// Specific schema for expense transactions
export const expenseTransactionSchema = baseTransactionSchema.extend({
  type: z.literal(TransactionType.EXPENSE),
});

// Specific schema for income transactions
export const incomeTransactionSchema = baseTransactionSchema.extend({
  type: z.literal(TransactionType.INCOME),
  source: z.string().optional(),
});

export type TransactionFormDataType = z.infer<typeof transactionSchema>;
export type ExpenseTransactionFormDataType = z.infer<typeof expenseTransactionSchema>;
export type IncomeTransactionFormDataType = z.infer<typeof incomeTransactionSchema>;
