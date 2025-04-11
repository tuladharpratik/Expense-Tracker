'use client';
import React, { useEffect, useState } from 'react';
import { columns } from './columns';
import DataTable from '@/components/Table/DataTable';
import { useDateFilter } from '@/providers/DateFilterProvider';
import { useFindManyTransaction } from '@/lib/hooks';
import DateFilter from '@/components/Filters/DateFilter';
import IconButton from '@/components/Button/IconButton';
import { exportToCSV } from '@/utils/utils';
import SelectTransactionTypeDialog from './SelectTransactionTypeDialog';
import { TransactionType } from '@prisma/client';
import AddIncomeDialog from './AddIncomeDialog';
import AddExpenseDialog from './AddExpenseDialog';
import { TransactionSkeleton } from '@/components/skeletons/TransactionSkeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select/Select';
import { useCategories } from '@/providers/CategoriesProvider';

export default function TransactionTable() {
  const { dateRange } = useDateFilter();
  const { categories } = useCategories();
  const [currentOpenDialog, setCurrentOpenDialog] = useState<TransactionType | null>(null);
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const { data, isLoading, error } = useFindManyTransaction({
    where: {
      OR: [
        {
          AND: {
            date: {
              gte: dateRange?.startDate,
              lt: dateRange?.endDate,
            },
            type: {
              not: TransactionType.DEBT_CREDIT,
            },
          },
        },
        {
          type: TransactionType.DEBT_CREDIT,
        },
        {
          type: TransactionType.DEBT_PAYMENT,
        },
      ],
      ...(typeFilter !== 'ALL' && { type: typeFilter }),
      ...(categoryFilter !== 'ALL' && { categoryId: categoryFilter }),
    },
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  if (error) {
    return <div>Error loading transactions: {error.message}</div>;
  }

  if (!data || isLoading) {
    return <TransactionSkeleton />;
  }

  function handleExportCSV() {
    exportToCSV(data);
  }

  function renderCurrentOpenDialog() {
    if (currentOpenDialog === TransactionType.INCOME) {
      return <AddIncomeDialog isOpen={currentOpenDialog === TransactionType.INCOME} setIsOpen={setCurrentOpenDialog} />;
    }
    if (currentOpenDialog === TransactionType.EXPENSE) {
      return (
        <AddExpenseDialog isOpen={currentOpenDialog === TransactionType.EXPENSE} setIsOpen={setCurrentOpenDialog} />
      );
    }
    return <></>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <DateFilter />
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TransactionType | 'ALL')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
              <SelectItem value={TransactionType.EXPENSE}>Regular Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <IconButton
            variant={'outline'}
            icon="flowbite:file-export-solid"
            text="Export CSV"
            onClick={handleExportCSV}
          />
          <SelectTransactionTypeDialog setCurrentOpenDialog={setCurrentOpenDialog} />
          {renderCurrentOpenDialog()}
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </>
  );
}
