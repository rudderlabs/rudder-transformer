# Design: fold NetworkHandler into the BatchDestination class

Date: 2026-07-30
Status: ready to plan
Scope: framework + migrate every batching-framework destination that has its own network handler —
`customerio`, `iterable_audience`, `google_adwords_enhanced_conversions`, `braze_audience`,
`test_destination` (§4.0)

---

## 1. Problem

Two concrete problems with the current `NetworkHandler` abstraction.

### 1.1 Delivery lives in a different file, directory, and registry than the transform

For a batching destination the transform and the delivery logic are maximally far apart. Take `iterable_audience`:

|             | transform                                                                   | delivery                                                                                  |
| ----------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| file        | `src/v0/destinations/iterable_audience/routerTransform.ts`                  | `src/v1/destinations/iterable_audience/networkHandler.ts` → `strategies/audience-list.ts` |
| version dir | `v0`                                                                        | `v1`                                                                                      |
| registry    | `MiscService.getBatchDestinationHandler` (`src/services/misc.ts:30`)        | `networkHandlerFactory.getNetworkHandler` (`src/adapters/networkHandlerFactory.js:39`)    |
| typing      | `BatchDestination<IterableAudiencePayload, …>` (`routerTransform.ts:29-32`) | body shape re-derived as `IterableSubscriber[]` (`audience-list.ts:68`)                   |

The `networkHandler.ts` file is 18 lines of pure indirection — it assigns the four transport defaults and delegates `responseHandler` to `AudienceListStrategy`. So the delivery logic is three files away from the transform, and it imports its input types from a _different destination_ (`../../iterable/types`, `audience-list.ts:3`).

The type disconnect is real, not hypothetical. The transform class is generic over `IterableAudiencePayload`, but the handler reaches back into the serialised request and re-declares the shape:

```ts
const subscribers: IterableSubscriber[] = requestBody?.subscribers ?? []; // audience-list.ts:68
```

Nothing links `IterableSubscriber` to `IterableAudiencePayload`, so changing the payload shape produces no type error in the handler.

### 1.2 The return contract is API-shaped, not intent-shaped

To write a `responseHandler` today an implementer must know all of:

- whether to **throw** or **return** (throw = whole-batch failure, return = per-job outcomes) — nothing in the signature says this
- that raw HTTP status codes double as **retry semantics** (`500` retry vs `400` drop vs `429` throttle)
- how to build `statTags` with the right `ERROR_TYPE`
- when to set `authErrorCategory`, and to which of two magic strings
- to echo `destinationResponse` back so the platform can log it
- whether the destination is wired as v0 or v1, because the response shape differs
- how to correlate the destination's per-item errors back to `rudderJobMetadata`

Only the last item is genuinely destination-specific. Everything else is platform mechanics that every handler re-derives, and gets subtly wrong in different ways (§2).

---

## 2. Survey: how the 31 existing handlers correlate jobs to outcomes

This drove the design, so it is recorded here.

**Pattern A — all-jobs-same (large majority).** One whole-batch verdict fanned across every job: `am`, `clicksend`, `emarsys`, `hs`, `linkedin_ads`, `reddit`, `bloomreach`, `bloomreach_catalog`, `algolia`, `campaign_manager`, `monday`, `zoho`, `postscript`, `marketo_static_list`. Also every _error_ path, including `iterable_audience`'s (`audience-list.ts:127-131`).

**Pattern B — positional, destination returns explicit indices.** `customerio` (`batch_index`, `src/v1/destinations/customerio/networkHandler.ts:41`). Assumes 1:1 job↔item.

**Pattern C — positional against a parallel results array.** `google_adwords_offline_conversions` walks `results?.[i]` against `metaDataArray.map((metadata, i) => …)` (`networkHandler.js:349-350`); `google_adwords_enhanced_conversions` does the same on a **2xx** response carrying `partialFailureError`, treating an empty `results[i]` as a failed event (`src/v1/destinations/google_adwords_enhanced_conversions/networkHandler.ts:67-80`). `mp` does the same but **defensively**: `const event = index < events.length ? events[index] : null` (`src/v1/destinations/mp/utils.ts:229-230`).

**Pattern D — content-keyed, no indices exist.** `iterable` and `iterable_audience`. The API returns failing _identities_ (`invalidEmails`, `invalidUserIds`, `disallowedEventNames`, `forgottenEmails`, `notFoundUserIds`), so `createBatchErrorChecker` (`src/v1/destinations/iterable/utils.ts:32-77`) builds identity→failure maps and tests each **request body item**. Both loops are driven from the body, then attributed to jobs positionally:

```ts
const response = subscribers.map((subscriber, idx) => {
  const metadata = rudderJobMetadata[idx];        // audience-list.ts:80-81
```

— which yields a job state with `metadata: undefined` if body items outnumber jobs. `iterable`'s `strategies/track-identify.ts:15-34` has the identical shape.

**Pattern E — `destInfo` side channel.** Two unrelated uses of the same field:

- `braze` stamps per-job item-index maps at transform time (`src/v0/destinations/braze/util.ts:1196`, `buildDestInfoByJob`) and reads them back in delivery (`readIndicesFor`, `src/v1/destinations/braze/networkHandler.ts:79-85`). The only destination that genuinely multiplexes and solved it properly — at the cost of ~80 hand-rolled lines.
- `salesforce` (`src/v0/destinations/salesforce/networkHandler.js:13`) and `marketo` (`src/v0/destinations/marketo/util.js:218-220`) stamp an `authKey` so the handler can **evict a stale token cache** on invalid/expired-token errors.

### 2.1 What rudder-server does with `authErrorCategory`

Traced on `rudder-server@origin/master`. This is what shapes the verdict vocabulary in §3.1.

The OAuth transport bypasses itself entirely for non-OAuth destinations — `if (!isOauthDestination) { return t.Transport.RoundTrip(req) }` (`services/oauth/v2/http/transport.go:255-257`). So **`authErrorCategory` is inert for API-key destinations, customerio included.** Both values are read in `postRoundTrip` (`transport.go:158`) and dispatched by a two-case switch (`:175`):

| category               | rudder-server behaviour                                                                                                                                                                                             | net effect                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `REFRESH_TOKEN`        | calls `oauthHandler.RefreshToken` against the control plane (circuit-breakered, `oauth_breaker.go:82`); on success forces the status to **500** (`transport.go:204`, _"so we return a 500 to the caller to retry"_) | `jobsdb.Failed` → **retried**  |
| `AUTH_STATUS_INACTIVE` | sets the status to **400** (`transport.go:205-206`). That is the whole branch — no control-plane call                                                                                                               | `jobsdb.Aborted` → **dropped** |

`isJobTerminated` (`router/misc.go:23-28`) makes 400 terminal and 500 retryable; the branch is taken at `router/worker.go:1045-1046`. Note it also exempts 429 and 408, which is what makes the `throttled`→429 mapping in §3.7 retry correctly.

Two findings worth recording:

- **`AUTH_STATUS_INACTIVE` no longer disables the destination.** Commit `45e5dba66` (_"chore: remove oauth status toggling (#6492)"_) deleted the `AuthStatusToggle` control-plane call — 99 lines out of `oauth_handler.go`; the `OAuthHandler` interface now exposes only `FetchToken` and `RefreshToken`. The doc comment at `transport.go:48` still claims the transport updates authStatus to `inactive`, and `oauth_stats.go:19,25,28` still reference an `auth_status_inactive` action; both are stale. So the only signal a re-auth is needed is the aborted jobs' reason string.
- **An auth category overwrites every job's status code.** `router/transformer/transformer.go:621-633` loops over all metadata and assigns the single `InterceptorResponse.StatusCode` to each job:

  ```go
  for _, metadata := range proxyReqParams.ResponseData.Metadata {
      if transportResponse.InterceptorResponse.StatusCode > 0 {
          transResp.routerJobResponseCodes[metadata.JobID] = transportResponse.InterceptorResponse.StatusCode
      }
  ```

  The top-level code is overwritten too (`transformer.go:555-556`), and a second site does the same over `destinationJobs[i]` (`:332-336`). So per-job codes computed by the transformer are discarded whenever an `authErrorCategory` is present — which is why §3.2 forbids auth refinements inside `perItem`, and why the `authExpired`/`authRevoked` rows are absent from §3.7's per-job status table.

### Three conclusions that shape the contract

1. **`dontBatch` is not a one-off.** `algolia`, `hs`, `reddit`, and `am` all set `metadata.dontBatch = true` on a returned job state to force an unbatched retry. It belongs in the vocabulary.
2. **`handleResponse` cannot be pure.** Marketo's cache eviction, and `iterable_audience` emitting a GDPR metric mid-loop (`stats.counter('iterable_forgotten_user_violations', …)`, `audience-list.ts:90-96`), are real side effects inside today's response handlers. The contract must permit them rather than imply purity and have implementers fight it.
3. **The 1:1 assumption is pervasive and already strained.** `mp` guards against it, `iterable` and `iterable_audience` both carry a live `undefined`-metadata bug from it, `braze` outgrew it. Only Pattern D cannot be expressed positionally.

