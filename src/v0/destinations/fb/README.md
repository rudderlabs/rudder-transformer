# Facebook App Events Destination

Implementation in **JavaScript**

## Overview

Sends mobile app events (`track`, `screen`, `page`) to Meta through the Graph API App Events endpoint (`POST /{app-id}/activities`) as `CUSTOM_APP_EVENTS`. Destination definition name: `FB` (display name "Facebook App Events").

## Configuration

### Required Settings

- **App ID** (`appID`): Facebook App ID. Used in the endpoint path.

### Optional Settings

- **Limited Data Usage** (`limitedDataUse`), **State** (`dpoState`), **Country** (`dpoCountry`): Data Processing Options. Used by device-mode SDKs only; the cloud-mode transformer does not read them.
- **Event filtering** (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`): Applied by RudderStack before the transformer.
- **Use native SDK** (`useNativeSDK`) and consent settings: device mode and RudderStack consent handling.

## Integration Functionalities

> Facebook App Events supports **Device mode** (Android, Android Kotlin, iOS, iOS Swift, React Native) and **Cloud mode**.

### Implementation

- **Implemented in**: JavaScript (v0), `src/v0/destinations/fb/`
- **CDK v2 Enabled**: No
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`). `processRouterDest` exists and calls `simpleProcessRouterDest`, but `FB` is not listed in `src/features.ts` with `routerTransform`.

### Supported Message Types

```json
"supportedMessageTypes": {
  "cloud": ["page", "screen", "track"],
  "device": {
    "android": ["identify", "screen", "track"],
    "androidKotlin": ["identify", "screen", "track"],
    "ios": ["identify", "screen", "track"],
    "iosSwift": ["identify", "screen", "track"],
    "reactnative": ["identify", "screen", "track"]
  }
}
```

- **Track**: Custom app event. Standard e-commerce/lifecycle event names map to Facebook standard events (see business logic).
- **Screen**: `Viewed {name} Screen`, or `Viewed Screen` when the name is missing or invalid.
- **Page**: `Viewed Page`.

### Batching Support

- **Supported**: No. One request per event.

### Intermediate Calls

None.

### Proxy Delivery

- **Code present**: `src/v0/destinations/fb/networkHandler.js` (proxy v0). It reuses the shared Facebook error handler (`src/v0/util/facebookUtils/networkHandler.js`) to map Graph API error codes to statuses.
- **Enabled**: `FB` is not listed with `transformerProxy` in `src/features.ts`. NEEDS REVIEW: confirm whether proxy delivery is enabled for `FB` in rudder-server config.
- **Partial batching response handling**: Not applicable (no batching, proxy v0).

### User Deletion

- **Supported**: No (no `deleteUsers.js`).

### OAuth Support

- **Supported**: No. The request carries no access token; only the App ID is used. NEEDS REVIEW: Meta documents an app or user access token for this endpoint.

### Additional Functionalities

- **User data hashing**: `ud[em]`, `ud[fn]`, `ud[ln]`, `ud[ph]`, `ud[ge]`, `ud[db]`, `ud[ct]`, `ud[st]`, `ud[zp]` are normalised and SHA-256 hashed by the transformer.
- **Extended device info (`extinfo`)**: A 16-element array built from `context` (OS, app, device, screen, locale, carrier, time zone).
- **Property key cleanup**: Invalid property keys have non-alphanumeric characters removed and are trimmed to 40 characters.
- **IP forwarding**: `context.ip` (or `request_ip`) is sent in the `x-forwarded-for` header.

### Validations

- `context.device.type` must be `android` or an Apple device type (`ios`, `ipados`, `watchos`, `tvos`); otherwise the event fails (`extinfo` version is required).
- Event names (after mapping) must match `^[0-9a-zA-Z_][0-9a-zA-Z _-]{0,39}$`.
- If `properties.revenue` is set, `properties.currency` is required.
- Mapped properties must have the right type: `revenue`, `quantity` are numbers; `currency`, `name`, `category`, `query`, `products[].product_id` are strings.
- At least one of: hashed user data (`ud[...]`), `context.device.advertisingId`, or `anonymousId`.

### Rate Limits

Meta does not publish a specific limit for `/{app-id}/activities`. Graph API application-level platform limits apply (calls per hour = 200 x number of app users). NEEDS REVIEW: whether this limit applies to app events logged server side.

[Graph API rate limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting)

## General Queries

### Event Ordering

- **Track / Screen / Page**: Not required. Every event carries `_logTime` (from `timestamp`), so Meta records the original event time. There are no profile updates in cloud mode.

### Data Replay Feasibility

- **Missing data replay**: Feasible, since each event keeps its `_logTime`. Meta may not attribute events that are much older than the attribution window. NEEDS REVIEW: maximum event age accepted by the App Events API.
- **Already delivered data replay**: Not recommended. RudderStack sends no event ID, so replayed events are counted again.

### Multiplexing

- **No**. One input event produces one request.

## Version Information

### Current Version

- **Version:** `v25.0`
- **Where in code:** `config.js` (`VERSION`), used in `transform.js` to build `https://graph.facebook.com/v25.0/{appID}/activities`

### Version Deprecation

- **Status:** Supported
- **Sunset date:** 2028-07-29
- **Source:** [Graph API versions](https://developers.facebook.com/docs/graph-api/changelog/versions)

v25.0 was released on 2026-02-18. Meta no longer recommends the [App Events API](https://developers.facebook.com/docs/marketing-api/app-event-api) for new integrations and recommends the Conversions API for app events. Existing integrations keep working, but Meta will discontinue development of the App Events API. No shutdown date is announced.

NEEDS REVIEW: the App Events API is documented under the Marketing API, whose version table lists v25.0 as available only until 2027-02-23 ([Marketing API changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog)). Confirm which schedule applies to `/{app-id}/activities`.

### Latest Available Version

- **Version:** `v27.0`
- **Released:** 2026-11-04
- **Upgrade needed:** Yes
- **Source:** [Graph API changelog](https://developers.facebook.com/docs/graph-api/changelog)

No App Events API changes requiring migration were found between v25.0 and v27.0. NEEDS REVIEW before upgrading.

## Documentation Links

- [App Events API](https://developers.facebook.com/docs/marketing-api/app-event-api)
- [Application activities reference](https://developers.facebook.com/docs/graph-api/reference/application/activities/)
- [Customer information parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters/)
- [Graph API rate limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting)
- [Access tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)

### Changelog References

- **Changelog:** [Graph API changelog](https://developers.facebook.com/docs/graph-api/changelog); [Marketing API changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog)
- **Deprecations:** [Graph API breaking changes](https://developers.facebook.com/docs/graph-api/changelog/breaking-changes); [Graph API out-of-cycle changes](https://developers.facebook.com/docs/graph-api/changelog/out-of-cycle-changes); [Marketing API out-of-cycle changes](https://developers.facebook.com/docs/marketing-api/out-of-cycle-changes)
- **Versions:** [Graph API versions and expiration dates](https://developers.facebook.com/docs/graph-api/changelog/versions); [Marketing API versioning](https://developers.facebook.com/docs/marketing-api/overview/versioning)
- **Feed:** [Meta for Developers blog Atom feed](https://developers.facebook.com/blog/feed/)
- **Announcements:** [App Events API no longer recommended for new integrations; development to be discontinued](https://developers.facebook.com/docs/marketing-api/app-event-api)
- **Last checked:** 2026-11-16

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
