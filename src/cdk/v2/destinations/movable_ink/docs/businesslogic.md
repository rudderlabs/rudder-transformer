# Movable Ink Business Logic

## Request Flow

1. `rtWorkflow.yaml` runs `procWorkflow.yaml` per event with `batchMode: true`.
2. `procWorkflow.yaml` validates the event and builds the payload.
3. Successful payloads are chunked (max 1000 events, max 1,000,000 bytes) and wrapped as `{ "events": [...] }`.
4. Failed events are returned individually via `handleRtTfSingleEventError`.

Outside batch mode (processor path), a single request is built with the same payload as the body.

## API Endpoint

| Event type      | Method | Endpoint                      | Auth                                   |
| --------------- | ------ | ----------------------------- | -------------------------------------- |
| Identify, Track | POST   | `destination.Config.endpoint` | `Basic base64(accessKey:accessSecret)` |

Headers: `Content-Type: application/json`, `Authorization: Basic ...`.

## Field Mappings

The payload is the full RudderStack message with these fields overwritten:

| Destination field | Source                                                                     | Notes                             |
| ----------------- | -------------------------------------------------------------------------- | --------------------------------- |
| `userId`          | generic `userIdOnly` paths, falling back to generic `email` paths          | Email used when no userId         |
| `timestamp`       | generic `timestamp` paths (`timestamp`, `originalTimestamp`)               | Converted to Unix milliseconds    |
| `anonymousId`     | `anonymousId`                                                              |                                   |
| everything else   | copied from the message (`event`, `properties`, `context`, `traits`, etc.) | Movable Ink drops unmapped fields |

## Validations

| Rule                                                                           | Error                                                             |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `type` present and is `identify` or `track`                                    | `message Type is not present` / `message type X is not supported` |
| `endpoint`, `accessKey`, `accessSecret` configured                             | Configuration error                                               |
| `timestamp` or `originalTimestamp` present                                     | `Timestamp is not present. Aborting`                              |
| Track has `event`                                                              | `Event name is not present. Aborting`                             |
| one of userId / email / anonymousId                                            | `Either one of userId or email or anonymousId is required`        |
| `Products Searched` has `properties.query`                                     | `Missing 'query' property in properties`                          |
| `Product Added/Removed/Viewed`, `Category Viewed` have `properties.product_id` | `Missing 'product_id' property in properties`                     |

## Example

Input (track):

```json
{
  "type": "track",
  "event": "Product Viewed",
  "userId": "user-1",
  "anonymousId": "anon-1",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "properties": { "product_id": "p-1", "price": 10 }
}
```

Batched output body:

```json
{
  "events": [
    {
      "type": "track",
      "event": "Product Viewed",
      "userId": "user-1",
      "anonymousId": "anon-1",
      "timestamp": 1704067200000,
      "properties": { "product_id": "p-1", "price": 10 }
    }
  ]
}
```

## Error Handling

- Validation failures are instrumentation or configuration errors (HTTP 400 to rudder-server) and are not retried.
- No proxy delivery; partner HTTP responses are handled by rudder-server's default status-code logic.

## Use Cases

- Feed web/app behavior (product views, cart adds, searches) into Movable Ink to personalize email content and recommendations.
