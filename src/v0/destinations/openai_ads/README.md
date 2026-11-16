# OpenAI Ads Destination

Implementation in **TypeScript** on the `DestinationIntegration` framework (`routerTransform.ts`, `utils.ts`, `delivery.ts`) in `src/v0/destinations/openai_ads/`. Sends server-side conversions to the OpenAI Ads (ChatGPT ads) **Conversions API**.

## Configuration

### Account (`rudderAccountId`, account definition `DESTINATION_OPENAI_ADS_API_KEY`)

- **API Key** (`apiKey`, secret): Conversions API key from the Conversions tab in OpenAI Ads Manager.
- **Pixel ID** (`pixelId`): sent as the `pid` query parameter.

Both are merged into `destination.Config` from the account at runtime; they are not in the destination `schema.json`.

### Destination settings

- **Default action source** (`defaultActionSource`): one of `web`, `mobile_app`, `offline`, `physical_store`, `phone_call`, `email`, `other`.
- **Default currency** (`defaultCurrency`): ISO 4217 code used when the event has none.
- **Event mapping** (`eventMapping`): `{ from, to, customEventName?, deduplicationKey? }`. `to` is a standard OpenAI event or `custom`.
- Event filtering (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`) and consent management.
- `isHashRequired` is read by the code (default `true`) but is not exposed in integrations-config. NEEDS REVIEW.

## Integration Functionalities

> **Cloud mode** for all sources; **device mode** for web (`supportedConnectionModes.web: ["cloud", "device"]`, device mode lives in the JS SDK, not here).

### Supported Message Types

- Cloud: **track**, **page**, **screen** (zod schema in `types.ts`).

### Implementation

- **Implemented in**: TypeScript, `DestinationIntegration` framework
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router (`transformAtV1: "router"`; `OPENAI_ADS: { routerTransform: true, batching: true }`)

### Authentication

- Header `Authorization: Bearer <apiKey>`, plus `Content-Type: application/json` and query `pid=<pixelId>` (`routerTransform.ts`).
- API key auth from a RudderStack account (`authenticationType: "api_key"`); no OAuth, nothing in rudder-auth.
- OpenAI's docs do not state an expiry or rotation policy for Conversions API keys. Keys can also be created through the Ads API (`/v1/conversions/api_keys`). No auth change announced as of November 2026.

### Validations

- `apiKey` and `pixelId` must be non-empty (zod).
- Track events need `event`; page and screen fall back to `page_viewed` when unmapped.
- Unmapped events whose name is not a standard OpenAI event name are rejected (`OpenAI Ads event mapping not found for <name>`).
- `custom` mappings need `customEventName`.
- `timestamp_ms` must be within the last 7 days and at most 10 minutes in the future (checked before sending, because one bad event fails the whole batch).
- `action_source: web` requires `source_url`.
- Amount requires a valid currency; amounts are converted to integer minor units.
- Content `quantity` must be an integer; `opt_out` must be boolean; `ip_address` must be a valid IP (dropped otherwise).

### Batching Support

- **Yes.** `ChunkBatchStrategy`: up to **1000 events** and **4 MB** per request, body `{ "events": [...] }`. OpenAI's limit is 1,000 events per batch.

### Rate Limits

- Not documented by OpenAI. NEEDS REVIEW.

### Intermediate Calls

- None.

### Proxy Delivery

- **Yes (proxy v1 through the framework).** `batching: true` turns on `transformerProxy` in `src/features.ts`.
- `delivery.ts`: `400` and `422` return `retry` with `dontBatch: true`, so rudder-server re-sends each job alone to isolate the bad event. The failure reason is built from `error.message`, `code`, `param` and nested `errors[]`.
- Tests: `test/integrations/destinations/openai_ads/dataDelivery/`.

### User Deletion

- **No.**

### OAuth Support

- No.

### Additional Functionalities

- Hashing: emails, phones, external IDs, first and last names are normalized and SHA-256 hashed. With hashing on (the default), a value that already looks like SHA-256 throws an `InstrumentationError` (`validateHashingConsistency` in `src/v0/util/audienceUtils.ts`). Exception: when the event has no `userId` and the external ID comes from `anonymousId`, it is hashed only if it is not already a SHA-256 value.
- Deduplication: event `id` is `messageId`, or the value at `deduplicationKey` from the mapping row. Matches the pixel's `event_id` for pixel/API dedupe.

## General Queries

### Event Ordering

- Not required. Conversions are independent and carry their own `timestamp_ms`.

### Data Replay Feasibility

- **Missing data**: Possible only within the 7-day window; older events are rejected in the transformer.
- **Already delivered data**: Replays with the same `id` are deduplicated by OpenAI. NEEDS REVIEW: OpenAI documents dedupe between pixel and API by matching IDs; dedupe of repeated API sends is assumed.

### Multiplexing

- No. One event, one entry in `events[]`.

## Version Information

### Current Version

- Conversions API **v1**: `POST https://bzr.openai.com/v1/events?pid=<PIXEL-ID>`.

### Version Deprecation

- No deprecation announced. OpenAI publishes no versioning or sunset policy for the Ads APIs.

### Latest Available Version

- v1 is the only version.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Conversions API](https://developers.openai.com/ads/conversions-api)
- [Conversion tracking](https://developers.openai.com/ads/conversion-tracking)
- [Supported events](https://developers.openai.com/ads/supported-events)
- [Ads docs index](https://developers.openai.com/ads/llms.txt)

### Changelog References

- [OpenAI developer changelog](https://developers.openai.com/changelog). NEEDS REVIEW: as of November 2026 it does not list Ads API entries, and there is no Ads-specific changelog, deprecations page or feed. Watch the [Conversions API](https://developers.openai.com/ads/conversions-api) page itself.

## FAQ
