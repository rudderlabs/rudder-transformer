# Batching Framework — Batching Scenarios

This document catalogues the 4 batching formats found across 50+ destinations in the codebase and shows how each maps onto the framework's abstractions.

## Format 1: Simple Array

**Pattern**: Request body is a flat array of event payloads.

**Destinations (~38)**: ActiveCampaign, Algolia, Clevertap, CustomerIO, Facebook Custom Audiences, Google Ads (various), Intercom, Iterable, Klaviyo, Mailchimp, Marketo, Mixpanel, Monday, Pardot, Salesforce, Segment, Singular, Snapchat, TikTok (various), Yahoo DSP, etc.

**Payload shape**:

```json
{
  "events": [
    { "email": "a@b.com", "event": "purchase", "properties": { ... } },
    { "email": "c@d.com", "event": "signup", "properties": { ... } }
  ]
}
```

**Framework mapping**:

- `batchTransform`: Groups all events into one `GroupedSuccessEvents` with body `{ events: [...] }`
- `getBatchConfig`: `{ payloadHierarchyPath: 'events', maxChunkSize: 500 }`
- `postTransform`: **Default** — framework's `chunkGroup()` handles everything
- No override needed

**Example getBatchConfig**:

```typescript
getBatchConfig(): BatchConfig {
  return { payloadHierarchyPath: 'events', maxChunkSize: 500 };
}
```

---

## Format 2: Wrapper + Array

**Pattern**: Request body has metadata fields at the root level alongside a nested array of events.

**Destinations (~5)**: PostHog, Amplitude, Engage, Gainsight PX, Lemnisk

**Payload shape**:

```json
{
  "api_key": "key123",
  "batch": [
    { "distinct_id": "u1", "event": "pageview", "properties": { ... } },
    { "distinct_id": "u2", "event": "click", "properties": { ... } }
  ]
}
```

**Framework mapping**:

- `batchTransform`: Builds body with root-level wrapper fields + array: `{ api_key, batch: [...] }`
- `getBatchConfig`: `{ payloadHierarchyPath: 'batch', maxChunkSize: 250, maxPayloadSize: '4MB' }`
- `postTransform`: **Default** — `chunkGroup()` splits `batch`, wrapper fields are preserved via spread
- No override needed (wrapper fields survive chunking because `chunkGroup` spreads `...group` and only replaces the array at the path)

**Example (PostHog)**:

```typescript
// batchTransform returns:
{
  endpoint: 'https://app.posthog.com/batch',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: {
    api_key: 'key123',
    batch: [event1, event2, event3, event4, event5],
  },
  jobIds: ['1', '2', '3', '4', '5'],
}

// getBatchConfig returns:
{ payloadHierarchyPath: 'batch', maxChunkSize: 2, maxPayloadSize: '4MB' }

// chunkGroup produces (maxChunkSize=2):
// Chunk 1: { api_key: 'key123', batch: [event1, event2] }, jobIds: ['1', '2']
// Chunk 2: { api_key: 'key123', batch: [event3, event4] }, jobIds: ['3', '4']
// Chunk 3: { api_key: 'key123', batch: [event5] },         jobIds: ['5']
```

---

## Format 3: Multi-Endpoint

**Pattern**: Different event types route to different API endpoints, each with its own payload shape and chunking limits.

**Destinations (~10)**: Braze, Facebook Conversions, Google Ads Enhanced Conversions, Hubspot, Mailmodo, Optimizely Fullstack, Pinterest, Reddit, Responsys, Sprig

**Payload shape (Braze example)**:

```
POST /users/track     → { attributes: [...], events: [...], purchases: [...] }
POST /subscription    → { subscription_groups: [...] }
POST /users/merge     → { merge_updates: [...] }
```

**Framework mapping**:

