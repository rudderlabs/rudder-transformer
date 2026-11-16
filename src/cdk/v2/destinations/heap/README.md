# Heap Destination

Implementation in **CDK v2** (`procWorkflow.yaml`). The live code is `src/cdk/v2/destinations/heap/`; there is no v0 or v1 folder. `cdkV2Enabled: true` in `db-config.json` and `HEAP: { cdkV2: true }` in `src/features.ts`.

## Overview

Heap (part of Contentsquare) is a product analytics platform. The cloud-mode integration sends custom events and user properties to Heap's server-side API.

## Configuration

Source: `rudder-integrations-config/src/configurations/destinations/heap/`.

| Config key (`destination.Config`)                                       | UI label                            | Required | Used in transformer       |
| ----------------------------------------------------------------------- | ----------------------------------- | -------- | ------------------------- |
| `appId`                                                                 | App Id                              | Yes      | Yes, `app_id` in the body |
| `dataResidency`                                                         | Data Residency (`us` default, `eu`) | No       | Yes, selects the host     |
| `useNativeSDK`                                                          | Use device-mode to send events      | No       | No                        |
| `eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`        | Event filtering                     | No       | No                        |
| `consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes` | Consent settings                    | No       | No                        |

`secretKeys` is empty.

## Integration Functionalities

### Implementation

- CDK v2 workflow.
- `transformAtV1: "processor"`; no `rtWorkflow.yaml`, so it is a **processor** destination. The `batchMode` branch is dead code here.

### Supported Message Types

Identify and Track (cloud and web device mode). The type check is case-sensitive (`identify` or `track`).

Supported sources: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, warehouse, reactnative, flutter, cordova, shopify.

### Authentication

- No auth header. Headers are `Accept: application/json` and `Content-Type: application/json`; the environment is identified by `app_id` in the body.
- This matches Heap's server-side Track and Add User Properties API reference, which declares no security scheme. Only the User Deletion API needs an auth token, and this integration does not use it.
- No Heap or Contentsquare announcement of auth changes for these endpoints was found. Third-party reports say Heap accepts requests with an invalid `app_id` without an error, so a wrong App Id fails silently. **NEEDS REVIEW**.

### Batching Support

No. Heap offers Bulk Track and Bulk Add User Properties (up to 1,000 per request); the integration does not use them.

### Intermediate Calls

None.

### Proxy Delivery

No.

### User Deletion

No.

### OAuth Support

No.

### Additional Functionalities

- **Data residency**: `dataResidency: "eu"` sends to `https://c.eu.heap-api.com`; otherwise `https://heapanalytics.com`.
- **Idempotency**: `properties.idempotencyKey` on track is sent as `idempotency_key` and removed from `properties`.
- **Flattening**: nested properties/traits are flattened with `flattenJson`.

### Validations

- `message.type` must be identify or track.
- Identify requires `traits` or `context.traits`.
- Track requires `event`.
- Both require an identity (generic `userId`, which falls back to `anonymousId`).

### Rate Limits

From Heap's API reference: 30 requests per 30 seconds per identity per `app_id`, for both Track and Add User Properties.

## General Queries

### Event Ordering

- **Identify** overwrites user properties; ordering is required.
- **Track** sends `timestamp`, so events land at their original time; ordering is not required.

### Data Replay Feasibility

- **Missing data**: track can be replayed (timestamped). Identify replay can overwrite newer properties.
- **Already delivered data**: replaying track creates duplicates unless the original events carried `properties.idempotencyKey`; Heap ignores repeated idempotency keys.

### Multiplexing

No.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `procWorkflow.yaml` (`endpointHost`; paths `/api/track`, `/api/add_user_properties`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Heap server-side APIs overview](https://developers.heap.io/reference/server-side-apis-overview)

The Add User Properties spec is marked `deprecated: false`.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Heap server-side APIs overview](https://developers.heap.io/reference/server-side-apis-overview)

No newer server-side ingestion API was found.

## Documentation Links

- [Heap server-side APIs overview](https://developers.heap.io/reference/server-side-apis-overview)
- [Heap Track API](https://developers.heap.io/reference/track-1)
- [Heap Add User Properties API](https://developers.heap.io/reference/add-user-properties)
- [Heap API authentication](https://developers.heap.io/reference/authentication)

### Changelog References

- **Changelog:** [heap.js 5 changelog](https://developers.heap.io/docs/heapjs-5-changelog); [Classic heap.js changelog](https://developers.heap.io/docs/heapjs-changelog)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Heap publishes no server-side API changelog; the changelogs above cover the client SDK. [llms.txt](https://developers.heap.io/llms.txt) lists all SDK changelogs.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
