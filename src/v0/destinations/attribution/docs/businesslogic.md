# Attribution Business Logic

## Request

- Method: `POST`
- Endpoint: `https://track.attributionapp.com/v1/import`
- Headers: `Content-Type: application/json`, `Authorization: Basic base64("{writeKey}:")`
- Body: `{ "batch": [transformedMessage] }`

## Transformation (`getTransformedJSON`)

The whole RudderStack message is forwarded with three changes:

| Field       | Handling                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `traits`    | Set to `getFieldValueFromMessage(message, 'traits')` (`traits` or `context.traits`); `traits.anonymousId` deleted. |
| `timestamp` | Set from generic timestamp paths (`timestamp`, `originalTimestamp`).                                               |
| everything  | `removeUndefinedAndNullValues` at the top level.                                                                   |

All other fields (`type`, `event`, `properties`, `userId`, `anonymousId`, `messageId`, `context`, `integrations`, ...) are passed through.

## Example

Input:

```json
{
  "type": "track",
  "event": "Order Completed",
  "userId": "u1",
  "anonymousId": "a1",
  "messageId": "m1",
  "properties": { "revenue": 25 },
  "originalTimestamp": "2026-01-01T00:00:00.000Z"
}
```

Output body:

```json
{
  "batch": [
    {
      "type": "track",
      "event": "Order Completed",
      "userId": "u1",
      "anonymousId": "a1",
      "messageId": "m1",
      "properties": { "revenue": 25 },
      "originalTimestamp": "2026-01-01T00:00:00.000Z",
      "timestamp": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

## Error Handling

Only `InstrumentationError` (missing type) and `ConfigurationError` (missing `writeKey`). Delivery errors are handled by rudder-server defaults.

## Notes

- `getTransformedJSON` deletes `anonymousId` from the traits object it reads, which mutates the input message's traits.
- Attribution needs a `page` with URL and referrer per visit, an `identify` with email, and a `track` per conversion ([Attribution docs](https://docs.attributionapp.com/docs/rudderstack)).

## General Use Cases

Multi-touch attribution of marketing spend to conversions and revenue.
