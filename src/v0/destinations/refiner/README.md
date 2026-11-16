# Refiner Destination

Implementation in **JavaScript** (v0, not CDK v2). The live code is `src/v0/destinations/refiner/`; there is no v1 or CDK v2 folder.

## Overview

Refiner is an in-app survey and user feedback tool. The cloud-mode integration identifies users, groups them into accounts and tracks events through the Refiner REST API so surveys can be targeted.

## Configuration

Source: `rudder-integrations-config/src/configurations/destinations/refiner/`.

| Config key (`destination.Config`)                                       | UI label                                                | Required     | Used in transformer                              |
| ----------------------------------------------------------------------- | ------------------------------------------------------- | ------------ | ------------------------------------------------ |
| `apiKey`                                                                | Refiner REST API Key                                    | Yes (secret) | Yes, `Authorization: Bearer` header              |
| `webClientApiKey`                                                       | Refiner Web Client API Key                              | Yes          | No (device mode only)                            |
| `userAttributesMapping`                                                 | Map Rudder user attributes to Refiner contact traits    | No           | Yes, renames identify trait keys (`from` → `to`) |
| `accountAttributesMapping`                                              | Map Rudder account attributes to Refiner account traits | No           | Yes, renames group trait keys (`from` → `to`)    |
| `useNativeSDK`                                                          | Use device-mode to send events                          | No           | No                                               |
| `eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`        | Event filtering                                         | No           | No                                               |
| `consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes` | Consent settings                                        | No           | No                                               |

`secretKeys`: `apiKey`.

## Integration Functionalities

### Implementation

- JavaScript: `transform.js`, `utils.js`, `config.js`.
- `transformAtV1: "router"` and `REFINER: { routerTransform: true }` in `src/features.ts`, so it is a **router** destination (uses `simpleProcessRouterDest`; no batching).

### Supported Message Types

| Message type | Cloud mode | Device mode (web) |
| ------------ | ---------- | ----------------- |
| Identify     | Yes        | Yes               |
| Track        | Yes        | Yes               |
| Page         | Yes        | Yes               |
| Group        | Yes        | Yes               |

Supported sources: web, cloud, android, androidKotlin, ios, iosSwift, unity, amp, warehouse, reactnative, flutter, cordova, shopify. Web supports cloud and device mode; all others cloud only.

### Authentication

- Every request sends `Authorization: Bearer {Config.apiKey}` with `Content-Type: application/x-www-form-urlencoded`.
- Refiner's API docs list Bearer token as the recommended method (alternatives: `api_key` parameter, or Basic auth with the key as username).
- No Refiner announcement of auth changes, key rotation or OAuth migration was found.

### Batching Support

No.

### Intermediate Calls

None.

### Proxy Delivery

No (`networkHandler.js` is not present).

### User Deletion

No (`deleteUsers.js` is not present).

### OAuth Support

No.

### Additional Functionalities

- **Attribute renaming**: `userAttributesMapping` and `accountAttributesMapping` rename trait keys before sending. Unmapped traits are sent as-is.
- **Page as event**: page calls become a tracked event named from `category` and `name` (see business logic).
- **Group via identify**: group calls use the identify-user endpoint with a nested `account[...]` object.

### Validations

- `message.type` is required.
- Every type requires `userId` (generic `userIdOnly`) or `email` (generic `email`).
- Track requires `event`.

### Rate Limits

From [Refiner API docs](https://refiner.io/docs/api/):

- 4,000 requests/minute and 1,000 requests per 15 seconds per API key.
- 100 requests/minute per user ID on endpoints that take `id`, `email` or `uuid`.
- Exceeding a limit returns `429` with `Retry-After`.

## General Queries

### Event Ordering

- **Identify and Group** update contact and account traits. Later calls overwrite earlier values, so ordering is required. Refiner also returns `409` if another identify for the same user is still in progress.
- **Track and Page** send no timestamp; Refiner records the time it receives them. Out-of-order delivery changes the recorded event time, so ordering matters for event-based survey targeting. **NEEDS REVIEW**.

### Data Replay Feasibility

- **Missing data**: identify/group can be replayed, at the risk of overwriting newer traits. Track/page replays are recorded at replay time, not the original time.
- **Already delivered data**: replaying track/page creates duplicate events; Refiner has no dedupe key.

### Multiplexing

No. One request per event.

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `config.js` (`BASE_ENDPOINT`: `https://api.refiner.io/v1`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Refiner REST API](https://refiner.io/docs/api/)

Refiner publishes no deprecation or versioning policy. The code posts track and page events to `/v1/track`. Refiner's current docs only document `/v1/track-event`. `/v1/track` still answers (a probe returned `401`, not `404`), so it looks like an undocumented legacy alias. NEEDS REVIEW: move to `/v1/track-event` before the alias is removed.

### Latest Available Version

- **Version:** `v1`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Refiner REST API](https://refiner.io/docs/api/)

## Documentation Links

- [Refiner REST API](https://refiner.io/docs/api/)
- [Refiner authentication](https://refiner.io/docs/api/#authentication)
- [Refiner identify user](https://refiner.io/docs/api/#identify-user)
- [Refiner track event](https://refiner.io/docs/api/#track-event)

### Changelog References

- **Changelog:** [Refiner product updates](https://refiner.io/docs/product-updates/) (product changelog; not API-specific)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
