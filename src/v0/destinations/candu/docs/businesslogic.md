# Candu Business Logic

## Request

| Item     | Value                                                                     |
| -------- | ------------------------------------------------------------------------- |
| Method   | `POST`                                                                    |
| Endpoint | `https://api.candu.ai/api/eventWebhook`                                   |
| Headers  | `Authorization: Basic <base64(apiKey)>`, `Content-Type: application/json` |

## Field Mappings

### Identify (`data/CanduIdentify.json`)

| Source                     | Destination        | Required |
| -------------------------- | ------------------ | -------- |
| `traits`, `context.traits` | `traits`           | No       |
| generic `userIdOnly`       | `userId`           | No       |
| `anonymousId`              | `anonymousId`      | No       |
| `timestamp`                | `timestamp`        | No       |
| `messageId`                | `messageId`        | No       |
| constant                   | `type: "identify"` | -        |

### Track (`data/CanduTrack.json`)

| Source                     | Destination     | Required |
| -------------------------- | --------------- | -------- |
| `event`                    | `event`         | Yes      |
| `traits`, `context.traits` | `traits`        | No       |
| `properties`               | `properties`    | No       |
| generic `userIdOnly`       | `userId`        | No       |
| `anonymousId`              | `anonymousId`   | No       |
| `timestamp`                | `timestamp`     | No       |
| `messageId`                | `messageId`     | No       |
| constant                   | `type: "track"` | -        |

Both payloads get `context: { source: "RudderStack" }`. `userId` is cast to a string, and null/undefined values are removed.

## Example

Input:

```json
{
  "type": "track",
  "event": "Clicked",
  "userId": 42,
  "properties": { "plan": "pro" },
  "timestamp": "2024-01-01T00:00:00Z",
  "messageId": "m1"
}
```

Output body:

```json
{
  "event": "Clicked",
  "properties": { "plan": "pro" },
  "userId": "42",
  "timestamp": "2024-01-01T00:00:00Z",
  "messageId": "m1",
  "type": "track",
  "context": { "source": "RudderStack" }
}
```

## Error Handling

- `[CANDU]:: apiKey cannot be empty.` (ConfigurationError)
- `[CANDU]:: Message Type is not present. Aborting message.`
- `[CANDU]:: Message type <type> not supported.`
- Missing `event` on track fails the required mapping.
- Candu returns 204 on success, 400 for malformed payloads, 500 on processing errors. Handled by rudder-server's default HTTP handling.
