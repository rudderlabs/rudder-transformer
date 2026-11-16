# The Trade Desk Real Time Conversions Destination

Implementation in **CDK v2** (`procWorkflow.yaml` + `utils.js`). Code exists only in `src/cdk/v2/destinations/the_trade_desk_real_time_conversions/`; there is no v0 or v1 folder. The separate audience destination **The Trade Desk** (`THE_TRADE_DESK`) lives in `src/cdk/v2/destinations/the_trade_desk/` and has its own docs.

## Configuration

### Required Settings

- **Advertiser ID** (`advertiserId`): sent as `adv`.
- **Tracking Tag ID** (`trackerId`): sent as `tracker_id`.

### Optional Settings

- **Events mapping** (`eventsMapping`): `{ from, to }` pairs mapping RudderStack event names (matched lowercase) to Trade Desk event names.
- **Custom properties** (`customProperties`): `{ rudderProperty, tradeDeskProperty }` pairs. Intended for `td1`–`td10`; `rudderProperty` is a dot path into the whole message.
- Consent management (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`).

## Integration Functionalities

> **Cloud mode** only.

### Supported Message Types

- **Track** only (`supportedMessageTypes.cloud: ["track"]`; the workflow asserts `type === "track"`).

### Implementation

- **Implemented in**: CDK v2 (`cdkV2Enabled: true` in `db-config.json`, `THE_TRADE_DESK_REAL_TIME_CONVERSIONS: { cdkV2: true }` in `src/features.ts`)
- **Processor vs Router**: Processor (`transformAtV1: "processor"`). No `rtWorkflow.yaml`.

### Authentication

- **None.** The request carries only `Content-Type: application/json`. The endpoint `https://insight.adsrvr.org/track/realtimeconversion` identifies the account by `adv` and `tracker_id` in the body, like a server-side pixel.
- No OAuth, no secrets (`secretKeys` absent), nothing in rudder-auth.
- No auth change has been announced for this endpoint. NEEDS REVIEW: Trade Desk docs are behind the partner portal login, so this could not be checked against the current docs.

### Validations

- `advertiserId` and `trackerId` required (`ConfigurationError`).
- `message.type` must be `track`; `message.event` required.
- `Order Completed` requires `properties.revenue` or `properties.value`.
- `integrations.THE_TRADE_DESK.region` (if set) must start with `us`; `policies` must be one value, `LDU`.

### Batching Support

- **No.** Each event is one request with `{ "data": [event] }`. The API accepts an array in `data`, so batching would be possible but is not implemented.

### Rate Limits

- Not published publicly. NEEDS REVIEW (partner portal).

### Intermediate Calls

- None.

### Proxy Delivery

- **No** (`networkHandler.js` absent, `transformerProxy` not set).

### User Deletion

- **No** (`deleteUsers.js` absent).

### OAuth Support

- No.

### Additional Functionalities

- Built-in ecommerce mapping (see business logic): `Product Added` → `addtocart`, `Order Completed` → `purchase`, `Product Viewed` → `viewitem`, `Checkout Started` → `startcheckout`, `Cart Viewed` → `viewcart`, `Product Added to Wishlist` → `wishlistitem`.
- Privacy: `data_processing_option` (LDU + US region) and `privacy_settings` come from the **`THE_TRADE_DESK`** integrations object (any canonical spelling of the audience destination's name), not from a key named after this destination.

## General Queries

### Event Ordering

- Not required. Conversions are independent events keyed by `imp` (`messageId`).

### Data Replay Feasibility

- **Missing data**: Replay is possible; the event timestamp is not sent, so replayed conversions are attributed at receive time. NEEDS REVIEW: confirm whether TTD accepts a conversion timestamp field.
- **Already delivered data**: Not safe. No documented dedupe on `imp` or `order_id`; NEEDS REVIEW.

### Multiplexing

- No. One event, one request.

## Version Information

### Current Version

- Real-time conversion endpoint `https://insight.adsrvr.org/track/realtimeconversion`. The URL has no version segment. Code references the partner-portal doc `v3/portal/data/doc/DataConversionEventsApi`.

### Version Deprecation

- No deprecation announced for the real-time conversion endpoint. NEEDS REVIEW: check the Trade Desk partner portal changelog (login required).

### Latest Available Version

- Unversioned endpoint; the endpoint in use is the current one. NEEDS REVIEW.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Conversion Events API (partner portal, login required)](https://partner.thetradedesk.com/v3/portal/data/doc/DataConversionEventsApi)
- [RudderStack docs: The Trade Desk Real Time Conversions](https://www.rudderstack.com/docs/destinations/streaming-destinations/trade-desk-realtime-conversions/)
- [Tealium connector guide (public summary of the same API)](https://docs.tealium.com/server-side-connectors/the-trade-desk-real-time-conversion-events-connector/)

### Changelog References

NEEDS REVIEW: The Trade Desk publishes release notes only inside the partner portal (login required). The pages below load but their content could not be checked:

- [Platform API change log](https://partner.thetradedesk.com/v3/portal/api/doc/ApiChangeLog)
- [Platform API deprecations](https://partner.thetradedesk.com/v3/portal/api/doc/ApiDeprecation)
- [Data API release notes](https://partner.thetradedesk.com/v3/portal/data/doc/DataReleaseNotes)

## FAQ
