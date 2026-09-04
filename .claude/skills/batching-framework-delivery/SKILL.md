---
name: batching-framework-delivery
description: Delivery (response handling) for batching-framework destinations. Declare a static delivery spec on the DestinationIntegration class instead of writing a networkHandler responseHandler — the framework derives status codes, statTags and the response shape.
---

# Batching Framework — Delivery

**Objective:** Handle a destination's delivery response by declaring what should happen to the batch, and let the framework turn that into the delivery API response. Integrations never build a `DeliveryV1Response`, choose a status code, or throw.

For the router-transform half of the framework, see `.claude/skills/batching-framework/SKILL.md`.

## When you need this

**Most destinations need nothing.** The framework default reproduces `genericNetworkHandler`: 2xx is a success, 429 is throttled, other retryable statuses retry, everything else aborts. `posthog` and `custom_audience` declare no overrides at all.

Add a `delivery.ts` only when the destination's response handling genuinely differs:

- a **partial-failure body** — some records rejected inside an otherwise-successful response
- a **2xx that isn't a success** — the failure is in the body, not the status
- **identity-keyed failures** — the response names *which* records failed rather than indexing them
- a **real auth signal** in the body that should drive token refresh

## Reference

- `src/services/destination/destinationIntegration/delivery.ts` — verdicts, `DeliverySpec`, the bridge
- `src/v0/destinations/customerio/v2/delivery.ts` — 207 multi-status, positional index
- `src/v0/destinations/braze_audience/delivery.ts` — partial failure on a 2xx, positional index
- `src/v0/destinations/iterable_audience/delivery.ts` — failures keyed by identity, not index
- `src/v0/destinations/google_adwords_enhanced_conversions/delivery.ts` — partial failure + body-derived OAuth
- `docs/superpowers/specs/2026-07-30-network-handler-abstraction-design.md` — design, evidence, per-destination parity tables

## Declaring the delivery spec

Everything an integration says about delivery lives in **one object**, exported from its
`delivery.ts` and attached to the class as `static readonly delivery`. Grouping it is the point: a
`DestinationIntegration`'s other members are all about transforming an event, and a bare `statusOverrides`
or `failureReason` beside them reads as more of the same.

```typescript
// delivery.ts
import {
  abort, perItem, success, retry, throttled, authExpired, authRevoked,
  type DeliverySpec, type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

const myStatusOverrides: StatusOverrideMap = {
  207: (ctx) => perItem(items.map((item, i) => (failed(i) ? abort(reason) : success()))),
  '4xx': (ctx, fallback) => (isAuthBody(ctx.response) ? authRevoked('grant gone') : fallback()),
};

export const myDelivery: DeliverySpec = {
  statusOverrides: myStatusOverrides,
  // Optional: the reason on a failure verdict. Default is status-only and never reads the body.
  failureReason: (ctx) => extractMyErrorMessage(ctx.response),
};

// routerTransform.ts
class MyIntegration extends DestinationIntegration<TBody> {
  static readonly delivery = myDelivery;
}
```

- Both members are **optional**. A destination needing neither declares no `delivery` at all.
- Status keys are an **exact status** or a class (`'2xx'` / `'4xx'` / `'5xx'`); exact wins.
- The spec is **resolved down the prototype chain**: `statusOverrides` merges key-by-key (child
  winning) and `failureReason` takes the nearest declaration. Declaring a spec in a subclass
  therefore does not drop what a parent declared — static properties are shadowed, not merged, and
  that failure would otherwise be invisible.
- `fallback()` gives you the framework's own classification. Call it for the responses your override
  does not own, rather than re-deriving a verdict — the return type stays total, with no sentinel.
- Applying the spec is **framework-owned**: `handleDeliveryResponse(Class, ctx)` is a free function
  in `delivery.ts`, so there is nothing to override and no `super` to call.

`DeliveryContext` carries `status`, `response` (parsed body), `jobs` (one `ProxyMetdata` per job, in order), `request` (what was sent) and `destinationConfig`.

## Error messages belong to the integration

`failureReason`'s default is status-only — `[Generic Response Handler] Request failed with status: <n>` — and **never inspects the response body**. That mirrors `genericNetworkHandler`, the fallback every unmigrated destination already gets, which likewise leaves the body to travel in `destinationResponse`.

Do not add body-parsing to the framework. There is no shared convention to generalise: on the legacy path every destination extracts its message itself, against the shape its own API returns (`buildErrorMessage` joining `reason`/`field`/`message` for customerio, `error.message` for gaec, `params ?? msg ?? message` for iterable_audience). A generic "look for `message`, then `msg`, then `error`" helper looks like it unifies them but does not — it just imposes one destination's field order on every other, and any quirk added for one leaks into all of them.

