# Batching Framework — Reference Implementations

Two destinations serve as reference implementations: **PostHog** (simple, Format 2) and **Braze** (complex, Format 3).

## PostHog — Simple Wrapper + Array (Format 2)

**File**: `src/v0/destinations/posthog/routerTransform.ts`

PostHog demonstrates the minimal integration. It:

- Defines a simple body type (the inner event object)
- Transforms one event at a time via `transformEvent`
- Framework groups by composite key (single endpoint, so one group)
- Returns a `chunk(...)` strategy with `wrapBody` for the wrapper envelope
- Adds a Zod schema requiring `userId` or `anonymousId` and rejecting `record` type

### Body Type

```typescript
type PostHogEvent = {
  distinct_id: string;
  event: string;
  properties: Record<string, unknown>;
  timestamp?: string;
};
```

### Full Implementation

```typescript
class PostHogIntegration extends RouterIntegration<PostHogEvent> {
  transformEvent(input: RouterTransformationRequestData): TransformedPayload<PostHogEvent> {
    return {
      body: buildPostHogEventPayload(input.message, input.destination),
      endpoint: `${stripTrailingSlash(input.destination.Config.yourInstance)}/batch`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
  }

  getBatchStrategy(): BatchStrategy<PostHogEvent> {
    return chunk({
      maxSize: 250,
      maxBytes: '4MB',
      wrapBody: (bodies) => ({
        api_key: this.destination.Config.teamApiKey,
        batch: bodies,
      }),
    });
  }

  getIntegrationSchema(): ZodType | null {
    return z
      .object({
        message: z
          .object({
            userId: z.string().optional(),
            anonymousId: z.string().optional(),
            type: z.string().refine((val) => val !== 'record', {
              message: 'messagetype should not be record',
            }),
          })
          .refine((msg) => !!msg.userId || !!msg.anonymousId, {
            message: 'Either userId or anonymousId must be provided',
          }),
      })
      .passthrough();
  }
}
```

**~25 lines** of destination-specific code. No iterate/catch boilerplate, no manual `GroupedSuccessEvents` construction.

### Data Flow

```
10 events arrive
  │
  ▼ validate() — filters out invalid events
8 valid events
  │
  ▼ batchTransform() [default] — iterates, calls transformEvent(), catches errors
7 TransformedPayloads + 1 error event
  │
  ▼ group by { endpoint, method, headers, params } [framework] → 1 group
7 payloads in 1 group
  │
  ▼ getBatchStrategy(endpoint) → chunk(maxSize=250, maxBytes=4MB, wrapBody)
  ▼ apply chunk strategy
1 chunk (7 < 250):
  body: wrapBody([p1..p7]) → { api_key: 'key', batch: [p1..p7] }
  jobIds: ['1'..'7']
  │
  ▼ convertToServerFormat()
{ batchedRequest: { body: { JSON: { api_key, batch }, ... } }, metadata: [...], batched: true }
```

---

## Braze — Multi-Endpoint with Custom Logic (Format 3)

**File**: `src/v0/destinations/braze/routerTransform.ts`

Braze demonstrates a complex integration that:

- Uses mutable instance state (dedup `userStore`) — hence per-call instantiation
- Overrides `batchTransform` for async bulk dedup lookup before per-event transforms
- Delegates per-event iteration back to the framework via `super.batchTransform()`
- Classifies events into 3 endpoint buckets via `transformEvent` (framework groups by composite key)
- Returns different `BatchStrategy` per endpoint group in `getBatchStrategy`
- Threads `reqMetadata` to the per-event `process()` function

### Body Types

```typescript
type BrazeTrackBody = {
  attributes?: BrazeUserAttributes[];
  events?: BrazeEvent[];
  purchases?: BrazePurchase[];
};

type BrazeSubscriptionBody = {
  subscription_groups: BrazeSubscriptionGroup[];
};

type BrazeMergeBody = {
  merge_updates: BrazeMergeUpdate[];
};

type BrazeBody = BrazeTrackBody | BrazeSubscriptionBody | BrazeMergeBody;
```

### batchTransform (overridden for pre-batch dedup)

```typescript
async batchTransform(inputs, reqMetadata): Promise<TransformResult<BrazeBody>> {
  // 1. Reset per-batch mutable state
  this.userStore = new Map();
  this.failedLookupIdentifiers = new Set();

  // 2. Async bulk dedup lookup (if supportDedup is enabled)
  if (this.destination.Config.supportDedup) {
    const lookupResult = await BrazeDedupUtility.doLookup(inputs);
    BrazeDedupUtility.updateUserStore(this.userStore, lookupResult.users, this.destination.ID);
  }

  // 3. Delegate iteration to framework — still calls transformEvent() per input
  const result = await super.batchTransform(inputs, reqMetadata);

  // 4. Post-transform identity resolution
  if (this.identifyCallsArray.length > 0) {
    await processBatchedIdentify(this.identifyCallsArray, this.destination.ID);
  }

  return result;
}
```

