import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog/Dialog';
import Input from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useCategories } from '@/providers/CategoriesProvider';
import useFormValidation from '@/lib/custom_hooks/useFormValidation';
import { expenseTransactionSchema } from '@/schemas/transaction.schema';
import { TransactionType } from '@prisma/client';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/Select/Select';
import { ExpenseTypes } from '@/constants/constants';
import { useCreateTransaction } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

interface ExpenseTransactionFormDataType {
  amount: number;
  date: Date;
  type: TransactionType;
  categoryId?: string;
  expenseType: (typeof ExpenseTypes)[keyof typeof ExpenseTypes];
  description: string;
}

export default function AddExpenseDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: TransactionType | null) => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const { mutateAsync: createTransaction } = useCreateTransaction();

  const [formData, setFormData] = useState<ExpenseTransactionFormDataType>({
    amount: 0,
    date: new Date(),
    type: TransactionType.EXPENSE,
    categoryId: undefined,
    expenseType: ExpenseTypes.REGULAR,
    description: '',
  });

  const { categories } = useCategories();
  const { formErrors, isSubmitting, validate } = useFormValidation(expenseTransactionSchema);

  async function handleAddExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationData = {
      ...formData,
      type: 'EXPENSE' as const,
    };
    const { valid } = validate(validationData);
    if (!valid) {
      Object.entries(formErrors || {}).forEach(([key, value]) => {
        toast.error(formErrors[key]);
      });
      return;
    }
    try {
      await createTransaction({
        data: {
          userId,
          amount: formData.amount,
          type: TransactionType.EXPENSE,
          categoryId: formData.categoryId || '',
          description: formData.description,
          date: formData.date,
        },
      });
      toast.success('Expense added successfully');
      setIsOpen(null);
      router.refresh();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'date' ? new Date(value) : type === 'number' ? parseFloat(value) : value,
    }));
  };

  function handleOpenChange(open: boolean) {
    setIsOpen(open ? TransactionType.EXPENSE : null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <form className="mt-4" onSubmit={handleAddExpense}>
          <div className={'flex flex-col gap-1'}>
            <label htmlFor={'type'} className={'text-md cursor-pointer font-medium capitalize text-neutral-500'}>
              Transaction Type
            </label>
            <Select disabled name="type" value={formData.type} defaultValue={TransactionType.EXPENSE}>
              <SelectTrigger className="mb-4">
                <SelectValue placeholder="Select a type" />
                <SelectContent>
                  <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
                  <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
          <div className={'flex flex-col gap-1'}>
            <label htmlFor={'expenseType'} className={'text-md cursor-pointer font-medium capitalize text-neutral-500'}>
              Expense Type
            </label>
            <Select disabled name="expenseType" value={formData.expenseType}>
              <SelectTrigger className="mb-4">
                <SelectValue placeholder="Select expense type" />
                <SelectContent>
                  <SelectItem value={ExpenseTypes.REGULAR}>Regular Expense</SelectItem>
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
            value={formData.date.toISOString().slice(0, 10)}
            name="date"
            label="Date"
            type="date"
            onChange={handleChange}
          />
          <div className={'flex flex-col gap-1'}>
            <label htmlFor={'categoryId'} className={'text-md cursor-pointer font-medium capitalize text-neutral-500'}>
              Category
            </label>
            <Select
              name="categoryId"
              onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger className="mb-4">
                <SelectValue placeholder="Select a category" />
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={`${category.id}`}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
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
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
