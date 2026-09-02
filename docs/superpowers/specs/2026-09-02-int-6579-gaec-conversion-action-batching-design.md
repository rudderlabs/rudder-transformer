# INT-6579 — Move the conversion action out of GAEC proxy params

Ticket: <https://linear.app/rudderstack/issue/INT-6579>
Destination: `GOOGLE_ADWORDS_ENHANCED_CONVERSIONS` (GAEC)

## Problem

`transform.ts` puts the conversion action **name** into the delivery request's `params`:

```ts
// src/v0/destinations/google_adwords_enhanced_conversions/transform.ts:61
deliveryRequest.params = { event, customerId, accessToken, loginCustomerId, subAccount };
```

The native batching framework groups payloads by a composite key built from the **entire** `params`
object:

```ts
// src/services/destination/nativeBatching/processBatchedDestination.ts:113
const key = stableStringify({
  endpoint: payload.endpoint,
  method: payload.method,
  headers: payload.headers ?? {},
  params: payload.params ?? {},
  internalGroupKey: payload.internalGroupKey ?? '',
});
```

So every distinct conversion name forces its own batch. A destination with K configured conversion
actions produces at least K requests per router call, where Google's
`uploadConversionAdjustments` would accept a single request of up to 2000 adjustments
(`MAX_CONVERSION_ADJUSTMENTS_PER_BATCH`, `config.ts:18`). `conversionAction` is a **per-adjustment**
field in Google's API — nothing about the API requires one conversion action per request.

The name cannot simply be dropped. It is consumed at **proxy** time to resolve the Google resource
name:

```ts
// src/v0/destinations/google_adwords_enhanced_conversions/networkHandler.ts:70
const conversionActionIdKey = sha256(params.event + params.customerId).toString();
// ... getConversionActionId(params.event) -> "customers/123/conversionActions/456"
body.JSON.conversionAdjustments!.forEach((_, index) => {
  set(body.JSON, `conversionAdjustments[${index}].conversionAction`, `${conversionActionId}`);
});
```

The fix is therefore a **relocation**: carry the name per adjustment in the body, and teach the
proxy to resolve many names instead of one.

## Goals

1. Events for the same Google Ads customer batch together regardless of conversion name.
2. No increase in blast radius when a conversion name cannot be resolved.
3. Safe across rolling deploys and jobsdb replay of in-flight jobs.

## Non-goals

- Moving resolution to transform time the way `google_adwords_offline_conversions` does. GAEC's
  `transformEvent` is synchronous under the batching framework and has no HTTP client.
- Changing `MAX_CONVERSION_ADJUSTMENTS_PER_BATCH`, the mapping config, or identifier
  hashing/normalisation.
