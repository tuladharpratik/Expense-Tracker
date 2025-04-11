'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog/Dialog';
import Input from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useCategories } from '@/providers/CategoriesProvider';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select/Select';
import { useCreateSavingGoal } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { BudgetType, Category } from '@prisma/client';

interface AddSavingGoalDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AddSavingGoalDialog({ isOpen, setIsOpen }: AddSavingGoalDialogProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { categories } = useCategories();
  const { mutateAsync: createSavingGoal, isPending } = useCreateSavingGoal();

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: 0,
    categoryId: '',
    deadline: '',
    note: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error('Please login to create a saving goal');
      return;
    }
    try {
      await createSavingGoal({
        data: {
          name: formData.name,
          targetAmount: formData.targetAmount,
          categoryId: formData.categoryId,
          deadline: formData.deadline ? new Date(formData.deadline) : null,
          note: formData.note,
          userId: session.user.id,
        },
      });
      toast.success('Saving goal created successfully');
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to create saving goal');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create New Saving Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" label="Goal Name" value={formData.name} onChange={handleChange} required />
          <Input
            name="targetAmount"
            label="Target Amount"
            type="number"
            min={0}
            value={formData.targetAmount}
            onChange={handleChange}
            required
          />
          <div className="flex flex-col gap-1">
            <label className="text-md cursor-pointer font-medium capitalize text-neutral-500">Category</label>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  ?.filter((category) => category.budgetType === BudgetType.SAVINGS)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            name="deadline"
            label="Deadline (Optional)"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
          />
          <Input name="note" label="Note (Optional)" value={formData.note} maxLength={100} onChange={handleChange} />
          <div className="flex gap-4">
            <Button variant="outline" type="button" className="w-full" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="w-full" disabled={isPending}>
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
