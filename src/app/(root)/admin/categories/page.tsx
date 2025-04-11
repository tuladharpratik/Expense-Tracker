'use client';

import DashboardHeader from '@/components/DashboardMenu/DashboardHeader';
import Typography from '@/components/Typography/Typography';
import { useCreateCategory, useFindManyCategory } from '@/lib/hooks';
import { BudgetType } from '@prisma/client';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/Sheet/Sheet';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories, isLoading } = useFindManyCategory({
    orderBy: {
      createdAt: 'desc',
    },
  });
  const { mutate: createCategory } = useCreateCategory({
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries({
        queryKey: ['category', 'findMany'],
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });

  const handleCreateCategory = async (formData: FormData) => {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const budgetType = formData.get('budgetType') as BudgetType;

    createCategory({
      data: {
        name,
        description,
        budgetType,
      },
    });
  };

  return (
    <section className="flex flex-col gap-8">
      <DashboardHeader
        className="hidden py-6 lg:flex"
        heading="Category Management"
        subheading="Manage budget categories"
      />

      <div className="flex justify-end">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
            Add Category
          </SheetTrigger>
          <SheetContent className="bg-white">
            <SheetHeader>
              <SheetTitle>Create New Category</SheetTitle>
            </SheetHeader>
            <form action={handleCreateCategory} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="budgetType" className="block text-sm font-medium text-gray-700">
                  Budget Type
                </label>
                <select
                  name="budgetType"
                  id="budgetType"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                >
                  <option value={BudgetType.NEEDS}>Needs</option>
                  <option value={BudgetType.WANTS}>Wants</option>
                  <option value={BudgetType.SAVINGS}>Savings</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
              >
                Create Category
              </button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <div key={category.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <Typography variant="h4" className="font-semibold">
                {category.name}
              </Typography>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  category.budgetType === BudgetType.NEEDS
                    ? 'bg-blue-100 text-blue-800'
                    : category.budgetType === BudgetType.WANTS
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {category.budgetType}
              </span>
            </div>
            <Typography variant="body2" className="mt-2 text-gray-600">
              {category.description || 'No description provided'}
            </Typography>
          </div>
        ))}
      </div>

      {categories?.length === 0 && (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <Typography variant="body1" className="text-gray-500">
            No categories found. Create one to get started!
          </Typography>
        </div>
      )}
    </section>
  );
}
