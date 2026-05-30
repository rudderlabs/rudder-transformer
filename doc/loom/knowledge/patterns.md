# Architectural Patterns

> Discovered patterns in the codebase that help agents understand how things work.
> This file is append-only - agents add discoveries, never delete.

(Add patterns as you discover them)

## BatchDestination framework

The framework in `src/services/destination/nativeBatching/` orchestrates the full batch transform pipeline:

1. `processBatchedDestination(events, IntegrationClass, reqMetadata)` — main entry
2. Constructs `new IntegrationClass(destination, connection)` — destination+connection are shared across all events in one router request
3. Calls `integration.getInputSchema()` to validate each event (Zod schema)
4. Calls `integration.transformEvent(input)` per event — produces `TransformedEvent<TBody>` with `body`, `endpoint`, `method`, `headers`, `params`, optional `internalGroupKey`
5. Groups payloads by composite key: `(endpoint, method, headers, params, internalGroupKey)`
6. For each group calls `integration.getBatchStrategy(endpoint)` once → returns a `BatchStrategy`
7. Calls `strategy.batch(payloads)` → returns `BatchGroup[]` with final request bodies + jobIds
8. Builds `RouterTransformationResponse[]` returned to rudder-server

### ChunkBatchStrategy pattern (for iterable_audience)

Use `ChunkBatchStrategy` when grouping is already natural (different endpoints = different groups).

```typescript
getBatchStrategy(endpoint: string): BatchStrategy<IterableAudiencePayload> {
  const { listId } = this.connection\!.config.destination;
  const isSubscribe = endpoint.endsWith('/api/lists/subscribe');
  return new ChunkBatchStrategy<IterableAudiencePayload>({
    maxItems: MAX_BATCH_SIZE,
    wrapBody: (bodies) => {
      const subscribers = bodies.map((b) => b.subscriber);
      return isSubscribe
        ? buildSubscribeBody(listId, subscribers)
        : buildUnsubscribeBody(listId, subscribers);
    },
  });
}
```

**Critical:** `wrapBody` receives ONLY `bodies: TBody[]` — no endpoint, no group key. Capture `listId` and `isSubscribe` in the closure via a fresh strategy instance per call to `getBatchStrategy(endpoint)`.

### CustomBatchStrategy vs ChunkBatchStrategy

- `CustomBatchStrategy` — use when you need heterogeneous group branching inside one strategy (like custom_audience with template evaluation per action). Receives the full payloads array.
- `ChunkBatchStrategy` — use when chunking by count/size is sufficient and each group is homogeneous. Subscribe/unsubscribe in iterable_audience use separate endpoints, so separate strategy instances suffice.

### internalGroupKey

Composite group key includes `internalGroupKey`. For iterable_audience, **do NOT set `internalGroupKey`** — the subscribe and unsubscribe endpoints are already different, forming natural groups. Custom_audience sets `internalGroupKey: message.action` because all its actions share the same endpoint.

## audience destination references

### BatchDestination reference (custom_audience)

```typescript
class CustomAudienceIntegration extends BatchDestination<
  Record<string, string>,
  CustomAudienceDestConfig,
  { destination: CustomAudienceConnectionDestConfig }
>
```

- Connection config accessed via `this.connection\!.config.destination`
- Validate `this.connection` exists in constructor; throw `InstrumentationError` if absent
- Pre-compute constants that depend only on destination/connection (not individual events) in constructor

### Record-event audience pattern (customerio_audience)

CustomerIO does NOT use BatchDestination — it uses a direct `processRouterDest` function. Not a reference for iterable_audience's implementation class, but useful for:
- Separating DELETE from INSERT/UPDATE into different endpoint calls
- Wrapping transform errors with `handleRtTfSingleEventError`

## v1 networkHandler strategy pattern

### How iterable's networkHandler works

```typescript
// networkHandler.ts
const strategyRegistry = {
  [TrackIdentifyStrategy.name]: new TrackIdentifyStrategy(),
  [GenericStrategy.name]: new GenericStrategy(),
};
const getResponseStrategy = (endpoint: string) =>
  BULK_ENDPOINTS.some(p => endpoint.includes(p))
    ? strategyRegistry[TrackIdentifyStrategy.name]
    : strategyRegistry[GenericStrategy.name];

function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}
```

### iterable_audience networkHandler pattern

Simpler than the existing iterable networkHandler — only one strategy needed (AudienceListStrategy) since the destination handles only subscribe/unsubscribe:

```typescript
function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = (responseParams) =>
    new AudienceListStrategy().handleResponse(responseParams);
}
```

### BaseStrategy contract

```typescript
abstract class BaseStrategy {
  handleResponse(responseParams: GenericProxyHandlerInput): void  // calls handleSuccess or handleError
  abstract handleError(responseParams: GenericProxyHandlerInput): void
  abstract handleSuccess(responseParams: any): void
}
```

`handleError` → throw `TransformerProxyError` with `responseWithIndividualEvents` (every metadata entry at same status). Set `AuthErrorCategory: 'AUTH'` on 401.

`handleSuccess` → parse `failedUpdates` per-subscriber, return `responseWithIndividualEvents` array.

### createBatchErrorChecker

```typescript
// From src/v1/destinations/iterable/utils.ts
createBatchErrorChecker(destinationResponse: IterableBulkApiResponse)
  → (event: { email?, userId?, eventName? }) => { isAbortable: boolean, errorMsg: string }
```

Pre-builds O(1) lookup Maps over all 12 failure paths (6 email + 6 userId from ITERABLE_RESPONSE_*_PATHS). Call once per response, then call the returned checker once per subscriber.

### UserForgotten compliance pattern

