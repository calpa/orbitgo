import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PortfolioDetails } from "../../components/PortfolioDetails";
import WelcomeCard from "../../components/WelcomeCard";
import { ValueChart } from "../../components/ValueChart";

// 1inch API configuration
const INCH_API_URL = "/1inch";
const INCH_API_KEY = import.meta.env.VITE_1INCH_API_KEY;

import type { PortfolioResponse } from "../../types";
import { validateEthAddress, type EthAddress } from "../../utils/ethereum";
import Stats from "../../components/Stats";

interface PortfolioQueryParams {
  addresses: EthAddress;
  use_cache: boolean;
}

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { isConnected, address } = useAccount();
  const validAddress = address ? validateEthAddress(address) : undefined;
  if (!validAddress) {
    throw new Error("No valid address provided");
  }
  const checkedAddress = validAddress as `0x${string}`;
  const navigate = Route.useNavigate();

  const {
    data: portfolioData,
    error: queryError,
    isLoading,
  } = useQuery({
    queryKey: ["portfolio", checkedAddress],
    queryFn: async () => {
      if (!isConnected) {
        throw new Error("Not connected");
      }

      const params = {
        addresses: checkedAddress,
        use_cache: true,
      } satisfies PortfolioQueryParams;

      const response = await axios.get(
        `${INCH_API_URL}/portfolio/portfolio/v4/overview/erc20/current_value`,
        {
          params,
          headers: {
            Authorization: `Bearer ${INCH_API_KEY}`,
            accept: "application/json",
          },
        }
      );

      return response.data as PortfolioResponse;
    },
    enabled: isConnected && !!checkedAddress,
    retry: 2,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  if (!isConnected) {
    // We use a React effect in the component for client-side redirects
    // This gives a better user experience than throwing in beforeLoad
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100">
      {/* Main Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : queryError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
          Failed to fetch portfolio data
        </div>
      ) : (
        <div className="container mx-auto px-6 py-8">
          {/* Welcome Card */}
          <WelcomeCard address={address} />

          {/* Stats Overview */}
          <Stats portfolioData={portfolioData} />

          {/* Value Chart */}
          <div className="mb-8">
            <ValueChart />
          </div>

          {/* Portfolio Details */}
          <PortfolioDetails />
        </div>
      )}
    </div>
  );
}
