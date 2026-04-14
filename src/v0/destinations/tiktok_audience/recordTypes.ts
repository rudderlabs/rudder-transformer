import { z } from 'zod';
import { RouterTransformationResponse } from '../../../types';

const TiktokAudienceDestinationSchema = z
  .object({
    ID: z.string(),
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
    workspaceId: z.string(),
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

export type ProcessTiktokAudienceRecordsResponse = {
  failedResponses: RouterTransformationResponse[];
  successfulResponses: RouterTransformationResponse[];
};

export type Identifier = {
  id: string;
  audience_ids: string[];
};

export type IdentifiersPayload = {
  event: TiktokAudienceRecordRequest;
  batchIdentifiers: Identifier[];
  idSchema: string[];
  advertiserId: string;
  action: string;
};

export type SegmentMappingPayload = {
  batch_data: Identifier[][];
  id_schema: string[];
  advertiser_ids: string[];
  action: string;
};

export type TiktokAudienceRecordRequest = z.infer<typeof TiktokAudienceRecordRouterRequestSchema>;