- `batchTransform`: Classifies events into endpoint buckets, returns multiple `GroupedSuccessEvents` — one per endpoint
- `getBatchConfig`: Not used directly (each endpoint has different limits)
- `postTransform`: **Must override** — apply endpoint-specific chunking and payload reshaping

**Example (Braze)**:

```typescript
// batchTransform returns 3 groups:
groupedEvents: [
  {
    endpoint: 'https://rest.iad-01.braze.com/users/track',
    body: { trackContributions: [...perEventContributions] },
    jobIds: ['1', '3', '5'],
  },
  {
    endpoint: 'https://rest.iad-01.braze.com/subscription/status/set',
    body: { subscription_groups: [...subscriptionContributions] },
    jobIds: ['2'],
  },
  {
    endpoint: 'https://rest.iad-01.braze.com/users/merge',
    body: { merge_updates: [...mergeContributions] },
    jobIds: ['4'],
  },
];

// postTransform inspects group.endpoint and applies endpoint-specific logic:
// - Track: flatten contributions → batchForTrackAPI/V2 algorithm
// - Subscription: chunkGroup at 25 → combineSubscriptionGroups
// - Merge: chunkGroup at 50 → extract .update from each contribution
```

**Why override postTransform**: The track endpoint requires a complex batching algorithm (V1 or V2 depending on workspace MAU plan) that reorders events by `externalId`. Subscription groups need combining logic. These can't be expressed as simple array chunking.

---

## Format 4: Complex Custom Merge

**Pattern**: Events must be merged/deduplicated before batching — not just chunked but combined.

**Destinations (~4)**: Google Ads Remarketing Lists, Google Ads Customer Match, Facebook Custom Audiences (user-list mode), Criteo Audience

**Payload shape**:

```json
{
  "operations": [
    {
      "create": {
        "userIdentifiers": [{ "hashedEmail": "abc123" }, { "hashedEmail": "def456" }]
      }
    }
  ]
}
```

**Framework mapping**:

- `batchTransform`: May need to deduplicate identifiers across events
- `getBatchConfig`: `{ payloadHierarchyPath: 'operations[0].create.userIdentifiers', maxChunkSize: 1000 }`
- `postTransform`: **Override** if merge/dedup logic is needed beyond simple chunking

**Note**: The `payloadHierarchyPath` supports array index notation (`operations[0].create.userIdentifiers`) to reach deeply nested arrays. `setValueAtPath` and `getValueAtPath` handle the traversal.

---

## Summary Matrix

| Format | Pattern         | Destinations | Override postTransform? | payloadHierarchyPath example             |
| ------ | --------------- | :----------: | :---------------------: | ---------------------------------------- |
| 1      | Simple array    |     ~38      |           No            | `'events'`                               |
| 2      | Wrapper + array |      ~5      |           No            | `'batch'`, `'data.events'`               |
| 3      | Multi-endpoint  |     ~10      |           Yes           | N/A (per-endpoint)                       |
| 4      | Custom merge    |      ~4      |           Yes           | `'operations[0].create.userIdentifiers'` |

## Chunking Algorithm

The `chunkGroup` function handles both count-based and size-based limits:

```
for each item in array at payloadHierarchyPath:
  itemBytes = Buffer.byteLength(JSON.stringify(item))

  if current chunk is non-empty AND (count >= maxChunkSize OR bytes + itemBytes > maxPayloadSize):
    flush current chunk → push to results
    reset chunk

  add item to current chunk
  accumulate bytes

flush remaining items → push to results
```

Each chunk preserves all fields from the original group (endpoint, headers, params, non-array body fields) — only the array at `payloadHierarchyPath` is replaced with the chunk's items.

## dontBatch Flag

Events with `metadata.dontBatch = true` are processed individually:

```
inputs
  ├── batchable (dontBatch != true)  →  batchTransform(allAtOnce)
  └── nonBatchable (dontBatch == true) →  batchTransform([singleEvent]) × N
```

This is used by the control plane to force single-event processing for specific jobs (e.g., retries, debugging).
