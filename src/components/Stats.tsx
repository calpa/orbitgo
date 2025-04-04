import React from "react";

interface StatsProps {
  portfolioData: any;
}

function Stats(props: StatsProps) {
  const { portfolioData } = props;

  return (
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
                const totalValue =
                  portfolioData?.result?.reduce((acc, protocol) => {
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
              })()}
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
              {portfolioData?.result?.reduce(
                (acc, protocol) =>
                  acc +
                  protocol.result.filter((chain) => chain.value_usd > 0).length,
                0
              ) || 0}
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
  );
}

export default Stats;
