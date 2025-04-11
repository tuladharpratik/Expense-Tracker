'use client';

import { useEffect, useState } from 'react';
import { BudgetAllocationStrategy } from '@prisma/client';
import { useBudgetManagement } from '@/lib/custom_hooks/useBudgetManagement';
import { Button } from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography/Typography';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../Dialog/Dialog';
import { DialogHeader } from '../Dialog/Dialog';
import { useFindUniqueUserBudgetPreference, useUpdateUserBudgetPreference } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export default function BudgetPreferenceForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id || '';

  const [isOpen, setIsOpen] = useState(false);
  const { updateMonthlyBudget } = useBudgetManagement(userId);

  const { data: userPreference } = useFindUniqueUserBudgetPreference({
    where: { userId },
  });
  const { mutateAsync: updateBudgetPreferences, isPending: isUpdatingBudgetPreferences } =
    useUpdateUserBudgetPreference();

  const [strategy, setStrategy] = useState<BudgetAllocationStrategy>(
    userPreference?.strategy || BudgetAllocationStrategy.FIFTY_THIRTY_TWENTY
  );
  const [customPercentages, setCustomPercentages] = useState({
    needs: 50,
    wants: 30,
    savings: 20,
  });

  useEffect(() => {
    setStrategy(userPreference?.strategy || BudgetAllocationStrategy.FIFTY_THIRTY_TWENTY);
    setCustomPercentages({
      needs: userPreference?.needsPercentage || 50,
      wants: userPreference?.wantsPercentage || 30,
      savings: userPreference?.savingsPercentage || 20,
    });
  }, [userPreference]);

  const handleStrategyChange = (newStrategy: BudgetAllocationStrategy) => {
    setStrategy(newStrategy);
    if (newStrategy === BudgetAllocationStrategy.FIFTY_THIRTY_TWENTY) {
      setCustomPercentages({
        needs: 50,
        wants: 30,
        savings: 20,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const total = customPercentages.needs + customPercentages.wants + customPercentages.savings;
      if (Math.abs(total - 100) > 0.01) {
        toast.error('Percentages must add up to 100%');
        return;
      }

      const updatedPreference = await updateBudgetPreferences({
        where: { userId },
        data: {
          strategy,
          needsPercentage: customPercentages.needs,
          wantsPercentage: customPercentages.wants,
          savingsPercentage: customPercentages.savings,
        },
      });
      if (updatedPreference?.id) {
        const currentDate = new Date();
        const monthYear = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        await updateMonthlyBudget(monthYear, updatedPreference);
        setIsOpen(false);
        toast.success('Budget preferences updated successfully');
        router.refresh();
      }
    } catch (error) {
      toast.error(`Failed to update preferences: ${(error as Error).message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Set Budget Preference </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Budget Allocation Strategy</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Typography variant="h3">Budget Allocation Strategy</Typography>

            <div className="flex gap-4">
              <Button
                type="button"
                variant={strategy === BudgetAllocationStrategy.FIFTY_THIRTY_TWENTY ? 'primary' : 'secondary'}
                onClick={() => handleStrategyChange(BudgetAllocationStrategy.FIFTY_THIRTY_TWENTY)}
              >
                50/30/20 Rule
              </Button>
              <Button
                type="button"
                variant={strategy === BudgetAllocationStrategy.CUSTOM ? 'primary' : 'secondary'}
                onClick={() => handleStrategyChange(BudgetAllocationStrategy.CUSTOM)}
              >
                Custom
              </Button>
            </div>

            {strategy === BudgetAllocationStrategy.CUSTOM && (
              <div className="space-y-4">
                <Typography variant="body2">Custom Percentages</Typography>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Needs %"
                    type="number"
                    value={customPercentages.needs}
                    onChange={(e) =>
                      setCustomPercentages((prev) => ({
                        ...prev,
                        needs: Number(e.target.value),
                      }))
                    }
                    min={0}
                    max={100}
                  />
                  <Input
                    label="Wants %"
                    type="number"
                    value={customPercentages.wants}
                    onChange={(e) =>
                      setCustomPercentages((prev) => ({
                        ...prev,
                        wants: Number(e.target.value),
                      }))
                    }
                    min={0}
                    max={100}
                  />
                  <Input
                    label="Savings %"
                    type="number"
                    value={customPercentages.savings}
                    onChange={(e) =>
                      setCustomPercentages((prev) => ({
                        ...prev,
                        savings: Number(e.target.value),
                      }))
                    }
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isUpdatingBudgetPreferences}>
            {isUpdatingBudgetPreferences ? 'Saving...' : 'Save Preferences'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
