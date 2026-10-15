# Pushwoosh Destination

Implementation in **TypeScript** on the batching framework (`DestinationIntegration`, NOT a CDK v2 implementation).

## Overview

Pushwoosh is a customer engagement platform (push, in-app, email, SMS, Customer Journeys). The RudderStack Pushwoosh destination sends `track` events to Pushwoosh as custom events and `identify` traits as user-specific tags, so they can drive segmentation and Customer Journey triggers. Pushwoosh matches everything by **User ID**: the Pushwoosh SDK in the customer's app must call `setUserId` with the same value RudderStack sends as `userId`.

## Version Information

- **Events**: Pushwoosh integration events endpoint (`/integration-segment/v1/post-events`), unversioned beyond `v1`
- **Tags**: Pushwoosh legacy JSON API `1.3` (`/json/1.3/setTags`)

## Configuration

### Required Settings

- **Application Code** (`appCode`): the Pushwoosh application (project) code, format `XXXXX-XXXXX` (`^[A-Z0-9]{5}-[A-Z0-9]{5}$`). Found in Pushwoosh Control Panel next to the project name.
- **API Token** (`apiToken`): a Pushwoosh API token with Device API access, generated in Control Panel → Settings → API Access. 20–100 alphanumeric characters; stored as a secret (`secretKeys: ["apiToken"]`).

Both are validated as non-empty strings by the transformer's Zod schema (`types.ts`); an empty value fails the event as a configuration error.

### Optional Settings

None beyond the platform-standard `connectionMode` and `consentManagement`, which the transformer does not read.

## Integration Functionalities

> Integration type: **Cloud mode only**
> Transform mode: **Router** (`transformAtV1: "router"`); there is no processor transform.

### Supported Message Types

| Message type | Pushwoosh API                                                                                   | Batched                                  |
| ------------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `track`      | `POST https://integration-rudderstack.svc-nue.pushwoosh.com/integration-segment/v1/post-events` | Yes, up to 100 events / 10MB per request |
| `identify`   | `POST https://api.pushwoosh.com/json/1.3/setTags`                                               | No, one user per request                 |

Any other message type (`page`, `screen`, `group`, `alias`, `record`, …) is rejected by the input schema with HTTP 400 (`message.type: Invalid enum value. Expected 'track' | 'identify'`).

#### Message Type and Connection Modes from `db-config.json`

- **Supported source types**: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, warehouse, reactnative, flutter, cordova, shopify
- **Supported message types (cloud)**: `identify`, `track`
- **Connection mode**: `cloud` for every source type

### Data Center / Region

The endpoints are hard-coded to Pushwoosh's EU (NUE) data center. Accounts hosted in another Pushwoosh region get `400 application not found` (post-events) or `status_code 210 application code is not valid` (setTags), which the transformer aborts. A region setting is planned before the destination leaves beta.

### Rate Limits

- **post-events**: no per-account rate limit. Capacity is about 150 in-flight requests per pod × 2 pods; beyond that the ingress answers `429`, which the framework reports as throttled so rudder-server backs off. The ingress body limit is 100MB; the transformer caps batches at 10MB.
- **setTags**: **NEEDS REVIEW** — rate limit for `/json/1.3/setTags` not verified against the Pushwoosh API reference.

### Batching Support

- **`track`**: batched with `ChunkBatchStrategy` — `MAX_BATCH_SIZE = 100` events and `MAX_PAYLOAD_SIZE = '10MB'` per request (`config.ts`). The body is `{ "events": [ ... ] }`. 100 matches what Pushwoosh's own Segment destination sends to the same endpoint.
- **`identify`**: not batched (`maxItems: 1`); setTags addresses one user per request.

Events with different endpoints or headers never share a request (framework grouping key).

### Intermediate Calls

None. Each event becomes exactly one request; no lookups are made at transform or delivery time.

### Proxy Delivery

**Supported**, framework-native: the destination is registered `{ routerTransform: true, batching: true }` in `src/features.ts`, which also advertises `transformerProxy`. There is no `networkHandler.ts`; response handling is declared in `src/v0/destinations/pushwoosh/delivery.ts`:

- HTTP 2xx → success, **except** an HTTP 200 whose legacy JSON body carries `status_code` ≠ 200 (setTags): `status_code` ≥ 500 → retry, otherwise abort.
- HTTP 400 with the post-events decode-failure body (`{"action":"post event","status":"failure",...}`) → retry with `dontBatch`, so the batch is re-sent one event at a time and only the malformed event finally aborts.
- Other 400 (`missing api token`, `missing application code`, `application not found`, setTags `status_code 210`) → abort.
- 401 (`unauthorized`, token does not match the app code) → abort; no OAuth refresh is requested.
- 429 → throttled; 5xx → retry.

