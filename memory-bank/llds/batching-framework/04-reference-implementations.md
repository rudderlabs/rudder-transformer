# Batching Framework — Reference Implementations

Two destinations serve as reference implementations: **PostHog** (simple, Format 2) and **Braze** (complex, Format 3).

## PostHog — Simple Wrapper + Array (Format 2)

**File**: `src/v0/destinations/posthog/routerTransform.ts`

PostHog demonstrates the minimal integration. It:

- Defines a simple body type (`{ api_key, batch }`)
- Transforms events synchronously in a loop
- Groups all successes into a single endpoint bucket
- Uses **default** `postTransform` — no override needed
- Adds a Zod schema requiring `userId` or `anonymousId` and rejecting `record` type

### Body Type

```typescript
type PostHogBody = {
  api_key: string;
  batch: PostHogEvent[];
};
```

### batchTransform

```typescript
async batchTransform(
  inputs: RouterTransformationRequestData[],
  _reqMetadata?: NonNullable<unknown>,
): Promise<BatchTransformResult<PostHogBody>> {
  // 1. Extract shared config
  const apiKey = destination.Config.teamApiKey;
  const endpoint = `${stripTrailingSlash(destination.Config.yourInstance)}/batch`;

  // 2. Transform each event, collecting payloads and errors
  for (const input of inputs) {
    try {
      const payload = buildPostHogEventPayload(input.message, input.destination);
      payloads.push(payload);
      jobIds.push(String(input.metadata.jobId));
    } catch (e) {
      errorEvents.push({ error, statusCode, jobId });
    }
  }

  // 3. Return single group with all payloads
  return {
    groupedEvents: [{
      endpoint,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { api_key: apiKey, batch: payloads },
      jobIds,
    }],
    errorEvents,
  };
}
```

### getBatchConfig

```typescript
getBatchConfig(): BatchConfig {
  return {
    payloadHierarchyPath: 'batch',    // chunkGroup splits body.batch
    maxChunkSize: 250,                // max events per request
    maxPayloadSize: '4MB',            // PostHog API limit
  };
}
```

### getIntegrationSchema

```typescript
getIntegrationSchema(): ZodType | null {
  return z.object({
    message: z.object({
      userId: z.string().optional(),
      anonymousId: z.string().optional(),
      type: z.string().refine((val) => val !== 'record', {
        message: 'messagetype should not be record',
      }),
    }).refine((msg) => !!msg.userId || !!msg.anonymousId, {
      message: 'Either userId or anonymousId must be provided',
    }),
  }).passthrough();
}
```

### Data Flow

```
10 events arrive
  │
  ▼ validate() — filters out invalid events
8 valid events
  │
  ▼ batchTransform() — builds payloads, catches errors
7 payloads + 1 error event
  │
  ▼ postTransform() [default] → chunkGroup(maxChunkSize=250, maxPayloadSize=4MB)
1 chunk (7 < 250):
  body: { api_key: 'key', batch: [p1..p7] }
  │
  ▼ convertToServerFormat()
{ batchedRequest: { body: { JSON: { api_key, batch }, ... } }, metadata: [...], batched: true }
```

---

## Braze — Multi-Endpoint with Custom Logic (Format 3)

**File**: `src/v0/destinations/braze/routerTransform.ts`

Braze demonstrates a complex integration that:

- Uses mutable instance state (dedup `userStore`) — hence per-call instantiation
- Does async bulk dedup lookup before per-event transforms
- Classifies events into 3 endpoint buckets (track, subscription, merge)
- Overrides `postTransform` with endpoint-specific chunking and reshaping
- Threads `reqMetadata` to the per-event `process()` function

### Body Types

```typescript
type BrazeTrackContribution = {
  kind: 'track';
  attributes?: BrazeUserAttributes[];
  events?: BrazeEvent[];
  purchases?: BrazePurchase[];
};

type BrazeSubscriptionContribution = {
  kind: 'subscription';
  group: BrazeSubscriptionGroup;
};

type BrazeMergeContribution = {
  kind: 'merge';
  update: BrazeMergeUpdate;
};

type BrazeBody = BrazeTrackBody | BrazeSubscriptionBody | BrazeMergeBody;
```

