'use client';

import { cn } from '@/utils/utils';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '../Button/Button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// ---------- ClassNames ---------
// chevron: 'style_chevron__MNZIz';
// day_button: 'style_day_button__VkPyy';
// disabled: 'style_disabled__K6U0A';
// dropdown: 'style_dropdown__YFPuC';
// dropdown_root: 'style_dropdown_root__n9Uw0';
// dropdowns: 'style_dropdowns__TJXyn';
// focusable: 'style_focusable__6OmDX';
// hidden: 'style_hidden__cVSSq';
// month_caption: 'style_month_caption__jgBZ8';
// month_grid: 'style_month_grid__rCUrS';
// months: 'style_months__cFrO3';
// outside: 'style_outside__6pfQd';
// range_end: 'style_range_end__d3yxD';
// range_middle: 'style_range_middle__EB9U7';
// range_start: 'style_range_start__b22xm';
// root: 'style_root__5NlSP';
// selected: 'style_selected__H3Fir';
// today: 'style_today__ep9x6';
// week_number: 'style_week_number__BPOye';
// weekday: 'style_weekday__btR_B';

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption_label: 'text-xl font-semibold flex justify-center pt-1 relative items-center',
        nav: 'space-x-1 flex items-center',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          `absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 top-1 z-10`
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          `absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 top-1 z-10`
        ),
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-slate-500 rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn('h-9 w-9 p-0 font-normal aria-selected:opacity-100'),
        range_end: 'day-range-end',
        selected:
          'bg-primary-600/50 text-primary hover:bg-primary hover:text-primary focus:bg-primary focus:text-primary',
        today: 'text-primary-700',
        outside:
          'day-outside text-slate-500 opacity-50 aria-selected:bg-accent/50 aria-selected:text-slate-500 aria-selected:opacity-30',
        disabled: 'text-slate-500 opacity-50',
        range_middle: 'aria-selected:bg-primary-600/50 aria-selected:text-neutral-600',
        hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
