## Dynamic Require Fragility <!-- RUD-2749 -->
- Missing or misnamed destination files fail at runtime (`require` path assembly), not compile time.
- Anchor: `src/services/misc.ts :: getDestHandler/getBatchDestinationHandler`

## Rollout Drift Between Feature Flags and Batching Map <!-- RUD-2749 -->
- Router behavior depends on both `features.routerTransform` and batching enablement (`batchedDestinationsMap` + env workspace list).
- Unsynced updates can create inconsistent runtime paths.
- Anchor: `src/features.ts :: defaultFeaturesConfig.routerTransform`
- Anchor: `src/constants/batchedDestinationsMap.ts :: batchedDestinationsMap/isBatchingFrameworkEnabled`

## Metadata Mutation Side Effects <!-- RUD-2749 -->
- Pre-process mutates each event object (`event.request = { query }`), which can leak assumptions to downstream code/tests.
- Anchor: `src/services/destination/preTransformation.ts :: preProcess`

## Partial Failure and Multiplexing Semantics <!-- RUD-2749 -->
- Batching framework drops all success payloads for failed jobIds to avoid partial multiplexed delivery; behavior is correct but easy to regress.
- Anchor: `src/services/destination/nativeBatching/processBatchedDestination.ts :: failedJobIds filtering`

## Type Safety Inconsistency <!-- RUD-2749 -->
- Core paths still use `any` in places (`destHandler`, caught errors), increasing accidental runtime risk in mixed JS/TS modules.
- Anchor: `src/services/destination/nativeIntegration.ts`
- Anchor: `src/services/destination/postTransformation.ts`

## Test Coverage Shape Risk <!-- RUD-2749 -->
- Integration tests are highly data-driven; missing fixture variants (`common.ts`, router/processor data) can silently leave behavior untested.
- Anchor: `test/integrations/component.test.ts`
- Anchor: `test/integrations/destinations/*/{common.ts,router/data.ts,processor/data.ts}`
