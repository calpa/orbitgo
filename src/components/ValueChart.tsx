import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { exportToCSV } from "../utils/csv";
import { useAccount } from "wagmi";
import axios from "axios";
import { randomDelay } from "../utils/delay";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Using Cloudflare Workers backend

interface ChartDataItem {
  timestamp: number;
  value_usd: number;
}

interface ValueChartResponse {
  result: ChartDataItem[];
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString();
}

function formatValue(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function ValueChart() {
  const [timerange, setTimerange] = useState("1month");
  const { address } = useAccount();

  const {
    data: chartData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["valueChart", address, timerange],
    queryFn: async () => {
      if (!address?.startsWith("0x")) {
        throw new Error("Invalid address");
      }

      await randomDelay(1, 5); // Random delay between 1-5 seconds

      const response = await axios.get<ValueChartResponse>(
        `/portfolio/${address}/value-chart`,
        {
          params: {
            timerange: timerange
          }
        }
      );

      return response.data;
    },
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) =>
      Math.min(1000 * Math.pow(2, attemptIndex), 5000), // Exponential backoff capped at 5s
    enabled: !!address?.startsWith("0x"),
    staleTime: 300000, // Consider data fresh for 5 minutes
  });

  function exportAsCSV() {
    if (!chartData) return;

    const from = moment().subtract(timerange).format("YYYY-MM-DD");
    const to = moment().format("YYYY-MM-DD");

    exportToCSV({
      headers: ["Date", "Value (USD)"],
      rowTransformer: (item) => [
        new Date(item.timestamp * 1000).toISOString(),
        item.value_usd.toString(),
      ],
      data: chartData.result,
      filename: `${address}_from_${from}_to_${to}_value`,
    });
  }

  const gettingData = isLoading || isRefetching;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold mb-4">
          Portfolio Value Over Time
        </h3>

        {!isLoading && (
          <div className="flex justify-end items-center space-x-4">
            <div className="relative inline-block w-40">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
                value={timerange}
                onChange={(e) => setTimerange(e.target.value)}
              >
                <option value="1day">1 Day</option>
                <option value="1week">1 Week</option>
                <option value="1month">1 Month</option>
                <option value="1year">1 Year</option>
                <option value="3years">3 Years</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
              onClick={() => refetch()}
            >
              Refresh
            </button>
            <button
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
              onClick={exportAsCSV}
            >
              Export CSV
            </button>
          </div>
        )}
      </div>

      {gettingData && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!gettingData && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData?.result || []}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatValue}
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => formatValue(value)}
                labelFormatter={(label: number) => formatDate(label)}
              />
              <Line
                type="monotone"
                dataKey="value_usd"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
