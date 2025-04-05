import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { WebhookList as WebhookListType } from "../../types/webhooks";
import axios from "axios";
import { useAccount } from "wagmi";
import { AgGridReact } from "ag-grid-react";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { getChainIcon, findChainId } from "../../utils/chains";

async function fetchWebhooks(): Promise<WebhookListType> {
  const response = await axios.get<WebhookListType>(
    "https://treasury-management-backend.calpa.workers.dev/webhook/webhooks"
  );
  return response.data;
}

const ActionsCellRenderer = (props: any) => {
  return (
    <div className="flex items-center gap-2">
      <button
        className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50"
        title="Edit webhook"
        onClick={() => props.onEdit(props.data)}
      >
        <Icon icon="heroicons:pencil-square" className="h-5 w-5" />
      </button>
      <button
        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50"
        title="Delete webhook"
        onClick={() => props.onDelete(props.data)}
      >
        <Icon icon="heroicons:trash" className="h-5 w-5" />
      </button>
    </div>
  );
};

const StatusCellRenderer = (props: any) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${props.value ? "bg-green-500" : "bg-red-500"}`}
      />
      <span>{props.value ? "Active" : "Inactive"}</span>
    </div>
  );
};

export function WebhookList() {
  const { address } = useAccount();

  const { data, isLoading, error } = useQuery({
    queryKey: ["webhooks", address],
    queryFn: fetchWebhooks,
  });

  const columnDefs: ColDef[] = [
    {
      field: "protocol",
      headerName: "Protocol",
      width: 120,
      cellRenderer: (params: ValueFormatterParams) => {
        const chainId = findChainId(params.value as string);
        const chainIcon = getChainIcon(chainId!);
        return (
          <div className="flex items-center gap-2">
            {chainIcon && (
              <img src={chainIcon} alt={params.value} className="w-5 h-5" />
            )}
            <span>
              {params.value?.charAt(0).toUpperCase() + params.value?.slice(1)}
            </span>
          </div>
        );
      },
    },
    {
      field: "network",
      headerName: "Network",
      width: 120,
      valueFormatter: (params: ValueFormatterParams) =>
        params.value?.charAt(0).toUpperCase() + params.value?.slice(1),
    },
    {
      field: "notification.webhookUrl",
      headerName: "Webhook URL",
      flex: 1,
    },
    {
      field: "eventType",
      headerName: "Event Type",
      width: 200,
      cellRenderer: (params: ValueFormatterParams) => {
        const formattedValue = params.value
          ?.split("_")
          .map((word: string) => word.charAt(0) + word.slice(1).toLowerCase())
          .join(" ");

        if (formattedValue?.toLowerCase() === "successful transaction") {
          return (
            <div className="flex items-center">
              <Icon
                icon="heroicons:check-circle-solid"
                className="w-5 h-5 text-green-500 mr-2 bg-green-100 rounded-full"
              />
              {formattedValue}
            </div>
          );
        }
        return formattedValue;
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 120,
      valueFormatter: (params: ValueFormatterParams) =>
        new Date(params.value).toLocaleDateString(),
    },
    {
      headerName: "Status",
      width: 100,
      cellRenderer: StatusCellRenderer,
      valueGetter: () => true,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icon
          icon="heroicons:arrow-path"
          className="h-8 w-8 text-blue-500 animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Icon
          icon="heroicons:exclamation-circle"
          className="h-12 w-12 text-red-500 mb-4"
        />
        <h3 className="text-lg font-semibold text-gray-900">
          Failed to load webhooks
        </h3>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  if (!data?.webhooks?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Icon
          icon="heroicons:bell-slash"
          className="h-12 w-12 text-gray-400 mb-4"
        />
        <h3 className="text-lg font-semibold text-gray-900">
          No webhooks found
        </h3>
        <p className="text-gray-600 mb-4">
          Create your first webhook to get started
        </p>
        <Link
          to="/dashboard/notifications/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon icon="heroicons:plus-circle" className="h-5 w-5" />
          Create Webhook
        </Link>
      </div>
    );
  }

  return (
    <div
      className="ag-theme-alpine w-full h-[600px] rounded-lg overflow-hidden"
      style={
        {
          "--ag-background-color": "#fff",
          "--ag-border-color": "#e5e7eb",
          "--ag-row-hover-color": "#f3f4f6",
          "--ag-header-background-color": "#f9fafb",
          "--ag-odd-row-background-color": "#fff",
        } as any
      }
    >
      <AgGridReact
        rowData={data.webhooks}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
        animateRows={true}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
}
