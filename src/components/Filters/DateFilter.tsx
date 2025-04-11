'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover';
import { Icon } from '@iconify/react';
import { cn } from '@/utils/utils';
import { Calendar } from '../Calendar/Calendar';
import { format } from 'date-fns';
import { Button } from '../Button/Button';
import { DateRange } from 'react-day-picker';
import { useDateFilter } from '@/providers/DateFilterProvider';

export default function DateFilter() {
  const { dateRange, setCustomDateRange } = useDateFilter();
  const [open, setOpen] = useState(false);

  function handleDateSelection(selectedDate: DateRange | undefined) {
    if (selectedDate?.from && selectedDate?.to) {
      const startDate = new Date(selectedDate.from.getFullYear(), selectedDate.from.getMonth(), 1);
      const endDate = selectedDate.to;
      setCustomDateRange(startDate, endDate);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'flex w-[280px] items-center justify-start text-left font-normal',
            !dateRange && 'text-muted-foreground'
          )}
        >
          <Icon icon="line-md:calendar" className="mr-2 h-4 w-4" />
          {dateRange ? (
            <>
              {format(dateRange.startDate, 'LLL dd, y')} - {format(dateRange.endDate, 'LLL dd, y')}
            </>
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-white p-0">
        <Calendar
          mode="range"
          selected={dateRange ? { from: dateRange.startDate, to: dateRange.endDate } : undefined}
          onSelect={handleDateSelection}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
