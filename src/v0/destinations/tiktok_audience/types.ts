import { z } from 'zod';
import { RouterTransformationRequestData, Destination, Connection, Metadata } from '../../../types';

export const TiktokAudienceDestinationConfigSchema = z
  .object({
    isHashRequired: z.boolean().optional(),
  })
  .passthrough();
export const TiktokAudienceMessageSchema = z
  .object({
    type: z.literal('audiencelist').optional(),
    anonymousId: z.string().optional(),
    properties: z
      .object({
        listData: z.record(z.array(z.record(z.string(), z.string()))).optional(),
      })
      .optional(),
    context: z
      .object({
        destinationFields: z.string().optional(),
        externalId: z
          .array(
            z.object({
              type: z.string(),
            }),
          )
          .optional(),
      })
      .optional(),
  })
  .passthrough();

export type TiktokAudienceMessage = z.infer<typeof TiktokAudienceMessageSchema>;
export type TiktokAudienceDestinationConfig = z.infer<typeof TiktokAudienceDestinationConfigSchema>;
export type TiktokAudienceDestination = Destination<TiktokAudienceDestinationConfig>;
export type TiktokAudienceMetadata = Metadata & {
  secret: {
    advertiserIds: string[];
    accessToken: string;
  };
};
export type TiktokAudienceRequest = RouterTransformationRequestData<
  TiktokAudienceMessage,
  TiktokAudienceDestination,
  Connection,
  TiktokAudienceMetadata
>;
