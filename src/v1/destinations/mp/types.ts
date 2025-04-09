/**
 * Interface for event object
 */
export interface Event {
  properties?: {
    $insert_id?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Interface for failed record
 */
export interface FailedRecord {
  $insert_id: string;
  field: string;
  message: string;
  [key: string]: any;
}

/**
 * Interface for event response
 */
export interface EventResponse {
  statusCode: number;
  metadata: any;
  error: string;
}

/**
 * Mock ProxyMetadata for testing
 */
export interface MockProxyMetadata {
  jobId: number;
  [key: string]: any;
}
