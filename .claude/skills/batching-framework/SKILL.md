---
name: batching-framework
description: The transform path for every new destination, batched or not — extend DestinationIntegration to implement per-event transforms with automatic validation, grouping, chunking, and response formatting. Read this before writing any new destination's transform, including one whose API takes a single event per request.
---

# Native Batching Framework

**Objective:** Use the batching framework to implement destination router transforms. Instead of writing manual grouping/batching logic, extend the `DestinationIntegration` abstract class — the framework handles validation, grouping, chunking, error wrapping, and response formatting.

## Every new destination starts here

**"Batching" names the framework, not its scope.** It is the transform path for a net-new
destination whether or not the partner's API accepts more than one event per request — a
single-event API is just a batch strategy with `maxItems: 1`. Don't read the name and conclude
this skill is for high-volume destinations only; there is no second, simpler path to fall back
to, and the v0 shapes you will find by opening an older destination are all legacy.

A new destination is:

- **Router-only.** `routerTransform.ts` exporting `Integration`, a `DestinationIntegration`
  subclass. No `transform.js`, and no `process` / processor transform — see
  `.claude/skills/deprecate-processor-transform/SKILL.md` for why the ones that exist are being
  removed rather than copied.
- **Without a `networkHandler.ts`**, for transport or for response handling. Take the framework
  default, and add a `delivery.ts` only to override specific verdicts. This is not a
  judgement call: see
  `.claude/skills/batching-framework-delivery/SKILL.md#a-new-destination-gets-no-networkhandlerts`,
  including what to do when it looks like you need one.
- **Registered `{ routerTransform: true, batching: true }` in `src/features.ts`** from day one —
  plus `transformerProxy: true` if delivery goes through the transformer proxy (see
  "Enabling the Framework" below). A new destination is GA on the framework immediately, so the
  `{DEST}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` rollout flag — which exists for migrating an
  existing destination — does not apply.
- **`transformAtV1: router`** in its `rudder-integrations-config` definition. The framework only
  runs on the router path; a definition left on `processor` silently never reaches it.
- **Shipping `test/integrations/destinations/<dest>/live.ts`.** Component tests assert against
  mocks, so they cannot catch a payload the partner rejects — an endpoint typo, a renamed field, a
  required parameter nobody sent. See `.claude/skills/writing-tests/SKILL.md#every-new-destination-gets-livets`
  for the rule and `.claude/skills/live-integration-test/SKILL.md` for the harness. This is part of
  the destination, not a follow-up PR.

`src/v0/destinations/openai_ads/` is the canonical shape — `routerTransform.ts`, `delivery.ts`,
`types.ts`, `config.ts`, `utils.ts` and `data/OPENAI_ADSConfig.json`. `posthog` and
`custom_audience` are the same shape without a `delivery.ts`.

**The mapping file is part of that shape, not an optional extra.** A destination's source-field →
destination-field plucking belongs in `data/<DEST_UPPER>Config.json` and is consumed by
`constructPayload` — never as a bespoke `SOURCE_PATHS` / `FIELD_PATHS` constant in `config.ts`,
which forces a hand-written config type and a resolver function per field group. `config.ts` holds
constants the framework itself needs (batch limits, HTTP method, endpoint templates, regexes).
See `.claude/skills/event-transformation/SKILL.md` for the mapping shape, `required: true`, and
`sourceFromGenericMap`.

The rest of this skill assumes that starting point. The `networkHandler` material below is about
**migrating** an existing destination and is marked as such.

## Reference

- `src/v0/destinations/openai_ads/` — a net-new destination built framework-native, start to finish
- `src/v0/destinations/posthog/routerTransform.ts` — `ChunkBatchStrategy` with `maxPayloadSize`
- `src/v0/destinations/custom_audience/routerTransform.ts` — `CustomBatchStrategy` with template evaluation
- `src/services/destination/destinationIntegration/` — Framework source code
- `.claude/skills/batching-framework-delivery/SKILL.md` — Delivery (response handling) contract