`forgottenEmails` and `forgottenUserIds` = GDPR-deleted users. Return `statusCode: 200` (not 400) + emit metric:
```typescript
stats.counter('iterable_forgotten_user_violations', 1, {
  destType: 'ITERABLE_AUDIENCE', destinationId, workspaceId,
  identifierType: subscriber.email ? 'email' : 'userId',
  // NEVER log identifier value — subject to GDPR deletion
});
```
Reason: non-2xx causes `failed_keys` persistence and infinite retry for identifiers that cannot be retried.

### notFound-on-unsubscribe

`notFoundEmails` / `notFoundUserIds` on an **unsubscribe** request → `statusCode: 200` (no-op success, user was already not on the list).
Same paths on a **subscribe** request → `statusCode: 400` (user not found is an error for subscribe).

Detect unsubscribe via `isUnsubscribe = endpoint.includes('/api/lists/unsubscribe')` in strategy constructor or via `destinationRequest.body.JSON`.

## processAudienceRecord usage pattern

```typescript
import { processAudienceRecord, AudienceField, HashingType } from '../../util/audienceUtils';

// ALWAYS provide config: { isHashRequired: false } — required by audienceUtils.ts:48-56 destructure
// The value is never read when all fields are HashingType.NONE
const processed = processAudienceRecord(remapped, {
  fieldConfigs: IDENTIFIER_FIELD_CONFIG,
  destination: {
    workspaceId: metadata.workspaceId,
    id: destination.ID,
    type: DESTINATION_TYPE,
    config: { isHashRequired: false },
  },
});

// Returns empty object when all identifiers are null/empty/invalid
if (Object.keys(processed).length === 0) {
  throw new InstrumentationError('All identifier values are empty after normalization');
}
```

## Zod validation in BatchDestination

`getInputSchema()` returns a `ZodType`. Use `.passthrough()` on nested objects to avoid stripping unknown fields:

```typescript
getInputSchema(): ZodType {
  return z.object({
    message: z.object({
      type: z.literal('record'),
      action: z.enum(['insert', 'update', 'delete']),
      identifiers: z.record(z.unknown()),
    }).passthrough(),
  }).passthrough();
}
```

## Integration test pattern (processBatchedDestination)

```typescript
// Unit test pattern
import { processBatchedDestination } from '../../../services/destination/nativeBatching/batchDestination';
import { Integration } from './routerTransform';

const result = await processBatchedDestination(inputs, Integration, {});
```

This is the canonical way to exercise the BatchDestination in unit tests.

## BatchDestination audience pattern (end-to-end)

Complete pattern for adding a new audience destination using the BatchDestination framework:

**1. Per-endpoint grouping (no internalGroupKey needed)**

Subscribe and unsubscribe land on different endpoints → the BatchDestination framework's composite key `(endpoint, method, headers, params)` already creates separate groups. Do NOT set `internalGroupKey` — only needed when multiple actions share the same endpoint (e.g., `custom_audience`).

**2. Per-row identifier normalization via processAudienceRecord**

```typescript
// Always HashingType.NONE for plain identifiers; config.isHashRequired must be present
const processed = processAudienceRecord(remapped, {
  fieldConfigs: IDENTIFIER_FIELD_CONFIG,
  destination: {
    workspaceId: metadata.workspaceId,
    id: destination.ID,
    type: DESTINATION_TYPE,
    config: { isHashRequired: false },  // required by destructure at audienceUtils.ts:48-56
  },
});

if (Object.keys(processed).length === 0) {
  throw new InstrumentationError('All identifier values are empty after normalization');
}
```

`processAudienceRecord` applies field-level normalization (e.g., email → lowercase), validation, and optional hashing. Returns empty object when all identifiers are null/empty/invalid — throw `InstrumentationError` immediately.

**3. Per-endpoint ChunkBatchStrategy (fresh instance per call)**

```typescript
getBatchStrategy(endpoint: string): BatchStrategy<IterableAudiencePayload> {
  const { listId } = this.connection\!.config.destination;
  const isSubscribe = endpoint.endsWith('/api/lists/subscribe');
  return new ChunkBatchStrategy<IterableAudiencePayload>({
    maxItems: MAX_BATCH_SIZE,
    wrapBody: (bodies) => isSubscribe
      ? buildSubscribeBody(listId, bodies.map(b => b.subscriber))
      : buildUnsubscribeBody(listId, bodies.map(b => b.subscriber)),
  });
}
```

The endpoint string acts as both the group discriminator AND the runtime branch signal for wrapBody. Fresh instance per call captures closure state.

**4. Email case-folding**

`processAudienceRecord` with `normalize: (v) => v.toLowerCase()` lowercases email on input. The subscriber sent to Iterable must also be lowercase — apply `email.toLowerCase()` when constructing the subscriber object.

## v1 strategy reuse from existing iterable destination

`iterable_audience` v1 reuses the following from `src/v1/destinations/iterable/` with zero changes to the source:

| Symbol | Source file | How reused |
|--------|-------------|-----------|
| `BaseStrategy` | `strategies/base.ts` | `AudienceListStrategy extends BaseStrategy` |
| `createBatchErrorChecker` | `utils.ts` | Pre-builds O(1) lookup Maps over all 12 failedUpdates paths |
| `FailedUpdates` | `types.ts` | Type for `response.failedUpdates` in handleSuccess |
| `GeneralApiResponse` | `types.ts` | Inner response type |
| `IterableBulkApiResponse` | `types.ts` | Full response shape from processAxiosResponse |

The `AudienceListStrategy` file re-exports `IterableBulkApiResponse` from `iterable/types.ts` rather than duplicating the type. The pattern is: add a local `types.ts` in `iterable_audience/` that re-exports types and narrows only what differs (e.g., a narrower subscriber shape).
