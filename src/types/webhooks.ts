import { z } from "zod";
import { PROTOCOL_NETWORKS } from "../constants/networks";

// Protocol schema
export const protocolSchema = z
  .enum([
    "ethereum",
    "arbitrum",
    "base",
    "optimism",
    "polygon",
    "kaia",
    // "luniverse",
    // "aptos",
  ])
  .default("ethereum");

// Create a union of all possible networks
const allNetworks = [
  ...new Set(Object.values(PROTOCOL_NETWORKS).flat()),
] as const;

// Network schema with runtime validation
export const networkSchema = z
  .enum(allNetworks as unknown as [string, ...string[]])
  .default("mainnet");

// Event type schema
export const eventTypeSchema = z.enum([
  "ADDRESS_ACTIVITY",
  "MINED_TRANSACTION",
  "SUCCESSFUL_TRANSACTION",
  "FAILED_TRANSACTION",
  "TOKEN_TRANSFER",
  "BELOW_THRESHOLD_BALANCE",
  "BLOCK_PERIOD",
  "BLOCK_LIST_CALLER",
  "ALLOW_LIST_CALLER",
  "LOG",
  "EVENT",
]);

// Basic types
export type Protocol = z.infer<typeof protocolSchema>;
export type Network = z.infer<typeof networkSchema>;
export type EventType = z.infer<typeof eventTypeSchema>;

// Schema for creating a new webhook
export const createWebhookSchema = z.object({
  addresses: z.array(z.string()),
  webhookUrl: z.string().url(),
});

export type CreateWebhookRequest = z.infer<typeof createWebhookSchema>;

// Schema for webhook response
export const webhookResponseSchema = z.object({
  id: z.string(),
  addresses: z.array(z.string()),
  webhookUrl: z.string().url(),
  createdAt: z.string(),
});

export type WebhookResponse = z.infer<typeof webhookResponseSchema>;

// Schema for list of webhooks
export const webhookListSchema = z.array(webhookResponseSchema);

export type WebhookList = z.infer<typeof webhookListSchema>;

// Schema for error responses
export const errorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export interface StoredWebhook extends WebhookResponse {
  addresses: string[];
}
