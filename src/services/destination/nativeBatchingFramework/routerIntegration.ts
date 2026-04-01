import { z, ZodType } from 'zod';
import stableStringify from 'fast-json-stable-stringify';
import type { Destination } from '../../../types/controlPlaneConfig';
import { RudderMessageSchema, MetadataSchema } from '../../../types/rudderEvents';
import type { Metadata } from '../../../types/rudderEvents';
import type {
  BatchedRequestBody,
  RouterTransformationRequestData,
} from '../../../types/destinationTransformation';
import tags from '../../../v0/util/tags';
import { generateErrorObject } from '../../../v0/util';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TransformedEvent<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  body: TBody;
  endpoint: string;
  method: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  jobId: number;
};

export type TransformError = {
  error: string;
  statusCode: number;
  jobId: number;
  statTags?: Record<string, unknown>;
};

export type TransformResult<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  payloads: TransformedEvent<TBody>[];
  errorEvents: TransformError[];
};

export type ChunkStrategy<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  type: 'chunk';
  maxItems?: number;
  maxPayloadSize?: string;
  wrapBody: (bodies: TBody[]) => Record<string, unknown>;
};

export type BatchGroup = {
  body: Record<string, unknown>;
  jobIds: Set<number>;
};

export type CustomBatchStrategy<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  type: 'customBatch';
  batch: (payloads: TransformedEvent<TBody>[]) => BatchGroup[];
};

export type BatchStrategy<TBody extends Record<string, unknown> = Record<string, unknown>> =
  | ChunkStrategy<TBody>
  | CustomBatchStrategy<TBody>;

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

export function chunk<TBody extends Record<string, unknown> = Record<string, unknown>>(opts: {
  maxItems?: number;
  maxPayloadSize?: string;
  wrapBody: (bodies: TBody[]) => Record<string, unknown>;
}): ChunkStrategy<TBody> {
  return { type: 'chunk', ...opts };
}

export function customBatch<TBody extends Record<string, unknown> = Record<string, unknown>>(
  batchFn: (payloads: TransformedEvent<TBody>[]) => BatchGroup[],
): CustomBatchStrategy<TBody> {
  return { type: 'customBatch', batch: batchFn };
}

// ---------------------------------------------------------------------------
// Base Zod schema for input validation
// ---------------------------------------------------------------------------

const baseInputSchema = z.object({
  message: RudderMessageSchema,
  metadata: MetadataSchema.partial().extend({ jobId: z.number() }),
  destination: z.object({}).passthrough(),
});

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

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

export function groupByDontBatchDirective(inputs: RouterTransformationRequestData[]): {
  batchableEvents: RouterTransformationRequestData[];
  nonBatchableEvents: RouterTransformationRequestData[];
} {
  const batchableEvents: RouterTransformationRequestData[] = [];
  const nonBatchableEvents: RouterTransformationRequestData[] = [];
  for (const input of inputs) {
    if (input.metadata?.dontBatch === true) {
      nonBatchableEvents.push(input);
    } else {
      batchableEvents.push(input);
    }
  }
  return { batchableEvents, nonBatchableEvents };
}

export function resolveMetadata(
  jobIds: Set<number>,
  metadataMap: Map<number, Partial<Metadata>>,
): Partial<Metadata>[] {
  return Array.from(jobIds).map((id) => {
    const metadata = metadataMap.get(id);
    if (!metadata) {
      throw new Error(`Missing metadata for jobId ${id}`);
    }
    return metadata;
  });
}

type RequestGroup<TBody extends Record<string, unknown>> = {
  endpoint: string;
  method: string;
  headers: Record<string, unknown> | undefined;
  params: Record<string, unknown> | undefined;
  payloads: TransformedEvent<TBody>[];
};

export function groupPayloadsByCompositeKey<
  TBody extends Record<string, unknown> = Record<string, unknown>,