## Architecture

```
RouterTransformationRequestData[]
    |
processDestinationIntegration()      [framework orchestrator]
    |
DestinationIntegration<TBody>        [your integration class]
    |--- getInputSchema()            → Zod schema for upfront validation
    |--- transformEvent()            → per-event transform → TransformedEvent<TBody>
    |--- getBatchStrategy()          → batch strategy factory
    |
Framework groups by composite key:  (endpoint, method, headers, params, internalGroupKey)
    |
BatchStrategy.batch()                [chunking/wrapping]
    |
RouterTransformationResponse[]
```

Delivery is a separate service call, over the same class:

```
deliver()                            [nativeIntegration; isProxyV1Request && same predicate as transform]
    |
handleDeliveryResponse(Class, ctx)   [framework-owned]
    |--- delivery.statusOverrides[status] ?? [class] ?? classify by status
    |
Verdict | perItem(ItemVerdict[])     [what should happen to the batch]
    |
toDeliveryV1Response()               [derives per-job codes, statTags, message]
    |
DeliveryV1Response
```

## File Structure

```
src/v0/destinations/<dest_name>/
├── routerTransform.ts        # DestinationIntegration subclass (exported as Integration)
├── types.ts                  # Zod schemas, TypeScript types
├── config.ts                 # Constants the framework needs: batch limits, HTTP method,
│                             #   endpoint templates, validation regexes — NOT field paths
├── data/<DEST_UPPER>Config.json  # The source→dest field mapping, read by constructPayload
├── utils.ts                  # (Optional) Field processing, API helpers
├── delivery.ts               # (Optional) the `delivery` spec — only if response handling
│                             #            differs from the framework default
├── delivery.test.ts          # (Optional) Parity test vs the legacy handler
└── routerTransform.test.ts   # Unit tests

test/integrations/destinations/<dest_name>/
├── router/data.ts            # Component (mocked) cases — the merge gate
├── dataDelivery/data.ts      # Proxy/delivery cases
├── network.ts                # Mocked partner responses
└── live.ts                   # Real-account scenarios — required for a new destination
```

## Migrating a legacy (v0 JS) destination

When adding batching to a destination that already has a `transform.js` with a working per-event
transform, **reuse it — do not reimplement the payload logic in `routerTransform.ts`**:

- Have `transformEvent` call the existing per-event function (`process`/`processEvent`) and reshape
  its delivery request into a `TransformedEvent` — pull the single per-event payload out of
  `body.JSON`, and pass `endpoint`/`method`/`headers`/`params` straight through. `posthog` is the
  canonical example (it reuses `processEvent` from its transform). `wrapBody` then re-assembles the
  array wrapper the API expects.
- Legacy transforms are often declared `async` but do no real I/O. Since `transformEvent` must be
  synchronous, drop the cosmetic `async`/`await` from the reused chain so it returns directly.
  Callers that `await` a now-plain value are unaffected.
- **Keep the legacy `processRouterDest` exported.** During pre-GA env-var rollout the destination
  falls back to it for workspaces not yet enabled, so it must stay functional.

## DestinationIntegration Abstract Class

```typescript
import { DestinationIntegration } from '../../../services/destination/destinationIntegration/destinationIntegration';

// Type parameters:
//   TBody         — shape of each item in the batch (your per-event payload)
//   TConfig       — destination config type (from destination.Config)
//   TConnectionConfig — connection config type (from connection.config)

class MyIntegration extends DestinationIntegration<TBody, TConfig, TConnectionConfig> {
  // MUST implement these three methods:

  transformEvent(
    input: RouterTransformationRequestData,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[];
  // Transform a single input event into one or more intermediate payloads.
  // Throw InstrumentationError for bad input — framework wraps it into error response.
  // MUST be synchronous — the framework calls transformEvent WITHOUT awaiting it
  // (see transformEvents in destinationIntegration.ts). Never make it async / return a Promise;
  // an async transformEvent would push a Promise as the payload and silently corrupt the batch.

  getBatchStrategy(endpoint: string): BatchStrategy<TBody>;
  // Return a batch strategy instance that defines how events are chunked and wrapped.

  getInputSchema(): ZodType;
  // Return a Zod schema for input validation (run before transformEvent).
}

export const Integration = MyIntegration;
```

