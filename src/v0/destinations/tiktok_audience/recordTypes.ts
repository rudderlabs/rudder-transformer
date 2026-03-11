import { z } from 'zod';

const TiktokAudienceDestinationSchema = z
  .object({
    Config: z
      .object({
        advertiserId: z.string(),
      })
      .passthrough(),
  })
  .passthrough();

const TiktokAudienceConnectionSchema = z
  .object({
    config: z
      .object({
        destination: z
          .object({
            isHashRequired: z.boolean(),
            audienceId: z.string(),
          })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

const TiktokAudienceMessageSchema = z
  .object({
    type: z.enum(['record'], {
      required_error: 'message Type is not present. Aborting message.',
    }),
    action: z.enum(['insert', 'delete', 'update'], {
      required_error: 'action is not present. Aborting message.',
    }),
    userId: z.string().optional(),
    identifiers: z.record(z.string(), z.string().nullable()),
    fields: z.record(z.string(), z.string().nullable()),
  })
  .passthrough();

const TiktokAudienceMetadataSchema = z
  .object({
    secret: z
      .object({
        accessToken: z.string(),
      })
      .passthrough(),
  })
  .passthrough();

export const TiktokAudienceRecordRouterRequestSchema = z
  .object({
    message: TiktokAudienceMessageSchema,
    destination: TiktokAudienceDestinationSchema,
    connection: TiktokAudienceConnectionSchema,
    metadata: TiktokAudienceMetadataSchema,
  })
  .passthrough();

export type TiktokAudienceRecordRequest = z.infer<typeof TiktokAudienceRecordRouterRequestSchema>;
