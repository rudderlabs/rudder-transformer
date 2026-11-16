# Adjust Destination

Implementation in **JavaScript** (`src/v0/destinations/adj/`). There is no CDK v2 or v1 implementation. Canonical names `Adjust`, `ADJ`, `adjust`, `adj` map to this folder (`src/constants/destinationCanonicalNames.js`).

## Configuration

### Required Settings

- **App Token** (`appToken`): Adjust app token, sent as the `app_token` query parameter.
- **Event mapping** (`customMappings`): `from` = RudderStack event name, `to` = Adjust event token. Events without a mapping are rejected.

### Optional Settings

- **Environment** (`environment`, default `false`): `true` sends `environment=production`, `false` sends `environment=sandbox`.
- **Partner params** (`partnerParamsKeys`): `from` = property key, `to` = Adjust partner parameter name.
- **Event filtering** (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`): device mode only (used by the SDKs).
- **Delay** (`delay`), **useNativeSDK**, **enableInstallAttributionTracking**: device mode only. Not read by the transformer.

## Integration Functionalities

> Adjust supports **Cloud mode** (track) and **Device mode** (identify and track on Android, Android Kotlin, iOS, iOS Swift, Flutter, Unity).

### Supported Message Types

- **Cloud mode**: Track only.

### Implementation

- **Implemented in**: JavaScript (v0)
- **Processor vs Router**: Processor (`transformAtV1: "processor"`). A `processRouterDest` (`simpleProcessRouterDest`) exists but Adjust is not in `src/features.ts`, so it is not used.

### Authentication

- **The integration sends no auth header.** It identifies the app only with `app_token` and `s2s=1` in the query string, and sends `Accept: */*`.
- Adjust offers **S2S Security**: tokens created in the Adjust dashboard, sent as `Authorization: Bearer <token>`. It is opt-in (off by default), but once a customer turns on "Enable S2S authentication", every S2S request without a valid token is rejected ([S2S security (dev)](https://dev.adjust.com/en/api/s2s-api/security), [S2S security (help)](https://help.adjust.com/en/article/s2s-security)). No date is published for when it might become mandatory.
- **Impact**: An Adjust customer who enables S2S Security will have all RudderStack cloud-mode events rejected. There is no config field for the token. **NEEDS REVIEW**: add an optional S2S auth token field and send it as `Authorization: Bearer`.

### Batching Support

- **Supported**: No. The S2S events API takes one event per request.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No.

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: No.

### Additional Functionalities

- **Platform-specific IDs**: on Android, `idfa` and `idfv` are removed; on Apple-family devices, `android_id` and `gps_adid` are removed.
- **Adjust ID**: `integrations.<Adjust|ADJ|adjust|adj>.adid` is sent as `adid`.
- **Revenue**: when `properties.revenue` is set, `currency` defaults to `USD`.
- **Callback params**: all `properties` (minus `revenue` and `currency`) are flattened, stringified and sent as a JSON string in `callback_params`.
- **Partner params**: configured property keys are copied into `partner_params` as strings.

### Validations

- `message.type` must be track.
- `appToken` must be set.
- `context.device.type` must be a string and `context.device.id` must be present.
- `context.device.type` must be `android` or an Apple family type (`ios`, `watchos`, `ipados`, `tvos`).
- `event` must have a mapping in `customMappings`.

### Rate Limits

- Not documented by Adjust for the S2S events endpoint. **NEEDS REVIEW**.

## General Queries

### Event Ordering

- **Track**: Required. Adjust says events must be sent in chronological order per device and event token. The integration does not send `created_at_unix`, so Adjust uses the time it receives the event. Late or reordered delivery changes the recorded event time ([S2S events](https://dev.adjust.com/en/api/s2s-api/events)).

### Data Replay Feasibility

- **Missing data**: Limited. Without `created_at_unix`, replayed events are recorded at replay time, and Adjust rejects events older than 58 days.
- **Already delivered data**: Not safe. There is no dedupe key, so replays duplicate events and revenue.

### Multiplexing

- **No**.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `config.js` (`baseEndpoint`, `https://s2s.adjust.com/event`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [S2S events API](https://dev.adjust.com/en/api/s2s-api/events)

S2S Security (Bearer tokens) is available and opt-in. See Authentication above and [S2S security](https://dev.adjust.com/en/api/s2s-api/security).

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [S2S events API](https://dev.adjust.com/en/api/s2s-api/events)

Adjust documents `created_at_unix`, `adid` and Bearer auth as current recommended parameters.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [S2S events API](https://dev.adjust.com/en/api/s2s-api/events)
- [S2S API overview](https://dev.adjust.com/en/api/s2s-api)
- [S2S security](https://dev.adjust.com/en/api/s2s-api/security)
- [Set up S2S security (help center)](https://help.adjust.com/en/article/s2s-security)

### Changelog References

- **Changelog:** None found
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Adjust publishes no API changelog, release notes, deprecations page or feed for the S2S API (`dev.adjust.com/en/changelog` and `help.adjust.com/en/article/release-notes` return 404). The [S2S security](https://dev.adjust.com/en/api/s2s-api/security) pages are the main reference for auth changes.

## FAQ

> This section will be populated with frequently asked questions as they arise from usage and support requests.
