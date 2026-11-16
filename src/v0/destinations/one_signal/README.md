# OneSignal Destination

Implementation in **JavaScript** (`src/v0/destinations/one_signal/`)

## Configuration

### Required Settings

- **App ID** (`appId`): OneSignal App ID. Used in the request path (and in the body for the Player model). Marked secret.

### Optional Settings

- **Version** (`version`): `V1` (default, legacy Player model) or `V2` (User model). Selects `transform.js` (V1) or `transformV2.js` (V2).
- **Email device type** (`emailDeviceType`, default `false`): On Identify, also create an email device / subscription from the user's email.
- **SMS device type** (`smsDeviceType`, default `false`): On Identify, also create an SMS device / subscription from the user's phone.
- **Event as tags** (`eventAsTags`, default `false`): Track only. Prefixes allowed-property tags with the event name (`<event>_<property>`).
- **Allowed properties** (`allowedProperties`): List of `propertyName`s whose string values are sent as tags on Track/Group.

## Integration Functionalities

> OneSignal supports **Cloud mode** only in this destination.

### Supported Message Types

- **Identify**: V1 creates or edits a device (player); V2 creates/updates a user with subscriptions
- **Track**: Sets tag `<event>: true` plus allowed-property tags on the user (V2 also sends purchases)
- **Group**: Sets tag `groupId` plus allowed-trait tags on the user

### Implementation

- **Implemented in**: JavaScript (v0)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router destination (`transformAtV1: "router"`), uses `simpleProcessRouterDest` (no batching)

### Batching Support

- **Supported**: No. Every event becomes one or more individual requests.

### Rate Limits

From OneSignal's [rate limits reference](https://documentation.onesignal.com/reference/rate-limits), for "Create, update, or delete users or subscriptions":

- 1,000 requests/second per app
- 1 request/second per user or subscription
- HTTP 429 with `Retry-After` when exceeded

NEEDS REVIEW: Limits for the legacy Player endpoints (`/api/v1/players`, `/api/v1/apps/{app_id}/users/{external_user_id}`) are not separately documented.

### Intermediate Calls

None.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`)

### User Deletion

- **Supported**: No (no `deleteUsers.js`)

### OAuth Support

- **Supported**: No.

NEEDS REVIEW: The transformer sends **no `Authorization` header** in either version. V1 sends only `OneSignal-Usage: Rudderstack | Partner Integration`. OneSignal's current docs list a REST API key as required on Add a device and show one in the Create user examples, so check whether requests still succeed without a key.

### Additional Functionalities

- **Two data models** selected by `version`; see [business logic](docs/businesslogic.md).
- **Device type detection** (V1/V2): from `integrations.one_signal.deviceType` + `identifier`, else from `context.device.type`/`token`/`id` for mobile, else from the browser parsed from `context.userAgent` for web.
- **Aliases** (V2): `integrations.one_signal.aliases` is used as `identity` when there is no `userId`.

### Validations

- `appId` required (configuration error)
- `type` required and must be identify/track/group
- **V1**
  - Identify without `externalId` `playerId`: at least one device must be built (device type, email device or SMS device), else `Correct identifier is required for creating a device (identify call)`
  - `device_type` from the integrations object must be 0–14
  - Track: `event` and `userId` required
  - Group: `groupId` and `userId` required
- **V2**
  - Identify/Track/Group: `userId` or `integrations.one_signal.aliases` required
  - Track: `event` required; Group: `groupId` required

## General Queries

### Event Ordering

- **Identify**: Required. It creates/edits the user/device and overwrites properties and tags, so a stale event can overwrite newer data.
- **Track / Group**: Recommended. They overwrite tags (`<event>: true`, `groupId`, property tags); out-of-order events can leave an older tag value.

### Data Replay Feasibility

- **Missing data replay**: Feasible for Track (tags are idempotent `true` flags). Identify/Group replays can overwrite newer values; replay in order.
- **Already-delivered data replay**: Tag and property updates are overwrites, so replays are mostly idempotent. V1 Identify without `playerId` POSTs to `/players`, which can create duplicate devices. V2 purchases may be counted again. NEEDS REVIEW against OneSignal behavior.

### Multiplexing

- **V1 Identify**: Yes. Up to 3 requests per event: a device from the device type, an email device (`device_type: 11`) when `emailDeviceType` is on, and an SMS device (`device_type: 14`) when `smsDeviceType` is on.
- **V2**: No. Email/SMS are added as entries in the single request's `subscriptions` array.

## Version Information

### Current Version

- **API:** Player model (`V1`, default)
- **Version:** `v1`
- **Where in code:** `config.js` (`BASE_URL`, `https://onesignal.com/api/v1`; paths in `ENDPOINTS`)
- **API:** User model (`V2`)
- **Version:** `Unversioned`
- **Where in code:** `config.js` (`BASE_URL_V2`, `https://api.onesignal.com/apps/{{app_id}}/users`)

`V1` calls `/players`, `/players/{player_id}` and `/apps/{app_id}/users/{external_user_id}`. `V2` calls the User model Create User endpoint.

### Version Deprecation

- **API:** Player model (`V1`)
- **Status:** Deprecated
- **Sunset date:** None announced
- **Source:** [Add a device](https://documentation.onesignal.com/reference/add-a-device)
- **API:** User model (`V2`)
- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Create user](https://documentation.onesignal.com/reference/create-user)

OneSignal lists the Player model endpoints under "Deprecated" in its API reference, and the [Add a device](https://documentation.onesignal.com/reference/add-a-device) page says "This is a Legacy API. Use Create User or Create Subscription instead." The [Software Lifecycle Policy](https://onesignal.com/software-lifecycle-policy) promises a deprecation window of 3 to 6 months before a shutdown. No removal date for `/api/v1/players` is published.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** Yes
- **Source:** [User Model migration guide](https://documentation.onesignal.com/docs/user-model-migration-guide)

The User model (`V2`) is the current API. The integration supports it, but the default remains `V1`.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Create user (User model)](https://documentation.onesignal.com/reference/create-user)
- [Add a device (Player model)](https://documentation.onesignal.com/reference/add-a-device)
- [Edit device (Player model)](https://documentation.onesignal.com/reference/edit-device)
- [Edit tags with external user id (Player model)](https://documentation.onesignal.com/reference/edit-tags-with-external-user-id)
- [Keys and IDs (authentication)](https://documentation.onesignal.com/docs/keys-and-ids)
- [Rate limits](https://documentation.onesignal.com/reference/rate-limits)
- [User Model migration guide](https://documentation.onesignal.com/docs/user-model-migration-guide)

### Changelog References

- **Changelog:** [OneSignal changelog](https://documentation.onesignal.com/release-notes/changelog)
- **Deprecations:** [Software Lifecycle Policy](https://onesignal.com/software-lifecycle-policy); [User Model migration guide (Player to User endpoint mapping)](https://documentation.onesignal.com/docs/user-model-migration-guide)
- **Versions:** None found
- **Feed:** [Changelog RSS](https://documentation.onesignal.com/release-notes/changelog/rss.xml)
- **Announcements:** [Migrating from legacy API keys](https://documentation.onesignal.com/docs/keys-and-ids#migrating-from-legacy-api-keys)
- **Last checked:** 2026-11-16

OneSignal introduced App and Organization API keys in November 2024. Its keys page says the legacy User Auth key and REST API key are still accepted but can no longer be created, and asks users moving to new keys to switch the base URL from `https://onesignal.com/api/v1/` to `https://api.onesignal.com`. No removal date for legacy keys is published.

## FAQ

> This section will be populated with frequently asked questions as they arise.