### batchTransform

```typescript
async batchTransform(inputs, reqMetadata): Promise<BatchTransformResult<BrazeBody>> {
  // 1. Reset per-batch mutable state
  this.userStore = new Map();
  this.failedLookupIdentifiers = new Set();

  // 2. Async bulk dedup lookup (if supportDedup is enabled)
  if (brazeDest.Config.supportDedup) {
    const lookupResult = await BrazeDedupUtility.doLookup(inputs);
    BrazeDedupUtility.updateUserStore(this.userStore, lookupResult.users, brazeDest.ID);
  }

  // 3. Parallel per-event transformation (userStore is read-only now)
  const perEventResults = await Promise.all(
    inputs.map(async (input) => {
      const result = await process(input, processParams, reqMetadata ?? {});
      return { jobId, result, error: null };
    }),
  );

  // 4. Identity resolution batch
  if (identifyCallsArray.length > 0) {
    await processBatchedIdentify(identifyCallsArray, brazeDest.ID);
  }

  // 5. Classify into endpoint buckets
  //    - json.subscription_groups → subscription bucket
  //    - json.merge_updates       → merge bucket
  //    - else                     → track bucket

  return { groupedEvents: [trackGroup, subscriptionGroup, mergeGroup], errorEvents };
}
```

### postTransform (overridden)

```typescript
postTransform(group, destination): PostTransformResult[] {
  // Subscription groups — chunk at 25, combine groups
  if (group.endpoint === subscriptionEndpoint) {
    return chunkGroup(group, {
      payloadHierarchyPath: 'subscription_groups',
      maxChunkSize: SUBSCRIPTION_BRAZE_MAX_REQ_COUNT,  // 25
    }).map((chunk) => ({
      batchRequest: {
        body: { subscription_groups: combineSubscriptionGroups(chunk...) },
        ...
      },
      jobIds: chunk.jobIds,
    }));
  }

  // Merge updates — chunk at 50, extract .update from each contribution
  if (group.endpoint === mergeEndpoint) {
    return chunkGroup(group, {
      payloadHierarchyPath: 'merge_updates',
      maxChunkSize: ALIAS_BRAZE_MAX_REQ_COUNT,  // 50
    }).map((chunk) => ({
      batchRequest: {
        body: { merge_updates: chunk.merge_updates.map(p => p.update) },
        ...
      },
      jobIds: chunk.jobIds,
    }));
  }

  // Track — flatten contributions, apply V1 or V2 batching algorithm
  const trackItems = group.body.trackContributions;
  const attributes = trackItems.flatMap(p => p.attributes ?? []);
  const events = trackItems.flatMap(p => p.events ?? []);
  const purchases = trackItems.flatMap(p => p.purchases ?? []);

  const trackChunks = isWorkspaceOnMauPlan(workspaceId)
    ? batchForTrackAPIV2(attributes, events, purchases)
    : batchForTrackAPI(attributes, events, purchases);

  return trackChunks.map((chunk) => ({
    batchRequest: { body: { partner: 'RudderStack', ...chunk }, ... },
    jobIds: group.jobIds,  // all track jobs on every chunk
  }));
}
```

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
3. **Define `TBody` type** — the shape of your request body
4. **Implement `batchTransform`**:
   - Transform each event (reuse existing `process()` if available)
   - Group successes by endpoint into `GroupedSuccessEvents<TBody>`
   - Collect errors into `TransformedErrorEvent[]`
5. **Override `getBatchConfig`** with your API's limits
6. **Override `postTransform`** only if Format 3/4 (multi-endpoint or custom merge)
7. **Add Zod schema** via `getIntegrationSchema` for destination-specific rules
8. **Export `const Integration = YourClass`** (class, not instance)
9. **Add destination to `batchedDestinationsMap`**
10. **Update/add component tests** — output format changes from legacy to framework envelope
