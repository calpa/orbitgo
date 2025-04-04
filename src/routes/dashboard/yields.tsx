import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import axios from "../../axios";
import { YieldCard } from "../../components/YieldCard";
import type { PortfolioResponse2, Protocol } from "../../types";
import chainsData from "../../constants/chains.json";
import { processProtocols, SortOption } from "../../utils/protocol";

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
  const [sortOption, setSortOption] = useState<SortOption>("value_desc");
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>();

  const handleChainClick = (chainId: number) => {
    setSelectedChainId(selectedChainId === chainId ? undefined : chainId);
    setIsOpen(false);
  };
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: "value_desc", label: "Total Value (High to Low)" },
    { value: "value_asc", label: "Total Value (Low to High)" },
    { value: "time_desc", label: "Holding Time (Long to Short)" },
    { value: "time_asc", label: "Holding Time (Short to Long)" },
    { value: "name_desc", label: "Name (Z to A)" },
    { value: "name_asc", label: "Name (A to Z)" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
    retry: 3,
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
    retry: 3,
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
    retry: 3,
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
    retry: 3,
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
    retry: 3,
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
    retry: 3,
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
    retry: 3,
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
    retry: 3,
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
    retry: 3,
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
    retry: 3,
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
  const allProtocols = processProtocols(
    queries
      .filter((query) => query.isSuccess && query.data !== undefined)
      .map((query) => query.data)
      .flatMap((data) => data.result),
    sortOption,
    selectedChainId
  );

  function exportCSV() {
    if (allProtocols.length === 0) return;

    const header =
      "Protocol,Chain,Contract Address,Value (USD),Holding Time (Days)";
    const csvRows = allProtocols.map(
      (protocol) =>
        `${protocol.name},${chainData[protocol.chain_id].name},${protocol.contract_address},${protocol.value_usd.toFixed(2)},${protocol.holding_time_days || 0}`
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent([header, ...csvRows].join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "yield_overview.csv");
    link.click();
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          dAPPs{" "}
          {allProtocols.length > 0 && (
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              (
              <motion.span
                key={allProtocols.length}
                initial={{ fontSize: "1em" }}
                animate={{ fontSize: ["1em", "1.5em", "1em"] }}
                transition={{ duration: 1.5, times: [0, 0.5, 1] }}
              >
                {allProtocols.length}
              </motion.span>
              )
            </motion.span>
          )}
        </h1>

        {/* Control Panel */}
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

          <div
            ref={dropdownRef}
            className="relative inline-block text-left mr-2"
          >
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex w-full justify-between items-center gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600"
            >
              {sortOptions.find((opt) => opt.value === sortOption)?.label ||
                "Sort by"}
              <svg
                className={`-mr-1 h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isOpen && (
              <div
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 dark:ring-gray-600"
                role="menu"
              >
                <div className="py-1" role="none">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOption(option.value as typeof sortOption);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center px-4 py-2 text-sm ${
                        sortOption === option.value
                          ? "bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-600"
                      }`}
                      role="menuitem"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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

        <motion.button
          onClick={exportCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded"
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
            Export CSV
          </motion.span>
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      )}

      {allProtocols.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {isLoading ? "Loading protocols..." : "No protocols found"}
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

      <style jsx>{`
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
      `}</style>
    </div>
  );
}