So: if your destination's errors are worth reading, write the extractor in your own `delivery.ts` and point `delivery.failureReason` at it. Return the string **bare** — the per-job `error` is what live events display and what error reporting groups on, so `Invalid API key` beats `"Invalid API key"`.

## Verdicts

| Builder | Meaning | Result |
| --- | --- | --- |
| `success()` | delivered | per-job `200` |
| `abort(reason)` | permanent failure | per-job `400` |
| `retry(reason, { dontBatch })` | transient failure; with `dontBatch`, try a batch-shaped permanent failure once alone first | per-job `500`, or per-job `400` when isolation is impossible |
| `throttled(reason)` | rate limited | per-job `429` |
| `authExpired(reason)` | token stale but recoverable | `REFRESH_TOKEN` → refresh + retry |
| `authRevoked(reason)` | grant gone | `AUTH_STATUS_INACTIVE` → abort |
| `perItem([...])` | one verdict per request-body item | per-job, positionally |

`ItemVerdict` (what `perItem` accepts) deliberately excludes the two auth refinements: rudder-server overwrites the status code of *every* job in a batch when an `authErrorCategory` is present, so a per-item auth verdict cannot be represented.

### `dontBatch` softens an abort; it never hardens a retry

Use `retry(reason, { dontBatch: true })` only for a permanent whole-batch rejection where one bad event may be poisoning the batch. The flag means: return a retryable job state now so rudder-server redelivers each event once alone; if the event is already alone, the framework rewrites the verdict to `abort(reason)`, emits a terminal per-job `400` with the reason unchanged, and increments `batch_delivery_dont_batch_aborted`.

Do **not** pair `dontBatch` with transient/retryable statuses such as 5xx. On a single-event batch there is nothing to isolate, so `retry(reason, { dontBatch: true })` becomes an immediate abort with no retry. Transient destination failures must use plain `retry(reason)` (or `throttled(reason)` for 429) so normal retry semantics are preserved.

### `perItem` is positional and 1:1

**Index it off the posted request body (`ctx.request.body?.JSON`), not off the response.** The posted array is the one guaranteed to be the same length as the job list; a response array can be truncated or omitted entirely. A length mismatch makes the framework retry the whole batch rather than misattribute — correct, but a worse outcome than reading the body you sent.

`gaec` originally indexed off the response's `results` and hit exactly this: whenever Google omitted `results`, an abort became a batch retry that could never converge, since re-uploading accepted adjustments returns duplicate-enhancement failures on every attempt.

**`ctx.request.body?.JSON` only holds the batch on `BodyFormat.JSON`.** `mapSuccessPayloadToServerFormat` writes the batch to `body[strategy.bodyFormat]` and hard-sets the other three to `{}` (`processDestinationIntegration.ts`), so a destination on `JSON_ARRAY`, `FORM` or `XML` reading `body.JSON` gets nothing on every response — success included — and the mismatch guard answers each one with an N-job 500. Read the key your `getBatchStrategy` actually returns. All six spec'd destinations are on `JSON` today, which is why no test catches this for you.

**Decide what an unreadable posted array should mean before you write the loop.** `perItem([])` is a length mismatch, so the bridge retries the whole batch — and that retry reposts the same body and mismatches again, which never converges. `braze_audience` avoids it by falling back to `ctx.jobs`, which the framework builds 1:1 with the posted array. Taking the `fallback` parameter and returning a whole-batch verdict is the other option.

**A delivery spec and an array-returning `transformEvent` are mutually exclusive.** `ctx.jobs` carries one entry per job, so a job contributing two body items puts the two lengths permanently out of step and the batch retries forever. `destinationIntegration.ts` and the VDM V2 dispatch table both permit `transformEvent` to return an array; a destination that does must not call `perItem`.

### Never infer auth from a status code

A 401 from an API-key destination is a bad key, not a refreshable token, and guessing costs a real control-plane token refresh. Derive the category from the **response body** — `gaec` does, via `getAuthErrCategory` — or leave it alone. `getAuthErrCategoryFromStCode`'s unconditional 401→`REFRESH_TOKEN` is the anti-pattern this replaces.

## What the framework derives

Don't set these yourself:

- **per-job `statusCode`** — from the verdict kind
- **top-level `status`** — `ctx.status`, passed through
- **`message`** — the shared failure reason when every failure agrees on one, otherwise a count
- **`statTags`** — the whole tag set, when every job failed the same way
- **`authErrorCategory`** — from the auth refinements only

## Transport stays in `networkHandler.ts`

Only *response handling* moves. A destination that **already has** a handler building its HTTP request at delivery time (SDK call, URL derived from `params`, custom `processAxiosResponse`) keeps `proxy` / `prepareProxy` / `processAxiosResponse` there — `deliver()` in `src/services/destination/nativeIntegration.ts` resolves the network handler and calls `proxy()` / `processAxiosResponse()` *before* it consults `isDestinationIntegrationEnabled`, and `DestinationIntegration` exposes no transport hook to move that into.