### transformEvent

```typescript
transformEvent(input: RouterTransformationRequestData): TransformedPayload<BrazeBody> {
  const result = process(input, { userStore: this.userStore }, this.reqMetadata);
  const json = result.batchedRequest.body.JSON;

  if (json.subscription_groups) {
    return {
      body: json as BrazeSubscriptionBody,
      endpoint: getSubscriptionEndpoint(this.destination),
      method: 'POST',
      headers: getHeaders(this.destination),
    };
  }

  if (json.merge_updates) {
    return {
      body: json as BrazeMergeBody,
      endpoint: getMergeEndpoint(this.destination),
      method: 'POST',
      headers: getHeaders(this.destination),
    };
  }

  return {
    body: json as BrazeTrackBody,
    endpoint: getTrackEndpoint(this.destination),
    method: 'POST',
    headers: getHeaders(this.destination),
  };
}
```

### getBatchStrategy

```typescript
getBatchStrategy(endpoint: string): BatchStrategy<BrazeBody> {
  // Subscription groups — chunk at 25, combine groups
  if (endpoint.includes('/subscription')) {
    return chunk({
      maxSize: SUBSCRIPTION_BRAZE_MAX_REQ_COUNT,  // 25
      wrapBody: (bodies) => ({
        subscription_groups: combineSubscriptionGroups(
          bodies.flatMap(b => (b as BrazeSubscriptionBody).subscription_groups),
        ),
      }),
    });
  }

  // Merge updates — chunk at 50
  if (endpoint.includes('/merge')) {
    return chunk({
      maxSize: ALIAS_BRAZE_MAX_REQ_COUNT,  // 50
      wrapBody: (bodies) => ({
        merge_updates: (bodies as BrazeMergeBody[]).flatMap(b => b.merge_updates),
      }),
    });
  }

  // Track — cross-event merge, needs full control
  return customBatch((payloads) => {
    const attrs = payloads.flatMap(p => (p.body as BrazeTrackBody).attributes ?? []);
    const events = payloads.flatMap(p => (p.body as BrazeTrackBody).events ?? []);
    const purchases = payloads.flatMap(p => (p.body as BrazeTrackBody).purchases ?? []);

    const trackChunks = isWorkspaceOnMauPlan(this.workspaceId)
      ? batchForTrackAPIV2(attrs, events, purchases)
      : batchForTrackAPI(attrs, events, purchases);

    return trackChunks.map((trackChunk) => ({
      body: { partner: 'RudderStack', ...cleanTrackChunk(trackChunk) },
      jobIds: computeJobIdsForChunk(trackChunk, payloads),  // per-chunk jobIds
    }));
  });
}
```

**Note on track jobIds**: Each chunk must include only the jobIds of events that contributed to it. The previous design incorrectly assigned all track jobIds to every chunk — this is fixed by `computeJobIdsForChunk` which maps each chunk's attributes/events/purchases back to their originating payloads.

### getIntegrationSchema

```typescript
getIntegrationSchema() {
  return z.object({
    message: z.object({
      type: z.enum(['track', 'page', 'screen', 'identify', 'group', 'alias']),
    }).passthrough().refine(
      (m) => m.userId || m.anonymousId || m.context?.externalId,
      'userId, anonymousId, or externalId is required',
    ),
  }).passthrough();
}
```

### Why Per-Call Instantiation Matters Here

Braze stores dedup state in `this.userStore` and `this.failedLookupIdentifiers`. If multiple concurrent requests shared a singleton instance, they would corrupt each other's lookup results. The framework creates a new `BrazeIntegration()` per `processBatchedDestination` call, isolating state.

---

## Migration Checklist

To migrate a destination to the framework:

1. **Identify the batching format** (1–4) from the existing `processRouterDest` implementation
2. **Create `routerTransform.ts`** in the destination directory
3. **Define `TBody` type** — the shape of a single event's body contribution
4. **Implement `transformEvent`**:
   - Transform one event (reuse existing `process()` if available)
   - Return a `TransformedPayload<TBody>` with body, endpoint, method, headers
   - For multi-endpoint destinations, set endpoint based on event type
5. **Implement `getBatchStrategy`**:
   - Simple destinations: `chunk({ maxSize, wrapBody })` — one strategy
   - Multi-endpoint: inspect `endpoint` and return different strategies per endpoint
   - Complex merge: `customBatch(...)` for full control
6. **Override `batchTransform`** only for pre-batch bulk operations (dedup, identity resolution)
   - Call `super.batchTransform()` to delegate iteration
7. **Add Zod schema** via `getIntegrationSchema` for destination-specific rules
8. **Export `const Integration = YourClass`** (class, not instance)
9. **Add destination to `batchedDestinationsMap`**
10. **Update/add component tests** — output format changes from legacy to framework envelope
