import { Metadata } from './rudderEvents';

/**
 * Metadata structure for proxy requests
 */
export type ProxyMetadata = {
  jobId: number;
  attemptNum: number;
  userId: string;
  sourceId: string;
  destinationId: string;
  workspaceId: string;
  secret?: Record<string, unknown>;
  destInfo?: Record<string, unknown>;
  omitempty?: Record<string, unknown>;
  dontBatch?: boolean;
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
  metadata: ProxyMetadata;
  destinationConfig: Record<string, unknown>;
};

/**
 * Proxy request structure for version 1
 */
export type ProxyV1Request = Omit<ProxyV0Request, 'metadata'> & {
  metadata: ProxyMetadata[];
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
  metadata?: ProxyMetadata;
  metadatas?: ProxyMetadata[];
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
  metadata: ProxyMetadata;
};

export type DeliveryV1Response = {
  status: number;
  message: string;
  statTags?: object;
  destinationResponse?: any;
  authErrorCategory?: string;
  response: DeliveryJobState[];
};

export type DeliveryResponse = DeliveryV0Response | DeliveryV1Response;

/**
 * Interface for response parameters in network handlers
 */
export interface ResponseParams {
  destinationResponse: {
    status: number;
    response?: any;
    headers?: any;
  };
  destinationRequest?: ProxyRequest;
  destType?: string;
  rudderJobMetadata: ProxyMetadata | ProxyMetadata[];
  [key: string]: any;
}

/**
 * Interface for response object from network handlers
 */
export interface ResponseObject extends Partial<DeliveryV0Response>, Partial<DeliveryV1Response> {
  status: number;
  message: string;
  destinationResponse?: any;
  response?: DeliveryJobState[];
  [key: string]: any;
}
