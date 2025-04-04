import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useAccount } from "wagmi";
import { YieldCard } from "../../components/YieldCard";

const INCH_API_URL = "/1inch";
const INCH_API_KEY = import.meta.env.VITE_1INCH_API_KEY;

import type { PortfolioResponse2 } from "../../types";

export const Route = createFileRoute("/dashboard/yields")({
  component: RouteComponent,
});

function RouteComponent() {
  const { address } = useAccount();
  const chain_id = 1;

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["portfolioDetails", address, chain_id],
    queryFn: async () => {
      const response = await axios.get<PortfolioResponse2>(
        `${INCH_API_URL}/portfolio/portfolio/v4/overview/protocols/details`,
        {
          headers: {
            Authorization: `Bearer ${INCH_API_KEY}`,
            Accept: "application/json",
          },
          params: {
            addresses: address,
            chain_id: 1, // Ethereum mainnet
            closed: true,
            closed_threshold: 1,
            use_cache: true,
          },
        }
      );

      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Yield Opportunities
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          Failed to fetch yield data. Please try again.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.result.map((protocol) => (
          <YieldCard key={protocol.contract_address} info={protocol} />
        ))}
      </div>

      {data?.result.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No yield opportunities found.
        </div>
      )}
    </div>
  );
}
