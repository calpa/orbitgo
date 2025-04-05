import { createFileRoute } from "@tanstack/react-router";
import { getChainIcon, getChainName } from "../../../utils/chains";

export const Route = createFileRoute("/dashboard/chains/$chainId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chainId } = Route.useParams();

  if (!chainId) {
    return <div>Invalid Chain ID</div>;
  }

  return (
    <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md">
      <img
        src={getChainIcon(parseInt(chainId))}
        alt={`${getChainName(parseInt(chainId))} Icon`}
        className="w-16 h-16 mr-4"
      />
      <h2 className="text-2xl font-bold text-gray-800">
        {getChainName(parseInt(chainId))}
      </h2>
    </div>
  );
}