Build the schema with `makeRouterInputSchema({ message, destinationConfig?, connectionConfig? })` — a single message variant plus optional destination/connection config. Hybrid record + event-stream destinations extend `VDMV2ObjectDestination`, which unions two such schemas for you.

### Required config fields are `z.string().min(1)`

`z.string()` accepts `''`. For a credential or an account identifier that means an unconfigured
destination passes schema validation and the emptiness surfaces on the wire — an empty bearer
token, or an empty required query parameter — as a 401/400 from the partner at delivery time,
long after the point where it could have been reported as a configuration error.

Put the requirement in the schema and the downstream runtime check becomes deletable (see
`code-structure` → "Don't Re-Validate Inputs That Zod Has Already Validated"). The two rules
work together: the schema is the single place the requirement is expressed.

```typescript
// Good — fails at transform time with a clear error
const DestinationConfigSchema = z.object({
  apiKey: z.string().min(1),
  pixelId: z.string().min(1),
});

// Bad — `''` passes, and a resolveAccountConfig() helper re-checks it at runtime
const DestinationConfigSchema = z.object({
  apiKey: z.string().optional(),
  pixelId: z.string().optional(),
});
```

### Read credentials off `this.destination.Config`, without a cast

`DestinationIntegration` declares `protected destination: Destination<ExtractDestinationConfig<z.infer<TInputSchema>>>` (`destinationIntegration.ts:86`), so the destination is **already typed** from the input schema's generic parameter. `this.destination as MyDestination` means the generic is wrong, not that a cast is needed.

When a destination's credentials live in the destination config rather than the accounts framework, read them from `this.destination.Config` directly — don't model an `Account` shape for them.

```typescript
// Good
const { apiKey, pixelId } = this.destination.Config;

// Bad — cast, plus an Account type that models config fields
const { apiKey, pixelId } = resolveAccountConfig(this.destination as MyDestination);
```

## TransformedEvent Type

```typescript
type TransformedEvent<TBody> = {
  body: TBody; // Individual event payload
  endpoint: string; // API endpoint
  endpointPath: string; // REQUIRED. Low-cardinality metrics label (see below)
  method: string; // HTTP method (POST, PUT, DELETE, etc.)
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  internalGroupKey?: string; // Extra grouping dimension (see below)
};
```

The framework groups all `TransformedEvent` objects by a composite key of `(endpoint, method, headers, params, internalGroupKey)`. Events in the same group are batched together.

> **Put batch-invariant fields in `headers`/`params`.** Anything that must be identical across a batch (auth token, account/customer IDs, target action, API resource being addressed) belongs in `headers` or `params` so the composite key naturally keeps incompatible events apart. You usually don't need `internalGroupKey` if these already carry the distinguishing values.

### `endpointPath` Is A Metrics Label, Not The URL

`endpointPath` is **required** (`destinationIntegration/types.ts`) and easy to fill in with the
resolved endpoint, which is wrong. It is not used to address anything: it travels on
`batchedRequest.endpointPath` and becomes a **stat tag** on `outgoing_request_latency` and
`outgoing_request_count`, on the delivery payload-size stats, and the prefix of the delivery error
message (`src/adapters/network.js`). Whatever you put there becomes a label value on a time
series — including on a latency histogram, where the bucket count multiplies it.

**Give it a static string naming the logical endpoint** — `'postback'`, `'/events'`, `'/merge'` —
chosen from a fixed, enumerable set. Never the resolved URL, and never anything derived from the
event or from destination config:

