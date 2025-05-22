import { z } from 'zod';

import {
  Connection,
  Destination,
  DestinationConnectionConfig,
  Metadata,
  RouterTransformationRequestData,
  RudderRecordV2Schema,
  RudderRecordV2,
} from '../../../types';
import { RecordAction } from '../../../types/rudderEvents';

import {
  BatchedRequest,
  BatchedRequestBody,
  BatchRequestOutput,
} from '../../../types/destinationTransformation';

// Basic response type for audience list operations
export type RespList = {
  payload: {
    ids: (string | number)[];
  };
  metadata: Partial<Metadata>;
};

// Types for API request components
export type SegmentationPayload = {
  ids: (string | number)[];
};

export type SegmentationParam = {
  id_type: string;
};

export type SegmentationHeaders = {
  'Content-Type': string;
  Authorization: string;
};

// We use RudderRecordV2's action type directly

export const CustomerIODestinationConfigSchema = z
  .object({
    apiKey: z.string(),
    appApiKey: z.string(),
    siteId: z.string(),
  })
  .passthrough();

// CustomerIO specific configuration types
export type CustomerIODestinationConfig = z.infer<typeof CustomerIODestinationConfigSchema>;

export const CustomerIOConnectionConfigSchema = z
  .object({
    audienceId: z.union([z.string().nonempty(), z.number()]),
    identifierMappings: z.array(z.object({ from: z.string(), to: z.string() })).nonempty(),
  })
  .passthrough();

export type CustomerIOConnectionConfig = z.infer<typeof CustomerIOConnectionConfigSchema>;

// Message type specific to CustomerIO, based on RudderRecordV2Schema
export const CustomerIOMessageSchema = RudderRecordV2Schema.extend({
  // Override the identifiers field with CustomerIO-specific validation
  // For CustomerIO, identifiers is required and must contain exactly one identifier
  identifiers: z
    .record(z.string(), z.union([z.string(), z.number()]))
    // Make identifiers required for CustomerIO audience (even though it's optional in base schema)
    .superRefine((identifiers, ctx) => {
      if (Object.keys(identifiers).length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'cannot be empty',
        });
      } else if (Object.keys(identifiers).length !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'only one identifier is supported',
        });
      }
    }),
});

// CustomerIOMessage extends RudderRecordV2 with CustomerIO-specific validation
export type CustomerIOMessage = Omit<RudderRecordV2, 'identifiers'> & {
  // For CustomerIO, identifiers is required and must contain exactly one identifier
  identifiers: Record<string, string | number>;
};

// Final exported types using generics from base types
export type CustomerIODestination = Destination<CustomerIODestinationConfig>;
export type CustomerIOConnection = Connection<
  DestinationConnectionConfig<CustomerIOConnectionConfig>
>;

export type CustomerIORouterRequest = RouterTransformationRequestData<
  CustomerIOMessage,
  CustomerIODestination,
  CustomerIOConnection
>;

// Remove the duplicate types and use the generic ones instead
export type CustomerIOBatchResponse = BatchRequestOutput<
  SegmentationPayload,
  SegmentationHeaders,
  SegmentationParam,
  CustomerIODestination
>;

export type CustomerIOBatchedRequest = BatchedRequest<
  SegmentationPayload,
  SegmentationHeaders,
  SegmentationParam
>;

export type CustomerIOBatchedRequestBody = BatchedRequestBody<SegmentationPayload>;

export type ProcessedEvent = RespList & {
  eventAction: RecordAction;
};
