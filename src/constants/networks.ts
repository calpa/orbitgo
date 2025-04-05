import { Protocol } from "../types/webhooks";

export const PROTOCOL_NETWORKS: Record<Protocol, string[]> = {
  // aptos: ["mainnet"],
  arbitrum: ["mainnet"],
  base: ["mainnet"],
  ethereum: ["mainnet"],
  kaia: ["mainnet"],
  optimism: ["mainnet"],
  polygon: ["mainnet"],
  // luniverse: ['mainnet']
} as const;

export function getValidNetworksForProtocol(protocol: Protocol): string[] {
  return PROTOCOL_NETWORKS[protocol] || [];
}

export function isValidNetworkForProtocol(
  protocol: Protocol,
  network: string
): boolean {
  return PROTOCOL_NETWORKS[protocol]?.includes(network) || false;
}
