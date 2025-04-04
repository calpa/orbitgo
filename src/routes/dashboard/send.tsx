import { useMemo, useState } from "react";
import { parseUnits } from "viem";
import { celoAlfajores } from "viem/chains";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/send")({
  component: SendPage,
});

import { useAccount, useChainId, useSwitchChain, useWalletClient } from "wagmi";

// Celo USDC 資訊（Testnet）
const usdcToken = "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B";
const usdcAdapter = "0x4822e58de6f5e485eF90df51C41CE01721331dC0";

function SendPage() {
  const [status, setStatus] = useState<string>("");
  const [amount, setAmount] = useState<bigint>(parseUnits("0.01", 6));
  const [toAddress, setToAddress] = useState<string>("");

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const handleSend = async () => {
    try {
      if (!isConnected || !walletClient) {
        setStatus("⚠️ 請先連接錢包");
        return;
      }

      // 切換至 Celo Alfajores (ID: 44787)
      if (chainId !== celoAlfajores.id) {
        await switchChain({ chainId: celoAlfajores.id });
        setStatus("🔄 已切換至 Celo Alfajores");
        return;
      }

      const toAddress = "0x2CebA3600DCB75186567A982C7bd8401fA76Ea7E";
      const amount2 = parseUnits(amount.toString(), 6); // USDC = 6 decimals

      // ERC20 transfer 方法 (abi encoding)
      const methodId = "0xa9059cbb";
      const paddedTo = toAddress.slice(2).padStart(64, "0");
      const paddedAmount = amount2.toString(16).padStart(64, "0");
      const data = methodId + paddedTo + paddedAmount;

      const txHash = await walletClient.sendTransaction({
        account: address!,
        to: usdcToken,
        data,
        type: "0x7b" as const, // CIP-64
        feeCurrency: usdcAdapter,
        gas: 200_000n,
      });

      setStatus(
        `✅ 交易送出！TX Hash: ${txHash}, URL: https://alfajores.celoscan.io/tx/${txHash}`
      );
    } catch (err: any) {
      setStatus(`❌ 錯誤：${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">發送 USDC</h1>

      <div>
        <label htmlFor="toAddress">收件人地址</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="amount">金額</label>
        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          value={amount.toString()}
          onChange={(e) => setAmount(BigInt(e.target.value))}
        />
      </div>

      <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        發送
      </button>

      <input
        type="number"
        className="w-full p-2 border rounded mb-4"
        value={amount.toString()}
        onChange={(e) => setAmount(BigInt(e.target.value))}
      />

      <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        發送交易
      </button>
      <p className="mt-4 text-sm">{status}</p>
    </div>
  );
}
