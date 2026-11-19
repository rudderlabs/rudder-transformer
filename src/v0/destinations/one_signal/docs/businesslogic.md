# OneSignal Business Logic

`processEvent` in `transform.js` routes to `transformV2.js` when `Config.version === "V2"`; otherwise the V1 (Player model) logic runs.

## Endpoints

| Version | Event                      | Method | Endpoint                                                           |
| ------- | -------------------------- | ------ | ------------------------------------------------------------------ |
| V1      | Identify (no `playerId`)   | POST   | `https://onesignal.com/api/v1/players`                             |
| V1      | Identify (with `playerId`) | PUT    | `https://onesignal.com/api/v1/players/{playerId}`                  |
| V1      | Track, Group               | PUT    | `https://onesignal.com/api/v1/apps/{appId}/users/{encoded userId}` |
| V2      | Identify, Track, Group     | POST   | `https://api.onesignal.com/apps/{appId}/users`                     |

Headers: `Accept` and `Content-Type: application/json`. V1 also sends `OneSignal-Usage: Rudderstack | Partner Integration`. No `Authorization` header is sent.

## Tags (both versions)

`populateTags` (Identify): every **string** trait (generic `traits` paths) becomes a tag; `anonymousId` is added as tag `anonymousId`. Non-string traits are dropped.

Allowed properties (Track/Group): for each `allowedProperties[].propertyName`, a string value is added as a tag. Track reads `properties`; V1 Group reads traits, V2 Group reads `properties`. With `eventAsTags`, Track tag keys become `<event>_<propertyName>`.

## V1 (Player model)

### Identify

Mapping `OneSignalIdentifyConfig.json`:

| Destination        | Source                                                          | Notes                            |
| ------------------ | --------------------------------------------------------------- | -------------------------------- |
| `app_id`           | `Config.appId`                                                  |                                  |
| `device_model`     | `context.device.model`                                          |                                  |
| `device_os`        | `context.os.version`                                            |                                  |
| `laguage`          | `context.locale`                                                | Key is misspelled in the mapping |
| `created_at`       | generic `createdAt`                                             | Seconds timestamp                |
| `last_active`      | generic `createdAt`                                             | Seconds timestamp                |
| `country`          | `traits.country`, `context.traits.country`, `*.address.country` |                                  |
| `timezone`         | `context.timezone`                                              |                                  |
| `external_user_id` | generic `userIdOnly`                                            |                                  |
| `tags`             | `populateTags`                                                  |                                  |

Flow:

1. If `externalId` of type `playerId` exists: PUT `/players/{playerId}` (edit device). Done.
2. Otherwise resolve `device_type`/`identifier`:
   - `integrations.one_signal.deviceType` + `identifier` (validated 0–14), else
   - mobile: `context.device.type` (`android`→1, `ios`→0) with `context.device.token` or `id`
   - web: browser from `context.userAgent` (`chrome`→5, `safari`→7, `firefox`→8) with `anonymousId`
3. Emit up to three POST `/players` requests: email device (`device_type: 11`, identifier = email) if `emailDeviceType`; SMS device (`device_type: 14`, identifier = phone) if `smsDeviceType`; the resolved device if `device_type` is set.
4. If none were built: `Correct identifier is required for creating a device (identify call)`.

### Track

Body `{ "tags": { "<event>": true, ...allowedPropertyTags } }`. Requires `event` and `userId`.

### Group

Body `{ "tags": { "groupId": "<groupId>", ...allowedTraitTags } }`. Requires `groupId` and `userId`.

## V2 (User model)

### Identify

Mapping `OneSignalIdentifyConfigV2.json`:

| Destination                            | Source                                          |
| -------------------------------------- | ----------------------------------------------- |
| `properties.laguage`                   | `context.locale` (misspelled key)               |
| `properties.ip`                        | `context.ip`                                    |
| `properties.timezone_id`               | `context.timezone`                              |
| `properties.lat` / `long`              | `context.location.latitude` / `longitude`       |
| `properties.created_at`, `last_active` | generic `createdAt` (seconds)                   |
| `properties.country`                   | traits country / address country                |
| `properties.first_active`              | `traits.firstActive` / `first_active` (seconds) |
| `identity.external_id`                 | generic `userIdOnly`                            |
| `properties.tags`                      | `populateTags`                                  |
| `subscriptions`                        | `getSubscriptions`                              |

- No `userId`: `identity` = `integrations.one_signal.aliases`; if empty, error.
- `subscriptions`: device subscription (`type` from integrations object, mobile `context.device.type`, or `<Browser>Push` for web; only kept when type is a valid OneSignal subscription type), plus `Email` / `SMS` subscriptions when toggles are on. Each has `token`, `device_model`, `device_os`; extra fields (`enabled`, `notification_types`, `session_time`, `session_count`, `app_version`, `test_type`) come from `traits.subscriptions.email|phone`.

### Track

Body: `identity` (`external_id` or aliases), `properties.tags` (`<event>: true` plus allowed properties), `properties.purchases`:

- From `properties.products[]`: `{ sku, iso, count: quantity, amount }`
- Else from top-level `properties.sku/iso/quantity/amount` (omitted when all empty)

### Group

Body: `identity`, `properties.tags` with `groupId` and allowed properties.

## Example (V1 Track)

Input: `{ "type": "track", "event": "Order Completed", "userId": "u1", "properties": { "plan": "pro" } }` with `allowedProperties: [{ "propertyName": "plan" }]`, `eventAsTags: false`

Output: `PUT https://onesignal.com/api/v1/apps/{appId}/users/u1`

```json
{ "tags": { "Order Completed": true, "plan": "pro" } }
```

## Error Handling

- Missing fields raise `InstrumentationError`/`ConfigurationError` (400, not retried).
- No proxy; partner responses are handled by rudder-server's default status-code logic. V2 may return 409 when an alias belongs to another user.

## Use Cases

- Register push/email/SMS subscriptions and keep user tags in sync for OneSignal segmentation and messaging.
