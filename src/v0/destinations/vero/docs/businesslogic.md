# Vero Business Logic and Mappings

## Overview

All requests are JSON with `auth_token` added to the body. Base URL: `https://api.getvero.com/api/v2`.

## Endpoints

| Flow                  | Endpoint             | Method |
| --------------------- | -------------------- | ------ |
| identify              | `/users/track`       | POST   |
| track, page, screen   | `/events/track`      | POST   |
| alias                 | `/users/reidentify`  | PUT    |
| tags (identify/track) | `/users/tags/edit`   | PUT    |
| track `unsubscribe`   | `/users/unsubscribe` | POST   |
| track `resubscribe`   | `/users/resubscribe` | POST   |

## Identify (`VeroIdentifyConfig.json`)

| RudderStack field                           | Vero field          |
| ------------------------------------------- | ------------------- |
| generic `userId` (includes `anonymousId`)   | `id`                |
| generic `emailOnly`                         | `email`             |
| `context.traits` / `traits` (minus `email`) | `data`              |
| `context.timezone`                          | `data.timezone`     |
| `context.locale`                            | `data.locale`       |
| `context.userAgent`                         | `data.userAgent`    |
| `context.os.name`                           | `channels.platform` |
| `context.device.token`                      | `channels.address`  |
| `context.device.name`                       | `channels.device`   |
| constant `push`                             | `channels.type`     |

`channels` is dropped unless both `address` and `platform` are present.

## Track (`VeroTrackConfig.json`)

| RudderStack field                | Vero field        |
| -------------------------------- | ----------------- |
| generic `userId`                 | `identity.id`     |
| generic `emailOnly`              | `identity.email`  |
| `event`                          | `event_name`      |
| `properties`                     | `data`            |
| `timestamp` (micro-second epoch) | `extras.check_id` |

If the event name is `unsubscribe` or `resubscribe` (any case), only `{ id, auth_token }` is sent to the matching endpoint (`VeroSimpleConfig.json`) and no tag request is produced.

## Page / Screen

The event name is built as `Viewed [properties.category ][name ]Page|Screen` and the event is sent through the track mapping. Tags are not processed for page/screen.

## Alias (`VeroAliasConfig.json`)

| RudderStack field | Vero field |
| ----------------- | ---------- |
| `previousId`      | `id`       |
| generic `userId`  | `new_id`   |

## Tags

When `integrations.vero.tags.add` or `.remove` is a non-empty array on `identify` or `track`, an extra request is built: `{ id, add, remove, auth_token }` to `PUT /users/tags/edit`.

## Notes and Possible Issues

- `extras.check_id` uses the `microSecondTimestamp` formatter, which truncates to whole seconds and multiplies by 10^6. Two events in the same second for the same user get the same value. `NEEDS REVIEW`: confirm what Vero does with `check_id` (the current Track API docs do not describe it).
- `id` falls back to `anonymousId` (generic `userId`), so anonymous users are created in Vero under their anonymous ID.

## Example (track)

```json
{
  "method": "POST",
  "endpoint": "https://api.getvero.com/api/v2/events/track",
  "body": {
    "JSON": {
      "auth_token": "<authToken>",
      "identity": { "id": "user-1", "email": "jane@example.com" },
      "event_name": "Order Completed",
      "data": { "revenue": 20 },
      "extras": { "check_id": 1676886800000000 }
    }
  }
}
```
