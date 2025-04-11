'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { Checkbox } from '@/components/Checkbox/Checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/DropdownMenu/DropDownMenu';
import { Button } from '@/components/Button/Button';
import { useDeleteUser } from '@/lib/hooks';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog/Dialog';
import { useState } from 'react';

// This function will be used in the cell renderer
const UserActions = ({ userId, username }: { userId: string; username: string }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteUser } = useDeleteUser({
    onSuccess: () => {
      setShowDeleteDialog(false);
      toast.success('User deleted successfully');
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['user', 'findMany'] });
    },
    onError: (error) => {
      toast.error('Failed to delete user');
      console.error('Delete error:', error);
    },
  });

  const handleDelete = () => {
    deleteUser({ where: { id: userId } });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icon icon="lucide:more-horizontal" className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
            <DialogDescription>
              This will permanently delete {username}'s account and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: () => <div className="">Id</div>,
    cell: ({ row }) => {
      const transaction = row.original;
      return <div className="font-medium">{transaction.id}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: () => <div className="">Email</div>,
    cell: ({ row }) => {
      const email = row.getValue('email') as string;
      return <div className="font-medium">{email}</div>;
    },
  },
  {
    accessorKey: 'role',
    header: () => <div className="">Role</div>,
    cell: ({ row }) => {
      const user = row.original;
      const role = user.accountType;
      return <div className="font-medium">{role ?? 'N/A'}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return <UserActions userId={user.id} username={user.username} />;
    },
  },
];
