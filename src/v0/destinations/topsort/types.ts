import { z } from 'zod';

/** The Events API arrays a RudderStack event can be mapped to. */
export const TOPSORT_EVENT_TYPES = ['impressions', 'clicks', 'purchases'] as const;
export type TopsortEventType = (typeof TOPSORT_EVENT_TYPES)[number];

export const TopsortDestinationConfigSchema = z
  .object({
    apiKey: z.string().min(1),
    // Marketplace-defined mapping from RudderStack event name to Topsort event type.
    topsortEvents: z.array(z.object({ from: z.string(), to: z.string() })).optional(),
  })
  .passthrough();

export const TopsortMessageSchema = z
  .object({
    // The destination only supports track; anything else is dropped with a 400.
    type: z.string(),
    event: z.string(),
    // Every Topsort event id is derived from it, and Topsort dedupes retries on that id.
    messageId: z.string().min(1),
    properties: z.record(z.unknown()),
  })
  .passthrough();

export type TopsortDestinationConfig = z.infer<typeof TopsortDestinationConfigSchema>;
export type TopsortMessage = z.infer<typeof TopsortMessageSchema>;

// Fields plucked by `constructPayload` from the `data/*.json` mappings, e.g. `occurredAt` and
// `opaqueUserId` on an event, `productId` on a placement or purchase item.
type MappedFields = Record<string, unknown>;

type TopsortImpressionOrClick = MappedFields & { id: string; placement: MappedFields };
type TopsortPurchase = MappedFields & { id: string; items: MappedFields[] };

/**
 * One Topsort event, tagged with the request array it belongs in. The tag is read by the batch
 * strategy and never sent.
 */
export type TopsortEvent =
  | { type: 'impressions' | 'clicks'; event: TopsortImpressionOrClick }
  | { type: 'purchases'; event: TopsortPurchase };
