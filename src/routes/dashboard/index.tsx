import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { ValueChart } from "../../components/ValueChart";
import WelcomeCard from "../../components/WelcomeCard";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { isConnected, address } = useAccount();
  const navigate = Route.useNavigate();

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
        <ValueChart />
      </div>
    </div>
  );
}
