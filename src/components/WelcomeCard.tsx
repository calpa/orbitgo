import { useEnsAvatar, useEnsName } from "wagmi";

interface WelcomeCardProps {
  address: `0x${string}`;
}

function WelcomeCard(props: WelcomeCardProps) {
  const { address } = props;

  const { data: ensName } = useEnsName({ address });
  const formattedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
  const displayName = typeof ensName === "string" ? ensName : formattedAddress;
  const { data: ensAvatar } = useEnsAvatar({
    name: typeof ensName === "string" ? ensName : undefined,
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100 transform transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">OrbitGo</h2>
          <p className="text-gray-600">
            Welcome{" "}
            <span className="font-mono text-sm bg-blue-50 p-1.5 rounded border border-blue-100">
              {displayName}
            </span>
          </p>
        </div>

        {/* ENS Avatar if Any, otherwise show placeholder */}
        <div className="hidden md:block">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            {ensAvatar ? (
              <img
                src={ensAvatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-teal-600 opacity-80 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeCard;
