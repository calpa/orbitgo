import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "../components/Sidebar";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100 flex flex-row md:mt-[80px]">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      <div className="container mx-auto py-6 px-4">
        <Outlet />
      </div>
    </div>
  );
}