- Adding a multi-name lookup to `GoogleAdsSDK` in `@rudderstack/integrations-lib` (see
  [Follow-ups](#follow-ups)).

## Design

### 1. Transform — carry the name per adjustment (feature-flagged)

In `responseBuilder` (`transform.ts`):

```ts
const conversionActionInBody = isFeatureEnabled(
  'DEST_GAEC_CONVERSION_ACTION_IN_BODY_ENABLED_WORKSPACE_IDS',
  metadata.workspaceId,
);
```

- **Flag on** — set `payload.conversionAdjustments[0].conversionActionName = event`, and build
  `params` **without** `event`.
- **Flag off** — byte-for-byte today's output.

Flag naming follows the existing `DEST_GAEC_ADJUSTMENT_TYPE_SUPPORTED_WORKSPACE_IDS`
(`transform.ts:121`); `isFeatureEnabled` accepts `ALL` or a comma-separated workspace list
(`src/util/featureFlags.ts`).

With the flag on, `params` is `{ customerId, accessToken, loginCustomerId, subAccount }` — all
destination-level — so the composite key collapses to one group per destination and the
`ChunkBatchStrategy` fills batches to 2000.

`conversionActionName` is a transformer-internal carrier. It never reaches Google; §2 step 5
guarantees that by construction.

`routerTransform.ts` needs **no code change** — `transformEvent` already passes `result.params` and
`result.body.JSON.conversionAdjustments[0]` through verbatim. Only its comment about `params` being
the grouping key needs updating.

### 2. Proxy — resolve N names, drop the unresolvable, re-expand the response

`gaecProxyRequest` (`networkHandler.ts:130`) becomes:

1. **Read names with a fallback:**
   `names[i] = adjustments[i].conversionActionName ?? params.event`.
   This fallback is the compatibility seam. It is what lets an old-shape request — flag off, flag
   rolled back, or a job replayed from jobsdb after the flag was flipped — keep working against new
   proxy code. It must survive until the cleanup ticket.

2. **Dedupe** to distinct names, preserving first-seen order.

3. **Resolve** via a new GAEC helper mirroring `google_adwords_offline_conversions/utils.js:611`:
   - Parallel cache reads keyed `sha256(name + customerId)` — **keep GAEC's existing key order**
     (GAOC uses `customerId + name`; copying it would cold-start the 24h cache on deploy).
   - On **any** miss, one `googleAds:searchStream` call for **all** distinct names:
     ```sql
     SELECT conversion_action.name,
            conversion_action.resource_name,
            conversion_action.owner_customer
     FROM conversion_action
     WHERE conversion_action.name IN (?)
     ```
     A search costs the same whether it asks for one name or twenty. `GoogleAdsSDK` only exposes
     `getConversionActionId(single)`, so this goes through `httpPOST` + `SqlString.format` exactly as
     GAOC's `batchFetchConversionActions` does.
   - Map results with owner-preferred disambiguation (port `buildOwnerPreferredMap`). This also
     fixes a latent MCC bug: today's `results.0` read can pick a parent-account action when a
     manager account returns both.
   - Cache resolved names at the existing 24h TTL. Cache **not-found** names under a sentinel with a
     short TTL (`CONVERSION_ACTION_NOT_FOUND_CACHE_TTL = 300`), using `Cache.set(key, value, ttl)`
     (`src/v0/util/cache.js:97`). Without the negative entry, a single permanently misconfigured name
     makes every batch a cache miss and forces a `searchStream` on every proxy request. The short TTL
     means a corrected dashboard name recovers within five minutes.
   - A non-2xx from `searchStream` throws `NetworkError` with `getAuthErrCategory` — whole batch,
     identical to today.

4. **Partition** indices into resolvable / unresolvable. If **none** resolve, throw
   `InstrumentationError` as today — a whole-batch abort, no worse than the single-name world.

5. **Build the outgoing payload as a projection, never an in-place mutation:**
   ```ts
   const outgoing = {
     ...body.JSON,
     partialFailure: true,
     conversionAdjustments: resolvableIndices.map((i) => {
       const { conversionActionName, ...rest } = adjustments[i];
       return { ...rest, conversionAction: resolved[names[i]] };
     }),
   };
   ```
   The projection matters twice. It guarantees `conversionActionName` never reaches Google — an
   unknown field fails the *entire* request. And it leaves `request.body.JSON.conversionAdjustments`
   untouched, which `delivery.ts:59` reads positionally to attribute results to jobs.

6. **Call** `googleAds.addConversionAdjustMent(outgoing)`.

7. **Re-expand** — only when items were dropped *and* the status is 2xx:
   - Build a `results` array of the **original** length: the sent result for kept indices, `{}` for
     dropped ones (`{}` is already how both response handlers read "this adjustment failed").
   - `partialFailureError`: keep Google's `code` when it returned a non-zero one, else `code: 3`
     (`INVALID_ARGUMENT`). Message = Google's message, if any, plus
     `Conversion action not found for: "Signup" — the conversion name in the RudderStack dashboard
     must exactly match the conversion action name in Google Ads`.

   This is the load-bearing property of the design: because `results` comes back the same length and
   order as the job list, **`delivery.ts` and `v1/networkHandler.ts` both keep working unmodified**.

   On a non-2xx, leave the response alone. The whole batch fails for everyone regardless, and dropped
   items would get the same verdict on the next attempt.

Worked example (3 jobs, `Signup` misconfigured):

```
resolve   → { Purchase: ok, Signup: NOT_FOUND, Refund: ok }
send      → [ adj0(Purchase), adj2(Refund) ]
google    → results: [ {..}, {..} ]
re-expand → results: [ {..}, {}, {..} ]
            partialFailureError: { code: 3, message: 'conversion action not found: "Signup"' }
verdicts  → job0 success, job1 abort(400), job2 success
```

### 3. Error semantics

| Situation | Today | After |
|---|---|---|
| All names resolve | K per-name batches succeed | 1 batch, per-job outcomes unchanged |
| 1 of K names unresolvable | that name's batch aborts entirely | only that name's jobs abort (400, reason names the conversion); the rest deliver |
| No name resolves | whole batch aborts | whole batch aborts (unchanged) |
| `searchStream` 4xx auth | whole batch, `authErrorCategory` set | unchanged |
| `searchStream` 5xx | whole batch retried | unchanged |
| Google `partialFailureError` | positional per-job abort | unchanged |
| Google non-2xx | whole batch per status | unchanged |

### 4. Files touched

| File | Change |
|---|---|
| `src/v0/destinations/google_adwords_enhanced_conversions/transform.ts` | flagged: name into the adjustment, `event` out of `params` |
| `src/v0/destinations/google_adwords_enhanced_conversions/networkHandler.ts` | multi-name resolution, partition, projection, re-expansion; widen the `CacheInstance` interface to cover `get(key)` and `set(key, value, ttl)` |
| `src/v0/destinations/google_adwords_enhanced_conversions/config.ts` | `CONVERSION_ACTION_NOT_FOUND_CACHE_TTL` |
| `src/v0/destinations/google_adwords_enhanced_conversions/types.ts` | `conversionActionName` on the adjustment; `event` optional in proxy `params` |
| `src/v0/destinations/google_adwords_enhanced_conversions/routerTransform.ts` | comment only |

Unchanged: `delivery.ts`, `v1/networkHandler.ts`, `getBatchStrategy`, `trackConfig.json`, `utils.ts`.

## Rollout

1. Merge with the flag **unset** — zero behaviour change; the proxy's tolerance ships and rolls out
   first. This ordering is the whole point of the flag: a new-shape request reaching an old proxy pod
   would resolve `params.event === undefined` and abort the batch.
2. Enable `DEST_GAEC_CONVERSION_ACTION_IN_BODY_ENABLED_WORKSPACE_IDS` for one low-volume workspace,
   then ramp, then `ALL`.
3. The flag is read **only on the transform path**, so the env var belongs on the router/shared
   transformer. The proxy is unconditionally tolerant, so **no delivery-transformer env is needed** —
   unlike delivery-path flags, which are silently dead unless set on the delivery transformer.
4. Rollback is unsetting the flag. In-flight new-shape jobs still deliver, because the proxy reads
   the per-item name rather than branching on the flag.
5. File a cleanup ticket at merge time. After ≥24h at `ALL` (the jobsdb TTL, so all old-shape jobs
   have aged out): drop the flag, remove `event` from `params` unconditionally, remove the
   `?? params.event` fallback, and delete the env var from rudder-devops.

## Testing

**Unit — `networkHandler.test.ts`**
- Distinct-name dedup; one `searchStream` for K names; warm cache issues zero calls.
- Negative cache: a not-found name does not trigger a second `searchStream` within the TTL.
- Partition + re-expansion places `{}` at exactly the dropped original indices.
- All names unresolvable → `InstrumentationError`.
- `searchStream` non-2xx → `NetworkError` carrying the auth category.
- Old-shape request (`params.event`, no per-item name) resolves and delivers.
- The posted payload contains no `conversionActionName`, and `request.body.JSON` is not mutated.

**Unit — `routerTransform.test.ts` / `test/integrations/.../router/batching-data.ts`**
- Flag on: 3 events across 3 conversion names, same customer → **one** batched request with 3
  adjustments, each carrying its own name.
- Flag off: 3 separate requests (regression guard on the compatibility path).

**Component — `processor/data.ts`**: fixtures for both flag states.

**Component — `dataDelivery/business.ts`**: a mixed batch where one name resolves and one does not →
per-job 200/400 in the `DeliveryV1Response`.

**Live — `live/spec.ts`**: the test account already has two hardcoded conversion action names in
`live/profiles.ts` (`Purchase`, `Page view`). Send one event of each and assert they land in a single
`uploadConversionAdjustments` call and both succeed.

## Risks

- **Larger batches.** Up to 2000 adjustments where traffic was previously split by name, so one slow
  or retryable request now affects more jobs. Partial-failure attribution is already positional, so
  the framework re-attributes rather than blind-retrying. GAEC delivers through the framework/v1
  path, which bypasses the v0→v1 response-cloning layer, so the response-size blow-up seen on
  FB_CUSTOM_AUDIENCE does not apply here.
- **Shared failure reason.** Every dropped item gets one message listing all unresolved names, because
  `delivery.ts` maps a single `reason` across failed positions. Acceptable; refining it means teaching
  the delivery spec to take per-index reasons.
- **`accessToken` and the `Authorization` header remain in the composite key.** During a token
  refresh, events can still split into two groups. Pre-existing and out of scope.
- **Cold-cache cost is unchanged or better**: one `searchStream` per (customer, name-set) instead of
  one per name.

## Success metrics

- `output_batch_size` histogram for `GOOGLE_ADWORDS_ENHANCED_CONVERSIONS` rises after the ramp.
- Proxy request count to `uploadConversionAdjustments` falls for the same event volume.
- No rise in aborted GAEC events across the ramp.

## Follow-ups

- Add a multi-name conversion-action lookup to `GoogleAdsSDK` in `@rudderstack/integrations-lib` so
  GAEC and GAOC share one implementation instead of two copies of the same GAQL query.
- Flag cleanup ticket (see Rollout step 5).
