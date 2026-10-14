---
name: batching-framework-delivery
description: Delivery (response handling) for batching-framework destinations. Declare a static delivery spec on the DestinationIntegration class instead of writing a networkHandler responseHandler — the framework derives status codes, statTags and the response shape.
---

# Batching Framework — Delivery

Declare what should happen to the batch; the framework builds the delivery response.
Integrations never build a `DeliveryV1Response`, choose a status code, or throw. Transform half:
`.claude/skills/batching-framework/SKILL.md`.

## When you need this

**Most destinations need nothing.** The default reproduces `genericNetworkHandler`: 2xx success,
429 throttled, other retryable statuses retry, the rest abort. `posthog` and `custom_audience`
declare nothing. Add a `delivery.ts` only for:

- a **partial-failure body** — some records rejected inside a successful response;
- a **2xx that isn't a success** — the body or the specific status means "not accepted". The
  framework treats all 2xx as delivered, so read the partner's docs for each success-range
  status. Conversely, override only statuses the partner has been **shown** to return (live or a
  captured `network.ts` mock); a speculative `'2xx'` override aborting every undocumented success
  status discards deliveries that probably succeeded;
- **identity-keyed failures** — the response names which records failed instead of indexing them;
- a **real auth signal** in the body that should drive token refresh.

### Override only what differs

An override reproducing the default is dead code that looks deliberate and stops tracking the
default if it changes.

```typescript
// Good — only the status this API treats differently
const statusOverrides: StatusOverrideMap = { 207: (ctx) => perItem(verdictPerItem(ctx)) };

// Bad — restates 429/4xx/5xx defaults around the one that matters
const statusOverrides: StatusOverrideMap = {
  207: (ctx) => perItem(verdictPerItem(ctx)),
  429: () => throttled('rate limited'), '4xx': () => abort('client error'), '5xx': () => retry('server error'),
};
```

Not restatements: an exact key that *protects* a status from a broader class key
(`429: (ctx, fallback) => fallback()` beside `'4xx'`), and reason-only overrides — though
`failureReason` does that better, needs no status list, and is worth declaring alone whenever the
partner's error body says something a reader needs.

## Reference

- `src/services/destination/destinationIntegration/delivery.ts` — verdicts, `DeliverySpec`, the bridge
- `src/v0/destinations/customerio/v2/delivery.ts` — 207 multi-status, positional
- `src/v0/destinations/braze_audience/delivery.ts` — partial failure on a 2xx, positional
- `src/v0/destinations/iterable_audience/delivery.ts` — failures keyed by identity
- `src/v0/destinations/google_adwords_enhanced_conversions/delivery.ts` — partial failure + body-derived OAuth
- `src/v0/destinations/rokt/delivery.ts` — attributing unindexed errors via locators
- `docs/superpowers/specs/2026-07-30-network-handler-abstraction-design.md` — design and parity tables

## Declaring the delivery spec

One object exported from `delivery.ts`, attached as `static readonly delivery` — grouped so it
doesn't read as more transform surface.

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
  failureReason: (ctx) => extractMyErrorMessage(ctx.response), // optional; default never reads the body
};

