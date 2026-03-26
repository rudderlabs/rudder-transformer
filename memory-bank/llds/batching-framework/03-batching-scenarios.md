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

- `transformEvent`: Returns one `TransformedPayload` per event
- Grouping: framework groups by composite key — single endpoint, so one group
- `getBatchStrategy`: `chunk({ maxSize: 500, wrapBody: (bodies) => ({ events: bodies }) })`
- No overrides needed

**Example**:

```typescript
class ExampleIntegration extends RouterIntegration<ExampleBody> {
  transformEvent(input: RouterTransformationRequestData): TransformedPayload<ExampleBody> {
    return {
      body: buildEventPayload(input.message),
      endpoint: 'https://api.example.com/events',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
  }

  getBatchStrategy(): BatchStrategy<ExampleBody> {
    return chunk({ maxSize: 500, wrapBody: (bodies) => ({ events: bodies }) });
  }
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

- `transformEvent`: Returns one `TransformedPayload` per event (body is the inner event object)
- Grouping: framework groups by composite key — single endpoint, so one group
- `getBatchStrategy`: `chunk({ maxSize: 250, maxBytes: '4MB', wrapBody: (bodies) => ({ api_key: apiKey, batch: bodies }) })`
- The `wrapBody` callback explicitly constructs the wrapper — no implicit spreading

**Example (PostHog)**:

```typescript
// transformEvent returns:
{ body: { distinct_id: 'u1', event: 'pageview', properties: { ... } },
  endpoint: 'https://app.posthog.com/batch', method: 'POST', headers: { ... } }

// getBatchStrategy returns:
chunk({
  maxSize: 250,
  maxBytes: '4MB',
  wrapBody: (bodies) => ({ api_key: 'key123', batch: bodies }),
})

// Framework applies chunk strategy (maxSize=2):
// Chunk 1: wrapBody([event1, event2]) → { api_key: 'key123', batch: [event1, event2] }, jobIds: ['1', '2']
// Chunk 2: wrapBody([event3, event4]) → { api_key: 'key123', batch: [event3, event4] }, jobIds: ['3', '4']
// Chunk 3: wrapBody([event5])         → { api_key: 'key123', batch: [event5] },         jobIds: ['5']
```

---

## Format 3: Multi-Endpoint

**Pattern**: Different event types route to different API endpoints, each with its own payload shape and chunking limits.

**Destinations (~10)**: Braze, Facebook Conversions, Google Ads Enhanced Conversions, Hubspot, Mailmodo, Optimizely Fullstack, Pinterest, Reddit, Responsys, Sprig

**Payload shape (Mixpanel example)**:

```
POST /engage  → { data: [...engage payloads] }
POST /groups  → { data: [...group payloads] }
POST /import  → { data: [...import payloads] }
```

**Framework mapping**:

- `transformEvent`: Returns one or more `TransformedPayload`s — each with the appropriate endpoint
- Grouping: framework groups by composite key — payloads auto-separate by endpoint
- `getBatchStrategy(endpoint)`: Returns different `chunk(...)` strategies per endpoint

**Example (Mixpanel)**:

```typescript
class MixpanelIntegration extends RouterIntegration<MixpanelBody> {
  transformEvent(input): TransformedPayload<MixpanelBody>[] {
    const results = CommonUtils.toArray(process(input));
    return results.map(result => ({
      body: result.body.JSON,
      endpoint: `${baseUrl}${extractPath(result.endpoint)}`,
      method: 'POST',
      headers: getHeaders(input.destination),
    }));
  }

  // Framework groups by { endpoint, method, headers, params }
  // Payloads with /engage, /groups, /import auto-separate

  getBatchStrategy(endpoint: string): BatchStrategy<MixpanelBody> {
    if (endpoint.includes('/engage')) return chunk({ maxSize: 2000, wrapBody: (b) => ({ data: b }) });
    if (endpoint.includes('/groups')) return chunk({ maxSize: 200, wrapBody: (b) => ({ data: b }) });
    return chunk({ maxSize: 2000, wrapBody: (b) => ({ data: b }) });
  }
}
```

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

- `transformEvent`: Returns per-event payloads with individual identifiers
- Grouping: framework groups by composite key
- `getBatchStrategy`: `customBatch(...)` — full control over merging/deduplication

**Example (Google Ads Customer Match)**:

```typescript
getBatchStrategy(): BatchStrategy<GoogleAdsBody> {
  return customBatch((payloads) => {
    const allIds = payloads.flatMap(p => p.body.userIdentifiers);
    const deduped = deduplicateIdentifiers(allIds);
    const idChunks = chunkArray(deduped, 1000);

    return idChunks.map(ids => ({
      body: { operations: [{ create: { userIdentifiers: ids } }] },
      jobIds: payloads.map(p => p.jobId),  // all jobs contributed to every chunk
    }));
  });
}
```

**Why `customBatch`**: These destinations need cross-event merging (combining identifiers from multiple events into one request) and deduplication. This can't be expressed as simple array chunking — the `customBatch` callback gives full control.

---

## Summary Matrix

| Format | Pattern         | Destinations | Override batchTransform? | getBatchStrategy           |
| ------ | --------------- | :----------: | :----------------------: | -------------------------- |
| 1      | Simple array    |     ~38      |            No            | `chunk(...)` simple        |
| 2      | Wrapper + array |      ~5      |            No            | `chunk(...)` + wrapBody    |
| 3      | Multi-endpoint  |     ~10      |         Sometimes        | `chunk(...)` per endpoint  |
| 4      | Custom merge    |      ~4      |         Sometimes        | `customBatch(...)`         |

## Chunking Algorithm

When a `chunk(...)` strategy is applied, the framework uses this algorithm:

```
for each payload in group:
  itemBytes = Buffer.byteLength(JSON.stringify(payload.body))

  if current chunk is non-empty AND (count >= maxSize OR bytes + itemBytes > maxBytes):
    flush current chunk:
      finalBody = wrapBody(chunk.bodies)
      emit { body: finalBody, jobIds: chunk.jobIds }
    reset chunk

  add payload to current chunk
  accumulate bytes

flush remaining items → emit final chunk
```

Each chunk's `jobIds` are aligned 1:1 with the payloads that contributed to it. The `wrapBody` callback constructs the final body shape — making the envelope explicit rather than relying on runtime path traversal.

## dontBatch Flag

Events with `metadata.dontBatch = true` are processed individually:

```
inputs
  ├── batchable (dontBatch != true)  →  batchTransform(allAtOnce)
  └── nonBatchable (dontBatch == true) →  batchTransform([singleEvent]) × N
```

This is used by the control plane to force single-event processing for specific jobs (e.g., retries, debugging).
