import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "../types";

const toPercent = (decimal: number, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;

const getPercent = (value: number, total: number) => {
  const ratio = total > 0 ? value / total : 0;
  return toPercent(ratio, 2);
};

const renderTooltipContent = (o: any) => {
  const { payload, label } = o;
  if (!payload) return null;
  
  const total = payload.reduce((result: number, entry: any) => result + entry.value, 0);

  return (
    <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
      <p className="font-medium text-gray-900">{`${label} (Total: $${total.toLocaleString()})`}</p>
      <ul className="mt-1 space-y-1">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: $${entry.value.toLocaleString()} (${getPercent(entry.value, total)})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface TransactionChartProps {
  transactions: Transaction[];
}

interface ChartData {
  date: string;
  send: number;
  receive: number;
  swap: number;
  transfer: number;
  unknown: number;
}

function TransactionChart({ transactions }: TransactionChartProps) {
  const chartData = useMemo(() => {
    const dailyData = new Map<string, ChartData>();

    // Initialize with empty data
    transactions.forEach((tx) => {
      const date = new Date(tx.timeMs).toISOString().split("T")[0];
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date,
          send: 0,
          receive: 0,
          swap: 0,
          transfer: 0,
          unknown: 0,
        });
      }
    });

    // Aggregate transaction volumes by type and date
    transactions.forEach((tx) => {
      const date = new Date(tx.timeMs).toISOString().split("T")[0];
      const data = dailyData.get(date)!;
      const type = tx.details.type.toLowerCase();
      const volume = tx.details.tokenActions.reduce(
        (sum, action) => sum + (action.priceToUsd || 0),
        0
      );

      if (type === "send") {
        data.send += volume;
      } else if (type === "receive") {
        data.receive += volume;
      } else if (type === "swap") {
        data.swap += volume;
      } else if (type === "transfer") {
        data.transfer += volume;
      } else {
        data.unknown += volume;
      }
    });

    // Convert to array and sort by date
    return Array.from(dailyData.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [transactions]);

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          stackOffset="expand"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis tickFormatter={toPercent} />
          <Tooltip content={renderTooltipContent} />
          <Legend />
          <Area
            type="monotone"
            dataKey="send"
            stackId="1"
            stroke="#4ade80"
            fill="#4ade80"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="receive"
            stackId="1"
            stroke="#f87171"
            fill="#f87171"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="swap"
            stackId="1"
            stroke="#60a5fa"
            fill="#60a5fa"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="transfer"
            stackId="1"
            stroke="#fbbf24"
            fill="#fbbf24"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="unknown"
            stackId="1"
            stroke="#a78bfa"
            fill="#a78bfa"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TransactionChart;