// routerTransform.ts
class MyIntegration extends DestinationIntegration<TBody> {
  static readonly delivery = myDelivery;
}
```

- Both members optional; with neither, declare no `delivery`.
- Keys: exact status or class (`'2xx'`/`'4xx'`/`'5xx'`); exact wins.
- Resolved down the prototype chain: `statusOverrides` merges key-by-key (child wins),
  `failureReason` takes the nearest — so a subclass spec doesn't silently drop the parent's.
- `fallback()` returns the framework's own classification; call it for responses you don't own.
- `handleDeliveryResponse(Class, ctx)` is a framework-owned free function — nothing to override.

`DeliveryContext`: `status`, `response` (parsed body), `jobs` (one `ProxyMetdata` per job, in
order), `request` (what was sent), `destinationConfig`.

## Error messages belong to the integration

Default `failureReason` is `[Generic Response Handler] Request failed with status: <n>` and never
reads the body (like `genericNetworkHandler`; the body travels in `destinationResponse`).

**Don't add body parsing to the framework.** Each destination extracts its own shape
(customerio `buildErrorMessage` joins `reason`/`field`/`message`; gaec `error.message`;
iterable_audience `params ?? msg ?? message`). A generic "try `message`, `msg`, `error`" helper
imposes one destination's field order on all.

Write the extractor in your `delivery.ts`. Return it **bare** (`Invalid API key`, not
`"Invalid API key"`) — it's what Live Events shows and error reporting groups on. **Fold in the
whole envelope**: `code`, `param` and per-item `errors[]` make it actionable (`message` alone says
an event was stale, not which of 200).

### Handle only the response shapes the API actually returns

Branch only on shapes covered by `network.ts` mocks — extra fallbacks are untested, imply a
variable API, and turn a real shape change into a silent fallback. If a shape is real, mock it;
otherwise delete the branch.

- **An empty body is a shape.** Auth failures often have none; map the statuses this API sends
  empty to what they mean (`the API key was rejected; check the destination credentials`), with a
  plain fallback for the rest.
- **Variants within one envelope** — e.g. `{ error: { message, type, param, code, errors[] } }`
  on validation vs `param`/`code` null and no `errors[]` on auth — are two formatter paths; mock both.

## Verdicts

| Builder | Meaning | Result |
| --- | --- | --- |
| `success()` | delivered | per-job `200` |
| `abort(reason)` | permanent | per-job `400` |
| `retry(reason, { dontBatch })` | transient; with `dontBatch`, isolate a batch-shaped permanent failure first | per-job `500`, or `400` when isolation is impossible |
| `throttled(reason)` | rate limited | per-job `429` |
| `authExpired(reason)` | stale, recoverable token | `REFRESH_TOKEN` → refresh + retry |
| `authRevoked(reason)` | grant gone | `AUTH_STATUS_INACTIVE` → abort |
| `perItem([...])` | one verdict per request-body item | per-job, positional |

`ItemVerdict` excludes the auth refinements: rudder-server overwrites every job's status when an
`authErrorCategory` is present, so per-item auth is unrepresentable.

### `dontBatch` softens an abort; it never hardens a retry

Use `retry(reason, { dontBatch: true })` only for a **permanent whole-batch rejection** that one
bad event may cause. rudder-server redelivers each event alone; if it is already alone, the
framework rewrites to `abort(reason)` (terminal 400, reason unchanged) and increments
`batch_delivery_dont_batch_aborted`.

- **Never with transient statuses (5xx).** On a single-event batch it becomes an immediate abort.
  Use plain `retry(reason)` / `throttled(reason)`.
- **Don't guard on batch size yourself** (`destinationIntegration/delivery.ts:421` does it). A
  `ctx.jobs.length > 1` guard is worse than redundant: its single-job branch returns a plain
  `retry` where the framework would abort — an infinite retry.

```ts
// Good
statusOverrides: { 400: (ctx) => retry(responseToMessage(ctx.response), { dontBatch: true }) }
// Bad
400: (ctx) => ctx.jobs.length > 1 ? retry(msg, { dontBatch: true }) : retry(msg),
```

**A partial accept is not a whole-batch rejection.** If the partner keeps valid items and reports
the rest (usually inside a 2xx), a `dontBatch` retry re-sends accepted items — duplicates unless
the partner dedupes on an id you send. Confirm from docs or a live mixed batch. If valid items are
kept, return `perItem`: `success()` for accepted, `retry(…, { dontBatch: true })` or `abort(…)`
for rejected. For unindexed errors use any locator (array index in a field path, character offset
into the body) mapped against the posted body. Fall back to a whole-batch `dontBatch` retry only
for errors you can't attribute, as a known duplication cost. `rokt/delivery.ts` does both locator
forms.

### `perItem` is positional and 1:1

- **Index off the posted body (`ctx.request.body?.JSON`), not the response.** Only the posted array
  is guaranteed job-length; a length mismatch makes the framework retry the whole batch. gaec
  indexed off `results` and, when Google omitted it, an abort became a never-converging batch
  retry (re-uploads return duplicate-enhancement failures).
- **`body.JSON` holds the batch only on `BodyFormat.JSON`.** `mapSuccessPayloadToServerFormat`
  writes to `body[strategy.bodyFormat]` and sets the other three to `{}`
  (`processDestinationIntegration.ts`), so `JSON_ARRAY`/`FORM`/`XML` destinations reading `body.JSON`
  get an N-job 500 on every response. Read the key your strategy returns (no test catches this —
  all spec'd destinations are on `JSON`).
- **Decide what an unreadable posted array means.** `perItem([])` mismatches → batch retry → same
  mismatch forever. `braze_audience` falls back to `ctx.jobs` (1:1 with the posted array);
  returning a whole-batch verdict via `fallback` also works.
- **A delivery spec and an array-returning `transformEvent` are mutually exclusive** — a job with
  two body items puts lengths permanently out of step. Such destinations must not call `perItem`.

### Never infer auth from a status code

A 401 on an API-key destination is a bad key; guessing costs a real control-plane token refresh.
Derive the category from the **body** (gaec's `getAuthErrCategory`) or leave it.
`getAuthErrCategoryFromStCode`'s unconditional 401→`REFRESH_TOKEN` is the anti-pattern.

## What the framework derives

Don't set: per-job `statusCode` (from verdict), top-level `status` (`ctx.status`), `message`
(shared reason, else a count), `statTags` (when every job failed the same way),
`authErrorCategory` (auth refinements only).

## Enrolled v1 delivery uses the framework transport

This section is about **migrations** only. When `isDestinationIntegrationEnabled` is true and the
request is v1, transform, transport and response handling move together: `deliver()` resolves
the spec, runs the optional `prepareRequest`, sends via the shared `proxyRequest`, and converts
the result. So `transformEvent` must emit the real endpoint and an HTTP-ready request.

`prepareRequest` is only for delivery-time material that must not be persisted — a platform
secret the transform never sees (gaec's env-sourced `developer-token`). Not for:

- the destination's own credentials (`destination.Config` → `transformEvent`'s `headers`);
- re-validating endpoint/host/config already checked in `getInputSchema`/`transformEvent` (dead
  code that can fail where transform tests never look).

If the partner genuinely can't use the shared HTTP proxy, that is a framework gap — don't split
v1 ownership between class and handler. Test both boundaries: v1 proves the framework prepares,
sends and interprets; v0 proves the legacy handler is still selected.

### Keeping the legacy handler

Keep `networkHandler.ts` until nothing routes to it — `batching: true` alone is not the cutoff:

- **Pre-GA workspaces** (not in `{DEST}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS`) transform via
  `processRouterDest` *and* deliver via the handler — one condition.
- **v0 proxy requests.** The framework branch requires `isProxyV1Request` (v1 route *and* array
  `metadata`); v0 callers can't parse a `DeliveryV1Response`.

While the handler survives, audit it for single-item assumptions if it can receive batches, and
don't make the framework request depend on handler-only URL construction or SDK transport.
`customerio`, `braze_audience`, `iterable_audience`, `reddit_audience` are batching-GA and keep a
`src/v1/destinations/<dest>/networkHandler.ts` for v0 traffic only; GAEC's were deleted. A
retained handler is deletable once v0 proxy traffic is confirmed dead.

### A new destination gets no `networkHandler.ts`

**Do not write one** — no legacy transform, no unenrolled workspaces:

- No handler for transport or response handling; `posthog`/`custom_audience` (no handler, no
  `delivery.ts`) are the shape to copy.
- `delivery.ts` only to override default verdicts.
- `batching: true` in `features.ts` from the start turns on transform *and* delivery; no rollout flag.

**If it looks like you need one, it's a framework gap — raise it:**

- **Transport the framework can't express** (e.g. SDK-only). Event-derived URLs belong in
  `transformEvent`, delivery-only headers in `prepareRequest`.
- **OAuth on the v0 proxy path.** v0 bypasses `delivery.ts`, and `genericNetworkHandler` throws a
  bare `NetworkError` with no `authErrorCategory`, so a 401 aborts without refresh. Known gap;
  a handler would re-fork classification across two files.

`reddit_audience`'s handler predates this guidance — **not a template**.

## Enabling it

No delivery flag: gated on `isDestinationIntegrationEnabled`, same as the transform
(`batching-framework#one-gate-both-halves`). An unenrolled workspace's payloads come from
`processRouterDest`, so pairing them with framework response handling would misread them.

`dataDelivery` component tests and `live.ts` need nothing extra for a batching-GA destination; a
pre-GA one needs the transform flag in `envOverrides` or CI exercises the legacy handler.
`{DEST}_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS` no longer exists — delete such
overrides rather than porting them.

## Testing

Parity, not isolation — drive both paths over the same responses:

```typescript
const viaFramework = (ctx) => toDeliveryV1Response(handleDeliveryResponse(Integration, ctx), ctx, DEST);
const viaLegacy = (ctx) => legacyResponseHandler({ ... });
// compare per-job statusCodes and errors per response shape
```

Reference: `src/v0/destinations/braze_audience/delivery.test.ts` (also compares
`stats.increment` calls).
