---
name: batching-framework
description: Native batching framework for destination transformations. Extend BatchDestination to implement per-event transforms with automatic grouping, chunking, and response formatting.
---

# Native Batching Framework

**Objective:** Use the batching framework to implement destination router transforms. Instead of writing manual grouping/batching logic, extend the `BatchDestination` abstract class — the framework handles validation, grouping, chunking, error wrapping, and response formatting.

## Reference

- `src/v0/destinations/posthog/routerTransform.ts` — `ChunkBatchStrategy` with `maxPayloadSize`
- `src/v0/destinations/custom_audience/routerTransform.ts` — `CustomBatchStrategy` with template evaluation
- `src/services/destination/nativeBatching/` — Framework source code

## Architecture

```
RouterTransformationRequestData[]
    |
processBatchedDestination()          [framework orchestrator]
    |
BatchDestination<TBody>              [your integration class]
    |--- getInputSchema()            → Zod schema for upfront validation
    |--- transformEvent()            → per-event transform → TransformedEvent<TBody>
    |--- getBatchStrategy()          → batch strategy factory
    |
Framework groups by composite key:  (endpoint, method, headers, params, internalGroupKey)
    |
BatchStrategy.batch()                [chunking/wrapping]
    |
RouterTransformationResponse[]
```

## File Structure

```
src/v0/destinations/<dest_name>/
├── routerTransform.ts        # BatchDestination subclass (exported as Integration)
├── types.ts                  # Zod schemas, TypeScript types
├── config.ts                 # Constants, endpoints, action maps
├── utils.ts                  # (Optional) Field processing, API helpers
└── routerTransform.test.ts   # Unit tests
```

## BatchDestination Abstract Class

```typescript
import { BatchDestination } from '../../../services/destination/nativeBatching/batchDestination';

// Type parameters:
//   TBody         — shape of each item in the batch (your per-event payload)
//   TConfig       — destination config type (from destination.Config)
//   TConnectionConfig — connection config type (from connection.config)

class MyIntegration extends BatchDestination<TBody, TConfig, TConnectionConfig> {
  // MUST implement these three methods:

  transformEvent(
    input: RouterTransformationRequestData,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[];
  // Transform a single input event into one or more intermediate payloads.
  // Throw InstrumentationError for bad input — framework wraps it into error response.

  getBatchStrategy(endpoint: string): BatchStrategy<TBody>;
  // Return a batch strategy instance that defines how events are chunked and wrapped.

  getInputSchema(): ZodType;
  // Return a Zod schema for input validation (run before transformEvent).
}

export const Integration = MyIntegration;
```

## TransformedEvent Type

```typescript
type TransformedEvent<TBody> = {
  body: TBody; // Individual event payload
  endpoint: string; // API endpoint
  method: string; // HTTP method (POST, PUT, DELETE, etc.)
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  internalGroupKey?: string; // Extra grouping dimension (see below)
};
```

The framework groups all `TransformedEvent` objects by a composite key of `(endpoint, method, headers, params, internalGroupKey)`. Events in the same group are batched together.

### The `internalGroupKey` Pattern

Use `internalGroupKey` to force events into separate batches beyond the default grouping. Common use cases:

- **Action-based grouping**: ADD vs REMOVE events need separate API calls
- **Schema-based grouping**: Events with different field schemas can't share a batch

```typescript
return {
  body: payload,
  endpoint: getEndpoint(audienceId),
  method: 'POST',
  internalGroupKey: action, // 'ADD' and 'REMOVE' get separate batches
};
```

## Batch Strategies

### ChunkBatchStrategy (default for most destinations)

Standard chunking by item count and/or payload size:

```typescript
import { ChunkBatchStrategy } from '../../../services/destination/nativeBatching/chunkBatchStrategy';

getBatchStrategy(): BatchStrategy<TBody> {
  return new ChunkBatchStrategy<TBody>({
    maxItems: 10000,           // Max events per batch (optional)
    maxPayloadSize: '10MB',    // Max total request size (optional, e.g., '512KB', '4MB')
    wrapBody: (bodies) => ({   // REQUIRED: wraps array of event bodies into final request body
      api_key: this.destination.Config.apiKey,
      batch: bodies,
    }),
  });
}
```

