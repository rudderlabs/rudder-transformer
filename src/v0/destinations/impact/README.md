# impact.com Destination

Implementation in **JavaScript**

## Overview

Sends conversions and page loads to impact.com (formerly Impact Radius) for partner and affiliate attribution:

- Configured install and action events go to the Conversions API (`POST https://api.impact.com/Advertisers/{AccountSID}/Conversions`).
- Identify, page, screen and all other track events go to the PageLoad endpoint (`POST https://trkapi.impact.com/PageLoad`).

## Configuration

### Required Settings

- **Account SID** (`accountSID`): impact.com account SID. Used in the Conversions URL and as the Basic auth username.
- **API Key** (`apiKey`): impact.com auth token. Basic auth password.
- **Campaign Id** (`campaignId`): Sent as `CampaignId` on every request.

### Optional Settings

- **Impact App Id** (`impactAppId`): Sent as `ImpactAppId` (and `PropertyId` for page loads).
- **Event Type Id** (`eventTypeId`): Sent as `EventTypeId` on conversions.
- **Enable to hash email** (`enableEmailHashing`, default `false`): SHA-1 hashes `CustomerEmail`.
- **Additional parameters mapping** (`rudderToImpactProperty`): `from` (path in the RudderStack event) to `to` (impact.com parameter) for conversions.
- **Custom mapping for Products** (`productsMapping`): `from` (product key) to `to` (impact.com item parameter) for conversions.
- **Enable Identify / Page / Screen Events** (`enableIdentifyEvents`, `enablePageEvents`, `enableScreenEvents`, all default `false`): When off, those events fail with a configuration error.
- **Action Event Names** (`actionEventNames`), **Install Event Names** (`installEventNames`): Track event names sent as action or install conversions.

## Integration Functionalities

> impact.com supports **Cloud mode** only.

### Implementation

- **Implemented in**: JavaScript (v0), `src/v0/destinations/impact/`
- **CDK v2 Enabled**: No
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`). `processRouterDest` exists (`simpleProcessRouterDest`), but `IMPACT` is not listed in `src/features.ts` with `routerTransform`.

### Supported Message Types

```json
"supportedMessageTypes": { "cloud": ["identify", "track", "page", "screen"] }
```

### Batching Support

- **Supported**: No. One request per event (two for track events configured as both install and action).

### Intermediate Calls

None.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`).

### User Deletion

- **Supported**: No (no `deleteUsers.js`).

### OAuth Support

- **Supported**: No. Basic auth with `accountSID:apiKey`.

### Additional Functionalities

- **Event routing**: A track event is a conversion when its name is in `installEventNames` or `actionEventNames`. Defaults: `Order Completed` is always an action, and `Applcation Installed` (spelled this way in code) is an install. `Application Installed` is not matched by default. NEEDS REVIEW: likely typo in `transform.js`.
- **Products**: Each `properties.products[i]` becomes `ItemBrand{i+1}`, `ItemCategory{i+1}`, `ItemName{i+1}`, `ItemPrice{i+1}`, `ItemPromoCode{i+1}`, `ItemQuantity{i+1}`, `ItemSku{i+1}`. Without a products array, top-level properties fill item 1.
- **Device IDs**: For Apple OS, `context.device.id` becomes `AppleIfv` and `advertisingId` becomes `AppleIfa`; for Android, `AndroidId` and `GoogAId`.
- **Email hashing**: SHA-1 of the trimmed email when `enableEmailHashing` is on.

### Validations

- `accountSID`, `apiKey` and `campaignId` are required.
- `type` is required and must be identify, track, page or screen.
- Identify, page and screen require their enable flag.
- Conversions require an order ID (`properties.orderId`, `order_id`, `transactionID` or `checkout_id`) and a timestamp (`EventDate`).

### Rate Limits

| Endpoint                | Limit                                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Conversions (Brand API) | 1,000 requests per hour by default ("Other" group); `429` with `Retry-After` when exceeded. Limits can vary per account and change. |
| PageLoad (`trkapi`)     | Not published. NEEDS REVIEW.                                                                                                        |

[impact.com brand API rate limits](https://integrations.impact.com/impact-brand/reference/rate-limits)

## General Queries

### Event Ordering

- **Conversions**: Not required. Each conversion has its own `EventDate` and `OrderId`.
- **Page loads (identify, page, screen, other track)**: Not required. They record visits with `EventDate`; there are no profile updates.

### Data Replay Feasibility

- **Missing data replay**: Feasible. Conversions and page loads carry `EventDate`. impact.com applies its own attribution windows and locking periods, so late conversions may not be credited. NEEDS REVIEW: impact.com limits on back-dated conversions.
- **Already delivered data replay**: Not recommended for page loads (recorded again). impact.com treats `OrderId` as the conversion identifier and is expected to reject or deduplicate repeated orders for the same event type. NEEDS REVIEW: confirm impact.com deduplication behaviour.

### Multiplexing

- **Yes**, for track events whose name is in both `installEventNames` and `actionEventNames`: two Conversions requests are sent (install, then action). The action request also gets `ClickId` from `context.referrer.id` or `properties.clickId` when not already set.

## Version Information

### Current Version

The endpoints are not versioned in the URL:

- `POST https://api.impact.com/Advertisers/{AccountSID}/Conversions`
- `POST https://trkapi.impact.com/PageLoad`

impact.com applies the API version set in the account's API settings unless a request sends the `IR-Version` header or `IrVersion` query parameter. RudderStack sends neither, so the version is whatever the customer's account uses. The versions seed lists v12. NEEDS REVIEW.

### Version Deprecation

impact.com does not publish sunset dates for API versions. New versions are released only for backwards-incompatible changes, and accounts upgrade by changing their API settings.

### Latest Available Version

**v14** (released June 1, 2026). Earlier: v13 (March 1, 2025), v12 (May 6, 2024), v11 (October 12, 2022). The v14 changelog adds flat-fee payouts for creator tasks to the Conversions endpoint; no breaking change affecting the fields RudderStack sends was found. NEEDS REVIEW.

## Documentation Links

- [Submit a conversion](https://integrations.impact.com/impact-brand/reference/submit-a-conversion)
- [Create a page load](https://integrations.impact.com/impact-brand/reference/create-a-pageload)
- [API integration implementation](https://integrations.impact.com/impact-brand/docs/api-integration-implementation)
- [Rate limits](https://integrations.impact.com/impact-brand/reference/rate-limits)

### Changelog References

- [Brand API changelog](https://integrations.impact.com/impact-brand/changelog)
- [API versioning (versions and release dates)](https://integrations.impact.com/impact-brand/reference/versioning)
- [API changelog summary (help center)](https://help.impact.com/other/readme/api-access-tokens-and-changelog/api-changelog-summary)
- RSS/Atom feed: none found.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
