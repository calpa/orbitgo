import { useMemo } from "react";
import { Icon } from "@iconify/react";
import { Spinner } from "./Spinner";
import { Transaction } from "../types";
import { ColDef, themeMaterial } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { getChainName, getChainIcon, getExplorerUrl } from "../utils/chains";
import transactionTypes from "../constants/transactionTypes.json";

interface TransactionTableProps {
  loading: boolean;
  error: string | null;
  transactions: Transaction[];
}

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

function TransactionTable({
  loading,
  error,
  transactions,
}: TransactionTableProps) {
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "timeMs",
        headerName: "Time",
        cellRenderer: (params: any) => {
          return new Date(params.value).toLocaleString();
        },
        sortable: true,
        filter: true,
      },
      {
        field: "details.txHash",
        headerName: "Transaction Hash",
        cellRenderer: (params: any) => {
          const hash = params.value;
          return (
            <a
              href={`${getExplorerUrl(params.data.details.chainId)}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              {hash.substring(0, 8)}...{hash.substring(hash.length - 6)}
            </a>
          );
        },
        sortable: true,
        filter: true,
      },
      {
        field: "details.type",
        headerName: "Type",
        cellRenderer: (params: any) => {
          const type = params.value;
          const typeInfo = transactionTypes.find(
            (t) => t.type.toLowerCase() === type.toLowerCase()
          );
          return (
            <div className="flex items-center space-x-2">
              {typeInfo && (
                <Icon icon={typeInfo.icon} className="w-4 h-4 text-gray-600" />
              )}
              <span className="font-medium">{type}</span>
            </div>
          );
        },
        sortable: true,
        filter: true,
      },
      {
        field: "details.fromAddress",
        headerName: "From",
        cellRenderer: (params: any) => {
          const address = params.value;
          return (
            <a
              href={`${getExplorerUrl(params.data.details.chainId)}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              {address.substring(0, 6)}...
              {address.substring(address.length - 4)}
            </a>
          );
        },
        sortable: true,
        filter: true,
      },
      {
        field: "details.toAddress",
        headerName: "To",
        cellRenderer: (params: any) => {
          const address = params.value;
          return (
            <a
              href={`${getExplorerUrl(params.data.details.chainId)}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              {address.substring(0, 6)}...
              {address.substring(address.length - 4)}
            </a>
          );
        },
        sortable: true,
        filter: true,
      },
      {
        field: "details.status",
        headerName: "Status",
        cellRenderer: (params: any) => {
          const status = params.value;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "completed" || status === "success"
                  ? "bg-green-100 text-green-800"
                  : status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {status[0].toUpperCase() + status.slice(1)}
            </span>
          );
        },
        sortable: true,
        filter: true,
      },
      {
        field: "details.chainId",
        headerName: "Chain",
        cellRenderer: (params: any) => {
          const chainId = params.value;
          const chainName = getChainName(chainId);
          const chainIcon = getChainIcon(chainId);
          return (
            <div className="flex items-center space-x-2">
              {chainIcon && (
                <img src={chainIcon} alt={chainName} className="w-4 h-4" />
              )}
              <span>{chainName}</span>
            </div>
          );
        },
        sortable: true,
        filter: true,
      },
      {
        field: "direction",
        headerName: "Direction",
        cellRenderer: (params: any) => {
          const direction = params.value;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                direction === "in"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {direction[0].toUpperCase() + direction.slice(1)}
            </span>
          );
        },
        sortable: true,
        filter: true,
      },
      {
        field: "details.tokenActions",
        headerName: "Amount",
        cellRenderer: (params: any) => {
          const actions = params.value;
          return (
            <div className="space-y-1 max-w-[300px]">
              {actions.map((action: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 overflow-hidden"
                >
                  <span className="font-medium truncate">
                    {Number(action.amount).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-gray-500 shrink-0">
                    {action.standard}
                  </span>
                  {action.priceToUsd && (
                    <span className="text-gray-500 text-sm shrink-0">
                      ($
                      {Number(action.priceToUsd).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                      )
                    </span>
                  )}
                </div>
              ))}
            </div>
          );
        },
        sortable: false,
        filter: false,
        width: 300,
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No transactions found
      </div>
    );
  }

  return (
    <div className="ag-theme-alpine w-full h-[600px]">
      <AgGridReact
        theme={themeMaterial}
        rowData={transactions}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        enableCellTextSelection={true}
        animateRows={true}
      />
    </div>
  );
}

export default TransactionTable;
