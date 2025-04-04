import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAccount } from "wagmi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const INCH_API_URL = "/1inch";
const INCH_API_KEY = import.meta.env.VITE_1INCH_API_KEY;

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
  const { address } = useAccount();

  const { data: chartData, isLoading } = useQuery({
    queryKey: ["valueChart", address],
    queryFn: async () => {
      if (!address?.startsWith("0x")) {
        throw new Error("Invalid address");
      }

      const response = await axios.get<ValueChartResponse>(
        `${INCH_API_URL}/portfolio/portfolio/v4/general/value_chart`,
        {
          headers: {
            Authorization: `Bearer ${INCH_API_KEY}`,
            Accept: "application/json",
          },
          params: {
            addresses: address,
            chain_id: 1, // Ethereum mainnet
            timerange: "1month", // 1 month
            use_cache: true,
          },
        }
      );

      return response.data;
    },
    enabled: !!address?.startsWith("0x"),
    staleTime: 300000, // Consider data fresh for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-blue-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-300"></div>
      </div>
    );
  }

  if (!chartData?.result?.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-blue-800 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Portfolio Value Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData.result}
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
    </div>
  );
}
