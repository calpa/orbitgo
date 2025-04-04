import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { Provider as JotaiProvider } from "jotai";
import "@rainbow-me/rainbowkit/styles.css";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Configure Wagmi
const chains = [mainnet, polygon, optimism, arbitrum, base] as const;

const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <JotaiProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <div className="min-h-screen bg-gray-50">
              <nav className="bg-blue-800 text-white shadow-lg">
                <div className="container mx-auto px-6">
                  <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                      <Link
                        to="/"
                        className="text-xl font-bold"
                        activeProps={{
                          className: "text-xl font-bold text-blue-300",
                        }}
                      >
                        Treasury Management
                      </Link>
                      <div className="flex items-center space-x-4">
                        <Link
                          to="/dashboard"
                          className="hover:text-blue-300 transition-colors"
                          activeProps={{
                            className: "text-blue-300 transition-colors",
                          }}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/chains"
                          className="hover:text-blue-300 transition-colors"
                          activeProps={{
                            className: "text-blue-300 transition-colors",
                          }}
                        >
                          Chains
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
              <Outlet />
            </div>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </JotaiProvider>
  );
}


