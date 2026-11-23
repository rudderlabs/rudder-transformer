# Statsig Business Logic

## Request

| Item     | Value                                                                   |
| -------- | ----------------------------------------------------------------------- |
| Method   | `POST`                                                                  |
| Endpoint | `https://api.statsig.com/v1/webhooks/rudderstack`                       |
| Headers  | `STATSIG-API-KEY: <Config.secretKey>`, `content-type: application/json` |
| Body     | The full RudderStack `message`, unchanged                               |

## Flow

1. `validateInput`: asserts `message.type` exists and is one of identify, track, group, page, alias, screen.
2. `buildResponse`: in batch mode returns the message itself; otherwise builds a `defaultRequestConfig()` response with the message as `body.JSON`.

There are no field mappings. Statsig maps the RudderStack payload server-side: `event`, `userId`, `properties.statsigCustomIDs`, `properties.statsigEnvironment`.

## Example

Input:

```json
{
  "type": "track",
  "event": "Checkout",
  "userId": "u1",
  "properties": { "value": 10, "statsigCustomIDs": ["companyID", "c1"] }
}
```

Output:

```json
{
  "method": "POST",
  "endpoint": "https://api.statsig.com/v1/webhooks/rudderstack",
  "headers": { "STATSIG-API-KEY": "<secretKey>", "content-type": "application/json" },
  "body": {
    "JSON": {
      "type": "track",
      "event": "Checkout",
      "userId": "u1",
      "properties": { "value": 10, "statsigCustomIDs": ["companyID", "c1"] }
    }
  }
}
```

## Error Handling

- Missing `message.type`: `message Type is not present. Aborting message.`
- Unsupported type: `message type <type> is not supported`
- Delivery errors are handled by rudder-server's default HTTP handling (no proxy).
