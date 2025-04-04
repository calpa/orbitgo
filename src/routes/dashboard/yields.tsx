import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import axios from "../../axios";
import { YieldCard } from "../../components/YieldCard";
import type { PortfolioResponse2, Protocol } from "../../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import chainsData from "../../constants/chains.json";
import { motion, AnimatePresence } from "motion/react";

type Chain = {
  id: number;
  name: string;
  icon: string;
};

const INCH_API_KEY = import.meta.env.VITE_1INCH_API_KEY;
const INCH_API_URL = "/1inch";

const fetchChainData = async (chain_id: number, address: `0x${string}`) => {
  console.log(`fetchChainData: ${chain_id}, ${address}`);

  const response = await axios.get<PortfolioResponse2>(
    `${INCH_API_URL}/portfolio/portfolio/v4/overview/protocols/details`,
    {
      headers: {
        Authorization: `Bearer ${INCH_API_KEY}`,
      },
      params: {
        chain_id,
        addresses: address,
      },
    }
  );
  return response.data;
};

export const Route = createFileRoute("/dashboard/yields")({
  component: RouteComponent,
});

function RouteComponent() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  // Query for Ethereum (Chain ID: 1)
  const ethereumQuery = useQuery<PortfolioResponse2, Error>({
    queryKey: ["chain", 1, address],
    queryFn: () => {
      if (!address) throw new Error("Address is required");
      return fetchChainData(1, address);
    },
    enabled: !!address,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Query for BSC (Chain ID: 56)
  const bscQuery = useQuery<PortfolioResponse2, Error>({
    queryKey: ["chain", 56, address],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchChainData(56, address);
    },
    enabled: !!address && !!ethereumQuery.data,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Query for Polygon (Chain ID: 137)
  const polygonQuery = useQuery<PortfolioResponse2, Error>({
    queryKey: ["chain", 137, address],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchChainData(137, address);
    },
    enabled: !!address && !!bscQuery.data,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Query for Arbitrum (Chain ID: 42161)
  const arbitrumQuery = useQuery<PortfolioResponse2, Error>({
    queryKey: ["chain", 42161, address],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchChainData(42161, address);
    },
    enabled: !!address && !!polygonQuery.data,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Query for Gnosis (Chain ID: 100)
  const gnosisQuery = useQuery<PortfolioResponse2, Error>({
    queryKey: ["chain", 100, address],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchChainData(100, address);
    },
    enabled: !!address && !!arbitrumQuery.data,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Query for Optimism (Chain ID: 10)
  const optimismQuery = useQuery<PortfolioResponse2, Error>({
    queryKey: ["chain", 10, address],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchChainData(10, address);
    },
    enabled: !!address && !!gnosisQuery.data,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Query for Base (Chain ID: 8453)
  const baseQuery = useQuery<PortfolioResponse2, Error>({
    queryKey: ["chain", 8453, address],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchChainData(8453, address);
    },
    enabled: !!address && !!optimismQuery.data,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Query for Avalanche (Chain ID: 43114)
  const avalancheQuery = useQuery<PortfolioResponse2, Error>({
    queryKey: ["chain", 43114, address],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchChainData(43114, address);
    },
    enabled: !!address && !!baseQuery.data,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Query for zkSync Era (Chain ID: 324)
  const zkSyncQuery = useQuery<PortfolioResponse2, Error>({
    queryKey: ["chain", 324, address],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchChainData(324, address);
    },
    enabled: !!address && !!avalancheQuery.data,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Query for Linea (Chain ID: 59144)
  const lineaQuery = useQuery<PortfolioResponse2, Error>({
    queryKey: ["chain", 59144, address],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchChainData(59144, address);
    },
    enabled: !!address && !!zkSyncQuery.data,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Create a map of chain data for easier lookup
  const chainData = chainsData.result.reduce<{ [key: number]: Chain }>(
    (acc, chain: Chain) => ({
      ...acc,
      [chain.id]: chain,
    }),
    {}
  );

  const queries = [
    ethereumQuery,
    bscQuery,
    polygonQuery,
    arbitrumQuery,
    gnosisQuery,
    optimismQuery,
    baseQuery,
    avalancheQuery,
    zkSyncQuery,
    lineaQuery,
  ];

  const chainIds = [1, 56, 137, 42161, 100, 10, 8453, 43114, 324, 59144];
  const isLoading = queries.some((query) => query.isLoading);
  const error = queries.find((query) => query.error)?.error;

  if (error) {
    console.log(error);
  }

  // Combine all successful responses
  const allProtocols = queries
    .filter((query) => query.isSuccess && query.data !== undefined)
    .map((query) => query.data)
    .flatMap((data) => data.result)
    .sort((a, b) => b.value_usd - a.value_usd);

  let progressCount = queries.reduce((prev, curr) => {
    if (curr.isFetched) {
      return prev + 1;
    }

    return prev;
  }, 0);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Yield Overview ({progressCount}/{queries.length})
        </h1>

        <div className="flex items-center gap-3">
          {/* Blockchain Icons */}
          <div className="flex items-center gap-2">
            {queries.map((query, index) => {
              const chainId = chainIds[index];
              const chain = chainData[chainId];
              return (
                <motion.div
                  key={chainId}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: query.isFetched ? 1 : 0.3,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="relative rounded-full w-8 h-8 overflow-hidden"
                  title={`${chain.name}${!query.isFetched ? " (Loading...)" : query.isError ? " (Error)" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src={chain.icon}
                    alt={chain.name}
                    className="w-full h-full object-cover"
                    animate={{
                      opacity: query.isFetching ? 0.5 : 1,
                    }}
                    transition={{
                      opacity: { duration: 0.2 },
                    }}
                  />
                  <AnimatePresence>
                    {query.isError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center"
                      >
                        <span className="text-white text-xl">⚠️</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <motion.button
            onClick={() => {
              // Invalidate the Ethereum query to trigger the chain
              queryClient.invalidateQueries({
                queryKey: ["chain", 1, address],
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={isLoading}
            whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.95 }}
            animate={{
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <motion.span
              animate={{
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Loading..." : "Refresh"}
            </motion.span>
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProtocols.map((protocol: Protocol, index: number) => (
          <div
            key={protocol.contract_address}
            className="transform transition-all duration-300 opacity-0 translate-y-4"
            style={{
              animation: `fadeInUp 0.3s ${index * 0.1}s forwards`,
            }}
          >
            <YieldCard info={protocol} />
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(1rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {allProtocols.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {isLoading ? "Loading protocols..." : "No protocols found"}
        </div>
      )}
    </div>
  );
}
