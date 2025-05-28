import { z } from 'zod';

import {
  Connection,
  Destination,
  DestinationConnectionConfig,
  MessageTypeSchema,
  Metadata,
  RouterTransformationRequestData,
} from '../../../types';

import { BatchedRequest, BatchRequestOutput } from '../../../types/destinationTransformation';

// Basic response type for SFMC operations
export type SFMCResponse = {
  payload: {
    keys: Record<string, string | number>;
    values?: Record<string, string | number | boolean | null>;
  };
  metadata: Partial<Metadata>;
};

// Types for API request components
export type UpsertPayload = {
  keys: Record<string, string | number>;
  values: Record<string, string | number | boolean | null>;
};

export type DeletePayload = {
  keys: Record<string, string | number>;
};

export type SFMCHeaders = {
  'Content-Type': string;
  Authorization?: string;
  SOAPAction?: string;
};

export type SFMCParams = Record<string, string>;

export const SFMCAction = {
  INSERT: 'insert',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

export const SFMCDestinationConfigSchema = z
  .object({
    clientId: z.string(),
    clientSecret: z.string(),
    subDomain: z.string(),
  })
  .passthrough();

export type SFMCDestinationConfig = z.infer<typeof SFMCDestinationConfigSchema>;

export const SFMCConnectionConfigSchema = z
  .object({
    dataExtensionKey: z.string().nonempty(),
    objectType: z.literal('dataExtension'),
    fieldMappings: z.array(z.object({ from: z.string(), to: z.string() })),
    identifierMappings: z.array(z.object({ from: z.string(), to: z.string() })).nonempty(),
  })
  .passthrough();

export type SFMCConnectionConfig = z.infer<typeof SFMCConnectionConfigSchema>;

const SFMCActionSchema = z.nativeEnum(SFMCAction);

// Message type specific to SFMC
export const SFMCMessageSchema = z
  .object({
    type: z.union([
      z.literal(MessageTypeSchema.enum.record),
      z.literal(MessageTypeSchema.enum.track),
      z.literal(MessageTypeSchema.Enum.identify),
    ]),
    action: SFMCActionSchema,
    identifiers: z.record(z.string(), z.union([z.string(), z.number()])),
    fields: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
  })
  .passthrough();

export type SFMCActionType = z.infer<typeof SFMCActionSchema>;

export type SFMCMessage = z.infer<typeof SFMCMessageSchema>;

// Final exported types using generics from base types
export type SFMCDestination = Destination<SFMCDestinationConfig>;
export type SFMCConnection = Connection<DestinationConnectionConfig<SFMCConnectionConfig>>;

export type SFMCRouterRequest = RouterTransformationRequestData<
  SFMCMessage,
  SFMCDestination,
  SFMCConnection
>;

export type SFMCBatchResponse = BatchRequestOutput<
  UpsertPayload[] | Record<string, unknown>,
  SFMCHeaders,
  SFMCParams,
  SFMCDestination
>;

export type SFMCBatchedRequest = BatchedRequest<UpsertPayload[], SFMCHeaders, SFMCParams>;

export type ProcessedEvent = SFMCResponse & {
  eventAction: SFMCActionType;
};
