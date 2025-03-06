import { z } from 'zod';

import {
  Connection,
  Destination,
  DestinationConnectionConfig,
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
export type SegmentationPayloadType = {
  ids: (string | number)[];
};

export type SegmentationParamType = {
  id_type: string;
};

export type SegmentationHeadersType = {
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
    action: z.string(),
    identifiers: z.record(z.string(), z.union([z.string(), z.number()])),
  })
  .passthrough();

export type CustomerIOMessage = z.infer<typeof CustomerIOMessageSchema>;

// Final exported types using generics from base types
export type CustomerIODestinationType = Destination<CustomerIODestinationConfig>;
export type CustomerIOConnectionType = Connection & {
  config: DestinationConnectionConfig<CustomerIOConnectionConfig>;
};

export type CustomerIORouterRequestType = RouterTransformationRequestData;
