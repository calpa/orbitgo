import { useState, useMemo, SetStateAction } from "react";
import { Icon } from "@iconify/react";
import { Spinner } from "./Spinner";
import { Transaction } from "../types";
import { flexRender } from "@tanstack/react-table";

interface TransactionTableProps {
  loading: boolean;
  error: string | null;
  transactions: Transaction[];
  table: any;
  pageSize: number;
  setPageSize: (size: SetStateAction<10 | 50 | 100>) => void;
}

function TransactionTable({
  loading,
  error,
  transactions,
  table,
  pageSize,
}: TransactionTableProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = useMemo(
    () => Math.ceil(transactions.length / pageSize),
    [transactions, pageSize]
  );
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No transactions found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex mt-2 space-x-2">
          <button
            onClick={() => setPageIndex(0)}
            disabled={pageIndex === 0}
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="mdi:chevron-double-left" className="w-3.5 h-3.5 mr-2" />
            First
          </button>
          <button
            onClick={() => setPageIndex((old) => Math.max(0, old - 1))}
            disabled={pageIndex === 0}
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="mdi:chevron-left" className="w-3.5 h-3.5 mr-2" />
            Prev
          </button>
        </div>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {pageIndex * pageSize + 1}-
            {Math.min((pageIndex + 1) * pageSize, transactions.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {transactions.length}
          </span>
        </span>
        <div className="flex mt-2 space-x-2">
          <button
            onClick={() =>
              setPageIndex((old) => Math.min(pageCount - 1, old + 1))
            }
            disabled={pageIndex === pageCount - 1}
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <Icon icon="mdi:chevron-right" className="w-3.5 h-3.5 ml-2" />
          </button>
          <button
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={pageIndex === pageCount - 1}
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
            <Icon
              icon="mdi:chevron-double-right"
              className="w-3.5 h-3.5 ml-2"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionTable;
