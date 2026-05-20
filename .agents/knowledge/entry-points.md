## HTTP Routes <!-- RUD-2749 -->
- `POST /:version/destinations/:destination` -> processor transform.
- `POST /routerTransform` -> router transform.
- `POST /batch` -> batch transform.
- `POST /deleteUsers` -> user deletion.
- Anchor: `src/routes/destination.ts :: router.post(...)`

## Controller Entry Points <!-- RUD-2749 -->
- Anchor: `src/controllers/destination.ts :: DestinationController.destinationTransformAtProcessor`
- Anchor: `src/controllers/destination.ts :: DestinationController.destinationTransformAtRouter`
- Anchor: `src/controllers/destination.ts :: DestinationController.batchProcess`

## Service Dispatch <!-- RUD-2749 -->
- Service selector picks native vs CDK-v2 path from event payload.
- Anchor: `src/helpers/serviceSelector.ts :: ServiceSelector.getDestinationService`
- Native service entry symbols:
  - Anchor: `src/services/destination/nativeIntegration.ts :: doProcessorTransformation`
  - Anchor: `src/services/destination/nativeIntegration.ts :: doRouterTransformation`
  - Anchor: `src/services/destination/nativeIntegration.ts :: doBatchTransformation`
- CDK v2 entry symbols:
  - Anchor: `src/services/destination/cdkV2Integration.ts :: doProcessorTransformation`
  - Anchor: `src/services/destination/cdkV2Integration.ts :: doRouterTransformation`

## Dynamic Handler Resolution <!-- RUD-2749 -->
- Destination transform handlers loaded dynamically by destination/version.
- Router batching handler loaded from `routerTransform.ts` `Integration` export.
- Anchor: `src/services/misc.ts :: getDestHandler/getBatchDestinationHandler`
- Anchor: `src/helpers/fetchHandlers.ts :: getDestHandler/getBatchDestinationHandler`

## Test Entry Point <!-- RUD-2749 -->
- Component runner invokes the same HTTP endpoints and validates fixture-driven outputs.
- Anchor: `test/integrations/component.test.ts :: destinationTestHandler`
