import { z, ZodType } from 'zod';
import stableStringify from 'fast-json-stable-stringify';
import type { Destination } from '../../types/controlPlaneConfig';
import { RudderMessageSchema, MetadataSchema } from '../../types/rudderEvents';
import type { Metadata } from '../../types/rudderEvents';
import type {
  BatchedRequestBody,
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../types/destinationTransformation';
import tags from '../../v0/util/tags';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TransformedPayload<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  body: TBody;
  endpoint: string;
  method: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  jobId: number;
};

export type TransformedErrorEvent = {
  error: string;
  statusCode: number;
  jobId: number;
  statTags?: Record<string, unknown>;
};

export type TransformResult<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  payloads: TransformedPayload<TBody>[];
  errorEvents: TransformedErrorEvent[];
};

export type ChunkStrategy<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  type: 'chunk';
  maxSize?: number;
  maxBytes?: string;
  wrapBody: (bodies: TBody[]) => Record<string, unknown>;
};

export type CustomBatchResult = {
  body: Record<string, unknown>;
  jobIds: Set<number>;
};

export type CustomBatchStrategy<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  type: 'customBatch';
  batch: (payloads: TransformedPayload<TBody>[]) => CustomBatchResult[];
};

export type BatchStrategy<TBody extends Record<string, unknown> = Record<string, unknown>> =
  | ChunkStrategy<TBody>
  | CustomBatchStrategy<TBody>;

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

export function chunk<TBody extends Record<string, unknown> = Record<string, unknown>>(opts: {
  maxSize?: number;
  maxBytes?: string;
  wrapBody: (bodies: TBody[]) => Record<string, unknown>;
}): ChunkStrategy<TBody> {
  return { type: 'chunk', ...opts };
}

export function customBatch<TBody extends Record<string, unknown> = Record<string, unknown>>(
  batchFn: (payloads: TransformedPayload<TBody>[]) => CustomBatchResult[],
): CustomBatchStrategy<TBody> {
  return { type: 'customBatch', batch: batchFn };
}

// ---------------------------------------------------------------------------
// Base Zod schema for input validation
// ---------------------------------------------------------------------------

const baseInputSchema = z.object({
  message: RudderMessageSchema,
  metadata: MetadataSchema,
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
  batchable: RouterTransformationRequestData[];
  nonBatchable: RouterTransformationRequestData[];
} {
  const batchable: RouterTransformationRequestData[] = [];
  const nonBatchable: RouterTransformationRequestData[] = [];
  for (const input of inputs) {
    if (input.metadata?.dontBatch === true) {
      nonBatchable.push(input);
    } else {
      batchable.push(input);
    }
  }
  return { batchable, nonBatchable };
}

export function resolveMetadatas(
  jobIds: Set<number>,
  metadataMap: Map<number, Partial<Metadata>>,
): Partial<Metadata>[] {
  return Array.from(jobIds)
    .map((id) => metadataMap.get(id)!)
    .filter(Boolean);
}

type PayloadGroup<TBody extends Record<string, unknown>> = {
  endpoint: string;
  method: string;
  headers: Record<string, unknown> | undefined;
  params: Record<string, unknown> | undefined;
  payloads: TransformedPayload<TBody>[];
};

export function groupPayloadsByCompositeKey<
  TBody extends Record<string, unknown> = Record<string, unknown>,
>(payloads: TransformedPayload<TBody>[]): PayloadGroup<TBody>[] {
  const map = new Map<string, PayloadGroup<TBody>>();

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
// Abstract class: RouterIntegration<TBody>
// ---------------------------------------------------------------------------

// Constructor type for RouterIntegration subclasses — used by the framework to instantiate per request
export type RouterIntegrationConstructor<
  TBody extends Record<string, unknown> = Record<string, unknown>,
> = new (destination: Destination) => RouterIntegration<TBody>;

export abstract class RouterIntegration<
  TBody extends Record<string, unknown> = Record<string, unknown>,
> {
  protected destination: Destination;

  constructor(destination: Destination) {
    this.destination = destination;
  }

  // --- MUST implement ---

  abstract transformEvent(
    input: RouterTransformationRequestData,
  ): Omit<TransformedPayload<TBody>, 'jobId'> | Omit<TransformedPayload<TBody>, 'jobId'>[];

  abstract getBatchStrategy(endpoint?: string): BatchStrategy<TBody>;

  // --- MAY override ---

  /**
   * Wraps the batched body into the BatchedRequestBody envelope.
   * Default places body in JSON. Override for JSON_ARRAY, XML, FORM, etc.
   */
  buildRequestBody(body: Record<string, unknown>): BatchedRequestBody {
    return {
      JSON: body,
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    };
  }

  async batchTransform(
    inputs: RouterTransformationRequestData[],
    _reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<TBody>> {
    // TODO: remove this
    console.log(_reqMetadata);
    const payloads: TransformedPayload<TBody>[] = [];
    const errorEvents: TransformedErrorEvent[] = [];

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
        errorEvents.push({
          error: error.message || 'Unknown error during transformation',
          statusCode: error.statusCode || 500,
          jobId,
          statTags: error.statTags,
        });
      }
    }

    return { payloads, errorEvents };
  }

  getIntegrationSchema(): ZodType | null {
    return null;
  }

  // --- Framework-provided (not meant to be overridden) ---

  validate(
    inputs: RouterTransformationRequestData[],
    errorResults: RouterTransformationResponse[],
  ): RouterTransformationRequestData[] {
    const integrationSchema = this.getIntegrationSchema();
    const schema = integrationSchema ? baseInputSchema.and(integrationSchema) : baseInputSchema;

    const validInputs: RouterTransformationRequestData[] = [];

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
        errorResults.push({
          metadata: [input.metadata],
          destination: input.destination,
          batched: false,
          statusCode: 400,
          error: errorMessage,
          statTags: {
            errorCategory: tags.ERROR_CATEGORIES.DATA_VALIDATION,
            errorType: tags.ERROR_TYPES.INSTRUMENTATION,
          },
        });
      } else {
        validInputs.push(input);
      }
    }

    return validInputs;
  }
}
