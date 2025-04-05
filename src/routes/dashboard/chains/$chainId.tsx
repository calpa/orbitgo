import { createFileRoute } from "@tanstack/react-router";
import { getChainIcon, getChainName } from "../../../utils/chains";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Icon } from "@iconify/react";
import axios from "axios";
import { GetTokensOwnedResponse } from "../../../types/chain_details";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/chains/$chainId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chainId } = Route.useParams();
  const { address } = useAccount();

  const { data: tokensOwned, isLoading } = useQuery({
    queryKey: ["tokens", chainId, address],
    queryFn: async () => {
      if (!address) return null;
      // Always use mainnet for the network
      const response = await axios.post<GetTokensOwnedResponse>(
        `${import.meta.env.VITE_API_URL}/token/${getChainName(parseInt(chainId)).toLowerCase()}/mainnet/tokens/owned`,
        {
          accountAddress: address,
          rpp: 100,
        }
      );
      return response.data;
    },
    enabled: !!chainId && !!address,
  });

  if (!chainId) {
    return <div>Invalid Protocol</div>;
  }

  const filteredTokens = tokensOwned?.items.filter((token) => {
    const name = token.contract.name.toLowerCase();
    const symbol = token.contract.symbol.toLowerCase();
    const suspiciousKeywords = [
      "scam",
      "airdrop",
      "phishing",
      "free",
      "claim",
      "www",
      "fake",
      "giveaway",
      "bonus",
      "reward",
      "gift",
      "test",
      "faucet",
      "1000x",
      "100x",
      "moon",
      "presale",
      "pre-sale",
      "whitelist",
      "white-list",
      "https://t.ly/",
      "vercel",
      "cutt.ly",
    ];
    return !suspiciousKeywords.some(
      (keyword) => name.includes(keyword) || symbol.includes(keyword)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8 gap-4">
        <Link
          to="/dashboard/supported_chains"
          className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50"
        >
          <Icon icon="heroicons:arrow-left" className="h-6 w-6" />
        </Link>
        <img
          src={getChainIcon(parseInt(chainId))}
          alt={`${getChainName(parseInt(chainId))} Icon`}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {getChainName(parseInt(chainId))}
          </h2>
          <p className="text-gray-600">View your tokens on mainnet</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Icon
              icon="heroicons:arrow-path"
              className="w-8 h-8 animate-spin text-blue-500"
            />
          </div>
        ) : !tokensOwned?.items.length ? (
          <div className="text-center py-12 text-gray-500">
            No tokens found on this chain
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Number of Token Owned */}
            <div className="text-lg font-semibold text-gray-600 col-span-3">
              Number of Tokens Owned: {filteredTokens?.length || 0}
            </div>

            {filteredTokens?.map((token) => (
              <div
                key={token.contract.address}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  {token.contract.logoUrl ? (
                    <img
                      src={token.contract.logoUrl}
                      alt={token.contract.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-500">
                        {token.contract.symbol[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {token.contract.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {token.contract.symbol}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    Balance:{" "}
                    {Number(token.balance) / 10 ** token.contract.decimals >
                    1000
                      ? (
                          Number(token.balance) /
                          10 ** token.contract.decimals /
                          1000
                        ).toFixed(2) + "k"
                      : (
                          Number(token.balance) /
                          10 ** token.contract.decimals
                        ).toFixed(4)}
                  </p>
                  <p className="truncate">Contract: {token.contract.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
