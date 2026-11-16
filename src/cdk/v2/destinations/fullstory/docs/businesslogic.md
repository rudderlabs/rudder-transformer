# Fullstory Business Logic and Mappings

## Overview

`procWorkflow.yaml` validates the message type, builds the payload for identify or track, removes `null`/`undefined` values, and returns one JSON request.

Headers on every request:

- `authorization: Basic {apiKey}`
- `content-type: application/json`

## Identify

**Endpoint**: `POST https://api.fullstory.com/v2/users`

| RudderStack field                                      | Fullstory field | Notes                               |
| ------------------------------------------------------ | --------------- | ----------------------------------- |
| `traits` (or `context.traits` when `traits` is absent) | `properties`    | Sent as is                          |
| `userId`                                               | `uid`           |                                     |
| `context.traits.email`                                 | `email`         | Only `context.traits`, not `traits` |
| `context.traits.name`                                  | `display_name`  | Only `context.traits`, not `traits` |

Example output:

```json
{
  "endpoint": "https://api.fullstory.com/v2/users",
  "method": "POST",
  "body": {
    "JSON": {
      "uid": "user-1",
      "email": "jane@example.com",
      "display_name": "Jane Doe",
      "properties": { "email": "jane@example.com", "name": "Jane Doe", "plan": "pro" }
    }
  }
}
```

## Track

**Endpoint**: `POST https://api.fullstory.com/v2/events`

| RudderStack field                                                   | Fullstory field                                     |
| ------------------------------------------------------------------- | --------------------------------------------------- |
| `event`                                                             | `name` (required)                                   |
| `properties`                                                        | `properties`                                        |
| `originalTimestamp`                                                 | `timestamp`                                         |
| `context.page.url`                                                  | `context.browser.url`                               |
| `context.userAgent`                                                 | `context.browser.user_agent`                        |
| `context.page.initial_referrer`                                     | `context.browser.initial_referrer`                  |
| `context.app.name`                                                  | `context.mobile.app_name`                           |
| `context.app.version`                                               | `context.mobile.app_version`                        |
| `context.device.manufacturer`                                       | `context.device.manufacturer`                       |
| `context.device.model`                                              | `context.device.model`                              |
| `context.ip`                                                        | `context.location.ip_address`                       |
| `properties.latitude` / `longitude` / `city` / `region` / `country` | `context.location.*`                                |
| `properties.sessionId` or `context.sessionId`                       | `session.id` (string; only when a string or number) |
| `properties.useMostRecent`                                          | `session.use_most_recent`                           |
| `properties.userId` or `userId`                                     | `user.uid`                                          |

Notes:

- `timestamp` comes from `originalTimestamp`, not the server-corrected `timestamp`.
- Location fields come from `properties`, not `context.location`. The full `properties` object is also sent, so these values appear in both places.

Example output:

```json
{
  "endpoint": "https://api.fullstory.com/v2/events",
  "method": "POST",
  "body": {
    "JSON": {
      "name": "Product Viewed",
      "properties": { "sku": "SKU-1", "useMostRecent": true },
      "timestamp": "2024-01-01T00:00:00.000Z",
      "context": {
        "browser": { "url": "https://example.com/p/1", "user_agent": "Mozilla/5.0" },
        "location": { "ip_address": "1.2.3.4" }
      },
      "session": { "use_most_recent": true },
      "user": { "uid": "user-1" }
    }
  }
}
```

## Validations

| Check                        | Error                                            |
| ---------------------------- | ------------------------------------------------ |
| `type` missing               | `message Type is not present. Aborting message.` |
| `type` not identify or track | `message type <type> is not supported`           |
| Track without `event`        | `event is required for track call`               |

## Error Handling

The workflow only raises instrumentation errors for the checks above. There is no proxy delivery, so delivery errors (`4xx`, `429`, `5xx`) are handled by rudder-server from the HTTP status.

## General Use Cases

- Attach CRM or product attributes to Fullstory users for session search and segmentation.
- Send server-side business events (orders, subscription changes) into Fullstory sessions and funnels.
