# Factors AI Business Logic

## Endpoint and Request

| Item        | Value                                                                                 |
| ----------- | ------------------------------------------------------------------------------------- |
| Endpoint    | `POST https://api.factors.ai/integrations/rudderstack_platform`                       |
| Body format | JSON                                                                                  |
| Headers     | `Content-Type: application/json`, `Authorization: Basic base64("<factorsAIApiKey>:")` |
| Null values | Removed with `removeUndefinedAndNullValues`                                           |

All message types use the same endpoint.

## Field Mappings

Mappings live in `src/v0/destinations/factorsai/data/`.

### Identify (`FactorsAIIdentifyConfig.json`)

| Source                    | Destination   | Required |
| ------------------------- | ------------- | -------- |
| `userId`                  | `userId`      | No       |
| `anonymousId`             | `anonymousId` | No       |
| `timestamp` (generic map) | `timestamp`   | Yes      |
| `traits`                  | `traits`      | No       |
| `type`                    | `type`        | Yes      |
| `messageId`               | `messageId`   | No       |
| `channel`                 | `channel`     | No       |
| `context`                 | `context`     | No       |

### Track (`FactorsAITrackConfig.json`)

| Source                            | Destination              | Required |
| --------------------------------- | ------------------------ | -------- |
| `userId`, `anonymousId`           | same                     | No       |
| `timestamp` (generic map)         | `timestamp`              | Yes      |
| `event`                           | `event`                  | Yes      |
| `type`                            | `type`                   | Yes      |
| `properties`                      | `properties` (flattened) | No       |
| `messageId`, `channel`, `context` | same                     | No       |

`context` is listed twice in this mapping file. This has no effect on output.

### Page (`FactorsAIPageConfig.json`)

| Source                    | Destination                  | Required |
| ------------------------- | ---------------------------- | -------- |
| `userId`, `anonymousId`   | same                         | No       |
| `timestamp` (generic map) | `timestamp`                  | Yes      |
| `name`                    | `name`                       | No       |
| `properties`              | `properties` (not flattened) | No       |
| `messageId`, `context`    | same                         | No       |

`type` is set to `message.type` after mapping.

### Group (`FactorsAIGroupConfig.json`)

| Source                    | Destination | Required |
| ------------------------- | ----------- | -------- |
| `userId`, `anonymousId`   | same        | No       |
| `timestamp` (generic map) | `timestamp` | Yes      |
| `groupId`                 | `groupId`   | Yes      |
| `traits`                  | `traits`    | No       |
| `email`                   | `email`     | No       |
| `messageId`, `context`    | same        | No       |

`type` is set to `message.type` after mapping. Note that `email` is read from the root of the message, not from `traits`, so it is usually empty.

## Flow

1. `process` reads `factorsAIApiKey` and lower-cases `message.type`.
2. The payload is built with `constructPayload` for that type.
3. `populateIpDetails` sets `context.ip` from `context.ip` or `request_ip` when either `context` or `request_ip` exists.
4. Track flattens `properties`. Page and Group add `type`.
5. `buildResponse` adds the endpoint and Basic auth header.

## Example

Input (track):

```json
{
  "type": "track",
  "event": "Order Completed",
  "userId": "u1",
  "anonymousId": "a1",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "properties": { "order": { "id": "o1", "total": 10 } },
  "context": { "ip": "1.2.3.4" }
}
```

Output body:

```json
{
  "userId": "u1",
  "anonymousId": "a1",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "event": "Order Completed",
  "type": "track",
  "properties": { "order.id": "o1", "order.total": 10 },
  "context": { "ip": "1.2.3.4" }
}
```

## Error Handling

- Missing `type`: `InstrumentationError` "Message Type is not present. Aborting message."
- Unsupported type: `InstrumentationError`.
- Missing required mapped fields (for example `event` on track, `groupId` on group): `InstrumentationError` from `constructPayload`.
- Delivery errors use the default rudder-server handling (no `networkHandler.js`).

## Use Cases

Factors AI is a B2B marketing analytics and account-identification tool. Track and Page feed journey and attribution analytics. Identify and Group attach user and company traits.