---

## 3. Design

### 3.1 Vocabulary: `Verdict`

New file `src/services/destination/nativeBatching/delivery.ts`.

There are exactly **three** outcomes the platform can act on — retry the job, drop it, or accept it. Throttling and auth failures are not peers of those; they are _refinements_ of them. So the type has three kinds, and everything else is a modifier:

```ts
export type Verdict =
  | { kind: 'success' }
  | { kind: 'abort'; reason: string; auth?: 'revoked' }
  | { kind: 'retry'; reason: string; as?: 'throttled' | 'authExpired'; dontBatch?: boolean };
```

This matches what rudder-server does (§2.1). `REFRESH_TOKEN` ends as a **500 → retry**; `AUTH_STATUS_INACTIVE` ends as a **400 → abort**. Separate top-level kinds would invent a distinction the platform does not have, and leave the implementer to guess which ones retry.

Six builders construct them, so the vocabulary an implementer writes stays familiar:

```ts
export const success = (): Verdict;
export const abort = (reason: string): Verdict;
export const retry = (reason: string, opts?: { dontBatch?: boolean }): Verdict;
export const throttled = (reason: string): Verdict; // retry, as: 'throttled'
export const authExpired = (reason: string): Verdict; // retry, as: 'authExpired'  -> REFRESH_TOKEN
export const authRevoked = (reason: string): Verdict; // abort, auth: 'revoked'    -> AUTH_STATUS_INACTIVE
```

Because the two auth refinements sit on different kinds, the type enforces the semantics: you cannot write an `authExpired` that aborts, or an `authRevoked` that retries.

#### Overrides are a status-keyed map

Integrations do not override `handleResponse`; it is framework-owned. What an integration declares is a map from status code to the behaviour for that status:

```ts
export type StatusOverride = (
  ctx: DeliveryContext,
  fallback: () => Verdict,
) => HandleResponseResult;

/** An exact status, or a whole class of them. */
export type StatusKey = number | '2xx' | '4xx' | '5xx';

abstract class BatchDestination<TBody, TInputSchema> {
  /** Per-status overrides, consulted before the framework's own classification. */
  static readonly statusOverrides: Readonly<Partial<Record<StatusKey, StatusOverride>>> = {};
}
```

The framework prefers an exact-status entry, falls back to the class entry, and otherwise classifies the status itself:

```ts
static handleResponse(ctx: DeliveryContext): HandleResponseResult {
  const fallback = () => this.defaultVerdict(ctx);
  const override =
    this.statusOverrides[ctx.status] ?? this.statusOverrides[statusClassOf(ctx.status)];
  return override ? override(ctx, fallback) : fallback();
}

/** Framework-internal classification. Not an extension point. */
private static defaultVerdict(ctx: DeliveryContext): Verdict {
  if (isHttpStatusSuccess(ctx.status)) return success();
  const reason = this.extractErrorMessage(ctx.response);
  if (ctx.status === 429) return throttled(reason);
  if (isHttpStatusRetryable(ctx.status)) return retry(reason);
  return abort(reason);
}
```

**Why `fallback` is a parameter.** A handler usually owns only _some_ of the responses carrying its status. Mixpanel's `400` handler applies to the `/import` endpoint but not to `/engage`, and cannot decode every body it is handed (§4). Those branches still have to produce a verdict, and making the handler re-derive one would mean reimplementing `defaultVerdict` at every call site. Passing it in keeps the return type total — `HandleResponseResult`, never optional — so there is no sentinel whose meaning has to be learned and no branch that can fall off the end. It is not inheritance either: nothing to name, no prototype chain, no way to delegate to the wrong place.

`defaultVerdict` reproduces today's behaviour, mirroring `getDynamicErrorType` (`src/adapters/utils/networkUtils.js:87-95`). `isHttpStatusRetryable` is `status >= 500 && status < 600` (`src/v0/util/index.js:1638-1640`), so **422 aborts by default**. A destination whose API returns 422 for transient backpressure reclassifies it:

```ts
static readonly statusOverrides = {
  422: (ctx) => retry(MyIntegration.extractErrorMessage(ctx.response)),
} as const;
```

**The framework never infers an auth verdict from a status code.** 401 and 403 classify as plain `abort`; `authExpired` / `authRevoked` come only from the integration, in most cases after parsing the error body, because that is the only place the information exists.

This departs from `getAuthErrCategoryFromStCode` (`src/v0/util/index.js:2175-2185`), which maps 401→`REFRESH_TOKEN` and 403→`AUTH_STATUS_INACTIVE` unconditionally. That mapping is wrong more often than right: a 401 from an API-key destination means a bad key, not a refreshable OAuth token, and a 403 is as likely to be a missing scope or a suspended account as a revoked grant. Guessing is not cosmetic — per §2.1, `REFRESH_TOKEN` makes rudder-server burn a control-plane token refresh and retry, `AUTH_STATUS_INACTIVE` aborts the batch. Neither should follow from a status code alone. An OAuth destination states it explicitly instead:

```ts
static readonly statusOverrides = {
  401: (ctx, fallback) => {
    const msg = MyIntegration.extractErrorMessage(ctx.response);
    return /token (expired|invalid)/i.test(msg) ? authExpired(msg) : fallback();
  },
} as const;
```

**Why class keys exist.** Existing handlers overwhelmingly branch on `isHttpStatusSuccess(status)` rather than on a specific code — `iterable_audience` reaches its per-subscriber logic through `BaseStrategy.handleResponse`, which dispatches on `!isHttpStatusSuccess(status)` (`src/v1/destinations/iterable/strategies/base.ts:10`); `gaec` inspects `partialFailureError` on any 2xx (`src/v1/destinations/google_adwords_enhanced_conversions/networkHandler.ts:46`). Both return only `200` in practice, so an exact `200` key would pass today's tests while silently narrowing the contract the code was written to. `'2xx'` states the real intent. Exact keys stay available for the case that genuinely is one status — customerio's `207` (§4.1) — and take precedence over the class key. `'4xx'` / `'5xx'` also cover range policy such as "every 4xx is retryable for this destination".

**The framework merges the map down the prototype chain.** Static properties are inherited, and lookup does walk the chain — but it resolves to a single object, the nearest one, and never merges keys across levels. So a subclass declaring `statusOverrides` would otherwise silently drop every entry an ancestor declared, with no type error and no runtime error. `resolveStatusOverrides` therefore collects each own-`statusOverrides` up the chain and merges child-over-parent, so a family-level map on `VDMV2ObjectDestination` keeps working when a concrete destination adds an entry of its own. The cost is that an inherited entry cannot be _removed_, only replaced — no destination in the migration set has reason to, and losing an entry silently is much worse than being unable to delete one.

#### Locating the error message: `extractErrorMessage`

A verdict class is not enough on its own — the useful text is inside the destination's response body, and every destination buries it somewhere different. Today handlers dig it out by hand: `response?.params ?? response?.msg ?? response?.message` (`iterable_audience/strategies/audience-list.ts:124`), or fall back to `JSON.stringify` of the whole body (`postTransformation.ts:212`).

Rather than have the classification path overridden purely to supply better wording, the extractor is its own overridable member:

```ts
/** Pull a human-readable error out of the destination's response body. */
static extractErrorMessage(response: unknown): string;
```

The framework calls it wherever it needs failure text — the top-level `message` and the per-job `error`. The default (§3.4) is `JSON.stringify(response)`, matching what `postTransformation.ts:212` produces today.

Splitting it out means a destination whose only special need is error-text extraction overrides **one three-line method** and declares no `statusOverrides` at all — the framework's own classification calls `this.extractErrorMessage`, so it picks the override up polymorphically:

The framework's `defaultVerdict` (§3.1) calls `this.extractErrorMessage`, so `this` resolves to the subclass and the override is picked up without the destination declaring anything else.

No HTTP codes, no `statTags`, no `authErrorCategory`, no `destinationResponse` echo, no throwing, no v0-vs-v1 branching. That is problem 1.2 addressed.

### 3.2 The list form is **per item**, not per job

The obvious choice is "one verdict per job", but the survey argues against it. Every destination API that reports partial failure indexes into **the request body it received** — `batch_index` for customerio, `results[i]` for gaoc, `events[index]` for mp, identities-of-body-items for iterable and iterable_audience. None of them index jobs. A per-job list would force each implementer to convert, which is exactly the correlation work that §2 shows being done four different ways and getting it wrong twice.

