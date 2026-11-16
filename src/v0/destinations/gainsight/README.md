# Gainsight (CS / NXT) Destination

Implementation in **JavaScript** (v0, not CDK v2). Code: `src/v0/destinations/gainsight/`.

This is the Gainsight CS (formerly Gainsight NXT) destination. Gainsight PX (`gainsight_px`) and Gainsight PX Audience are separate destinations with their own folders.

## Overview

Sends RudderStack `identify`, `group` and `track` calls to Gainsight CS:

- `identify` upserts a Person record.
- `group` finds or creates a Company record, then links the user's Person record to it.
- `track` publishes an event to the Gainsight Events framework (Journey Orchestrator).

## Configuration

Config keys read from `destination.Config` (labels from `ui-config.json`):

| Config key        | UI label                                              | Used for                                                                            |
| ----------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `domain`          | Gainsight Custom Domain or Subdomain                  | Host for every request (`https://<domain>/...`). Required in `schema.json`.         |
| `accessKey`       | Gainsight Accesskey                                   | `Accesskey` header. Required for `identify` and `group`; optional for `track`.      |
| `personMap`       | Map Rudder payload property to Custom Gainsight Field | Renames custom traits to Person fields (identify).                                  |
| `companyMap`      | Map Rudder payload property to Custom Gainsight Field | Renames custom traits to Company fields (group).                                    |
| `sharedSecret`    | Events Shared Secret                                  | `sharedSecret` header for `track`. Required for track.                              |
| `tenantId`        | Tenant ID                                             | `tenantId` header for `track`. Required for track.                                  |
| `topicName`       | Topic Name                                            | `topicName` header for `track`. Required for track.                                 |
| `eventNameMap`    | Map RudderStack Event to Gainsight Event              | RudderStack event name to Gainsight `eventName` header. Required per tracked event. |
| `eventVersionMap` | Map RudderStack Event to Gainsight Event Version      | RudderStack event name to `eventVersion` header. Required per tracked event.        |
| `contractId`      | Contract ID                                           | Optional `contractId` header for `track`.                                           |

`secretKeys` in `db-config.json`: `accessKey`, `sharedSecret`.

Note: `schema.json` only declares `domain` and `accessKey` (plus consent fields). The other keys are not validated by the schema. NEEDS REVIEW.

## Integration Functionalities

### Supported Message Types

From `db-config.json`: `cloud: ["group", "identify", "track"]`. Cloud mode only. Source types include `warehouse`.

Any other type throws `message type <type> not supported`.

### Authentication

- **Person and Company APIs** (`identify`, `group`, and the intermediate Company calls): header `Accesskey: <Config.accessKey>`. This is a Gainsight CS REST API access key, generated under Administration > Connectors 2.0. Gainsight documents that it does not expire and allows only one access key per org. Regenerating it invalidates the old key.
- **Events API** (`track`): headers `sharedSecret`, `topicName`, `tenantId` (spread from config), plus `eventName`, `eventVersion`, optional `contractId`, and `Accesskey` if `accessKey` is set.
- No OAuth. `db-config.json` has no `auth` block and `rudder-auth` has no Gainsight implementation.

