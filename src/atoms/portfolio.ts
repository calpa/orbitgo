import { atom } from 'jotai';
import { ChainTokenDetails } from '../types/portfolio';

// Atom to store all chain tokens
export const chainTokensAtom = atom<ChainTokenDetails[]>([]);

// Atom to store loading state for each chain
export const chainLoadingAtom = atom<Record<number, boolean>>({});

// Atom to derive whether any chain is loading
export const isLoadingAtom = atom((get) => {
  const loadingStates = get(chainLoadingAtom);
  return Object.values(loadingStates).some((isLoading) => isLoading);
});

// Atom to derive whether all chains have no data
export const hasNoDataAtom = atom((get) => {
  const tokens = get(chainTokensAtom);
  return tokens.length === 0;
});
