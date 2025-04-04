import { atom } from 'jotai';
import { getTokensOwnedByAccountResponse } from './types';
import { Address } from 'viem';

// Type for the balances state
export interface BalancesState {
  [chain: string]: getTokensOwnedByAccountResponse;
}

// Main atoms
export const balancesAtom = atom<BalancesState>({});
export const loadingAtom = atom<boolean>(false);
export const addressAtom = atom<Address | null>(null);

// Derived atoms
export const hasBalancesAtom = atom((get) => {
  const balances = get(balancesAtom);
  return Object.keys(balances).length > 0;
});

// Action atoms
export const refreshChainBalanceAtom = atom(
  null,
  async (_, set, { chain, address, fetchFn }: { chain: string; address: Address; fetchFn: (chain: string, address: Address) => Promise<getTokensOwnedByAccountResponse> }) => {
    try {
      set(loadingAtom, true);
      const data = await fetchFn(chain, address);
      
      // Update the balances atom with the new data for this chain
      set(balancesAtom, (prev) => ({
        ...prev,
        [chain]: data,
      }));
      
      return data;
    } catch (error) {
      console.error(`Error refreshing ${chain} data:`, error);
      throw error;
    } finally {
      set(loadingAtom, false);
    }
  }
);

// Reset atom to clear all state
export const resetBalancesAtom = atom(
  null,
  (_, set) => {
    set(balancesAtom, {});
    set(loadingAtom, false);
  }
);
