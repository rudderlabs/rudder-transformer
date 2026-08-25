# Sprig Destination

Implementation in **CDK v2 (YAML)**

## Overview

The RudderStack Sprig destination sends user profile updates and user events to Sprig's Data Import API. The event-stream transformer is a CDK v2 processor workflow in `procWorkflow.yaml` and converts each supported RudderStack event into a single `POST https://api.sprig.com/v2/users` request.

The destination also supports regulation/user deletion through the v0 deletion handler at `src/v0/destinations/sprig/deleteUsers.js`, which calls Sprig's purge API.

All Sprig API traffic is HTTPS-only; plain HTTP requests are rejected. The API key itself selects the Sprig environment (production or development), so no separate environment parameter is sent by the transformer.

## Configuration

Configuration is defined in `rudder-integrations-config/src/configurations/destinations/sprig/`.

### Required settings

| Setting         | Required for                 | Description                                                                                                                                                                                                                                                                                                                     |
| --------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiKey`        | Cloud mode and user deletion | Sprig Public API Key. In the Sprig dashboard, find it under **Integrations** > **Data Import API**; the current RudderStack UI copy also references **Integrations** > **Enrichment** > **Data Import API**. The cloud transformer reads this as `destination.Config.apiKey` and sends it as `Authorization: API-Key <apiKey>`. |
| `environmentId` | Device mode                  | Sprig Environment ID. In the Sprig dashboard, find it under **Integrations** > **Installation** > **JavaScript**. This is used by native/device SDK setup; the cloud transformer does not read it.                                                                                                                              |

### Optional settings

| Setting                    | Description                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| `eventFilteringOption`     | Client-side event filtering mode: `disable`, `whitelistedEvents`, or `blacklistedEvents`.           |
| `whitelistedEvents`        | Event allowlist used when `eventFilteringOption` is `whitelistedEvents`.                            |
| `blacklistedEvents`        | Event denylist used when `eventFilteringOption` is `blacklistedEvents`.                             |
| `consentManagement`        | Consent filtering configuration for supported providers (`custom`, `iubenda`, `ketch`, `oneTrust`). |
| `oneTrustCookieCategories` | OneTrust consent category IDs for consent filtering.                                                |
| `ketchConsentPurposes`     | Ketch consent purposes for consent filtering.                                                       |

## Integration Functionalities

### Implementation details

- **Implementation:** CDK v2 workflow (`src/cdk/v2/destinations/sprig/procWorkflow.yaml`)
- **CDK v2 status:** Enabled (`cdkV2Enabled: true`)
- **Transform stage:** Processor (`transformAtV1: "processor"`)
- **Destination type:** Processor destination, not router destination
- **Primary API endpoint:** `POST https://api.sprig.com/v2/users`
- **API authentication:** API key (`Authorization: API-Key <apiKey>`)
- **Success response:** Sprig returns `202 Accepted` for `POST /v2/users`. Ingestion is asynchronous, so a `202` confirms acceptance, not that the user or event is already queryable in Sprig.

### Connection modes

- **Cloud mode:** Supported for `android`, `androidKotlin`, `ios`, `iosSwift`, `web`, `unity`, `amp`, `cloud`, `warehouse`, `reactnative`, `flutter`, `cordova`, and `shopify` sources.
- **Device mode:** Supported for `web`, `android`, `androidKotlin`, `ios`, `iosSwift`, and `reactnative` sources.

### Supported message types

| Message type | Cloud mode    | Device mode   | Notes                                              |
| ------------ | ------------- | ------------- | -------------------------------------------------- |
| Identify     | Supported     | Supported     | Sends user profile attributes to Sprig.            |
| Track        | Supported     | Supported     | Sends one event entry in the Sprig `events` array. |
| Page         | Not supported | Not supported | Rejected by the cloud transformer.                 |
| Screen       | Not supported | Not supported | Rejected by the cloud transformer.                 |
| Group        | Not supported | Not supported | Rejected by the cloud transformer.                 |
| Alias        | Not supported | Not supported | Rejected by the cloud transformer.                 |

### Batching support

