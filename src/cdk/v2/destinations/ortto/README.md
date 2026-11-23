# Ortto Destination

Ortto (formerly Autopilot) is a marketing automation platform. This destination merges people (`identify`) and creates custom activities (`track`) through the Ortto v1 API.

Implementation: `src/cdk/v2/destinations/ortto/` (CDK v2 YAML workflows). There is no v0 or v1 folder for Ortto.

## Configuration

### Required Settings

| Config key       | UI label        | Description                                            |
| ---------------- | --------------- | ------------------------------------------------------ |
| `privateApiKey`  | Private API Key | Ortto custom API key. Secret.                          |
| `instanceRegion` | Instance Region | `au`, `eu` or `other` (default). Selects the API host. |

### Optional Settings

| Config key              | Description                                                                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orttoPersonAttributes` | Array of `{ rudderTraits, orttoAttribute, type }`: `context.traits[rudderTraits]` → custom person field `<typePrefix>:cm:<orttoAttribute>`.                                            |
| `orttoEventsMapping`    | Array of `{ rsEventName, orttoEventName, eventProperties[] }`. Required for `track`: maps an event to custom activity `act:cm:<orttoEventName>` and properties to activity attributes. |

`useNativeSDK` exists in the schema but is not used by the transformer.

## Integration Functionalities

### Implementation

- **Language**: CDK v2 (`procWorkflow.yaml`, `rtWorkflow.yaml`, `utils.js`, `config.js`).
- `cdkV2Enabled: true` in `db-config.json`; `ORTTO: { routerTransform: true, cdkV2: true }` in `src/features.ts`.
- **Processor vs Router**: Router destination (`transformAtV1: "router"`).

### Supported Message Types

| Type       | Supported | Ortto endpoint          |
| ---------- | --------- | ----------------------- |
| `identify` | Yes       | `/v1/person/merge`      |
| `track`    | Yes       | `/v1/activities/create` |
| others     | No        |                         |

Supported sources: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, warehouse, reactnative, flutter, cordova, shopify. Cloud mode only.

### Authentication

Headers built by both workflows:

```
X-Api-Key: <Config.privateApiKey>
Content-Type: application/json
```

No OAuth. This matches Ortto's documented `X-Api-Key` header. No announced change to Ortto API key auth was found. Ortto rate-limits bad credentials: 15 bad-credential requests in 15 seconds triggers a 15-second IP block ([rate limits](https://help.ortto.com/a-235-rate-limits)).

### Batching Support

Router code groups events by endpoint (person vs activities) and merges payloads, but `maxBatchSize` is `1` (`config.js`), so every request carries one person or one activity. Ortto accepts up to 100 people per merge request.

### Intermediate Calls

None.

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported.

### OAuth Support

No.

### Additional Functionalities

- **Regional hosts**: `api.au.ap3api.com`, `api.eu.ap3api.com`, `api.ap3api.com`.
- **Field ID building**: custom names are trimmed, lowercased and spaces replaced with `-`; prefix from `fieldTypeMap` (for example `text` → `str`, `longText` → `txt`, `number`/`decimalNumber`/`currency` → `int`, `date` → `dtz`, `timeAndDate` → `tme`, `boolean` → `bol`, `phone` → `phn`, `multiSelect` → `sst`, `object` → `obj`).
- **Merge keys**: `merge_by: ["str::ei", "str::email"]` (external id, email).

### Validations

- `message.type` required; only `identify`, `track`.
- `privateApiKey` and `instanceRegion` required.
- Email or userId required.
- `track`: `event` required and must be in `orttoEventsMapping` (exact match), else `Event names is not mapped`.
- Birthday must be `YYYY-MM-DD`, otherwise it is dropped.

### Rate Limits

Ortto publishes limits for bad requests only (15 bad requests in 15 seconds → 15-second IP block). The merge endpoint warns that many synchronous merges by a merge key can hit a concurrency limit. General request limits are not published. **NEEDS REVIEW**.

## General Queries

### Event Ordering

- **identify**: Required. Person merge overwrites field values, so older data delivered later can overwrite newer data.
- **track**: Less strict. Activities are recorded on receipt (no event timestamp is sent), so out-of-order delivery shifts activity times.
- In router mode, events in a batch are regrouped as all `identify` first, then all `track`. This changes relative order between identify and track within a batch.

### Data Replay Feasibility

- **Missing data**: `identify` can be replayed in order. `track` replays are recorded with the replay time, not the original time.
- **Already-delivered data**: `identify` replays are idempotent (merge). `track` replays create duplicate activities.

### Rate Limits and Batch Sizes

One record per request (see Batching Support).

### Multiplexing

No. One event produces one request.

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `config.js` (`IDENTIFY_ENDPOINT` for `/v1/person/merge`, `TRACK_ENDPOINT` for `/v1/activities/create`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Ortto developer guide](https://help.ortto.com/a-223-developer-guide)

### Latest Available Version

- **Version:** `v1`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Ortto API reference](https://help.ortto.com/a-250-api-reference)

v1 is the only published Ortto API version.

## Documentation Links

- [Ortto developer guide (API keys, regional hosts)](https://help.ortto.com/a-223-developer-guide)
- [Ortto API reference](https://help.ortto.com/a-250-api-reference)
- [Ortto: Person merge](https://help.ortto.com/developer/latest/api-reference/person/merge.html)
- [Ortto: Create custom activity events](https://help.ortto.com/a-271-create-a-custom-activity-event-create)
- [Ortto: Rate limits](https://help.ortto.com/a-235-rate-limits)

### Changelog References

- **Changelog:** [Ortto changelog](https://roadmap.ortto.com/changelog); [Ortto product updates](https://ortto.com/product-updates/)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** [Ortto changelog RSS](https://roadmap.ortto.com/api/changelog/feed.rss)
- **Announcements:** None found
- **Last checked:** 2026-11-16

The Ortto changelog is product-wide. API changes appear there when announced.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
