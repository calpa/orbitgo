import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { WebhookList } from "../../../components/webhooks/WebhookList";

export const Route = createFileRoute("/dashboard/notifications/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-2 text-gray-600">
              Set up webhooks to monitor your portfolio activity
            </p>
          </div>
          <Link
            to="/dashboard/notifications/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon icon="heroicons:plus-circle" className="h-5 w-5" />
            Create Webhook
          </Link>
        </div>

        <WebhookList />
      </div>
    </div>
  );
}