#### Partial batching response handling

Not applicable: post-events answers the whole batch with an empty HTTP 200 and does not report per-event results. Events it cannot store are swallowed server-side.

### User Deletion

**Not supported** — there is no `deleteUsers` implementation for this destination.

### OAuth Support

**Not supported** — authentication is a static API token (`Authorization: Token <apiToken>`); no `auth.type` in `db-config.json`.

### Additional Functionalities

- **Device platform detection** (`track`): `device_platform` is `android` when `context.device.type` or `context.os.name` is in the Android family, `ios` when either is in the Apple family (`ios`, `ipados`, `watchos`, `tvos` via the shared `isAppleFamily` helper), otherwise `web`. Pushwoosh accepts only these three values.
- **Value sanitising** (attributes and tags): `null`/`undefined` values are dropped, nested objects are sent as JSON strings, arrays are kept with object elements JSON-stringified.
- **Identity/PII trait exclusion** (`identify`): `userId`, `id`, `anonymousId`, `email`, `phone`, `firstName`, `lastName`, `name`, `address` are never sent as tags.

### Validations

- `userId` is required for every event (`Missing required value from "userId"`); anonymous events cannot be attributed in Pushwoosh.
- `track`: `event` is required; `timestamp`/`originalTimestamp`, when present, must parse as a date (it is sent as RFC 3339 / ISO 8601).
- `identify`: at least one trait must remain after exclusions (`No traits left to send as Pushwoosh tags`).

All of these fail only the offending event (HTTP 400, instrumentation error); the rest of the batch is delivered. See [businesslogic.md](docs/businesslogic.md#validations).

## General Queries

### Event Ordering

#### Identify

**Ordering matters.** setTags overwrites the current tag value, so an older identify delivered after a newer one leaves the stale value in Pushwoosh. No timestamp is sent with setTags, so Pushwoosh cannot resolve the order itself.

#### Track

**Ordering is not required.** Each event carries its own `timestamp`, and Pushwoosh stores events in its event history keyed by user and time. **NEEDS REVIEW**: whether Customer Journey triggers fire on late-arriving (out-of-order or old) events.

### Data Replay Feasibility

#### Missing Data Replay

- **Track**: feasible — events carry their original timestamp. **NEEDS REVIEW**: Pushwoosh-side limits on how old an accepted event timestamp may be.
- **Identify**: feasible only if replayed in order and not older than data already delivered (overwrite semantics).

#### Already Delivered Data Replay

- **Track**: **not safe** — post-events has no event id / deduplication key, so a replay creates duplicate events (and may re-trigger journeys).
- **Identify**: safe — re-setting the same tag values is idempotent.

### Multiplexing

**No.** Each input event produces exactly one Pushwoosh payload (one item in a post-events batch, or one setTags request).

## Version Information

### Current Version

- post-events: `v1` of the Pushwoosh integration events API.
- setTags: Pushwoosh JSON API `1.3`.

### API Endpoints

- `https://integration-rudderstack.svc-nue.pushwoosh.com/integration-segment/v1/post-events`
- `https://api.pushwoosh.com/json/1.3/setTags`

### Version Deprecation

**NEEDS REVIEW** — end-of-life dates for JSON API 1.3 and the integration events endpoint, and whether a newer `setTags` version exists, were not verified against the Pushwoosh API reference.

## Documentation Links

### API Documentation

- [Pushwoosh API reference](https://docs.pushwoosh.com/developer/api-reference/)

### RETL Functionality

See [retl.md](docs/retl.md).

### Business Logic and Mappings

See [businesslogic.md](docs/businesslogic.md).

## FAQ

### Why do identify events report success but no tags appear in Pushwoosh?

setTags by `userId` only lands on a user that already has a device registered through the Pushwoosh SDK with `setUserId(<same userId>)`. Pushwoosh also writes only **user-specific** tags: new tag names are auto-created as user-specific, but a pre-existing tag with the same name that is **not** user-specific is silently skipped. Neither case returns an error.

### Does a wrong API token fail identify events?

No. setTags does not check the API token, so identify events are delivered even with a wrong token. Track events fail with `401 unauthorized`, which is the signal to check the token.
