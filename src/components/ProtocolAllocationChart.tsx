import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { Protocol } from "../types";

interface ProtocolAllocationChartProps {
  protocols: Protocol[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

export function ProtocolAllocationChart({ protocols }: ProtocolAllocationChartProps) {
  // Group protocols by name and sum their values
  const data = protocols.reduce((acc, protocol) => {
    const existingProtocol = acc.find((p) => p.name === protocol.name);
    if (existingProtocol) {
      existingProtocol.value += protocol.value_usd;
    } else {
      acc.push({
        name: protocol.name,
        value: protocol.value_usd,
      });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Sort by value descending and take top 10
  const sortedData = data
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map((item) => ({
      ...item,
      value: Number(item.value.toFixed(2)), // Round to 2 decimal places
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-600">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {sortedData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
