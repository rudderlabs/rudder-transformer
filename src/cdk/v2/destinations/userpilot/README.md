# Userpilot Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/userpilot/procWorkflow.yaml`)

## Overview

Sends users, track events and companies to the Userpilot Real-time HTTP API. Userpilot also supports
device mode (web SDK, loaded by the JS SDK), which is outside the transformer.

The destination is gated behind the `userpilot_destination` feature flag in `db-config.json`.

## Configuration

Config keys from `schema.json` that the transformer reads (`destination.Config`):

| Key           | Required | Used for                                                                                              |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `apiKey`      | Yes      | Sent as `Authorization: Token <apiKey>`. Listed in `secretKeys`.                                      |
| `apiEndpoint` | Yes      | Base URL of the HTTP API (default in code: `https://analytex.userpilot.io`). Trailing slash stripped. |

`token` (web SDK app token) and `sdkEndpoint` are device-mode settings and are not used by the transformer.

### Authentication

Every request carries these headers, built in the `prepareContext` step:

```
Authorization: Token <apiKey>
Content-Type: application/json
X-API-Version: 2020-09-22
```

The API key is an environment-scoped key from the Userpilot Environment page. Userpilot allows up to 10
active keys per environment and returns `401` for deactivated keys
([Authentication](https://docs.userpilot.com/api-references/authentication)). No auth deprecation or move
to OAuth has been announced as of 2026-11-16.

## Integration Functionalities

### Supported Message Types

| Mode               | Message types                        |
| ------------------ | ------------------------------------ |
| Cloud (web, cloud) | `identify`, `track`, `group`         |
| Device (web)       | `identify`, `track`, `page`, `group` |

Any other type fails with `message type <type> is not supported by Userpilot`.

### Implementation

- **Implemented in**: CDK v2 (`cdkV2Enabled: true`, `USERPILOT: { cdkV2: true }` in `src/features.ts`)
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`), no `rtWorkflow.yaml`
- **Source types**: `web`, `cloud` (no `warehouse`, so no RETL)

### Validations

| Message    | Required          |
| ---------- | ----------------- |
| `identify` | `userId`          |
| `track`    | `userId`, `event` |
| `group`    | `groupId`         |

`anonymousId` is never used. Anonymous-only events fail.

### Rate Limits

A Userpilot help article states 600 requests per minute per application token for the HTTP Identify and
Track APIs. The current API reference pages do not state a limit. **NEEDS REVIEW**: confirm against
current Userpilot docs.

### Batching Support

None. One request per event. Userpilot has separate bulk APIs that this destination does not use.

### Intermediate Calls

None.

### Proxy Delivery

No `networkHandler.js`. Not supported.

### User Deletion

No `deleteUsers.js`. Not supported.

### OAuth Support

No. API key only (no `auth` block in `db-config.json`).

### Additional Functionalities

- `createdAt` in user or company traits is renamed to `created_at`. All other trait keys pass through
  unchanged.
- On identify, `traits.company` is sent as the `company` object only when `company.id` is set.

## General Queries

### Event Ordering

- **Identify / Group**: Overwrite user or company metadata, so ordering matters. Out-of-order delivery can
  leave stale values.
- **Track**: Userpilot requires the user to exist before a track call
  ([Track Events](https://docs.userpilot.com/api-references/real-time/track-event)), so an identify must
  reach Userpilot before the first track for a new user. The payload carries no timestamp, so Userpilot
  records events at receive time.

### Data Replay Feasibility

- **Missing data**: Identify and group can be replayed (last write wins). Track events replayed later get
  the replay time as their event time, because no timestamp is sent.
- **Already delivered data**: Replaying track events creates duplicates (no event ID is sent). Identify and
  group replays are idempotent.

### Multiplexing

No. One request per event.

## Version Information

### Current Version

- **Version:** `v1` (header `X-API-Version: 2020-09-22`)
- **Where in code:** `utils.js` (endpoint builder: `{apiEndpoint}/v1/identify`, `/v1/track`, `/v1/companies/identify`); `procWorkflow.yaml` (`$.context.apiVersion = "2020-09-22"`)

EU data residency uses the `analytex-eu` host, set through `apiEndpoint`.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Identify User](https://docs.userpilot.com/api-references/real-time/identify-user)

The identify reference still requires `X-API-Version: 2020-09-22` and lists no other value. The current company identify reference page no longer lists the `X-API-Version` header. NEEDS REVIEW: check whether the header is still needed for company identify.

### Latest Available Version

- **Version:** `v1` (header `X-API-Version: 2020-09-22`)
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Identify User](https://docs.userpilot.com/api-references/real-time/identify-user)

## Documentation Links

### API Documentation

- [Authentication](https://docs.userpilot.com/api-references/authentication)
- [Identify User](https://docs.userpilot.com/api-references/real-time/identify-user)
- [Track Event](https://docs.userpilot.com/api-references/real-time/track-event)
- [Identify Company](https://docs.userpilot.com/api-references/real-time/identify-company)
- [Legacy identify and track API article](https://docs.userpilot.com/article/195-identify-users-and-track-api)

### Changelog References

- **Changelog:** [Userpilot Product News](https://userpilot.com/product-news/) (product release notes, not API-specific)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

## RETL Functionality

Not supported. See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