>(payloads: TransformedEvent<TBody>[]): RequestGroup<TBody>[] {
  const map = new Map<string, RequestGroup<TBody>>();

  for (const payload of payloads) {
    const key = stableStringify({
      endpoint: payload.endpoint,
      method: payload.method,
      headers: payload.headers ?? {},
      params: payload.params ?? {},
    });

    let group = map.get(key);
    if (!group) {
      group = {
        endpoint: payload.endpoint,
        method: payload.method,
        headers: payload.headers,
        params: payload.params,
        payloads: [],
      };
      map.set(key, group);
    }
    group.payloads.push(payload);
  }

  return Array.from(map.values());
}

// ---------------------------------------------------------------------------
// Abstract class: BatchDestination<TBody>
// ---------------------------------------------------------------------------

// Constructor type for BatchDestination subclasses — used by the framework to instantiate per request
export type BatchDestinationConstructor<
  TBody extends Record<string, unknown> = Record<string, unknown>,
> = new (destination: Destination) => BatchDestination<TBody>;

export abstract class BatchDestination<
  TBody extends Record<string, unknown> = Record<string, unknown>,
> {
  protected destination: Destination;

  constructor(destination: Destination) {
    this.destination = destination;
  }

  // --- MUST implement ---

  abstract transformEvent(
    input: RouterTransformationRequestData,
  ): Omit<TransformedEvent<TBody>, 'jobId'> | Omit<TransformedEvent<TBody>, 'jobId'>[];

  abstract getBatchStrategy(endpoint: string): BatchStrategy<TBody>;

  // --- MAY override ---

  /**
   * Wraps the batched body into the BatchedRequestBody envelope.
   * Default places body in JSON. Override for JSON_ARRAY, XML, FORM, etc.
   */
  wrapRequestBody(body: Record<string, unknown>): BatchedRequestBody {
    return {
      JSON: body,
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    };
  }

  async transformEvents(
    inputs: RouterTransformationRequestData[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _reqMetadata: NonNullable<unknown>,
  ): Promise<TransformResult<TBody>> {
    const payloads: TransformedEvent<TBody>[] = [];
    const errorEvents: TransformError[] = [];

    for (const input of inputs) {
      const jobId = input.metadata?.jobId;
      try {
        const transformedPayload = this.transformEvent(input);
        const results = Array.isArray(transformedPayload)
          ? transformedPayload
          : [transformedPayload];
        for (const result of results) {
          payloads.push({ ...result, jobId });
        }
      } catch (error: any) {
        const errObj = generateErrorObject(error);
        errorEvents.push({
          error: errObj.message || 'Unknown error during transformation',
          statusCode: errObj.status,
          jobId,
          statTags: errObj.statTags,
        });
      }
    }

    return { payloads, errorEvents };
  }

  getInputSchema(): ZodType | null {
    return null;
  }

  // --- Framework-provided (not meant to be overridden) ---

  validate(inputs: RouterTransformationRequestData[]): {
    valid: RouterTransformationRequestData[];
    errors: TransformError[];
  } {
    const integrationSchema = this.getInputSchema();
    const schema = integrationSchema ? baseInputSchema.and(integrationSchema) : baseInputSchema;

    const valid: RouterTransformationRequestData[] = [];
    const errors: TransformError[] = [];

    for (const input of inputs) {
      const parseResult = schema.safeParse(input);
      if (!parseResult.success) {
        const errorMessage = [
          ...new Set(
            parseResult.error.issues.map((issue) => {
              const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
              return `${path}${issue.message}`;
            }),
          ),
        ].join('; ');
        errors.push({
          jobId: (input.metadata as Partial<Metadata>)?.jobId ?? 0,
          error: errorMessage,
          statusCode: 400,
          statTags: {
            errorCategory: tags.ERROR_CATEGORIES.DATA_VALIDATION,
            errorType: tags.ERROR_TYPES.INSTRUMENTATION,
          },
        });
      } else {
        valid.push(input);
      }
    }

    return { valid, errors };
  }
}
