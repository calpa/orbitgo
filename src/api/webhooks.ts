import axios from "axios";
import { CreateWebhookRequest, WebhookResponse } from "../types/webhooks";

const CREATE_WEBHOOK_URL = `${import.meta.env.VITE_API_URL}/webhook`;

export async function createWebhook(
  webhook: Partial<CreateWebhookRequest>
): Promise<WebhookResponse> {
  const response = await axios.post(CREATE_WEBHOOK_URL, webhook);
  return response.data;
}
