import chains from "../constants/chains.json";
import explorers from "../constants/explorers.json";
import { ChainItem } from "../types";

export function findChain(chainId: number): ChainItem | undefined {
  return chains.result.find((c) => c.id === chainId);
}

export function findChainId(chainName: string): number | undefined {
  return chains.result.find(
    (c) => c.name.toLocaleLowerCase() === chainName.toLocaleLowerCase()
  )?.id;
}

export function getChainName(chainId: number): string {
  const chain = chains.result.find((c) => c.id === chainId);
  return chain?.name || `Chain ${chainId}`;
}

export function getChainIcon(chainId: number): string | undefined {
  const chain = chains.result.find((c) => c.id === chainId);
  return chain?.icon;
}

export function getExplorerUrl(chainId: number): string {
  const explorer = explorers.result.find((e) => e.chainId === chainId);
  return explorer?.url || "https://bscscan.com";
}
