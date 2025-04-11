'use client';

import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog/Dialog';
import IconButton from '@/components/Button/IconButton';
import { TransactionType } from '@prisma/client';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup/RadioGroup';

export default function SelectTransactionTypeDialog({
  setCurrentOpenDialog,
}: {
  setCurrentOpenDialog: (type: TransactionType) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTransactionType = (type: TransactionType) => {
    setCurrentOpenDialog(type);
    setIsOpen(false);
  };

  const transactionTypes = Object.values(TransactionType).filter(
    (type) => type === TransactionType.INCOME || type === TransactionType.EXPENSE
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <IconButton variant={'primary'} icon="material-symbols:add" text="Add New" />
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle> Select Transaction Type </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <RadioGroup onValueChange={handleSelectTransactionType}>
            {transactionTypes.map((type) => (
              <div key={type} className="flex items-center space-x-3">
                <RadioGroupItem value={type} id={type} className="border-gray-600" />
                <label htmlFor={type} className="font-sm text-base capitalize text-gray-900">
                  {type}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}
