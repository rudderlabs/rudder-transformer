import { z } from 'zod';

import {
  Connection,
  Destination,
  DestinationConnectionConfig,
  MessageType,
  Metadata,
  RouterTransformationRequestData,
} from '../../../types';

// Basic response type for audience list operations
export type RespList = {
  payload: {
    ids: (string | number)[];
  };
  metadata: Metadata;
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
    audienceId: z.string(),
    identifierMappings: z.array(z.object({ from: z.string(), to: z.string() })),
  })
  .passthrough();

export type CustomerIOConnectionConfig = z.infer<typeof CustomerIOConnectionConfigSchema>;

// Message type specific to CustomerIO
export const CustomerIOMessageSchema = z
  .object({
    type: z.literal(MessageType.enum.record),
    action: z.string(),
    identifiers: z.record(z.string(), z.union([z.string(), z.number()])),
  })
  .passthrough();

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
