import { Link } from "@tanstack/react-router";

interface CoinProps {
  logoUrl?: string;
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  chain: string;
  address: string;
}

function Coin({
  logoUrl,
  name,
  symbol,
  balance,
  decimals,
  chain,
  address,
}: CoinProps) {
  // Format the balance with appropriate precision
  const formattedBalance = (Number(balance) / 10 ** decimals).toLocaleString(
    undefined,
    { maximumFractionDigits: 6 }
  );

  return (
    <Link
      to="/dashboard/$chain/$token"
      params={{ chain, token: address }}
      className="flex items-center cursor-pointer"
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-12 h-12 mr-3 rounded-full shadow-sm border border-gray-100"
        />
      ) : (
        <div className="w-12 h-12 mr-3 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm border border-indigo-200">
          <span className="text-lg font-bold text-indigo-600">
            {name[0] || symbol[0]}
          </span>
        </div>
      )}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="font-mono font-medium text-indigo-600">{symbol}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-sm font-medium">{formattedBalance}</p>
        </div>
      </div>
    </Link>
  );
}

export default Coin;
