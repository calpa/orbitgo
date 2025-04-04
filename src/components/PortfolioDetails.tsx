import { japaneseColors } from "../utils/colors";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { ChainTokenDetails } from "../types/portfolio";

interface PortfolioDetailsProps {
  tokens: ChainTokenDetails[];
  isLoading: boolean;
}

export function PortfolioDetails({ tokens, isLoading }: PortfolioDetailsProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<ChainTokenDetails>();

  const columns = [
    columnHelper.accessor((row) => `${row.symbol} (${row.name})`, {
      id: "token",
      header: "Token",
      cell: (info) => (
        <span
          className="font-medium"
          style={{ color: japaneseColors.shinonome }}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor(
      (row) => ({ name: row.chainName, icon: row.chainIcon }),
      {
        id: "chain",
        header: "Chain",
        cell: (info) => {
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
      }
    ),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) =>
        info.getValue().toLocaleString("en-US", {
          maximumFractionDigits: 6,
        }),
    }),
    columnHelper.accessor("price_to_usd", {
      header: "Price (USD)",
      cell: (info) =>
        info.getValue().toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    }),
    columnHelper.accessor("value_usd", {
      header: "Value (USD)",
      cell: (info) =>
        info.getValue().toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    }),
    columnHelper.accessor("abs_profit_usd", {
      header: "Profit/Loss",
      cell: (info) => {
        const value = info.getValue();
        if (value === null)
          return <span style={{ color: japaneseColors.gin }}>N/A</span>;
        return value >= 0 ? (
          <span style={{ color: japaneseColors.midori }}>
            +
            {value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ) : (
          <span style={{ color: japaneseColors.beniaka }}>
            {value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        );
      },
    }),
    columnHelper.accessor("roi", {
      header: "ROI",
      cell: (info) => {
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

  const table = useReactTable({
    data: tokens,
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
        <div
          className="animate-spin rounded-full h-8 w-8 border-2"
          style={{
            borderColor: `${japaneseColors.sora} transparent ${japaneseColors.sora} transparent`,
          }}
        />
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: japaneseColors.gin }}>
          No portfolio data available.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${japaneseColors.konruri} 0%, ${japaneseColors.rurikon} 100%)`,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      className="rounded-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table
          className="min-w-full"
          style={{ borderColor: japaneseColors.kokimurasaki }}
        >
          <thead style={{ background: japaneseColors.konruri }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ color: japaneseColors.shinonome }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span>
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody style={{ borderColor: japaneseColors.kokimurasaki }}>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:opacity-90 transition-opacity"
                style={{
                  borderBottom: `1px solid ${japaneseColors.kokimurasaki}`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-right"
                    style={{ color: japaneseColors.shinonome }}
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
