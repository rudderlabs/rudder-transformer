# June Destination

Implementation in **JavaScript**

> **Partner status — NEEDS REVIEW**: June announced on August 8, 2025 that its team was joining Amplitude and that the June product would be retired ([june.so](https://www.june.so)). Confirm whether `api.june.so` still accepts traffic and whether this destination should be deprecated in RudderStack.

## Configuration

### Required Settings

- **API Key** (`apiKey`): June workspace write key. Sent as `Authorization: Basic <apiKey>` (the key is sent as-is, not base64-encoded by the transformer).

### Optional Settings

- **Event Filtering** (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`): allowlist/denylist of track event names. Applied by rudder-server, not in transformer code.
- **Consent management** (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`): applied by rudder-server / SDKs.
- **Use device mode** (`useNativeSDK.web`): web device mode via the June JS SDK (not handled by the transformer).

Only `apiKey` is read from `destination.Config` in transformer code.

## Integration Functionalities

> June supports **Cloud mode** for all sources and **Device mode** for Web.

### Implementation

- **Implemented in**: JavaScript (v0), `src/v0/destinations/june/`
- **CDK v2 Enabled**: No
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`). A `processRouterDest` wrapper (`simpleProcessRouterDest`) exists, but `JUNE` has no `routerTransform` entry in `src/features.ts`.

### Supported Message Types

| Message type | Endpoint                                |
| ------------ | --------------------------------------- |
| Identify     | `POST https://api.june.so/api/identify` |
| Track        | `POST https://api.june.so/api/track`    |
| Page         | `POST https://api.june.so/api/page`     |
| Group        | `POST https://api.june.so/api/group`    |

### Batching Support

- **Supported**: No. One request per event.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`).

### User Deletion

- **Supported**: No (no `deleteUsers.js`).

### OAuth Support

- **Supported**: No. API key (Basic auth header).

### Additional Functionalities

- **Group association on track**: if `context.externalId` has type `juneGroupId`, or `properties.groupId` is set, it is sent as `context.groupId` on the track payload so June attributes the event to a company. `groupId` is stripped from `properties`.
- **Context trimming**: `context.page`, `context.traits`, `context.sessionId`, `context.sessionStart` and `context.consentManagement` are dropped from the forwarded `context`. Empty `context` is removed.

### Validations

| Event    | Required                                                                 |
| -------- | ------------------------------------------------------------------------ |
| All      | `message.type`                                                           |
| Identify | `userId` (from `userId`, `traits.userId`, `traits.id`, ...), `timestamp` |
| Track    | `userId`, `event`, `timestamp`                                           |
| Page     | `properties`                                                             |
| Group    | `groupId`, `timestamp`                                                   |

Anonymous-only identify and track events (no `userId`) fail with an instrumentation error, even though `anonymousId` is mapped when present.

### Rate Limits

NEEDS REVIEW: no published rate limits found for the June HTTP API.

## General Queries

### Event Ordering

- **Identify / Group**: ordering recommended. They set user and company traits; replaying an older event after a newer one can overwrite traits with stale values. NEEDS REVIEW: unknown whether June resolves trait conflicts by `timestamp`.
- **Track / Page**: carry a `timestamp`, so ordering is less critical for analytics.

### Data Replay Feasibility

- **Missing data**: track and page events can be replayed with their original `timestamp`. Identify/group replay can overwrite newer traits.
- **Already delivered data**: not safe. No message ID / dedupe key is sent, so June would likely record duplicates. NEEDS REVIEW.

### Multiplexing

- **No**. Each input event produces exactly one request.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `config.js` (`BASE_ENDPOINT`, `https://api.june.so/api`; paths `/identify`, `/track`, `/group`, `/page`)

### Version Deprecation

- **Status:** Sunset
- **Sunset date:** 2025-08-08
- **Source:** [A new chapter for June](https://www.june.so/blog/a-new-chapter)

June announced on 2025-07-08 that its team was joining Amplitude and that the standalone June product would wind down on 2025-08-08. On 2026-11-16 the `api.june.so` host did not resolve.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [A new chapter for June](https://www.june.so/blog/a-new-chapter)

No successor API exists; June recommended migrating to Amplitude.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [June HTTP API — Track](https://www.june.so/docs/tracking/http-api/track) (reference in source code)
- [June joins Amplitude announcement](https://www.june.so/blog/a-new-chapter)

### Changelog References

- **Changelog:** None found
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** [A new chapter for June (product wind-down on 2025-08-08)](https://www.june.so/blog/a-new-chapter)
- **Last checked:** 2026-11-16

## FAQ

_To be populated._
