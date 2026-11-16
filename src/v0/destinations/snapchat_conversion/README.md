# Snapchat Conversion Destination

Implementation in **JavaScript** (v0), `src/v0/destinations/snapchat_conversion/`. No v1 or CDK v2 folder exists.

The destination supports two Snap Conversions API (CAPI) versions, selected by `Config.apiVersion`:

| `apiVersion`          | Snap API | Code                                         |
| --------------------- | -------- | -------------------------------------------- |
| `legacyApi` (default) | CAPI v2  | `transform.js`, `util.js`                    |
| `newApi`              | CAPI v3  | `transformV3.js`, `utilsV3.js` (+ `util.js`) |

> **v2 is past its announced deprecation.** Snap's CAPI docs state "Conversions API V2 will be deprecated in early 2025". The default in `rudder-integrations-config` is still `legacyApi`. See [Version Information](#version-information).

## Configuration

| Key                        | Purpose                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `apiKey` (required)        | Snap Conversions API token (secret)                                                 |
| `apiVersion`               | `legacyApi` (v2) or `newApi` (v3); default `legacyApi`                              |
| `pixelId`                  | Required for `WEB` and `OFFLINE` events                                             |
| `snapAppId`, `appId`       | Both required for `MOBILE_APP` events                                               |
| `rudderEventsToSnapEvents` | Maps RudderStack event names to Snap standard events (one event can map to several) |
| `enableDeduplication`      | Adds `client_dedup_id` (v2) / `event_id` (v3)                                       |
| `deduplicationKey`         | Message path for the dedup id; default `messageId`                                  |

## Integration Functionalities

### Implementation

- **Implemented in**: JavaScript (v0)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router (`transformAtV1: "router"`; `features.ts`: `SNAPCHAT_CONVERSION: { routerTransform: true }`)

### Supported Message Types

Cloud mode: `track`, `page` (page is sent as Snap `PAGE_VIEW`).

### Authentication

- **v2**: `Authorization: Bearer <apiKey>` header, `POST https://tr.snapchat.com/v2/conversion`.
- **v3**: `access_token=<apiKey>` **query parameter**, `POST https://tr.snapchat.com/v3/{pixelId | snapAppId}/events`. No auth header.
- Token type: Snap recommends static long-lived Conversions API tokens generated in Ads Manager → Business Details; Snap states "These tokens do not expire" ([Get Started](https://developers.snap.com/api/marketing-api/Conversions-API/GetStarted)). No OAuth in this destination (`auth` not set in `db-config.json`).
- No announced change to v3 token handling found. The v2 → v3 move itself changes how the token is sent (header → query parameter).

### Event Channel (action source)

`util.js` `getEventConversionType`: `properties.eventConversionType` or `message.channel`: `web` → `WEB`, `mobile` / `mobile_app` → `MOBILE_APP`, `offline` → `OFFLINE`; anything else → `OFFLINE`.

### Validations

- Event name must map to a Snap standard event (`config.js` `eventNameMapping`), either directly (spaces → `_`, case-insensitive) or through `rudderEventsToSnapEvents`; otherwise `Event <name> doesn't match with Snapchat Events!`.
- At least one of email, phone, advertising ID, or (IP and user agent) is required.
- Event age: v2 rejects events older than 37 days; v3 rejects events older than 7 days (Snap v3 limit).
- `pixelId` (web/offline) or `snapAppId` + `appId` (app) required.

### Batching

- **Supported**: Yes, `track` and `page`, router only.
- **v2**: `batchMultiplexedEvents(..., 2000)`; body sent as `JSON_ARRAY` `{ batch: "<stringified array>" }`.
- **v3**: `BatchUtils.chunkArrayBySizeAndLength({ maxItems: 2000 })`, with `MOBILE_APP` events and `WEB`/`OFFLINE` events batched separately (different endpoint IDs). Body `{ data: [ ... ] }`.
- Snap documents up to 2,000 events per batch request ([Get Started](https://developers.snap.com/api/marketing-api/Conversions-API/GetStarted)).

### Intermediate Calls

None.

### Proxy Delivery

No (`networkHandler.js` absent; no `transformerProxy` in `features.ts`).

### User Deletion

No.

### OAuth Support

No.

### Rate Limits

Snap's Get Started page recommends a 1,000 QPS limit for long-lived tokens and also mentions a standard 10 requests/second API limit; the page does not reconcile the two. NEEDS REVIEW.

## General Queries

### Event Ordering

Not required. All events are conversions with `event_time`/`timestamp`; Snap attributes by event time.

### Data Replay Feasibility

- **Missing data**: Feasible only within Snap's window: 7 days for v3 (also enforced by the transformer), 37 days for v2 in the transformer.
- **Already delivered**: Feasible only with deduplication on. Snap deduplicates on `event_id` (+ `event_name`) within a 48-hour window ([Using the API](https://developers.snap.com/api/marketing-api/Conversions-API/UsingTheAPI)); replays older than that create duplicates.

### Multiplexing

Yes. A `track` event mapped to several Snap events in `rudderEventsToSnapEvents`:

- v2: one request object per mapped event (all from one job).
- v3: one response whose `data` array holds one entry per mapped event.

## Version Information

### Current Version

- `legacyApi`: Snap CAPI **v2** (`https://tr.snapchat.com/v2/conversion`), the default.
- `newApi`: Snap CAPI **v3** (`https://tr.snapchat.com/v3/{ID}/events`).

Both set in `config.js` `ENDPOINT`.

### Version Deprecation

- Snap's [Conversions API introduction](https://developers.snap.com/api/marketing-api/Conversions-API/Introduction) says "Conversions API V2 will be deprecated in early 2025" and points to the [migration guide](https://developers.snap.com/api/marketing-api/Conversions-API/MigrationGuide). No exact shutdown date was found, and as of 2026-11-16 it is not confirmed whether v2 still accepts traffic. NEEDS REVIEW: v2 users (the default) are at risk; consider changing the default to `newApi` and migrating existing destinations.

### Latest Available Version

CAPI **v3** (already implemented). v3 parameters are not identical to v2 (for example `event_type` → `event_name`, `event_conversion_type` → `action_source`, hashed fields move under `user_data`).

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Conversions API introduction](https://developers.snap.com/api/marketing-api/Conversions-API/Introduction)
- [Get Started (tokens, batch size, rate limits)](https://developers.snap.com/api/marketing-api/Conversions-API/GetStarted)
- [Using the API (v3 endpoints, dedup)](https://developers.snap.com/api/marketing-api/Conversions-API/UsingTheAPI)
- [Parameters](https://developers.snap.com/api/marketing-api/Conversions-API/Parameters)
- [v2 → v3 migration guide](https://developers.snap.com/api/marketing-api/Conversions-API/MigrationGuide)

### Changelog References

- [Marketing API announcements](https://developers.snap.com/api/marketing-api/Ads-API/announcements) (covers Marketing API and Conversions API changes and deprecations)
- [Marketing API newsletter](https://developers.snap.com/marketing-api/Ads-API/newsletter)
- [CAPI v2 → v3 migration guide](https://developers.snap.com/api/marketing-api/Conversions-API/MigrationGuide)
- API versions / sunset dates page and RSS feed: none found. NEEDS REVIEW.

## FAQ

<!-- Populated over time -->
