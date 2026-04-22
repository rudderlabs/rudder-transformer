## Context

FullStory is currently implemented as a CDK v2 destination using `procWorkflow.yaml`. It supports two event types — track (`POST /v2/events`) and identify (`POST /v2/users`) — each sent as individual HTTP requests. The codebase has a native batching framework (proven with PostHog) that provides a `BatchDestination` base class, `ChunkBatchStrategy`, and an orchestration layer in `processBatchedDestination.ts`. FullStory's Server API v2 offers a batch events import endpoint (`POST /v2/events/batch`) that accepts up to 50,000 events per request.

## Goals / Non-Goals

**Goals:**

- Batch track events using FullStory's `/v2/events/batch` endpoint via the native batching framework
- Follow the established PostHog pattern: extend `BatchDestination`, use `ChunkBatchStrategy`
- Support gradual rollout via workspace-level env var before GA
- Keep identify events flowing through their existing single-event endpoint (no batch API available)

**Non-Goals:**

- Migrating the CDK v2 `procWorkflow.yaml` to TypeScript — the processor workflow continues to handle individual event transformation
- Batching identify events (FullStory has no batch users endpoint)
- Supporting FullStory's asynchronous batch job status polling or error retrieval endpoints

## Decisions

### 1. Use the native batching framework (not CDK v2 rtWorkflow.yaml)

**Choice:** Implement batching via `BatchDestination<TBody>` in `src/v0/destinations/fullstory/routerTransform.ts`.

**Rationale:** The native framework is the recommended path forward (PostHog is the model). It provides better TypeScript type safety, Zod input validation, and the `ChunkBatchStrategy` handles size-based chunking out of the box. CDK v2 rtWorkflow.yaml batching exists for legacy destinations but new implementations should use the native framework.

**Alternatives considered:**

- CDK v2 `rtWorkflow.yaml` — Would work but is the older pattern; doesn't benefit from Zod validation or typed batch strategies.

### 2. Reuse CDK v2 procWorkflow for event transformation

**Choice:** Invoke the CDK v2 processor handler from within `transformEvent()` to transform individual events, then remap track events to the batch endpoint.

**Rationale:** The existing `procWorkflow.yaml` already correctly transforms track and identify events. Rewriting this logic in TypeScript would duplicate effort and introduce risk. The `transformEvent()` method will call the CDK v2 handler, inspect the result, and for track events redirect the endpoint from `/v2/events` to `/v2/events/batch` so the batching framework groups them correctly.

**Alternatives considered:**

- Full TypeScript rewrite of transformation logic — Higher effort, risk of regression, and out of scope for this change.

### 3. Endpoint-aware batch strategy

**Choice:** `getBatchStrategy(endpoint)` returns a `ChunkBatchStrategy` for the batch events endpoint and a chunk-of-1 strategy for identify (effectively no batching).

**Rationale:** The native framework groups payloads by (endpoint, method, headers, params) before batching. Track events will share the `/v2/events/batch` endpoint and get batched together. Identify events will each have their own `/v2/users` endpoint and remain individual. The `wrapBody` function wraps batched track event bodies into the `{ requests: [...] }` format expected by the FullStory batch API.

### 4. Batch size limits

**Choice:** Use `maxItems: 50000` and `maxPayloadSize: '10MB'` in `ChunkBatchStrategy`.

**Rationale:** FullStory's batch API accepts up to 50,000 events per request. A 10 MB payload size limit provides a practical safeguard. In practice, most batches will be much smaller since the router typically receives hundreds of events per call, not tens of thousands.

### 5. Gradual rollout via env var

**Choice:** Do not add FullStory to `batchedDestinationsMap` initially. Use `FULLSTORY_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` env var for pre-GA testing.

**Rationale:** Follows the established rollout pattern. Once validated in production, add `FULLSTORY: true` to `batchedDestinationsMap` for GA.

## Risks / Trade-offs

- **[Asynchronous batch processing]** FullStory's batch endpoint is asynchronous — it returns a job ID, not immediate success/failure per event. Individual event errors are only available via a separate status polling endpoint. → **Mitigation:** Accept the HTTP 200 from the batch endpoint as success. Batch-level errors (400, 429) are handled normally. Per-event errors within a batch are a FullStory-side concern and out of scope for the transformer.

- **[CDK v2 handler coupling]** `transformEvent()` depends on the CDK v2 handler internals to produce the expected output shape. → **Mitigation:** The CDK v2 handler output format (`body.JSON`, `endpoint`, `method`, `headers`) is stable and well-established across dozens of destinations.

- **[Rate limiting]** FullStory limits in-progress batches to 100 per org, and returns 429 after 200 in-progress batches or 500,000 operations. → **Mitigation:** The transformer's existing retry/backoff handling for 429 responses applies. No special handling needed.
