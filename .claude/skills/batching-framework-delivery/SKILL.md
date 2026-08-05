---
name: batching-framework-delivery
description: Delivery (response handling) for batching-framework destinations. Declare statusOverrides on the BatchDestination class instead of writing a networkHandler responseHandler — the framework derives status codes, statTags and the response shape.
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

- `src/services/destination/nativeBatching/delivery.ts` — verdicts, `StatusOverrideMap`, the bridge
- `src/v0/destinations/customerio/v2/delivery.ts` — 207 multi-status, positional index
- `src/v0/destinations/braze_audience/delivery.ts` — partial failure on a 2xx, positional index
- `src/v0/destinations/iterable_audience/delivery.ts` — failures keyed by identity, not index
- `src/v0/destinations/google_adwords_enhanced_conversions/delivery.ts` — partial failure + body-derived OAuth
- `docs/superpowers/specs/2026-07-30-network-handler-abstraction-design.md` — design, evidence, per-destination parity tables

## Declaring `statusOverrides`

```typescript
// delivery.ts
import {
  abort, perItem, success, retry, throttled, authExpired, authRevoked,
  type StatusOverrideMap,
} from '../../../services/destination/nativeBatching/batchDestination';

export const myStatusOverrides: StatusOverrideMap = {
  207: (ctx) => perItem(items.map((item, i) => (failed(i) ? abort(reason) : success()))),
  '4xx': (ctx, fallback) => (isAuthBody(ctx.response) ? authRevoked('grant gone') : fallback()),
};

// routerTransform.ts
class MyIntegration extends BatchDestination<TBody> {
  static readonly statusOverrides = myStatusOverrides;

  // Optional: the reason on a failure verdict. Default is status-only and never reads the body.
  static failureReason(ctx: DeliveryContext): string { ... }
}
```

- Keys are an **exact status** or a class (`'2xx'` / `'4xx'` / `'5xx'`); exact wins.
- The map is **merged down the prototype chain**, so declaring one in a subclass does not drop a parent's entries (static properties are shadowed, not merged — that failure would be invisible).
- `fallback()` gives you the framework's own classification. Call it for the responses your override does not own, rather than re-deriving a verdict — the return type stays total, with no sentinel.
- `handleResponse` is **framework-owned**. Never override it or call `super`.

`DeliveryContext` carries `status`, `response` (parsed body), `jobs` (one `ProxyMetdata` per job, in order), `request` (what was sent) and `destinationConfig`.

## Error messages belong to the integration

`failureReason`'s default is status-only — `[Generic Response Handler] Request failed with status: <n>` — and **never inspects the response body**. That mirrors `genericNetworkHandler`, the fallback every unmigrated destination already gets, which likewise leaves the body to travel in `destinationResponse`.

Do not add body-parsing to the framework. There is no shared convention to generalise: on the legacy path every destination extracts its message itself, against the shape its own API returns (`buildErrorMessage` joining `reason`/`field`/`message` for customerio, `error.message` for gaec, `params ?? msg ?? message` for iterable_audience). A generic "look for `message`, then `msg`, then `error`" helper looks like it unifies them but does not — it just imposes one destination's field order on every other, and any quirk added for one leaks into all of them.

So: if your destination's errors are worth reading, write the extractor in your own `delivery.ts` and point `failureReason` at it. Return the string **bare** — the per-job `error` is what live events display and what error reporting groups on, so `Invalid API key` beats `"Invalid API key"`.

## Verdicts

| Builder | Meaning | Result |
| --- | --- | --- |
| `success()` | delivered | per-job `200` |
| `abort(reason)` | permanent failure | per-job `400` |
| `retry(reason, { dontBatch })` | transient failure | per-job `500` |
| `throttled(reason)` | rate limited | per-job `429` |
| `authExpired(reason)` | token stale but recoverable | `REFRESH_TOKEN` → refresh + retry |
| `authRevoked(reason)` | grant gone | `AUTH_STATUS_INACTIVE` → abort |
| `perItem([...])` | one verdict per request-body item | per-job, positionally |

`ItemVerdict` (what `perItem` accepts) deliberately excludes the two auth refinements: rudder-server overwrites the status code of *every* job in a batch when an `authErrorCategory` is present, so a per-item auth verdict cannot be represented.

### `perItem` is positional and 1:1

**Index it off the posted request body (`ctx.request.body?.JSON`), not off the response.** The posted array is the one guaranteed to be the same length as the job list; a response array can be truncated or omitted entirely. A length mismatch makes the framework retry the whole batch rather than misattribute — correct, but a worse outcome than reading the body you sent.

`gaec` originally indexed off the response's `results` and hit exactly this: whenever Google omitted `results`, an abort became a batch retry that could never converge, since re-uploading accepted adjustments returns duplicate-enhancement failures on every attempt.

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

Only *response handling* moves. A destination that builds its HTTP request at delivery time (SDK call, URL derived from `params`, custom `processAxiosResponse`) keeps `proxy` / `prepareProxy` / `processAxiosResponse` in its handler.

**Keep the legacy `networkHandler.ts` until GA.** Workspaces not yet enrolled still transform through `processRouterDest` and are delivered by that handler; both are deleted together at GA.

## Enabling it

`{DEST_NAME_UPPER}_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS` — comma-separated workspace IDs or `ALL`. Two things to know:

- There is **no GA map** for it — being in `batchedDestinationsMap` does not enable framework delivery. It stays on the legacy handler everywhere until a workspace is named.
- It **requires the transform flag** for the same workspace and returns false without it. The delivery path interprets a payload built by the matching transform path; an unenrolled workspace's events are still built by `processRouterDest`, and pairing those with framework response handling would misread them.

Set both in your `dataDelivery` component tests via `envOverrides` (and in `live.ts` via the `envOverrides` field on `LiveSpec`), or CI keeps exercising the legacy handler.

## Testing

Drive **both** paths over the same responses and compare, rather than asserting the new one in isolation — that is what makes it a parity test:

```typescript
const viaFramework = (ctx) => toDeliveryV1Response(Integration.handleResponse(ctx), ctx, DEST);
const viaLegacy = (ctx) => legacyResponseHandler({ ... });
// compare per-job statusCodes and errors for each response shape
```

**Reference:** `src/v0/destinations/braze_audience/delivery.test.ts` — also compares `stats.increment` call lists, so counters are held to parity too.
