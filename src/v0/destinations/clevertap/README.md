# CleverTap Destination

Implementation in **JavaScript** (NOT a CDK v2 implementation)

## Overview

CleverTap is a customer engagement and retention platform. The RudderStack integration uploads user profiles, device tokens and events to CleverTap's Upload API, and deletes user profiles for regulation (suppression/deletion) requests.

## Configuration

### Required Settings

- **Account ID** (`accountId`): Sent as the `X-CleverTap-Account-Id` header.
- **Passcode** (`passcode`): Sent as the `X-CleverTap-Passcode` header.

### Optional Settings

- **Region** (`region`, default `none`): Account region. `none` uses `https://api.clevertap.com`; other values (`in1`, `sg1`, `us1`, `sk1`, `aps3`, `mec1`) use `https://<region>.api.clevertap.com`.
- **Enable tracking for anonymous users** (`trackAnonymous`, default `false`): When off, page, screen and track events without a `userId` are rejected.
- **Use Clevertap ObjectId for Mapping** (`enableObjectIdMapping`, default `false`): Sends `anonymousId` as CleverTap `objectId` (see [businesslogic.md](docs/businesslogic.md)). Also enables device token upload.
- **Account Token** (`accountToken`): Used only by the mobile SDKs in device mode. Not used by this transformer.
- **Event filtering** (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`): Applied by rudder-server before the transformer.

Consent management settings are handled by rudder-server, not by this transformer.

## Integration Functionalities

> CleverTap supports **Device mode** (web, Android, iOS, React Native) and **Cloud mode**.

### Supported Message Types

| Message type | Supported (cloud) | Destination action                                                      |
| ------------ | ----------------- | ----------------------------------------------------------------------- |
| Identify     | Yes               | Upload profile (`type: profile`); optional device token (`type: token`) |
| Track        | Yes               | Upload event (`type: event`); `Order Completed` becomes `Charged`       |
| Page         | Yes               | Upload event `Web Page Viewed: <name>`                                  |
| Screen       | Yes               | Upload event `Screen Viewed: <name>`                                    |
| Alias        | Yes               | Upload profile that adds the new `userId` as an identity                |
| Group        | No                | `Message type not supported`                                            |

Device mode message types (`db-config.json`): web `identify`, `track`, `page`; Android, iOS, React Native `identify`, `track`, `screen`.

### Batching Support

- **Supported**: Yes, in the router (`processRouterDest`).
- **Message types**: All. Every event goes to `POST /1/upload`, so profiles, tokens and events are mixed in one batch.
- **Batch size**: Up to 1000 records per request (`MAX_BATCH_SIZE`), matching CleverTap's limit of 1000 records per upload request.
- **How**: `batchMultiplexedEvents` groups transformed events; `generateClevertapBatchedPayload` merges their `d` arrays into `{ "d": [...] }`.

### Intermediate Calls

- **None** in the transform. User deletion calls CleverTap directly (see User Deletion).

### Proxy Delivery

- **Supported**: Yes. `src/v0/destinations/clevertap/networkHandler.js`; `src/features.ts` sets `transformerProxy: true`.
- **Behaviour**: Non-2xx responses throw `NetworkError` with a dynamic error type. A 2xx response whose body `status` is not `success` (`partial` or `fail`) throws `AbortedError` (400) for the whole request.
- **Partial batch handling**: No. This is a v0 proxy handler, so a `partial` response aborts every event in the batch, including the ones CleverTap processed. NEEDS REVIEW: whether this is intended.

### User Deletion

- **Supported**: Yes. `src/v0/destinations/clevertap/deleteUsers.js`.
- **Endpoint**: `POST /1/delete/profiles.json` (region-aware).
- **Body**: `{ "identity": [<userId>, ...] }`, up to 100 user IDs per request.
- **Behaviour**: Batches are sent one after another, not in parallel, to avoid CleverTap rate limits. Requires `accountId` and `passcode`.

### OAuth Support

- **Supported**: No. Authentication uses the account ID and passcode headers.

### Processor vs Router Destination

- **Type**: Router (`transformAtV1: "router"`). `src/features.ts` sets `CLEVERTAP: { routerTransform: true, regulations: true, transformerProxy: true }`.

### Additional Functionalities

- **Device token upload**: With `enableObjectIdMapping` on, an identify event with `anonymousId`, `context.device.token` and an Android or Apple OS also uploads the device token. The token type comes from `integrations.clevertap.deviceTokenType` (one of `chrome`, `fcm`, `gcm`, `apns`, `wns`, `mpns`), else `fcm` for Android and `apns` for Apple. `integrations.clevertap.chromeKeys` is sent as `tokenData.keys`.
- **`overrideFields`**: Keys in `traits.overrideFields` (or `context.traits.overrideFields`) are copied into `profileData` as they are, without stringifying.
- **Stringifying**: Object and array values in `profileData` and `evtData` are JSON-stringified, except `category-unsubscribe` and `category-resubscribe`. `Items` in `Charged` events stays an array of objects.
- **`saveDestinationResponse: true`**: rudder-server stores the destination response.

### Validations

- `message.type` is required, and must be a supported type.
- Track: `event` is required.
- Page, screen, track: `userId` is required unless `trackAnonymous` is on.
- With `enableObjectIdMapping`, tracking events need `anonymousId` or `userId`.
- `Charged` (Order Completed): `properties.products` must be an array of objects.
- User deletion: `accountId` and `passcode` are required.

### Rate Limits

- **Upload API**: Up to 1000 records per request ([Upload Events](https://developer.clevertap.com/docs/upload-events-api)).
- **Concurrency**: CleverTap limits concurrent requests per account per API and does not enforce per-minute, hourly or daily limits ([API Request Limit](https://developer.clevertap.com/docs/api-request-limit)). NEEDS REVIEW: the exact concurrency number; current docs and third-party sources say 15 concurrent requests, older CleverTap docs say 3 for Upload Events.
- Requests over the limit return 429.

## General Queries

### Event Ordering

- **Identify / Alias**: Required. Profile updates overwrite properties; an older profile update arriving later overwrites newer data. `ts` is set from `traits.ts` / `context.traits.ts` only when provided.
- **Track / Page / Screen**: Not strictly required when `properties.ts` is sent, because CleverTap records the event at that time. Without `properties.ts`, CleverTap records the time it receives the event, so ordering affects the recorded time.

### Data Replay Feasibility

- **Missing data replay**:
  - Track / Page / Screen: Feasible. Send `properties.ts` to keep the original event time.
  - Identify / Alias: Feasible with caution, as older profile data can overwrite newer data.
- **Already delivered data replay**:
  - Events: Not recommended. The transformer sends no deduplication key, so replays create duplicate events.
  - Identify: Profile uploads overwrite properties, so replay is safe apart from the ordering risk above.

### Multiplexing

- **Identify with device token** (`enableObjectIdMapping` on, `anonymousId` and `context.device.token` present, Android or Apple OS): Yes. Two records: one `profile` and one `token`. Both go into the same `/1/upload` batch.
- **All other events**: No.

## Version Information

### Current Version

CleverTap REST API **v1**:

- `POST /1/upload` for profiles, device tokens and events.
- `POST /1/delete/profiles.json` for user deletion.

### Version Deprecation

No deprecation of the v1 REST API has been announced, and no sunset date is published.

### Latest Available Version

**v1** is the latest CleverTap REST API version. The integration uses it.

## Documentation Links

### API Documentation

- [Upload Events API](https://developer.clevertap.com/docs/upload-events-api)
- [Upload User Profiles API](https://developer.clevertap.com/docs/upload-user-profiles-api)
- [Upload Device Tokens API](https://developer.clevertap.com/docs/upload-device-tokens-api)
- [Delete User Profiles / Disassociate API](https://developer.clevertap.com/docs/disassociate-api)
- [API Request Limit](https://developer.clevertap.com/docs/api-request-limit)
- [Region (IDC) endpoints](https://developer.clevertap.com/docs/idc)
- [Recording customer purchases (Charged)](https://developer.clevertap.com/docs/concepts-events#recording-customer-purchases)

### Changelog References

- [Developer changelog](https://developer.clevertap.com/docs/changelog) (index of all years)
- [Developer changelog, 2026](https://developer.clevertap.com/docs/2026) (monthly changelog pages for the current year, mostly SDK releases)
- [Product release notes](https://docs.clevertap.com/docs/whats-new)
- NEEDS REVIEW: No REST API-specific changelog, API versions or sunset page, or RSS feed was found.

### RETL Functionality

See [docs/retl.md](docs/retl.md).

### Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
