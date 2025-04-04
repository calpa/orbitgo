import { createFileRoute } from '@tanstack/react-router'
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PortfolioDetails } from '../../../components/PortfolioDetails';
import WelcomeCard from '../../../components/WelcomeCard';
import chainData from '../../../constants/chains.json';
import { japaneseColors } from '../../../utils/colors';
import { validateEthAddress, isEthAddress } from '../../../utils/ethereum';
import { inch1Queue } from '../../../utils/queue';
import type { TokenDetailsResponse } from '../../../types/portfolio';

const INCH_API_URL = '/1inch';
const INCH_API_KEY = import.meta.env.VITE_1INCH_API_KEY;

export const Route = createFileRoute("/dashboard/$chainId/")({
  component: ChainDetailsPage,
  parseParams: (params) => ({
    chainId: params.chainId,
  }),
});

function ChainDetailsPage() {
  const { chainId } = Route.useParams();
  const { address } = useAccount();
  const validAddress = address ? validateEthAddress(address) : undefined;
  const chain = chainData.result.find((c) => c.id === Number(chainId));

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['tokenDetails', chainId, validAddress],
    queryFn: async () => {
      if (!chain || !validAddress) return [];
      
      const response = await inch1Queue.enqueue(() => axios.get<TokenDetailsResponse>(
        `${INCH_API_URL}/portfolio/portfolio/v4/overview/erc20/details`,
        {
          headers: {
            Authorization: `Bearer ${INCH_API_KEY}`,
            Accept: 'application/json',
          },
          params: {
            addresses: validAddress,
            chain_id: chain.id,
            closed: true,
            closed_threshold: 1,
            use_cache: true,
          },
        }
      ));

      return response.data.result.map((token) => ({
        ...token,
        chainName: chain.name,
        chainIcon: chain.icon,
      }));
    },
    enabled: isEthAddress(address) && !!validAddress && !!chain,
  });

  if (!chain) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Invalid chain ID</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <WelcomeCard address={validAddress || "0x0000000000000000000000000000000000000000"} />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img src={chain.icon} alt={chain.name} className="w-8 h-8" />
        <h1
          className="text-2xl font-bold"
          style={{ color: japaneseColors.shinonome }}
        >
          {chain.name} Portfolio
        </h1>
      </div>

      <div className="mb-8">
        <PortfolioDetails tokens={tokens} isLoading={isLoading} />
      </div>
    </div>
  );
}
