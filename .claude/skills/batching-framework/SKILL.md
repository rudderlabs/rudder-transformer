---
name: batching-framework
description: The transform path for every new destination, batched or not — extend DestinationIntegration to implement per-event transforms with automatic validation, grouping, chunking, and response formatting. Read this before writing any new destination's transform, including one whose API takes a single event per request.
---

# Native Batching Framework

Extend `DestinationIntegration`; the framework handles validation, grouping, chunking, error
wrapping and response formatting. No manual grouping/batching logic.

## Every new destination starts here

"Batching" names the framework, not its scope. A single-event API is just `maxItems: 1`. There is
no simpler fallback path — every v0 shape in older destinations is legacy.

A new destination is:

- **Router-only.** `routerTransform.ts` exporting `Integration`. No `transform.js`, no
  `process` (see `deprecate-processor-transform` for why existing ones are being removed).
- **Without a `networkHandler.ts`** — not for transport, not for response handling. Add a
  `delivery.ts` only to override verdicts. Not a judgement call:
  `.claude/skills/batching-framework-delivery/SKILL.md#a-new-destination-gets-no-networkhandlerts`.
- **`{ routerTransform: true, batching: true }` in `src/features.ts`** from day one (see
  [Enabling the Framework](#enabling-the-framework)). It is GA immediately, so the
  `{DEST}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` migration flag does not apply.
- **`transformAtV1: router`** in its `rudder-integrations-config` definition — a definition left on
  `processor` silently never reaches the framework.
- **Shipping `live.ts`** in the same PR (`writing-tests#every-new-destination-gets-livets`,
  harness in `live-integration-test`).

Canonical shape: `src/v0/destinations/openai_ads/` (`routerTransform.ts`, `delivery.ts`,
`types.ts`, `config.ts`, `utils.ts`, `data/OPENAI_ADSConfig.json`). `posthog` and
`custom_audience` are the same without `delivery.ts`.

**The mapping file is part of the shape.** Field plucking lives in `data/<DEST_UPPER>Config.json`
read by `constructPayload` — never a `SOURCE_PATHS`/`FIELD_PATHS` constant in `config.ts`.
`config.ts` holds only what the framework needs: batch limits, endpoint templates, validation
regexes. The `event-transformation` skill owns the mapping shape.

## Reference

- `src/v0/destinations/openai_ads/` — net-new, framework-native end to end
- `src/v0/destinations/posthog/routerTransform.ts` — `ChunkBatchStrategy` + `maxPayloadSize`
- `src/v0/destinations/custom_audience/routerTransform.ts` — `CustomBatchStrategy` + template evaluation
- `src/services/destination/destinationIntegration/` — framework source
- `.claude/skills/batching-framework-delivery/SKILL.md` — response handling

## Architecture

```
RouterTransformationRequestData[]
  → processDestinationIntegration()           [orchestrator]
  → YourIntegration: getInputSchema() → transformEvent() → getBatchStrategy()
  → group by (endpoint, method, headers, params, internalGroupKey)
  → BatchStrategy.batch() → RouterTransformationResponse[]

deliver()  [isProxyV1Request && same predicate as transform]
  → handleDeliveryResponse(Class, ctx): delivery.statusOverrides[status] ?? [class] ?? classify
  → Verdict | perItem(ItemVerdict[]) → toDeliveryV1Response() → DeliveryV1Response
```

## File Structure

```
src/v0/destinations/<dest>/
├── routerTransform.ts            # DestinationIntegration subclass, exported as Integration
├── types.ts                      # Zod schemas, types
├── config.ts                     # framework-needed constants only — NOT field paths
├── data/<DEST_UPPER>Config.json  # source→dest mapping for constructPayload
├── utils.ts                      # (optional)
├── delivery.ts                   # (optional) only if response handling differs from default
├── delivery.test.ts              # (optional) parity vs legacy handler
└── routerTransform.test.ts
test/integrations/destinations/<dest>/
├── router/data.ts                # component cases — the merge gate
├── dataDelivery/data.ts          # proxy/delivery cases
├── network.ts                    # captured partner responses
└── live.ts                       # required for a new destination
```

## Migrating a legacy (v0 JS) destination

Reuse the existing per-event transform — don't reimplement payload logic:

- `transformEvent` calls the existing `process`/`processEvent`, pulls the single payload out of
  `body.JSON`, and passes `endpoint`/`method`/`headers`/`params` through; `wrapBody` re-assembles
  the array (`posthog` is the example).
- Legacy transforms are often `async` with no real I/O; dropping the cosmetic `async` is fine
  but not required (the framework awaits). Real per-event I/O must be cache-backed (see below).
- **Keep `processRouterDest` exported** — pre-GA unenrolled workspaces still fall back to it.
- Transport and response-handling migration: see
  `batching-framework-delivery` → "Enrolled v1 delivery uses the framework transport".

## DestinationIntegration Abstract Class

```typescript
import {
  DestinationIntegration, ChunkBatchStrategy, makeRouterInputSchema, type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

const inputSchema = makeRouterInputSchema({ message, destinationConfig?, connectionConfig? });

class MyIntegration extends DestinationIntegration<TBody, typeof inputSchema> {
  transformEvent(input: z.infer<typeof inputSchema>): TransformedEvent<TBody> | TransformedEvent<TBody>[];
  getBatchStrategy(endpoint: string): BatchStrategy<TBody>;
  getInputSchema() { return inputSchema; } // runs before transformEvent
}
export const Integration = MyIntegration;
```

- **Type the input from the schema** — `z.infer<typeof inputSchema>`, no cast (`custom_audience`).
  `makeRouterInputSchema` validates `message`, `destination.Config` and `connection.config`;
  `metadata` passes through unvalidated. Hybrid record + event-stream destinations extend
  `VDMV2ObjectDestination`, which unions two such schemas.
- **`transformEvent` may be sync or async** — the framework awaits it, sequentially per input.
  Async is only for enrichment the payload can't be built without (gaec's conversion-action
  lookup), and that I/O **must be cache-backed**, or one router call becomes a request per job.
  Throwing fails only that input; throw `InstrumentationError` for bad input.

### Required config fields (credentials, account ids) are `z.string().min(1)`

`z.string()` accepts `''`, so an unconfigured destination passes and fails at delivery as a
partner 401/400 instead of a config error. Put the requirement in the schema and delete the
runtime re-check (`code-structure` → "Don't Re-Validate Inputs That Zod Has Already Validated").

```typescript
// Good
z.object({ apiKey: z.string().min(1), pixelId: z.string().min(1) });
// Bad — '' passes; a resolveAccountConfig() helper re-checks at runtime
z.object({ apiKey: z.string().optional(), pixelId: z.string().optional() });
```

### Event fields: require only what the partner rejects without

Every event rule drops a customer event. Require a field, cap its size or narrow its type only
when the partner has been **shown** (live call or captured mock) to reject without it — docs are
not enough. Otherwise leave it optional, omit when absent, and coerce convertible types. Applies
when speccing too. Full rule:
`.claude/skills/event-transformation/SKILL.md#reject-only-what-the-partner-rejects`.

### Read credentials off `this.destination.Config`, without a cast

`destination` is already typed from the input schema (`destinationIntegration.ts:87`); needing
`this.destination as MyDestination` means the generic is wrong. Read config-held credentials
directly — don't model an `Account` shape for them.

```typescript
const { apiKey, pixelId } = this.destination.Config; // Good
const { apiKey, pixelId } = resolveAccountConfig(this.destination as MyDestination); // Bad
```

## TransformedEvent Type

```typescript
type TransformedEvent<TBody> = {
  body: TBody;               // `{}` if the API takes no body
  endpoint: string;
  endpointPath: string;      // REQUIRED — low-cardinality metrics label, not the URL
  method: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  internalGroupKey?: string; // extra grouping dimension
};
```

Events batch together when `(endpoint, method, headers, params, internalGroupKey)` match. Put
batch-invariant values (auth, account ids, action, resource) in `headers`/`params` — the key then
separates incompatible events and you rarely need `internalGroupKey`.

### `endpointPath` Is A Metrics Label, Not The URL

Use a static string from a fixed set (`'postback'`, `'/events'`, `'/merge'`) — never the resolved
URL or anything derived from the event or config.

```typescript
return { body, endpoint: postbackUrl, endpointPath: 'postback', method, params };       // Good
return { ..., endpointPath: message.type === 'track' ? '/track' : '/identify' };       // Good — closed set
return { ..., endpointPath: postbackUrl };                                              // Bad — series per customer
```

Required by `destinationIntegration/types.ts`, it travels on `batchedRequest.endpointPath` and is a stat tag on `outgoing_request_latency`/`outgoing_request_count` and the delivery
payload-size stats, and prefixes delivery error messages (`src/adapters/network.js`); every
distinct value is a time series (multiplied by histogram buckets). Over-broad beats precise — the
destination type is already a tag. It is **excluded from the grouping key**
(`processDestinationIntegration.ts`), so never use it to separate events, and the group takes it
from whichever payload opened the group.

### The `internalGroupKey` Pattern

Forces separate batches, e.g. ADD vs REMOVE, or incompatible schemas:

```typescript
return { body, endpoint: getEndpoint(audienceId), method: 'POST', internalGroupKey: action };
```

Every split must be forced by the partner API (different endpoint, verb, or incompatible schema)
— it costs batch efficiency. Splitting on the *presence of an optional field* when the API
accepts mixed arrays is the anti-pattern. When in doubt don't set it; when you do, comment which
API constraint requires it.

## Batch Strategies

### ChunkBatchStrategy (default for most destinations)

```typescript
import { ChunkBatchStrategy } from '../../../services/destination/destinationIntegration/chunkBatchStrategy';

getBatchStrategy(): BatchStrategy<TBody> {
  return new ChunkBatchStrategy<TBody>({
    maxItems: MAX_BATCH_SIZE,          // optional
    maxPayloadSize: MAX_PAYLOAD_SIZE,  // optional; '512KB' | '4MB' | '10MB' | '1GB' (parseSizeToBytes)
    wrapBody: (bodies) => ({ api_key: this.destination.Config.apiKey, batch: bodies }), // REQUIRED
  });
}
```

`wrapBody` receives `TBody[]`, returns what becomes `batchedRequest.body.JSON`, and is also used
for size measurement.

**Batch limits are partner-doc constants in `config.ts`, not config fields.** No Zod config field,
no `getMaxBatchSize(config)` fallback helper — the control plane never surfaces them, and a
customer value above the partner's ceiling yields rejected requests (`code-structure` → "Drop
Config Knobs Without Varying Callers").

### Destinations with no request body

Query-string-only APIs (pixel/postback `GET`, one conversion per request) — see
`src/v0/destinations/everflow/`:

```typescript
export type PostbackPayload = Record<string, never>; // types.ts — say there is no body

transformEvent(input): TransformedEvent<PostbackPayload> {
  return { body: {}, endpoint: postbackUrl, endpointPath: 'postback', method: 'GET',
           params: buildParams(input.message, config) };
}
getBatchStrategy() {
  return new ChunkBatchStrategy<PostbackPayload>({ maxItems: MAX_BATCH_SIZE /* 1 */, wrapBody: () => ({}) });
}
```

`wrapBody` is non-optional; the `() => ({})` stub is the accepted shape. Don't invent a body or
set `maxPayloadSize` (it measures nothing). Defaulting `wrapBody` for field-less `TBody` is a
worthwhile framework fix if you are in there anyway, but don't block on it.

### CustomBatchStrategy (for complex batching logic)

```typescript
import { CustomBatchStrategy } from '../../../services/destination/destinationIntegration/customBatchStrategy';
import { chunkPayloads } from '../../../services/destination/destinationIntegration/chunkPayloads';

return new CustomBatchStrategy<TBody>(async (payloads) => {   // TransformedEvent<TBody> & { jobId }
  const chunks = chunkPayloads(payloads, { maxItems: batchSize, wrapBody: () => { throw new Error('not used'); } });
  return chunks.map((chunk) => ({ body: buildCustomBody(chunk.bodies), jobIds: chunk.jobIds }));
});
// returns BatchGroup[] = { body: Record<string, unknown>; jobIds: Set<number> }[]
```

## Enabling the Framework

**`src/features.ts` is the only registration surface.** `src/constants/destinationIntegrationsMap.ts`
is derived (`getGaDestinationIntegrations()` filters `destinationCapabilities` on
`batching: true`) — never hand-edit it.

```typescript
// src/features.ts — destinationCapabilities
<DEST_NAME_UPPER>: { routerTransform: true, batching: true },
```

`routerTransform` puts it on the router path; `batching` marks it **batching-GA**. For the current
roster grep `batching: true` — a copied list goes stale. Every capability (`routerTransform`,
`regulations`, `batching`, `cdkV2`, `transformerProxy`) is authored here; every map in
`src/constants/` and `defaultFeaturesConfig` derives from it, so "add it to a list in
`src/constants/`" always means "edit `features.ts`".

Batching destinations advertise `transformerProxy` by default. Set `transformerProxy: false` only
when rudder-server still delivers the output directly (e.g. `CUSTOM_AUDIENCE`).
`features.test.ts` requires a proxy-advertising destination to implement the proxy;
`batching: true` satisfies that on its own, with or without a `delivery` spec — don't write a
`networkHandler.ts` to "earn" it.

### One gate, both halves

`isDestinationIntegrationEnabled(destType, workspaceId)` (`src/constants/destinationIntegrationsMap.ts`)
is the **only** predicate, for router transform *and* delivery:

- batching-GA → true for every workspace;
- otherwise → true only for workspaces in `{DEST_NAME_UPPER}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS`
  (comma-separated or `ALL`) — the pre-GA rollout knob.

`doRouterTransformation` uses it to pick `processDestinationIntegration()` over
`processRouterDest()`; `deliver()` uses it to pick the framework bridge over the `networkHandler`.
There is no separate delivery flag: delivery interprets what the matching transform built, so one
decision makes a mismatch unrepresentable.

Carve-out: a **v0 proxy request** always stays on the legacy handler, since a v0 caller cannot
parse a `DeliveryV1Response` (`isProxyV1Request` in `src/services/destination/nativeIntegration.ts`).

## Delivery (response handling)

The class declares a static `delivery` spec (`statusOverrides`, `failureReason`) and never builds
a `DeliveryV1Response`, picks a status, or throws. Most destinations need nothing — the default
reproduces `genericNetworkHandler`. Contract, verdicts, `perItem`, and migrating a destination
that had a network handler: `.claude/skills/batching-framework-delivery/SKILL.md`.

## Partners that reject the whole batch

All-or-nothing APIs (OpenAI Ads, Reddit, Amplitude) fail the whole request on one bad event.
Transform-time validation only covers rules you knew about; an unknown rule fails the batch on
every retry. If the partner returns per-item results, parse them instead (`perItem`). Otherwise:
on a 4xx **with more than one event**, mark every job `dontBatch: true` and return 500 so the
router redelivers individually.

**On the framework this is a `delivery.ts` verdict:**

```ts
static delivery = {
  statusOverrides: {
    // Exact keys beat class keys — without this '4xx' would turn a transient 429 into a permanent split.
    429: (ctx, fallback) => fallback(),
    '4xx': (ctx, fallback) => retry(reasonOf(fallback()), { dontBatch: true }),
  },
};
```

The framework then: emits 500 + `dontBatch: true` on every job; rewrites the verdict to **abort**
(400) when the batch is already a single job; and never routes retryable 5xx to a `'4xx'` override.
See `retry` and the `dontBatchAbortCount` rewrite in
`src/services/destination/destinationIntegration/delivery.ts`, and
`batching-framework-delivery#dontbatch-softens-an-abort-it-never-hardens-a-retry`.

### The legacy shape — non-framework destinations only

Never for a new destination. In a legacy `networkHandler`:

```ts
const populateResponseWithDontBatch = (rudderJobMetadata, errorMessage) =>
  rudderJobMetadata.map((metadata) => ({
    statusCode: metadata.dontBatch ? 400 : 500, // already-isolated singleton → abort, don't loop
    metadata: { ...metadata, dontBatch: true },
    error: errorMessage,
  }));

// order matters — transient cases BEFORE the split
if (isHttpStatusRetryable(status)) throw new RetryableError(/* … */); // 5xx: retry as a batch
if (isHttpStatusThrottled(status)) throw new ThrottledError(/* … */); // 429: back off, don't split
if (rudderJobMetadata.length > 1) {
  throw new TransformerProxyError('<DEST>: error during response transformation', 500,
    { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(500) }, destinationResponse, '',
    populateResponseWithDontBatch(rudderJobMetadata, JSON.stringify(response)));
}
```

Easy to get wrong:

- **Split only on a 4xx.** `!isHttpStatusSuccess(status)` also catches 429/5xx and permanently
  splits a transient, whole-batch problem.
- **Guard on `rudderJobMetadata.length > 1`**, or a real single-event failure never aborts.
- **Terminate with `metadata.dontBatch ? 400 : 500`**; unconditional 500 retries a bad event forever.

References: `src/v1/destinations/am/networkHandler.ts` (most complete — correct ordering and
termination; returns a `DeliveryV1Response` instead of throwing, both work);
`src/v1/destinations/reddit/networkHandler.js` (correct `length > 1` guard and `status === 400`
narrowing, but unconditional 500 — take Amplitude's line); `src/v1/destinations/algolia/networkHandler.js`.
Handlers at `src/v1/destinations/<dest>/networkHandler.{ts,js}` are auto-discovered by
`src/adapters/networkHandlerFactory.js` (export `networkHandler` or `NetworkHandler`).

## Testing

Drive the class (not an instance) through `processDestinationIntegration`:

```typescript
import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import { Integration } from './routerTransform';

const buildInput = (jobId: number, overrides = {}) => ({
  message: { type: 'record', action: 'insert', fields: {}, identifiers: {}, ...overrides },
  metadata: { jobId, workspaceId: 'ws-1', secret: { accessToken: 'token' } },
  destination: { ID: 'dest-1', Config: { /* … */ } },
  connection: { config: { destination: { /* … */ } } },
});

const results = await processDestinationIntegration([buildInput(1), buildInput(2)], Integration, {});
```

Reference suite: `src/v0/destinations/custom_audience/routerTransform.test.ts` (factories,
grouping, hashing, auth, errors).

## Error Handling

- Zod failure from `getInputSchema` → 400 with formatted message.
- Throw in `transformEvent()` → that event fails; the rest still ship.
- Throw in `getBatchStrategy().batch()` → the whole group fails.
- `InstrumentationError` = bad input, `ConfigurationError` = bad config (neither retries).

Transform-time validation keeps known-bad events out of batches; pair it with the whole-batch
fallback above for rules the partner has and you don't.

## Metrics

Emitted automatically, already destination-tagged — don't add your own batch-composition counter:
`dont_batch_events` and `output_batch_size`. A climbing `dont_batch_events` on an all-or-nothing
partner means a rule they enforce and `transformEvent()` doesn't; the singleton's preserved
`destinationResponse` names the field — move that rule into `transformEvent()`.
