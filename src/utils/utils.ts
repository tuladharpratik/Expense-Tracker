import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Function to calculate date range
export function calculateDateRange(monthsAgo = 0): { startDate: Date; endDate: Date } {
  if (monthsAgo < 0) {
    throw new Error('monthsAgo should be a non-negative integer');
  }

  const startDate = new Date();
  const endDate = new Date();

  // Set startDate to the first day of the month for the specified number of months ago
  startDate.setMonth(startDate.getMonth() - monthsAgo);
  startDate.setDate(1); // First day of the month

  // Set endDate to the last day of the previous month of the specified months ago
  endDate.setMonth(endDate.getMonth() - monthsAgo + 1);
  endDate.setDate(0); // Last day of the previous month

  return { startDate, endDate };
}

// Utility function to format large numbers (e.g., 1000 -> 1k)
export const formatLargeNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toLocaleString();
};

// Function to convert JSON data to CSV
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertToCSV = (data: any[]) => {
  const headers = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map((item) =>
    Object.values(item)
      .map((value) => (typeof value === 'string' ? `"${value}"` : value))
      .join(',')
  );
  return headers + rows.join('\n');
};

// Function to download CSV file
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportToCSV = (data: any) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.download = 'export.csv';
  document.body.appendChild(link);
  link.click();

  // Clean up and remove the link
  document.body.removeChild(link);
};

export function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return 'Rs. 0.00';

  return `Rs. ${amount?.toFixed(2)}`;
}

export function formatDate(date: string | Date | undefined): string {
  if (!date) return '';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}
