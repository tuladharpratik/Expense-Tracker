import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog/Dialog';
import Input from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { incomeTransactionSchema, type IncomeTransactionFormDataType } from '@/schemas/transaction.schema';
import useFormValidation from '@/lib/custom_hooks/useFormValidation';
import { TransactionType } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select/Select';
import {
  useCreateMonthlyIncomeBudget,
  useCreateTransaction,
  useFindFirstMonthlyIncomeBudget,
  useUpdateMonthlyIncomeBudget,
} from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export default function AddIncomeDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: TransactionType | null) => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const [currentDate] = useState(new Date());

  // Create start and end of month dates for comparison
  const dateRange = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return {
      gte: startOfMonth,
      lte: endOfMonth,
    };
  }, [currentDate]);

  const { mutateAsync: createTransaction } = useCreateTransaction();
  const { data: monthlyIncomeBudget } = useFindFirstMonthlyIncomeBudget({
    where: {
      userId,
      monthYear: dateRange,
    },
  });
  const { mutateAsync: createMonthlyIncomeBudget } = useCreateMonthlyIncomeBudget();
  const { mutateAsync: updateMonthlyIncomeBudget } = useUpdateMonthlyIncomeBudget();

  const [formData, setFormData] = useState<IncomeTransactionFormDataType>({
    amount: 0,
    date: new Date(),
    type: TransactionType.INCOME,
    source: '',
    description: '',
  });

  const { formErrors, isSubmitting, validate } = useFormValidation(incomeTransactionSchema);

  async function handleAddIncome(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { valid } = validate(formData);
    if (!valid) {
      Object.entries(formErrors || {}).forEach(([key, value]) => {
        toast.error(formErrors[key]);
      });
      return;
    }
    try {
      // Create transaction
      await createTransaction({
        data: {
          userId,
          amount: formData.amount,
          type: TransactionType.INCOME,
          source: formData.source,
          description: formData.description,
          date: formData.date,
        },
      });

      // Handle monthly budget
      if (monthlyIncomeBudget) {
        // Update existing budget
        await updateMonthlyIncomeBudget({
          where: { id: monthlyIncomeBudget.id },
          data: {
            totalIncome: monthlyIncomeBudget.totalIncome + formData.amount,
            needsBudget: (monthlyIncomeBudget.totalIncome + formData.amount) * 0.5,
            wantsBudget: (monthlyIncomeBudget.totalIncome + formData.amount) * 0.3,
            savingsBudget: (monthlyIncomeBudget.totalIncome + formData.amount) * 0.2,
          },
        });
      } else {
        // Create new budget
        await createMonthlyIncomeBudget({
          data: {
            userId,
            monthYear: new Date(formData.date.getFullYear(), formData.date.getMonth(), 1),
            totalIncome: formData.amount,
            needsBudget: formData.amount * 0.5,
            wantsBudget: formData.amount * 0.3,
            savingsBudget: formData.amount * 0.2,
          },
        });
      }

      toast.success('Income added successfully');
      setIsOpen(null);
      router.refresh();
    } catch (error) {
      toast.error('Failed to add income');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === 'number'
          ? parseFloat(e.target.value)
          : e.target.type === 'date'
            ? new Date(e.target.value)
            : e.target.value,
    }));
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open ? TransactionType.INCOME : null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
        </DialogHeader>
        <form className="mt-4" onSubmit={handleAddIncome}>
          <div className={'flex flex-col gap-1'}>
            <label htmlFor={'type'} className={'text-md cursor-pointer font-medium capitalize text-neutral-500'}>
              Transaction Type
            </label>
            <Select disabled name="type" value={formData.type} defaultValue={TransactionType.INCOME}>
              <SelectTrigger className="mb-4">
                <SelectValue placeholder="Select a type" />
                <SelectContent>
                  <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
                  <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
          <Input
            name="amount"
            label="Amount"
            type="number"
            min={0}
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
          />
          <Input
            value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : ''}
            name="date"
            label="Date"
            type="date"
            onChange={handleChange}
          />
          <Input
            value={formData.source}
            name="source"
            label="Source"
            type="text"
            placeholder="Source"
            onChange={handleChange}
          />
          <Input
            value={formData.description}
            name="description"
            label="Description"
            type="text"
            maxLength={100}
            placeholder="Description"
            onChange={handleChange}
          />
          <div className="flex gap-4">
            <Button
              variant={'outline'}
              disabled={isSubmitting}
              type="button"
              className="ml-auto mt-6 flex w-full md:w-1/2"
              onClick={() => setIsOpen(null)}
            >
              Cancel
            </Button>
            <Button
              variant={'primary'}
              disabled={isSubmitting}
              type="submit"
              className="ml-auto mt-6 flex w-full md:w-1/2"
            >
              Add Income
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
