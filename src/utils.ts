import { Address } from "viem";
import { getTokensOwnedByAccountResponse } from "./types";
import axios from "axios";

// Helper function to add delay between API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to make API calls with retry functionality
async function makeApiCall<T>(
  url: string,
  method: string,
  headers: Record<string, string>,
  data: any,
  retries = 3,
  delayMs = Math.floor(Math.random() * 200) + 100 // Random delay between 100-300ms
): Promise<T> {
  try {
    // Add delay before making the API call
    await delay(delayMs);

    const response = await axios({
      url,
      method,
      headers,
      data,
    });

    return response.data as T;
  } catch (error) {
    if (retries > 0) {
      console.log(`API call failed, retrying... (${retries} retries left)`);
      // Exponential backoff - increase delay for each retry
      return makeApiCall<T>(
        url,
        method,
        headers,
        data,
        retries - 1,
        delayMs * 1.5
      );
    }
    throw error;
  }
}

export async function getAllChainBalances(
  previousState: { balances: Record<string, any> },
  formData: FormData
) {
  console.log(`Getting all chain balances`);
  const address = formData.get("address") as Address | null;
  console.log(`Address: ${address}`);

  if (!address) {
    return { balances: {} };
  }

  const chains = ["ethereum", "base", "arbitrum", "optimism", "polygon"];
  const results = { ...previousState.balances };

  // Process chains sequentially with delay between each request
  for (const chain of chains) {
    try {
      const data = await getTokensOwnedByAccount(chain, address);
      results[chain] = data;
    } catch (error) {
      console.error(`Error fetching token balances for ${chain}:`, error);
      results[chain] = { items: [] };
    }
  }

  return { balances: results };
}

export async function getTokensOwnedByAccount(chain: string, account: Address) {
  console.log(`Getting tokens owned by account ${account} on chain ${chain}`);

  const url = `https://web3.nodit.io/v1/${chain}/mainnet/token/getTokensOwnedByAccount`;
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "X-API-KEY": import.meta.env.VITE_API_KEY,
  };
  const data = { accountAddress: account, withCount: false };

  return makeApiCall<getTokensOwnedByAccountResponse>(
    url,
    "POST",
    headers,
    data
  );
}

export interface NativeBalanceResponse {
  balance: string;
  symbol: string;
  decimals: number;
}

export async function getNativeBalance(
  chain: string,
  account: Address
): Promise<NativeBalanceResponse> {
  console.log(
    `Getting native balance for account ${account} on chain ${chain}`
  );

  const url = `https://web3.nodit.io/v1/${chain}/mainnet/native/getNativeBalanceByAccount`;
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "X-API-KEY": import.meta.env.VITE_API_KEY,
  };
  const data = { accountAddress: account };

  return makeApiCall<NativeBalanceResponse>(url, "POST", headers, data);
}

export async function getAllNativeBalances(account: Address) {
  console.log(`Getting all native balances for account ${account}`);

  const chains = ["ethereum", "base", "arbitrum", "optimism", "polygon"];
  const results: Record<string, NativeBalanceResponse> = {};

  // Process chains sequentially with delay between each request
  for (const chain of chains) {
    try {
      // Add a small delay between each chain request (100-300ms)
      const data = await getNativeBalance(chain, account);
      results[chain] = data;
    } catch (error) {
      console.error(`Error fetching native balance for ${chain}:`, error);
      results[chain] = {
        balance: "0",
        symbol: getChainSymbol(chain),
        decimals: 18,
      };
    }
  }

  return results;
}

// Helper function to get the native token symbol for each chain
export function getChainSymbol(chain: string): string {
  switch (chain.toLowerCase()) {
    case "ethereum":
      return "ETH";
    case "base":
      return "ETH";
    case "arbitrum":
      return "ETH";
    case "optimism":
      return "ETH";
    case "polygon":
      return "MATIC";
    default:
      return "ETH";
  }
}

