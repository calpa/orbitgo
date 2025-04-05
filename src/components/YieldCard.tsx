import { formatNumber } from "../utils/format";
import dappsConfig from "../constants/dapps.json";

const getProtocolUrl = (info: YieldInfo) => {
  console.log("info", info);
  const protocolName = info.protocol_name;
  const dapp = dappsConfig.dapps.find((d) =>
    protocolName.toLowerCase().includes(d.name.toLowerCase())
  );
  if (!dapp) return null;

  let url = dapp.url;

  return url;
};

interface Protocol {
  name: string;
  pool_id?: string;
}

interface UnderlyingToken {
  chain_id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  price_usd: number;
  amount: number;
  value_usd: number;
}

import { YieldInfo } from "../types/yield";

interface YieldCardProps {
  chain_id: number;
  protocol: Protocol | string;
  protocol_url: string;
  protocol_icon: string;
  protocol_name: string;
  name: string;
  symbol: string;
  decimals: number;
  price_usd: number;
  amount: number;
  value_usd: number;
  underlying_tokens: UnderlyingToken[];
  reward_tokens: UnderlyingToken[];
  weighted_apr: number | null;
  roi: number | null;
  holding_time_days: number | null;
  apr: number;
  apy: number;
  tvl_usd: number;
  info: YieldInfo;
}

export const YieldCard = ({ info }: YieldCardProps) => {
  function openDAPP(info: YieldInfo) {
    const url = getProtocolUrl(info);
    if (url) {
      window.open(url, "_blank");
    } else {
      console.log("No URL for Protocl");
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => openDAPP(info)}
    >
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
                      {formatNumber(token.amount)} ($
                      {formatNumber(token.value_usd)})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reward Tokens */}
        {info.reward_tokens && info.reward_tokens.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Rewards</h3>
            <div className="space-y-2">
              {info.reward_tokens.map((token: UnderlyingToken) => (
                <div
                  key={token.address}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{token.symbol}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {formatNumber(token.amount)} ($
                      {formatNumber(token.value_usd)})
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
