import { useAtomValue } from "jotai";
import { Link } from "@tanstack/react-router";
import { chainTokensAtom, chainLoadingAtom } from "../atoms/portfolio";
import type { Chain } from "../types/portfolio";
import { japaneseColors } from "../utils/colors";

interface BalanceCardProps {
  chain: Chain;
}

export function BalanceCard({ chain }: BalanceCardProps) {
  const chainTokens = useAtomValue(chainTokensAtom);
  const chainLoading = useAtomValue(chainLoadingAtom);

  // Get tokens for this chain
  const tokens = chainTokens.filter((token) => token.chainName === chain.name);

  // Calculate total value in USD
  const totalValue = tokens.reduce((sum, token) => sum + token.value_usd, 0);

  // Calculate total profit/loss
  const totalProfit = tokens.reduce((sum, token) => {
    return sum + (token.abs_profit_usd || 0);
  }, 0);

  // Get loading state for this chain
  const isLoading = chainLoading[chain.id];

  return (
    <Link
      to="/dashboard/$chainId"
      params={{ chainId: chain.id.toString() }}
      className="block transition-transform hover:scale-[1.02] duration-300"
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${japaneseColors.konruri} 0%, ${japaneseColors.rurikon} 100%)`,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        className="rounded-lg p-6 mb-6 transition-transform hover:scale-[1.02] duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={chain.icon} alt={chain.name} className="w-8 h-8" />
            <h3
              className="text-xl font-semibold"
              style={{ color: japaneseColors.shinonome }}
            >
              {chain.name}
            </h3>
          </div>
          {isLoading && (
            <div
              className="animate-spin rounded-full h-4 w-4 border-2"
              style={{
                borderColor: `${japaneseColors.sora} transparent ${japaneseColors.sora} transparent`,
              }}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p style={{ color: japaneseColors.gin }} className="text-sm">
              Total Value
            </p>
            <p
              style={{ color: japaneseColors.gofun }}
              className="text-2xl font-bold"
            >
              {totalValue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>

          <div>
            <p style={{ color: japaneseColors.gin }} className="text-sm">
              Profit/Loss
            </p>
            <p
              className="text-2xl font-bold"
              style={{
                color:
                  totalProfit >= 0
                    ? japaneseColors.midori
                    : japaneseColors.beniaka,
              }}
            >
              {totalProfit >= 0 ? "+" : ""}
              {totalProfit.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p style={{ color: japaneseColors.gin }} className="text-sm">
              Assets
            </p>
            <p
              style={{ color: japaneseColors.kincha }}
              className="text-sm font-medium"
            >
              {tokens.length}
            </p>
          </div>
          <div className="space-y-2">
            {tokens.slice(0, 3).map((token) => (
              <div
                key={token.contract_address}
                className="flex items-center justify-between text-sm"
                style={{ color: japaneseColors.shinonome }}
              >
                <span className="font-medium">{token.symbol}</span>
                <span>
                  {token.amount.toLocaleString("en-US", {
                    maximumFractionDigits: 6,
                  })}
                </span>
              </div>
            ))}
            {tokens.length > 3 && (
              <p
                style={{ color: japaneseColors.momo }}
                className="text-sm text-right"
              >
                +{tokens.length - 3} more
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
