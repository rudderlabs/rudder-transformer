## Router Transformation Pattern <!-- RUD-2749 -->
- Events are grouped first, then processed per destination/workspace group.
- Anchor: `src/v0/util/index.js :: groupRouterTransformEvents`
- Anchor: `src/services/destination/nativeIntegration.ts :: doRouterTransformation`

## Legacy vs Batching Split <!-- RUD-2749 -->
- Legacy path: `destHandler.processRouterDest(...)`.
- Batching path: `FetchHandler.getBatchDestinationHandler(...)` + `processBatchedDestination(...)`.
- Anchor: `src/services/destination/nativeIntegration.ts :: useBatchingFramework branch`
- Anchor: `src/services/misc.ts :: getBatchDestinationHandler`

## Native Batching Framework Pattern <!-- RUD-2749 -->
- Implement `BatchDestination` with `transformEvent`, `getBatchStrategy`, `getInputSchema`.
- Grouping key includes endpoint/method/headers/params/internalGroupKey.
- Strategy decides chunking/wrapping (`ChunkBatchStrategy` or `CustomBatchStrategy`).
- Anchor: `src/services/destination/nativeBatching/batchDestination.ts :: BatchDestination`
- Anchor: `src/services/destination/nativeBatching/processBatchedDestination.ts :: groupPayloadsByCompositeKey`

## Destination Folder Pattern <!-- RUD-2749 -->
- Common files: `transform`, `config`, `util`, `types`; optional `routerTransform`, `networkHandler`, docs.
- Router-first framework destinations export `Integration` from `routerTransform.ts`.
- Anchor: `src/v0/destinations/custom_audience/routerTransform.ts :: Integration`
- Anchor: `src/v0/destinations/posthog/routerTransform.ts :: Integration`

## Integration Test Fixture Pattern <!-- RUD-2749 -->
- Shared destination/connection variants belong in `common.ts`; route/processor fixtures in `router/data.ts`, `processor/data.ts`.
- Optional mocks/network fixtures: `mocks.ts`, `network.ts`.
- Anchor: `test/integrations/destinations/custom_audience/common.ts`
- Anchor: `test/integrations/destinations/custom_audience/router/data.ts`

## Error/Metadata Pattern <!-- RUD-2749 -->
- Success/failure normalization and stat emission happen in post-transformation service.
- Anchor: `src/services/destination/postTransformation.ts :: handle*SuccessEvents/handle*FailureEvents`
