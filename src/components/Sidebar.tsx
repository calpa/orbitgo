import { Link } from "@tanstack/react-router";

function Sidebar() {
  return (
    <div className="bg-white shadow-md min-h-screen">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col space-y-4">
          <Link
            to="/dashboard"
            className="text-xl font-bold"
            activeProps={{ className: "text-red-500" }}
          >
            Dashboard
          </Link>
          {/* Notifications */}
          <Link
            to="/dashboard/notifications"
            className="text-xl font-bold"
            activeProps={{ className: "text-red-500" }}
          >
            Notifications
          </Link>

          <Link
            to="/dashboard/transactions"
            className="text-xl font-bold"
            activeProps={{ className: "text-red-500" }}
          >
            Transactions
          </Link>
          {/* DApps */}
          <Link
            to="/dashboard/yields"
            className="text-xl font-bold"
            activeProps={{ className: "text-red-500" }}
          >
            DApps
          </Link>
          <Link
            to="/dashboard/supported_chains"
            className="text-xl font-bold"
            activeProps={{
              className: "text-red-500",
            }}
          >
            Token Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
