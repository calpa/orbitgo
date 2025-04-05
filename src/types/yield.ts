import { UnderlyingToken, RewardsToken } from "../types";

/**
 * Yield information for display in the dashboard
 */
export interface YieldInfo {
  chain_id: number;
  protocol: string;
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
  reward_tokens: RewardsToken[];
  weighted_apr: number | null;
  roi: number | null;
  holding_time_days: number | null;
  apr: number;
  apy: number;
  tvl_usd: number;
}