So the list form is one verdict per **request body item**, and mapping items→jobs is the framework's job:

```ts
export type PerItemVerdicts = { kind: 'perItem'; verdicts: Verdict[] };
export const perItem = (verdicts: Verdict[]): PerItemVerdicts;

export type HandleResponseResult = Verdict | PerItemVerdicts;
```

For a 1:1 destination items and jobs coincide, so `customerio` is unaffected by this choice. Naming it `perItem` rather than `perJob` keeps the implementer indexing the thing the API handed them, and leaves room for a real item→job map later (§3.5) without changing the implementer-facing contract.

**Mapping is positional and requires 1:1.** `verdicts[i]` applies to `jobs[i]`. Per §3.5 the framework carries no item→job map, so `perItem` is only correct for destinations where each job contributes exactly one body item.

**The framework bounds-checks it.** If `verdicts.length !== ctx.jobs.length`, the framework must **not** index past the end — that is precisely the bug live in `iterable` and `iterable_audience`, which emit job states with `metadata: undefined`. Instead it discards the per-item detail, **retries the whole batch**, and emits a stat so the mismatch is visible rather than silently producing malformed job states. Degraded but never malformed.

**Retry, not a fold of what is present.** The obvious rule — collapse to the most severe verdict present, on `retry > abort > success` — is wrong in the direction that costs data. A list of two successes against three jobs folds to `success`, so the job with no verdict at all is reported delivered on no evidence; an _empty_ list folds to `success` for every job, and an empty list is only ever produced by a handler that had already decided there were failures. A job whose verdict cannot be attributed has an unknown outcome, and the only honest reading of an unknown outcome is that it must be redelivered. Re-sending items that already succeeded is the accepted cost under the platform's at-least-once contract; reporting an event delivered when nothing said so is not recoverable.

**Auth refinements are whole-batch only, enforced by the type.** `perItem` accepts `ItemVerdict[]`, a narrowing of `Verdict` without the `auth` / `as: 'authExpired'` refinements, so `perItem([authExpired(msg)])` does not compile. Reason in §2.1: rudder-server overwrites the status code of **every job in the batch** with a single interceptor value whenever an `authErrorCategory` is present, so a per-item auth verdict is not expressible — one `authExpired` item among 49 successes would retry all 50 jobs.

### 3.3 Context: `DeliveryContext`

```ts
export type DeliveryContext = {
  /** HTTP status from the destination, after processAxiosResponse. */
  status: number;
  /** Parsed destination response body. */
  response: unknown;
  /** One entry per job in this batch, in the order the framework built them. */
  jobs: ProxyMetdata[];
  /** The request that was sent — for content-keyed correlation (Pattern D). */
  request: ProxyV1Request;
  destinationConfig: Record<string, unknown>;
};
```

`request` covers Pattern D; `jobs[i].destInfo` (already on `ProxyMetdata`, `src/types/destinationTransformation.ts:151-162`) covers Pattern E.

`status` and `response` **are** the processed proxy response, not a summary of it: `processAxiosResponse` returns exactly `{ response, status }` (`src/adapters/utils/networkUtils.js:134-165`, plus a `headers` key on the non-2xx axios branch that no response handler in the repo reads). Today's handlers all begin by destructuring it — `const { response, status } = destinationResponse` — so the context exposes the two fields directly and carries no separate `destinationResponse`. The bridge reassembles `{ status, response }` when it needs to hand `TransformerProxyError` its 4th argument (§3.7).

### 3.4 Placement: statics on the destination class

**They must be static.** `src/types/zodTypes.ts:125-167` shows the proxy request carries `destinationConfig` and `metadata` but **no `destination` object and no `connection`**. An instance therefore cannot be constructed on the delivery path — and for some destinations must not be. Both audience destinations hard-fail without a connection:

```ts
if (!this.connection) {
  throw new InstrumentationError('Connection config is required for iterable_audience');
}
```

(`src/v0/destinations/iterable_audience/routerTransform.ts:38-40`; `custom_audience/routerTransform.ts:48-50` is identical.) Any instance-method design would throw on every delivery for these destinations.

TypeScript has no `abstract static`, and statics cannot reference class type parameters, so these are conventions on the class rather than enforced abstract members.

#### `BatchDestination` provides a default

The legacy path already has a fallback handler — `src/adapters/networkhandler/genericNetworkHandler.js`, used whenever a destination has no handler of its own (`networkHandlerFactory.js:41`). The batching framework has the same property: a destination that needs no special delivery logic writes nothing.

The framework's `handleResponse` and `defaultVerdict` are given in §3.1. The only other default is the error-text extractor:

```ts
abstract class BatchDestination<TBody, TInputSchema> {
  static extractErrorMessage(response: unknown): string {
    return JSON.stringify(response);
  }
}
```

`defaultVerdict` mirrors `genericNetworkHandler`'s `responseHandler` one-for-one: success passes the status through, failure classifies by status. The only difference is that the generic handler throws `NetworkError` while the bridge (§3.7) throws `TransformerProxyError` — both reach the same `generateErrorObject` path in `postTransformation.ts`.

That leaves a destination exactly two things it can declare:

| declare               | when                                                                   | cost             |
| --------------------- | ---------------------------------------------------------------------- | ---------------- |
| `extractErrorMessage` | the error text is buried somewhere specific                            | a few lines      |
| `statusOverrides[s]`  | that status needs the response body read, or a different verdict class | a small function |

Only `statusOverrides` needs the builders, and only it cannot be defaulted — there is nothing sensible to default when parsing a `batch_index` array. Statics are inherited, so `VDMV2ObjectDestination` and the audience base classes can supply a family-level `extractErrorMessage`, subject to the `statusOverrides` shadowing caveat in §3.1.

### 3.5 Item→job mapping: explicitly out of scope

**Nothing about the router output payload changes.** No new `destInfo`, no change to `PayloadChunk` / `BatchGroup` / `chunkPayloads`, no change to what rudder-server receives. This design touches the delivery path only.

The mechanism is available if it is ever needed. `chunkPayloads.ts:47-48` already has `payload.jobId` sitting next to each body item:

```ts
currentBodies.push(payload.body); // one entry per ITEM
currentJobIds.add(payload.jobId); // Set — dedupes
```

so a future change could carry an item→job map through `BatchGroup` and stamp it into `metadata.destInfo`, generalising what `braze` hand-rolls (§2, Pattern E). Deferred until a destination actually needs it, because the cost is real and immediate — a new metadata field on router output for **every** batching destination, hence snapshot churn across all of them — while the benefit only materialises for a multiplexing destination, and none of the batching-framework destinations multiplex today.

Two hazards for whoever picks that up:

- **Shared `Metadata` references.** `resolveMetadata` (`processBatchedDestination.ts:84-95`) returns the _same_ object references out of `metadataMap` for every batch a job appears in, so an in-place `destInfo` write would clobber across batches for multiplexed jobs. Any stamp must write to a shallow clone.
- **`combineBatchRequestsWithSameJobIds`** (`src/v0/util/index.js:2299-2339`) merges responses sharing jobIds into one response holding an _array_ of `batchedRequest`s with a concatenated, de-duplicated metadata array. Whether rudder-server pairs each `batchedRequest` with only its own jobs or with the merged union is unverified, so any stamp must be per-`batchedRequest`, not per-response.

Consequence for this design: `perItem` is positional and 1:1-only, bounds-checked as described in §3.2.

### 3.6 Wiring into `deliver()`

`src/services/destination/nativeIntegration.ts:203-273` gains a branch before the existing flow:

```ts
if (
  isProxyV1Request(deliveryRequest) &&
  isBatchingFrameworkDeliveryEnabled(destinationType, deliveryRequest.metadata[0]?.workspaceId)
) {
  const IntegrationClass = FetchHandler.getBatchDestinationHandler(destinationType);
  return toDeliveryV1Response(
    IntegrationClass.handleResponse(ctx),
    ctx,
    destinationType.toUpperCase(),
  );
}
// otherwise: existing networkHandlerFactory responseHandler path, untouched
```

**Why the guard is a shape predicate, not `version === 'v1'`.** `version` is a literal passed by the
two controller entry points (`controllers/delivery.ts:33` passes `'v0'`, `:66` passes `'v1'`) — it
records which proxy route rudder-server called, not anything about the destination. What this branch
actually depends on is that `metadata` is an **array**: it indexes it, hands it to `handleResponse`
as the job list, and shapes a `DeliveryV1Response` around it. `isProxyV1Request` is a one-line type
predicate on exactly that field, so the narrowing both proves the precondition and removes the
`deliveryRequest as ProxyV1Request` casts the branch would otherwise need. The two are equivalent in
practice — the v0 route body is a `ProxyV0Request` whose `metadata` is a single object — but the
shape check is the one the code can be wrong about.

