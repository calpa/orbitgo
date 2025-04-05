import { Link } from "@tanstack/react-router";
import type { ChainItem } from "../types";
import { findChainId } from "../utils/chains";

interface BalanceCardProps {
  chain: ChainItem;
  value_usd: number;
  twentyfour_hour_change: number;
}

const chainColors: Record<string, string> = {
  Ethereum: "#627eea",
  Optimism: "#ff0420",
  "BNB Chain": "#f3ba2f",
  Polygon: "#8247e5",
  Gnosis: "#048848",
  Arbitrum: "#28a0f0",
  Avalanche: "#e84142",
  Base: "#0052ff",
  "zkSync Era": "#3e61ff",
  Linea: "#ffd900",
};

export function BalanceCard({
  chain,
  value_usd,
  twentyfour_hour_change,
}: BalanceCardProps) {
  const chainColor = chainColors[chain.name] ?? "#CBD5E1"; // fallback 淺灰藍

  return (
    <Link
      to="/dashboard/chains/$chainId"
      params={{ chainId: String(findChainId(chain.name)) }}
      className="rounded-xl p-5 bg-white/90 dark:bg-gray-900/70 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: chainColor }}
        />
        <img
          src={chain.icon}
          alt={chain.name}
          className="w-7 h-7 rounded-full"
        />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {chain.name}
        </h3>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 px-4 py-3">
          <h5 className="text-xs text-gray-500 mb-1">Total Value</h5>
          <p className="text-md font-semibold text-gray-900 dark:text-white">
            {value_usd > 0
              ? `${value_usd.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                })}`
              : "$0"}
          </p>
        </div>
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 px-4 py-3">
          <h5 className="text-xs text-gray-500 mb-1">24h Change</h5>
          <p
            className={`${twentyfour_hour_change > 0 ? "text-green-500" : "text-red-500"} text-md font-semibold`}
          >
            {twentyfour_hour_change.toFixed(2)}%
          </p>
        </div>
      </div>
    </Link>
  );
}
