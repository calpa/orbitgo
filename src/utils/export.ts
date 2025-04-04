import { Protocol } from "../types";
import type { ChainData } from "../constants/chains";
import { exportToCSV } from "./csv";

/**
 * Export protocol data to CSV format
 * @param protocols List of protocols to export
 * @param chainData Chain information for resolving chain names
 */
export function exportProtocolsToCSV(protocols: Protocol[], chainData: ChainData) {
  exportToCSV<Protocol>({
    headers: ["Protocol", "Chain", "Value (USD)", "ROI", "APR"],
    rowTransformer: (protocol: Protocol) => [
      protocol.name,
      chainData[protocol.chain_id]?.name || protocol.chain_id.toString(),
      protocol.value_usd.toString(),
      (protocol.roi || 0).toString(),
      (protocol.info.weighted_apr || 0).toString(),
    ],
    data: protocols,
    filename: `protocols_${new Date().toISOString()}`,
  });
}
