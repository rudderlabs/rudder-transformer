import { z } from 'zod';

/**
 * The three arrays the Events API accepts. Each is capped independently, so they
 * double as the batching framework's group key.
 */
export type TopsortEventType = 'impressions' | 'clicks' | 'purchases';

export type TopsortPayload = Record<string, unknown>;

export const TopsortDestinationConfigSchema = z
  .object({
    apiKey: z.string().min(1),
    // Marketplace-defined mapping from RudderStack event name to Topsort event type.
    topsortEvents: z.array(z.object({ from: z.string(), to: z.string() }).passthrough()).optional(),
  })
  .passthrough();

export const TopsortMessageSchema = z
  .object({
    // The destination only supports track; anything else is dropped with a 400.
    type: z.string(),
    event: z.string(),
    properties: z.record(z.unknown()),
  })
  .passthrough();
