# Courier Business Logic

## Endpoint

| Event      | Method | Endpoint                                      |
| ---------- | ------ | --------------------------------------------- |
| `identify` | POST   | `https://api.courier.com/inbound/rudderstack` |
| `track`    | POST   | `https://api.courier.com/inbound/rudderstack` |

Headers: `Content-Type: application/json`, `Authorization: Bearer <apiKey>`.

## Flow

1. `process` checks that `message.type` is present and `Config.apiKey` is set.
2. The type is lowercased and dispatched:
   - `identify`: `identifyResponseBuilder` sets `payload.traits = message.traits || message.context.traits`. If both are missing it throws `traits is a required field for identify call`.
   - `track`: the message is used as-is.
   - anything else: `InstrumentationError`.
3. `responseBuilder` builds a POST request with `body.JSON = removeUndefinedAndNullValues(message)`.

## Field Mapping

There is no field mapping. The full RudderStack message (type, event, userId, anonymousId, properties, traits, context, timestamps, and so on) is the request body. Courier maps fields on its side.

## Example

Input:

```json
{
  "type": "identify",
  "userId": "user-1",
  "context": { "traits": { "email": "a@example.com", "name": "A" } }
}
```

Output:

```json
{
  "method": "POST",
  "endpoint": "https://api.courier.com/inbound/rudderstack",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer <apiKey>"
  },
  "body": {
    "JSON": {
      "type": "identify",
      "userId": "user-1",
      "context": { "traits": { "email": "a@example.com", "name": "A" } },
      "traits": { "email": "a@example.com", "name": "A" }
    }
  }
}
```

## Error Handling

| Condition               | Error                                                  |
| ----------------------- | ------------------------------------------------------ |
| Missing `message.type`  | `InstrumentationError: Event type is required`         |
| Missing `apiKey`        | `ConfigurationError: apiKey is required`               |
| identify without traits | `InstrumentationError: traits is a required field ...` |
| Unsupported type        | `InstrumentationError: Message type ... not supported` |

Delivery errors from Courier are handled by the server's default response handling (no proxy).

## Notes

- `identifyResponseBuilder` mutates the input message (`payload = message`) by adding `traits`. This has no effect on output correctness but differs from the usual pattern of building a new object.
