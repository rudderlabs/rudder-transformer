# WebEngage Destination

Implementation in **JavaScript** (`src/v0/destinations/webengage/`)

## Overview

Sends users (`identify`) and events (`track`, `page`, `screen`) to the WebEngage REST API.

## Configuration

Config keys from `schema.json` that the transformer reads (`destination.Config`):

| Key           | Required | Used for                                                                   |
| ------------- | -------- | -------------------------------------------------------------------------- |
| `licenseCode` | Yes      | WebEngage account license code, used in the URL path. In `secretKeys`.     |
| `apiKey`      | Yes      | Sent as `Authorization: Bearer <apiKey>`. In `secretKeys`.                 |
| `dataCenter`  | Yes      | `standard` (default) → `api.webengage.com`; `ind` → `api.in.webengage.com` |

### Authentication

```
Authorization: Bearer <apiKey>
Content-Type: application/json
```

**Auth change announced**: WebEngage states that "Support for Personal API Keys will be discontinued soon"
and recommends migrating to **Service Accounts**, which also issue Bearer tokens
([REST API Getting Started](https://docs.webengage.com/docs/rest-api-getting-started),
[Service Accounts](https://knowledgebase.webengage.com/docs/service-accounts)). No end date is published.
Customers using a personal admin key in `apiKey` must switch to a service account key before the cutoff.
The header format should not change. **NEEDS REVIEW**: confirm the cutoff date with WebEngage and update
the RudderStack setup docs and UI hint.

## Integration Functionalities

### Supported Message Types

`identify`, `track`, `page`, `screen` (cloud mode), from SDK, `cloud`, `shopify` and `warehouse` sources.

### Implementation

- **Implemented in**: JavaScript (v0)
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`). `processRouterDest`
  exists (`simpleProcessRouterDest`) but no batching.

### Validations

- `userId` or `anonymousId` is required for all types.
- Track requires `event` (`required: true` in the mapping). Page and screen build an event name.
- Identify: `birthDate` that formats to `Invalid date` fails with
  `birthday must be in this (YYYY-MM-DD) format`.
- Track: `eventTime` that formats to `Invalid date` fails.

### Rate Limits

| Endpoint          | Limit          |
| ----------------- | -------------- |
| User data update  | 5,000 / minute |
| Event data update | 5,000 / minute |

`429` when exceeded, with `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers
([source](https://docs.webengage.com/docs/rest-api-getting-started)).

### Batching Support

None. WebEngage has a Bulk User/Event API ([docs](https://docs.webengage.com/docs/bulk-user-api)) that
this destination does not use.

### Intermediate Calls

None.

### Proxy Delivery

No `networkHandler.js`. Not supported.

### User Deletion

No `deleteUsers.js`. Not supported.

### OAuth Support

No.

### Additional Functionalities

- Page and screen become track events with a generated name (see [docs/businesslogic.md](docs/businesslogic.md)).
- Unmapped identify traits go to `attributes`.

## General Queries

### Event Ordering

- **Identify**: Overwrites user attributes, so ordering matters.
- **Track / Page / Screen**: Sent with `eventTime` from the event timestamp, so ordering is not required.

### Data Replay Feasibility

- **Missing data**: Track, page and screen can be replayed (they keep their original `eventTime`). Identify
  replays can overwrite newer attributes.
- **Already delivered data**: Replaying events creates duplicates (no dedupe key is sent). Identify replays
  are idempotent.

### Multiplexing

No.

## Version Information

### Current Version

WebEngage REST API `v1`:

- Users: `POST https://{host}/v1/accounts/{licenseCode}/users`
- Events: `POST https://{host}/v1/accounts/{licenseCode}/events`

### Version Deprecation

No deprecation of `v1` has been announced. The auth deprecation of Personal API Keys (no date) applies, see
Authentication above.

### Latest Available Version

`v1` is the only documented REST API version.

WebEngage now also documents a **KSA** host (`api.ksa.webengage.com`) and an **EU (Frankfurt)** host
(`api.eug.webengage.com`). `dataCenter` only supports `standard` and `ind`, so KSA and EU accounts cannot
use this destination.

## Documentation Links

### API Documentation

- [REST API Getting Started](https://docs.webengage.com/docs/rest-api-getting-started)
- [REST API overview](https://docs.webengage.com/docs/rest-api-overview)
- [REST API troubleshooting](https://docs.webengage.com/docs/rest-api-troubleshooting)
- [Bulk User/Event API](https://docs.webengage.com/docs/bulk-user-api)
- [Service Accounts](https://knowledgebase.webengage.com/docs/service-accounts)

### Changelog References

- [WebEngage product updates](https://webengage.com/product-updates)
- [WebEngage product releases](https://webengage.com/releases/)
- [WebEngage releases RSS feed](https://webengage.com/releases/feed/)
- **NEEDS REVIEW**: no API-specific changelog or deprecations page was found.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
