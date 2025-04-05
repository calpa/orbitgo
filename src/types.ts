export interface getTokensOwnedByAccountResponse {
  rpp: number;
  cursor: any;
  items: Item[];
}

export interface Item {
  ownerAddress: string;
  balance: string;
  contract: Contract;
}

export interface Contract {
  address: string;
  deployedTransactionHash: string;
  deployedAt: string;
  deployerAddress: string;
  logoUrl?: string;
  type: string;
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
}

/**
 * Chain-specific portfolio value
 */
export interface ChainValue {
  chain_id: number | null;
  value_usd: number;
}

/**
 * Protocol-specific portfolio data
 */
export interface ProtocolData {
  protocol_name: "native" | "stable" | "token";
  result: ChainValue[];
}

/**
 * System performance metrics
 */
export interface SystemMeta {
  click_time: number;
  node_time: number;
  microservices_time: number;
  redis_time: number;
  total_time: number;
}

/**
 * 1inch API response format
 */
export interface PortfolioResponse {
  result: ProtocolData[];
  meta: {
    cached_at: number;
    system: SystemMeta;
  };
}

export interface UnderlyingToken {
  chain_id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  amount: number;
  price_to_usd: number;
  value_usd: number;
}

export interface RewardsToken extends UnderlyingToken {}

interface ProtocolInfo {
  profit_abs_usd: number | null;
  roi: number | null;
  weighted_apr: number | null;
  holding_time_days: number | null;
  rewards_tokens: RewardsToken[];
  apr?: number | null;
  rewards?: number | null;
}

export interface Protocol {
  chain_id: number;
  contract_address: string;
  token_id: number;
  addresses: string[];
  protocol: string;
  name: string;
  contract_type: string;
  sub_contract_type: string;
  is_whitelisted: number;
  protocol_name: string;
  protocol_icon: string;
  status: number;
  token_address: string;
  underlying_tokens: UnderlyingToken[];
  value_usd: number;
  debt: boolean;
  rewards_tokens: RewardsToken[];
  profit_abs_usd: number | null;
  roi: number | null;
  weighted_apr: number | null;
  holding_time_days: number | null;
  info: ProtocolInfo;
}

export interface PortfolioResponse2 {
  result: Protocol[];
  meta: {
    cached_at: number;
    system: {
      click_time: number;
      node_time: number;
      microservices_time: number;
      redis_time: number;
      total_time: number;
    };
  };
}

export type Transaction = {
  timeMs: number;
  address: string;
  type: number;
  rating: string;
  direction: "in" | "out";
  details: {
    txHash: string;
    chainId: number;
    blockNumber: number;
    blockTimeSec: number;
    status: string;
    type: string;
    tokenActions: Array<{
      chainId: string;
      address: string;
      standard: string;
      fromAddress: string;
      toAddress: string;
      amount: string;
      direction: string;
      priceToUsd?: number;
    }>;
    fromAddress: string;
    toAddress: string;
    nonce: number;
    orderInBlock: number;
    feeInSmallestNative: string;
    nativeTokenPriceToUsd: number | null;
  };
  id: string;
  eventOrderInTransaction: number;
};

export interface Chain {
  id: number;
  name: string;
  status: "completed" | "in_progress" | "failed";
  data: {
    meta: {
      system: {
        click_time: number;
        node_time: number;
        microservices_time: number;
        redis_time: number;
        total_time: number;
      };
    };
    result: Protocol[];
  };
}

// From Cloudflare Worker API
export interface PorfolioResponse {
  chains: Chain[];
  positions: Protocol[];
  totalValueUsd: number;
}
