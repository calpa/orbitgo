import { useEffect, useState } from "react";
import { getTokensOwnedByAccount } from "../utils";
import Coin from "./Coin";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { Item } from "../types";
import { useAtomValue, useSetAtom } from "jotai";
import { balancesAtom, loadingAtom, refreshChainBalanceAtom } from "../atoms";

// List of suspicious keywords that might indicate scam tokens
const SUSPICIOUS_KEYWORDS = [
  "airdrop",
  "drop",
  "claim",
  "free",
  "giveaway",
  "bonus",
  "reward",
  "gift",
  "fake",
  "scam",
  "phishing",
  "test",
  "faucet",
  "1000x",
  "100x",
  "moon",
  "presale",
  "pre-sale",
  "pre sale",
  "whitelist",
  "white-list",
  "white list",
  "www.",
  "https://t.ly/",
  "vercel.",
  "cutt.ly",
];

// Function to check if a token might be suspicious based on its name or symbol
const isSuspiciousToken = (item: Item): boolean => {
  const name = item.contract.name.toLowerCase();
  const symbol = item.contract.symbol.toLowerCase();

  return SUSPICIOUS_KEYWORDS.some(
    (keyword) =>
      name.includes(keyword.toLowerCase()) ||
      symbol.includes(keyword.toLowerCase())
  );
};

const CoinList = () => {
  const balances = useAtomValue(balancesAtom);
  const loading = useAtomValue(loadingAtom);
  const refreshChainBalance = useSetAtom(refreshChainBalanceAtom);
  const [hideScamCoins, setHideScamCoins] = useState(true);

  const { address, isConnected } = useAccount();

  // Load balances for all chains when component mounts or address changes
  useEffect(() => {
    const loadAllChainBalances = async () => {
      if (isConnected && address) {
        const chains = ["ethereum", "base", "arbitrum", "optimism", "polygon"];
        for (const chain of chains) {
          try {
            refreshChainBalance({
              chain,
              address: address as Address,
              fetchFn: getTokensOwnedByAccount,
            });
          } catch (error) {
            console.error(`Error loading ${chain} balances:`, error);
          }
        }
      }
    };

    loadAllChainBalances();
  }, [address, isConnected, refreshChainBalance]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 overflow-hidden">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Token Balances
        </h2>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 mb-6 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Connected Wallet Balances
            </h3>
            <div className="mt-2 flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={hideScamCoins}
                    onChange={() => setHideScamCoins(!hideScamCoins)}
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full shadow-inner transition-colors duration-300 ease-in-out" />
                  <div
                    className={`absolute w-5 h-5 rounded-full shadow top-0 left-0 transition-transform duration-300 ease-in-out transform ${hideScamCoins ? "translate-x-5 bg-teal-500" : "translate-x-0 bg-white"}`}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-700">
                  Filter Suspicious Tokens
                </span>
              </label>
              <div className="ml-2">
                <div className="group relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500 cursor-help"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    Filters out tokens with suspicious keywords like 'airdrop',
                    'claim', 'free', etc. that might be potential scams.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center whitespace-nowrap"
            disabled={loading || !isConnected}
            onClick={() => {
              if (address) {
                const chains = [
                  "ethereum",
                  "base",
                  "arbitrum",
                  "optimism",
                  "polygon",
                ];
                for (const chain of chains) {
                  refreshChainBalance({
                    chain,
                    address: address as Address,
                    fetchFn: getTokensOwnedByAccount,
                  });
                }
              }
            }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
        {!isConnected && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-700">
            <p>Please connect your wallet to view token balances</p>
          </div>
        )}
      </div>

      {/* Token balances by chain */}
      <div className="grid grid-cols-1 gap-6">
        {Object.entries(balances)?.map(([chain, balance]) => (
          <div
            key={chain}
            className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden transition-all duration-300 hover:shadow-lg relative"
          >
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 h-2"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">
                    {chain[0].toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {chain[0].toUpperCase() + chain.slice(1)}
                </h3>

                <div className="ml-auto">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center"
                    disabled={loading}
                    onClick={() => {
                      if (address) {
                        refreshChainBalance({
                          chain,
                          address: address as Address,
                          fetchFn: getTokensOwnedByAccount,
                        });
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {balance.items && balance.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {balance.items
                    ?.filter(
                      (item) => !hideScamCoins || !isSuspiciousToken(item)
                    )
                    .map((item: Item) => {
                      const suspicious = isSuspiciousToken(item);
                      return (
                        <div
                          key={item.contract.address}
                          className={`${suspicious ? "bg-gradient-to-r from-gray-50 to-red-50 border-red-100" : "bg-gradient-to-r from-gray-50 to-blue-50 border-blue-100"} rounded-lg p-4 border transition-all duration-300 hover:shadow-md relative`}
                        >
                          {suspicious && (
                            <div className="absolute top-2 right-2 group">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                              </svg>
                              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                This token has suspicious keywords that might
                                indicate a scam.
                              </div>
                            </div>
                          )}
                          <Coin
                            logoUrl={item.contract.logoUrl}
                            name={item.contract.name}
                            symbol={item.contract.symbol}
                            balance={item.balance}
                            decimals={item.contract.decimals}
                            chain={chain}
                            address={item.contract.address}
                          />
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-500">No tokens found on this chain</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {Object.keys(balances).length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-blue-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl text-gray-500 mb-2">
              No Token Balances Found
            </p>
            <p className="text-gray-400">
              {isConnected
                ? "Loading balances or no tokens found"
                : "Connect your wallet to view token balances"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinList;