```typescript
// Good — a fixed label per logical endpoint
return { body, endpoint: postbackUrl, endpointPath: 'postback', method, params };

// Good — still fixed; the set is closed and readable in the source
return { ..., endpointPath: message.type === 'track' ? '/track' : '/identify' };

// Bad — one time series per customer-configured URL, per audience id, per event name
return { ..., endpointPath: postbackUrl };
```

A customer-configured base URL, an audience or account id, or an interpolated event name each
turn one metric into thousands. Prefer an over-broad label to a precise one: the destination type
is already a tag, so a single `'postback'` across every request is a perfectly good answer for a
destination with one endpoint.

Two consequences of it being observability-only:

- **It is deliberately excluded from the grouping key** (`processDestinationIntegration.ts`:
  *"Observability-only — not part of the grouping key"*). Do not reach for it to keep events
  apart — that is what `internalGroupKey` is for.
- **The group takes it from whichever payload opened the group.** If it varies across events that
  otherwise batch together, the value on the emitted request is arbitrary. Another reason to
  derive it from the endpoint shape rather than the event.

### The `internalGroupKey` Pattern

Use `internalGroupKey` to force events into separate batches beyond the default grouping. Common use cases:

- **Action-based grouping**: ADD vs REMOVE events need separate API calls
- **Schema-based grouping**: Events with different field schemas can't share a batch

```typescript
return {
  body: payload,
  endpoint: getEndpoint(audienceId),
  method: 'POST',
  internalGroupKey: action, // 'ADD' and 'REMOVE' get separate batches
};
```

**Every split needs a reason the partner's API forces.** `internalGroupKey` halves batch
efficiency in exchange for correctness, so the justification has to be that the API would
reject or mis-handle the mixed batch — a different endpoint, a different action verb, an
incompatible schema.

Splitting on the *presence of an optional field* is the anti-pattern. If the API accepts mixed
events in one array, grouping by "has a click id" / "has no click id" doubles the request count
and buys nothing. When in doubt, don't set the key — and if you do set it, say in a comment
which API constraint requires it.

## Batch Strategies

### ChunkBatchStrategy (default for most destinations)

Standard chunking by item count and/or payload size:

```typescript
import { ChunkBatchStrategy } from '../../../services/destination/destinationIntegration/chunkBatchStrategy';

getBatchStrategy(): BatchStrategy<TBody> {
  return new ChunkBatchStrategy<TBody>({
    maxItems: 10000,           // Max events per batch (optional)
    maxPayloadSize: '10MB',    // Max total request size (optional, e.g., '512KB', '4MB')
    wrapBody: (bodies) => ({   // REQUIRED: wraps array of event bodies into final request body
      api_key: this.destination.Config.apiKey,
      batch: bodies,
    }),
  });
}
```

Size strings support: `'10MB'`, `'512KB'`, `'4MB'`, `'1GB'` — parsed via `parseSizeToBytes()`.

