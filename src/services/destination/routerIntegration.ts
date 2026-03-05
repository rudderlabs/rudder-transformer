import type { Destination } from '../../types/controlPlaneConfig';
import type { Metadata } from '../../types/rudderEvents';
import type {
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../types/destinationTransformation';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type GroupedSuccessEvents<T = Record<string, unknown>> = {
  endpoint: string;
  method: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  payloads: T[];
  /** Aligned with payloads[] — one jobId per single payload or multiplexed payloads */
  jobIds: string[];
};

export type TransformedErrorEvent = {
  error: string;
  statusCode: number;
  jobId: string;
};

export type BatchTransformResult<T = Record<string, unknown>> = {
  groupedEvents: GroupedSuccessEvents<T>[];
  errorEvents: TransformedErrorEvent[];
};

export type BatchConfig = {
  /**
   * Dot-notation path to the chunkable array in the request body.
   * Supports array index notation.
   * Examples: 'batch', 'data.events', 'operations[0].create.userIdentifiers'
   */
  payloadHierarchyPath: string;
  /** Static root-level fields merged into the body alongside the array, e.g. { api_key: '...' } */
  rootFields?: Record<string, unknown>; // No need of this field
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
 * Splits one GroupedSuccessEvents into chunks, keeping payloads + jobIds aligned.
 * Respects maxChunkSize (item count) and maxPayloadSize (serialised bytes).
 */
export function chunkGroup<T>(
  group: GroupedSuccessEvents<T>,
  config: BatchConfig,
): GroupedSuccessEvents<T>[] {
  const maxCount = config.maxChunkSize ?? Infinity;
  const maxBytes = config.maxPayloadSize ? parseSizeToBytes(config.maxPayloadSize) : Infinity;

  const chunks: GroupedSuccessEvents<T>[] = [];
  let currentPayloads: T[] = [];
  let currentJobIds: string[] = [];
  let currentBytes = 0;

  for (let i = 0; i < group.payloads.length; i += 1) {
    const payload = group.payloads[i];
    const jobId = group.jobIds[i];
    const payloadBytes = Buffer.byteLength(JSON.stringify(payload));

    const wouldExceedCount = currentPayloads.length >= maxCount;
    const wouldExceedSize = currentPayloads.length > 0 && currentBytes + payloadBytes > maxBytes;

    if (currentPayloads.length > 0 && (wouldExceedCount || wouldExceedSize)) {
      chunks.push({ ...group, payloads: currentPayloads, jobIds: currentJobIds });
      currentPayloads = [];
      currentJobIds = [];
      currentBytes = 0;
    }

    currentPayloads.push(payload);
    currentJobIds.push(jobId);
    currentBytes += payloadBytes;
  }

  if (currentPayloads.length > 0) {
    chunks.push({ ...group, payloads: currentPayloads, jobIds: currentJobIds });
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
  };
}

// ---------------------------------------------------------------------------
// Abstract class
// ---------------------------------------------------------------------------

export abstract class RouterIntegration<T = Record<string, unknown>> {
  /**
   * Optional bulk lookup before transformation — runs once for the entire batch.
   * Use when the integration needs external data (e.g. resolve 30 distinct users once
   * instead of one lookup per event). Cache results for use in batchTransform.
   */
  preTransform?(inputs: RouterTransformationRequestData[]): Promise<void>; // need to be merged with batchTransform

  /**
   * Integration transforms ALL events and groups them into endpoint buckets.
   * Must be implemented by each destination.
   */
  abstract batchTransform(inputs: RouterTransformationRequestData[]): BatchTransformResult<T>;

  /**
   * Default implementation: uses getBatchConfig() to reconstruct the body.
   * setValueAtPath places chunk.payloads at the dot-notation path, then rootFields
   * are merged at the root level.
   * Complex integrations override this with custom merge logic.
   */
  postTransform(chunk: GroupedSuccessEvents<T>, destination: Destination): BatchRequest {
    const { payloadHierarchyPath, rootFields } = this.getBatchConfig(destination);
    const body = setValueAtPath({ ...(rootFields ?? {}) }, payloadHierarchyPath, chunk.payloads);
    return {
      body,
      endpoint: chunk.endpoint,
      method: chunk.method,
      headers: chunk.headers,
    };
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
   * Override to add pre-transform validations.
   * Push a RouterTransformationResponse error entry into `results` for each invalid event.
   * Return only the valid inputs that should continue through the pipeline.
   * Default: all inputs are valid.
   */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  validate(
    inputs: RouterTransformationRequestData[],
    _results: RouterTransformationResponse[],
  ): RouterTransformationRequestData[] {
    return inputs;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

// ---------------------------------------------------------------------------
// Framework orchestration
// ---------------------------------------------------------------------------

/**
 * Full batching pipeline for a destination that implements RouterIntegration.
 * Called by NativeIntegrationDestinationService.doRouterTransformation when
 * the destination is registered in batchedDestinationsMap.
 */
export async function processBatchedDestination<T>(
  inputs: RouterTransformationRequestData[],
  integration: RouterIntegration<T>,
): Promise<RouterTransformationResponse[]> {
  if (!inputs || inputs.length === 0) {
    return [];
  }

  const results: RouterTransformationResponse[] = [];

  // 1. Build jobId → Metadata map from ALL inputs (including any that fail validation)
  const metadataMap = new Map<string, Metadata>(
    inputs.map((i) => [String(i.metadata.jobId), i.metadata]),
  );

  // 2. Pre-validate — invalid events are pushed to results, valid inputs returned
  const validInputs = integration.validate(inputs, results);

  // 3. Optional bulk lookup before transformation
  if (integration.preTransform) {
    await integration.preTransform(validInputs);
  }

  // 4. Split valid inputs on dontBatch flag
  const { batchable, nonBatchable } = groupByDontBatchDirective(validInputs);

  // 5. NonBatchable — each event processed as a batch of 1
  for (const event of nonBatchable) {
    const { groupedEvents, errorEvents } = integration.batchTransform([event]);

    for (const e of errorEvents) {
      results.push(toErrorResponse(e, metadataMap, event.destination));
    }
    for (const group of groupedEvents) {
      const batchRequest = integration.postTransform(group, event.destination);
      results.push(
        convertToServerFormat(
          batchRequest,
          resolveMetadatas(group.jobIds, metadataMap),
          event.destination,
        ),
      );
    }
  }

  // 6. Batchable — integration transforms + groups all events at once
  if (batchable.length > 0) {
    const { groupedEvents, errorEvents } = integration.batchTransform(batchable);
    const { destination } = batchable[0];

    // 7. Chunk each group and build one request per chunk
    const batchConfig = integration.getBatchConfig(destination);
    for (const e of errorEvents) {
      results.push(toErrorResponse(e, metadataMap, destination));
    }
    for (const group of groupedEvents) {
      const chunks = chunkGroup(group, batchConfig);

      for (const chunk of chunks) {
        const batchRequest = integration.postTransform(chunk, destination);
        results.push(
          convertToServerFormat(
            batchRequest,
            resolveMetadatas(chunk.jobIds, metadataMap),
            destination,
          ),
        );
      }
    }
  }

  return results;
}
