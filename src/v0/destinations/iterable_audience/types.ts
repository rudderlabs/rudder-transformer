import { z } from 'zod';

import {
  Destination,
  Metadata,
  RouterTransformationRequestData,
  RudderRecordV2Schema,
} from '../../../types';

export const IterableAudienceDestinationConfigSchema = z
  .object({
    apiKey: z.string().min(1),
    dataCenter: z.string().optional(),
    listId: z.union([z.string().regex(/^\d+$/), z.number().int().nonnegative()]),
    projectType: z.enum(['email_based', 'hybrid', 'userId_based']),
  })
  .passthrough();

export type IterableAudienceDestinationConfig = z.infer<
  typeof IterableAudienceDestinationConfigSchema
>;

export const IterableAudienceMessageSchema = RudderRecordV2Schema.extend({
  identifiers: z.record(z.string().min(1), z.union([z.string(), z.number()])),
});

export type IterableAudienceMessage = z.infer<typeof IterableAudienceMessageSchema>;

export type IterableAudienceDestination = Destination<IterableAudienceDestinationConfig>;

export type IterableAudienceRouterRequest = RouterTransformationRequestData<
  IterableAudienceMessage,
  IterableAudienceDestination
>;

export type IterableAudienceRespList = {
  payload: {
    subscribers: Array<{ email: string } | { userId: string }>;
  };
  metadata: Partial<Metadata>;
};

export type IterableAudienceRequestBuildResult = {
  endpointPath: string;
  payload: { email: string } | { userId: string };
  metadata: Partial<Metadata>;
};
