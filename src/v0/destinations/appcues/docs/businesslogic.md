# Appcues Business Logic

## Endpoint

All event types use one endpoint, method POST, header `Content-Type: application/json`:

```
https://api.appcues.com/v1/accounts/{Config.accountId}/users/{message.userId}/activity
```

Null and undefined values are removed from the body.

## Mappings

Mapping files are in `data/`. "Generic" keys resolve through `src/v0/util/data/GenericFieldMapping.json`.

### Common (`AppcuesDefaultConfig.json`)

| Source      | Destination  |
| ----------- | ------------ |
| `messageId` | `request_id` |

### Identify (`AppcuesIdentifyConfig.json`)

| Source                                        | Destination      | Required |
| --------------------------------------------- | ---------------- | -------- |
| `messageId`                                   | `request_id`     | No       |
| generic `traits` (`traits`, `context.traits`) | `profile_update` | Yes      |

### Track and Screen (`AppcuesTrackConfig.json`)

Sent as `events: [ { ... } ]` plus `request_id`.

| Source                                                 | Destination                | Required |
| ------------------------------------------------------ | -------------------------- | -------- |
| `event`                                                | `name`                     | Yes      |
| generic `timestamp` (`timestamp`, `originalTimestamp`) | `timestamp` (Unix seconds) | Yes      |
| `properties`                                           | `attributes`               | No       |

Screen events have `event` overwritten to `Viewed a Screen`.

### Page (`AppcuesPageProfile.json` + `AppcuesPageTrack.json`)

Page sets `message.event = "Visited a Page"` and builds both parts:

`profile_update`:

| Source                                                         | Destination            | Required |
| -------------------------------------------------------------- | ---------------------- | -------- |
| generic `userIdOnly`                                           | `userId`               | Yes      |
| `context.locale`                                               | `_lastBrowserLanguage` | No       |
| generic `timestamp`                                            | `_updatedAt`           | No       |
| `context.userAgent`                                            | `_userAgent`           | No       |
| generic `pageTitle` (`context.page.title`, `properties.title`) | `_currentPageTitle`    | No       |
| generic `pageUrl` (`context.page.url`, `properties.url`)       | `_currentPageUrl`      | No       |
| `Config.accountId` (hard-coded)                                | `_appcuesId`           | —        |

`events[0]`:

| Source                     | Destination                         | Required |
| -------------------------- | ----------------------------------- | -------- |
| `event` (`Visited a Page`) | `name`                              | Yes      |
| generic `timestamp`        | `timestamp` (Unix seconds)          | Yes      |
| `properties`               | `attributes` (empty values removed) | No       |
| generic `pageUrl`          | `context.url`                       | No       |
| generic `userIdOnly`       | `attributes._identity.userId`       | No       |

## Flow

1. Reject if `message.type` is missing or `message.userId` is missing.
2. Switch on lowercased type: track, page, screen, identify. Anything else is rejected.
3. Build the body from the mappings above and send one request.

## Example

Input (track):

```json
{
  "type": "track",
  "userId": "u1",
  "event": "Signed Up",
  "messageId": "m1",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "properties": { "plan": "pro" }
}
```

Output body (`POST .../accounts/{accountId}/users/u1/activity`):

```json
{
  "request_id": "m1",
  "events": [{ "name": "Signed Up", "timestamp": 1704067200, "attributes": { "plan": "pro" } }]
}
```

## Error Handling

- `InstrumentationError` for missing type, missing `userId`, unsupported type, and missing required mapped fields.
- No custom response handling; delivery errors are classified by rudder-server from the HTTP status.

## Notes

- `userId` is used raw in the URL path; it is not URL-encoded. **NEEDS REVIEW**: user IDs with `/`, `?` or `#` would produce a wrong path.
