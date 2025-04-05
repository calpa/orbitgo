import { createFileRoute } from "@tanstack/react-router";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { useEffect, useState, useMemo } from "react";
import { fetchTransactions } from "../../services/transactions";
import { Transaction } from "../../types";
import { useAccount } from "wagmi";
import { getChainName, getChainIcon, getExplorerUrl } from "../../utils/chains";
import transactionTypes from "../../constants/transactionTypes.json";
import { exportToCSV } from "../../utils/csv";
import TransactionTable from "../../components/TransactionTable";

const PAGE_SIZE_OPTIONS = [10, 50, 100] as const;

// Using Transaction type from types.ts

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("details.type", {
    header: () => (
      <div className="flex items-center space-x-1 cursor-pointer">
        <svg
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
        <span>Type</span>
      </div>
    ),
    cell: (info) => {
      const type = info.getValue();
      const typeInfo = transactionTypes.find(
        (t) => t.type.toLowerCase() === type.toLowerCase()
      );
      return (
        <div className="flex items-center space-x-2">
          {typeInfo && (
            <Icon icon={typeInfo.icon} className="w-4 h-4 text-gray-600" />
          )}
          <span className="font-medium">{type}</span>
        </div>
      );
    },
    enableSorting: true,
  }),
  columnHelper.accessor("details.fromAddress", {
    header: () => (
      <div className="flex items-center space-x-1 cursor-pointer">
        <svg
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
        <span>From</span>
      </div>
    ),
    cell: (info) => {
      const address = info.getValue();
      return (
        <a
          href={`${getExplorerUrl(info.row.original.details.chainId)}/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          {address.substring(0, 6)}...{address.substring(address.length - 4)}
        </a>
      );
    },
    enableSorting: true,
  }),
  columnHelper.accessor("details.toAddress", {
    header: () => (
      <div className="flex items-center space-x-1 cursor-pointer">
        <svg
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>To</span>
      </div>
    ),
    cell: (info) => {
      const address = info.getValue();
      return (
        <a
          href={`${getExplorerUrl(info.row.original.details.chainId)}/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          {address.substring(0, 6)}...{address.substring(address.length - 4)}
        </a>
      );
    },
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
          {status[0].toUpperCase() + status.slice(1)}
        </span>
      );
    },
    enableSorting: true,
  }),
  columnHelper.accessor("details.chainId", {
    header: () => (
      <div className="flex items-center space-x-1 cursor-pointer">
        <svg
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9c0 3.4 2.7 6.2 6 7.3V21l3-3 3 3v-1.7c3.3-1.1 6-3.9 6-7.3Z" />
        </svg>
        <span>Chain</span>
      </div>
    ),
    cell: (info) => {
      const chainId = info.getValue();
      const chainName = getChainName(chainId);
      const chainIcon = getChainIcon(chainId);
      return (
        <div className="flex items-center space-x-2">
          {chainIcon && (
            <img src={chainIcon} alt={chainName} className="w-4 h-4" />
          )}
          <span>{chainName}</span>
        </div>
      );
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
          {direction[0].toUpperCase() + direction.slice(1)}
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
            <div
              key={index}
              className="flex items-center space-x-1 overflow-hidden"
            >
              <span className="font-medium truncate">
                {Number(action.amount).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-gray-500 shrink-0">{action.standard}</span>
              {action.priceToUsd && (
                <span className="text-gray-500 text-sm shrink-0">
                  ($
                  {Number(action.priceToUsd).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                  )
                </span>
              )}
            </div>
          ))}
        </div>
      );
    },
  }),
  columnHelper.accessor("details.txHash", {
    header: () => (
      <div className="flex items-center space-x-1">
        <svg
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <path d="m8 5 4-4 4 4" />
          <path d="M12 1v12" />
        </svg>
        <span>Transaction Hash</span>
      </div>
    ),
    cell: (info) => {
      const hash = info.getValue();
      const chainId = info.row.original.details.chainId;
      const explorerUrl = getExplorerUrl(chainId);

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] =
    useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const { address } = useAccount();
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleExportCSV = () => {
    exportToCSV({
      headers: [
        "Type",
        "From",
        "To",
        "Status",
        "Chain",
        "Direction",
        "Amount",
        "Hash",
        "Time",
      ],
      rowTransformer: (tx: Transaction) => [
        tx.details.type,
        tx.details.fromAddress,
        tx.details.toAddress,
        tx.details.status,
        getChainName(tx.details.chainId),
        tx.direction,
        tx.details.tokenActions
          .map(
            (action) =>
              `${action.amount} ${action.standard}${action.priceToUsd ? ` ($${action.priceToUsd.toFixed(2)})` : ""}`
          )
          .join(", "),
        tx.details.txHash,
        new Date(tx.timeMs).toLocaleString(),
      ],
      data: transactions,
      filename: `transactions_${address}_${new Date().toISOString()}`,
    });
  };

  const pageCount = Math.ceil(transactions.length / pageSize);
  const paginatedData = useMemo(
    () => transactions.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    [transactions, pageIndex, pageSize]
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: {
      sorting,
      columnFilters: [{ id: "details.chainName", value: "" }],
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
        setTransactions(transactions);
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
      <div className="flex flex-row justify-between items-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">View all transactions for your wallet</p>
        </div>

        {/* Control Panel */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            >
              <Icon icon="mdi:file-export" className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <TransactionTable
        loading={loading}
        error={error}
        transactions={transactions}
      />
    </div>
  );
}
