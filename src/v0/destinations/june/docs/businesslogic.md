# June Business Logic and Mappings

## Overview

Each supported event is mapped with a JSON mapping file in `../data/` and sent as one `POST` with headers `Content-Type: application/json` and `Authorization: Basic <apiKey>`. `null`/`undefined` values are removed from the body.

## Field Mappings

`userId` uses the generic `userIdOnly` lookup (`userId`, `traits.userId`, `traits.id`, `context.traits.userId`, ...). `timestamp` uses `timestamp` then `originalTimestamp`. `context` is forwarded minus `page`, `traits`, `sessionId`, `sessionStart`, `consentManagement`.

### Identify (`JuneIdentifyConfig.json`) → `/api/identify`

| RudderStack                       | June          | Required |
| --------------------------------- | ------------- | -------- |
| `userId` (generic `userIdOnly`)   | `userId`      | Yes      |
| `anonymousId`                     | `anonymousId` | No       |
| `timestamp` / `originalTimestamp` | `timestamp`   | Yes      |
| `context.traits` or `traits`      | `traits`      | No       |
| `context` (trimmed)               | `context`     | No       |

### Track (`JuneTrackConfig.json`) → `/api/track`

| RudderStack                                                       | June              | Required |
| ----------------------------------------------------------------- | ----------------- | -------- |
| `userId` (generic `userIdOnly`)                                   | `userId`          | Yes      |
| `anonymousId`                                                     | `anonymousId`     | No       |
| `event`                                                           | `event`           | Yes      |
| `properties` (excluding `groupId`)                                | `properties`      | No       |
| `timestamp` / `originalTimestamp`                                 | `timestamp`       | Yes      |
| `context` (trimmed)                                               | `context`         | No       |
| `context.externalId[type=juneGroupId].id` or `properties.groupId` | `context.groupId` | No       |

Note: when a group ID is found, `context` is replaced by `{ groupId }` (the trimmed context is not merged).

### Page (`JunePageConfig.json`) → `/api/page`

| RudderStack                        | June              | Required |
| ---------------------------------- | ----------------- | -------- |
| `userId`                           | `userId`          | No       |
| `anonymousId`                      | `anonymousId`     | No       |
| `timestamp` / `originalTimestamp`  | `timestamp`       | No       |
| `properties` (excluding `groupId`) | `properties`      | Yes      |
| `context` (trimmed)                | `context`         | No       |
| `groupId` / `traits.groupId`       | `context.groupId` | No       |

### Group (`JuneGroupConfig.json`) → `/api/group`

| RudderStack                       | June          | Required |
| --------------------------------- | ------------- | -------- |
| `userId`                          | `userId`      | No       |
| `anonymousId`                     | `anonymousId` | No       |
| `groupId` / `traits.groupId`      | `groupId`     | Yes      |
| `timestamp` / `originalTimestamp` | `timestamp`   | Yes      |
| `traits` (excluding `groupId`)    | `traits`      | No       |
| `context` (trimmed)               | `context`     | No       |

## Example

Input (track):

```json
{
  "type": "track",
  "userId": "user-1",
  "event": "Signed Up",
  "properties": { "plan": "pro", "groupId": "acme" },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Output:

```json
{
  "endpoint": "https://api.june.so/api/track",
  "method": "POST",
  "headers": { "Content-Type": "application/json", "Authorization": "Basic <apiKey>" },
  "body": {
    "JSON": {
      "userId": "user-1",
      "event": "Signed Up",
      "properties": { "plan": "pro" },
      "timestamp": "2024-01-01T00:00:00.000Z",
      "context": { "groupId": "acme" }
    }
  }
}
```

## Error Handling

- Missing `message.type` → `InstrumentationError: Event type is required`.
- Unsupported type → `InstrumentationError: Event type "<type>" is not supported`.
- Missing required mapped field → instrumentation error from `constructPayload`.
- Delivery errors are handled by rudder-server's generic HTTP handling (no proxy).

## Use Cases

Product analytics for B2B SaaS: user identification, company (group) association, feature usage via track events and page views.