/**
 * Represents a token transfer event
 */
/**
 * Token market data from CoinMarketCap
 */
export interface TokenMarketData {
  id: number;
  name: string;
  symbol: string;
  description: string;
  logo: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
      market_cap: number;
      volume_24h: number;
    };
  };
}

interface CoinMarketCapResponse {
  data: Record<
    string,
    {
      id: number;
      name: string;
      symbol: string;
      description: string;
      logo: string;
      quote: {
        USD: {
          price: number;
          percent_change_24h: number;
          market_cap: number;
          volume_24h: number;
        };
      };
    }
  >;
}

/**
 * Get token market data from CoinMarketCap
 * @param address Token contract address
 */
export async function getTokenMarketData(
  address: string
): Promise<TokenMarketData> {
  // First get the CMC ID for the token
  const metadataUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?address=${address}&CMC_PRO_API_KEY=${import.meta.env.VITE_COINMARKET_CAP_API_KEY}`;
  const metadataResponse = await makeApiCall<CoinMarketCapResponse>(
    metadataUrl,
    "GET",
    {
      accept: "application/json",
    },
    undefined
  );

  const tokenData = Object.values(metadataResponse.data)[0];
  if (!tokenData) {
    throw new Error("Token not found");
  }

  // Then get the latest market data
  const quoteUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${tokenData.id}`;
  const quoteResponse = await makeApiCall<CoinMarketCapResponse>(
    quoteUrl,
    "GET",
    {
      accept: "application/json",
    },
    undefined
  );

  const marketData = Object.values(quoteResponse.data)[0];
  if (!marketData) {
    throw new Error("Market data not found");
  }

  return {
    ...tokenData,
    quote: marketData.quote,
  };
}

export interface TokenTransferResponse {
  rpp: number;
  cursor: string | null;
  items: TokenTransfer[];
}

export interface TokenTransfer {
  /** Sender address */
  from: string;
  /** Recipient address */
  to: string;
  /** Transfer value in wei */
  value: string;
  /** Block timestamp */
  timestamp: number;
  /** Block number */
  blockNumber: string;
  /** Transaction hash */
  transactionHash: string;
  /** Log index in the transaction */
  logIndex: number;
  /** Token contract information */
  contract: {
    address: string;
    deployedTransactionHash: string;
    deployedAt: string;
    deployerAddress: string;
    logoUrl: string | null;
    type: string;
    name: string;
    symbol: string;
    totalSupply: string;
    decimals: number;
  };
}

/**
 * Parameters for token transfer API request
 */
export interface TokenTransferParams {
  /** Account address to get transfers for */
  accountAddress: Address;
  /** Starting block number, defaults to genesis */
  fromBlock?: string;
  /** Ending block number, defaults to latest */
  toBlock?: string;
  /** Whether to include total count in response */
  withCount?: boolean;
  /** Whether to include transfers with zero value */
  withZeroValue?: boolean;
}

/**
 * Fetches token transfer history for a specific account and token
 * @param chain - Chain name (e.g., 'ethereum', 'arbitrum')
 * @param account - Account address to get transfers for
 * @param contractAddresses - Token contract addresses
 * @returns Promise resolving to array of token transfers
 */
export async function getTokenTransfersByAccount(
  chain: string,
  account: Address,
  contractAddresses: string[]
): Promise<TokenTransferResponse> {
  const url = `https://web3.nodit.io/v1/${chain}/mainnet/token/getTokenTransfersByAccount`;

  return makeApiCall<TokenTransferResponse>(
    url,
    "POST",
    {
      accept: "application/json",
      "content-type": "application/json",
      "X-API-KEY": import.meta.env.VITE_API_KEY,
    },
    {
      accountAddress: account,
      contractAddresses,
      fromBlock: "0",
      toBlock: "latest",
      withCount: false,
      withZeroValue: false,
    }
  );
}
