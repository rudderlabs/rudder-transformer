# monday.com Business Logic

## Endpoints

| Step                  | Call                                                                                                                                        | Purpose                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Lookup (intermediate) | `POST https://api.monday.com/v2` with `query { boards (ids: <boardId>) { name, columns {id title type settings_str}, groups {id title} } }` | Get column ids/types and group ids |
| Delivery              | `POST https://api.monday.com/v2` with `mutation { create_item (board_id: ..., item_name: ..., column_values: ..., group_id: ...) {id}}`     | Create the item                    |

Headers on both: `Content-Type: application/json`, `Authorization: <apiToken>`.

## Track Flow

1. Check `message.type` and `apiToken`.
2. Validate `event` with `validateEventName`.
3. Board id: `externalId` of type `boardId`, else `Config.boardId`. Missing board id throws a `ConfigurationError`.
4. Check the event against `whitelistedEvents` (case-insensitive). Not listed: `ConfigurationError` "Event Discarded. To allow this event, add this in Allowlist".
5. Board lookup. Non-200: `NetworkError` with the response status. Empty `boards`: `ConfigurationError`.
6. Build `column_values` from `columnToPropertyMapping`.
7. Build the mutation:
   - `board_id: <boardId>`
   - `item_name: JSON.stringify(properties.name)`
   - `column_values: JSON.stringify(JSON.stringify(columnValues))` (a JSON string inside the GraphQL string)
   - `group_id: "<id>"` when `groupTitle` is set and found.

## Column Value Mapping

For each `{ from: <column title>, to: <property key> }`, the column id is looked up by title and the value formatted by column type. A value is set only when `properties[to]` is truthy.

| Column type          | Output value                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `color` (status)     | `{ "label": value }`                                                                                     |
| `boolean` (checkbox) | `{ "checked": true }` (always true when the property is truthy)                                          |
| `numeric`            | value as is                                                                                              |
| `text`               | value as is                                                                                              |
| `country`            | `{ "countryName": value, "countryCode": properties.countryCode }`, only if `countryCode` exists          |
| `email`              | `{ "email": value, "text": properties.emailText or value }`                                              |
| `location`           | `{ "address": value, "lat": properties.latitude, "lng": properties.longitude }`, only with valid lat/lng |
| `phone`              | `{ "phone": value, "countryShortName": properties.countryShortName }`, only if `countryShortName` exists |
| `rating`             | `parseInt(value)`                                                                                        |
| `link`               | `{ "url": value, "text": properties.linkText or value }`                                                 |
| `long-text`          | `{ "text": value }`                                                                                      |
| `timezone`           | `{ "timezone": value }`                                                                                  |
| other                | not set                                                                                                  |

## Example

Config: `boardId: "123"`, `groupTitle: "Leads"`, `columnToPropertyMapping: [{ from: "Status", to: "status" }]`, `whitelistedEvents: [{ eventName: "Lead Created" }]`.

Input:

```json
{
  "type": "track",
  "event": "Lead Created",
  "properties": { "name": "Acme", "status": "Working on it" }
}
```

Mutation sent (column id `status`, group id `topics`):

```
mutation { create_item (board_id: 123, item_name: "Acme", column_values: "{\"status\":{\"label\":\"Working on it\"}}", group_id: "topics") {id}}
```

## Proxy Response Handling (`src/v1/destinations/monday/networkHandler.js`)

- HTTP 2xx with no `error_message`, `error_code` or `errors` in the body: success.
- HTTP 2xx with any of those: status = body `status_code` or 400. If that status is 500 or 429, a `TransformerProxyError` is thrown so the job is retried.
- Non-2xx: `TransformerProxyError` with the HTTP status (429 and 5xx retried, 4xx aborted).

## Error Handling

| Case                                       | Error                             |
| ------------------------------------------ | --------------------------------- |
| Missing `type`                             | `InstrumentationError`            |
| Non-track type                             | `InstrumentationError`            |
| Missing `apiToken` / board id              | `ConfigurationError`              |
| Event not allowlisted                      | `ConfigurationError`              |
| Board not found                            | `ConfigurationError`              |
| Column or group title not on board         | `ConfigurationError`              |
| `groupTitle` set without `properties.name` | `InstrumentationError`            |
| Lookup non-200                             | `NetworkError` with lookup status |

## Known Issues (NEEDS REVIEW)

- Without `groupTitle`, a missing `properties.name` is not caught. The mutation then contains `item_name: undefined` and monday rejects it.
- Checkbox columns are always set to checked, even when the property is `false` (falsy values skip the column, truthy values set `checked: true`).
- The numeric and rating checks use `isNumber(parseInt(...))`, which is true for `NaN`, so non-numeric strings pass through.
- `boardId` (which can come from the event's `externalId`) is put into the GraphQL query without escaping.
- In the proxy handler's non-2xx branch, `metadata` is the whole `rudderJobMetadata` array, not `rudderJobMetadata[0]` as in the success branch.
- The handler reads a top-level `status_code`. Current monday error bodies put it in `errors[].extensions.status_code`, so application errors returned with HTTP 200 are always aborted as 400.
- `settings_str` is requested but unused and is deprecated by monday (see README).

## Use Cases

Creating board items (leads, tickets, tasks) in monday.com from product or marketing events.
