import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CoinList from "../../components/CoinList";
import NativeBalances from "../../components/NativeBalances";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { isConnected, address } = useAccount();
  const navigate = Route.useNavigate();

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
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Your Treasury
              </h2>
              <p className="text-gray-600">
                Connected with address:{" "}
                <span className="font-mono text-sm bg-blue-50 p-1.5 rounded border border-blue-100">
                  {address?.slice(0, 4)}...{address?.slice(-4)}
                </span>
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full opacity-80 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
                  viewBox="0 0 784.37 1277.39"
                >
                  <g>
                    <polygon
                      fill="currentColor"
                      fillRule="nonzero"
                      points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"
                    />
                    <polygon
                      fill="currentColor"
                      fillRule="nonzero"
                      points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"
                    />
                    <polygon
                      fill="currentColor"
                      fillRule="nonzero"
                      points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"
                    />
                    <polygon
                      fill="currentColor"
                      fillRule="nonzero"
                      points="392.07,1277.38 392.07,956.52 -0,724.89"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

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
                <p className="text-sm text-gray-500">Networks</p>
                <h3 className="text-xl font-bold">5 Chains</h3>
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
                <p className="text-sm text-gray-500">Status</p>
                <h3 className="text-xl font-bold text-green-600">Active</h3>
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
                  {new Date().toLocaleTimeString()}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Native Token Balances */}
        <NativeBalances />

        {/* Token Balances */}
        <CoinList />
      </div>
    </div>
  );
}