**Batch limits are constants from the partner's docs, not destination-config fields.** Declare
`MAX_BATCH_SIZE` / `MAX_PAYLOAD_SIZE` in the destination's `config.ts` and use them directly.
Do not add them to the destination's Zod config schema, and do not write
`getMaxBatchSize(config)` helpers that fall back to a constant — the control plane does not
surface these, so every call resolves to the fallback. They are an unused knob that has to be
read, documented and tested, and a customer-supplied value above the partner's real ceiling
would produce rejected requests rather than smaller ones. (See `code-structure` → "Drop Config
Knobs Without Varying Callers".)

The `wrapBody` function:

- Receives an array of `TBody` objects (the individual event payloads)
- Returns the final `Record<string, unknown>` that becomes `batchedRequest.body.JSON`
- Is also used for size measurement when `maxPayloadSize` is set

### Destinations with no request body

Some partners take the whole event in the query string — a pixel or postback URL fetched with
`GET`, one conversion per request. The framework still expects a strategy, so the shape is
(`src/v0/destinations/everflow/` is the worked example):

```typescript
// types.ts — there is no body, and the type should say so
export type PostbackPayload = Record<string, never>;

// routerTransform.ts
transformEvent(input): TransformedEvent<PostbackPayload> {
  return {
    body: {},                         // empty — everything travels in `params`
    endpoint: postbackUrl,
    endpointPath: 'postback',
    method: 'GET',
    params: buildParams(input.message, config),
  };
}

getBatchStrategy(): BatchStrategy<PostbackPayload> {
  return new ChunkBatchStrategy<PostbackPayload>({
    maxItems: MAX_BATCH_SIZE,         // 1 — the API takes one conversion per request
    wrapBody: () => ({}),             // required by the constructor; nothing to wrap
  });
}
```

`wrapBody` is non-optional on `ChunkBatchStrategy` even though nothing is wrapped here — the
`() => ({})` stub is the accepted shape, not an oversight to route around. Don't invent a
`body`-shaped payload just to have something to pass it, and don't set `maxPayloadSize`: with an
empty body it measures nothing.

Note that the batch-invariant rule still holds and does more work here than usual — with
`maxItems: 1` every request is its own batch, but per-event values in `params` mean the composite
grouping key differs for every event, which is exactly what you want.

### CustomBatchStrategy (for complex batching logic)

Full control over how events are grouped and wrapped:

```typescript
import { CustomBatchStrategy } from '../../../services/destination/destinationIntegration/customBatchStrategy';
import { chunkPayloads } from '../../../services/destination/destinationIntegration/chunkPayloads';

getBatchStrategy(): BatchStrategy<TBody> {
  return new CustomBatchStrategy<TBody>(async (payloads) => {
    // payloads: Array<TransformedEvent<TBody> & { jobId: number }>

    const chunks = chunkPayloads(payloads, {
      maxItems: batchSize,
      wrapBody: () => { throw new Error('not used'); },
    });

    // Custom processing per chunk (e.g., template evaluation, custom serialization)
    return chunks.map((chunk) => ({
      body: buildCustomBody(chunk.bodies),
      jobIds: chunk.jobIds,           // Set<number> of jobIds in this chunk
    }));
  });
}
```

Returns `BatchGroup[]`:

```typescript
type BatchGroup = {
  body: Record<string, unknown>; // Final wrapped body
  jobIds: Set<number>; // All jobIds in this batch
};
```

## Enabling the Framework

**`src/features.ts` is the only registration surface. Do not hand-edit
`src/constants/destinationIntegrationsMap.ts`** — it is derived, not authored:

```typescript
// src/constants/destinationIntegrationsMap.ts
export const destinationIntegrationsMap: Record<string, true> = getGaDestinationIntegrations();
```

`getGaDestinationIntegrations()` filters `destinationCapabilities` in `src/features.ts`
on `batching: true`, so adding an entry to that map by hand is either a no-op or a conflict.

Register the destination by adding the `batching` capability alongside `routerTransform`:

```typescript
// src/features.ts — destinationCapabilities
const destinationCapabilities: Record<string, DestinationCapabilities> = {
  POSTHOG: { routerTransform: true, batching: true },
  CUSTOM_AUDIENCE: { routerTransform: true, batching: true },
  <DEST_NAME_UPPER>: { routerTransform: true, batching: true },  // Add your destination here
};
```

`routerTransform: true` puts the destination on the router-transform path at all;
`batching: true` marks it **batching-GA**. For the current roster, grep `batching: true` in
`src/features.ts` — it changes as destinations migrate, so a list copied into a doc goes stale.

**Every capability is declared here, including `transformerProxy`.** `destinationCapabilities` is
the single authored source for all of them — `routerTransform`, `regulations`, `batching`, `cdkV2`
and `transformerProxy` — and each derived map and `defaultFeaturesConfig` section is computed from
it. The rule above is not specific to the batching map: whenever it looks like a destination needs
adding to a list in `src/constants/`, the change belongs in `features.ts`.

Declare `transformerProxy: true` when the destination's delivery goes through the transformer
proxy rather than rudder-server delivering the payload itself:

```typescript
<DEST_NAME_UPPER>: { routerTransform: true, batching: true, transformerProxy: true },
```

`features.test.ts` enforces that a destination may only declare it if it actually implements the
proxy. **`batching: true` satisfies that on its own** — the framework owns delivery outright, so a
batching destination implements the proxy however its `delivery` spec is laid out, and one
declaring no spec at all still qualifies. You do not need a `networkHandler.ts` to earn the
capability, and writing one to "support" it is exactly the anti-pattern in
`.claude/skills/batching-framework-delivery/SKILL.md#a-new-destination-gets-no-networkhandlerts`.

### One gate, both halves

`isDestinationIntegrationEnabled(destType, workspaceId)`
(`src/constants/destinationIntegrationsMap.ts`) is the **only** predicate, and it answers for the
router transform *and* delivery:

- **batching-GA** (`batching: true` in `features.ts`) → true for every workspace, always.
- **otherwise** → true only for a workspace named in
  `{DEST_NAME_UPPER}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` (comma-separated workspace IDs or
  `ALL`) — the pre-GA rollout knob.

`doRouterTransformation` calls it to route events through `processDestinationIntegration()` instead
of the legacy `processRouterDest()`; `deliver()` calls it to read the response through the
framework's delivery bridge instead of the destination's `networkHandler`.

There is **no separate delivery flag.** The delivery path interprets a payload built by the matching
transform path, so deciding both from one call makes the mismatch unrepresentable — where a separate
flag made it a configuration mistake anyone could make. Enrolling a workspace moves both halves
together, and so does going GA. See `.claude/skills/batching-framework-delivery/SKILL.md`.

One thing is *not* gated on the predicate: a **v0 proxy request** stays on the legacy handler
whatever it returns, because the framework produces a `DeliveryV1Response` natively and a v0 caller
cannot parse one. See `isProxyV1Request` in `src/services/destination/nativeIntegration.ts`.

## Delivery (response handling)

The framework owns delivery too, over the same class: an integration declares a static
`delivery` spec — `statusOverrides` and `failureReason`, grouped so they read as delivery rather
than as more transform surface — and never builds a `DeliveryV1Response`, picks a status code, or
throws.

**Most destinations need nothing** — the default reproduces `genericNetworkHandler`. `posthog` and
`custom_audience` declare no overrides at all.

**See `.claude/skills/batching-framework-delivery/SKILL.md`** for the contract, the verdict builders
and the `perItem` rules. Enabling it is not separate — it rides on the same registration and the
same predicate as the transform, per "One gate, both halves" above.

### If you just batched a destination that had a network handler

Only *response handling* moves onto the class; transport (`proxy` / `prepareProxy` /
`processAxiosResponse`) stays in `networkHandler.ts`. When the handler builds the request at delivery
time, `transformEvent`'s `endpoint` is typically an unused placeholder — the handler derives the real
URL from `params`. If instead it reads the endpoint from the payload, set it normally.

- **Audit the transport for single-item assumptions.** Pre-batching it received one item per request
  and often hard-codes index `0` (e.g. `set(body.JSON, 'items[0].field', ...)`). Once batched,
  `items` is an array of N — iterate the whole array. The single-item case collapses to an array of
  one, so legacy traffic is unaffected (a safe, ungated change).
- **Don't gate transport changes on the batching predicate**; make them correct for both 1 and N
  items. `deliver()` does read `isDestinationIntegrationEnabled`, but only *after* `proxy()` and
  `processAxiosResponse()` have already run — transport is chosen by `networkHandlerFactory`, not by
  the predicate — and the same handler still serves v0 proxy requests and any pre-GA workspace.

Cover this with a focused unit test that mocks the delivery SDK/client and asserts the per-item field
is set on **every** item (cheaper and more direct than a full dataDelivery mock).

## Partners that reject the whole batch

Some APIs are **all-or-nothing**: one invalid event fails the entire request (OpenAI Ads,
Reddit, Amplitude). For these, transform-time validation is **not sufficient on its own** —
it only covers the rules you knew about when you wrote it. A partner that adds a validation
rule, or one whose docs are incomplete, will reject a batch of N on one event you believed
was fine, and the retry re-sends the same batch and fails again.

Whether you need this at all: if the partner documents a per-item result array (partial
success), you don't — parse it and mark only the failed items. If one bad item fails the
request, you do.

The fallback: on a 4xx **when more than one event was sent**, mark every job `dontBatch: true`
and return **500** so the router re-delivers them individually; the offending event then fails
alone and the rest succeed.

**On the framework this is a `delivery.ts` verdict, not a `networkHandler`.** Return
`retry(..., { dontBatch: true })` from a `'4xx'` status override:

```ts
static delivery = {
  statusOverrides: {
    // Exact keys win over the class key. Without this, '4xx' would also swallow 429 and turn a
    // rate limit — transient, and a whole-batch problem — into a permanent per-job dontBatch.
    429: (ctx, fallback) => fallback(),
    '4xx': (ctx, fallback) => retry(reasonOf(fallback()), { dontBatch: true }),
  },
};
```

The framework then applies the three rules below for you: a `retry` verdict yields **500** and
stamps `dontBatch: true` on every job's metadata; when the batch is already a **single** job it
rewrites that verdict to an **abort** (400), so a permanently-bad event terminates instead of
looping; and retryable 5xx never reaches a `'4xx'` override at all. See `retry` and the
`dontBatchAbortCount` rewrite in `src/services/destination/destinationIntegration/delivery.ts`, and
`.claude/skills/batching-framework-delivery/SKILL.md#dontbatch-softens-an-abort-it-never-hardens-a-retry`
for why `dontBatch` must never be paired with a transient status.

### The legacy shape — non-framework destinations only

A destination **not** on the framework does this in its `networkHandler`, where the partner's
actual rejection is visible. Do not write this for a new destination:

```ts
const populateResponseWithDontBatch = (rudderJobMetadata, errorMessage) =>
  rudderJobMetadata.map((metadata) => ({
    // already retried as a singleton and still failing → abort instead of looping
    statusCode: metadata.dontBatch ? 400 : 500,
    metadata: { ...metadata, dontBatch: true },
    error: errorMessage,
  }));

// in responseHandler — order matters; the retryable and throttled cases must be
// handled BEFORE the split, or a transient failure gets split up permanently:
if (isHttpStatusRetryable(status)) {
  throw new RetryableError(/* … */); // 5xx — retry the batch as a batch
}
if (isHttpStatusThrottled(status)) {
  throw new ThrottledError(/* … */); // 429 — back off, don't split
}
// only now: a genuine 4xx rejection of the whole batch
if (rudderJobMetadata.length > 1) {
  throw new TransformerProxyError(
    '<DEST>: error during response transformation',
    500,
    { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(500) },
    destinationResponse,
    '',
    populateResponseWithDontBatch(rudderJobMetadata, JSON.stringify(response)),
  );
}
```

Three rules that are easy to get wrong:

- **Split only on a 4xx.** A `!isHttpStatusSuccess(status)` guard also catches 429 and 5xx,
  which turns a rate-limit or a partner outage — transient, and a whole-batch problem — into
  a permanent `dontBatch` on every job plus N individual redeliveries. Handle retryable and
  throttled first, as above, or test for 4xx explicitly.
- **Guard on `rudderJobMetadata.length > 1`.** Without it a genuine single-event failure is
  converted into a retry, and the event never aborts.
- **Terminate with `metadata.dontBatch ? 400 : 500`.** An event that already came back as a
  `dontBatch` singleton and failed again must return the real 4xx. Returning 500
  unconditionally retries a permanently-bad event forever.

References: `src/v1/destinations/am/networkHandler.ts` — the closest thing to a complete
reference: it orders the checks as above (`isHttpStatusRetryable` → `isHttpStatusThrottled` →
split) and has the `dontBatch ? 400 : 500` termination rule. It *returns* a
`DeliveryV1Response` for the split rather than throwing `TransformerProxyError`; both shapes
work, pick one. `src/v1/destinations/reddit/networkHandler.js` has the `length > 1` guard and
correctly narrows to `status === 400`, but its `populateResponseWithDontBatch` returns 500
unconditionally — take Amplitude's version of that line. Also
`src/v1/destinations/algolia/networkHandler.js`.

Network handlers live at `src/v1/destinations/<dest>/networkHandler.{ts,js}` and are
auto-discovered by `src/adapters/networkHandlerFactory.js` from the directory name — export
them as `networkHandler` or `NetworkHandler`; no registration step.

## Testing

Test via the framework's `processDestinationIntegration` function — pass the `Integration` class (not an instance):

```typescript
import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import { Integration } from './routerTransform';

const buildDestination = (overrides = {}) => ({
  ID: 'dest-1',
  Config: { /* destination config */ ...overrides },
});

const buildConnection = (overrides = {}) => ({
  config: { destination: { /* connection config */ ...overrides } },
});

const buildInput = (jobId: number, overrides = {}) => ({
  message: { type: 'record', action: 'insert', fields: {}, identifiers: {}, ...overrides },
  metadata: { jobId, workspaceId: 'ws-1', secret: { accessToken: 'token' } },
  destination: buildDestination(),
  connection: buildConnection(),
});

describe('Integration via processDestinationIntegration', () => {
  it('batches events by action', async () => {
    const inputs = [
      buildInput(1, { action: 'insert' }),
      buildInput(2, { action: 'insert' }),
      buildInput(3, { action: 'delete' }),
    ];
    const results = await processDestinationIntegration(inputs, Integration, {});
    // Assert batch structure, grouping, metadata
  });

  it('returns error for invalid input', async () => {
    const inputs = [buildInput(1, { type: 'track' })]; // wrong type
    const results = await processDestinationIntegration(inputs, Integration, {});
    expect(results[0].statusCode).toBe(400);
  });
});
```

**Reference:** `src/v0/destinations/custom_audience/routerTransform.test.ts` — Complete test suite with helper factories, action grouping, hashing, auth, and error cases.

## Error Handling

The framework handles error wrapping automatically:

- **Zod validation failure** (from `getInputSchema`) → 400 error response with formatted message
- **Errors thrown in `transformEvent()`** → per-event error response (other events still succeed)
- **Errors thrown in `getBatchStrategy().batch()`** → affects all events in that batch group

Use `InstrumentationError` for bad input data (no retry), `ConfigurationError` for bad config (no retry).

Validating in `transformEvent()` is what keeps a known-bad event out of a batch in the first
place — it fails one job while the rest of the batch still ships. For partners that reject the
whole request on one bad item, pair it with the networkHandler fallback above; transform-time
checks cannot cover rules the partner has and you don't.

## Metrics

The framework emits these metrics automatically:

- `dont_batch_events` — count of events with `dontBatch` flag
- `output_batch_size` — histogram of events per output batch

Don't add a destination-specific batch-composition counter; these already carry the
destination tags. A climbing `dont_batch_events` rate on an all-or-nothing partner is the
signature of a validation rule they enforce and `transformEvent()` doesn't — the preserved
`destinationResponse` on the failed singleton names the field, and that rule then belongs in
`transformEvent()` so it stops costing a delivery round-trip.