`ProxyV1RequestSchema` (`types/zodTypes.ts:147`) was considered and rejected for this: it is
currently unused anywhere, and it marks `secret` and `dontBatch` **required** on every metadata
entry, so a real payload omitting either would fail validation and fall through to the legacy
handler silently — a worse failure than the cast it replaces.

**Resolution is gated on `isBatchingFrameworkDeliveryEnabled`** — its own flag, separate from the transform's, defaulting to **off** for every destination and workspace:

- Per-destination env var `{DEST}_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS`, comma-separated workspace IDs or `ALL`.
- **No GA map.** The transform flag force-enables itself for destinations listed in `features.ts` with `batching: true`; the delivery flag deliberately has no equivalent, so a GA destination like `iterable_audience` keeps the legacy handler until a workspace is named explicitly. That is what makes it safe to land the wiring before any rollout.
- **It requires the transform flag** (`isBatchingFrameworkEnabled`) and returns false without it, because **the delivery path must interpret a payload built by the matching transform path.** `doRouterTransformation` branches on that flag at `nativeIntegration.ts:119`: an enrolled workspace's events go through `processBatchedDestination`, an unenrolled workspace's through the legacy `destHandler.processRouterDest`. Enabling delivery for a workspace not on the framework transform would pair the two halves incorrectly, so the flag refuses.

Both predicates live in `src/constants/batchedDestinationsMap.ts` — `isBatchingFrameworkEnabled` at `:34`, `isBatchingFrameworkDeliveryEnabled` at `:66`.

The `v1` guard matters too: the bridge produces a `DeliveryV1Response`, so a v0 proxy request stays on the legacy path regardless of the flag.

Consequences, all of which follow from that:

1. **Every destination keeps its legacy `networkHandler.ts`** until the delivery flag is fully rolled out for it, since any workspace not named in the flag is still delivered by that handler. It is removed once the flag reads `ALL` for the destination and its legacy transform is retired.

### 3.7 Bridge: `Verdict` → `DeliveryV1Response`

Framework-owned, in `delivery.ts`.

**Uniform non-success batch on a non-2xx status** → construct and throw `TransformerProxyError` exactly as handlers do today, letting the existing `handlevV1DeliveriesFailureEvents` (`src/services/destination/postTransformation.ts:198-232`) build the response. The non-2xx qualifier is essential: throwing with a 2xx status would have `postTransformation.ts:215` echo that 2xx into every job's `statusCode`, and rudder-server's `isSuccessStatus` (`router/misc.go:19-21`) would then treat failed events as delivered. This preserves `statTags`, the `destinationResponse` echo, `authErrorCategory`, and — importantly — keeps `ErrorReportingService.reportError` firing (line 230). Arguments:

| arg                   | value                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `message`             | the verdict's `reason`                                                                                           |
| `status`              | `ctx.status`                                                                                                     |
| `statTags`            | `{ ERROR_TYPE: … }` — `retry`→`RETRYABLE`, `retry as 'throttled'`→`THROTTLED`, `abort` (incl. revoked)→`ABORTED` |
| `destinationResponse` | `{ status: ctx.status, response: ctx.response }`                                                                 |
| `authErrorCategory`   | `retry as 'authExpired'`→`REFRESH_TOKEN`; `abort auth:'revoked'`→`AUTH_STATUS_INACTIVE`; otherwise `''`          |

`ERROR_TYPE` for `authExpired` is `RETRYABLE` and for `authRevoked` is `ABORTED`, which falls straight out of the three-kind model — and matches rudder-server, where the former ends as a 500 and the latter as a 400 (§2.1).

Those two rows are reachable **only** when an integration explicitly returns an auth verdict; the framework never produces one from a status code (§3.1). For a 401 left to the default classifier the result is a plain `abort` with `ERROR_TYPE: ABORTED`, which is exactly what `getDynamicErrorType(401)` returns today — so the default path is unchanged, and only a destination that has actually parsed its error body can move a job onto the refresh-and-retry path.

**Two further exclusions from the throw**, both cases where it would lose or contradict something the per-job path carries correctly:

- **A lost-attribution retry** (§3.2). The throw carries `ctx.status`, not a status derived from the verdict, so on a 4xx rudder-server's `isJobTerminated` (`router/misc.go:23-28`) would abort the very batch the mismatch guard just decided to retry. The per-job path derives `500` from the verdict and is therefore the only one that can express it.
- **A `dontBatch` retry.** That flag exists only as a stamp on a job state's `metadata`; `handlevV1DeliveriesFailureEvents` rebuilds job states from the _request_ metadata (`postTransformation.ts:209-219`), so the throw has nothing to stamp. Without this exclusion `retry(reason, { dontBatch: true })` would be silently inert on exactly the whole-batch failure a destination would use it for.

The general shape of both, and of the per-item exclusion above: the throw is a lossy channel, so anything the verdict says that it cannot carry forces the per-job path. The cost is `statTags`, the `destinationResponse` echo and `ErrorReportingService.reportError` for those batches.

**Otherwise** (all-success, or mixed) → return a `DeliveryV1Response` directly.

Status derivation:

- **Top-level `status`** — `ctx.status`, always. `ProxyResponseV1` has no `status` field (`router/transformer/transformer_proxy_adapter.go:40-44`), so rudder-server takes disposition from each job state and never reads this; substituting `207` for a status the destination did not send would invent a difference from the legacy handler that nothing benefits from. 207 is one convention among several — customerio and hs use it, braze answers `201`, iterable and gaec `200`.
- **Top-level `message`** — `[DEST] <reason>` when every failure agrees on one reason, `[DEST] <n> of <m> events failed; see per-event errors` when they do not, `[DEST] Request processed successfully` when there are none. Quoting the first of several differing reasons would present one job's error as the batch's; the per-job entries carry every reason keyed to its job either way. This is the only place the batch-level reason survives now that `destinationResponse` is not echoed, which is why a fixed "partial failures" string was not enough — it discarded gaec's `partialFailureError.message` (§5.3).
- **Top-level `statTags`** — the whole-response tag set when every job failed and failed the same way; absent otherwise. The bridge sets the error-describing half (`errorCategory`, `errorType`), exactly what the throw path hands `TransformerProxyError`; `deliver()` merges the identifying half (`destType`, `destinationId`, `workspaceId`, `module`, `implementation`, `feature`) from the same `getTags` metadata that `postTransformation.ts:223` merges for a thrown error, so a returned failure and a thrown one carry one tag set from one source. A counter carrying only `errorType` could not be attributed to a destination or workspace. This field drives rudder-server's `integration.failure_detailed` counter (`processor/integrations/integrations.go:29-37`), which tags the response as a whole, so it is only honest when the response as a whole is one failure. A partially-succeeded batch has no single `errorType`; gaec's legacy handler emitted `aborted` for one anyway, counting a batch that partly delivered as a whole-batch abort. Emitting it for a uniform failure also means the returned path still carries an `errorType` whenever `status` is a non-2xx, which is what the response schema expects (`types/zodTypes.ts:220-231`).

  Surveyed against every v1 handler that can produce a per-job response array — `am`, `bloomreach`, `bloomreach_catalog`, `braze`, `braze_audience`, `campaign_manager`, `clicksend`, `customerio`, `emarsys`, `gaec`, `gaoc`, `hs`, `iterable` (2 strategies), `iterable_audience`, `linkedin_ads`, `monday`, `mp`, `reddit`, `zoho`. **Two of the twenty set `statTags` on a returned response: `gaec` and `gaoc`**, with the same hand-rolled block copied between them (`google_adwords_enhanced_conversions/networkHandler.ts:87-95`, `google_adwords_offline_conversions/networkHandler.js:186-194`), both hardcoding `errorType: 'aborted'` and `status: 400` on a _partial_ failure. The other eighteen set none and let the thrown path supply them.

  So omitting them for a mixed batch follows the overwhelming convention, and drops only the two hardcoded `aborted` labels that described a partly-delivered batch as a whole-batch abort. Emitting them for a _uniform_ whole-response failure goes slightly beyond what fifteen of the eighteen do — they emit nothing when the failure arrives on a 2xx — but it is the same tag set those destinations already emit when the identical failure arrives on a non-2xx and takes the throw path, so it removes an inconsistency rather than inventing a rule. `am/networkHandler.ts:75` records the related fact about the sibling field in a comment: _"this status is not used by server, server uses the status of response"_.

