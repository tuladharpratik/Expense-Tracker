import { z } from 'zod';
import { BudgetAllocationStrategy } from '@prisma/client';

// Schema for budget preferences
export const budgetPreferenceSchema = z
  .object({
    strategy: z.nativeEnum(BudgetAllocationStrategy),
    needsPercentage: z.number().min(0, 'Percentage cannot be negative').max(100, 'Percentage cannot exceed 100'),
    wantsPercentage: z.number().min(0, 'Percentage cannot be negative').max(100, 'Percentage cannot exceed 100'),
    savingsPercentage: z.number().min(0, 'Percentage cannot be negative').max(100, 'Percentage cannot exceed 100'),
  })
  .refine(
    (data) => {
      const total = data.needsPercentage + data.wantsPercentage + data.savingsPercentage;
      return total === 100;
    },
    {
      message: 'Percentages must add up to 100%',
      path: ['total'], // path of error
    }
  );

// Schema for monthly budget
export const monthlyBudgetSchema = z.object({
  monthYear: z.date(),
  totalIncome: z.number().positive('Income must be greater than 0'),
  needsBudget: z.number().nonnegative('Budget cannot be negative'),
  wantsBudget: z.number().nonnegative('Budget cannot be negative'),
  savingsBudget: z.number().nonnegative('Budget cannot be negative'),
});

// Types for our forms
export type BudgetPreferenceFormData = z.infer<typeof budgetPreferenceSchema>;
export type MonthlyBudgetFormData = z.infer<typeof monthlyBudgetSchema>;

// Schema for updating budget preferences
// export const updateBudgetPreferenceSchema = budgetPreferenceSchema.partial();

// Custom validation for 50/30/20 rule
export const fiftyThirtyTwentySchema = budgetPreferenceSchema.refine(
  (data) => {
    return data.needsPercentage === 50 && data.wantsPercentage === 30 && data.savingsPercentage === 20;
  },
  {
    message: '50/30/20 rule requires 50% needs, 30% wants, and 20% savings',
    path: ['strategy'],
  }
);
