'use client';

import DashboardHeader from '@/components/DashboardMenu/DashboardHeader';
import { useFindManyUser } from '@/lib/hooks';
import { columns } from './columns';
import DataTable from '@/components/Table/DataTable';
import { Role } from '@prisma/client';

export default function UsersPage() {
  const {
    data: users,
    isLoading,
    error,
  } = useFindManyUser({
    where: {
      accountType: {
        not: Role.ADMIN,
      },
    },
  });

  if (error) {
    return <div>Error loading transactions: {error.message}</div>;
  }

  if (!users || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col gap-8">
      <DashboardHeader className="hidden py-6 lg:flex" heading="User Management" subheading="Manage system users" />

      <DataTable columns={columns} data={users} />
    </section>
  );
}
