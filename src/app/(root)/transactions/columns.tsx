'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Icon } from '@iconify/react';
import { Checkbox } from '@/components/Checkbox/Checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/DropdownMenu/DropDownMenu';
import { Button } from '@/components/Button/Button';
import { TransactionType } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<any>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: 'id',
  //   header: () => <div className="">Id</div>,

  //   cell: ({ row }) => {
  //     const transaction = row.original;

  //     return <div className="font-medium">{transaction.id}</div>;
  //   },
  // },
  {
    accessorKey: 'date',
    header: () => <div className="">Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      const formattedDate = date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      return <div className="font-medium">{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as TransactionType;
      return type;
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = `Rs. ${amount.toFixed(2)}`;

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'category',
    header: () => <div className="">Category</div>,
    cell: ({ row }) => {
      const transaction = row.original;
      const category = transaction.category;
      return <div className="font-medium">{category?.name ?? 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: () => <div className="">Description</div>,
    cell: ({ row }) => {
      const transaction = row.original;
      return <div className="font-medium">{transaction?.description ?? 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'source',
    header: () => <div className="">Source</div>,
    cell: ({ row }) => {
      const transaction = row.original;
      return transaction.type === TransactionType.INCOME ? (
        <div className="font-medium">{transaction.source ?? 'N/A'}</div>
      ) : (
        <div className="font-medium">N/A</div>
      );
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     const transaction = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <Icon icon="akar-icons:more-horizontal" className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end" className="bg-white">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.id)}>
  //             Copy transaction ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View transaction details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
