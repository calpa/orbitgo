import { createFileRoute, Link } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { getTokenTransfersByAccount, TokenTransferResponse, getTokenMarketData, TokenMarketData } from "../../../utils";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard/$chainId/$token")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chain, token } = Route.useParams();
  const { address } = useAccount();

  const { data: tokenData } = useQuery<TokenMarketData>({
    queryKey: ["token", token],
    queryFn: () => getTokenMarketData(token),
    enabled: !!token,
  });

  const { data: transfers, isLoading } = useQuery<TokenTransferResponse>({
    queryKey: ["transfers", chain, token, address],
    queryFn: () => getTokenTransfersByAccount(chain, address!, [token]),
    enabled: !!address,
  });

  const { items = [] } = transfers || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            to="/dashboard"
            className="mr-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>

      {tokenData && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start">
            <img src={tokenData.logo} alt={tokenData.name} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{tokenData.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-gray-500 uppercase">{tokenData.symbol}</span>
                <span className="text-gray-500">|</span>
                <div className="flex items-center">
                  <span className="font-medium">
                    ${tokenData.quote.USD.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </span>
                  <span className={`ml-2 ${tokenData.quote.USD.percent_change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tokenData.quote.USD.percent_change_24h >= 0 ? '↑' : '↓'}
                    {Math.abs(tokenData.quote.USD.percent_change_24h).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Market Cap</div>
                  <div className="text-lg font-semibold">
                    ${(tokenData.quote.USD.market_cap / 1e6).toFixed(2)}M
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">24h Volume</div>
                  <div className="text-lg font-semibold">
                    ${(tokenData.quote.USD.volume_24h / 1e6).toFixed(2)}M
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tokenData.description.split('. ')[0]}.
              </p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Token Transfers</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">No transfers found for this token.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((transfer) => (
                <tr key={transfer.transactionHash} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
                    <a
                      href={`https://${chain}.etherscan.io/tx/${transfer.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {transfer.transactionHash.slice(0, 8)}...{transfer.transactionHash.slice(-6)}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.from.slice(0, 8)}...{transfer.from.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.to.slice(0, 8)}...{transfer.to.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(Number(transfer.value) / Math.pow(10, transfer.contract.decimals)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6
                    })}
                    {' '}{transfer.contract.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transfer.timestamp * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
