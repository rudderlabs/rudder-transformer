# Pushwoosh Business Logic and Mappings

## Overview

The destination turns RudderStack `track` events into Pushwoosh events (batched) and `identify` traits into Pushwoosh user-specific tags (one request per user). Every event is keyed by `userId`, which must equal the User ID the Pushwoosh SDK sets on the device (`setUserId`).

Source: `routerTransform.ts` (handler map per message type, batch strategy per endpoint), `utils.ts` (payload builders), `data/PUSHWOOSHConfig.json` (field paths), `delivery.ts` (response handling).

## Field Mappings

### Track → post-events event

| RudderStack field                        | Pushwoosh field   | Notes                                                                                       |
| ---------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `userId`                                 | `user_id`         | Required; sent as a string                                                                  |
| `context.device.id`                      | `device_id`       | `""` when absent                                                                            |
| `context.device.type`, `context.os.name` | `device_platform` | `android` / `ios` / `web`, see below                                                        |
| `destination.Config.appCode`             | `app_code`        | Also sent as the `X-PW-Appcode` header                                                      |
| `event`                                  | `name`            | Required; sent as a string                                                                  |
| `timestamp` → `originalTimestamp`        | `timestamp`       | First present; converted to ISO 8601 UTC (`toISOString()`); omitted when neither is present |
| `properties`                             | `attributes`      | Sanitised (see [Value sanitising](#value-sanitising)); `{}` when absent or not an object    |

### Identify → setTags request

| RudderStack field            | Pushwoosh field       | Notes                                                                                  |
| ---------------------------- | --------------------- | -------------------------------------------------------------------------------------- |
| `destination.Config.appCode` | `request.application` |                                                                                        |
| `userId`                     | `request.userId`      | Required; sent as a string                                                             |
| `traits` → `context.traits`  | `request.tags`        | `traits` if present, otherwise `context.traits`; excluded keys removed, then sanitised |

**Excluded trait keys** (identity and PII, never sent as tags): `userId`, `id`, `anonymousId`, `email`, `phone`, `firstName`, `lastName`, `name`, `address`.

### Device platform

`android` when `context.device.type` or `context.os.name` is `android` (case-insensitive, `isAndroidFamily`); else `ios` when either is `ios`, `ipados`, `watchos` or `tvos` (`isAppleFamily`); else `web`.

### Value sanitising

Applied to `properties` (attributes) and traits (tags):

- `null` / `undefined` values → dropped
- strings, numbers, booleans → unchanged
- plain objects → JSON string (`{"src":"push"}` → `"{\"src\":\"push\"}"`)
- arrays → kept; object (and `null`) elements become JSON strings

## API Endpoints and Request Flow

### Track Events

`POST https://integration-rudderstack.svc-nue.pushwoosh.com/integration-segment/v1/post-events`

Headers: `Authorization: Token <apiToken>`, `X-PW-Appcode: <appCode>`, `Content-Type: application/json`.

Up to 100 events, max 10MB, per request. Example input:

```json
{
  "type": "track",
  "userId": "user-1",
  "event": "Purchase",
  "timestamp": "2026-10-10T10:00:00.000Z",
  "context": { "device": { "id": "device-1", "type": "Android" }, "os": { "name": "Android" } },
  "properties": {
    "revenue": 9.99,
    "items": [{ "sku": "a" }, "b"],
    "meta": { "src": "push" },
    "empty": null
  }
}
```

Output body:

```json
{
  "events": [
    {
      "user_id": "user-1",
      "device_id": "device-1",
      "device_platform": "android",
      "app_code": "ABCDE-12345",
      "name": "Purchase",
      "timestamp": "2026-10-10T10:00:00.000Z",
      "attributes": {
        "revenue": 9.99,
        "items": ["{\"sku\":\"a\"}", "b"],
        "meta": "{\"src\":\"push\"}"
      }
    }
  ]
}
```

Success response: HTTP 200 with an empty body. Pushwoosh stores events by `user_id` even if `device_id` is empty or unknown.

### Identify Events

`POST https://api.pushwoosh.com/json/1.3/setTags`

Headers: `Authorization: Token <apiToken>`, `Content-Type: application/json`. One request per event. Example input:

```json
{
  "type": "identify",
  "userId": "user-3",
  "traits": {
    "plan": "pro",
    "age": 30,
    "vip": false,
    "settings": { "lang": "de" },
    "email": "user-3@example.com"
  }
}
```

Output body:

```json
{
  "request": {
    "application": "ABCDE-12345",
    "userId": "user-3",
    "tags": { "plan": "pro", "age": 30, "vip": false, "settings": "{\"lang\":\"de\"}" }
  }
}
```

Success response: HTTP 200 `{"status_code":200,"status_message":"OK","response":{}}`.

Pushwoosh-side behaviour that is invisible to the transformer:

- Tags are applied only if the user already has a device registered through the Pushwoosh SDK with the same User ID.
- Only user-specific tags are written. A tag name that does not exist yet is auto-created as user-specific; an existing tag that is not user-specific is silently skipped.
- The API token is not checked by setTags.

## Validations

### Required Fields

| Message type | Field                                    | Error                                                                                 |
| ------------ | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| all          | `type` ∈ {`track`, `identify`}           | `message.type: Invalid enum value. Expected 'track' \| 'identify', received '<type>'` |
| all          | `userId`                                 | `Missing required value from "userId"`                                                |
| `track`      | `event`                                  | `Missing required value from "event"`                                                 |
| `identify`   | at least one trait left after exclusions | `No traits left to send as Pushwoosh tags`                                            |

### Field Format Validations

- `timestamp` / `originalTimestamp`: must be a string or number that parses as a date, else `Invalid timestamp: <value>`. post-events decodes `timestamp` as RFC 3339 and rejects the **whole batch** on a bad value, so the check is done per event before batching.
- `userId` and `event` are coerced to strings — post-events rejects the whole batch on a numeric `user_id`.

### Configuration Validations

- `appCode`, `apiToken`: non-empty strings (`destination.Config.apiToken: String must contain at least 1 character(s)`), reported as configuration errors.

### Error Handling

| Response                                                                                         | Endpoint    | Verdict                                                                    |
| ------------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------- |
| 200, empty body                                                                                  | post-events | success                                                                    |
| 200, `status_code: 200`                                                                          | setTags     | success                                                                    |
| 200, `status_code` 2xx–4xx other than 200 (e.g. 210)                                             | setTags     | abort                                                                      |
| 200, `status_code` ≥ 500                                                                         | setTags     | retry                                                                      |
| 400 `{"action":"post event","status":"failure","error":{...}}`                                   | post-events | retry with `dontBatch` (re-sent one by one; a failing single event aborts) |
| 400 `{"message":"missing api token"}` / `"missing application code"` / `"application not found"` | post-events | abort                                                                      |
| 400 `{"status_code":210,"status_message":"..."}`                                                 | setTags     | abort                                                                      |
| 401 `{"message":"unauthorized"}`                                                                 | post-events | abort (no token refresh)                                                   |
| 429                                                                                              | both        | throttled                                                                  |
| 5xx                                                                                              | both        | retry                                                                      |

The failure reason shown in Live Events is the Pushwoosh `message`, `error.message` or `status_message (status_code: N)`.

## Mapping Configuration

`data/PUSHWOOSHConfig.json`:

- `trackMappings` — `userId` (required), `context.device.id`, `event` (required), `timestamp`/`originalTimestamp`
- `identifyMappings` — `userId` (required)
- `attributesSourceKey` — `properties`
- `tagsSourceKeys` — `traits`, `context.traits`
- `platformSourceKeys` — `context.device.type`, `context.os.name`
- `excludedTraitKeys` — the identity/PII keys listed above

## General Use Cases

- **Journey triggers and segmentation on server-side events**: purchases, sign-ups and other `track` events from any RudderStack source become Pushwoosh events usable as Customer Journey entry triggers and segment filters.
- **Profile enrichment**: `identify` traits (plan, lifecycle stage, preferences) become user-specific tags for targeting and personalisation of pushes, in-apps and emails.
- **Migration from another engagement platform**: keep RudderStack as the collection layer and switch the destination to Pushwoosh, as long as the Pushwoosh SDK sets the same User ID.
