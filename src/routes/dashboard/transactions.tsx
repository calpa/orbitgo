import { createFileRoute } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { fetchTransactions } from "../../services/transactions";
import { Transaction } from "../../types";
import { Spinner } from "../../components";
import { useAccount } from "wagmi";

// Using Transaction type from types.ts

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("details.type", {
    header: () => <span className="cursor-pointer">Type</span>,
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    enableSorting: true,
  }),
  columnHelper.accessor("details.status", {
    header: () => <span className="cursor-pointer">Status</span>,
    cell: (info) => {
      const status = info.getValue();
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            status === "success" || status === "completed"
              ? "bg-green-100 text-green-800"
              : status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
    enableSorting: true,
  }),
  columnHelper.accessor("details.chainId", {
    header: () => <span className="cursor-pointer">Chain</span>,
    cell: (info) => {
      const chainId = info.getValue();
      const chainName =
        {
          1: "Ethereum",
          56: "BSC",
          100: "Gnosis",
          137: "Polygon",
        }[chainId] || `Chain ${chainId}`;
      return <span>{chainName}</span>;
    },
    enableSorting: true,
  }),
  columnHelper.accessor("direction", {
    header: () => <span className="cursor-pointer">Direction</span>,
    cell: (info) => {
      const direction = info.getValue();
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            direction === "in"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {direction.toUpperCase()}
        </span>
      );
    },
    enableSorting: true,
  }),
  columnHelper.accessor("details.tokenActions", {
    header: () => <span>Amount</span>,
    cell: (info) => {
      const actions = info.getValue();
      return (
        <div className="space-y-1 max-w-[300px]">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center space-x-1 overflow-hidden">
              <span className="font-medium truncate">{action.amount}</span>
              <span className="text-gray-500 shrink-0">{action.standard}</span>
              {action.priceToUsd && (
                <span className="text-gray-500 text-sm shrink-0">
                  (${Number(action.priceToUsd).toFixed(2)})
                </span>
              )}
            </div>
          ))}
        </div>
      );
    },
  }),
  columnHelper.accessor("details.txHash", {
    header: () => <span>Transaction Hash</span>,
    cell: (info) => {
      const hash = info.getValue();
      const chainId = info.row.original.details.chainId;
      const explorerUrl =
        {
          100: "https://gnosisscan.io",
          1: "https://etherscan.io",
          56: "https://bscscan.com",
          137: "https://polygonscan.com",
        }[chainId] || "https://bscscan.com";

      return (
        <a
          href={`${explorerUrl}/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          {hash.substring(0, 8)}...{hash.substring(hash.length - 6)}
        </a>
      );
    },
  }),
  columnHelper.accessor("timeMs", {
    header: () => <span className="cursor-pointer">Time</span>,
    cell: (info) => (
      <span className="whitespace-nowrap">
        {new Date(info.getValue()).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </span>
    ),
    enableSorting: true,
  }),
];

export const Route = createFileRoute("/dashboard/transactions")({
  component: RouteComponent,
});

function RouteComponent() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    async function loadTransactions() {
      if (!address) return;
      try {
        setLoading(true);
        setError(null);
        const transactions = await fetchTransactions(address);
        setData(transactions);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [address]);

  if (!address) {
    return (
      <div className="p-4 text-center text-gray-600">
        Please connect your wallet to view transactions
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600">View all transactions for your wallet</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : data.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No transactions found
        </div>
      ) : (
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
