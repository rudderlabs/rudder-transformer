import type {
  Connection,
  Credential,
  Destination,
  UserTransformationLibrary,
} from './controlPlaneConfigSpec';
import type { Metadata, RudderMessage } from './eventSpec';

/**
 * Processor transformation request/response structures
 */
export type ProcessorTransformationRequest = {
  request?: object;
  message: object;
  metadata: Metadata;
  destination: Destination;
  connection?: Connection;
  libraries?: UserTransformationLibrary[];
  credentials?: Credential[];
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
  body?: {
    JSON?: Record<string, unknown>;
    JSON_ARRAY?: Record<string, unknown>;
    XML?: Record<string, unknown>;
    FORM?: Record<string, unknown>;
  };
  files?: Record<string, unknown>;
};

export type ProcessorTransformationResponse = {
  output?: ProcessorTransformationOutput | RudderMessage;
  metadata: Metadata;
  statusCode: number;
  error?: string;
  statTags?: object;
};

/**
 * Router transformation structures
 */
export type RouterTransformationRequestData = {
  request?: object;
  message: object;
  metadata: Metadata;
  destination: Destination;
  connection?: Connection;
};

export type RouterTransformationRequest = {
  input: RouterTransformationRequestData[];
  destType: string;
};

export type RouterTransformationResponse = {
  batchedRequest?: ProcessorTransformationOutput | ProcessorTransformationOutput[];
  metadata: Metadata[];
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
      metadatas?: Metadata[];
      metadata?: Metadata;
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

export type ComparatorInput = {
  events: ProcessorTransformationRequest[] | RouterTransformationRequestData[];
  destination: string;
  version: string;
  requestMetadata: object;
  feature: string;
};
