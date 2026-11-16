# New Relic Business Logic

## Request

| Item     | Value                                                                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Method   | `POST`                                                                                                                                                           |
| Endpoint | US: `https://insights-collector.newrelic.com/v1/accounts/<accountId>/events`<br>EU: `https://insights-collector.eu01.nr-data.net/v1/accounts/<accountId>/events` |
| Headers  | `Api-Key: <Config.insertKey>`, `Content-Type: application/json`                                                                                                  |
| Body     | A single event object                                                                                                                                            |

## Field Mappings

| Source                                    | Destination          | Notes                           |
| ----------------------------------------- | -------------------- | ------------------------------- |
| `properties.*` (flattened)                | top-level attributes | Always                          |
| `event`                                   | `event`              |                                 |
| generic `timestamp` path                  | `timestamp`          | Converted to seconds            |
| generic `userIdOnly` path                 | `userId`             | Only if `sendUserIdanonymousId` |
| `anonymousId`                             | `anonymousId`        | Only if `sendUserIdanonymousId` |
| `context.*` (flattened)                   | top-level attributes | Only if `sendDeviceContext`     |
| `Config.customEventType` or `rudderstack` | `eventType`          | Always set last                 |

## Flow

1. `validateInput`: `message.type` must exist and equal `track`.
2. `prepareContext`: picks the US or EU base URL and appends `<accountId>/events`.
3. `preparePayload`: flattens properties, adds `event` and `timestamp`.
4. `sendUserInfo` / `sendDeviceInfo`: optional, by config.
5. `handleReservedWords`: removes `accountId`, `appId`, `eventType`; quotes keys that are reserved NRQL words; converts booleans to strings.
6. `eventType`: sets `eventType`.
7. `cleanPayload`: removes null and undefined values.

## Example

Input:

```json
{
  "type": "track",
  "event": "Order Completed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "properties": { "order": { "id": "o1" }, "limit": 5, "paid": true }
}
```

Output body:

```json
{
  "order.id": "o1",
  "'limit'": 5,
  "paid": "true",
  "event": "Order Completed",
  "timestamp": 1704067200,
  "eventType": "rudderstack"
}
```

## Error Handling

- Missing type: `message Type is not present. Aborting message.`
- Non-track: `message type <type> is not supported`
- Delivery errors (for example 403 for a bad key, 413 for oversize payloads, 429 rate limit) are handled by rudder-server's default HTTP handling.