Partner auth changes to watch (see [Version Information](#version-information)):

- Gainsight now offers M2M OAuth (client credentials, 24-hour bearer tokens) alongside access keys. Gainsight says M2M OAuth cannot be used for the Events API. ([Generate REST API Key](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs/Generate_REST_API/Generate_REST_API_Key))
- The **April 2026 CS release** made IP allow listing mandatory for access-key connections to Gainsight APIs. Existing connections keep working, but editing an existing access-key connection prompts for an IP allow list. Customers who edit their connection must allow-list RudderStack's egress IPs or calls will fail. ([Q1 April 2026 release notes](https://support.gainsight.com/gainsight_nxt/Release_Notes/Current_Release_Notes_-_2026/01_Gainsight_CS_Release_Notes_Q1_April_2026))

### Validations

- `identify`: `accessKey` required; email required (`traits.email` or `context.traits.email`).
- `group`: `accessKey` required; `traits.name` (company name) required; `context.traits.email` required (only `context.traits`, not `traits`).
- `track`: `event` required; `sharedSecret`, `topicName`, `tenantId` required; the event must exist in both `eventNameMap` and `eventVersionMap`, otherwise a `ConfigurationError` is thrown.

### Rate Limits

From Gainsight docs (fixed-window limits, per org):

| API                                      | Limit                                                 |
| ---------------------------------------- | ----------------------------------------------------- |
| Synchronous REST (Company, Events, etc.) | 100 calls/min, 100,000 calls/day                      |
| People API (sync)                        | 100 calls/min, 50,000 calls/day (per People API page) |
| Async / bulk APIs                        | 10 calls/hour, 100/day (not used here)                |

A `group` call uses 3 synchronous calls (search, create/update, Person upsert), so the per-minute limit is reached faster for group-heavy traffic.

### Batching Support

**No.** Every event produces one request. Router transform uses `simpleProcessRouterDest`.

### Intermediate Calls

`group` only, via `util.js` (`handleHttpRequest`, `Accesskey` header):

1. `POST https://<domain>/v1/data/objects/query/Company` searches for a Company with `Name == traits.name`.
2. If none found, `POST https://<domain>/v1/data/objects/Company` creates it; otherwise `PUT https://<domain>/v1/data/objects/Company?keys=Name` updates it. Both return the Company `Gsid`.
3. The final request (sent by the server) upserts the Person with `companies: [{ Company_ID: <Gsid> }]`.

Non-2xx responses throw `NetworkError` with a status-based error type. A 2xx that is not 200, or an empty body, throws `RetryableError` (500).

### Proxy Delivery

**No.** No `networkHandler.js`.

### User Deletion

**No.** No `deleteUsers.js`.

### OAuth Support

**No.**

### Processor vs Router

**Router** (`transformAtV1: "router"`). `features.ts` has `GAINSIGHT: { routerTransform: true }`.

### Additional Functionalities

- Custom traits are forwarded only if mapped in `personMap` / `companyMap`. Unmapped custom traits are dropped (logged at info level). Standard mapped fields always pass through.
- If `Name` is missing on identify, it is built from first, middle and last name.

## General Queries

### Event Ordering

- **identify / group**: Required. Both overwrite Person/Company fields; there is no timestamp-based conflict handling in the Person or Company APIs, so out-of-order delivery can leave stale values.
- **track**: Events trigger Journey Orchestrator programs. Order rarely matters for the data but can matter for program logic. NEEDS REVIEW.

### Data Replay Feasibility

- **Missing data**: identify/group can be replayed if they are replayed in order and newer data does not exist. track can be replayed, but replaying triggers program actions (emails etc.) at replay time.
- **Already delivered**: identify/group are upserts (by Email / Company Name), so replay is idempotent apart from overwriting newer values. track is not deduplicated; replays fire events again.

### Multiplexing

**No** in the output sense: one event, one delivered request. `group` makes 2 intermediate calls before the delivered request (see above).

## Version Information

### Current Version

No single API version. Paths used:

- People: `https://<domain>/v1.0/api/people` (PUT upsert)
- Events: `https://<domain>/v1.0/api/eventManager/event` (POST)
- Company: `https://<domain>/v1/data/objects/...` (Company API v1)

### Version Deprecation

No published deprecation dates for these paths. However, the current People API docs document `PUT /v1/peoplemgmt/v1.0/people`, not the `/v1.0/api/people` path the code uses. The code's path is the older Person API path. It still works per our test fixtures, but its long-term support is not documented. NEEDS REVIEW.

Auth: access keys are not deprecated, but see the April 2026 IP allow-listing requirement above.

### Latest Available Version

- People API: `/v1/peoplemgmt/v1.0/people` (single) and `/v1/peoplemgmt/v1.0/people/async` (up to 50 records).
- Company API: `/v1/data/objects/Company` (unchanged).
- Events API: `/v1.0/api/eventManager/event` with `eventVersion` such as `v01`.

## Documentation Links

- [Gainsight API and developer docs](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs)
- [Generate REST API Key](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs/Generate_REST_API/Generate_REST_API_Key)
- [People API](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs/Person_API/People_API_Documentation)
- [Company API](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs/Company_and_Relationship_API/Company_API_Documentation)
- [Events API](https://support.gainsight.com/gainsight_nxt/API_and_Developer_Docs/Events_API/Events_API)

### Changelog References

- [Gainsight CS release notes](https://support.gainsight.com/gainsight_nxt/Release_Notes)
- [Gainsight CS Q1 April 2026 release notes (PKCE OAuth, mandatory IP allow listing for access keys)](https://support.gainsight.com/gainsight_nxt/Release_Notes/Current_Release_Notes_-_2026/01_Gainsight_CS_Release_Notes_Q1_April_2026)
- [Gainsight community product updates](https://communities.gainsight.com/product-updates)
- No API-specific deprecations page or RSS feed found. NEEDS REVIEW.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
