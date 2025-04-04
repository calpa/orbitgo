import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import axios from "axios";
import chainData from "../constants/chains.json";
import {
  isEthAddress,
  validateEthAddress,
  type EthAddress,
} from "../utils/ethereum";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { randomDelay } from "../utils/delay";

const INCH_API_URL = "/1inch";
const INCH_API_KEY = import.meta.env.VITE_1INCH_API_KEY;

interface TokenQueryParams {
  addresses: EthAddress;
  chain_id: number;
  closed: boolean;
  closed_threshold: number;
  use_cache: boolean;
}

type QueryParams = TokenQueryParams & {
  headers: {
    Authorization: string;
    Accept: string;
  };
};

interface TokenDetails {
  chain_id: number | null;
  contract_address: string;
  name: string;
  symbol: string;
  amount: number;
  price_to_usd: number;
  value_usd: number;
  abs_profit_usd: number | null;
  roi: number | null;
  status: number;
}

interface ChainTokenDetails extends TokenDetails {
  chainName: string;
  chainIcon: string;
}

interface TokenDetailsResponse {
  result: TokenDetails[];
}

export function PortfolioDetails() {
  const { address } = useAccount();
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<ChainTokenDetails>();

  const columns = [
    columnHelper.accessor(row => `${row.symbol} (${row.name})`, {
      id: 'token',
      header: 'Token',
      cell: info => <span className="font-medium text-gray-100">{info.getValue()}</span>,
    }),
    columnHelper.accessor(row => ({ name: row.chainName, icon: row.chainIcon }), {
      id: 'chain',
      header: 'Chain',
      cell: info => {
        const value = info.getValue();
        return (
          <div className="flex items-center gap-2">
            {value.icon && (
              <img src={value.icon} alt={value.name} className="w-5 h-5" />
            )}
            <span>{value.name}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => info.getValue().toLocaleString("en-US", {
        maximumFractionDigits: 6,
      }),
    }),
    columnHelper.accessor('price_to_usd', {
      header: 'Price (USD)',
      cell: info => info.getValue().toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
    }),
    columnHelper.accessor('value_usd', {
      header: 'Value (USD)',
      cell: info => info.getValue().toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
    }),
    columnHelper.accessor('abs_profit_usd', {
      header: 'Profit/Loss',
      cell: info => {
        const value = info.getValue();
        if (value === null) return <span className="text-gray-300">N/A</span>;
        return value >= 0 ? (
          <span className="text-green-500">
            +{value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ) : (
          <span className="text-red-500">
            {value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        );
      },
    }),
    columnHelper.accessor('roi', {
      header: 'ROI',
      cell: info => {
        const value = info.getValue();
        if (value === null) return <span className="text-gray-300">N/A</span>;
        return value >= 0 ? (
          <span className="text-green-500">+{value.toFixed(2)}%</span>
        ) : (
          <span className="text-red-500">{value.toFixed(2)}%</span>
        );
      },
    }),
  ];

  const { data: tokenDetails, isLoading } = useQuery({
    queryKey: ["tokenDetails", address],
    queryFn: async () => {
      const validAddress = validateEthAddress(address);
      const allTokens: ChainTokenDetails[] = [];

      for (const chain of chainData.result) {
        // Add random delay between requests
        await randomDelay(1, 2);

        try {
          const queryParams: QueryParams = {
            addresses: validAddress,
            chain_id: chain.id,
            closed: true,
            closed_threshold: 1,
            use_cache: true,
            headers: {
              Authorization: `Bearer ${INCH_API_KEY}`,
              Accept: "application/json",
            },
          };

          const response = await axios.get<TokenDetailsResponse>(
            `${INCH_API_URL}/portfolio/portfolio/v4/overview/erc20/details`,
            {
              headers: queryParams.headers,
              params: {
                addresses: queryParams.addresses,
                chain_id: queryParams.chain_id,
                closed: queryParams.closed,
                closed_threshold: queryParams.closed_threshold,
                use_cache: queryParams.use_cache,
              },
            }
          );

          // Add chain name and icon to each token
          const tokensWithChainInfo = response.data.result.map((token) => ({
            ...token,
            chainName: chain.name,
            chainIcon: chain.icon,
          }));

          allTokens.push(...tokensWithChainInfo);
        } catch (error) {
          console.error(
            `Error fetching tokens for chain ${chain.name}:`,
            error
          );
        }
      }

      return {
        result: allTokens,
        meta: {
          cached_at: Date.now(),
        },
      };
    },
    enabled: isEthAddress(address),
    staleTime: 300000, // Consider data fresh for 5 minutes
  });

  const table = useReactTable({
    data: tokenDetails?.result || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!tokenDetails || tokenDetails.result.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-300">No portfolio data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-800 shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-blue-900">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-blue-800 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span>
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-700">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-blue-700 transition-colors"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