- **Per-job `statusCode`** — fixed by verdict kind: `success`→200, `abort`→400, `retry`→500, `retry as 'throttled'`→429. The one case where `ctx.status` is echoed instead is the throw path above, where `postTransformation.ts:215` sets per-job `statusCode` to the same `errObj.status` as the top level — which is why that path is restricted to non-2xx statuses.

  The `ctx.status` non-2xx condition is load-bearing, not defensive. A destination can return **HTTP 200 with a failure in the body** — mixpanel's Engage and Groups APIs do exactly that (`src/v1/destinations/mp/utils.ts:154-165`: success status, `response.error` present, all jobs marked 400). Without the condition, a uniform `abort` on a 200 would echo `200` into every job's `statusCode`, and `isSuccessStatus(200)` in rudder-server (`router/misc.go:19-21`) would mark genuinely failed events as delivered — silent data loss. The condition costs nothing for customerio, whose failure branches always carry a non-2xx status (§5 rows 2–3 are unaffected).

- **Per-job `error`** — uniform failure → `extractErrorMessage(ctx.response)`, whose default is the `JSON.stringify` that `postTransformation.ts:212` produces today. Mixed → that item's verdict `reason`, or `'success'`.
- **`dontBatch`** — `retry(reason, { dontBatch: true })` sets `metadata.dontBatch = true` on that job state.

The "uniform failure echoes `ctx.status` per job" rule is not an artifact of customerio. `iterable_audience` does the same by hand — `rudderJobMetadata.map((metadata) => ({ statusCode: status, … }))` (`audience-list.ts:127-131`) — so the rule generalises to the next destination migrated.

The uniform-vs-mixed asymmetry is not elegant, but it is what parity demands; a cleaner uniform rule would silently change delivery behaviour for every destination migrated later. It is verified against all five of customerio's current branches in §5.

**`destinationResponse` is echoed on failures and omitted on successes.** Today's handlers disagree — customerio's success path omits it (`networkHandler.ts:77-85`), `iterable_audience`'s includes it (`audience-list.ts:113-118`) — so this needed deciding rather than copying.

Checked against rudder-server: `destinationResponse` has exactly **one** consumer, the error-message extractor at `enterprise/reporting/error_extractor.go:326-327`, which digs into it to find human-readable error text. That path is failure-gated — `shouldReport` admits a metric only when `StatusDetail.StatusCode >= http.StatusBadRequest` (or the filter/suppress codes) at `enterprise/reporting/error_reporting.go:246`, and `extractErrorDetails` is reached only through it (`:295`).

So the field is load-bearing on failures and dead weight on successes:

- **Failure** → echo it. The bridge does, via `TransformerProxyError`'s 4th argument, which `postTransformation.ts` places on the response. Without it, error reporting loses its best source of message text.
- **Success** → omit it. Nothing reads it, and omitting matches customerio's current behaviour.

---

## 4. Migration

### 4.0 The migration set

§3.6 gates delivery on its own flag, `isBatchingFrameworkDeliveryEnabled`, which defaults to off — so the wiring is safe to land before any rollout. That does not change which destinations need migrating, though: **every destination that is on the batching framework _and_ has its own network handler**, because the flag can only be turned on for a destination whose class knows how to answer. One left unmigrated would fall back to `defaultVerdict` and lose its response handling the moment someone enabled it.

Intersecting the two sets — classes extending the `BatchDestination` family, against destinations with a `networkHandler` file:

| destination                           | `batching: true`            | handler                                                        | response-handler work         |
| ------------------------------------- | --------------------------- | -------------------------------------------------------------- | ----------------------------- |
| `iterable_audience`                   | **yes** (`features.ts:110`) | `networkHandler.ts` (18) → `strategies/audience-list.ts` (146) | content-keyed, Pattern D      |
| `braze_audience`                      | **yes** (`features.ts:111`) | `v1/networkHandler.ts` (137)                                   | indexed partials on a 2xx     |
| `test_destination`                    | **yes** (`features.ts:113`) | `v0/networkHandler.ts` (29)                                    | small; dev-only fixture       |
| `customerio`                          | no — env var                | `v1/networkHandler.ts` (105)                                   | 207 multi-status, Pattern B   |
| `google_adwords_enhanced_conversions` | no — env var                | `v1/networkHandler.ts` (122)                                   | positional results, Pattern C |
| `custom_audience`                     | yes (`features.ts:109`)     | none                                                           | none — nothing to do          |
| `posthog`                             | yes (`features.ts:108`)     | none                                                           | none — nothing to do          |

**The three GA destinations would have been the risky ones**, and the separate delivery flag is why they are not. `iterable_audience`, `braze_audience` and `test_destination` have `batching: true`, so `isBatchingFrameworkEnabled` returns `true` unconditionally (`batchedDestinationsMap.ts:38-40`); had delivery been gated on that same flag, the wiring would have switched them for _every_ workspace the instant it shipped, with nothing to stage behind. The delivery flag has no GA map, so all five stage per workspace identically.

`iterable_audience` carries the most behavioural risk. Its handler resolves failures by identity, not status: GDPR-forgotten users are deliberately returned as **200 plus a metric** rather than 400 (`audience-list.ts:88-98`), and `notFound` on an unsubscribe is a no-op success (`:100-103`). Falling back to `defaultVerdict` would abort those as plain failures, so its `statusOverrides` must reproduce all three branches. Migrating it also fixes its `metadata: undefined` bug for free, since the framework bounds-checks `perItem` (§3.2).

**`gaec` is smaller than its line count suggests.** Its `v0/networkHandler.ts` is 262 lines but is almost entirely _transport_ — an SDK-based `gaecProxyRequest`, a `conversionActionId` cache, and `gaecProcessAxiosResponse` — which §3.6 rule 2 leaves in place. Only `gaecResponseHandler` in the v1 file migrates. Two things to carry over: it reports partial failure on a **2xx** status with `partialFailureError` set, which is the case §3.7's non-2xx condition exists for; and it derives auth categories from the response via `getAuthErrCategory` (`v0/util/googleUtils`), so as a genuine OAuth destination it must declare those explicitly under §3.1 rather than relying on inference.

