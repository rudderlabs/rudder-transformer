# Refiner Business Logic

## Endpoints

| Message type | Endpoint                                  | Method |
| ------------ | ----------------------------------------- | ------ |
| Identify     | `https://api.refiner.io/v1/identify-user` | POST   |
| Group        | `https://api.refiner.io/v1/identify-user` | POST   |
| Track        | `https://api.refiner.io/v1/track`         | POST   |
| Page         | `https://api.refiner.io/v1/track`         | POST   |

Headers: `Authorization: Bearer {apiKey}`, `Content-Type: application/x-www-form-urlencoded`. The body is sent as `FORM`; null and undefined values are removed.

## Validation (all types)

`validatePayload` requires generic `userIdOnly` (`userId`, `traits.userId`, `traits.id`, `context.traits.userId`, `context.traits.id`) or generic `email` (`traits.email`, `context.traits.email`, `properties.email`, `context.externalId.0.id`).

## Identify

Body = `{ ...traits, ...context.traits, userId, email }` (generic `traits` resolves to `traits` or `context.traits`), then keys are renamed with `userAttributesMapping` (`from` → `to`).

The user ID is sent under the key `userId`, not `id`. Refiner's docs name the identify-user field `id`, while track and group in this code send `id`. **NEEDS REVIEW**: confirm Refiner accepts `userId` here; if not, identify calls without an email do not match the user. Nested trait objects (for example `address`) are sent as-is in a form-encoded body.

## Track

| Source               | Destination |
| -------------------- | ----------- |
| generic `userIdOnly` | `id`        |
| generic `email`      | `email`     |
| `event` (required)   | `event`     |

Properties are not sent.

## Page

Same as track, with `event` built from the page:

| `name`  | `category` | `event`                         |
| ------- | ---------- | ------------------------------- |
| absent  | absent     | `pageView`                      |
| absent  | present    | `Viewed {category} Page`        |
| present | absent     | `Viewed {name} Page`            |
| present | present    | `Viewed {category} {name} Page` |

## Group

| Source                                                                                     | Destination      |
| ------------------------------------------------------------------------------------------ | ---------------- |
| generic `userIdOnly`                                                                       | `id`             |
| see bug below                                                                              | `email`          |
| generic `groupTraits` (`traits`, `context.traits`), renamed via `accountAttributesMapping` | `account[{key}]` |
| generic `groupId` (`groupId`, `traits.groupId`)                                            | `account[id]`    |

### Known issue: group email is never sent

`groupUsersPayloadBuilder` reads the email with `getFieldValueFromMessage(message, 'context.traits.email')`. `getFieldValueFromMessage` only accepts generic mapping keys, and `context.traits.email` is not one, so it always returns `null`. A group call for a user with only an email passes validation but goes out with neither `id` nor `email`. **NEEDS REVIEW**: likely bug; it should use the generic `email` key.

## Example

Input (group):

```json
{
  "type": "group",
  "userId": "u1",
  "groupId": "g1",
  "traits": { "name": "Acme" }
}
```

Output form body (`POST /v1/identify-user`):

```
id=u1
account[name]=Acme
account[id]=g1
```

## Error Handling

- `InstrumentationError`: missing type, unsupported type, missing `userId`/`email`, missing track `event`.
- `TransformationError` if a payload builder returns nothing (developer error safeguard).
- No custom response handling. Refiner returns `201` on identify success, `409` for concurrent identify of the same user, `429` on rate limit.
