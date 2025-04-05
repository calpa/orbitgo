import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { ValueChart } from "../../components/ValueChart";
import WelcomeCard from "../../components/WelcomeCard";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";
import { randomDelay } from "../../utils/delay";
import { BalanceHistoryAPIResponse } from "../../types";
import { BalanceCard } from "../../components/BalanceCard";
import { findChain } from "../../utils/chains";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { isConnected, address } = useAccount();
  const navigate = Route.useNavigate();

  const [timerange, setTimerange] = useState("1year");

  const {
    data: chartData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["valueChart", address, timerange],
    queryFn: async () => {
      if (!address?.startsWith("0x")) {
        throw new Error("Invalid address");
      }

      await randomDelay(1, 5); // Random delay between 1-5 seconds

      const response = await axios.get<BalanceHistoryAPIResponse>(
        `/portfolio/${address}/value-chart`,
        {
          params: {
            timerange: timerange,
          },
        }
      );

      return response.data;
    },
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) =>
      Math.min(1000 * Math.pow(2, attemptIndex), 5000), // Exponential backoff capped at 5s
    enabled: !!address?.startsWith("0x"),
    staleTime: 300000, // Consider data fresh for 5 minutes
  });

  if (!isConnected) {
    // We use a React effect in the component for client-side redirects
    // This gives a better user experience than throwing in beforeLoad
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Card */}
        <WelcomeCard
          address={address || "0x0000000000000000000000000000000000000000"}
        />

        {/* Value Chart */}
        <ValueChart
          chartData={chartData}
          timerange={timerange}
          setTimerange={setTimerange}
          isLoading={isLoading}
          refetch={refetch}
          isRefetching={isRefetching}
        />

        {/* Latest Balance on different chains */}
        <div className="my-8">
          <h2 className="text-2xl font-semibold mb-4">Latest Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(chartData?.result || {}).map(
              ([chainId, results]) => (
                <BalanceCard
                  key={chainId}
                  chain={findChain(parseInt(chainId))!}
                  value_usd={results[results.length - 1]?.value_usd}
                  twentyfour_hour_change={
                    ((results[results.length - 1]?.value_usd -
                      results[results.length - 2]?.value_usd) /
                      results[results.length - 2]?.value_usd) *
                    100
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
