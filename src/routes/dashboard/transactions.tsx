import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchTransactions } from "../../services/transactions";
import { Transaction } from "../../types";
import { useAccount } from "wagmi";
import { exportToCSV } from "../../utils/csv";
import TransactionTable from "../../components/TransactionTable";
import TransactionChart from "../../components/TransactionChart";
import { Icon } from "@iconify/react/dist/iconify.js";

export const Route = createFileRoute("/dashboard/transactions")({
  component: RouteComponent,
});

function RouteComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { address } = useAccount();

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
        tx.details.chainId.toString(),
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

  useEffect(() => {
    if (!address) return;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await fetchTransactions(address);
        setTransactions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load transactions"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [address]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">View all transactions for your wallet</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        >
          <Icon icon="mdi:file-export" className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      <TransactionChart transactions={transactions} />

      <TransactionTable
        loading={loading}
        error={error}
        transactions={transactions}
      />
    </div>
  );
}
