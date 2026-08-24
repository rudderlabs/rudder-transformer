---
name: batching-framework-delivery
description: Delivery (response handling) for batching-framework destinations. Declare a static delivery spec on the BatchDestination class instead of writing a networkHandler responseHandler — the framework derives status codes, statTags and the response shape.
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

- `src/services/destination/nativeBatching/delivery.ts` — verdicts, `DeliverySpec`, the bridge
- `src/v0/destinations/customerio/v2/delivery.ts` — 207 multi-status, positional index
- `src/v0/destinations/braze_audience/delivery.ts` — partial failure on a 2xx, positional index
- `src/v0/destinations/iterable_audience/delivery.ts` — failures keyed by identity, not index
- `src/v0/destinations/google_adwords_enhanced_conversions/delivery.ts` — partial failure + body-derived OAuth
- `docs/superpowers/specs/2026-07-30-network-handler-abstraction-design.md` — design, evidence, per-destination parity tables

## Declaring the delivery spec

Everything an integration says about delivery lives in **one object**, exported from its
`delivery.ts` and attached to the class as `static readonly delivery`. Grouping it is the point: a
`BatchDestination`'s other members are all about transforming an event, and a bare `statusOverrides`
or `failureReason` beside them reads as more of the same.

```typescript
// delivery.ts
import {
  abort, perItem, success, retry, throttled, authExpired, authRevoked,
  type DeliverySpec, type StatusOverrideMap,
} from '../../../services/destination/nativeBatching/batchDestination';

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
class MyIntegration extends BatchDestination<TBody> {
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
| `retry(reason, { dontBatch })` | transient failure | per-job `500` |
| `throttled(reason)` | rate limited | per-job `429` |
| `authExpired(reason)` | token stale but recoverable | `REFRESH_TOKEN` → refresh + retry |
| `authRevoked(reason)` | grant gone | `AUTH_STATUS_INACTIVE` → abort |
| `perItem([...])` | one verdict per request-body item | per-job, positionally |

`ItemVerdict` (what `perItem` accepts) deliberately excludes the two auth refinements: rudder-server overwrites the status code of *every* job in a batch when an `authErrorCategory` is present, so a per-item auth verdict cannot be represented.

### `perItem` is positional and 1:1

**Index it off the posted request body (`ctx.request.body?.JSON`), not off the response.** The posted array is the one guaranteed to be the same length as the job list; a response array can be truncated or omitted entirely. A length mismatch makes the framework retry the whole batch rather than misattribute — correct, but a worse outcome than reading the body you sent.

`gaec` originally indexed off the response's `results` and hit exactly this: whenever Google omitted `results`, an abort became a batch retry that could never converge, since re-uploading accepted adjustments returns duplicate-enhancement failures on every attempt.

**`ctx.request.body?.JSON` only holds the batch on `BodyFormat.JSON`.** `mapSuccessPayloadToServerFormat` writes the batch to `body[strategy.bodyFormat]` and hard-sets the other three to `{}` (`processBatchedDestination.ts`), so a destination on `JSON_ARRAY`, `FORM` or `XML` reading `body.JSON` gets nothing on every response — success included — and the mismatch guard answers each one with an N-job 500. Read the key your `getBatchStrategy` actually returns. All six spec'd destinations are on `JSON` today, which is why no test catches this for you.

**Decide what an unreadable posted array should mean before you write the loop.** `perItem([])` is a length mismatch, so the bridge retries the whole batch — and that retry reposts the same body and mismatches again, which never converges. `braze_audience` avoids it by falling back to `ctx.jobs`, which the framework builds 1:1 with the posted array. Taking the `fallback` parameter and returning a whole-batch verdict is the other option.

**A delivery spec and an array-returning `transformEvent` are mutually exclusive.** `ctx.jobs` carries one entry per job, so a job contributing two body items puts the two lengths permanently out of step and the batch retries forever. `batchDestination.ts` and the VDM V2 dispatch table both permit `transformEvent` to return an array; a destination that does must not call `perItem`.

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
const viaFramework = (ctx) =>
  toDeliveryV1Response(handleDeliveryResponse(Integration, ctx), ctx, DEST);
const viaLegacy = (ctx) => legacyResponseHandler({ ... });
// compare per-job statusCodes and errors for each response shape
```

**Reference:** `src/v0/destinations/braze_audience/delivery.test.ts` — also compares `stats.increment` call lists, so counters are held to parity too.
