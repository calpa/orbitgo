import { createFileRoute } from "@tanstack/react-router";
import chainData from "../../constants/chains.json";

export const Route = createFileRoute("/chains/")({
  component: ChainsPage,
});

function ChainsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Supported Chains</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chainData.result.map((chain) => (
            <div
              key={chain.id}
              className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex-shrink-0">
                <img
                  src={chain.icon}
                  alt={chain.name}
                  className="w-12 h-12"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{chain.name}</h2>
                <p className="text-gray-500">Chain ID: {chain.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
