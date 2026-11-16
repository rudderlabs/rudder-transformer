# Vitally Destination

Implementation in **CDK v2** (`procWorkflow.yaml`). The live code is `src/cdk/v2/destinations/vitally/`; there is no v0 or v1 folder. `cdkV2Enabled: true` in `db-config.json` and `VITALLY: { cdkV2: true }` in `src/features.ts`.

## Overview

Vitally is a customer success platform. Vitally owns a RudderStack-specific ingestion endpoint; the integration forwards RudderStack identify, track and group messages to it unchanged, and Vitally turns them into users, product events and accounts. Vitally maintains this destination (RudderStack docs point to support@vitally.io).

## Configuration

Source: `rudder-integrations-config/src/configurations/destinations/vitally/`.

| Config key (`destination.Config`)                                       | UI label         | Required     | Used in transformer                         |
| ----------------------------------------------------------------------- | ---------------- | ------------ | ------------------------------------------- |
| `apiKeyVitally`                                                         | API KEY          | Yes (secret) | Yes, `authorization: Basic {apiKeyVitally}` |
| `consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes` | Consent settings | No           | No                                          |

The key comes from Vitally: Account Settings > Product Data integrations > RudderStack.

## Integration Functionalities

### Implementation

- CDK v2 workflow, two steps: validate the type, then wrap the message in a request.
- `transformAtV1: "processor"`; no `rtWorkflow.yaml`, so it is a **processor** destination. The `batchMode` branch in `procWorkflow.yaml` is only reached from a router workflow and is dead code here.

### Supported Message Types

Identify, Track, Group (cloud mode only). The check is case-sensitive: `message.type` must be exactly `identify`, `track` or `group`.

Supported sources: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, warehouse, reactnative, flutter, cordova, shopify.

### Authentication

- Headers: `authorization: Basic {Config.apiKeyVitally}` and `content-type: application/json`.
- The code does not base64-encode the key; it is placed after `Basic ` as entered. Vitally's help article says only that the API key goes in the `Authorization` header. **NEEDS REVIEW**: confirm the expected header format with Vitally.
- No Vitally announcement of auth changes for this endpoint was found.

### Batching Support

No.

### Intermediate Calls

None.

### Proxy Delivery

No.

### User Deletion

No.

### OAuth Support

No.

### Additional Functionalities

- The full RudderStack message is sent as the body; all mapping happens on Vitally's side.
- Vitally completes setup only after it receives at least one message.

### Validations

- `message.type` is required and must be identify, track or group.
- No field validation; Vitally validates the content.

### Rate Limits

Not documented for the RudderStack endpoint. **NEEDS REVIEW**.

## General Queries

### Event Ordering

- **Identify and Group** update user and account traits in Vitally; ordering is required to avoid stale traits.
- **Track** messages carry their own `timestamp`/`originalTimestamp`, so ordering is less important. **NEEDS REVIEW**: whether Vitally uses the message timestamp.

### Data Replay Feasibility

- **Missing data**: track replay is possible if Vitally uses the message timestamp; identify/group replay can overwrite newer traits.
- **Already delivered data**: Vitally may dedupe by `messageId`, but this is not documented. **NEEDS REVIEW**.

### Multiplexing

No.

## Version Information

### Current Version

- Unversioned Vitally RudderStack endpoint: `POST https://api.vitally.io/rudderstack` (hard-coded in `procWorkflow.yaml`).
- Vitally's help article now shows the endpoint as `https://{subdomain}.api.vitally.io/rudderstack`. The code uses the host without a subdomain, which still exists (it returns `401 Authorization header not present` without a key). **NEEDS REVIEW**: confirm with Vitally that the shared host remains supported for all accounts.

### Version Deprecation

- No deprecation announced.

### Latest Available Version

- The endpoint has no versions. Vitally also has a separate REST API that this integration does not use.

## Documentation Links

- [Vitally: RudderStack integration](https://docs.vitally.io/en/articles/9847122-rudderstack)

### Changelog References

- [Vitally 2026 release notes](https://docs.vitally.io/en/collections/18139014-2026-release-notes)
- [Vitally 2025 release notes](https://docs.vitally.io/en/collections/11580991-2025-release-notes)
- **NEEDS REVIEW**: product release notes only; no API changelog, deprecations page or RSS feed found.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
