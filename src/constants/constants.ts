export const TransactionTypes = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER',
} as const;

export const ExpenseTypes = {
  REGULAR: 'REGULAR',
  DEBT_PAYMENT: 'DEBT_PAYMENT',
} as const;

export type TransactionType = (typeof TransactionTypes)[keyof typeof TransactionTypes];
export type ExpenseType = (typeof ExpenseTypes)[keyof typeof ExpenseTypes];
