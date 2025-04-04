import { Protocol } from "../types";

/**
 * Sort options for protocol list
 */
export type SortOption =
  | "roi_desc"
  | "roi_asc"
  | "value_desc"
  | "value_asc"
  | "time_desc"
  | "time_asc"
  | "name_desc"
  | "name_asc";

/**
 * Sort protocols based on the specified sort option
 * @param a - First protocol to compare
 * @param b - Second protocol to compare
 * @param sortOption - Sort option to determine sorting order
 * @returns Comparison result (-1, 0, or 1)
 */
export function sortProtocols(a: Protocol, b: Protocol, sortOption: SortOption): number {
  switch (sortOption) {
    case "roi_desc":
      return ((b.info?.weighted_apr || 0) + (b.info?.roi || 0)) - ((a.info?.weighted_apr || 0) + (a.info?.roi || 0));
    case "roi_asc":
      return ((a.info?.weighted_apr || 0) + (a.info?.roi || 0)) - ((b.info?.weighted_apr || 0) + (b.info?.roi || 0));
    case "value_desc":
      return (b.value_usd || 0) - (a.value_usd || 0);
    case "value_asc":
      return (a.value_usd || 0) - (b.value_usd || 0);
    case "time_desc":
      return (b.holding_time_days || 0) - (a.holding_time_days || 0);
    case "time_asc":
      return (a.holding_time_days || 0) - (b.holding_time_days || 0);
    case "name_desc":
      return (b.name || "").localeCompare(a.name || "");
    case "name_asc":
      return (a.name || "").localeCompare(b.name || "");
    default:
      return 0;
  }
}

/**
 * Filter protocols by chain ID
 * @param protocols - Array of protocols to filter
 * @param chainId - Chain ID to filter by, if undefined returns all protocols
 * @returns Filtered array of protocols
 */
export function filterProtocolsByChain(protocols: Protocol[], chainId?: number): Protocol[] {
  if (!chainId) return protocols;
  return protocols.filter(protocol => protocol.chain_id === chainId);
}

/**
 * Process protocol data by filtering and sorting
 * @param protocols - Raw protocol data to process
 * @param sortOption - Option to sort protocols by
 * @param chainId - Optional chain ID to filter protocols
 * @returns Processed protocol array
 */
export function processProtocols(
  protocols: Protocol[],
  sortOption: SortOption,
  chainId?: number,
  hideZeroValue: boolean = true
): Protocol[] {
  let filtered = filterProtocolsByChain(protocols, chainId);
  if (hideZeroValue) {
    filtered = filtered.filter((protocol) => protocol.value_usd > 0);
  }
  return filtered.sort((a, b) => sortProtocols(a, b, sortOption));
}
