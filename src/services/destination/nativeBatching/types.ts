// ---------------------------------------------------------------------------
// Schema-driven type inference utilities
// ---------------------------------------------------------------------------

/** Extract destination Config type from a schema output. Falls back to Record<string, unknown>. */
export type ExtractDestinationConfig<T> = T extends { destination: { Config: infer C } }
  ? C
  : Record<string, unknown>;

/**
 * Extract connection config type from a schema output. Falls back to
 * Record<string, unknown>. Handles both required and optional `connection`
 * (destinations like CustomerIO mark it optional since event-stream messages
 * carry no connection, while record events do).
 */
export type ExtractConnectionConfig<T> = T extends { connection?: infer Conn }
  ? NonNullable<Conn> extends { config: infer C }
    ? C
    : Record<string, unknown>
  : Record<string, unknown>;

// ---------------------------------------------------------------------------
// Shared types and utilities for the native batching framework
// ---------------------------------------------------------------------------

export type TransformedEvent<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  body: TBody;
  endpoint: string;
  endpointPath: string;
  method: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  // Optional discriminator that adds to the composite grouping key (alongside
  // endpoint/method/headers/params) so destinations with extra dimensions
  // (e.g. action type when multiple actions share a URL) can keep groups separate
  // without polluting the user-visible request fields.
  internalGroupKey?: string;
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
  batch(payloads: (TransformedEvent<TBody> & { jobId: number })[]): Promise<BatchGroup[]>;
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
