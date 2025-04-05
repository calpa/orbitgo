import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "@iconify/react";

export const Route = createFileRoute("/dashboard/notifications/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="mt-2 text-gray-600">
                Set up webhooks to monitor your portfolio activity
              </p>
            </div>
            <Icon icon="heroicons:bell" className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
