# Entry Points

> Key files agents should read first to understand the codebase.
> This file is append-only - agents add discoveries, never delete.

(Add entry points as you discover them)

## Existing iterable v0

`src/v0/destinations/iterable/config.js` — **read first before writing any iterable_audience config**

Exports:
- `BASE_URL = { USDC: 'https://api.iterable.com/api/', EUDC: 'https://api.eu.iterable.com/api/' }`
- `constructEndpoint(dataCenter: 'USDC' | 'EUDC', category: { endpoint: string }): string` — concatenates base URL + category endpoint; defaults to USDC on unknown key
- `ITERABLE_RESPONSE_EMAIL_PATHS: string[]` — 6 paths: `['invalidEmails', 'failedUpdates.invalidEmails', 'failedUpdates.notFoundEmails', 'failedUpdates.forgottenEmails', 'failedUpdates.conflictEmails', 'failedUpdates.invalidDataEmails']`
- `ITERABLE_RESPONSE_USER_ID_PATHS: string[]` — 6 paths: `['invalidUserIds', 'failedUpdates.invalidUserIds', 'failedUpdates.notFoundUserIds', 'failedUpdates.forgottenUserIds', 'failedUpdates.conflictUserIds', 'failedUpdates.invalidDataUserIds']`
- `INITIAL_CHUNK_SIZE = 1000`, `MAX_BODY_SIZE_IN_BYTES = 4000000`, `CATALOG_MAX_ITEMS_PER_REQUEST = 1000`
- `BULK_ENDPOINTS = ['/api/users/bulkUpdate', '/api/events/trackBulk']`

`src/v0/destinations/iterable/` — directory: config.js, transform.js, util.js, deleteUsers.js, data/ (JSON mappings). The `transform.js` handles IDENTIFY, PAGE, SCREEN, TRACK, ALIAS events — **not record events**. iterable_audience is a separate destination for record events.

## Existing iterable v1

`src/v1/destinations/iterable/strategies/base.ts` — `BaseStrategy` abstract class:
```typescript
abstract class BaseStrategy {
  handleResponse(responseParams: GenericProxyHandlerInput): void  // routes to handleSuccess/handleError
  abstract handleError(responseParams: GenericProxyHandlerInput): void
  abstract handleSuccess(responseParams: any): void
}
```

`src/v1/destinations/iterable/utils.ts` — `createBatchErrorChecker(destinationResponse: IterableBulkApiResponse)`:
- Pre-builds O(1) lookup Maps over every `failedUpdates.*` path (scans ITERABLE_RESPONSE_*_PATHS)
- Returns checker function `(event: any) => { isAbortable: boolean, errorMsg: string }`
- `isAbortable: true` = identifier is in a failed path → mark event as 400 error
- `isAbortable: false` = identifier not in any failed path → mark event as 200

`src/v1/destinations/iterable/types.ts` — key types:
```typescript
type FailedUpdates = {
  invalidEmails?: string[]; invalidUserIds?: string[];
  notFoundEmails?: string[]; notFoundUserIds?: string[];
  invalidDataEmails?: string[]; invalidDataUserIds?: string[];
  conflictEmails?: string[]; conflictUserIds?: string[];
  forgottenEmails?: string[]; forgottenUserIds?: string[];
};
type GeneralApiResponse = { msg?, code?, params?, successCount?, failCount?, invalidEmails?, invalidUserIds?, filteredOutFields?, createdFields?, disallowedEventNames?, failedUpdates?: FailedUpdates };
type IterableBulkApiResponse = { status: number; response: GeneralApiResponse };
type IterableBulkProxyInput = { destinationResponse: IterableBulkApiResponse; rudderJobMetadata: ProxyMetdata[]; destType: string; destinationRequest?: { body: { JSON: { events?: any[]; users?: any[] } } } };
```

`src/v1/destinations/iterable/networkHandler.ts` — strategy registry keyed by endpoint: BULK_ENDPOINTS → TrackIdentifyStrategy, else GenericStrategy.

## BatchDestination Framework

`src/services/destination/nativeBatching/batchDestination.ts` — `BatchDestination<TBody, TConfig, TConnectionConfig>` abstract class:
- Constructor: `(destination: Destination<TConfig>, connection?: Connection<TConnectionConfig>)` — sets `this.destination` and `this.connection`
- Connection populated at construction (lines 44-47); non-null assert `this.connection\!` is safe for audience destinations (always have connection)
- Abstract methods: `transformEvent()`, `getBatchStrategy(endpoint: string)`, `getInputSchema()`

`src/services/destination/nativeBatching/chunkBatchStrategy.ts` — `ChunkBatchStrategy<TBody>`:
- Constructor: `{ maxItems?, maxPayloadSize?, bodyFormat?, wrapBody: (bodies: TBody[]) => Record<string, unknown> }`
- **`wrapBody` receives only `bodies: TBody[]` — no endpoint, no group key**. Strategy must close over external state (listId, subscribe/unsubscribe branch) via constructor.

`src/services/misc.ts:32-34` — `getBatchDestinationHandler` hardcodes v0 path:
```typescript
return require(`../v0/destinations/${dest}/routerTransform`).Integration;
```

`src/constants/batchedDestinationsMap.ts` — current GA entries: `{ POSTHOG: true, CUSTOM_AUDIENCE: true }`. Add `ITERABLE_AUDIENCE: true` here.

