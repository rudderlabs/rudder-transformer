export type CaptureKind = 'request' | 'response';

export interface CaptureMetadata {
  workspaceId?: string;
  destinationId?: string;
  destType?: string;
  destinationType?: string;
  sourceId?: string;
}

export interface CaptureRecord {
  kind: CaptureKind;
  identifierMsg: string;
  /** per-job metadatas of the delivery request; deduped to unique (workspace, destination) pairs */
  metadata: CaptureMetadata[];
  details: Record<string, unknown>;
  /** correlates a delivery's request and response records; pairs their sampling decisions */
  requestId?: string;
}

export interface CaptureConfig {
  enabled: boolean;
  bucket: string;
  prefix: string;
  endpoint?: string;
  region?: string;
  dir: string;
  sampleIntervalMs: number;
  flushIntervalMs: number;
  maxFileBytes: number;
  maxDiskBytes: number;
  shutdownBudgetMs: number;
}
