import { useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSetAtom } from "jotai";
import { addressAtom, resetBalancesAtom } from "../atoms";

const Header = () => {
  const { address } = useAccount();
  const resetBalances = useSetAtom(resetBalancesAtom);
  // Set address in atom and reset balances when account changes
  const setAddress = useSetAtom(addressAtom);

  useEffect(() => {
    // When address changes, update the addressAtom and reset balances
    if (address) {
      setAddress(address);
      resetBalances();
    } else {
      setAddress(null);
      resetBalances();
    }
  }, [address, setAddress, resetBalances]);

  return (
    <header className="p-4 bg-white shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">OrbitGO</h1>
        <ConnectButton />
      </div>
      {address && (
        <div className="mt-2 text-sm text-gray-600">
          Connected Account: {address}
        </div>
      )}
    </header>
  );
};

export default Header;
