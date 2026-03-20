import { z, type ZodType } from 'zod';
import type { Destination } from '../../types/controlPlaneConfig';
import type { Metadata } from '../../types/rudderEvents';
import { RudderMessageSchema } from '../../types/rudderEvents';
import type {
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../types/destinationTransformation';

// ---------------------------------------------------------------------------
// Base input schema (RudderStack event spec — common to all destinations)
// ---------------------------------------------------------------------------

const baseInputSchema = z.object({
  message: RudderMessageSchema,
  metadata: z.object({ jobId: z.union([z.string(), z.number()]) }).passthrough(),
  destination: z.object({}).passthrough(),
});

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * One group per endpoint returned by batchTransform.
 * `body` is the full request body in destination-specific format.
 * `payloadHierarchyPath` in BatchConfig tells the framework which field inside
 * `body` holds the chunkable array (e.g. 'batch', 'data.events').
 * `jobIds` are aligned with the items at that array path.
 */
export type GroupedSuccessEvents<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  endpoint: string;
  method: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body: TBody;
  /** Aligned with the array at payloadHierarchyPath — one jobId per item */
  jobIds: string[];
};

export type TransformedErrorEvent = {
  error: string;
  statusCode: number;
  jobId: string;
  statTags?: Record<string, unknown>;
};

export type BatchTransformResult<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  groupedEvents: GroupedSuccessEvents<TBody>[];
  errorEvents: TransformedErrorEvent[];
};

export type BatchConfig = {
  /**
   * Dot-notation path to the chunkable array in the request body.
   * Supports array index notation.
   * Examples: 'batch', 'data.events', 'operations[0].create.userIdentifiers'
   */
  payloadHierarchyPath: string;
  /** Maximum number of payloads per chunk */
  maxChunkSize?: number;
  /** Maximum payload size per chunk, e.g. '4MB', '512KB' */
  maxPayloadSize?: string;
};

export type BatchRequest = {
  body: Record<string, unknown>;
  endpoint: string;
  method: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  /** Optional path suffix (e.g. 'users/track'). Derived from endpoint URL if not set. */
  endpointPath?: string;
};

export type PostTransformResult = {
  batchRequest: BatchRequest;
  jobIds: string[];
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Sets a value at a dot-notation path (supports array index notation).
 *
 * Examples:
 *   setValueAtPath({}, 'batch', [1,2])              → { batch: [1,2] }
 *   setValueAtPath({}, 'data.events', [1,2])         → { data: { events: [1,2] } }
 *   setValueAtPath({}, 'ops[0].create.ids', [1,2])   → { ops: [{ create: { ids: [1,2] } }] }
 */
export function setValueAtPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const segments = path.replace(/\[(\d+)]/g, '.$1').split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < segments.length - 1; i += 1) {
    const seg = segments[i];
    const nextSeg = segments[i + 1];
    const isNextIndex = /^\d+$/.test(nextSeg);

    if (current[seg] === undefined || current[seg] === null) {
      current[seg] = isNextIndex ? [] : {};
    }
    current = current[seg] as Record<string, unknown>;
  }

  current[segments[segments.length - 1]] = value;
  return obj;
}

/**
 * Reads a value at a dot-notation path (supports array index notation).
 *
 * Examples:
 *   getValueAtPath({ batch: [1,2] }, 'batch')             → [1,2]
 *   getValueAtPath({ data: { events: [1,2] } }, 'data.events') → [1,2]
 */
export function getValueAtPath(obj: Record<string, unknown>, path: string): unknown {
  const segments = path.replace(/\[(\d+)]/g, '.$1').split('.');
  let current: unknown = obj;
  for (const seg of segments) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[seg];
  }
  return current;
}

/** Parses a human-readable size string like '4MB', '512KB', '1GB' to bytes. */
function parseSizeToBytes(size: string): number {
  const match = size.trim().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/i);
  if (!match) {
    throw new Error(`routerIntegration: cannot parse size string '${size}'`);
  }
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  const multipliers: Record<string, number> = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
  return Math.floor(num * multipliers[unit]);
}

/**
 * Splits one GroupedSuccessEvents into chunks by reading the array at
 * config.payloadHierarchyPath from group.body, chunking it, and rebuilding
 * the body for each chunk. jobIds are kept aligned with the array items.
 * Respects maxChunkSize (item count) and maxPayloadSize (serialised bytes).
 */
