# Lytics Business Logic

## Request

```
POST https://api.lytics.io/collect/json/{Config.stream}?access_token={Config.apiKey}
Content-Type: application/json
```

Body: a flat JSON object (one event).

## Mappings

`data/LYTICSIdentifyConfig.json` (applied to every message type):

| Lytics key     | Source                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| `user_id`      | `userIdOnly` (generic map: `userId`, `traits.userId`, `traits.id`, `context.traits.userId`, `context.traits.id`) |
| `anonymous_id` | `anonymousId`                                                                                                    |
| `first_name`   | `firstName` (generic map)                                                                                        |
| `last_name`    | `lastName` (generic map)                                                                                         |

## Flow per Message Type

| Type       | Payload                                                   |
| ---------- | --------------------------------------------------------- |
| `identify` | `flattenJson(traits ?? context.traits)` + mapping above   |
| `track`    | `flattenJson(properties)` + mapping above + `_e: event`   |
| `page`     | `flattenJson(properties)` + mapping above + `event: name` |
| `screen`   | Same as page                                              |

Then (`cleanPaylod` step):

1. `removeUndefinedAndNullValues`.
2. Remove `firstname`, `firstName`, `lastname`, `lastName` (they are sent as `first_name` / `last_name`).

Nested objects are flattened with `.` separators by `flattenJson` (for example `address.city`).

## Example

Input:

```json
{
  "type": "identify",
  "userId": "u1",
  "anonymousId": "a1",
  "traits": { "firstName": "Ada", "email": "ada@example.com", "address": { "city": "Paris" } }
}
```

Output body:

```json
{
  "email": "ada@example.com",
  "address.city": "Paris",
  "user_id": "u1",
  "anonymous_id": "a1",
  "first_name": "Ada"
}
```

## Validations and Errors

- Missing `message.type` → `message Type is not present. Aborting message.`
- Unsupported type → `message type <type> is not supported`.
- No custom response handling; HTTP status codes from Lytics are passed through by rudder-server's generic handling.

## Code Observations (NEEDS REVIEW)

- `stream` is not validated, so a missing stream sends to `/collect/json/undefined`.
- No event timestamp is sent.
- `$.batchMode` branch is unused (no router workflow).
