export interface Chain {
  id: number;
  name: string;
  icon: string;
}

export interface TokenDetails {
  chain_id: number | null;
  contract_address: string;
  name: string;
  symbol: string;
  amount: number;
  price_to_usd: number;
  value_usd: number;
  abs_profit_usd: number | null;
  roi: number | null;
  status: number;
}

export interface ChainTokenDetails extends TokenDetails {
  chainName: string;
  chainIcon: string;
}

export interface TokenDetailsResponse {
  result: TokenDetails[];
}
