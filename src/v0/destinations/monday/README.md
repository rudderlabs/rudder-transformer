# monday.com Destination

Implementation in **JavaScript**:

- Transform: `src/v0/destinations/monday/` (`transform.js`, `util.js`, `config.js`)
- Proxy response handler: `src/v1/destinations/monday/networkHandler.js` (the v1 folder holds only the network handler)

monday.com receives track events as new items on a board, through the monday GraphQL API.

## Configuration

### Required Settings

- **API Token** (`apiToken`): monday.com personal API token. Secret.
- **Board Id** (`boardId`): Board where items are created. Can be overridden per event with an `externalId` of type `boardId`.

### Optional Settings

- **Group Title** (`groupTitle`): Group (by title) in which to create the item. When set, `properties.name` is required.
- **Column to Property Mapping** (`columnToPropertyMapping`): List of `{ from: <column title>, to: <property key> }`.
- **Allowlisted Events** (`whitelistedEvents`): List of `{ eventName }`. Only these track events are sent (case-insensitive). Events not on the list are dropped with a configuration error. An empty list drops every event.
- Consent management settings (handled outside this transformer).

## Integration Functionalities

> monday.com supports **Cloud mode** only.

### Supported Message Types

- **Track** only.

### Implementation

- **Implemented in**: JavaScript (v0 transform, v1 proxy handler)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router destination (`transformAtV1: "router"`; `MONDAY: { routerTransform: true }` in `src/features.ts`).

### Authentication

- Header `Authorization: <apiToken>` (raw token, no `Bearer` prefix), on both the board lookup and the `create_item` call.
- No OAuth.
- No `API-Version` header is sent, so every call uses monday's **Current** API version, which changes each quarter. See [Version Information](#version-information).
- **Auth changes announced by monday.com**: none found for personal API tokens. The [authentication docs](https://developer.monday.com/api-reference/docs/authentication) still describe personal tokens in the `Authorization` header. Personal tokens have a larger complexity budget (10M points per minute shared across reads and writes) than app tokens.

### Batching Support

- **Supported**: No. Each event becomes one `create_item` mutation.

### Intermediate Calls

- **Track**: Before building the mutation, the transformer calls `POST https://api.monday.com/v2` with
  `query { boards (ids: <boardId>) { name, columns {id title type settings_str}, groups {id title} } }`.
  This fetches column ids and types (to format column values) and group ids (to resolve `groupTitle`). It runs for every event; there is no cache.

### Proxy Delivery

- **Supported**: Yes. `src/v1/destinations/monday/networkHandler.js` (proxy v1). Tests: `test/integrations/destinations/monday/dataDelivery/`.
- `MONDAY` has no `transformerProxy` entry in `src/features.ts`. NEEDS REVIEW: confirm in rudder-server config that proxy is enabled for monday.
- **Partial batching**: Not applicable (no batching). The handler returns one status per request.
- GraphQL errors that monday returns with HTTP 200 are aborted with status 400 unless the body has a top-level `status_code`. HTTP 429 and 5xx are retried.

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: No.

### Additional Functionalities

- Column values are formatted by monday column type (color/status, checkbox, numbers, text, country, email, location, phone, rating, link, long text, timezone). See [docs/businesslogic.md](docs/businesslogic.md).
- Event allowlist (`whitelistedEvents`).

### Validations

- `apiToken` is required.
- `event` must be a valid event name (`validateEventName`).
- A board id is required, from `externalId` (`boardId`) or config.
- The event must be on the allowlist.
- The board must exist (lookup returns at least one board).
- Every mapped column title must exist on the board.
- With `groupTitle`, `properties.name` is required and the group must exist.

### Rate Limits

From [monday rate limits](https://developer.monday.com/api-reference/docs/rate-limits):

| Limit                              | Value                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------- |
| Requests per minute                | Enterprise 5,000, Pro 2,500, other plans 1,000                            |
| Concurrency                        | Enterprise 250, Pro 100, other 40                                         |
| Complexity budget (personal token) | 10M points per minute, shared by reads and writes (1M for trial and free) |
| Daily calls                        | Free 200, Standard/Basic 1,000, Pro 10,000, Enterprise 25,000             |
| IP limit                           | 5,000 requests per 10 seconds                                             |

Rate-limit errors return HTTP 429 with a `Retry-After` header. Each RudderStack event costs two calls (lookup and mutation).

## General Queries

### Event Ordering

- Not required. Each event creates a new item; nothing is updated.

### Data Replay Feasibility

- **Missing data**: Replay is possible. Items are created at delivery time; the event timestamp is not sent.
- **Already delivered data**: Replay creates duplicate items. `create_item` is not idempotent as used here.

### Multiplexing

- No. One event produces one delivered request. The board lookup is an intermediate call, not a delivered event.

## Version Information

### Current Version

- Endpoint `https://api.monday.com/v2` (GraphQL API v2).
- No `API-Version` header is sent. Per [API versioning](https://developer.monday.com/api-reference/docs/api-versioning), such calls get the **Current** version: `2026-10` since October 26, 2026.

### Version Deprecation

- Because the version is not pinned, the integration moves to the new Current version every quarter. `2027-01` becomes Current on January 15, 2027.
- Versions `2024-10` and `2025-01` were deprecated on February 15, 2026 ([announcement](https://developer.monday.com/api-reference/changelog/deprecating-versions-2025-01-and-2024-10-on-february-15th-2026)). monday announces each deprecation at least six months ahead.
- The board lookup requests `columns { settings_str }`. monday announced the deprecation of `settings_str` on columns on September 23, 2025 ([changelog](https://developer.monday.com/api-reference/changelog/deprecating-settings_str-field-on-columns)). The code does not use this field. If it is removed from a future Current version, the lookup query fails and every event fails. NEEDS REVIEW: confirm the removal version and drop `settings_str` from the query.

### Latest Available Version

- Current: `2026-10`. Release candidate: `2027-01`.
- Recommended: pin `API-Version` in the request headers to avoid unannounced behaviour changes.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [monday API: create_item and items](https://developer.monday.com/api-reference/reference/items)
- [monday API: authentication](https://developer.monday.com/api-reference/docs/authentication)
- [monday API: rate limits](https://developer.monday.com/api-reference/docs/rate-limits)
- [monday API: errors](https://developer.monday.com/api-reference/docs/errors)
- [RudderStack docs: monday destination](https://www.rudderstack.com/docs/destinations/streaming-destinations/monday/)

### Changelog References

- Developer changelog: [https://developer.monday.com/api-reference/changelog](https://developer.monday.com/api-reference/changelog)
- Changelog RSS feed: [https://developer.monday.com/api-reference/changelog.rss](https://developer.monday.com/api-reference/changelog.rss)
- API versions, release schedule and deprecation dates: [https://developer.monday.com/api-reference/docs/api-versioning](https://developer.monday.com/api-reference/docs/api-versioning)
- Latest version announcement: [2026-10 is now the current API version](https://developer.monday.com/api-reference/changelog/2026-10-is-now-the-current-api-version)

## FAQ

_No entries yet._
