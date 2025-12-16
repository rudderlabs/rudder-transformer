import {
  RouterTransformationRequestData,
  Destination,
  Connection,
  Metadata,
} from '../../../../types';

export type ZohoMetadata = Metadata & {
  secret: {
    accessToken: string;
  };
};

export type TransformedResponseToBeBatched = {
  upsertData: unknown[];
  deletionData: string[];
  upsertSuccessMetadata: ZohoMetadata[];
  deletionSuccessMetadata: ZohoMetadata[];
};

export type ConfigMap = Array<{ from: string; to: string }>;

export type DestConfig = {
  trigger?: string;
  object: string;
  addDefaultDuplicateCheck?: boolean;
  multiSelectFieldLevelDecision: ConfigMap;
  identifierMappings: ConfigMap;
};

export type ConnectionConfig = {
  destination: DestConfig;
};

export type Message = {
  fields?: Record<string, unknown>;
  action?: string;
  identifiers?: Record<string, unknown>;
};

export type SearchRecordParams = {
  identifiers: Record<string, unknown>;
  metadata: { secret: { accessToken: string } };
  destination: Destination;
  destConfig: DestConfig;
};
/**
 * Zoho router input/output request type with message and metadata.
 * Combines routing information, destination config, and authentication metadata.
 */
export type ZohoRouterIORequest = RouterTransformationRequestData<
  Message,
  Destination,
  Connection<ConnectionConfig>,
  ZohoMetadata
>;

/**
 * Zoho COQL API error response structure returned by the Zoho API.
 * Contains error code, details, message, and status information.
 */
export type COQLAPIErrorResponse = {
  /** Error code from Zoho API (e.g., 'INVALID_TOKEN', 'NO_PERMISSION') */
  code: string;
  /** Additional error details from Zoho API */
  details: Record<string, unknown>;
  /** Human-readable error message */
  message: string;
  /** Status string from Zoho API */
  status: string;
};

export type COQLRecord = Record<string, unknown>;

/**
 * Processed COQL API response for successful queries.
 * Contains the retrieved records with their identifier fields and IDs.
 */
export type ProcessedCOQLAPISuccessResponse = {
  /** Always true for success responses */
  status: true;
  /** Array of records returned from COQL query, including id and identifier fields */
  records: COQLRecord[];
};

/**
 * Processed COQL API response for failed queries.
 * Contains error information and optional API response details.
 */
export type ProcessedCOQLAPIErrorResponse = {
  /** Always false for error responses */
  status: false;
  /** Error message describing the failure */
  message?: string;
  /** Type of error, e.g., 'instrumentation', 'api', 'network', etc. */
  errorType?: string;
  /** HTTP status code from the API response (e.g., 401, 429, 500) */
  apiStatus?: number;
  /** Original Zoho API error response with code and details */
  apiResponse?: COQLAPIErrorResponse;
};

/**
 * Result of mapping COQL query results to individual deletion events.
 * Maps event indexes to either successfully found record IDs or error details.
 */
export type COQLResultMapping = {
  /** Map of event index to array of Zoho record IDs found for that event */
  successMap: Record<number, string[]>;
  /** Map of event index to error response for events where records were not found */
  errorMap: Record<number, ProcessedCOQLAPIErrorResponse>;
};
