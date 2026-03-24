# Batching Framework — Types & Abstract Class Contract

All types are defined in `src/services/destination/routerIntegration.ts`.

## Framework Types

### GroupedSuccessEvents\<TBody\>

One group of successfully transformed events sharing the same endpoint. The `body` is the full destination-specific request body with the chunkable array already embedded.

```typescript
type GroupedSuccessEvents<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  endpoint: string; // Full URL: 'https://api.braze.com/users/track'
  method: string; // HTTP method: 'POST'
  headers?: Record<string, unknown>; // e.g. { 'Content-Type': 'application/json' }
  params?: Record<string, unknown>; // Query params
  body: TBody; // Destination-specific payload
  jobIds: string[]; // Aligned 1:1 with items at payloadHierarchyPath
};
```

**Key design**: `TBody` is generic — each destination defines its own body shape. The framework only touches the array at `payloadHierarchyPath` during chunking.

### TransformedErrorEvent

A single event that failed during transformation in `batchTransform`.

```typescript
type TransformedErrorEvent = {
  error: string; // Human-readable error message
  statusCode: number; // HTTP status (400 for instrumentation, 500 for retryable)
  jobId: string; // Job that failed
  statTags?: Record<string, unknown>; // Optional metrics tags
};
```

### BatchTransformResult\<TBody\>

Return type of `batchTransform` — contains both successes and failures.

```typescript
type BatchTransformResult<TBody extends Record<string, unknown> = Record<string, unknown>> = {
  groupedEvents: GroupedSuccessEvents<TBody>[]; // Endpoint-grouped successes
  errorEvents: TransformedErrorEvent[]; // Per-event failures
};
```

### BatchConfig

Chunking configuration returned by `getBatchConfig`.

```typescript
type BatchConfig = {
  payloadHierarchyPath: string; // Dot-notation path to chunkable array in body
  // Examples: 'batch', 'data.events', 'operations[0].create.ids'
  maxChunkSize?: number; // Max items per chunk (default: Infinity)
  maxPayloadSize?: string; // Max bytes per chunk: '4MB', '512KB', '1GB'
};
```

**payloadHierarchyPath** supports:

- Simple keys: `'batch'`
- Nested paths: `'data.events'`
- Array index notation: `'operations[0].create.userIdentifiers'`

### BatchRequest

Shape of a single HTTP request after chunking, before the framework wraps it in server format.

```typescript
type BatchRequest = {
  body: Record<string, unknown>; // The chunked payload
  endpoint: string; // Full URL
  method: string; // HTTP method
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  endpointPath?: string; // Optional suffix for routing
};
```

### PostTransformResult

Pairs a `BatchRequest` with its aligned jobIds. Returned by `postTransform`.

```typescript
type PostTransformResult = {
  batchRequest: BatchRequest;
  jobIds: string[];
};
```

## Abstract Class: RouterIntegration\<TBody\>

```typescript
abstract class RouterIntegration<TBody extends Record<string, unknown> = Record<string, unknown>> {
  // ─── MUST implement ────────────────────────────────────────────────

  /**
   * Transform ALL events and group them into endpoint buckets.
   * Each group's body is the full destination request payload.
   * Async — can do bulk lookups (dedup, identity resolution) first.
   */
  abstract batchTransform(
    inputs: RouterTransformationRequestData[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<BatchTransformResult<TBody>>;

  // ─── MAY override ──────────────────────────────────────────────────

  /**
   * Receive one endpoint group, chunk it, return BatchRequests.
   * Default: reads getBatchConfig(), calls chunkGroup(), returns chunks as-is.
   * Override for custom post-chunk logic (dedup, field merging, re-grouping).
   */
  postTransform(
    group: GroupedSuccessEvents<TBody>,
    destination: Destination,
  ): PostTransformResult[];

  /**
   * Chunking config. Override to set path, max items, max bytes.
   * Default: { payloadHierarchyPath: 'events', maxChunkSize: 500 }
   */
  getBatchConfig(destination?: Destination): BatchConfig;

  /**
   * Destination-specific Zod schema for input validation.
   * Framework fuses with base schema (RudderMessage + metadata + destination).
   * Default: null (no additional rules).
   */
  getIntegrationSchema(): ZodType | null;

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

The framework wraps each `BatchRequest` into the standard server envelope:

```typescript
{
  batchedRequest: {
    version: '1',
    type: 'REST',
    method: batchRequest.method,
    endpoint: batchRequest.endpoint,
    headers: batchRequest.headers ?? {},
    params: batchRequest.params ?? {},
    body: {
      JSON: batchRequest.body,    // ← destination payload goes here
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
| `setValueAtPath(obj, path, value)`      | Sets value at dot-notation path (supports `arr[0].key`) |
| `getValueAtPath(obj, path)`             | Reads value at dot-notation path                        |
| `parseSizeToBytes(size)`                | Parses `'4MB'`, `'512KB'` → bytes                       |
| `chunkGroup(group, config)`             | Splits one group into chunks by count/size limits       |
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