This whole section is about **migrations**. For a destination being built new, see "A new destination gets no `networkHandler.ts`" below — the answer there is always no.

### Keeping the legacy handler

**Keep the legacy `networkHandler.ts` until nothing routes to it.** `batching: true` is not the
cutoff on its own; two things still send traffic through it:

- **Pre-GA workspaces.** A workspace not named in
  `{DEST}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` transforms through `processRouterDest` *and*
  is delivered by that handler — the two move together, so this is one condition, not two.
- **v0 proxy requests.** `deliver()` reaches the framework branch only via `isProxyV1Request`,
  which requires the v1 route *and* an array `metadata`. A v0 request stays on the handler even
  for a batching-GA destination, because the framework answers with a `DeliveryV1Response` that
  a v0 caller cannot parse.

`customerio`, `braze_audience`, `iterable_audience`, `google_adwords_enhanced_conversions` and
`reddit_audience` are all batching-GA today and still carry both a `delivery.ts` and a
`src/v1/destinations/<dest>/networkHandler.ts` (gaec keeps a v0 one too) — now for the **second**
reason only. The handler is deletable once v0 proxy traffic is confirmed dead for the destination.

### A new destination gets no `networkHandler.ts`

**Do not write one.** A destination built new on the framework has no legacy transform and no
unenrolled workspaces, so nothing above applies to it. Build it framework-native:

- **No `networkHandler.ts`, for transport or for response handling.** `posthog` and
  `custom_audience` have neither a `networkHandler.ts` nor a `delivery.ts` — they take the
  framework default, which reproduces `genericNetworkHandler`. That is the shape to copy.
- **Add a `delivery.ts` only to override the default verdicts** (see the verdict builders above).
- Mark it `batching: true` in `src/features.ts` from the start — a new destination is GA on day
  one, so the `{DEST}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` rollout flag is for migrations and
  is not needed. That single entry turns on transform *and* delivery; there is nothing else to set.

**If it looks like you need one, that is a framework gap — raise it, don't fork around it.** Two
cases come up, and neither is a licence to hand-write a handler:

- **Transport the framework cannot express** — an SDK call, a URL derived from `params`. Framework
  delivery replaces response *interpretation* only, and `deliver()` runs transport before it
  consults the predicate at all, so a handler written here would sit on the delivery path forever.
- **OAuth on the v0 proxy path.** A v0 request bypasses `delivery.ts`, and `genericNetworkHandler`
  throws a bare `NetworkError` with no `authErrorCategory`, so a 401 there aborts the batch without
  requesting a token refresh. This is a **known gap in the framework**, not a reason to grow a
  second copy of response handling — writing a handler re-forks classification across two files,
  which is the exact thing this framework exists to remove.

`reddit_audience` does ship `src/v1/destinations/reddit_audience/networkHandler.ts` despite being
new and `batching: true` from the start. It predates this guidance and is **not a template** — if
you are citing it to justify a handler on a new destination, raise the gap instead.

## Enabling it

Delivery has **no flag of its own**. It is gated on `isDestinationIntegrationEnabled(destType, workspaceId)` — the same predicate as the router transform:

- **GA:** the destination is marked `batching: true` in `features.ts` (surfaced as `destinationIntegrationsMap`), which enables both halves everywhere.
- **Pre-GA:** the workspace is named in `{DEST_NAME_UPPER}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` (comma-separated workspace IDs or `ALL`).

One predicate for both halves is deliberate. The delivery path interprets a payload built by the matching transform path; an unenrolled workspace's events are still built by `processRouterDest`, and pairing those with framework response handling would misread them. Deciding both from one call makes that mismatch unrepresentable. See `.claude/skills/batching-framework/SKILL.md#one-gate-both-halves` for the predicate and the v0-proxy carve-out.

Nothing extra is needed in your `dataDelivery` component tests or `live.ts` specs for a destination
already marked batching-GA in `features.ts`; a pre-GA destination needs the transform flag set via
`envOverrides`, or CI keeps exercising the legacy handler. If you are reading an older spec that
still sets `{DEST}_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS`, that flag no longer exists —
delete the override rather than porting it.

## Testing

Drive **both** paths over the same responses and compare, rather than asserting the new one in isolation — that is what makes it a parity test:

```typescript
const viaFramework = (ctx) =>
  toDeliveryV1Response(handleDeliveryResponse(Integration, ctx), ctx, DEST);
const viaLegacy = (ctx) => legacyResponseHandler({ ... });
// compare per-job statusCodes and errors for each response shape
```

**Reference:** `src/v0/destinations/braze_audience/delivery.test.ts` — also compares `stats.increment` call lists, so counters are held to parity too.
