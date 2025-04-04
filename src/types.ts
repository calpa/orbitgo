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
