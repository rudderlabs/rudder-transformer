# Batching Framework — Types & Abstract Class Contract

All types are defined in `src/services/destination/routerIntegration.ts`.

## Framework Types

### TransformedPayload\<TBody\>

One transformed event payload produced by `transformEvent`. Contains the destination-specific body, HTTP details, and the originating jobId.

```typescript
type TransformedPayload<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  body: TBody;                          // Destination-specific payload (single event's contribution)
  endpoint: string;                     // Full URL: 'https://app.posthog.com/batch'
  method: string;                       // HTTP method: 'POST'
  headers?: Record<string, unknown>;    // e.g. { 'Content-Type': 'application/json' }
  params?: Record<string, unknown>;     // Query params
  jobId: string;                        // Originating job ID (set by framework)
};
```

**Key design**: `TBody` is generic — each destination defines its own body shape. The framework only touches `body` when applying the `BatchStrategy`.

### TransformedErrorEvent

A single event that failed during transformation in `transformEvent` or `batchTransform`.

```typescript
type TransformedErrorEvent = {
  error: string;                        // Human-readable error message
  statusCode: number;                   // HTTP status (400 for instrumentation, 500 for retryable)
  jobId: string;                        // Job that failed
  statTags?: Record<string, unknown>;   // Optional metrics tags
};
```

### TransformResult\<TBody\>

Return type of `batchTransform` — contains both successes and failures.

```typescript
type TransformResult<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  payloads: TransformedPayload<TBody>[];    // Successfully transformed payloads
  errorEvents: TransformedErrorEvent[];     // Per-event failures
};
```

### BatchStrategy

Describes how to combine payloads within a group. Created via factory functions.

```typescript
type ChunkStrategy<TBody> = {
  type: 'chunk';
  maxSize?: number;                     // Max items per chunk (default: Infinity)
  maxBytes?: string;                    // Max bytes per chunk: '4MB', '512KB'
  wrapBody: (bodies: TBody[]) => Record<string, unknown>;  // Construct the final chunked payload
};

type CustomBatchStrategy<TBody> = {
  type: 'customBatch';
  batch: (payloads: TransformedPayload<TBody>[]) => CustomBatchResult[];
};

type CustomBatchResult = {
  body: Record<string, unknown>;
  jobIds: string[];
};

type BatchStrategy<TBody> = ChunkStrategy<TBody> | CustomBatchStrategy<TBody>;
```

**Factory functions** (preferred way to construct strategies):

```typescript
// For Format 1/2/3 — simple array chunking with a body wrapper
function chunk<TBody>(opts: {
  maxSize?: number;
  maxBytes?: string;
  wrapBody: (bodies: TBody[]) => Record<string, unknown>;
}): ChunkStrategy<TBody>;

// For Format 4 — full control over batching (cross-event merge, dedup, etc.)
function customBatch<TBody>(
  batchFn: (payloads: TransformedPayload<TBody>[]) => CustomBatchResult[],
): CustomBatchStrategy<TBody>;
```

## Abstract Class: RouterIntegration\<TBody\>

