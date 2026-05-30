# Stack & Dependencies

> Project technology stack, frameworks, and key dependencies.
> This file is append-only - agents add discoveries, never delete.

(Add stack information as you discover it)

## Language & Runtime

- Node.js / TypeScript (strict)
- Package manager: `bun` (NEVER npm/yarn)
- Tests: Jest (`npm test` calls jest under the hood; bun is for install/add)

## Key Dependencies

- `@rudderstack/integrations-lib` — shared error types: `InstrumentationError`, `ConfigurationError`, `PlatformError`, `TransformationError`
- `zod` — runtime schema validation (used in `getInputSchema()` and `types.ts` for all new destinations)
- `validator` — string validation helpers (e.g., `validator.isEmail()`)
- `axios` — HTTP client (accessed via framework adapters, not directly)

## Framework Layers

### BatchDestination framework
- `src/services/destination/nativeBatching/batchDestination.ts` — base class + `processBatchedDestination`
- `src/services/destination/nativeBatching/chunkBatchStrategy.ts` — `ChunkBatchStrategy` (chunk by count/size)
- `src/services/destination/nativeBatching/customBatchStrategy.ts` — `CustomBatchStrategy` (arbitrary batch logic)
- `src/constants/batchedDestinationsMap.ts` — GA registry (must add new destination here)
- `src/services/misc.ts` — `getBatchDestinationHandler` (loads from v0 path)

### v1 delivery layer utilities
- `src/adapters/network.ts` — `prepareProxyRequest`, `proxyRequest`
- `src/adapters/utils/networkUtils.ts` — `processAxiosResponse`, `getDynamicErrorType`
- `src/v0/util/errorTypes.ts` — `TransformerProxyError`

### Audience utilities
- `src/v0/util/audienceUtils.ts` — `processAudienceRecord`, `AudienceField`, `HashingType`
- `src/v0/util/recordUtils.js` — `EVENT_TYPES` (`insert`, `update`, `delete`)

## Existing iterable destination (reused by iterable_audience)

- `src/v0/destinations/iterable/config.js` — `BASE_URL`, `constructEndpoint`, `ITERABLE_RESPONSE_*_PATHS`
- `src/v1/destinations/iterable/strategies/base.ts` — `BaseStrategy` abstract class
- `src/v1/destinations/iterable/utils.ts` — `createBatchErrorChecker`
- `src/v1/destinations/iterable/types.ts` — `FailedUpdates`, `GeneralApiResponse`, `IterableBulkApiResponse`, `IterableBulkProxyInput`

## Testing setup

- `test/integrations/component.test.ts` — single runner for all integration tests
- `test/integrations/destinations/<dest>/` — test fixtures per destination
  - `processor/data.ts`, `router/data.ts`, `dataDelivery/data.ts`
  - `network.ts`, `mocks.ts`

## Linting

- `npm run lint` — runs prettier + eslint --fix
- Run after code changes; stage and commit any diffs it produces
