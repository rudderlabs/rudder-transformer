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

- **Version:** `v1.3`
- **Where in code:** `config.js` (`BASE_URL`; `/offline/track/` for the processor path, `/offline/batch/` for the router path)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Events API 2.0 Overview (Events API 1.0 sunset notice)](https://business-api.tiktok.com/portal/docs/events-api-2.0/v1.3) (blocks automated requests)

- `PlaceAnOrder` is soft-deprecated by TikTok in favour of `Purchase` (comment in `config.js`). The default map still sends `Order Completed` as `PlaceAnOrder`.
- TikTok's v1.3 docs now describe sending offline events through the unified Events API 2.0 endpoint `/event/track/` with `event_source: "offline"` and the offline Event Set ID as `event_source_id` ([Report App, Web, Offline, or CRM Events](https://business-api.tiktok.com/portal/docs/report-app-web-offline-or-crm-events/v1.3), blocks automated requests). TikTok's [Events API 2.0 Overview](https://business-api.tiktok.com/portal/docs/events-api-2.0/v1.3) (blocks automated requests) lists `/offline/track/` and `/offline/batch/` among six Events API 1.0 endpoints that "will be sunset in H2 2024". This integration still sends to both.

NEEDS REVIEW: TikTok gives only "H2 2024", no exact day, and the v1.3 API reference and rate-limit pages still list `/offline/track/`, so whether the endpoints are already switched off is unconfirmed. Migration to `/event/track/` is likely needed.

### Latest Available Version

- **Version:** `v1.3`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [API Reference Overview (current version v1.3)](https://business-api.tiktok.com/portal/docs/api-reference/v1.3) (blocks automated requests)

Within v1.3, Events API 2.0 (`/event/track/`) is the recommended path for offline events.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Report App, Web, Offline, or CRM Events (Events API 2.0, v1.3)](https://business-api.tiktok.com/portal/docs/report-app-web-offline-or-crm-events/v1.3) (blocks automated requests)
- [Update an Offline Event set (v1.3)](https://business-api.tiktok.com/portal/docs/update-an-offline-event-set/v1.3) (blocks automated requests)
- [Events API 2.0 Overview](https://business-api.tiktok.com/portal/docs/events-api-2.0/v1.3) (blocks automated requests)
- [Offline Events API reference (v1.3)](https://business-api.tiktok.com/portal/docs/offline-events/v1.3) (blocks automated requests)
- [Report Offline Events in bulk (v1.3)](https://business-api.tiktok.com/portal/docs/report-offline-events-in-bulk/v1.3) (blocks automated requests)
- [API Reference Overview (v1.3)](https://business-api.tiktok.com/portal/docs/api-reference/v1.3) (blocks automated requests)
- [Authentication](https://business-api.tiktok.com/portal/docs?id=1738373164380162) (blocks automated requests)
- [How to upload offline events in Events Manager for Events API (TikTok help)](https://ads.tiktok.com/help/article/about-events-api-for-offline)
- [RudderStack docs: TikTok Ads Offline Events](https://www.rudderstack.com/docs/destinations/streaming-destinations/tiktok-ads-offline-events/)

### Changelog References

- **Changelog:** [API for Business blog (weekly "API For Business Platform Update" posts)](https://business-api.tiktok.com/portal/blog) (blocks automated requests)
- **Deprecations:** [Events API 2.0 Overview (Events API 1.0 sunset notice)](https://business-api.tiktok.com/portal/docs/events-api-2.0/v1.3) (blocks automated requests)
- **Versions:** [Hevo: TikTok Ads API v1.2 deprecated 2023-08-15, v1.3 only](https://mini-docs.hevodata.com/sources/marketing/tiktok-ads/) (third-party)
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

The portal's [About the Guide](https://business-api.tiktok.com/portal/docs/about-the-guide/v1.3) (blocks automated requests) page describes a weekly "What's New" section, but no direct URL for it was found, so the blog's platform-update posts are linked instead. TikTok publishes no API version lifecycle page; the v1.2 sunset date comes from a third-party connector doc. No RSS feed for the portal blog was found. The [TikTok for Developers changelog](https://developers.tiktok.com/doc/changelog) (blocks automated requests) covers Login Kit, Research API and other developer products, not the Marketing API.

## FAQ
