'use client';

import { subMonths } from 'date-fns';
import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
export interface DateFilterContextType {
  currentDateTime: Date;
  dateRange: { startDate: Date; endDate: Date } | null;
  setCustomDateRange: (startDate: Date, endDate: Date) => void;
}

// Create the context with a default value
export const DateFilterContext = createContext<DateFilterContextType | undefined>(undefined);

// Create the provider component
export const DateFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDateTime] = useState<Date>(new Date());
  // Set the default date range to 3 month before the current date
  const defaultStartDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() - 3, 1);
  const defaultEndDate = currentDateTime;
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date } | null>({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  // Function to set a custom date range
  const setCustomDateRange = (startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate });
  };

  return (
    <DateFilterContext.Provider value={{ currentDateTime, dateRange, setCustomDateRange }}>
      {children}
    </DateFilterContext.Provider>
  );
};

// Custom hook to use the DateFilterContext
export const useDateFilter = (): DateFilterContextType => {
  const context = useContext(DateFilterContext);
  if (!context) {
    throw new Error('useDateFilter must be used within a DateFilterProvider');
  }
  return context;
};