- **Event-stream batching:** Not supported, and not supportable with the current Sprig API. Sprig's documentation for `POST /v2/users` states that users must be upserted individually, so there is no multi-user bulk ingestion endpoint to batch into. Each Identify or Track input event produces one output request to `POST /v2/users`.
- **Historical events per request:** The `events` array on `POST /v2/users` does allow multiple event objects for a single user in one call. The current workflow always emits exactly one element, so this capability is unused.
- **User deletion batching:** Supported in the deletion handler. User IDs are split into batches of 100 before calling `POST /v2/purge/visitors`. This batch size is not an arbitrary RudderStack choice — Sprig documents the purge endpoint as _"limited to 100 visitor deletions per request"_, so 100 is the API-enforced maximum.

### Intermediate calls

No intermediate API calls are made for Identify or Track events. The processor workflow validates the input, builds the Sprig payload, and returns one delivery request.

### Proxy delivery

Proxy delivery is not supported for Sprig in this repository. There is no Sprig `networkHandler` implementation; event-stream delivery uses the default RudderStack delivery flow for the processor output.

### User deletion

- **Supported:** Yes
- **Source code path:** `src/v0/destinations/sprig/deleteUsers.js`
- **Endpoint:** `POST https://api.sprig.com/v2/purge/visitors`
- **Batch size:** 100 user IDs per request — the maximum Sprig permits for this endpoint
- **Authentication:** `Authorization: API-Key <apiKey>`
- **Identifier used:** Only `userIds`. Sprig's purge endpoint also accepts `emails` and `visitorIds` arrays, and requires at least one identifier array to be non-empty; RudderStack always populates `userIds` from the regulation request's `userAttributes`.
- **Deletion delay:** Sprig does not purge immediately. The documented default is a **10-day** processing delay, adjustable with the optional `delaySeconds` request field. RudderStack does not send `delaySeconds`, so Sprig's default delay applies to every deletion RudderStack submits.
- **Success response:** `200 OK` with a `{ "requestId": "<id>" }` body. The `requestId` identifies the async purge job; RudderStack does not persist or poll it.
- **Special handling:** HTTP 400 is treated as non-fatal because Sprig can return 400 when none of the requested users are present for deletion. Other non-2xx statuses are returned as network failures.

Documented status codes for `POST /v2/purge/visitors`:

| Status | Meaning                         | RudderStack behavior                                                                       |
| ------ | ------------------------------- | ------------------------------------------------------------------------------------------ |
| `200`  | Purge request accepted          | Returns `{ statusCode: 200, status: 'successful' }`.                                       |
| `400`  | Bad request / no matching users | Treated as non-fatal; deletion reported as successful.                                     |
| `403`  | Missing or invalid API key      | Throws `NetworkError('User deletion request failed')`.                                     |
| `404`  | Not found                       | Throws `NetworkError('User deletion request failed')`.                                     |
| `429`  | Rate limited                    | Throws `NetworkError('User deletion request failed')`; retryable per error classification. |
| `500`  | Sprig-side server error         | Throws `NetworkError('User deletion request failed')`; retryable per error classification. |

> **Note on the purge auth header:** Sprig's reference page for the purge endpoint shows `Authorization: Bearer YOUR_API_KEY`, whereas the API overview specifies `API-Key YOUR_API_KEY` for all v2 endpoints. The RudderStack handler sends `API-Key`, consistent with the overview and with the `/v2/users` endpoint, and this is exercised by the deletion component tests. Treat the `Bearer` mention in Sprig's docs as an inconsistency in their reference page.

### OAuth support

OAuth is not supported. Sprig uses API key authentication.

### Multiplexing

Sprig does not multiplex event-stream requests. Each supported RudderStack event maps to one Sprig API request. User deletion may issue multiple requests only when the regulation request contains more than 100 user IDs.

## Validations and Requirements

The CDK v2 processor validates the following fields before building a request:

| Scope            | Requirement                                              | Error text                              |
| ---------------- | -------------------------------------------------------- | --------------------------------------- |
| All events       | `message.type` must be present                           | `message Type is not present. Aborting` |
| All events       | `message.type` must be `identify` or `track`             | `message type <type> is not supported`  |
| Cloud processing | `destination.Config.apiKey` must be present              | `API Key is not present. Aborting`      |
| Identify         | `userId` must resolve from the generic userId-only paths | `userId is required`                    |
| Track            | `userId` must resolve from the generic userId-only paths | `userId is required`                    |
| Track            | `message.event` must be present and non-empty            | `event name is required`                |

