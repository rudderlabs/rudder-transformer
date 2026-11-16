# Rockerbox Destination

Implementation in **JavaScript** (v0), `src/v0/destinations/rockerbox/`. Sends conversion events to a Rockerbox webhook built for RudderStack. Web device mode is handled by the RudderStack JS SDK, not here.

## Configuration

### Required Settings

- **Advertiser ID** (`advertiserId`): Rockerbox advertiser identifier, sent as the `advertiser` query parameter.
- **Events map** (`eventsMap`): `{ from, to }` rows mapping RudderStack event names (matched lowercase) to Rockerbox actions. Unmapped events are rejected.

### Optional Settings

- Event filtering (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`).
- Device mode only: `useNativeSDK`, `clientAuthId`, `customDomain`, `enableCookieSync`.
- Consent management fields.

## Integration Functionalities

> **Cloud mode** for all sources; **device** and **hybrid** for web. In hybrid mode only `track` goes through cloud (`hybridModeCloudEventsFilter`).

### Supported Message Types

- Code: **track** only.
- `db-config.json` lists `identify`, `track` and `page` for cloud, so identify and page events reach the transformer and fail with `Message type <type> is not supported`. See [Known Issues](docs/businesslogic.md#known-issues).

### Implementation

- **Implemented in**: JavaScript (v0)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Processor (`transformAtV1: "processor"`). `processRouterDest` exists (`simpleProcessRouterDest`) but is not used because `ROCKERBOX` has no `routerTransform` flag in `src/features.ts`.

### Authentication

- **None.** The request has no auth header; the account is identified only by the `advertiser` query parameter. `secretKeys` is not set; no OAuth, nothing in rudder-auth.
- No auth change announced. NEEDS REVIEW: Rockerbox (now part of DoubleVerify) publishes no public API docs for this webhook, so this could not be checked.

### Validations

- `type` required, must be `track`.
- `advertiserId` required (`ConfigurationError`).
- `userId` or `anonymousId` required.
- `timestamp` required (sent in seconds).
- Event must be mapped in `eventsMap` (`ConfigurationError: The event is not associated to a RockerBox event. Aborting!`).

### Batching Support

- **No.** One event per request.

### Rate Limits

- Not published. NEEDS REVIEW.

### Intermediate Calls

- None.

### Proxy Delivery

- **No.**

### User Deletion

- **No.**

### OAuth Support

- No.

### Additional Functionalities

- `conversion_source` is always `"RudderStack"`.
- Unmapped `properties` keys are copied to the payload root.

## General Queries

### Event Ordering

- Not required. Each conversion carries its own timestamp.

### Data Replay Feasibility

- **Missing data**: Replay is possible; events carry the original timestamp.
- **Already delivered data**: No documented dedupe. Replaying may double-count; `order_id` may help Rockerbox dedupe. NEEDS REVIEW.

### Multiplexing

- No.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `config.js` (`BASE_ENDPOINT`)

Endpoint: `https://webhooks.getrockerbox.com/rudderstack?advertiser=<advertiserId>`, a webhook Rockerbox built for RudderStack.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Rockerbox docs: RudderStack onsite identity integration](https://data-foundation.rockerbox.com/first-party-integrations/types/onsite-pixel/core/rudderstack)

NEEDS REVIEW: Rockerbox joined DoubleVerify (announced 2025-02-26, [Rockerbox blog](https://www.rockerbox.com/blog/exciting-news-were-joining-doubleverify)); check with Rockerbox whether the `getrockerbox.com` webhook host is staying.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Rockerbox docs: RudderStack onsite identity integration](https://data-foundation.rockerbox.com/first-party-integrations/types/onsite-pixel/core/rudderstack)

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [RudderStack docs: Rockerbox](https://www.rudderstack.com/docs/destinations/streaming-destinations/rockerbox/)
- [Rockerbox Data Foundation docs](https://data-foundation.rockerbox.com/)
- [Rockerbox docs: RudderStack onsite identity integration](https://data-foundation.rockerbox.com/first-party-integrations/types/onsite-pixel/core/rudderstack)

The webhook takes no auth header; the advertiser ID goes in the `advertiser` query parameter.

### Changelog References

- **Changelog:** None found
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** [Rockerbox blog RSS](https://www.rockerbox.com/blog/rss.xml)
- **Announcements:** None found
- **Last checked:** 2026-11-16

Rockerbox publishes no developer changelog or release notes; the [Data Foundation docs index](https://data-foundation.rockerbox.com/llms.txt) has none. The blog feed is the company blog, where the DoubleVerify announcement appeared. Changes to the webhook would come from Rockerbox directly.

## FAQ
