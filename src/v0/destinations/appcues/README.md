# Appcues Destination

Implementation in **JavaScript** (v0, not CDK v2). The live code is `src/v0/destinations/appcues/`; there is no v1 or CDK v2 folder.

## Overview

Appcues is a product adoption platform (in-app flows, checklists, surveys). The cloud-mode integration sends user profile updates and events to the Appcues HTTP API (user activity endpoint) so they can be used for targeting and analytics.

## Configuration

Source: `rudder-integrations-config/src/configurations/destinations/appcues/`.

| Config key (`destination.Config`)                                       | UI label                          | Required | Used in transformer                                                   |
| ----------------------------------------------------------------------- | --------------------------------- | -------- | --------------------------------------------------------------------- |
| `accountId`                                                             | Account Id                        | Yes      | Yes, in the endpoint path and as `_appcuesId` in page profile updates |
| `nativeSdkUrl`                                                          | Appcues Javascript Native SDK URL | No       | No (device mode only)                                                 |
| `useNativeSDK`                                                          | Use device-mode to send events    | No       | No (device mode only)                                                 |
| `eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`        | Event filtering                   | No       | No (applied by rudder-server/SDK)                                     |
| `consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes` | Consent settings                  | No       | No                                                                    |

`secretKeys` is empty: the destination has no secret.

## Integration Functionalities

### Implementation

- JavaScript, `transform.js` + `config.js` + JSON mapping files in `data/`.
- `transformAtV1: "processor"` and `APPCUES` is not listed in `src/features.ts`, so it is a **processor** destination. `transform.js` exports a `processRouterDest` that is not used.

### Supported Message Types

| Message type | Cloud mode | Device mode (web) |
| ------------ | ---------- | ----------------- |
| Identify     | Yes        | Yes               |
| Track        | Yes        | Yes               |
| Page         | Yes        | Yes               |
| Screen       | Yes        | No                |

Other types are rejected with `Message type is not supported`.

Supported sources: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, warehouse, reactnative, flutter, cordova, shopify. Web supports cloud and device mode; all others cloud only.

### Authentication

- **No authentication header is sent.** The request carries only `Content-Type: application/json`. The account is identified only by `accountId` in the URL path: `https://api.appcues.com/v1/accounts/{accountId}/users/{userId}/activity`.
- This matches Appcues' HTTP API docs, which describe no key or token for this endpoint. A probe with no credentials returned `202 {"ok":true}`.
- Appcues' newer **Public API v2** (`api.appcues.com/v2`) uses HTTP Basic auth with an API key and secret from Appcues Studio. This integration does not use it.
- No Appcues announcement of auth changes or a shutdown of the unauthenticated v1 activity endpoint was found. **NEEDS REVIEW**: watch the [Appcues changelog](https://feedback.appcues.com/changelog) for one.

### Batching Support

No. One request per event.

### Intermediate Calls

None.

### Proxy Delivery

No (`networkHandler.js` is not present).

### User Deletion

No (`deleteUsers.js` is not present).

### OAuth Support

No (`auth` is not set in `db-config.json`).

### Additional Functionalities

- **Page events** send both a profile update (page title, URL, locale, user agent) and a `Visited a Page` event in one request.
- **Screen events** are sent as a `Viewed a Screen` event.
- **EU region**: Appcues has an EU API host (`api.eu.appcues.com`). The integration always uses the US host `api.appcues.com`. **NEEDS REVIEW**: confirm whether EU accounts work through the US host.

### Validations

- `message.type` is required.
- `userId` (top-level `message.userId`) is required for every event; anonymous events are rejected.
- Identify: `traits` / `context.traits` is required (mapped to `profile_update`, marked required).
- Track/Screen: `event` and `timestamp` are required by the mapping.
- Page: `userId` (generic `userIdOnly`) is required by the page profile mapping.

### Rate Limits

Appcues' HTTP API docs give no rate limit; they recommend retry logic. The v2 Public API returns `429` when throttled. **NEEDS REVIEW**.

## General Queries

### Event Ordering

- **Identify and Page** update the user profile (`profile_update`). Later updates overwrite earlier values, so out-of-order delivery can leave stale profile data. Ordering is required.
- **Track and Screen** carry their own `timestamp` (Unix seconds), so ordering matters less.

### Data Replay Feasibility

- **Missing data**: track/screen events can be replayed because each has its own timestamp. Replaying identify/page can overwrite newer profile data.
- **Already delivered data**: replaying creates duplicate events. Appcues documents no deduplication key; `request_id` (set from `messageId`) is only echoed back in the response.

### Multiplexing

No multiple requests. A page event produces one request that carries both a profile update and an event.

## Version Information

### Current Version

- HTTP API **v1**: `POST https://api.appcues.com/v1/accounts/{accountId}/users/{userId}/activity` (`config.js`).

### Version Deprecation

- No deprecation or sunset date announced for the v1 user activity endpoint. Appcues' docs still document it and point to the Public API for bulk import/export.

### Latest Available Version

- Appcues **Public API v2** (`https://api.appcues.com/v2`, Basic auth with API key and secret). It has per-user profile (`/v2/accounts/{account_id}/users/{user_id}/profile`) and event (`/v2/accounts/{account_id}/users/{user_id}/events`) endpoints. A move to v2 would require adding API key and secret fields to the destination config. Appcues states the Public API is not available on legacy subscription tiers.

## Documentation Links

- [Appcues HTTP API (user activity)](https://docs.appcues.com/http-api-developer)
- [Appcues Public API overview](https://docs.appcues.com/appcues-public-api)
- [Appcues Public API v2 reference](https://api.appcues.com/v2/docs)

### Changelog References

- [Appcues product changelog](https://feedback.appcues.com/changelog) (monthly product updates; not API-specific)
- **NEEDS REVIEW**: no API-specific changelog, deprecations page or RSS feed found.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
