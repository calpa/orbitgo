import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Provider as JotaiProvider } from "jotai";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  celoAlfajores,
} from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Configure Wagmi
const config = getDefaultConfig({
  appName: "Treasury Management",
  projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
  chains: [mainnet, polygon, optimism, arbitrum, base, celoAlfajores],
  ssr: true,
});

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <JotaiProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <div className="min-h-screen bg-gray-50">
              <Outlet />
            </div>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </JotaiProvider>
  );
}