export function chunkGroup<TBody extends Record<string, unknown>>(
  group: GroupedSuccessEvents<TBody>,
  config: BatchConfig,
): GroupedSuccessEvents<TBody>[] {
  const { payloadHierarchyPath, maxChunkSize, maxPayloadSize } = config;
  const items = getValueAtPath(group.body, payloadHierarchyPath);

  if (!Array.isArray(items)) {
    return [group];
  }

  const maxCount = maxChunkSize ?? Infinity;
  const maxBytes = maxPayloadSize ? parseSizeToBytes(maxPayloadSize) : Infinity;

  const chunks: GroupedSuccessEvents<TBody>[] = [];
  let currentItems: unknown[] = [];
  let currentJobIds: string[] = [];
  let currentBytes = 0;

  for (const [i, item] of items.entries()) {
    const jobId = group.jobIds[i];
    const itemBytes = Buffer.byteLength(JSON.stringify(item));

    const wouldExceedCount = currentItems.length >= maxCount;
    const wouldExceedSize = currentItems.length > 0 && currentBytes + itemBytes > maxBytes;

    if (currentItems.length > 0 && (wouldExceedCount || wouldExceedSize)) {
      chunks.push({
        ...group,
        body: setValueAtPath({ ...group.body }, payloadHierarchyPath, currentItems) as TBody,
        jobIds: currentJobIds,
      });
      currentItems = [];
      currentJobIds = [];
      currentBytes = 0;
    }

    currentItems.push(item);
    currentJobIds.push(jobId);
    currentBytes += itemBytes;
  }

  if (currentItems.length > 0) {
    chunks.push({
      ...group,
      body: setValueAtPath({ ...group.body }, payloadHierarchyPath, currentItems) as TBody,
      jobIds: currentJobIds,
    });
  }

  return chunks;
}

/** Splits inputs into batchable (dontBatch != true) and nonBatchable (dontBatch == true). */
export function groupByDontBatchDirective(inputs: RouterTransformationRequestData[]): {
  batchable: RouterTransformationRequestData[];
  nonBatchable: RouterTransformationRequestData[];
} {
  const batchable: RouterTransformationRequestData[] = [];
  const nonBatchable: RouterTransformationRequestData[] = [];
  for (const input of inputs) {
    if (input.metadata?.dontBatch) {
      nonBatchable.push(input);
    } else {
      batchable.push(input);
    }
  }
  return { batchable, nonBatchable };
}

/** Resolves jobIds back to full Metadata objects using the pre-built map. */
export function resolveMetadatas(
  jobIds: string[],
  metadataMap: Map<string, Metadata>,
): Partial<Metadata>[] {
  return jobIds.map((id) => metadataMap.get(id) ?? ({ jobId: id } as unknown as Partial<Metadata>));
}

// ---------------------------------------------------------------------------
// Internal conversion helpers
// ---------------------------------------------------------------------------

function convertToServerFormat(
  batchRequest: BatchRequest,
  metadata: Partial<Metadata>[],
  destination: Destination,
): RouterTransformationResponse {
  return {
    batchedRequest: {
      version: '1',
      type: 'REST',
      method: batchRequest.method,
      endpoint: batchRequest.endpoint,
      headers: batchRequest.headers ?? {},
      params: batchRequest.params ?? {},
      body: {
        JSON: batchRequest.body,
        JSON_ARRAY: {},
        XML: {},
        FORM: {},
      },
      files: {},
    },
    metadata,
    destination,
    batched: true,
    statusCode: 200,
  };
}

function toErrorResponse(
  e: TransformedErrorEvent,
  metadataMap: Map<string, Metadata>,
  destination: Destination,
): RouterTransformationResponse {
  return {
    metadata: [metadataMap.get(e.jobId) ?? ({ jobId: e.jobId } as unknown as Partial<Metadata>)],
    destination,
    batched: false,
    statusCode: e.statusCode,
    error: e.error,
    ...(e.statTags ? { statTags: e.statTags } : {}),
  };
}

// ---------------------------------------------------------------------------
// Abstract class
// ---------------------------------------------------------------------------

