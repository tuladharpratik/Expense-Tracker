// 'use client';

// import {
//   ColumnDef,
//   ColumnFiltersState,
//   FilterFn,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   SortingState,
//   useReactTable,
//   VisibilityState,
// } from '@tanstack/react-table';
// import { useState } from 'react';
// import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from './Table';
// import { DataTablePagination } from './DataTablePagination';
// import { DataTableViewOptions } from './DataTableViewOptions';
// import Input from '../Input/Input';

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   filterField?: string;
//   filterFields?: string[];
// }

// export default function DataTable<TData, TValue>({
//   columns,
//   data,
//   filterField = 'note',
//   filterFields = ["note"],
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});
//   const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//     // Get the cell value
//     const cellValue = row.getValue(columnId);

//     // If there's no filter value, return true
//     if (!value || !cellValue) return true;

//     // Convert both to strings and lowercase for case-insensitive comparison
//     const itemString = String(cellValue).toLowerCase();
//     const filterString = String(value).toLowerCase();

//     // Return true if the cell value includes the filter value
//     return itemString.includes(filterString);
//   };
//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//     filterFns:{
//       fuzzy: fuzzyFilter, // Register the custom filter
//     },
//     globalFilterFn: fuzzyFilter,

//   });

//   return (
//     <>
//       <div>
//         <div className="flex items-center justify-between">
//           <Input
//             icon="material-symbols:search"
//             placeholder={`Filter ${filterField}...`}
//             value={(table.getColumn(filterField)?.getFilterValue() as string) ?? ''}
//             onChange={(event) => table.getColumn(filterField)?.setFilterValue(event.target.value)}
//             className="max-w-sm"
//           />{filterFields && filterFields.map((field) => {

//             const column = table.getColumn(field);
//             if(!column) return null;
//             return <Input
//               icon="material-symbols:search"
//               placeholder={`Filter ${field}...`}
//               value={(column.getFilterValue() as string) ?? ''}
//               onChange={(event) => table.getColumn(field)?.setFilterValue(event.target.value)}
//               className="max-w-sm"
//             />
//           })
//           }
//           <DataTableViewOptions table={table} />
//         </div>
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <DataTablePagination table={table} />
//     </>
//   );
// }

// 'use client';

// import {
//   ColumnDef,
//   SortingState,
//   VisibilityState,
//   useReactTable,
//   getCoreRowModel,
//   getSortedRowModel,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   FilterFn,
// } from '@tanstack/react-table';
// import { useState } from 'react';

// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
// import { DataTablePagination } from './DataTablePagination';
// import { DataTableViewOptions } from './DataTableViewOptions';
// import Input from '../Input/Input';

// // 1. Our global fuzzy filter function:
// const globalFuzzyFilter: FilterFn<any> = (row, columnId, filterValue) => {
//   if (!filterValue) return true;
//   const search = String(filterValue).toLowerCase();

//   // Compare against all cells in this row:
//   return row.getAllCells().some((cell) => {
//     const cellValue = cell.getValue();
//     return String(cellValue).toLowerCase().includes(search);
//   });
// };

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
// }

// export default function DataTable<TData, TValue>({
//   columns,
//   data,
// }: DataTableProps<TData, TValue>) {
//   // 2. Local states:
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState('');

//   // 3. Instantiate our table:
//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       globalFilter,
//       columnVisibility,
//       rowSelection,
//     },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setGlobalFilter,
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     globalFilterFn: globalFuzzyFilter, // Our custom filter
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <>
//       <div className="flex items-center justify-between mb-4">
//         {/* The single search field to filter across all data */}
//         <Input
//           icon="material-symbols:search"
//           placeholder="Search..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//           className="max-w-sm"
//         />

//         <DataTableViewOptions table={table} />
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : header.column.columnDef.header
//                         ? header.column.columnDef.header(header.getContext())
//                         : null}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {cell.column.columnDef.cell
//                         ? cell.column.columnDef.cell(cell.getContext())
//                         : null}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <DataTablePagination table={table} />
//     </>
//   );
// }

'use client';

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  FilterFn,
  flexRender,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

// These imports assume you have these components defined somewhere:
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import { DataTablePagination } from './DataTablePagination';
import { DataTableViewOptions } from './DataTableViewOptions';
import Input from '../Input/Input';

/** 1) A global "fuzzy" filter that searches across ALL columns of each row. */
const globalFuzzyFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  const search = String(filterValue).toLowerCase();

  // By default, we compare against ALL cells in the row:
  return row.getAllCells().some((cell) => String(cell.getValue()).toLowerCase().includes(search));
};

/** 2) An SN (serial number) column definition */
const snColumn: ColumnDef<any> = {
  id: 'sn',
  header: 'SN',
  enableSorting: false,
  enableColumnFilter: false,
  cell: ({ row }) => row.index + 1, // row.index is zero-based, so add 1
};

/** 3) Our DataTable props.
 * TData is your row data type (e.g. an interface of your dataset).
 */
interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
}

export default function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  // React state for sorting, visibility, row selection, and global filter:
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Combine SN column with your other columns
  const allColumns = [snColumn, ...columns];

  // 4) Initialize TanStack Table:
  const table = useReactTable({
    data,
    columns: allColumns as ColumnDef<TData>[],
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    // Update local states as the table changes
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    // The global fuzzy filter
    globalFilterFn: globalFuzzyFilter,

    // Standard pipelines for row modeling:
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      {/* 5) Single Global Search and any table options (column toggles, etc.) */}
      <div className="mb-4 flex items-center justify-between">
        <Input
          icon="material-symbols:search"
          placeholder="Search all columns..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        {/* Example: show/hide columns, density, etc. */}
        <DataTableViewOptions table={table} />
      </div>

      {/* 6) The main table UI */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {/* flexRender automatically handles strings vs. functions */}
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 7) Pagination */}
      <DataTablePagination table={table} />
    </>
  );
}
