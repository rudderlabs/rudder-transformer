## 1. Create FullStory routerTransform module

- [ ] 1.1 Create `src/v0/destinations/fullstory/routerTransform.ts` with a `FullStoryIntegration` class extending `BatchDestination<FullStoryPayload>`
- [ ] 1.2 Define `FullStoryPayload` type and any supporting types in `src/v0/destinations/fullstory/types.ts`
- [ ] 1.3 Implement `getInputSchema()` returning a Zod schema that validates message type is `track` or `identify` and requires `userId`
- [ ] 1.4 Implement `transformEvent()` that invokes the CDK v2 processor handler to transform each event, then remaps track event endpoints from `/v2/events` to `/v2/events/batch`
- [ ] 1.5 Implement `getBatchStrategy(endpoint)` returning `ChunkBatchStrategy` with `maxItems: 50000`, `maxPayloadSize: '10MB'`, and `wrapBody` producing `{ requests: [...] }` for the batch endpoint; return a chunk-of-1 strategy for the identify endpoint
- [ ] 1.6 Export the class as `Integration`

## 2. Register FullStory in the batching framework

- [ ] 2.1 Verify `FULLSTORY_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` env var is recognized by the existing `isBatchingFrameworkEnabled` function (no code change needed — the pattern is generic)
- [ ] 2.2 Confirm `FetchHandler.getBatchDestinationHandler('fullstory')` can load the new `routerTransform.ts` module (follows the `require('../v0/destinations/{dest}/routerTransform').Integration` convention)

## 3. Add router transform tests

- [ ] 3.1 Create `test/integrations/destinations/fullstory/router/data.ts` with test cases for batched track events (multiple track events batched into a single `/v2/events/batch` request)
- [ ] 3.2 Add test case for identify events remaining unbatched (individual `/v2/users` requests)
- [ ] 3.3 Add test case for mixed track and identify events (track batched, identify individual)
- [ ] 3.4 Add test case for `dontBatch: true` track events sent individually
- [ ] 3.5 Add test case for invalid events (missing event name) returning errors without affecting valid events in the batch

## 4. Unit test the routerTransform module

- [ ] 4.1 Create `src/v0/destinations/fullstory/routerTransform.test.ts` testing `transformEvent()` output shape and endpoint remapping
- [ ] 4.2 Add tests for `getBatchStrategy()` returning appropriate strategies per endpoint
- [ ] 4.3 Add tests for `getInputSchema()` validation (valid and invalid inputs)

## 5. Validate and verify

- [ ] 5.1 Run existing FullStory processor tests to confirm no regression (`npm test -- --testPathPattern fullstory`)
- [ ] 5.2 Run new router transform tests to confirm batching behavior
- [ ] 5.3 Run the full test suite to confirm no unrelated breakage
