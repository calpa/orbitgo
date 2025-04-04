import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import WelcomeCard from "../../components/WelcomeCard";

// 1inch API configuration
const INCH_API_URL = "/1inch";
const INCH_API_KEY = import.meta.env.VITE_1INCH_API_KEY;

import type { PortfolioResponse } from "../../types";

function assertAddress(address: string | undefined): `0x${string}` {
  if (!address?.startsWith('0x')) {
    throw new Error('Invalid address');
  }
  return address as `0x${string}`;
}

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { isConnected, address } = useAccount();
  const navigate = Route.useNavigate();

  const {
    data: portfolioData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["portfolio", address],
    queryFn: async () => {
      const ethAddress = assertAddress(address);

      // Example URL: https://api.1inch.dev/portfolio/portfolio/v4/overview/erc20/current_value?addresses=0xD0D8B06B2e911EaF3AdBEEB970874d34686c4744
      const response = await axios.get(
        `${INCH_API_URL}/portfolio/portfolio/v4/overview/erc20/current_value`,
        {
          headers: {
            Authorization: `Bearer ${INCH_API_KEY}`,
            Accept: "application/json",
          },
          params: {
            addresses: ethAddress,
            use_cache: true,
          },
        }
      );

      return response.data as PortfolioResponse;
    },
    enabled: isConnected && address?.startsWith('0x'),
    retry: 2,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // If not connected, redirect to login page
  if (!isConnected) {
    // We use a React effect in the component for client-side redirects
    // This gives a better user experience than throwing in beforeLoad
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100">
      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 border border-blue-100 transform transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Portfolio Value</p>
                  <h3 className="text-xl font-bold text-blue-600">
                    $
                    {(() => {
                      const totalValue = portfolioData?.result?.reduce((acc, protocol) => {
                        const protocolTotal = protocol.result.reduce(
                          (sum, chain) => sum + chain.value_usd,
                          0
                        );
                        return acc + protocolTotal;
                      }, 0) ?? 0;

                      return totalValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                    })()
                    }
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-blue-100 transform transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
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
                <div>
                  <p className="text-sm text-gray-500">Addresses</p>
                  <h3 className="text-xl font-bold text-green-600">
                    {portfolioData?.result?.reduce((acc, protocol) => 
                      acc + protocol.result.filter(chain => chain.value_usd > 0).length, 0) || 0
                    }
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-teal-100 transform transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <h3 className="text-xl font-bold">
                    {new Date().toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Value */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
            <h2 className="text-xl font-bold mb-4">Portfolio Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Protocol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chain
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      USD Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolioData?.result?.map((protocol) =>
                    protocol.result
                      .filter((chain) => chain.value_usd > 0)
                      .map((chain, chainIndex) => (
                        <tr
                          key={`${protocol.protocol_name}-${chain.chain_id}-${chainIndex}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {protocol.protocol_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {chain.chain_id === null ? 'All Chains' : `Chain ${chain.chain_id}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            $
                            {chain.value_usd.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
