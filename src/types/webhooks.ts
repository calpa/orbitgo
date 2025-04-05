import { z } from "zod";
import { PROTOCOL_NETWORKS } from "../constants/networks";

export const protocolSchema = z
  .enum([
    "ethereum",
    "arbitrum",
    "base",
    "optimism",
    "polygon",
    "kaia",
    "luniverse",
    "aptos",
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

export const webhookSchema = z.object({
  address: z.string(),
  webhookUrl: z.string().url(),
  eventType: eventTypeSchema,
  description: z.string().optional(),
  subscriptionId: z.string().optional(),
});

export const createWebhookResponseSchema = z.object({
  message: z.string(),
  subscription: z.object({
    subscriptionId: z.string(),
    description: z.string(),
    eventType: eventTypeSchema,
    notification: z.object({
      webhookUrl: z.string().url(),
    }),
    createdAt: z.string(),
  }),
});

export const webhookNotificationSchema = z.object({
  webhookUrl: z.string().url(),
  signingKey: z.string().optional(),
});

export const webhookConditionSchema = z
  .object({
    addresses: z.array(z.string().regex(/^0x[a-fA-F0-9]{40}$/)),
  })
  .passthrough();

export const createWebhookRequestSchema = z
  .object({
    protocol: protocolSchema,
    network: networkSchema,
    eventType: eventTypeSchema.optional().default("SUCCESSFUL_TRANSACTION"),
    description: z
      .string()
      .optional()
      .default("Webhook for successful transaction"),
    notification: webhookNotificationSchema,
    condition: webhookConditionSchema.default({
      addresses: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"],
    }),
  })
  .superRefine((data, ctx) => {
    const validNetworks = PROTOCOL_NETWORKS[data.protocol];
    if (!validNetworks?.includes(data.network)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["network"],
        message:
          `Network '${data.network}' is not supported for protocol '${data.protocol}'. ` +
          `Supported networks are: ${validNetworks?.join(", ")}`,
      });
      return z.NEVER;
    }
  });

export const webhookResponseSchema = z.object({
  subscriptionId: z.string().uuid(),
  description: z.string(),
  protocol: protocolSchema,
  network: networkSchema,
  eventType: eventTypeSchema,
  notification: webhookNotificationSchema,
  signingKey: z.string(),
  createdAt: z.string().datetime(),
  condition: webhookConditionSchema,
});

export const errorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});

// Infer types from schemas
export type Protocol = z.infer<typeof protocolSchema>;
export type Network = z.infer<typeof networkSchema>;
export type EventType = z.infer<typeof eventTypeSchema>;
export type WebhookNotification = z.infer<typeof webhookNotificationSchema>;
export type WebhookCondition = z.infer<typeof webhookConditionSchema>;
export type CreateWebhookRequest = z.infer<typeof createWebhookRequestSchema>;
export type WebhookResponse = z.infer<typeof webhookResponseSchema>;

export interface StoredWebhook extends WebhookResponse {
  addresses: string[];
}

export interface WebhookList {
  webhooks: StoredWebhook[];
  lastUpdated: string;
}
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
