import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/Button/Button';
import { formatCurrency } from '@/utils/utils';
import { SavingGoal, Category } from '@prisma/client';

type SavingGoalWithCategory = SavingGoal & {
  category: Category;
};

export const columns = (setSelectedGoal: (id: string) => void): ColumnDef<SavingGoalWithCategory>[] => [
  {
    accessorKey: 'name',
    header: 'Goal',
  },
  {
    accessorKey: 'category.name',
    header: 'Category',
    cell: ({ row }) => (
      <span className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-800">
        {row.original.category.name}
      </span>
    ),
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: ({ row }) => {
      const progressPercentage = (row.original.currentAmount / row.original.targetAmount) * 100;
      return <div className="text-sm text-gray-500">{progressPercentage.toFixed(1)}% complete</div>;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const progressPercentage = (row.original.currentAmount / row.original.targetAmount) * 100;
      return (
        <span className={progressPercentage >= 100 ? 'text-green-500' : ''}>
          {formatCurrency(row.original.currentAmount)} / {formatCurrency(row.original.targetAmount)}
        </span>
      );
    },
  },
  {
    accessorKey: 'deadline',
    header: 'Deadline',
    cell: ({ row }) => (row.original.deadline ? new Date(row.original.deadline).toLocaleDateString() : '-'),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const isGoalCompleted = row.original.currentAmount >= row.original.targetAmount;
      return (
        <Button disabled={isGoalCompleted} variant="outline" onClick={() => setSelectedGoal(row.original.id)}>
          Add Contribution
        </Button>
      );
    },
  },
];
