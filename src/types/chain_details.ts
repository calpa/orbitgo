import { z } from "zod";

// Token Schemas
export const tokenContractSchema = z.object({
  address: z.string(),
  deployedTransactionHash: z.string(),
  deployedAt: z.string(),
  deployerAddress: z.string(),
  logoUrl: z.string().nullable(),
  type: z.string(),
  name: z.string(),
  symbol: z.string(),
  totalSupply: z.string(),
  decimals: z.number(),
});

export const tokenBalanceSchema = z.object({
  ownerAddress: z.string(),
  balance: z.string(),
  contract: tokenContractSchema,
});

export const getTokensOwnedRequestSchema = z.object({
  accountAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  contractAddresses: z
    .array(z.string().regex(/^0x[a-fA-F0-9]{40}$/))
    .optional(),
  page: z.number().min(1).max(100).optional(),
  rpp: z.number().min(1).max(1000).optional(),
  cursor: z.string().optional(),
  withCount: z.boolean().optional().default(false),
});

export const getTokensOwnedResponseSchema = z.object({
  page: z.number().optional(),
  rpp: z.number(),
  cursor: z.string().optional(),
  count: z.number().optional(),
  items: z.array(tokenBalanceSchema),
});

export type TokenContract = z.infer<typeof tokenContractSchema>;
export type TokenBalance = z.infer<typeof tokenBalanceSchema>;
export type GetTokensOwnedRequest = z.infer<typeof getTokensOwnedRequestSchema>;
export type GetTokensOwnedResponse = z.infer<
  typeof getTokensOwnedResponseSchema
>;
