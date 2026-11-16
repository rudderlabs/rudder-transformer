# Bloomreach Destination

Implementation in **CDK v2** (`procWorkflow.yaml`, `rtWorkflow.yaml`)

## Overview

Bloomreach Engagement (formerly Exponea) is a customer data and marketing automation platform. The RudderStack integration updates customer properties and tracks customer events through the Bloomreach Engagement Tracking API batch endpoint.

### Code Location

| Path                                  | Purpose                                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/cdk/v2/destinations/bloomreach/` | Live implementation (`cdkV2Enabled: true` in `db-config.json`, `cdkV2: true` in `src/features.ts`) |
| `src/v1/destinations/bloomreach/`     | `networkHandler.js` for proxy delivery with per-command results                                    |

This doc covers the `BLOOMREACH` destination only. Bloomreach Catalog (`bloomreach_catalog`) is a separate destination.

## Configuration

### Required Settings

- **API Base URL** (`apiBaseUrl`): Bloomreach Engagement API base URL (for example `https://api.exponea.com` or a custom instance URL).
- **API Key** (`apiKey`) and **API Secret** (`apiSecret`): Sent as HTTP Basic auth (`Basic base64(apiKey:apiSecret)`).
- **Project Token** (`projectToken`): Bloomreach project token, used in the endpoint path.
- **Hard ID** (`hardID`): Name of the Bloomreach hard ID (for example `registered`). Filled from `userId`.
- **Soft ID** (`softID`): Name of the Bloomreach soft ID (for example `cookie`). Filled from `anonymousId`.

Consent management settings are handled by rudder-server, not by this transformer.

## Integration Functionalities

> Bloomreach supports **Cloud mode** only.

### Supported Message Types

| Message type | Supported | Bloomreach command                                                       |
| ------------ | --------- | ------------------------------------------------------------------------ |
| Identify     | Yes       | `customers` (update customer properties)                                 |
| Track        | Yes       | `customers/events` with `event_type` = event name                        |
| Page         | Yes       | `customers/events` with `event_type` = `Viewed [category] [name] Page`   |
| Screen       | Yes       | `customers/events` with `event_type` = `Viewed [category] [name] Screen` |
| Others       | No        | `message type <type> is not supported`                                   |

From `db-config.json`: `"supportedMessageTypes": { "cloud": ["identify", "track", "page", "screen"] }`.

### Batching Support

- **Supported**: Yes, in the router (`rtWorkflow.yaml`).
- **Message types**: All. Identify and event commands are mixed in one batch.
- **Batch size**: Up to 50 commands per request (`MAX_BATCH_SIZE`), the Bloomreach batch limit.

### Intermediate Calls

- **None**.

### Proxy Delivery

- **Supported**: Yes. `src/v1/destinations/bloomreach/networkHandler.js` (`transformerProxy: true` in `src/features.ts`).
- **Partial batch handling**: Yes. On a 2xx response, each entry in `results` is matched to its event by position. `success: true` gives 200; `success: false` gives 400 (aborted) with the joined `errors` as the message.
- **Non-2xx**: `TransformerProxyError` with a dynamic error type (retryable for 5xx, throttled for 429, aborted for other 4xx) for the whole batch.

### User Deletion

- **Supported**: No. There is no `deleteUsers.js`.

### OAuth Support

- **Supported**: No. Authentication uses HTTP Basic auth with the API key and secret.

### Processor vs Router Destination

- **Type**: Router (`transformAtV1: "router"`). `src/features.ts` sets `BLOOMREACH: { routerTransform: true, cdkV2: true, transformerProxy: true }`.

### Additional Functionalities

- **Extra customer IDs**: `integrations.bloomreach.hardID` and `integrations.bloomreach.softID` (objects of `{ <id name>: <value> }`) are added to `customer_ids`, and override the config-based IDs with the same name.
- **`saveDestinationResponse: true`**: rudder-server stores the destination response.

### Validations

- `message.type` is required and must be identify, track, page or screen.
- All six config fields are required.
- `timestamp` or `originalTimestamp` is required.
- `userId` or `anonymousId` is required.
- Track: `event` is required.

### Rate Limits

| Limit                                                       | Source                                                                                                     |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 6,000 HTTP requests per minute per IP (100/second), default | [Tracking API overview](https://documentation.bloomreach.com/engagement/reference/tracking-api-overview-2) |
| 50 commands per batch request                               | [Batch commands](https://documentation.bloomreach.com/engagement/reference/batch-commands-2)               |
| Each command under 800 KB; each property value under 16 KB  | [Batch commands](https://documentation.bloomreach.com/engagement/reference/batch-commands-2)               |

Requests over the rate limit return 429 and are not saved.

## General Queries

### Event Ordering

- **Identify**: Bloomreach does not run batch commands in order, and asks integrations to use `update_timestamp` for customer updates when timing matters. The integration sets `update_timestamp` from the event timestamp. NEEDS REVIEW: whether Bloomreach ignores an update older than the stored value, which would make ordering unnecessary.
- **Track / Page / Screen**: Not required. Each event carries its own `timestamp`.

### Data Replay Feasibility

- **Missing data replay**:
  - Track / Page / Screen: Feasible. Events keep their original timestamp.
  - Identify: Feasible with caution (see the ordering note above).
- **Already delivered data replay**:
  - Events: Not recommended. No deduplication key is sent, so replays create duplicate events.
  - Identify: Customer updates overwrite properties, so replay is safe apart from the ordering risk.

### Multiplexing

- **No**. Each input event becomes one batch command.

## Version Information

### Current Version

- **Version:** `v2`
- **Where in code:** `config.ts` (`getBatchEndpoint`)

Bloomreach Engagement Tracking API batch endpoint: `{apiBaseUrl}/track/v2/projects/{projectToken}/batch`.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Tracking API overview](https://documentation.bloomreach.com/engagement/reference/tracking-api-overview-2)

Bloomreach is renaming Engagement to Marketing in the product UI ([Release 1.318](https://documentation.bloomreach.com/engagement/changelog/1318), 2026-09-16); the release notes say the service and functionality do not change. The Data hub [Tracking API](https://documentation.bloomreach.com/data-hub/reference/tracking-api-overview) (`/track/u/v1/batch`, stream-based auth) is a separate surface that this integration does not use.

### Latest Available Version

- **Version:** `v2`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Tracking API overview](https://documentation.bloomreach.com/engagement/reference/tracking-api-overview-2)

## Documentation Links

### API Documentation

- [Engagement API reference](https://documentation.bloomreach.com/engagement/reference/welcome)
- [About Engagement API](https://documentation.bloomreach.com/engagement/reference/about)
- [Authentication](https://documentation.bloomreach.com/engagement/docs/authentication)
- [Tracking API overview](https://documentation.bloomreach.com/engagement/reference/tracking-api-overview-2)
- [Batch commands](https://documentation.bloomreach.com/engagement/reference/batch-commands-2)

### Changelog References

- **Changelog:** [Bloomreach Engagement changelog](https://documentation.bloomreach.com/engagement/changelog)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** [Changelog RSS](https://documentation.bloomreach.com/engagement/changelog.rss)
- **Announcements:** None found
- **Last checked:** 2026-11-16

### RETL Functionality

See [docs/retl.md](docs/retl.md).

### Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