**`braze_audience` landed on develop after this design was written** (#5408) and is migrated on the same terms. It is the second destination whose partial failures arrive on a 2xx (like gaec) and the second whose response indexes the request body positionally (like customerio) — no new mechanism, which is the useful thing about it: a destination added after the contract existed fits it without extending it.

The five share one framework change, so they land together; the delivery flag then decides, per destination and per workspace, when each actually switches.

### 4.1 `customerio`

`customerio` is genuinely 1:1 — **every** branch of `transformObjectRecord` (`src/v0/destinations/customerio/routerTransform.ts:56-63`) and `transformEventStream` (lines 71-94) returns exactly one `TransformedEvent`, and `getBatchStrategy` uses `wrapBody: (bodies) => ({ batch: bodies })` (line 99). So `batch_index` ↔ `jobs[i]` alignment holds, which is what makes `perItem` safe here under §3.2's 1:1 requirement.

**`src/v1/destinations/customerio/networkHandler.ts` is kept, not deleted.** Per §3.6 rule 1, workspaces not enrolled in the batching framework still transform through the legacy `processRouterDest` (`src/v0/destinations/customerio/transform.ts:181`) and still need that handler. It is deleted when customerio reaches GA and the legacy transform is retired.

The duplication is a copy rather than a divergence, because **both paths produce the same request**: the legacy transform sets `request.body.JSON = { batch: chunk.data }` (`transform.ts:173`) against `${BASE_ENDPOINT_V2}/batch` (`config.ts:33`), and the framework path produces `{ batch: bodies }` against `v2/batch` (`v2/config.ts:10`). Same endpoint, same wrapper, so the same 207 / `batch_index` contract holds on both. The parity table in §5 therefore describes both handlers.

Add to `CustomerIOIntegration`:

```ts
// 207 is 2xx, so without this the framework would read it as a plain success.
static readonly statusOverrides = {
  207: (ctx: DeliveryContext) => {
    const items = (ctx.request.body.JSON as { batch?: unknown[] })?.batch ?? [];
    const failed = new Map<number, string>();
    for (const e of asErrors(ctx.response)) {
      failed.set(e.batch_index, buildErrorMessage(e));
    }
    return perItem(items.map((_, i) => (failed.has(i) ? abort(failed.get(i)!) : success())));
  },
} as const;
```

`buildErrorMessage` and the `CustomerIOError` type move alongside it (or into `./v2/`). Three things to note:

- **That is customerio's entire delivery contract** — one map entry. Plain success and every failure status are handled by the framework, so there is no `handleResponse` override, no `super` call, no `isHttpStatusSuccess` check, and no hardcoded reason string. Compare the 105-line `networkHandler.ts` it replaces.
- The 207 loop is driven from the **request body**, not `ctx.jobs` — reading `batch_index` against the array it actually indexes. For customerio the two have equal length; this is simply the correct reading of the API.
- **customerio declares no other override and does not touch `extractErrorMessage`.** It inherits `JSON.stringify(response)`, byte-identical to what `postTransformation.ts:212` produces today, so per-job `error` text does not change, and §5's parity table holds unchanged.

#### Behaviour change 1: the top-level `message` text

The framework generates the top-level `message`, so the three current strings change:

| branch    | today                                                                                                  | after                                 |
| --------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| success   | `[CustomerIO Response Handler] - Request Processed Successfully`                                       | framework success template            |
| 207 mixed | `[CustomerIO Response Handler] - Batch completed with partial failures`                                | `[CUSTOMERIO] <first failure reason>` |
| failure   | `[CustomerIO Response Handler] - Error in transformer proxy during CustomerIO response transformation` | the verdict `reason`                  |

`message` is human-facing diagnostic text, not part of the delivery contract — no per-job field derives from it. Adding a `message` override to every builder to preserve three strings would put API noise into exactly the surface this design exists to simplify. So: accept the drift and update the expectations in `test/integrations/destinations/customerio/dataDelivery/data.ts` and `src/v1/destinations/customerio/networkHandler.test.ts`.

The governing rule is that framework-generated text may change while destination-specific error text may not — which is why customerio inherits the default `extractErrorMessage` and per-job `error` stays byte-identical.

#### Behaviour change 2: customerio stops emitting `authErrorCategory`

Today the handler passes `getAuthErrCategoryFromStCode(status)` as `TransformerProxyError`'s 5th argument (`networkHandler.ts:93`), so a 401 emits `authErrorCategory: 'REFRESH_TOKEN'` and a 403 emits `'AUTH_STATUS_INACTIVE'`. Under §3.1 the framework does not infer auth from a status, and customerio does not declare a replacement, so the field is absent.

**The field is unreachable for customerio, and the evidence is conclusive.** It is not an OAuth destination — its README states _"OAuth Support: **Supported**: No — Customer.io destination uses API Key authentication (Basic Auth) only"_ (`src/v0/destinations/customerio/README.md:125-128`), and the request is built with `Authorization: Basic ${btoa(siteID:apiKey)}` (`src/v0/destinations/customerio/v2/util.ts:254`). `OAuthTransport.RoundTrip` returns via `if !isOauthDestination { return t.Transport.RoundTrip(req) }` (`services/oauth/v2/http/transport.go`), so `postRoundTrip` never runs and neither the token refresh nor the `401`→`500` status rewrite that `REFRESH_TOKEN` normally triggers is reachable. A 401 was terminal before and is terminal now.

So this is a **correction, not a regression**: customerio was labelling a bad-API-key 401 as a refreshable OAuth token, and the only reason it was harmless is that the label was unreachable. Declaring `authExpired`/`authRevoked` to preserve the string was considered and dropped — it would have kept a field nothing reads while forcing `errorType` to `retryable` on a job that is in fact aborted, which is strictly less accurate than the legacy `aborted`.

Two consequences to record:

- `test/integrations/destinations/customerio/dataDelivery/data.ts` no longer asserts `authErrorCategory: 'REFRESH_TOKEN'`, and `src/v1/destinations/customerio/networkHandler.test.ts:159` keeps the old assertion for the retained legacy handler.
- The **transformer's own HTTP status** for that response moves `401`→`200`, because `controllers/delivery.ts:84-87` propagates the delivery status to the HTTP response only when `authErrorCategory` is set. The per-job `statusCode` stays `401`, which is what rudder-server reads.

Everything else — per-job `error`, per-job `statusCode`, top-level `status`, `statTags.errorType` — is unchanged.

### 4.2 `iterable_audience`

The largest of the five and the only Pattern D case. Implemented in `src/v0/destinations/iterable_audience/delivery.ts`.

Iterable's bulk list APIs answer a partially-failed request with HTTP 200 and a `failedUpdates`
object naming the _identities_ that failed — no indices anywhere — so correlation is content-keyed:
each subscriber in the request body is tested against those identity sets.

```ts
static readonly statusOverrides = iterableAudienceStatusOverrides; // { '2xx': handleSuccessStatus }

static extractErrorMessage(response: unknown): string {
  return extractIterableAudienceErrorMessage(response); // params ?? msg ?? message
}
```

Four things to note:

- **`'2xx'`, not `200`.** Its dispatch today is `!isHttpStatusSuccess(status)` (`src/v1/destinations/iterable/strategies/base.ts:10`), so the class key is what preserves the contract.
- Two branches deliberately report **success** where a naive reading would abort, and both carry over verbatim: a GDPR-forgotten user is counted and accepted rather than aborted (`audience-list.ts:88-98`), and `notFound` on an unsubscribe is a no-op success (`:100-103`). The `stats.counter` call sits inside the handler, which the contract permits (§2, conclusion 2), and the constraint on never tagging the identifier value carries over as a comment.
- `extractErrorMessage` carries over `handleError`'s `response?.params ?? response?.msg ?? response?.message` chain (`audience-list.ts:124-125`), which is exactly what that declaration point exists for.
- The non-2xx path needs **no override**. `defaultVerdict` already aborts a 401 and retries a 500 with no auth inference (§3.1), which is what the legacy handler's empty `authErrorCategory` was expressing — Iterable list APIs are Api-Key authenticated, not OAuth (`audience-list.ts:138-140`).

`BaseStrategy`, `AudienceListStrategy` and the 18-line `networkHandler.ts` are deleted once the framework owns delivery for this destination.

### 4.3 `google_adwords_enhanced_conversions`

Only `gaecResponseHandler` migrates. The 262-line `v0/networkHandler.ts` is transport — an SDK-based `gaecProxyRequest`, a `conversionActionId` cache, and `gaecProcessAxiosResponse` — which §3.6 rule 2 keeps in place.

```ts
static readonly statusOverrides = {
  // Partial failure arrives on a 2xx with partialFailureError set; results[] is positional.
  '2xx': (ctx: DeliveryContext, fallback) => {
    const { partialFailureError, results } = (ctx.response as any) ?? {};
    if (!partialFailureError || partialFailureError.code === 0) return fallback(); // clean success
    const reason: string = partialFailureError.message || 'unknown error format';
    return perItem(
      (results ?? []).map((r: unknown) => (isEmptyObject(r ?? {}) ? abort(reason) : success())),
    );
  },

  // Google Ads is a genuine OAuth destination: auth category comes from the body.
  '4xx': (ctx: DeliveryContext, fallback) => {
    const category = getAuthErrCategory({ response: ctx.response, status: ctx.status });
    const msg = GaecIntegration.extractErrorMessage(ctx.response);
    if (category === REFRESH_TOKEN) return authExpired(msg);
    if (category === AUTH_STATUS_INACTIVE) return authRevoked(msg);
    return fallback();
  },
} as const;

static extractErrorMessage(response: unknown): string {
  return (response as any)?.error?.message || '';
}
```

This is the first destination for which the §3.1 auth rule does real work. gaec **is** OAuth-backed, so its `authErrorCategory` is live — dropping it would break token refresh, where customerio's (§4.1) is declared for parity rather than because anything reads it. `getAuthErrCategory` (`src/v0/util/googleUtils`) already derives it from the response rather than the status, so the migration is a direct translation — and the `'4xx'` class key means 401 and 403 are both covered without enumerating.

The `perItem` list is built from `results`, not from `ctx.jobs`, for the §3.2 reason: `results[]` is the array the API indexed.

### 4.4 `braze_audience`

Implemented in `src/v0/destinations/braze_audience/delivery.ts`.

Braze answers `/users/track/bulk` with a **2xx** even when individual records were rejected, listing them in `errors[]` with an `index` into the posted `attributes` array (`src/v1/destinations/braze_audience/networkHandler.ts:55-80`). So it combines the two properties already handled separately: partial failure on a success status (gaec, §4.3) and a positional index into the request body (customerio, §4.1).

```ts
static readonly statusOverrides = brazeAudienceStatusOverrides; // { '2xx': ... }

static extractErrorMessage(response: unknown): string {
  return extractBrazeAudienceErrorMessage(response); // JSON.stringify(message ?? response)
}
```

Four things to note:

- **`'2xx'`, not `201`.** Its dispatch today is `!isHttpStatusSuccess(status)` (`networkHandler.ts:35`), and Braze returns `201` on the bulk endpoint but the handler was never written to that specific code.
- **Unindexed errors are the interesting branch.** Braze sometimes reports a failure with no `index`, which cannot be attributed to a record. The legacy handler marks every record the indexed errors did _not_ name as retryable (`:87-93`) rather than reporting them delivered, and that carries over verbatim — a success report for a batch Braze flagged as partially failed would silently drop data.
- **Abortability is shared, not copied.** `isIdentityAborted` — the enum set plus the live-message regexes that #5408 added after observing real Braze responses — moves to `braze_audience/utils.ts` and is imported by both the legacy handler and `delivery.ts`. Copying it as customerio's `batch_index` parsing was copied (§4.1) would leave two definitions of which failures are permanent, and the regexes exist precisely because that judgement was hard to get right.
- The non-2xx path needs **no override**, for the same reason as `iterable_audience`: `defaultVerdict` aborts a 400 and retries a 500, and the legacy handler already passed an empty `authErrorCategory` (`:50`) because Braze is REST-API-key authenticated. Unlike customerio (§4.1) there is nothing to declare here — the legacy handler inferred nothing to begin with.

One guard is destination-specific. The `perItem` loop is driven from `attributes`, the array Braze indexes, but falls back to `ctx.jobs` when that body cannot be read, so that per-record verdicts survive: without it the bridge sees a length mismatch and retries the whole batch (§3.2), which would keep redelivering an identity failure that can never succeed instead of aborting it. The framework builds the two 1:1, so the fallback is exact whenever it is reached.

### 4.5 `test_destination`

**No `statusOverrides`, and no work beyond deleting a file.** Its handler composes the generic one and replaces only `proxy`:

```ts
function networkHandler(this: Record<string, unknown>) {
  genericNetworkHandler.call(this); // responseHandler / processAxiosResponse / prepareProxy
  this.proxy = proxy; // integration-major dispatch
}
```

(`src/v0/destinations/test_destination/networkHandler.ts:24-27`.) Since `defaultVerdict` reproduces `genericNetworkHandler`'s `responseHandler` (§3.4), the framework default already is its behaviour. The `proxy` override is transport and stays; the file keeps only that.

That equivalence is asserted rather than assumed: `delivery.test.ts` drives both the framework and `genericNetworkHandler` over 200/201/400/429/500/502 and compares status and `errorType`, so the day it stops holding is the day a test fails rather than the day delivery quietly changes.

### 4.6 A harder case, out of scope: `mixpanel`

customerio only exercises one map entry on a 2xx status. `mixpanel` is a useful second reference point — it dispatches on **endpoint** as well as status, and its per-item failures are content-keyed rather than positional. It is **not** being migrated here (`MP: { routerTransform: true, regulations: true }` in `src/features.ts:71` has no `batching: true`, and `src/v0/destinations/mp/` has only the legacy `transform.js`), but it shows the contract holding under more pressure:

```ts
static readonly statusOverrides = {
  // Import API: a 400 carries per-record failures keyed by $insert_id.
  400: (ctx: DeliveryContext, fallback) => {
    if (!ctx.request.endpoint?.includes('/import')) return fallback(); // not our endpoint
    const events = decodeBatch(ctx.request);
    if (!events) return fallback(); // undecodable body
    const failed = new Map<string, string>();
    for (const r of asFailedRecords(ctx.response)) {
      if (r.$insert_id) failed.set(r.$insert_id, `Field: ${r.field}, Message: ${r.message}`);
    }
    return perItem(
      events.map((e) => {
        const reason = failed.get(e.properties?.$insert_id ?? '');
        return reason ? abort(reason) : success();
      }),
    );
  },

  // Engage/Groups signal batch-level failure as a 2xx with `error` in the body.
  '2xx': (ctx: DeliveryContext, fallback) => {
    const error = get(ctx.response, 'error');
    return error ? abort(`API error: ${error}`) : fallback();
  },
} as const;
```

Three things this demonstrates that customerio does not:

- **Endpoint dispatch needs no new mechanism.** The batching framework groups payloads by endpoint (`groupPayloadsByCompositeKey`), so every batch is single-endpoint; a handler reads `ctx.request.endpoint` and declines if it is not the one it handles. Today's `handleEndpointSpecificResponses` if-chain (`mp/utils.ts:283-297`) becomes the two `return fallback()` lines above.
- **Declining composes.** The 400 handler declines twice — wrong endpoint, undecodable body — and in both cases the framework's own classification takes over, with no delegation for the author to get right.
- **Driving `perItem` from the request body removes a bounds guard entirely.** Today mixpanel walks `metadata.map((m, index) => (index < events.length ? events[index] : null))` (`mp/utils.ts:229-230`) — positional job→event, then content-keyed event→failure by `$insert_id`. Iterating `events` instead means there is no index to run off the end. That guard exists only because the loop is driven from the wrong array.

Roughly 300 lines of `mp/utils.ts` — `createResponsesForAllEvents`, `createSuccessResponse`, `handleNonSuccessResponse`, `handleStandardApiResponse`, `handleEndpointSpecificResponses`, and four copies of `Array.isArray(rudderJobMetadata) ? … : [ … ]` — would collapse into the map above plus the body decoder.

Two prerequisites for whenever mixpanel is actually migrated: `BodyFormat` has no `GZIP` member (`nativeBatching/types.ts:55-60`), which its import path needs; and the top-level status on the import partial-failure path stays `200`, since §3.7 passes `ctx.status` through.

---

## 5. Parity check

### 5.1 `customerio`

| #   | branch                      | today                                                                      | under the rule                                                      |
| --- | --------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | non-207 success, status 200 | top `200`, per-job `200`/`'success'`                                       | uniform success → top `ctx.status`=200 ✓, per-job fixed 200 ✓       |
| 2   | non-207 failure, status 400 | throw → top `400`, per-job `400`                                           | uniform `abort` → throw path, top 400 ✓, per-job `ctx.status`=400 ✓ |
| 3   | non-207 failure, status 500 | throw → top `500`, per-job `500`                                           | uniform `retry` → top 500 ✓, per-job 500 ✓                          |
| 4   | 207 with errors             | top `207`, per-job `400`/`200`                                             | mixed → top 207 ✓, per-job fixed 400/200 ✓                          |
| 5   | 207, empty `errors`         | top `207`, all per-job `200`                                               | uniform success → top `ctx.status`=207 ✓, per-job fixed 200 ✓       |
| 6   | 401                         | throw, `authErrorCategory: 'REFRESH_TOKEN'`, `errorType: 'aborted'`        | `abort` → category dropped ✗, `errorType` ✓, per-job 401 ✓          |
| 7   | 403                         | throw, `authErrorCategory: 'AUTH_STATUS_INACTIVE'`, `errorType: 'aborted'` | `abort` → category dropped ✗, `errorType` ✓, per-job 403 ✓          |

Branch 5 is the one that rules out naive "class-preserving" per-job codes: a 2xx-preserving rule would emit `207` per job where today emits `200`.

Branches 6–7 are the dropped status-inferred auth categories of §4.1 — unreachable for a Basic-auth destination. Job disposition and `errorType` are unchanged; the transformer's own HTTP status for those two responses moves `401`/`403`→`200`, since the controller propagates it only when `authErrorCategory` is set.

### 5.2 `iterable_audience`

| branch                         | today                                  | after                                      |
| ------------------------------ | -------------------------------------- | ------------------------------------------ |
| non-2xx (401, 500)             | throw → top `status`, per-job `status` | uniform `abort`/`retry` → same ✓           |
| 2xx, all clean                 | top `200`, per-job `200`/`'success'`   | uniform success → top 200 ✓, per-job 200 ✓ |
| 2xx, GDPR-forgotten            | top `200`, per-job `200` + metric      | `success()` + metric → same ✓              |
| 2xx, `notFound` on unsubscribe | top `200`, per-job `200`               | `success()` → same ✓                       |
| 2xx, some abortable            | top **`200`**, per-job `400`/`200`     | same ✓, per-job 400/200 ✓                  |
| 2xx success shape              | includes `destinationResponse`         | omitted (§3.7) ✗                           |

One response-shape change: `destinationResponse` is no longer echoed on success (§3.7). The top-level status and the per-job codes and error text are unchanged; the top-level `message` now carries the first failure reason rather than a fixed success string.

### 5.3 `google_adwords_enhanced_conversions`

| branch                                                   | today                                                   | after                                             |
| -------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------- |
| 2xx, no `partialFailureError`                            | top `status`, per-job `status`, `'success'`             | uniform success → top 200 ✓, per-job 200 ✓        |
| 2xx, `partialFailureError` set                           | top **`400`**, per-job `400`/`200`, explicit `statTags` | top **`200`** (`ctx.status`) ✗, per-job 400/200 ✓ |
| non-2xx, auth (401/403)                                  | throw, `authErrorCategory` from `getAuthErrCategory`    | `authExpired`/`authRevoked` → same ✓              |
| non-2xx, other                                           | throw, `getDynamicErrorType(status)`                    | `abort`/`retry` → same ✓                          |
| 2xx, `partialFailureError` but `results` absent or short | per-job `400`, unmatched tail aborted                   | same ✓                                            |

One change: the top-level status on partial failure moves `400`→`200`, because §3.7 passes `ctx.status` through and Google answered 200 — a `400` label on a batch in which some adjustments succeeded was misleading, and nothing reads it. The top-level `message` keeps Google's `partialFailureError.message`. `statTags` survives when every adjustment failed, which is the case the hand-rolled block was really for; it is dropped only for a genuinely mixed batch, where there is no single `errorType` to report and the legacy `aborted` described a batch that partly delivered. Auth behaviour is preserved exactly, and unlike customerio's it is live — gaec is OAuth-backed.

**The last row is where the per-item list is indexed from.** An earlier revision drove it off `results`, the array the API indexes. That is wrong whenever `results` is absent or truncated — which the existing component fixture `gaec_v1_scenario_2` exercises, sending `partialFailureError` with no `results` at all — because the list then has a different length from the job list, §3.2's attribution guard fires, and the batch is retried where the legacy handler aborted it. Retrying re-uploads adjustments Google has already accepted, which come back as duplicate-enhancement failures on **every** attempt, so the retry never converges.

The list is instead indexed off the **posted `conversionAdjustments`**, matching what customerio (§4.1) and braze_audience (§4.4) already do with their own request bodies. gaec is strictly 1:1 (`routerTransform.ts:44` emits one adjustment per event), so the posted array is the one array guaranteed to match the job list — which keeps §3.2's guard out of the picture entirely rather than relying on it. Reading a missing `results[i]` as failed then reproduces the legacy `results?.[i] ?? {}` exactly.

§3.2 still governs the case it was written for: if the posted body cannot be read at all, there is nothing job-aligned to index and the batch is retried rather than reported delivered.

### 5.4 `braze_audience`

| branch                         | today                                   | after                                        |
| ------------------------------ | --------------------------------------- | -------------------------------------------- |
| non-2xx (400, 401, 429, 500)   | throw → top `status`, per-job `status`  | uniform `abort`/`throttled`/`retry` → same ✓ |
| 2xx, no `errors`               | top `status`, per-job `200`/`'success'` | uniform success → top `ctx.status` ✓         |
| 2xx, indexed identity failure  | top **`201`**, per-job `400` + metric   | same ✓, per-job 400 ✓                        |
| 2xx, indexed other failure     | top **`201`**, per-job `500` + metric   | same ✓, per-job 500 ✓                        |
| 2xx, unindexed error           | all unmapped jobs `500` + metric        | `retry()` per unmapped item → same ✓         |
| 2xx, indexed abort + unindexed | per-job `400` / `500` / `500`           | same ✓                                       |
| 2xx success shape              | includes `destinationResponse`          | omitted (§3.7) ✗                             |

Same single response-shape change as `iterable_audience`: `destinationResponse` stops being echoed on success. The top-level status stays `201`. Per-job codes, error text and all three counters (`braze_audience_partial_failure`, `_aborted`, `_retryable`) are unchanged — the last is asserted directly, by comparing `stats.increment` call lists between the two paths.

`authErrorCategory` needs no row: the legacy handler passes `''` unconditionally, so unlike customerio (§4.1) there is nothing to declare.

### 5.5 `test_destination`

| branch  | today                                                                        | after                              |
| ------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| 2xx     | v0 shape adapted to v1: per-job `status`, error = `JSON.stringify(response)` | per-job `200`, error `'success'` ✗ |
| non-2xx | throw `NetworkError` → v1 failure events                                     | `abort`/`retry` → same ✓           |

The success-path per-job `error` changes because §3.6 rule 3 stops running the v0→v1 adaptation (`nativeIntegration.ts:235-246`), which was stringifying the whole response into every job. Dev-only fixture (`src/v0/destinations/test_destination/config.ts`), so the only impact is its own component expectations.

---

## 6. Scope

**In:** `delivery.ts` (the `Verdict` type, builders, `DeliveryContext`, the bridge); the framework-owned `handleResponse` / `defaultVerdict` on `BatchDestination` plus the two declaration points, `statusOverrides` and `extractErrorMessage`; the `isBatchingFrameworkDeliveryEnabled` flag and the branch it gates in `deliver()`; **`statusOverrides` for the four destinations that need them (§4.1-4.4); `test_destination` needs none (§4.5)**; unit tests for the bridge, override precedence and `fallback`, the status derivation, and the `perItem` bounds guard; **enabling `{DEST}_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS` via `envOverrides` on all five destinations' `dataDelivery` component tests, and regenerating their expectations** so the framework path is what CI actually exercises rather than dead code behind an off flag.

**Out, and deliberately so:**

- **Any change to router output.** No `destInfo` stamp, no `BatchGroup` / `chunkPayloads` / `processBatchedDestination` change, no snapshot churn for other batching destinations (§3.5).
- **Deleting the migrated destinations' `networkHandler.ts` files** — each is retained until that destination reaches GA and its legacy transform is retired (§3.6 rule 1). For the three already-GA destinations the legacy handler can go once the migration is verified.
- The other ~46 network handlers and `networkHandlerFactory`, which remain the path for every unenrolled workspace and non-batching destination.
- `proxy` / `prepareProxy` / `processAxiosResponse` overrides; the v0 delivery response shape.
- The `iterable` / `iterable_audience` `undefined`-metadata bug — recorded below, not fixed here.

---

## 7. Decisions and deferrals

1. **Delivery has its own flag, off by default** (§3.6). Wiring `deliver()` therefore changes nothing until a workspace is named in `{DEST}_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS`, and the flag refuses unless that workspace is also on the batching-framework transform. All five destinations are still migrated together (§4.0), because the flag can only be enabled for a destination whose class can answer.
2. **Two behaviour changes for customerio, both in §4.1** — the top-level `message` text, and dropping the status-inferred `authErrorCategory`, which is provably unreachable for a Basic-auth destination and takes the transformer's own HTTP status for those responses from `401`/`403` to `200`. Per-job `error`, per-job `statusCode`, top-level `status` and `statTags` are otherwise unchanged. All five destinations have worked migrations (§4.1-4.5) and parity tables (§5.1-5.5).
3. **`destinationResponse`** is echoed on failures and omitted on successes (§3.7), on the evidence that its only consumer is failure-gated. Note `iterable_audience` currently echoes it on success (`audience-list.ts:113-118`), so that is a further response-shape change once its flag is enabled.
4. **Item→job mapping is deferred** (§3.5) until a multiplexing batching destination needs it. The two hazards to handle are recorded there so the work does not have to be re-derived.

### Follow-ups this survey surfaced but does not fix

**`iterable` / `iterable_audience` can emit `metadata: undefined` job states** (`strategies/track-identify.ts:15-34`, `audience-list.ts:80-81`) when request body items outnumber jobs. What rudder-server does with it sets the severity:

1. Go unmarshals the missing `metadata` to its zero value, so `resp.Metadata.JobID == 0`. `v1Adapter.getResponse` then writes `routerJobResponseCodes[0] = statusCode` (`router/transformer/transformer_proxy_adapter.go:151-153`) — a bogus entry for a job that does not exist, and no entry for the real job.
2. **It is detected.** `transformer.go:606-618` compares the request's jobID set against the response's map keys and fires `emitBreach(reasonInOutMismatch, "[TransformerProxy] JobIDs in out mismatch", …)`. The comment there is explicit that this is _"Non-fatal: the results were applied, but may be attached to the wrong jobs."_
3. **The real job is not lost.** `hydrateRespStatusCodes` (`router/worker.go:815-822`) backfills any job in `JobMetadataArray` with no response entry as `500` + `"Response for this job is expected but not found"`, so it is retried rather than stranded.

Net: no data loss and no stuck jobs, but the delivery outcome the destination actually reported is **discarded**, so a successfully-delivered event gets redelivered — duplicates plus alert noise. That is why §3.2 has the framework bounds-check `perItem` and degrade to a whole-batch verdict instead of indexing past the end. Worth its own issue for the two iterable destinations.

Also note `transformer.go:611` flags `responseEntriesCount > len(routerJobResponseCodes)` as a breach — two response entries collapsing onto one jobID silently drops a status. Another reason `perItem` must stay 1:1.

**`TransformerProxyError`'s 6th argument is dead and safe to drop.** The constructor stores it as `this.response` (`src/v0/util/errorTypes/transformerProxyError.js:24`) and nothing ever reads it. `handlevV1DeliveriesFailureEvents` rebuilds per-job states from metadata and reads only `error.destinationResponse?.response` — the **4th** argument — at `postTransformation.ts:212`. `iterable_audience/audience-list.ts:141` and `customerio/networkHandler.ts:94` both compute and pass it for nothing. Removing the parameter is a separate cleanup across the ~50 handlers that pass it; this design removes the temptation by never exposing the throw.
