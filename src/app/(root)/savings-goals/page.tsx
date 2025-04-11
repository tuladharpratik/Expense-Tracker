'use client';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/Button/Button';
import { useState } from 'react';
import AddSavingGoalDialog from './AddSavingGoalDialog';
import { useFindManySavingGoal } from '@/lib/hooks';
import Typography from '@/components/Typography/Typography';
import ContributionDialog from './ContributionDialog';
import DataTable from '@/components/Table/DataTable';
import { columns } from './columns';

export default function SavingsGoalsPage() {
  const { data: session } = useSession();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const { data: savingGoals, isLoading } = useFindManySavingGoal({
    where: {
      userId: session?.user?.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h3">Saving Goals</Typography>
            <Button variant="primary" onClick={() => setIsAddDialogOpen(true)}>
              Add New Goal
            </Button>
          </div>
          <DataTable columns={columns(setSelectedGoal)} data={savingGoals || []} />
        </div>
      </div>

      <AddSavingGoalDialog isOpen={isAddDialogOpen} setIsOpen={setIsAddDialogOpen} />
      <ContributionDialog isOpen={!!selectedGoal} setIsOpen={() => setSelectedGoal(null)} goalId={selectedGoal} />
    </div>
  );
}
