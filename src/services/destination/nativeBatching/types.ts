// ---------------------------------------------------------------------------
// Shared types and utilities for the native batching framework
// ---------------------------------------------------------------------------

export type TransformedEvent<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  body: TBody;
  endpoint: string;
  method: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
};

export type TransformError = {
  error: string;
  statusCode: number;
  statTags?: Record<string, unknown>;
};

export type TransformResult<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  successPayloads: (TransformedEvent<TBody> & { jobId: number })[];
  errorPayloads: (TransformError & { jobId: number })[];
};

export type BatchGroup = {
  body: Record<string, unknown>;
  jobIds: Set<number>;
};

export enum BodyFormat {
  JSON = 'JSON',
  JSON_ARRAY = 'JSON_ARRAY',
  XML = 'XML',
  FORM = 'FORM',
}

export interface BatchStrategy<TBody extends Record<string, unknown> = Record<string, unknown>> {
  bodyFormat: BodyFormat;
  batch(payloads: (TransformedEvent<TBody> & { jobId: number })[]): BatchGroup[];
}

const SIZE_UNITS: Record<string, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

export function parseSizeToBytes(size: string): number {
  const match = size.trim().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/i);
  if (!match) {
    throw new Error(`Invalid size format: "${size}". Expected format like "4MB", "512KB".`);
  }
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  return Math.floor(value * SIZE_UNITS[unit]);
}
