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

/**
 * Metadata structure for proxy requests
 */
export type ProxyMetdata = {
  jobId: number;
  attemptNum: number;
  userId: string;
  sourceId: string;
  destinationId: string;
  workspaceId: string;
  secret: Record<string, unknown>;
  destInfo?: Record<string, unknown>;
  omitempty?: Record<string, unknown>;
  dontBatch: boolean;
};

/**
 * Proxy request structure for version 0
 */
export type ProxyV0Request = {
  version: string;
  type: string;
  method: string;
  endpoint: string;
  userId: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: {
    JSON?: Record<string, unknown>;
    JSON_ARRAY?: Record<string, unknown>;
    XML?: Record<string, unknown>;
    FORM?: Record<string, unknown>;
    GZIP?: Record<string, unknown>;
  };
  files?: Record<string, unknown>;
  metadata: ProxyMetdata;
  destinationConfig: Record<string, unknown>;
};

/**
 * Proxy request structure for version 1
 */
export type ProxyV1Request = Omit<ProxyV0Request, 'metadata'> & {
  metadata: ProxyMetdata[];
};

export type ProxyRequest = ProxyV0Request | ProxyV1Request;

/**
 * Error detailer structure for proxy
 */
export type ErrorDetailer = {
  module: string;
  implementation: string;
  feature: string;
} & ErrorDetailerOptions;

export type ErrorDetailerOptions = {
  errorCategory?: string;
  errorType?: string;
  meta?: string;
  destType?: string;
  srcType?: string;
  cluster?: string;
  customer?: string;
  destinationId?: string;
  workspaceId?: string;
  sourceId?: string;
};

export type MetaTransferObjectForProxy = {
  metadata?: ProxyMetdata;
  metadatas?: ProxyMetdata[];
  errorDetails: ErrorDetailer;
  errorContext: string;
};

export type MetaTransferObject =
  | {
      metadatas?: Partial<Metadata>[];
      metadata?: Partial<Metadata>;
      errorDetails: ErrorDetailer;
      errorContext: string;
    }
  | MetaTransferObjectForProxy;

/**
 * Delivery response structures
 */
export type DeliveryV0Response = {
  status: number;
  message: string;
  destinationResponse: any;
  statTags: object;
  authErrorCategory?: string;
};

export type DeliveryJobState = {
  error: string;
  statusCode: number;
  metadata: ProxyMetdata;
};

export type DeliveryV1Response = {
  status: number;
  message: string;
  statTags?: object;
  destinationResponse?: any;
  authErrorCategory?: string;
  response: DeliveryJobState[];
};

/**
 * Interface for response parameters in network handlers
 */
export interface ResponseHandlerParams {
  destinationResponse: {
    status: number;
    response?: any;
    headers?: any;
  };
  destinationRequest?: ProxyRequest;
  destType?: string;
  rudderJobMetadata: ProxyMetdata | ProxyMetdata[];
  [key: string]: any;
}

/**
 * Interface for response object from network handlers
 */
export interface ResponseProxyObject
  extends Partial<DeliveryV0Response>,
    Partial<DeliveryV1Response> {
  status: number;
  message: string;
  destinationResponse?: any;
  response?: DeliveryJobState[];
  [key: string]: any;
}

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
