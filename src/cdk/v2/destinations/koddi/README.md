# Koddi Destination

Implementation in **CDK v2** (`procWorkflow.yaml`, `rtWorkflow.yaml`, `utils.js`, `config.js`). The live code is `src/cdk/v2/destinations/koddi/`; there is no v0 or v1 folder. `cdkV2Enabled: true` in `db-config.json` and `KODDI: { routerTransform: true, cdkV2: true }` in `src/features.ts`.

## Overview

Koddi is a retail media / sponsored ads platform. The integration sends ad impression, click and conversion events to Koddi's event collection (beacon) API so ad performance can be measured and attributed.

## Configuration

Source: `rudder-integrations-config/src/configurations/destinations/koddi/`.

| Config key (`destination.Config`)                                       | UI label                                                                           | Required           | Used in transformer                                                   |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| `apiBaseUrl`                                                            | API Base URL (for example `https://{clientname}.koddi.io/event-collection/beacon`) | Yes                | Yes, base of every endpoint (trailing slash stripped)                 |
| `clientName`                                                            | Client Name                                                                        | Yes                | Yes, `clientName` (impressions, clicks) / `client_name` (conversions) |
| `testVersionOverride`                                                   | testVersionOverride                                                                | No (default false) | Yes, clicks: when false, `testVersionOverride` is dropped             |
| `overrides`                                                             | overrides                                                                          | No (default false) | Yes, clicks: when false, `overrides` is dropped                       |
| `consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes` | Consent settings                                                                   | No                 | No                                                                    |

`secretKeys` is not set; there is no secret field.

## Integration Functionalities

### Implementation

- CDK v2. `transformAtV1: "router"`; `rtWorkflow.yaml` runs `procWorkflow.yaml` per event (no batching), so it is a **router** destination.

### Supported Message Types

Track only (cloud mode). The Koddi event type comes from `message.integrations.koddi.eventType`: `impressions`, `clicks` or `conversions` (case-insensitive).

Supported sources: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, reactnative, flutter, cordova, shopify, warehouse.

### Authentication

- **No auth header or key is sent.** Headers are `accept: application/json` (plus `content-type: application/json` for conversions). The tenant is selected by the client subdomain in `apiBaseUrl` and by `clientName`.
- Koddi's Impressions and Clicks reference pages document no authentication. The Conversions reference declares no security scheme but lists `401` for an "invalid or missing client API key". **NEEDS REVIEW**: confirm with Koddi whether conversions need an API key; if so, the integration has no field for it.
- No Koddi announcement of auth changes was found (Koddi publishes no changelog).

### Batching Support

No. One request per event.

### Intermediate Calls

None. The `trackingData` value comes from a prior Koddi Winning Ads response, which the customer obtains outside RudderStack.

### Proxy Delivery

No.

### User Deletion

No.

### OAuth Support

No.

### Additional Functionalities

- Impressions and clicks are **GET** requests with the payload as query parameters; conversions are **POST** with a JSON body.
- Conversion `unixtime` is converted to Unix seconds.

### Validations

- Track only; `integrations.koddi.eventType` must be impressions, clicks or conversions.
- `apiBaseUrl` and `clientName` must be set (configuration error otherwise).
- Impressions/clicks: `properties.tracking_data`, `properties.rank`, `properties.beacon_issued`, plus user ID for clicks are required.
- Conversions: `context.locale`, `properties.currency`, user ID, `properties.order_id`/`transaction_id` and `properties.bidders` are required. `bidders` must be a non-empty array; each item needs `bidder` or `alternate_bidder`, `count` and `base_price`.

Known issue: the workflow reads `.message.type.toLowerCase()` and `.message.integrations.koddi.eventType.toLowerCase()` before the validation step. A message with no `type`, or no `integrations.koddi.eventType`, fails with a generic runtime error instead of the intended "message Type is not present" / "event type ... is not supported" message. **NEEDS REVIEW**.

### Rate Limits

Not documented by Koddi. **NEEDS REVIEW**.

## General Queries

### Event Ordering

- Not required. Impressions carry `ts` and conversions carry `unixtime`; clicks carry no timestamp and are recorded on receipt.

### Data Replay Feasibility

- **Missing data**: impressions and conversions can be replayed with their timestamps; clicks are recorded at replay time. Koddi may also reject stale `trackingData`. **NEEDS REVIEW**.
- **Already delivered data**: replay creates duplicate impressions/clicks. Koddi may dedupe conversions by `transaction_id`, but this is not documented. **NEEDS REVIEW**.

### Multiplexing

No.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `utils.js` (`getEndpoint`, built from `Config.apiBaseUrl`)

Koddi event collection API (OpenAPI title `k1-event-collection`, spec version `1`). The base URL is customer-specific: `https://{clientname}.koddi.io/event-collection/beacon` with `?action=impression`, `?action=click` or `/conversion`. The URL has no version segment.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Koddi Impressions](https://developers.koddi.com/reference/impressions-1)

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Koddi Impressions](https://developers.koddi.com/reference/impressions-1)

Spec version `1` is the only version documented.

## Documentation Links

- [Koddi Winning Ads](https://developers.koddi.com/reference/winning-ads)
- [Koddi Impressions](https://developers.koddi.com/reference/impressions-1)
- [Koddi Clicks](https://developers.koddi.com/reference/clicks-1)
- [Koddi Conversions](https://developers.koddi.com/reference/conversions-1)

The event collection endpoints take no auth header.

### Changelog References

- **Changelog:** None found
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Koddi publishes no developer changelog, release notes, deprecations page or feed (`developers.koddi.com/changelog` returns 404, and the [docs index](https://developers.koddi.com/llms.txt) lists none). Changes have to be tracked through the Koddi account team.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
