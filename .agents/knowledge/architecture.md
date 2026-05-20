## System Flow <!-- RUD-2749 -->
- `HTTP -> route middleware -> controller -> pre-process -> dynamic config -> destination service -> post-process response`.
- Anchor: `src/routes/destination.ts :: router.post('/:version/destinations/:destination' | '/routerTransform' | '/batch')`
- Anchor: `src/controllers/destination.ts :: DestinationController.destinationTransformAtProcessor`
- Anchor: `src/controllers/destination.ts :: DestinationController.destinationTransformAtRouter`

## Destination Execution Paths <!-- RUD-2749 -->
- Native path selects between legacy router processing and native batching framework per destination/workspace.
- Anchor: `src/services/destination/nativeIntegration.ts :: NativeIntegrationDestinationService.doRouterTransformation`
- Anchor: `src/constants/batchedDestinationsMap.ts :: isBatchingFrameworkEnabled`
- Anchor: `src/services/destination/nativeBatching/processBatchedDestination.ts :: processBatchedDestination`
- CDK v2 path routes processor/router through `processCdkV2Workflow`; delivery/batch/delete are intentionally unsupported there.
- Anchor: `src/services/destination/cdkV2Integration.ts :: CDKV2DestinationService`

## Destination Module Topology <!-- RUD-2749 -->
- `src/v0/destinations/<dest>/` supports mixed legacy (`transform.js|ts`) and framework (`routerTransform.ts`) patterns.
- Optional per-destination pieces: `config`, `types`, `util`, `networkHandler`, `deleteUsers`, `docs`.
- Anchor: `src/v0/destinations/custom_audience/routerTransform.ts :: Integration`
- Anchor: `src/v0/destinations/posthog/routerTransform.ts :: Integration`
- Anchor: `src/v0/destinations/ga/transform.js :: process/event mapping helpers`

## Cross-cutting <!-- RUD-2749 -->
- Metadata/stat tagging and error shaping are centralized post-transform concerns.
- Anchor: `src/services/destination/postTransformation.ts :: DestinationPostTransformationService`
- Destination handler loading and caching are dynamic and centralized.
- Anchor: `src/helpers/fetchHandlers.ts :: FetchHandler`
- Anchor: `src/services/misc.ts :: MiscService.getDestHandler/getBatchDestinationHandler`
- Feature gating for router support and batching rollout is configuration-first.
- Anchor: `src/features.ts :: defaultFeaturesConfig.routerTransform`
- Anchor: `src/constants/batchedDestinationsMap.ts :: batchedDestinationsMap`

## Test Architecture <!-- RUD-2749 -->
- Integration/component tests are data-driven and route-level, using destination fixtures under `test/integrations/destinations/<dest>/`.
- Anchor: `test/integrations/component.test.ts :: destinationTestHandler/testRoute`
- Anchor: `test/integrations/destinations/custom_audience/common.ts :: destination/connection fixtures`
- Anchor: `test/integrations/destinations/custom_audience/router/data.ts :: data`