export abstract class RouterIntegration<TBody extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * Integration transforms ALL events and groups them into endpoint buckets.
   * Each group's `body` is the full destination-specific request body, with the
   * chunkable array already embedded at `payloadHierarchyPath`.
   * Async to allow bulk lookups (e.g. deduplication, identity resolution) before transformation.
   * Must be implemented by each destination.
   */
  abstract batchTransform(inputs: RouterTransformationRequestData[]): Promise<BatchTransformResult<TBody>>;

  /**
   * Chunks the group at payloadHierarchyPath and returns one BatchRequest per chunk.
   * Default: reads getBatchConfig(), chunks group.body at payloadHierarchyPath, returns chunk.body as-is.
   * Override for custom post-chunk logic (e.g. deduplication, field merging within a chunk).
   */
  postTransform(group: GroupedSuccessEvents<TBody>, destination: Destination): PostTransformResult[] {
    const batchConfig = this.getBatchConfig(destination);
    const chunks = chunkGroup(group, batchConfig);
    return chunks.map((chunk) => ({
      batchRequest: {
        body: chunk.body,
        endpoint: chunk.endpoint,
        method: chunk.method,
        headers: chunk.headers,
      },
      jobIds: chunk.jobIds,
    }));
  }

  /**
   * Override to declare chunking config. payloadHierarchyPath is required.
   * Default: 500 events max, no size limit, path = 'events'.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBatchConfig(_destination?: Destination): BatchConfig {
    return { payloadHierarchyPath: 'events', maxChunkSize: 500 };
  }

  /**
   * Override to add destination-specific Zod validation rules.
   * The framework automatically fuses this with the base schema for single-pass validation.
   * Default: no additional rules.
   */
  getIntegrationSchema(): ZodType | null {
    return null;
  }

  private getFusedSchema(): ZodType {
    const integrationSchema = this.getIntegrationSchema();
    return integrationSchema ? baseInputSchema.and(integrationSchema) : baseInputSchema;
  }

  /**
   * Validates all inputs against the fused schema (base spec rules + integration rules).
   * Invalid events are pushed to results as error responses; valid inputs are returned.
   */
  validate(
    inputs: RouterTransformationRequestData[],
    results: RouterTransformationResponse[],
  ): RouterTransformationRequestData[] {
    const schema = this.getFusedSchema();
    return inputs.filter((input) => {
      const parsed = schema.safeParse(input);
      if (!parsed.success) {
        results.push({
          metadata: [input.metadata],
          destination: input.destination,
          batched: false,
          statusCode: 400,
          error: parsed.error.issues.map((i) => i.message).join('; '),
        });
        return false;
      }
      return true;
    });
  }
}

// ---------------------------------------------------------------------------
// Framework orchestration
// ---------------------------------------------------------------------------

/**
 * Full batching pipeline for a destination that implements RouterIntegration.
 * Called by NativeIntegrationDestinationService.doRouterTransformation when
 * the destination is registered in batchedDestinationsMap.
 */
export async function processBatchedDestination(
  inputs: RouterTransformationRequestData[],
  integration: RouterIntegration,
): Promise<RouterTransformationResponse[]> {
  if (!inputs || inputs.length === 0) {
    return [];
  }

  const results: RouterTransformationResponse[] = [];

  // 1. Build jobId → Metadata map from ALL inputs (including any that fail validation)
  const metadataMap = new Map<string, Metadata>(
    inputs.map((i) => [String(i.metadata.jobId), i.metadata]),
  );

  // 2. Validate — invalid events are pushed to results, valid inputs returned
  const validInputs = integration.validate(inputs, results);

  // 3. Split valid inputs on dontBatch flag
  const { batchable, nonBatchable } = groupByDontBatchDirective(validInputs);

  // 4. NonBatchable — each event processed as a batch of 1 (parallel)
  const nonBatchableResults = await Promise.all(
    nonBatchable.map(async (event) => ({
      event,
      result: await integration.batchTransform([event]),
    })),
  );
  for (const {
    event,
    result: { groupedEvents, errorEvents },
  } of nonBatchableResults) {
    for (const e of errorEvents) {
      results.push(toErrorResponse(e, metadataMap, event.destination));
    }
    for (const group of groupedEvents) {
      for (const { batchRequest, jobIds } of integration.postTransform(group, event.destination)) {
        results.push(
          convertToServerFormat(
            batchRequest,
            resolveMetadatas(jobIds, metadataMap),
            event.destination,
          ),
        );
      }
    }
  }

  // 5. Batchable — integration transforms + groups all events at once
  if (batchable.length > 0) {
    const { groupedEvents, errorEvents } = await integration.batchTransform(batchable);
    const { destination } = batchable[0];

    for (const e of errorEvents) {
      results.push(toErrorResponse(e, metadataMap, destination));
    }
    for (const group of groupedEvents) {
      for (const { batchRequest, jobIds } of integration.postTransform(group, destination)) {
        results.push(
          convertToServerFormat(batchRequest, resolveMetadatas(jobIds, metadataMap), destination),
        );
      }
    }
  }

  return results;
}
