'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog/Dialog';
import { Button } from '@/components/Button/Button';
import { useState } from 'react';
import Input from '@/components/Input/Input';
import { useFindUniqueSavingGoal, useUpdateSavingGoal, useCreateTransaction } from '@/lib/hooks';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/utils';
import { useSession } from 'next-auth/react';
import { TransactionType } from '@prisma/client';

interface ContributionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  goalId: string | null;
}

export default function ContributionDialog({ isOpen, setIsOpen, goalId }: ContributionDialogProps) {
  const { data: session } = useSession();
  const [amount, setAmount] = useState('');
  const { mutateAsync: createTransaction } = useCreateTransaction();
  const { mutate: updateGoal } = useUpdateSavingGoal({
    onSuccess: () => {
      setAmount('');
      setIsOpen(false);
    },
    onError: () => {
      toast.error('Failed to add contribution. Please try again.');
    },
  });
  const { data: goal } = useFindUniqueSavingGoal({
    where: { id: goalId || '' },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalId || !amount || !session?.user?.id || !goal?.categoryId) {
      toast.error('Missing required information');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      toast.error('Please enter a valid number');
      return;
    }

    const newTotal = (goal.currentAmount || 0) + numAmount;
    if (newTotal > (goal.targetAmount || 0)) {
      toast.error('This contribution would exceed the target amount');
      return;
    }

    try {
      // Create Transaction
      await createTransaction({
        data: {
          amount: numAmount,
          type: TransactionType.EXPENSE,
          description: `Contribution to saving goal: ${goal.name}`,
          date: new Date(),
          user: { connect: { id: session.user.id } },
          category: { connect: { id: goal.categoryId } },
          savingGoal: { connect: { id: goalId } },
        },
      });

      // Update Saving Goal
      await updateGoal({
        where: { id: goalId },
        data: { currentAmount: newTotal },
      });

      toast.success(`Added Rs ${formatCurrency(numAmount)} to your saving goal`);
      setAmount('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add contribution:', error);
      toast.error('Failed to add contribution. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contribution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input type="number" label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
