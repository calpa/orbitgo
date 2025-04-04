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
  protocol_name: 'native' | 'stable' | 'token';
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
