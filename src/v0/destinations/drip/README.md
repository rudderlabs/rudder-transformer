# Drip Destination

Implementation in **JavaScript** (`src/v0/destinations/drip/`)

## Overview

Creates or updates Drip subscribers (`identify`), subscribes them to an email series campaign, and sends
custom events and Shopper Activity order events (`track`).

## Configuration

Config keys from `schema.json` that the transformer reads (`destination.Config`):

| Key                  | Required      | Used for                                                                                                                 |
| -------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `accountId`          | Yes           | Drip account ID in every URL path                                                                                        |
| `apiKey`             | Yes (in code) | Drip API token for Basic auth. In `secretKeys`. Not in `schema.json` `required`, but the code rejects events without it. |
| `campaignId`         | No            | Default email series campaign for identify (overridden by externalId `dripCampaignId`)                                   |
| `enableUserCreation` | No            | Default `true`. When `false`, track checks that the subscriber exists first.                                             |

`eventFilteringOption`, `whitelistedEvents` and `blacklistedEvents` are applied by rudder-server, not the
transformer.

### Authentication

```
Authorization: Basic base64(<apiKey>)
Content-Type: application/json
```

Drip documents token auth for private integrations as Basic auth with the API token as username and an
**empty password**, which is `base64("<token>:")`. The code encodes the token **without** the trailing
colon. **NEEDS REVIEW**: confirm Drip accepts this; the standard form is `base64(apiKey + ":")`.

Drip also offers OAuth 2 (Bearer) for public integrations. RudderStack uses token auth only. No deprecation
of token auth has been announced ([Drip API docs](https://developer.drip.com/)).

## Integration Functionalities

### Supported Message Types

`identify`, `track` (cloud mode; web device mode also exists).

### Implementation

- **Implemented in**: JavaScript (v0)
- **Processor vs Router**: Router destination (`transformAtV1: "router"`, `DRIP: { routerTransform: true }`).
  `processRouterDest` uses `simpleProcessRouterDest` (no batching).

### Validations

- Identify: externalId `dripId` or a valid email is required. An invalid email is logged and dropped
  (set to `null`), not rejected.
- Track: externalId `dripId` or a valid email (`properties.email`, `traits.email`, `context.traits.email`)
  and `event` are required.
- Order events: `properties.affiliation` (`provider`) and `properties.order_id` are required by the mapping.
- `occurred_at` that is not ISO-8601 is dropped.
- Custom field keys must match `^\w+$`; objects longer than 910 characters and values longer than 1,000
  characters are dropped.
- Products without `name` and `price` are dropped from `items`.

### Rate Limits

3,600 requests per hour for individual endpoints, 50 per hour for batch endpoints (up to 1,000 records per
batch). `429` when exceeded ([Drip API docs](https://developer.drip.com/)).

### Batching Support

None. Drip's batch endpoints (`/subscribers/batches`, `/events/batches`, `/shopper_activity/order/batch`)
are not used.

### Intermediate Calls

| Flow                                                       | Call                                      | Why                                                                |
| ---------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| Identify with a campaign ID and a valid email              | `POST /v2/{accountId}/subscribers`        | Create or update the subscriber before subscribing to the campaign |
| Track when `enableUserCreation` is `false` and no `dripId` | `GET /v2/{accountId}/subscribers/{email}` | Make sure the subscriber exists before sending the event           |

### Proxy Delivery

No `networkHandler.js`. Not supported.

### User Deletion

No `deleteUsers.js`. Not supported.

### OAuth Support

No (no `auth` block in `db-config.json`).

## General Queries

### Event Ordering

- **Identify**: Updates subscriber fields, tags and status, so ordering matters.
- **Track / order events**: Carry `occurred_at`, so ordering is not required. A track sent before its
  identify can create a bare subscriber when `enableUserCreation` is on.

### Data Replay Feasibility

- **Missing data**: Track events keep `occurred_at` and can be replayed. Identify replays can overwrite newer
  data.
- **Already delivered data**: Custom events duplicate on replay. Shopper Activity order events are keyed by
  `order_id` plus `action`, so replays update the same order. **NEEDS REVIEW**: confirm Drip's dedupe
  behaviour for order events.

### Multiplexing

Yes, for identify with a campaign: the subscriber upsert is done as an intermediate call inside the
transformer, and the returned request subscribes the email to the campaign. Only one request is returned.

## Version Information

### Current Version

- **API:** Drip REST API
- **Version:** `v2`
- **Where in code:** `transform.js` (`${ENDPOINT}/v2/...` for subscribers, campaign subscribers and events), `util.js` (subscriber lookup); base URL in `config.js` (`ENDPOINT`)

- **API:** Drip Shopper Activity API
- **Version:** `v3`
- **Where in code:** `transform.js` (`${ENDPOINT}/v3/${Config.accountId}/shopper_activity/order`)

### Version Deprecation

- **API:** Drip REST API
- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Drip REST API reference](https://developer.drip.com/)

- **API:** Drip Shopper Activity API
- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Shopper Activity overview](https://developer.drip.com/#shopper_activity_overview)

Drip marks the legacy **v2 Orders** batch endpoint as superseded by v3 Shopper Activity ("We will give fair notice before we retire it"); this destination already uses v3 for orders.

### Latest Available Version

- **API:** Drip REST API
- **Version:** `v2`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Drip REST API reference](https://developer.drip.com/)

- **API:** Drip Shopper Activity API
- **Version:** `v3`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Shopper Activity overview](https://developer.drip.com/#shopper_activity_overview)

Drip added a Metrics API in April/May 2026, which is not relevant here.

## Documentation Links

### API Documentation

- [Drip REST API reference](https://developer.drip.com/)
- [Authentication](https://developer.drip.com/#authentication)
- [Create or update a subscriber](https://developer.drip.com/#create-or-update-a-subscriber)
- [Fetch a subscriber](https://developer.drip.com/#fetch-a-subscriber)
- [Subscribe someone to an email series campaign](https://developer.drip.com/#subscribe-someone-to-an-email-series-campaign)
- [Record an event](https://developer.drip.com/#record-an-event)
- [Shopper Activity: create or update an order](https://developer.drip.com/#sapi-create-or-update-order)

### Changelog References

- **Changelog:** [Drip release notes](https://www.drip.com/release-notes) (blocks automated requests)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Drip publishes no developer changelog, deprecations page or RSS feed. The product release notes occasionally announce API additions.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
