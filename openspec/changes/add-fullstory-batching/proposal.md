## Why

FullStory currently processes events individually via the CDK v2 processor workflow, sending one HTTP request per event. This is inefficient for high-volume customers. FullStory's Server API v2 provides a dedicated batch events import endpoint (`POST /v2/events/batch`) that accepts up to 50,000 events per request. Adding batching support will reduce HTTP overhead, improve throughput, and align with the native batching framework already proven with PostHog.

## What Changes

- Implement a new `routerTransform.ts` for FullStory using the native batching framework (`BatchDestination` base class)
- Reuse the existing CDK v2 `procWorkflow.yaml` for individual event transformation within the batch pipeline
- Add `ChunkBatchStrategy` configured to batch track events using FullStory's `/v2/events/batch` endpoint
- Keep identify events unbatched (FullStory does not provide a batch endpoint for user creation/updates)
- Register FullStory in the `batchedDestinationsMap` for GA rollout (behind workspace-level feature flag initially)
- Add router-level test cases for batched transformations

## Capabilities

### New Capabilities

- `batch-track-events`: Batch multiple track events into a single FullStory `/v2/events/batch` API call using the native batching framework with `ChunkBatchStrategy`

### Modified Capabilities

_(none — the existing processor transform behavior remains unchanged; batching is additive at the router layer)_

## Impact

- **Code**: New `src/v0/destinations/fullstory/routerTransform.ts` extending `BatchDestination`; update to `batchedDestinationsMap.ts`
- **APIs**: Uses FullStory's asynchronous batch import endpoint (`POST /v2/events/batch`) instead of the single-event endpoint for track events; identify events continue using `POST /v2/users`
- **Dependencies**: No new dependencies; leverages existing `nativeBatching` framework
- **Testing**: New router transform tests; existing processor tests remain unchanged
- **Rollout**: Workspace-level env var (`FULLSTORY_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS`) for gradual rollout before GA
