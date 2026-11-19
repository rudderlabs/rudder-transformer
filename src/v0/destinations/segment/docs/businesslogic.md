# Segment Business Logic

## Endpoint

`POST https://api.segment.io/v1/batch`

Headers: `Content-Type: application/json`, `Authorization: Basic base64("<writeKey>:")`.

## Flow (all message types)

1. Read `writeKey` from config and `userId` from the message.
2. Build one event object (`getTransformedJSON`). `anonymousId` is removed from traits.
3. Drop null/undefined fields and wrap it as `{ "batch": [event] }`.

## Mapping

| Segment field | Source                                                            |
| ------------- | ----------------------------------------------------------------- |
| `type`        | `message.type`                                                    |
| `userId`      | `userId` (generic lookup)                                         |
| `anonymousId` | `message.anonymousId`                                             |
| `event`       | `message.event`                                                   |
| `traits`      | `traits` / `context.traits` (generic lookup), minus `anonymousId` |
| `properties`  | `message.properties`                                              |
| `timeStamp`   | `timestamp` / `originalTimestamp` (generic lookup)                |

Not forwarded: `messageId`, `context`, `groupId`, `previousId`, `name`, `category`, `integrations`, `sentAt`.

Note: `timeStamp` is not a Segment field. Segment expects `timestamp`. NEEDS REVIEW (likely bug).

## Example

Input:

```json
{
  "type": "track",
  "userId": "u1",
  "anonymousId": "a1",
  "event": "Order Completed",
  "properties": { "revenue": 20 },
  "originalTimestamp": "2024-01-01T00:00:00.000Z"
}
```

Output body:

```json
{
  "batch": [
    {
      "anonymousId": "a1",
      "type": "track",
      "userId": "u1",
      "event": "Order Completed",
      "properties": { "revenue": 20 },
      "timeStamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Error Handling

No custom error handling. No validations throw. Delivery errors (400 for invalid payloads, 429 rate limit) are handled by the server's default HTTP handling. Segment returns 200 for most requests even when individual events are invalid.

## Use Cases

- Forward data from RudderStack into an existing Segment workspace during a migration or for tools that only connect to Segment.