Size strings support: `'10MB'`, `'512KB'`, `'4MB'`, `'1GB'` — parsed via `parseSizeToBytes()`.

The `wrapBody` function:

- Receives an array of `TBody` objects (the individual event payloads)
- Returns the final `Record<string, unknown>` that becomes `batchedRequest.body.JSON`
- Is also used for size measurement when `maxPayloadSize` is set

### CustomBatchStrategy (for complex batching logic)

Full control over how events are grouped and wrapped:

```typescript
import { CustomBatchStrategy } from '../../../services/destination/nativeBatching/customBatchStrategy';
import { chunkPayloads } from '../../../services/destination/nativeBatching/chunkPayloads';

getBatchStrategy(): BatchStrategy<TBody> {
  return new CustomBatchStrategy<TBody>(async (payloads) => {
    // payloads: Array<TransformedEvent<TBody> & { jobId: number }>

    const chunks = chunkPayloads(payloads, {
      maxItems: batchSize,
      wrapBody: () => { throw new Error('not used'); },
    });

    // Custom processing per chunk (e.g., template evaluation, custom serialization)
    return chunks.map((chunk) => ({
      body: buildCustomBody(chunk.bodies),
      jobIds: chunk.jobIds,           // Set<number> of jobIds in this chunk
    }));
  });
}
```

Returns `BatchGroup[]`:

```typescript
type BatchGroup = {
  body: Record<string, unknown>; // Final wrapped body
  jobIds: Set<number>; // All jobIds in this batch
};
```

## Enabling the Framework

Register the destination in `src/constants/batchedDestinationsMap.ts`:

```typescript
export const batchedDestinationsMap: Record<string, true> = {
  POSTHOG: true,
  CUSTOM_AUDIENCE: true,
  <DEST_NAME_UPPER>: true,  // Add your destination here
};
```

To enable destination on routerTransform, feature.ts also needs to be updated with definitionName under defaultFeaturesConfig `src/features.ts`

When enabled, the platform routes events through `processBatchedDestination()` instead of the legacy `processRouterDest()`.

For gradual rollout before GA, use the env var pattern:
`{DEST_NAME_UPPER}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` (comma-separated workspace IDs or `ALL`).

## Testing

Test via the framework's `processBatchedDestination` function — pass the `Integration` class (not an instance):

```typescript
import { processBatchedDestination } from '../../../services/destination/nativeBatching/processBatchedDestination';
import { Integration } from './routerTransform';

const buildDestination = (overrides = {}) => ({
  ID: 'dest-1',
  Config: { /* destination config */ ...overrides },
});

const buildConnection = (overrides = {}) => ({
  config: { destination: { /* connection config */ ...overrides } },
});

const buildInput = (jobId: number, overrides = {}) => ({
  message: { type: 'record', action: 'insert', fields: {}, identifiers: {}, ...overrides },
  metadata: { jobId, workspaceId: 'ws-1', secret: { accessToken: 'token' } },
  destination: buildDestination(),
  connection: buildConnection(),
});

describe('Integration via processBatchedDestination', () => {
  it('batches events by action', async () => {
    const inputs = [
      buildInput(1, { action: 'insert' }),
      buildInput(2, { action: 'insert' }),
      buildInput(3, { action: 'delete' }),
    ];
    const results = await processBatchedDestination(inputs, Integration, {});
    // Assert batch structure, grouping, metadata
  });

  it('returns error for invalid input', async () => {
    const inputs = [buildInput(1, { type: 'track' })]; // wrong type
    const results = await processBatchedDestination(inputs, Integration, {});
    expect(results[0].statusCode).toBe(400);
  });
});
```

**Reference:** `src/v0/destinations/custom_audience/routerTransform.test.ts` — Complete test suite with helper factories, action grouping, hashing, auth, and error cases.

## Error Handling

The framework handles error wrapping automatically:

- **Zod validation failure** (from `getInputSchema`) → 400 error response with formatted message
- **Errors thrown in `transformEvent()`** → per-event error response (other events still succeed)
- **Errors thrown in `getBatchStrategy().batch()`** → affects all events in that batch group

Use `InstrumentationError` for bad input data (no retry), `ConfigurationError` for bad config (no retry).

## Metrics

The framework emits these metrics automatically:

- `dont_batch_events` — count of events with `dontBatch` flag
- `output_batch_size` — histogram of events per output batch
