# TikTok Ads Offline Events Destination

Implementation in **JavaScript** (v0), `src/v0/destinations/tiktok_ads_offline_events/`. Sends offline conversions (in-store, phone, CRM) to TikTok through the **Offline Events API** of TikTok API for Business v1.3. The web/app destination `TIKTOK_ADS` is separate (`src/v0/destinations/tiktok_ads/`).

## Configuration

### Required Settings

- **Access Token** (`accessToken`, secret): TikTok for Business access token with Offline Events permission.

### Optional Settings

- **Map events to standard events** (`eventsToStandard`): `{ from, to }` rows; one RudderStack event can map to several TikTok standard events.
- **Hash user properties** (`hashUserProperties`): SHA-256 hash email and phone before sending.
- Consent management fields.

The Offline Event Set ID is **not** a config field; each event must carry `properties.eventSetId`.

## Integration Functionalities

> **Cloud mode** only.

### Supported Message Types

- **Track** only.

### Implementation

- **Implemented in**: JavaScript (v0)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router (`transformAtV1: "router"`, `TIKTOK_ADS_OFFLINE_EVENTS: { routerTransform: true }`)

### Authentication

- Header `Access-Token: <accessToken>` plus `Content-Type: application/json` (`transform.js`).
- Static token from destination config; no OAuth (`auth` not set in `db-config.json`), nothing in rudder-auth.
- NEEDS REVIEW: TikTok access tokens for the Business API are long-lived and stay valid until revoked; no auth change for the Offline Events API was found, but TikTok's portal blocks automated access so this could not be confirmed against the current docs.

### Validations

- `accessToken` required (`ConfigurationError`).
- `type` required and must be `track`; `event` required.
- Event must be in `eventsToStandard` or the built-in map, otherwise `Event name (<event>) is not valid, must be mapped to one of standard events`.
- `properties.eventSetId` and `timestamp` are required by the mapping.

### Batching Support

- **Yes.** Events are grouped by `event_set_id`, then split into batches of **80** (`MAX_BATCH_SIZE`) and sent to `/offline/batch/`. NEEDS REVIEW: TikTok's documented maximum for this endpoint was not verified.
- Multiplexed events (one input mapped to several standard events) are kept in the same batch through `batchMultiplexedEvents`.

### Rate Limits

- Not verified. NEEDS REVIEW (TikTok portal blocks automated access).

### Intermediate Calls

- None.

### Proxy Delivery

- **No** (`networkHandler.js` absent).

### User Deletion

- **No.**

### OAuth Support

- No.

### Additional Functionalities

- `partner_name: "RudderStack"` on each event and on the batch.
- Built-in event map in `config.js` (for example `Order Completed` → `PlaceAnOrder`, `Product Added` → `AddToCart`, `Checkout Started` → `InitiateCheckout`).

## General Queries

### Event Ordering

- Not required. Offline conversions carry their own `timestamp`.

### Data Replay Feasibility

- **Missing data**: Possible within TikTok's attribution window for offline events. NEEDS REVIEW: confirm the maximum event age.
- **Already delivered data**: `event_id` (`properties.eventId` or `messageId`) is sent, which TikTok uses for deduplication. NEEDS REVIEW: confirm offline dedupe on `event_id`.

### Multiplexing

- **Yes.** If `eventsToStandard` maps one event name to several TikTok events, one input produces one payload per mapped event.

## Version Information

### Current Version

- TikTok API for Business **v1.3**: `https://business-api.tiktok.com/open_api/v1.3/offline/track/` (processor path) and `/offline/batch/` (router path).

### Version Deprecation

- No sunset date for v1.3 found.
- `PlaceAnOrder` is soft-deprecated by TikTok in favour of `Purchase` (comment in `config.js`). The default map still sends `Order Completed` as `PlaceAnOrder`.
- TikTok's v1.3 docs now describe sending offline events through the unified Events API 2.0 endpoint `/event/track/` with `event_source: "offline"` and the offline Event Set ID as `event_source_id` ([Report App, Web, Offline, or CRM Events](https://business-api.tiktok.com/portal/docs/report-app-web-offline-or-crm-events/v1.3)). No retirement date for `/offline/track/` and `/offline/batch/` was found. NEEDS REVIEW: check the TikTok portal changelog.

### Latest Available Version

- v1.3 is the current Business API version. Within it, Events API 2.0 (`/event/track/`) is the recommended path for offline events.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Report App, Web, Offline, or CRM Events (Events API 2.0, v1.3)](https://business-api.tiktok.com/portal/docs/report-app-web-offline-or-crm-events/v1.3)
- [Update an Offline Event set (v1.3)](https://business-api.tiktok.com/portal/docs/update-an-offline-event-set/v1.3)
- [About Events API for offline (TikTok help)](https://ads.tiktok.com/help/article/about-events-api-for-offline)
- [RudderStack docs: TikTok Ads Offline Events](https://www.rudderstack.com/docs/destinations/streaming-destinations/tiktok-ads-offline-events/)

### Changelog References

NEEDS REVIEW: TikTok's API for Business changelog and version pages are on `business-api.tiktok.com/portal`, which returns `403` to automated requests, so no changelog URL could be verified. No RSS feed is known.

## FAQ
