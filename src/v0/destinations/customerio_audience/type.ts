import { z } from 'zod';

import {
  Connection,
  Destination,
  DestinationConnectionConfig,
  MessageTypeSchema,
  Metadata,
  RouterTransformationRequestData,
} from '../../../types';

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

export const SegmentAction = {
  INSERT: 'insert',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

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

const SegmentActionSchema = z.nativeEnum(SegmentAction);

// Message type specific to CustomerIO
export const CustomerIOMessageSchema = z
  .object({
    type: z.literal(MessageTypeSchema.enum.record),
    action: SegmentActionSchema,
    identifiers: z
      .record(z.string(), z.union([z.string(), z.number()]))
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
  })
  .passthrough();

export type SegmentActionType = z.infer<typeof SegmentActionSchema>;

export type CustomerIOMessage = z.infer<typeof CustomerIOMessageSchema>;

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
  eventAction: SegmentActionType;
};
