import { Protocol } from "../types";
import { ChainData } from "../constants/chains";

/**
 * Export protocol data to CSV format
 * @param protocols - List of protocols to export
 * @param chainData - Chain data mapping for protocol chain names
 * @param filename - Name of the output CSV file
 */
export function exportProtocolsToCSV(
  protocols: Protocol[],
  chainData: ChainData,
  filename: string = "yield_overview.csv"
) {
  if (protocols.length === 0) return;

  const header = "Protocol,Chain,Contract Address,Value (USD),Holding Time (Days)";
  const csvRows = protocols.map(
    (protocol) =>
      `${protocol.name},${chainData[protocol.chain_id].name},${
        protocol.contract_address
      },${protocol.value_usd.toFixed(2)},${protocol.holding_time_days || 0}`
  );

  const csvContent =
    "data:text/csv;charset=utf-8," +
    encodeURIComponent([header, ...csvRows].join("\n"));

  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", filename);
  link.click();
}
