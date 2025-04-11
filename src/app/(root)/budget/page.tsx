import BudgetOverview from '@/components/Budget/BudgetOverview';
import BudgetPreferenceForm from '@/components/Budget/BudgetPreferenceForm';
import DashboardHeader from '@/components/DashboardMenu/DashboardHeader';
import DateFilter from '@/components/Filters/DateFilter';
import React from 'react';

export default function page() {
  return (
    <section className="flex flex-col gap-8">
      <DashboardHeader
        className="hidden py-6 lg:flex"
        heading="Manage Budget"
        subheading="Manage your budget and preferences"
      />
      <BudgetPreferenceForm />
      <BudgetOverview />
    </section>
  );
}
