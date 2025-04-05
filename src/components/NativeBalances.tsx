import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { getAllNativeBalances, NativeBalanceResponse } from "../utils";

type ChainInfo = {
  name: string;
  color: string;
  icon: React.ReactNode;
};

const chainInfo: Record<string, ChainInfo> = {
  ethereum: {
    name: "Ethereum",
    color: "from-blue-500 to-blue-600",
    icon: (
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 784.37 1277.39"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <polygon
            fill="currentColor"
            fillRule="nonzero"
            points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
          />
          <polygon
            fill="currentColor"
            fillRule="nonzero"
            points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
          />
          <polygon
            fill="currentColor"
            fillRule="nonzero"
            points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
          />
          <polygon
            fill="currentColor"
            fillRule="nonzero"
            points="392.07,1277.38 392.07,956.52 -0,724.89 "
          />
        </g>
      </svg>
    ),
  },
  base: {
    name: "Base",
    color: "from-blue-600 to-blue-700",
    icon: (
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12Z"
          fill="currentColor"
        />
        <path
          d="M11.9996 6.5L11.9996 17.5M11.9996 6.5C13.3803 6.5 14.4996 7.61929 14.4996 9C14.4996 10.3807 13.3803 11.5 11.9996 11.5C10.6189 11.5 9.49961 10.3807 9.49961 9C9.49961 7.61929 10.6189 6.5 11.9996 6.5ZM11.9996 17.5C10.6189 17.5 9.49961 16.3807 9.49961 15C9.49961 13.6193 10.6189 12.5 11.9996 12.5C13.3803 12.5 14.4996 13.6193 14.4996 15C14.4996 16.3807 13.3803 17.5 11.9996 17.5Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  arbitrum: {
    name: "Arbitrum",
    color: "from-blue-800 to-indigo-800",
    icon: (
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
          fill="currentColor"
        />
        <path
          d="M7.05273 15.9717L11.9998 5.04297L16.9469 15.9717H7.05273Z"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 19.957L7.05273 15.9717H16.9469L12 19.957Z"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  optimism: {
    name: "Optimism",
    color: "from-red-500 to-red-600",
    icon: (
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
          fill="currentColor"
        />
        <path
          d="M8.49805 6.25H11.9981L15.498 10.25L11.9981 14.25L8.49805 10.25V15.75H5.99805V6.25H8.49805Z"
          fill="white"
        />
        <path
          d="M12.002 14.25H15.502L12.002 18.25L8.50195 14.25H12.002Z"
          fill="white"
        />
      </svg>
    ),
  },
  polygon: {
    name: "Polygon",
    color: "from-purple-600 to-purple-700",
    icon: (
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 38 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.0002 0L0 13.3835L7.21881 32.5H30.7815L38.0003 13.3835L19.0002 0Z"
          fill="currentColor"
        />
        <path
          d="M19.0004 4.04401L7.21899 28.4559H30.7818L19.0004 4.04401Z"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 16.25L7.21875 13.3835L19 0L30.7812 13.3835L19 16.25Z"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 16.25V32.5"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

const NativeBalances = () => {
  const { address, isConnected } = useAccount();
  const [nativeBalances, setNativeBalances] = useState<Record<
    string,
    NativeBalanceResponse
  > | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNativeBalances = async () => {
      if (isConnected && address) {
        setLoading(true);
        try {
          const balances = await getAllNativeBalances(address as Address);
          setNativeBalances(balances);
        } catch (error) {
          console.error("Error fetching native balances:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNativeBalances();
  }, [address, isConnected]);

  const refreshBalances = async () => {
    if (isConnected && address) {
      setLoading(true);
      try {
        const balances = await getAllNativeBalances(address as Address);
        setNativeBalances(balances);
      } catch (error) {
        console.error("Error refreshing native balances:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatBalance = (balance: string, decimals: number) => {
    return (Number(balance) / 10 ** decimals).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    });
  };

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
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
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Native Balances
          </h2>
        </div>
        <button
          onClick={refreshBalances}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {nativeBalances &&
          Object.entries(nativeBalances).map(([chain, data]) => {
            const info = chainInfo[chain] || {
              name: chain.charAt(0).toUpperCase() + chain.slice(1),
              color: "from-gray-500 to-gray-600",
              icon: null,
            };

            return (
              <div
                key={chain}
                className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className={`h-2 bg-gradient-to-r ${info.color}`}></div>
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${info.color} flex items-center justify-center mr-2`}
                    >
                      {info.icon}
                    </div>
                    <h3 className="font-bold text-gray-800">{info.name}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{data.symbol}</span>
                    <span className="font-mono font-medium text-lg">
                      {formatBalance(data.balance, 18)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        {loading && !nativeBalances && (
          <div className="col-span-full flex justify-center items-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default NativeBalances;
