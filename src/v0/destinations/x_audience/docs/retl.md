# X Audience RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` includes `warehouse`, and the destination accepts only `record` events.

## Supported RETL types

- **JSON Mapper**: Not supported (`disableJsonMapper: true`).
- **VDM V1**: Supported flag set (`supportsVisualMapper: true`).
- **VDM V2**: **Supported**. `supportedMessageTypes.cloud` is `["record"]` and `transform.js` handles `record` events.
- Audience destination: `isAudienceSupported: true`, `supportsBlankAudienceCreation: true`, `syncBehaviours: ["mirror"]`.

## Connection config

- `audienceId`: target Custom Audience ID. A new audience can be created from the UI; rudder-integrations-info calls `POST https://ads-api.x.com/12/accounts/:accountId/custom_audiences?name=...`.

## Mappable fields (rudder-integrations-info `x_audience/config.ts`)

`email`, `phone_number`, `device_id`, `twitter_id`, `partner_user_id`, `handle`, `effective_at`, `expires_at`.

## RETL flow

- `action: insert` or `update` → `operation_type: Update` (add users).
- `action: delete` → `operation_type: Delete` (remove users).
- See [businesslogic.md](businesslogic.md) for batching and hashing.
