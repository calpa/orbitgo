import { Protocol } from '../types/webhook';

export const PROTOCOL_NETWORKS: Record<Protocol, string[]> = {
  aptos: ['mainnet', 'testnet'],
  arbitrum: ['mainnet', 'sepolia'],
  base: ['mainnet', 'sepolia'],
  ethereum: ['mainnet', 'sepolia', 'holesky'],
  kaia: ['mainnet', 'kairos'],
  optimism: ['mainnet', 'sepolia'],
  polygon: ['mainnet', 'amoy'],
  luniverse: ['mainnet']
} as const;

export function getValidNetworksForProtocol(protocol: Protocol): string[] {
  return PROTOCOL_NETWORKS[protocol] || [];
}

export function isValidNetworkForProtocol(protocol: Protocol, network: string): boolean {
  return PROTOCOL_NETWORKS[protocol]?.includes(network) || false;
}
