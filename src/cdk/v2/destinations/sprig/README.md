# Sprig Destination

Implementation in **CDK v2 (YAML)**

## Overview

The RudderStack Sprig destination sends user profile updates and user events to Sprig's Data Import API. The event-stream transformer is a CDK v2 processor workflow in `procWorkflow.yaml` and converts each supported RudderStack event into a single `POST https://api.sprig.com/v2/users` request.

The destination also supports regulation/user deletion through the v0 deletion handler at `src/v0/destinations/sprig/deleteUsers.js`, which calls Sprig's purge API.

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

- **Event-stream batching:** Not supported. Each Identify or Track input event produces one output request to `POST /v2/users`.
- **User deletion batching:** Supported in the deletion handler. User IDs are split into batches of 100 before calling `POST /v2/purge/visitors`.

### Intermediate calls

No intermediate API calls are made for Identify or Track events. The processor workflow validates the input, builds the Sprig payload, and returns one delivery request.

### Proxy delivery

Proxy delivery is not supported for Sprig in this repository. There is no Sprig `networkHandler` implementation; event-stream delivery uses the default RudderStack delivery flow for the processor output.

### User deletion

- **Supported:** Yes
- **Source code path:** `src/v0/destinations/sprig/deleteUsers.js`
- **Endpoint:** `POST https://api.sprig.com/v2/purge/visitors`
- **Batch size:** 100 user IDs per request
- **Authentication:** `Authorization: API-Key <apiKey>`
- **Special handling:** HTTP 400 is treated as non-fatal because Sprig can return 400 when none of the requested users are present for deletion. Other non-2xx statuses are returned as network failures.

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

## Rate Limits

Sprig does not publish endpoint-specific rate limits for `POST /v2/users` or `POST /v2/purge/visitors` in the referenced public API docs. RudderStack sends event-stream requests one event at a time and surfaces/retries `429 Too Many Requests` responses according to the normal delivery behavior for processor destinations.

For deletion requests, RudderStack batches at most 100 user IDs per `POST /v2/purge/visitors` call, based on the implementation in `deleteUsers.js`.

Reference: [Sprig API overview](https://docs.sprig.com/reference/sprig-api/overview).

## General Queries

### Event ordering

- **Identify:** Ordering is recommended. Identify updates user/profile attributes in Sprig, so out-of-order delivery can cause older traits to overwrite newer traits.
- **Track:** Track requests include a timestamped event object. Ordering is less strict than Identify for discrete events, but preserving source order is still recommended when downstream surveys, segments, or campaigns depend on the sequence of user actions.

### Data replay feasibility

- **Missing data replay:** Feasible with caution. Replay Identify events in chronological order to avoid stale profile attributes. Track replay can backfill missing events, but validate downstream campaign or survey side effects before large replays.
- **Already-delivered replay:** Use caution. The current transformer does not send a RudderStack event ID or any explicit deduplication key to Sprig. Replaying already delivered Track events can create duplicates, and replaying Identify events can overwrite current attributes with older values.

### Rate limits and batch sizes

- Event-stream Identify and Track requests are not batched.
- User deletion requests are batched by 100 user IDs.
- Endpoint-specific Sprig rate limits are not publicly documented in the referenced API overview.

### Multiplexing

No event-stream multiplexing is implemented. Identify and Track each generate exactly one request to `POST /v2/users`.

## Version Information

- **Sprig API version used:** v2
- **Endpoints used:**
  - Event ingestion/profile update: `POST https://api.sprig.com/v2/users`
  - User deletion: `POST https://api.sprig.com/v2/purge/visitors`
- **Deprecation status:** No public deprecation or end-of-life notice for these Sprig v2 endpoints was identified in the referenced public API docs.
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

## FAQ

No frequently asked questions have been documented yet.
