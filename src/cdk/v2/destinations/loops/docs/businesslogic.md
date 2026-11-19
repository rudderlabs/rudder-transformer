# Loops Business Logic and Mappings

## Endpoints

| Message type | Endpoint                                      | Method |
| ------------ | --------------------------------------------- | ------ |
| identify     | `https://app.loops.so/api/v1/contacts/update` | PUT    |
| track        | `https://app.loops.so/api/v1/events/send`     | POST   |

Headers: `Authorization: Bearer <apiKey>`, `Content-Type: application/json`.

## Identify

`contacts/update` creates the contact if it does not exist, otherwise updates it.

| RudderStack field                       | Loops field                   |
| --------------------------------------- | ----------------------------- |
| all keys of `traits` / `context.traits` | same key (contact properties) |
| generic `userIdOnly`                    | `userId`                      |
| generic `emailOnly`                     | `email`                       |

## Track

| RudderStack field                       | Loops field                                       |
| --------------------------------------- | ------------------------------------------------- |
| all keys of `traits` / `context.traits` | same key (contact properties, update the contact) |
| generic `userIdOnly`                    | `userId`                                          |
| generic `emailOnly`                     | `email`                                           |
| `event`                                 | `eventName`                                       |
| `properties`                            | `eventProperties`                                 |

Null and undefined values are removed. Traits are copied as-is, so nested objects or arrays in traits are passed through; Loops contact properties accept only string, number, boolean and date values. `NEEDS REVIEW`: whether Loops rejects or ignores such values.

## Validations

See the README. Errors are thrown as instrumentation/configuration errors by the workflow `$.assert` / `$.assertConfig` steps.

## Example (track)

```json
{
  "method": "POST",
  "endpoint": "https://app.loops.so/api/v1/events/send",
  "headers": {
    "Authorization": "Bearer <apiKey>",
    "Content-Type": "application/json"
  },
  "body": {
    "JSON": {
      "firstName": "Jane",
      "userId": "user-1",
      "email": "jane@example.com",
      "eventName": "Signed Up",
      "eventProperties": { "plan": "pro" }
    }
  }
}
```
