import { z } from 'zod';

// Base schemas for batch item and source that can be extended
export const HydrationEventSchema = z.object({}).passthrough();

export const HydrationBatchItemSchema = z
  .object({
    event: HydrationEventSchema,
  })
  .passthrough();

export const HydrationSourceSchema = z
  .object({
    id: z.string().optional(),
    workspaceId: z.string().optional(),
  })
  .passthrough();

export const SourceHydrationRequestSchema = z.object({
  batch: z.array(HydrationBatchItemSchema),
  source: HydrationSourceSchema,
});

export type SourceHydrationRequest = z.infer<typeof SourceHydrationRequestSchema>;

export type SourceHydrationOutput = {
  batch: (SourceHydrationRequest['batch'][number] & { statusCode: number })[];
};
