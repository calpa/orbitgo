import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100">
      <div className="container mx-auto py-6 px-4">
        <Outlet />
      </div>
    </div>
  );
}
