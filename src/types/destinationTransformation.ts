import type {
  Connection,
  Credential,
  Destination,
  UserTransformationLibrary,
} from './controlPlaneConfig';
import type { Metadata, RudderMessage } from './rudderEvents';

export type ProcessorCompactedTransformationRequest<M = RudderMessage, MD = Metadata> = {
  input: Omit<ProcessorTransformationRequest<M, MD>, 'connection' | 'destination'>[];
  destinations: Record<string, Destination>;
  connections: Record<string, Connection>;
};

/**
 * Processor transformation request/response structures
 */
export type ProcessorTransformationRequest<M = RudderMessage, MD = Metadata> = {
  request?: object;
  message: M;
  metadata: MD;
  destination: Destination;
  connection?: Connection;
  libraries?: UserTransformationLibrary[];
  credentials?: Credential[];
};

export type BatchedRequestBody<T = Record<string, unknown>> = {
  JSON?: T;
  JSON_ARRAY?: Record<string, unknown>;
  XML?: Record<string, unknown>;
  FORM?: Record<string, unknown>;
};

export type BatchedRequest<
  TPayload = Record<string, unknown>,
  THeaders = Record<string, unknown>,
  TParams = Record<string, unknown>,
> = {
  body: BatchedRequestBody<TPayload>;
  version: string;
  type: string;
  method: string;
  endpoint: string;
  headers: THeaders;
  params: TParams;
  files: Record<string, never>;
};

export type BatchRequestOutput<
  TPayload = Record<string, unknown>,
  THeaders = Record<string, unknown>,
  TParams = Record<string, unknown>,
  TDestination = Destination,
> = {
  batchedRequest: BatchedRequest<TPayload, THeaders, TParams>;
  metadata: Partial<Metadata>[];
  batched: boolean;
  statusCode: number;
  destination: TDestination;
};

/**
 * Output structure for processor transformations
 */
export type ProcessorTransformationOutput = {
  version: string;
  type: string;
  method: string;
  endpoint: string;
  userId?: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: BatchedRequestBody;
  files?: Record<string, unknown>;
};

export type ProcessorTransformationResponse = {
  output?: ProcessorTransformationOutput | RudderMessage;
  metadata: Partial<Metadata>;
  statusCode: number;
  error?: string;
  statTags?: object;
};

/**
 * Router transformation structures
 */
export type RouterTransformationRequestData<
  M = RudderMessage,
  D = Destination,
  C = Connection,
  MD = Metadata,
> = {
  request?: object;
  message: M;
  metadata: MD;
  destination: D;
  connection?: C;
};

export type RouterTransformationRequest<M = RudderMessage, MD = Metadata> = {
  input: RouterTransformationRequestData<M, Destination, Connection, MD>[];
  destType: string;
};

export type RouterCompactedTransformationRequest<M = RudderMessage, MD = Metadata> = {
  input: Omit<
    RouterTransformationRequestData<M, Destination, Connection, MD>,
    'destination' | 'connection'
  >[];
  destType: string;
  connections: Record<string, Connection>;
  destinations: Record<string, Destination>;
};

export type RouterTransformationResponse = {
  batchedRequest?: ProcessorTransformationOutput | ProcessorTransformationOutput[];
  metadata: Partial<Metadata>[];
  destination: Destination;
  batched: boolean;
  statusCode: number;
  error?: string;
  statTags?: object;
};

export type ComparatorInput = {
  events: ProcessorTransformationRequest[] | RouterTransformationRequestData[];
  destination: string;
  version: string;
  requestMetadata: object;
  feature: string;
};

// Add helper type for pre-processing functions
export type PreProcessableRequest =
  | ProcessorTransformationRequest
  | RouterTransformationRequestData;