For user deletion, `apiKey` is required and missing configuration raises `Api Key is required for user deletion`.

Fields the transformer does **not** validate, but Sprig does:

- `emailAddress` must be a valid email address. RudderStack forwards whatever the generic email lookup resolves without format checking, so a malformed value is rejected at delivery time with `400`.
- `attributes` must not exceed 100 values, and `events[].event` must name an event already tracked in Sprig. See [API Constraints](#api-constraints).

## API Details

### Endpoints used

| Purpose                     | Method | Endpoint                                  | Auth header                       | Success status |
| --------------------------- | ------ | ----------------------------------------- | --------------------------------- | -------------- |
| Upsert user / ingest events | `POST` | `https://api.sprig.com/v2/users`          | `Authorization: API-Key <apiKey>` | `202 Accepted` |
| Purge visitors (deletion)   | `POST` | `https://api.sprig.com/v2/purge/visitors` | `Authorization: API-Key <apiKey>` | `200 OK`       |

### `POST /v2/users` request schema

| Field                | Type    | Required              | Sent by RudderStack | Notes                                                                   |
| -------------------- | ------- | --------------------- | ------------------- | ----------------------------------------------------------------------- |
| `userId`             | string  | Yes                   | Always              | Existing or desired visitor identifier.                                 |
| `emailAddress`       | string  | No                    | When resolvable     | Must be a valid email address.                                          |
| `attributes`         | object  | No                    | Identify only       | Key-value pairs, limited to 100 values total.                           |
| `events`             | array   | No                    | Track only          | Historical event records; RudderStack always sends exactly one element. |
| `events[].event`     | string  | Yes (within `events`) | Track only          | Must be an event name already tracked in Sprig.                         |
| `events[].timestamp` | integer | Yes (within `events`) | Track only          | Unix timestamp in **milliseconds**, produced by `toMilliseconds`.       |

Sprig endpoints not used by this integration: `GET /v2/users/{userId}` (retrieve a user), and the v1 Export API endpoints for responses, surveys, and themes (`GET /v1/responses`, `GET /v1/surveys`, `GET /v1/themes`), which authenticate with `Authorization: Bearer <apiKey>` rather than `API-Key`.

## Error Handling

### Transform-stage errors

Validation failures return per-event processor responses with `statusCode: 400` and stat tags carrying `errorCategory: dataValidation`, `errorType: instrumentation`, `destType: SPRIG`, and `implementation: cdkV2`. See [Validations and Requirements](#validations-and-requirements) for the full list.

### Delivery-stage errors for `POST /v2/users`

| Status | Sprig meaning                                                    | Typical cause in this integration                                                     |
| ------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `202`  | Accepted (async)                                                 | Normal success. Data is queued, not necessarily visible in Sprig yet.                 |
| `400`  | Bad Request; body contains a JSON `error` string                 | Invalid `emailAddress` format, attribute cap exceeded, or an unrecognised event name. |
| `422`  | Unprocessable Entity (no documented body)                        | Payload is well-formed JSON but semantically rejected.                                |
| `429`  | Rate limited                                                     | Account-level QPS ceiling exceeded. Retried by the default delivery flow.             |
| `500`  | _"Something went wrong on Sprig's side. These are very rare :)"_ | Transient Sprig outage. Retried by the default delivery flow.                         |

Because there is no Sprig `networkHandler`, these statuses are classified by the default RudderStack delivery behavior; the `error` string in a `400` body is surfaced in the delivery response rather than being reshaped into a Sprig-specific message.

## API Constraints

These are limits enforced by Sprig, not by RudderStack. The transformer does not validate against them, so exceeding one surfaces as a delivery error rather than a transform error.

| Constraint                  | Limit                                          | Impact on the RudderStack integration                                                                                                                                                                                              |
| --------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Attributes per user         | _"Attributes limited to total of 100 values"_  | The workflow forwards the entire `message.context.traits` object as `attributes` without trimming. A source sending more than 100 traits will breach this cap; trim traits at the source or with a user transformation.            |
| Event name registration     | Event must already be tracked in Sprig         | `events[].event` must be _"Name of event already being tracked in Sprig"_. New code events require approval in the Sprig app before they appear in the Events table, so Track calls for unregistered event names may be discarded. |
| Users upserted individually | One user per `POST /v2/users` call             | No bulk ingestion endpoint exists, which is why event-stream batching is not implemented.                                                                                                                                          |
| Purge batch size            | 100 visitor deletions per request              | `deleteUsers.js` chunks user IDs at exactly 100 to comply.                                                                                                                                                                         |
| Purge delay                 | 10 days by default, tunable via `delaySeconds` | RudderStack omits `delaySeconds`, so Sprig's default delay applies.                                                                                                                                                                |
| Transport                   | HTTPS only                                     | Plain HTTP requests are rejected by Sprig.                                                                                                                                                                                         |
| Request size                | No documented byte limit                       | Sprig documents that requests too large to process in a reasonable time fail with a timeout error.                                                                                                                                 |

Historical events sent through the `events` array are recorded for reporting and targeting only — Sprig documents that they do **not** trigger studies the way SDK-tracked events do. Cloud-mode Track events therefore cannot be used to launch surveys in real time; use the device-mode SDK for study triggering.

## Rate Limits

Sprig publishes account-level rate limits in its API overview rather than per-endpoint limits:

| Plan                  | Documented limit                                                                      |
| --------------------- | ------------------------------------------------------------------------------------- |
| Enterprise            | 1,000 queries per second                                                              |
| Starter / other plans | API access granted on request; contact support@sprig.com for access and higher limits |

Neither `POST /v2/users` nor `POST /v2/purge/visitors` documents a limit distinct from the account-level ceiling above.

Implications for this integration:

- RudderStack sends event-stream requests one event at a time (no batching), so the request rate to `POST /v2/users` scales linearly with source event volume. High-volume sources on non-Enterprise plans are the most likely to hit the ceiling.
- `429 Too Many Requests` responses on event-stream delivery are surfaced and retried according to the normal delivery behavior for processor destinations; there is no Sprig-specific `networkHandler` overriding this.
- For deletion requests, RudderStack batches at most 100 user IDs per `POST /v2/purge/visitors` call, which is Sprig's documented per-request maximum.

Reference: [Sprig API overview](https://docs.sprig.com/reference/sprig-api/overview).

## General Queries

### Event ordering

- **Identify:** Ordering is recommended. Sprig imposes no hard constraint — an out-of-order Identify is accepted normally, with no error or rejection. It matters for data accuracy instead: the payload carries `userId`, `emailAddress`, and `attributes` only, with no timestamp mapped, so Sprig applies profile upserts in arrival order (last write wins) and has no basis to discard a stale update. Where traits change over time, out-of-order delivery can leave older values overwriting newer ones until the next Identify corrects them.
- **Track:** Ordering is not required. Each event carries its own millisecond `timestamp`, and events are appended rather than overwritten, so a late-arriving event still lands at the correct position on the user's timeline.

### Data replay feasibility

- **Missing data replay:** Feasible. Replay Identify events in chronological order, since the payload has no timestamp and Sprig applies upserts in arrival order. Track replay is safe for backfill: events are self-dated and appended, and Data Import API events do not trigger studies, so a replay cannot fire surveys retroactively.
- **Already-delivered replay:** Use caution. The current transformer does not send a RudderStack event ID or any explicit deduplication key to Sprig. Replaying already delivered Track events can create duplicates, and replaying Identify events can overwrite current attributes with older values.

### Rate limits and batch sizes

- Event-stream Identify and Track requests are not batched, because Sprig requires users to be upserted individually.
- User deletion requests are batched by 100 user IDs, which is Sprig's documented per-request maximum for the purge endpoint.
- Sprig documents an account-level limit of 1,000 queries per second on the Enterprise plan; other plans must request API access from support@sprig.com. No separate per-endpoint limit is published.

### Multiplexing

No event-stream multiplexing is implemented. Identify and Track each generate exactly one request to `POST /v2/users`.

## Version Information

- **Sprig API version used:** v2
- **Endpoints used:**
  - Event ingestion/profile update: `POST https://api.sprig.com/v2/users`
  - User deletion: `POST https://api.sprig.com/v2/purge/visitors`
- **Other Sprig API versions:** Sprig also exposes a v1 Export API (`GET /v1/responses`, `GET /v1/surveys`, `GET /v1/themes`) which uses `Authorization: Bearer <apiKey>` instead of `API-Key`. This integration does not use v1 at all, so the difference in auth scheme is not relevant to the transformer.
- **Deprecation status:** No public deprecation or end-of-life notice for these Sprig v2 endpoints was identified in the referenced public API docs. The v1 endpoints remain documented alongside v2 and are not marked deprecated.
- **Documentation reference:** [Sprig API overview](https://docs.sprig.com/reference/sprig-api/overview)

## Testing

Relevant test data and mocks:

- Processor component tests: `test/integrations/destinations/sprig/processor/data.ts`
- User deletion component tests: `test/integrations/destinations/sprig/deleteUsers/data.ts`
- Network mocks for deletion: `test/integrations/destinations/sprig/network.ts`

Verified repository commands:

```bash
npm run lint
npm run test:ts -- component --destination=sprig
```

There are no Sprig-specific co-located unit test files under `src/cdk/v2/destinations/sprig/` or `src/v0/destinations/sprig/` at the time of writing.

## Additional Documentation

- [Business logic and field mappings](./docs/businesslogic.md)
- [RETL support](./docs/retl.md)

## Troubleshooting

### Events are delivered successfully but do not appear in Sprig

`POST /v2/users` returns `202 Accepted` and processes asynchronously, so a successful RudderStack delivery only confirms that Sprig queued the payload. If data is still missing after ingestion completes, check that the Track event name is already registered and approved in the Sprig app — Sprig requires `events[].event` to name an event it already tracks, and new code events need approval before they appear in the Events table.

### Some user traits are missing in Sprig

Sprig caps a user at 100 attribute values. The workflow forwards `message.context.traits` wholesale without trimming, so a source sending a wider trait object exceeds the cap. Reduce the trait set at the source or with a user transformation.

### Track event properties are not showing up

This is expected. The current workflow maps only the event name and timestamp into `events[0]`; `message.properties` is not mapped into the Sprig payload at all. Anything needed for targeting must be sent as Identify traits instead.

### Identify calls fail with `userId is required`

Sprig requires a durable user identifier, and the workflow resolves it through the `userIdOnly` generic paths only — `anonymousId` is deliberately excluded. Anonymous-only Identify calls therefore fail validation at the transform stage. Send a `userId`, or use device mode where the Sprig SDK manages visitor identity itself.

### Deletion returns success but the user is still in Sprig

Sprig's purge endpoint applies a default 10-day processing delay before data is removed, and RudderStack does not override it with `delaySeconds`. A `200` response with a `requestId` means the purge job was accepted, not that it has run.

### Delivery fails with `403`

The API key is missing or invalid for the target Sprig environment. Note that the API key itself determines whether the request hits the production or development environment, so a development key will not write to production data.

## FAQ

**Which Sprig API key does the cloud destination need?**
The Public API Key from the Sprig dashboard under **Integrations** > **Data Import API**. `environmentId` is a device-mode-only setting and is never read by the cloud transformer.

**Why is there no batching for Identify and Track?**
Sprig's `POST /v2/users` documentation states that users must be upserted individually — there is no bulk endpoint to batch into. The `events` array does allow several events for a single user in one request, but the current workflow does not group multiple Track calls into it.

**Can cloud-mode Track events trigger a Sprig survey?**
No. Sprig documents that events sent through the Data Import API are recorded for reporting and targeting but do not trigger studies the way SDK-tracked events do. Use device mode for real-time study triggering.

**Are Page, Screen, Group, and Alias supported?**
No. The workflow rejects any message type other than `identify` and `track` with `message type <type> is not supported`.

**Does Sprig support OAuth?**
No. Authentication is API key only, sent as `Authorization: API-Key <apiKey>`.

**Is RETL supported?**
Yes, through warehouse sources in cloud mode with the JSON Mapper. VDM V1 and VDM V2 are not supported — see [RETL support](./docs/retl.md).

**Can already-delivered events be safely replayed?**
Use caution. The transformer sends no RudderStack event ID or deduplication key, so replayed Track events can create duplicates and replayed Identify events can overwrite newer attributes with older ones.