```typescript
abstract class RouterIntegration<TBody extends Record<string, unknown> = Record<string, unknown>> {
  // ─── MUST implement ────────────────────────────────────────────────

  /**
   * Transform ONE event into one or more payloads.
   * ~5 lines for simple destinations. The framework handles iteration,
   * try/catch, error collection, and jobId tracking.
   */
  abstract transformEvent(
    input: RouterTransformationRequestData,
  ): TransformedPayload<TBody> | TransformedPayload<TBody>[];

  /**
   * Return a batch strategy for the given group key.
   * Receives the groupBy key so per-group limits are easy.
   */
  abstract getBatchStrategy(groupKey: string): BatchStrategy<TBody>;

  // ─── MAY override ──────────────────────────────────────────────────

  /**
   * Partition payloads before batching. Returns a string key —
   * framework groups payloads with the same key together.
   * Default: group by endpoint.
   */
  groupBy(payload: TransformedPayload<TBody>): string {
    return payload.endpoint;
  }

  /**
   * Iterate inputs, call transformEvent(), catch errors.
   * Override for pre-batch bulk operations (e.g., Braze dedup lookup).
   * Call super.batchTransform() to delegate iteration back to framework.
   */
  async batchTransform(
    inputs: RouterTransformationRequestData[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<TBody>> {
    // Default implementation:
    // for each input:
    //   try { payloads.push(...toArray(this.transformEvent(input))) }
    //   catch { errorEvents.push({ error, statusCode, jobId }) }
    // return { payloads, errorEvents }
  }

  /**
   * Destination-specific Zod schema for input validation.
   * Framework fuses with base schema (RudderMessage + metadata + destination).
   * Default: null (no additional rules).
   */
  getIntegrationSchema(): ZodType | null {
    return null;
  }

  // ─── Framework-provided (not overridable) ──────────────────────────

  /**
   * Validates all inputs against fused schema (base + integration).
   * Invalid events → error responses with statTags; valid inputs → returned.
   */
  validate(
    inputs: RouterTransformationRequestData[],
    results: RouterTransformationResponse[],
  ): RouterTransformationRequestData[];
}
```

## Base Input Schema (Zod)

Applied to every event before destination-specific validation:

```typescript
const baseInputSchema = z.object({
  message: RudderMessageSchema, // userId?, anonymousId?, type (enum), channel?, ...passthrough
  metadata: z.object({ jobId: z.union([z.string(), z.number()]) }).passthrough(),
  destination: z.object({}).passthrough(),
});
```

The base schema ensures:

- `message` conforms to the RudderStack event spec
- `metadata.jobId` is always present (string or number)
- `destination` object exists

Integration schemas are **fused** with this base via `baseInputSchema.and(integrationSchema)`, producing a single-pass Zod validation.

## Validation Error Format

When an event fails validation, the framework pushes:

```typescript
{
  metadata: [input.metadata],
  destination: input.destination,
  batched: false,
  statusCode: 400,
  error: 'Zod issue message 1; Zod issue message 2',
  statTags: {
    errorCategory: 'dataValidation',    // tags.ERROR_CATEGORIES.DATA_VALIDATION
    errorType: 'instrumentation',       // tags.ERROR_TYPES.INSTRUMENTATION
  },
}
```

The `statTags` are **required** for `handleRouterTransformSuccessEvents` to correctly route these to `event_transform_failure` metrics (it checks `'error' in resp && isObject(resp.statTags) && !isEmpty(resp.statTags)`).

## Server Response Format

The framework wraps each batch result into the standard server envelope:

```typescript
{
  batchedRequest: {
    version: '1',
    type: 'REST',
    method: method,
    endpoint: endpoint,
    headers: headers ?? {},
    params: params ?? {},
    body: {
      JSON: wrappedBody,    // ← output of wrapBody() or customBatch
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    files: {},
  },
  metadata: resolvedMetadataArray,
  destination: destination,
  batched: true,
  statusCode: 200,
}
```

## Helper Functions

| Function                                | Purpose                                                 |
| --------------------------------------- | ------------------------------------------------------- |
| `parseSizeToBytes(size)`                | Parses `'4MB'`, `'512KB'` → bytes                       |
| `groupByDontBatchDirective(inputs)`     | Splits inputs on `metadata.dontBatch` flag              |
| `resolveMetadatas(jobIds, metadataMap)` | Maps jobId strings back to full Metadata objects        |

## Export Pattern

Destinations export the **class** (not an instance) to support per-call instantiation:

```typescript
// Correct:
export const Integration = PostHogIntegration;

// Wrong (race condition with mutable state):
// export const integration = new PostHogIntegration();
```

The framework caches the constructor in `FetchHandler` and creates a fresh instance per `processBatchedDestination` call.
