import { CreateWebhookRequest, WebhookResponse } from "../types/webhooks";

const BASE_URL = "https://treasury-management-backend.calpa.workers.dev/webhooks";

export async function createWebhook(webhook: Partial<CreateWebhookRequest>): Promise<WebhookResponse> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(webhook),
  });

  if (!response.ok) {
    throw new Error("Failed to create webhook");
  }

  return response.json();
}
