# Heap Business Logic

## Endpoints

Host: `https://c.eu.heap-api.com` when `dataResidency === "eu"`, else `https://heapanalytics.com`.

| Message type | Endpoint                         | Method |
| ------------ | -------------------------------- | ------ |
| Identify     | `{host}/api/add_user_properties` | POST   |
| Track        | `{host}/api/track`               | POST   |

Headers: `Accept: application/json`, `Content-Type: application/json`. The response `userId` is `message.anonymousId`.

## Identify

| Source                                                                                                                 | Destination  |
| ---------------------------------------------------------------------------------------------------------------------- | ------------ |
| generic `userId` (`userId`, `traits.userId`, `traits.id`, `context.traits.userId`, `context.traits.id`, `anonymousId`) | `identity`   |
| `traits` or `context.traits`, flattened, `idempotencyKey` removed                                                      | `properties` |
| `Config.appId`                                                                                                         | `app_id`     |

## Track

| Source                                                 | Destination       |
| ------------------------------------------------------ | ----------------- |
| generic `userId`                                       | `identity`        |
| `properties`, flattened, `idempotencyKey` removed      | `properties`      |
| `Config.appId`                                         | `app_id`          |
| `event`                                                | `event`           |
| generic `timestamp` (`timestamp`, `originalTimestamp`) | `timestamp`       |
| `properties.idempotencyKey`                            | `idempotency_key` |

## Example

Input:

```json
{
  "type": "track",
  "userId": "u1",
  "event": "Purchase",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "properties": { "item": { "sku": "S1" }, "idempotencyKey": "k1" }
}
```

Output (`POST https://heapanalytics.com/api/track`):

```json
{
  "identity": "u1",
  "properties": { "item.sku": "S1" },
  "app_id": "<appId>",
  "event": "Purchase",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "idempotency_key": "k1"
}
```

## Validations and errors

- Workflow assertions: type missing or not identify/track; `traits are required` (identify); `event is required` (track); `userId is required` (no identity).
- Heap limits property keys and values to under 1024 characters; the integration does not truncate.
- No custom response handling.
