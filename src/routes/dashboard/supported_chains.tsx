import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { PROTOCOL_NETWORKS } from "../../constants/networks";
import { findChainId, getChainIcon } from "../../utils/chains";

export const Route = createFileRoute("/dashboard/supported_chains")({
  component: SupportedChainsComponent,
});

function SupportedChainsComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8 gap-4">
        <Icon
          icon="heroicons:cube-transparent"
          className="w-12 h-12 text-blue-500"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supported Chains</h1>
          <p className="text-gray-600">
            View all supported blockchain networks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(PROTOCOL_NETWORKS).map(([protocol, networks]) => (
          <div
            key={protocol}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              {getChainIcon(findChainId(protocol) || 0) ? (
                <img
                  src={getChainIcon(findChainId(protocol) || 0)}
                  alt={protocol}
                  className="w-10 h-10"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon
                    icon={`token:${protocol.toLowerCase()}`}
                    className="w-5 h-5 text-gray-400"
                  />
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {protocol}
                </h2>
                {/* <p className="text-sm text-gray-500">
                  {networks.length} Networks
                </p> */}
              </div>
            </div>

            <div className="space-y-2">
              {networks.map((network) => (
                <Link
                  key={`${protocol}-${network}`}
                  to="/dashboard/chains/$chainId"
                  params={{ chainId: String(findChainId(protocol)) }}
                  className="
                    flex items-center justify-between p-3
                    rounded-lg border border-gray-100
                    hover:bg-gray-50 transition-colors
                    group
                  "
                >
                  <span className="text-gray-700 group-hover:text-gray-900">
                    {network[0].toUpperCase() + network.slice(1)}
                  </span>
                  <Icon
                    icon="heroicons:arrow-right"
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                  />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
