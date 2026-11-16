# Optimizely Fullstack (Feature Experimentation) Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/optimizely_fullstack/`)

## Configuration

Settings read by the transformer (`destination.Config`):

### Required (enforced in code)

- **Data File URL** (`dataFileUrl`): Optimizely datafile URL. Fetched on every event to resolve event and attribute IDs.
- **Account ID** (`accountId`): Sent as `account_id`.
- **Campaign ID** (`campaignId`): Default `campaign_id` for Identify (`campaign_activated`).
- **Experiment ID** (`experimentId`): Default `experiment_id` for Identify.

### Optional

- **Project ID** (`projectId`): Sent as `project_id`.
- **Track Known Users** (`trackKnownUsers`, default `true`): `visitor_id` = `userId` when on, `anonymousId` when off.
- **Track Categorized Pages** / **Track Named Pages** (`trackCategorizedPages`, `trackNamedPages`): Which of page `category` / `name` become Optimizely events. At least one must be on for Page/Screen.
- **Event Mapping** (`eventMapping`): RudderStack event name to Optimizely event key (Track).
- **Page Mapping** (`pageMapping`): Page name/category to Optimizely event key (Page/Screen).
- **Attribute Mapping** (`attributeMapping`): Trait name to Optimizely attribute key.
- **Anonymize IP** (`anonymizeIp`, default `false`): Sent as `anonymize_ip`.
- **Enrich Decisions** (`enrichDecisions`, default `true`): See note in Additional Functionalities.

Not used by the transformer: `secureEnvironment`, `dataFileAccessToken` (the datafile is fetched without auth), `eventFilteringOption`/`whitelistedEvents`/`blacklistedEvents` (applied by rudder-server), and device-mode settings (`useNativeSDK`, `listen`, `nonInteraction`).

## Integration Functionalities

> Supports **Cloud mode** (all sources) and **Device mode** (Android, iOS: identify, track).

### Supported Message Types (Cloud)

- **Identify**: `campaign_activated` decision event
- **Track**: Conversion event, mapped to a datafile event
- **Page / Screen**: One or two conversion events from category and/or name

### Implementation

- **Implemented in**: CDK v2 (`procWorkflow.yaml`, `rtWorkflow.yaml`)
- **CDK v2 Enabled**: Yes
- **Processor vs Router**: Router destination (`transformAtV1: "router"`)

### Batching Support

- **Supported**: No. The router workflow transforms events one by one (`batched: false`). Each request holds one visitor and one snapshot.

### Rate Limits

NEEDS REVIEW: Optimizely does not publish a rate limit for the Event API (`logx.optimizely.com/v1/events`). Its [log endpoint docs](https://docs.optimizely.com/experimentation-strategy/data-api/log-endpoint) list responses 204 (queued), 400 (malformed) and 500 (retry later). A 3.5 MB per-request limit was seen in older docs, not confirmed on the current page.

### Intermediate Calls

- **Datafile fetch** (all event types): `GET {dataFileUrl}` via `handleHttpRequest` on every event, to look up event IDs/keys (`datafile.events`) and attribute IDs (`datafile.attributes`). A failed fetch fails the event (`Data File Lookup Failed due to ...`). There is no caching in the transformer.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`)

### User Deletion

- **Supported**: No (no `deleteUsers.js`)

### OAuth Support

- **Supported**: No. The Event API is called without auth headers.

### Additional Functionalities

- **Experiment overrides**: `integrations.optimizely_fullstack.campaignId`, `experimentId`, `variationId` override config values for Identify. `variationId` is mandatory for Identify.
- **`enrich_decisions` is always `true`**: the template uses `Config.enrichDecisions || true`, so turning the setting off has no effect.
- **Revenue in cents**: `properties.revenue * 100`, floored.

### Validations

- `type` must be identify, track, page or screen
- `dataFileUrl`, `accountId`, `campaignId`, `experimentId` configured
- `trackKnownUsers` on → `userId` required; off → `anonymousId` required
- Track: `event` required; mapped event must exist in the datafile
- Page/Screen: `name` or `properties.category` required; one of the page toggles on; at least one mapped event found in the datafile
- Track/Page/Screen: datafile must contain at least one event
- Identify: `variationId` in the integrations object

## General Queries

### Event Ordering

- **Identify (`campaign_activated`)**: Not strictly required; each event has its own timestamp and Optimizely attributes conversions by visitor and time. NEEDS REVIEW: a conversion arriving before its decision event may not be attributed to the variation.
- **Track / Page / Screen**: Not required; events are timestamped (milliseconds).

### Data Replay Feasibility

- **Missing data replay**: Feasible; events carry original timestamps. Results may only include events within the experiment's running window.
- **Already-delivered data replay**: Optimizely uses each event's `uuid` to de-duplicate replayed requests ([log endpoint docs](https://docs.optimizely.com/experimentation-strategy/data-api/log-endpoint)). `uuid` = `messageId`, so replays of the same message are deduplicated. Exception: the second Page/Screen event uses a random UUID and would be counted again.

### Multiplexing

- **Page/Screen**: One request can contain **two events** (category and name) when both toggles are on and both map to datafile events.
- Others: one event per request.

## Version Information

### Current Version

Event API v1: `POST https://logx.optimizely.com/v1/events`.

### Version Deprecation

No deprecation announced for `/v1/events`.

### Latest Available Version

v1 is the latest Event API version.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Event API log endpoint](https://docs.optimizely.com/experimentation-strategy/data-api/log-endpoint)

### Changelog References

- [Feature Experimentation developer changelog](https://docs.developers.optimizely.com/feature-experimentation/changelog)
- [Feature Experimentation release notes](https://support.optimizely.com/hc/en-us/articles/7663600395021)
- NEEDS REVIEW: no Event API–specific deprecations page, version/sunset page or RSS feed found.

## FAQ

> This section will be populated with frequently asked questions as they arise.
