# Pinterest Tag (Conversions API) Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/pinterest_tag/`)

## Configuration

Settings read by the transformer (`destination.Config`):

- **API Version** (`apiVersion`): `legacyApi` (Conversions API v3, schema default) or `newApi` (API v5).
- **Advertiser ID** (`advertiserId`): Required for `legacyApi`; sent as `advertiser_id` (removed for v5).
- **Ad Account ID** (`adAccountId`): Required for `newApi`; used in the v5 URL. Secret.
- **Conversion Token** (`conversionToken`): Required for `newApi`; sent as `Authorization: Bearer`. Secret.
- **App ID** (`appId`): Sent as `app_id`.
- **Send as Test Event** (`sendAsTestEvent`): Adds query param `test=true`.
- **Sending Unhashed Data** (`sendingUnHashedData`, default `true`): When on, the transformer normalizes and SHA-256 hashes PII. When off, values are assumed pre-hashed and only wrapped in arrays.
- **Deduplication Key** (`deduplicationKey`): Message path used for `event_id`; falls back to `messageId`.
- **Send External ID** (`sendExternalId`, default `false`): Include `external_id` (from userId).
- **Send as Custom Event** (`sendAsCustomEvent`, default `false`): Unmapped track events are sent as `custom`.
- **Events Mapping** (`eventsMapping`): RudderStack event → Pinterest event(s) (`Lead`, `PageVisit`, `ViewCategory`, `Signup`, `WatchVideo`, ...); converted to snake_case.

Not used by the cloud transformer: `tagId`, `enhancedMatch`, `customProperties`, `useNativeSDK` (device mode), and event filtering (applied by rudder-server).

## Integration Functionalities

> Supports **Cloud mode** and **Device mode** (web: track, page, identify).

### Supported Message Types (Cloud)

- **Track**: Conversion event; e-commerce fields in `custom_data`
- **Page**: `view_category` if `category` is set, else `page_visit`
- **Screen**: Event named from `event`/`name`, resolved like Track

### Implementation

- **Implemented in**: CDK v2
- **CDK v2 Enabled**: Yes
- **Processor vs Router**: Router destination (`transformAtV1: "router"`)

### Batching Support

- **Supported**: Yes, all supported types.
- Router uses `batchMultiplexedEvents` with `MAX_BATCH_SIZE = 1000`. Body: `{ "data": [ ...events ] }`.
- Note: Pinterest processes only the first 20 events of a batch sent in test mode (per the [Pinterest developer newsletter, February 2026](https://community.pinterest.biz/t/pinterest-developer-monthly-newsletter-february-2026/43256)). NEEDS REVIEW: the transformer does not reduce batch size when `sendAsTestEvent` is on.

### Rate Limits

See Pinterest's [rate limits reference](https://developers.pinterest.com/docs/reference/ratelimits/). The conversions endpoint is in the `ads_conversions` category. NEEDS REVIEW: secondary sources quote both 5,000 calls/minute per ad account (endpoint spec) and 120,000/minute (category, Standard access); test requests are limited separately. Confirm the current numbers on the reference page.

### Intermediate Calls

None.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`)

### User Deletion

- **Supported**: No (no `deleteUsers.js`)

### OAuth Support

- **Supported**: No. v5 uses the static Conversion Token as a Bearer token; v3 sends no auth header.

### Additional Functionalities

- **PII hashing and normalization** (`sendingUnHashedData`): see [business logic](docs/businesslogic.md).
- **Default e-commerce mapping**: `Order Completed` → `checkout`, `Product Added` → `add_to_cart`, `Products Searched` / `Product List Filtered` → `search`.
- **Deduplication** with the browser tag via `event_id` (`deduplicationKey` path or `messageId`).

### Validations

- `legacyApi`: `advertiserId` required. `newApi`: `adAccountId` and `conversionToken` required.
- `type` must be track, page or screen
- Track: `event` or `name` required; event name must be a valid string
- `event_time` (from timestamp) required
- `action_source` required and one of `app_android`, `app_ios`, `web`, `offline`. Read from `traits/context.traits/properties` `action_source`/`actionSource`, else `channel`.
- User data must contain `em`, `hashed_maids`, or both `client_ip_address` and `client_user_agent`

## General Queries

### Event Ordering

- **Not required**. These are timestamped conversion events (`event_time` in seconds); they do not update a profile.

### Data Replay Feasibility

- **Missing data replay**: Feasible within Pinterest's accepted `event_time` window. NEEDS REVIEW: Pinterest's maximum event age for conversions.
- **Already-delivered data replay**: Pinterest deduplicates on `event_id` (used for tag/API dedupe), and `event_id` defaults to `messageId`, so replays of the same message should be deduplicated. NEEDS REVIEW: Pinterest's dedupe window.

### Multiplexing

- **Yes**. If `eventsMapping` maps one RudderStack event to several Pinterest events, one payload per mapped event is generated (same base payload, different `event_name`). They are batched together via `batchMultiplexedEvents`.

## Version Information

### Current Version

- `legacyApi` (schema default): Conversions API v3, `POST https://ct.pinterest.com/events/v3`
- `newApi`: API v5, `POST https://api.pinterest.com/v5/ad_accounts/{adAccountId}/events`

### Version Deprecation

RudderStack's public docs state Pinterest planned to deprecate API v3 on June 30, 2023 ([RudderStack Pinterest Tag cloud mode docs](https://www.rudderstack.com/docs/destinations/streaming-destinations/pinterest-ads/pinterest-ads-cloud-mode/)). NEEDS REVIEW: no Pinterest-owned notice found for `ct.pinterest.com/events/v3`, and `legacyApi` is still the schema default; confirm whether v3 still accepts traffic and whether existing connections should be migrated.

### Latest Available Version

API v5 (`newApi`). Spec-level changes are published as releases of the `pinterest/api-description` repository.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Send conversions (v5)](https://developers.pinterest.com/docs/api/v5/events-create/)
- [Conversions API guide](https://developers.pinterest.com/docs/conversions/conversions/)
- [Rate limits](https://developers.pinterest.com/docs/reference/ratelimits/)

### Changelog References

- [Pinterest developer changelog](https://developers.pinterest.com/docs/changelog/)
- [API v5 spec releases (pinterest/api-description)](https://github.com/pinterest/api-description/releases) (GitHub releases also offer an Atom feed at `https://github.com/pinterest/api-description/releases.atom`)
- NEEDS REVIEW: no dedicated API versions/sunset-date page found.

## FAQ

> This section will be populated with frequently asked questions as they arise.
