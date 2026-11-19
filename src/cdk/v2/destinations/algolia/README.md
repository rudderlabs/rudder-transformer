# Algolia Destination

Implementation in **CDK v2** (`procWorkflow.yaml`, `rtWorkflow.yaml`)

## Overview

Algolia is a hosted search and discovery platform. The RudderStack integration sends click, view and conversion events to the Algolia Insights API, which powers Click and Conversion Analytics, A/B testing, Personalization, Dynamic Re-Ranking and Recommend.

### Code Location

| Path                               | Purpose                                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/cdk/v2/destinations/algolia/` | Live implementation (`cdkV2Enabled: true` in `db-config.json`, `cdkV2: true` in `src/features.ts`)                                                     |
| `src/v0/destinations/algolia/`     | `config.js` and `util.js` are used by the CDK workflow (endpoint, batch size, validators). `transform.js` is the old JS implementation and is not used |
| `src/v1/destinations/algolia/`     | `networkHandler.js` for proxy delivery                                                                                                                 |

## Configuration

### Required Settings

- **API Token** (`apiKey`): Sent as `X-Algolia-API-Key`. Needs the `search` ACL.
- **Application ID** (`applicationId`): Sent as `X-Algolia-Application-Id`.

### Optional Settings

- **Event Name to Event Type Mapping** (`eventTypeSettings`): List of `{ from, to }` pairs that map a RudderStack event name to an Algolia event type (`click`, `view`, `conversion`). Matching is case-insensitive.

NEEDS REVIEW: `apiKey` and `applicationId` are in `ui-config.json` and `db-config.json` but not in `schema.json`, so the schema does not require or validate them. The workflow checks them at transform time.

Consent management settings are handled by rudder-server, not by this transformer.

## Integration Functionalities

> Algolia supports **Cloud mode** only.

### Supported Message Types

| Message type | Supported | Destination action                             |
| ------------ | --------- | ---------------------------------------------- |
| Track        | Yes       | Insights event (`click`, `view`, `conversion`) |
| Others       | No        | `message type <type> not supported`            |

From `db-config.json`: `"supportedMessageTypes": { "cloud": ["track"] }`.

### Batching Support

- **Supported**: Yes, in the router (`rtWorkflow.yaml`).
- **Batch size**: Up to 1000 events per request (`MAX_BATCH_SIZE`), the Insights API maximum.
- **`dontBatch`**: Events with `metadata.dontBatch: true` are sent one per request.

### Intermediate Calls

- **None**.

### Proxy Delivery

- **Supported**: Yes. `src/v1/destinations/algolia/networkHandler.js` (`transformerProxy: true` in `src/features.ts`).
- **Partial batch handling**: Algolia rejects the whole batch when one event is invalid, and does not say which one. The handler works around this:
  - 2xx: every event succeeds.
  - 4xx: every event in the batch gets status 500 and `dontBatch: true`, so rudder-server retries each event in its own request. When an event that already has `dontBatch: true` fails, it gets the real 4xx status and is aborted.
  - Other statuses (5xx and so on): `TransformerProxyError` with a dynamic error type.

### User Deletion

- **Supported**: No. There is no `deleteUsers.js`.

### OAuth Support

- **Supported**: No. Authentication uses the Application ID and API key headers.

### Processor vs Router Destination

- **Type**: Router (`transformAtV1: "router"`). `src/features.ts` sets `ALGOLIA: { routerTransform: true, cdkV2: true, transformerProxy: true }`.

### Additional Functionalities

- **Product expansion**: For `product list viewed` and `order completed`, `objectIDs` (and `positions` for click, `objectData` for conversion) are built from `properties.products`.
- **Lenient cleaning**: Some invalid values are dropped with a log message instead of failing the event (non-array `filters` or `objectIds`, a malformed `queryId`, a `timestamp` older than 4 days).
- **`saveDestinationResponse: true`**: rudder-server stores the destination response.

### Validations

- `message.type` must be `track`; `event` is required and must be a string.
- `apiKey` and `applicationId` are required.
- `properties.index` is required.
- An event type is required, from `properties.eventType` or `eventTypeSettings`, and must be `click`, `view` or `conversion`.
- The event must have `filters` or `objectIDs` (non-empty), but not both.
- Click events: `objectIDs` and `positions` must be the same length; `positions` and `queryID` must both be present or both be absent (unless `filters` is used).
- Conversion events with product `price`, `quantity` or `discount` need `properties.currency`.
- `objectIDs` and `positions` are cut to 20 items, `filters` to 10.

### Rate Limits

- **Push events** (`POST /1/events`): Up to 1000 events per request, body under 2 MB ([Push events](https://www.algolia.com/doc/rest-api/insights/push-events)).
- Requests over Algolia's rate limits return 429. NEEDS REVIEW: Algolia does not publish a numeric request rate limit for the Insights API.

## General Queries

### Event Ordering

- **Not required**. Insights events are independent. When `properties.timestamp` is sent (and is less than 4 days old), Algolia uses it as the event time.

### Data Replay Feasibility

- **Missing data replay**: Feasible for events less than 4 days old. Older timestamps are removed by the transformer, so Algolia records the replayed event at receipt time, which can skew analytics and model training. The 4-day window follows Algolia's limit on event timestamps.
- **Already delivered data replay**: Not recommended. No deduplication key is sent, so replays create duplicate events.

### Multiplexing

- **No**. Each input event becomes one Insights event.

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `src/v0/destinations/algolia/config.js` (`ENDPOINT`, `https://insights.algolia.io/1/events`), bound into `procWorkflow.yaml` and `rtWorkflow.yaml`

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Insights REST API](https://www.algolia.com/doc/rest-api/insights)

The Insights API reference states that `/1/` is the current version. No deprecation notice for Insights API v1 was found in the Algolia changelog.

### Latest Available Version

- **Version:** `v1`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Insights REST API](https://www.algolia.com/doc/rest-api/insights)

## Documentation Links

### API Documentation

- [Insights REST API](https://www.algolia.com/doc/rest-api/insights)
- [Push events](https://www.algolia.com/doc/rest-api/insights/push-events)
- [Event types](https://www.algolia.com/doc/guides/sending-events/concepts/event-types)
- [API keys (authentication)](https://www.algolia.com/doc/guides/security/api-keys)

### Changelog References

- **Changelog:** [Algolia changelog](https://changelog.algolia.com/) (filter by the "API & Libraries" and "Events" labels)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** [Changelog RSS](https://changelog.algolia.com/rss.xml); [Changelog Atom](https://changelog.algolia.com/atom.xml)
- **Announcements:** None found
- **Last checked:** 2026-11-16

### RETL Functionality

See [docs/retl.md](docs/retl.md).

### Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
