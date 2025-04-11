import { Transaction } from '@prisma/client';
import { TransactionWithCategory } from './types/algorithm.types';

export interface CategorySpending {
  category: string;
  amount: number;
  categoryType: 'needs' | 'wants';
}

export interface TypeOverspending {
  type: 'needs' | 'wants';
  totalSpent: number;
  budgetLimit: number;
  percentageOverBudget: number;
  categories: CategorySpending[];
}

export interface Recommendation {
  type: 'overspending';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  typeOverspending: TypeOverspending[];
}

interface BudgetPreference {
  strategy: 'FIFTY_THIRTY_TWENTY' | 'CUSTOM';
  needsPercentage: number;
  wantsPercentage: number;
  savingsPercentage: number;
  monthlyIncome: number;
}

class RecommendationEngine {
  private transactions: TransactionWithCategory[];
  private budgetPreference: BudgetPreference;
  private readonly NEEDS_CATEGORIES = ['Groceries', 'Utilities', 'Rent/Mortgage', 'Healthcare', 'Transportation'];
  private readonly WANTS_CATEGORIES = ['Dining Out', 'Entertainment', 'Shopping'];

  constructor(transactions: TransactionWithCategory[], budgetPreference: BudgetPreference) {
    this.transactions = transactions;
    this.budgetPreference = budgetPreference;
  }

  public generateRecommendations(): Recommendation[] {
    const currentMonth = new Date().getMonth();
    const typeOverspending = this.analyzeSpending(currentMonth);
    
    if (typeOverspending.length === 0) {
      return [];
    }

    // Determine severity based on the highest overspending percentage
    const maxOverspendingPercent = Math.max(
      ...typeOverspending.map(type => type.percentageOverBudget)
    );

    let severity: 'info' | 'warning' | 'critical' = 'info';
    if (maxOverspendingPercent > 100) {
      severity = 'critical';
    } else if (maxOverspendingPercent > 50) {
      severity = 'warning';
    }

    return [{
      type: 'overspending',
      severity,
      message: `Overspending detected in ${typeOverspending.map(t => t.type).join(' and ')}`,
      typeOverspending
    }];
  }

  private analyzeSpending(currentMonth: number): TypeOverspending[] {
    const categoryTotals = this.calculateCategoryTotals();
    const typeOverspending: TypeOverspending[] = [];

    // Calculate totals for needs and wants
    const needsTotal = Object.entries(categoryTotals)
      .filter(([category]) => this.NEEDS_CATEGORIES.includes(category))
      .reduce((total, [_, monthlyTotals]) => total + (monthlyTotals[currentMonth] || 0), 0);

    const wantsTotal = Object.entries(categoryTotals)
      .filter(([category]) => this.WANTS_CATEGORIES.includes(category))
      .reduce((total, [_, monthlyTotals]) => total + (monthlyTotals[currentMonth] || 0), 0);

    // Calculate budget limits
    const { monthlyIncome, needsPercentage, wantsPercentage } = this.budgetPreference;
    const needsBudget = monthlyIncome * (needsPercentage / 100);
    const wantsBudget = monthlyIncome * (wantsPercentage / 100);

    // Check needs overspending
    if (needsTotal > needsBudget) {
      const needsCategories = Object.entries(categoryTotals)
        .filter(([category]) => this.NEEDS_CATEGORIES.includes(category))
        .map(([category, monthlyTotals]) => ({
          category,
          amount: monthlyTotals[currentMonth] || 0,
          categoryType: 'needs' as const
        }))
        .filter(cat => cat.amount > 0)
        .sort((a, b) => b.amount - a.amount);

      typeOverspending.push({
        type: 'needs',
        totalSpent: needsTotal,
        budgetLimit: needsBudget,
        percentageOverBudget: ((needsTotal / needsBudget) - 1) * 100,
        categories: needsCategories
      });
    }

    // Check wants overspending
    if (wantsTotal > wantsBudget) {
      const wantsCategories = Object.entries(categoryTotals)
        .filter(([category]) => this.WANTS_CATEGORIES.includes(category))
        .map(([category, monthlyTotals]) => ({
          category,
          amount: monthlyTotals[currentMonth] || 0,
          categoryType: 'wants' as const
        }))
        .filter(cat => cat.amount > 0)
        .sort((a, b) => b.amount - a.amount);

      typeOverspending.push({
        type: 'wants',
        totalSpent: wantsTotal,
        budgetLimit: wantsBudget,
        percentageOverBudget: ((wantsTotal / wantsBudget) - 1) * 100,
        categories: wantsCategories
      });
    }

    return typeOverspending;
  }

  private calculateCategoryTotals(): Record<string, number[]> {
    const categoryTotals: Record<string, number[]> = {};
    const months = 6; // Look at last 6 months

    this.transactions.forEach(transaction => {
      if (!transaction.category) return;

      const monthIndex = new Date(transaction.date).getMonth();
      const categoryName = transaction.category.name;

      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = Array(months).fill(0);
      }

      categoryTotals[categoryName][monthIndex] += transaction.amount;
    });

    return categoryTotals;
  }
}

export default RecommendationEngine;