## Audience Utilities

`src/v0/util/audienceUtils.ts` — `processAudienceRecord(record, { fieldConfigs, destination })`:
- `record: Record<string, unknown>` — field values keyed by field name
- `fieldConfigs: Record<string, AudienceField>` — per-field config with `hashingType`, `normalize`, `validate`
- `destination: { workspaceId, id, type, config: { isHashRequired: boolean } }` — the `isHashRequired` field is destructured at lines 48-56; **pass `config: { isHashRequired: false }` even when hashing is not needed** (required by the destructure)
- Returns `Record<string, string>` — normalized (and optionally hashed) values; drops null/empty/invalid entries
- When every `AudienceField` is `HashingType.NONE`, the `isHashable` branch never executes — `isHashRequired` value is irrelevant but must be present

```typescript
interface AudienceField {
  hashingType: HashingType;
  normalize: ((v: string) => string) | undefined;
  validate?: (normalized: string) => boolean;
}
enum HashingType { SHA256 = 'SHA256', SHA512 = 'SHA512', MD5 = 'MD5', NONE = 'NONE' }
```

`src/v0/util/recordUtils.js` — `EVENT_TYPES = { INSERT: 'insert', DELETE: 'delete', UPDATE: 'update' }`

## Reference Implementations

`src/v0/destinations/custom_audience/routerTransform.ts` — canonical BatchDestination reference:
- Extends `BatchDestination<Record<string, string>, CustomAudienceDestConfig, { destination: CustomAudienceConnectionDestConfig }>`
- Uses `CustomBatchStrategy` (not ChunkBatchStrategy) because it has custom template evaluation logic
- Uses `internalGroupKey: message.action` to force separate groups per action
- Accesses connection config via `this.connection\!.config.destination`

`src/v0/destinations/customerio_audience/transform.ts` — record-event pattern (NOT BatchDestination): uses direct processRouterDest function, splits DELETE from INSERT/UPDATE, sends to different endpoints.

## New iterable_audience Files (to create)

```
src/v0/destinations/iterable_audience/
  config.ts          — DESTINATION_TYPE, getSubscribeEndpoint, getUnsubscribeEndpoint, ACTION_RECORD_MAP, MAX_BATCH_SIZE, PROJECT_TYPES
  types.ts           — Zod schemas: IterableAccountConfigSchema, IterableConnectionConfigSchema, RecordMessageSchema, IterableAudiencePayload
  utils.ts           — IDENTIFIER_FIELD_CONFIG, remapToIterableFields, selectIdentifierForRow, buildSubscribeBody, buildUnsubscribeBody
  routerTransform.ts — IterableAudienceIntegration extends BatchDestination

src/v1/destinations/iterable_audience/
  networkHandler.ts          — strategy router
  strategies/
    audience-list.ts         — AudienceListStrategy extends BaseStrategy
```

## adapters layer

`src/adapters/network.js` — HTTP client wrappers used by all v1 networkHandlers:
- `prepareProxyRequest(request)` — normalizes request for proxying
- `proxyRequest(request, destType)` — executes the HTTP request to the destination API

`src/adapters/utils/networkUtils.js` — response processing utilities:
- `processAxiosResponse(response)` — converts axios response to `{ status, response }` shape (i.e., `IterableBulkApiResponse`)
- `getDynamicErrorType(status)` — maps HTTP status to error category

`src/adapters/networkHandlerFactory.js` — loads destination-specific networkHandler from `src/v1/destinations/<dest>/networkHandler`

**Standard v1 networkHandler imports:**
```typescript
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
```

## routes layer

`src/routes/destination.ts` — Express router for destination transformation endpoints:
- `POST /routerTransform` — calls `processRouterDest`; for BatchDestination destinations, dispatches to `processBatchedDestination`
- `POST /v1/destinations/:dest/proxy` — calls the v1 networkHandler chain

`src/routes/source.ts` — source transformation endpoints (not relevant for iterable_audience)

## controllers layer

`src/controllers/destination.ts` — controller functions called by routes:
- `routerTransform` — parses router request, routes to correct transform implementation
- `proxyRequest` — routes proxy calls to networkHandlerFactory

## util layer

`src/util/` — shared utilities for transform logic (not audienceUtils, which is in `src/v0/util/`):
- `src/util/fetch.js` — fetch wrapper
- `src/util/featureFlags.ts` — feature flag utilities
- `src/util/dynamicConfigParser.ts` — dynamic config parsing

Note: Audience-specific utilities are in `src/v0/util/audienceUtils.ts` (tracked under v0 coverage).

## middlewares layer

`src/middlewares/` — Express middleware chain:
- `errorHandler.ts` — global error handler; catches `TransformerProxyError` and converts to appropriate HTTP response
- `routerTransformCompactedPayloadV1.ts` — payload compression middleware
- `featureFlag.ts` — feature flag gating middleware

## helpers layer

`src/helpers/fetchHandlers.ts` — helper to load destination handlers (calls `networkHandlerFactory`)
`src/helpers/serviceSelector.ts` — selects between processing services based on destination type

## interfaces layer

`src/interfaces/` — shared TypeScript interface definitions for request/response shapes used across controllers and services.

## warehouse layer

`src/warehouse/` — warehouse-specific transformation utilities. Not used by iterable_audience (which receives standard record events from rudder-server, not raw warehouse events).
