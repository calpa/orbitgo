import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { createFileRoute } from "@tanstack/react-router";
import orbitgoLogo from "../assets/orbit_go.svg";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: OrbitGOLandingPage,
});

function OrbitGOLandingPage() {
  const { isConnected } = useAccount();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate({ to: "/dashboard" });
    }
  }, [isConnected, navigate]);

  return (
    <div className="min-h-[300vh] bg-gradient-to-tr from-indigo-100 via-blue-50 to-white text-gray-800 bg-fixed bg-no-repeat bg-cover">
      <main className="py-10 space-y-32">
        <section className="text-center space-y-6 min-h-screen flex flex-col justify-center">
          <div className="flex justify-center flex-row items-center">
            <img src={orbitgoLogo} alt="OrbitGO Logo" className="w-64" />
            <div
              className="text-5xl font-bold"
              style={{
                color: "#3B82F6",
              }}
            >
              Orbit GO
            </div>
          </div>
          <p className="text-lg max-w-2xl mx-auto">
            OrbitGO is a permissionless, plug-and-play multichain treasury
            dashboard for Web3 treasury managers. Real-time visualizations,
            yield tracking, and cross-chain insights—all in one place.
          </p>
          <div className="mt-4 mx-auto">
            <ConnectButton label="Let's Go!" />
          </div>

          <div className="relative w-full overflow-hidden bg-gradient-to-r from-transparent via-white/10 to-transparent py-8 backdrop-blur-sm max-w-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20" />
            <motion.div
              className="flex gap-16 w-max"
              animate={{
                x: ["-15%", "-85%"],
              }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[
                "token:ethereum",
                "token:arbitrum",
                "token:polygon",
                "token:base",
                "token:optimism",
                "token:bnb",
                "token:avalanche",
                "token:ethereum",
                "token:arbitrum",
                "token:polygon",
                "token:base",
                "token:optimism",
                "token:bnb",
                "token:avalanche",
                "token:ethereum",
                "token:arbitrum",
                "token:polygon",
                "token:base",
                "token:optimism",
                "token:bnb",
                "token:avalanche",
                "token:ethereum",
                "token:arbitrum",
                "token:polygon",
                "token:base",
                "token:optimism",
                "token:bnb",
                "token:avalanche",
              ].map((icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2, y: -5 }}
                  className="relative group"
                >
                  <motion.div
                    className="absolute -inset-2 rounded-full bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Icon
                    icon={icon}
                    className="h-12 w-12 text-gray-700 relative z-10 transition-colors duration-300 group-hover:text-blue-500"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {isConnected && (
            <p className="mt-6 text-sm text-gray-500 animate-pulse">
              Connected! Redirecting to dashboard...
            </p>
          )}
        </section>

        <section className="grid md:grid-cols-3 gap-6 min-h-screen items-center">
          <div className="rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="p-6 space-y-4">
              <Icon icon="mdi:sparkles" className="text-blue-600 w-8 h-8" />
              <h3 className="text-xl font-semibold">Easy to Use</h3>
              <p>
                No registration. No setup. Just connect your wallet and start
                monitoring your DAO treasury instantly.
              </p>
            </div>
          </div>

          <div className="rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="p-6 space-y-4">
              <Icon
                icon="mdi:wallet-outline"
                className="text-blue-600 w-8 h-8"
              />
              <h3 className="text-xl font-semibold">Permissionless</h3>
              <p>
                100% on-chain data, no approvals required. Open, transparent,
                and free to use.
              </p>
            </div>
          </div>

          <div className="rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="p-6 space-y-4">
              <Icon icon="mdi:web" className="text-blue-600 w-8 h-8" />
              <h3 className="text-xl font-semibold">Web3 Culture</h3>
              <p>
                We embrace memes, open-source values, and onchain authenticity.
                Built for the culture.
              </p>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex flex-col justify-center items-center text-center space-y-6">
          <Icon icon="mdi:grid-large" className="w-10 h-10 text-blue-600" />
          <h3 className="text-3xl font-bold">Infinite Protocol Support</h3>
          <p className="max-w-xl text-lg">
            OrbitGO seamlessly integrates with major DeFi protocols across
            Ethereum, Arbitrum, Base, zkSync, and more. Your assets, tracked
            everywhere.
          </p>
        </section>
      </main>

      <footer className="mt-20 py-6 text-center text-sm text-gray-500">
        Made with ❤️ at ETHGlobal Taipei · Built onchain · calpaliu.eth
      </footer>
    </div>
  );
}
