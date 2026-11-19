# Segment Destination

Implementation in **JavaScript** (v0, not CDK v2). Code: `src/v0/destinations/segment/`.

## Overview

Forwards RudderStack events to a Segment source through the Segment HTTP Tracking API `batch` endpoint. Each RudderStack event is sent as a one-item batch.

## Configuration

| Config key | UI label          | Used for                                          |
| ---------- | ----------------- | ------------------------------------------------- |
| `writeKey` | Segment Write Key | Basic auth username for `https://api.segment.io`. |

Notes on the config in `rudder-integrations-config`:

- `schema.json` does not declare `writeKey` and has no `required` list, so an empty write key passes validation. The transformer does not check it either.
- `secretKeys` is empty, so `writeKey` is not treated as a secret. NEEDS REVIEW: it should probably be listed.

## Integration Functionalities

### Supported Message Types

From `db-config.json`: `cloud: ["identify", "track", "page", "group", "alias", "screen"]`.

The code does not branch on type: every message is reduced to the same set of fields (see [businesslogic.md](docs/businesslogic.md)). `group` and `alias` lose the fields Segment requires for them (see Validations).

### Authentication

`Authorization: Basic base64("<writeKey>:")`, built in `transform.js`. The write key is the username with an empty password.

Segment documents three options: write key in the body, write key as Basic auth (used here), or an OAuth access token (Bearer) for sources with OAuth enabled, with the write key still in the payload. If a customer enables "enforce OAuth" on the Segment source, Basic-auth requests from this destination would be rejected. NEEDS REVIEW: confirm whether Segment enforces OAuth per source. ([HTTP API source docs](https://www.twilio.com/docs/segment/connections/sources/catalog/libraries/server/http-api))

No announced deprecation of write-key auth was found.

### Validations

None in code. No check on `writeKey`, message type, `groupId` or `previousId`.

### Rate Limits

From Segment's HTTP API docs:

- Recommended max 1,000 requests/second per workspace; excess may get HTTP 429 with `Retry-After`.
- Batch request max 500 KB; each event under 32 KB; max 2,500 events per batch.

### Batching Support

**No** in practice. The payload uses the `/v1/batch` endpoint but always contains one event. Processor-only transform; no router batching.

### Intermediate Calls

None.

### Proxy Delivery

**No.** No `networkHandler.js`.

### User Deletion

**No.** No `deleteUsers.js`.

### OAuth Support

**No.**

### Processor vs Router

**Processor** (`transformAtV1: "processor"`). Not listed in `features.ts`.

### Regional Endpoints

Only the US endpoint `https://api.segment.io/v1/batch` is supported. Segment EU workspaces must use `https://events.eu1.segmentapis.com/v1`. Segment notes that EU write keys sent to the US endpoint can return success while the events never appear. ([Regional Segment](https://www.twilio.com/docs/segment/guides/regional-segment))

## General Queries

### Event Ordering

- **identify / group**: Segment merges traits as received, so out-of-order delivery can overwrite newer traits. Order matters.
- **track / page / screen**: Segment orders by `timestamp`. But the transformer sends `timeStamp` (wrong case), which Segment ignores, so Segment uses receive time. Ordering and replay timing therefore depend on delivery order. See Known Issues.

### Data Replay Feasibility

- **Missing data**: Possible, but replayed events get the replay time as their timestamp (see Known Issues).
- **Already delivered**: Not safe. `messageId` is not forwarded, so Segment cannot deduplicate; replays create duplicates.

### Multiplexing

**No.**

## Known Issues

These are likely bugs in `transform.js`. NEEDS REVIEW.

1. **Timestamp key is `timeStamp`**, not `timestamp`. Segment ignores it and records the server receive time.
2. **`groupId` is not forwarded** for `group` calls, and **`previousId` is not forwarded** for `alias` calls. Segment requires both, so these calls are likely rejected or dropped.
3. **`messageId`, `context`, `name` (page/screen) and `integrations` are not forwarded.**
4. `writeKey` has no validation, no schema entry and is not in `secretKeys`.

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `config.js` (`batchEndpoint` = `https://api.segment.io/v1/batch`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Segment HTTP API source](https://www.twilio.com/docs/segment/connections/sources/catalog/libraries/server/http-api)

### Latest Available Version

- **Version:** `v1`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Segment HTTP API source](https://www.twilio.com/docs/segment/connections/sources/catalog/libraries/server/http-api)

v1 is the only version of the Tracking API.

## Documentation Links

- [Segment HTTP API source (batch endpoint and write-key Basic auth)](https://www.twilio.com/docs/segment/connections/sources/catalog/libraries/server/http-api)
- [Regional Segment](https://www.twilio.com/docs/segment/guides/regional-segment)

### Changelog References

- **Changelog:** [Twilio changelog, Segment filter](https://www.twilio.com/en-us/changelog?product=Segment)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** [Twilio changelog RSS (all products)](https://www.twilio.com/en-us/changelog.feed.xml)
- **Announcements:** None found
- **Last checked:** 2026-11-16

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
