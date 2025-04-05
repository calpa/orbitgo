import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { exportProtocolsToCSV } from "../../utils/export";

import { YieldCard } from "../../components/YieldCard";
import { ProtocolAllocationChart } from "../../components/ProtocolAllocationChart";
import { PorfolioResponse } from "../../types";
import { YieldInfo } from "../../types/yield";
import chainsData from "../../constants/chains.json";
import { processProtocols, SortOption } from "../../utils/protocol";
import { fetchPortfolioData } from "../../services/portfolio";

export const Route = createFileRoute("/dashboard/yields")({
  component: RouteComponent,
});

function RouteComponent() {
  const { address } = useAccount();
  const [sortOption, setSortOption] = useState<SortOption>("value_desc");

  const [hideZeroValue, setHideZeroValue] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sort options for the dropdown
  const sortOptions = [
    { value: "roi_desc", label: "ROI (High to Low)" },
    { value: "roi_asc", label: "ROI (Low to High)" },
    { value: "value_desc", label: "Total Value (High to Low)" },
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

  // Query for all portfolio data
  const portfolioQuery = useQuery<PorfolioResponse, Error>({
    queryKey: ["portfolio", address],
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      return fetchPortfolioData(address);
    },
    enabled: !!address,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep data in memory for 5 minutes
    retry: 3,
  });

  // Get protocols from the portfolio query
  const protocols =
    portfolioQuery.data?.chains.flatMap((chain) => chain.data.result) || [];

  // Process protocols based on sort option and filter
  const sortedProtocols = processProtocols(
    protocols,
    sortOption,
    0, // chainId is no longer used since we fetch all chains at once
    hideZeroValue
  );

  const isLoading = portfolioQuery.isLoading;
  const error = portfolioQuery.error;

  const exportCSV = () => {
    if (!address || !sortedProtocols.length) return;
    exportProtocolsToCSV(sortedProtocols, address);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            dAPPs{" "}
            {protocols.length > 0 && (
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                (
                <motion.span
                  key={protocols.length}
                  initial={{ fontSize: "1em" }}
                  animate={{ fontSize: ["1em", "1.5em", "1em"] }}
                  transition={{ duration: 1.5, times: [0, 0.5, 1] }}
                >
                  {protocols.length}
                </motion.span>
                )
              </motion.span>
            )}
          </h1>
          {/* Blockchain Icons */}
          <div className="flex items-center gap-2">
            {chainsData.result.map((chain) => {
              return (
                <motion.div
                  key={`${chain.id}-${chain.name}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="relative rounded-full w-8 h-8 overflow-hidden cursor-pointer"
                  title={`${chain.name}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src={chain.icon}
                    alt={chain.name}
                    className="w-full h-full object-cover"
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      opacity: { duration: 0.2 },
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Control Panel */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hideZeroValue}
              onChange={(e) => setHideZeroValue(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Hide $0 Value
            </span>
          </label>

          <div ref={dropdownRef} className="relative inline-block text-left">
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
            // Invalidate the portfolio query to trigger a refresh
            queryClient.invalidateQueries({
              queryKey: ["portfolio", address],
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

      {protocols.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {isLoading ? "Loading protocols..." : "No protocols found"}
        </div>
      )}

      {/* Total Balances and Allocation Chart */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Total Balances</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-lg font-bold">
                $
                {protocols
                  .reduce((sum, protocol) => sum + protocol.value_usd, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Protocols</p>
              <p className="text-lg font-bold">{protocols.length}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Protocol Allocation</h2>
          <ProtocolAllocationChart protocols={protocols} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProtocols.map((protocol: YieldInfo, index: number) => (
          <div
            key={`${protocol.chain_id}-${protocol.protocol_name}-${protocol.protocol}-${index}`}
            className="transform transition-all duration-300 opacity-0 translate-y-4"
            style={{
              animation: `fadeInUp 0.3s ${index * 0.1}s forwards`,
            }}
          >
            <YieldCard info={protocol} />
          </div>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
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
        `,
        }}
      />
    </div>
  );
}
