import moment from "moment";
import { exportToCSV } from "../utils/csv";
import { useAccount } from "wagmi";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getChainName } from "../utils/chains";
import { BalanceHistoryAPIResponse } from "../types";

export interface Result {
  timestamp: number;
  value_usd: number;
}

function formatDate(timestamp: number) {
  return moment(timestamp * 1000).format("MMM D, YYYY");
}

interface ValueChartProps {
  chartData?: BalanceHistoryAPIResponse;
  timerange: string;
  setTimerange: (timerange: string) => void;
  isLoading: boolean;
  refetch: () => void;
  isRefetching: boolean;
}

export function ValueChart(props: ValueChartProps) {
  const {
    chartData,
    timerange,
    setTimerange,
    isLoading,
    refetch,
    isRefetching,
  } = props;

  const { address } = useAccount();

  function exportAsCSV() {
    if (!chartData) return;

    const from = moment().subtract(timerange).format("YYYY-MM-DD");
    const to = moment().format("YYYY-MM-DD");

    exportToCSV({
      headers: ["Date", "Value (USD)"],
      rowTransformer: (item: [string, Result[]]) => [
        new Date(parseInt(item[0]) * 1000).toISOString(),
        ...item[1].map((result) => result.value_usd.toString()),
      ],
      data: Object.entries(chartData.result),
      filename: `${address}_from_${from}_to_${to}_value`,
    });
  }

  const gettingData = isLoading || isRefetching;

  const formattedData = useMemo(() => {
    if (!chartData) return [];

    console.log("chartData", chartData);

    // First, collect all unique timestamps
    const timestamps = new Set<number>();
    Object.values(chartData.result).forEach((values) => {
      values.forEach(({ timestamp }) => timestamps.add(timestamp));
    });

    // Create data points for each timestamp
    return Array.from(timestamps)
      .sort((a, b) => a - b)
      .map((timestamp) => {
        const dataPoint: any = { timestamp };
        Object.entries(chartData.result).forEach(([chainId, values]) => {
          const value = values.find((v) => v.timestamp === timestamp);
          if (value) {
            dataPoint[`chain_${chainId}`] = value.value_usd;
          }
        });
        return dataPoint;
      });
  }, [chartData, isRefetching]);

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
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
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

      {!gettingData && chartData && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`,
                  `Chain ${getChainName(parseInt(name))}`,
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}
                itemStyle={{
                  color: "#666",
                }}
                labelFormatter={(label: number) => formatDate(label)}
              />
              <Legend
                formatter={(value: string) => getChainName(parseInt(value))}
                iconType="circle"
                iconSize={12}
              />
              {Object.keys(chartData.result).map((chainId) => (
                <Area
                  key={chainId}
                  type="monotone"
                  dataKey={`chain_${chainId}`}
                  name={chainId}
                  stackId="1"
                  stroke={`hsl(${parseInt(chainId) * 137.5}, 70%, 50%)`}
                  fill={`hsl(${parseInt(chainId) * 137.5}, 70%, 50%)`}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
