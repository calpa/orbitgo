import { formatNumber } from "../utils/format";

interface UnderlyingToken {
  chain_id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  amount: number;
  price_to_usd: number;
  value_usd: number;
}

interface RewardToken extends UnderlyingToken {}

interface YieldInfo {
  chain_id: number;
  contract_address: string;
  protocol: string;
  name: string;
  protocol_name: string;
  protocol_icon: string;
  underlying_tokens: UnderlyingToken[];
  rewards_tokens: RewardToken[];
  value_usd: number;
  profit_abs_usd: number | null;
  roi: number | null;
  weighted_apr: number | null;
  holding_time_days: number | null;
}

interface YieldCardProps {
  info: YieldInfo;
}

export function YieldCard({ info }: YieldCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={info.protocol_icon}
            alt={info.protocol_name}
            className="w-8 h-8"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{info.name}</h3>
            <p className="text-sm text-gray-600">{info.protocol_name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="font-semibold text-gray-900">
            ${formatNumber(info.value_usd)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">APR</p>
          <p className="font-semibold text-gray-900">
            {info.weighted_apr
              ? `${(info.weighted_apr * 100).toFixed(2)}%`
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">ROI</p>
          <p
            className={`font-semibold ${
              info.roi
                ? info.roi > 0
                  ? "text-green-600"
                  : "text-red-600"
                : "text-gray-900"
            }`}
          >
            {info.roi ? `${(info.roi * 100).toFixed(2)}%` : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Holding Time</p>
          <p className="font-semibold text-gray-900">
            {info.holding_time_days
              ? `${Math.round(info.holding_time_days)}d`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Tokens */}
      <div className="space-y-4">
        {/* Underlying Tokens */}
        {info.underlying_tokens.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Underlying Tokens</p>
            <div className="space-y-2">
              {info.underlying_tokens.map((token) => (
                <div
                  key={token.address}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{token.symbol}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {formatNumber(token.amount)} (${formatNumber(token.value_usd)}
                      )
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reward Tokens */}
        {info.rewards_tokens.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Reward Tokens</p>
            <div className="space-y-2">
              {info.rewards_tokens.map((token) => (
                <div
                  key={token.address}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{token.symbol}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {formatNumber(token.amount)} (${formatNumber(token.value_usd)}
                      )
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
