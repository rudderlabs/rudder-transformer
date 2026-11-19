# Userlist Business Logic

## Endpoint and Request

| Item     | Value                                                                    |
| -------- | ------------------------------------------------------------------------ |
| Endpoint | `POST https://incoming.userlist.com/rudderstack/events`                  |
| Headers  | `Authorization: Push <pushKey>`, `Content-Type: application/json`        |
| Body     | The RudderStack message, with `type` lower-cased and `userId` normalized |

## Workflow Steps (`procWorkflow.yaml`)

1. **validateInput**: `message.type` must exist and be identify, track or group.
2. **preparePayload**: Copy the message, lower-case `type`, set `userId` from the generic `userIdOnly` paths (`userId`, `traits.userId`, `traits.id`, `context.traits.userId`, `context.traits.id`). Fail if no `userId`.
3. **buildResponse**: In `batchMode`, return the payload. Otherwise wrap it in a `defaultRequestConfig` with the endpoint and headers above.

## Field Mappings

No field mapping. The full message is sent. The only changes are:

| Field    | Change                                         |
| -------- | ---------------------------------------------- |
| `type`   | Lower-cased                                    |
| `userId` | Set from the first non-empty `userIdOnly` path |

## Example

Input:

```json
{
  "type": "Identify",
  "context": { "traits": { "id": "u1", "email": "jane@example.com" } },
  "anonymousId": "a1"
}
```

Output body:

```json
{
  "type": "identify",
  "userId": "u1",
  "context": { "traits": { "id": "u1", "email": "jane@example.com" } },
  "anonymousId": "a1"
}
```

## Error Handling

- Missing type: "message Type is not present. Aborting message."
- Unsupported type: "message type <type> is not supported".
- Missing userId: "userId is required".
- Delivery errors use default rudder-server handling.

## Differences from the v0 Implementation

`src/v0/destinations/userlist/transform.js` (inactive) behaves the same. It also sets `statusCode: 200` on the response and uses the error text 'Missing required value from "userIdOnly"'.

## Use Cases

Userlist is a lifecycle email tool for SaaS. Identify and Group keep users and companies in sync. Track events trigger campaigns and segments.
