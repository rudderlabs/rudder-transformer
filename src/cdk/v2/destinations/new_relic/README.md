# New Relic Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/new_relic/procWorkflow.yaml`, reserved NRQL words in `config.js`). There is no v0 or v1 implementation. `NEW_RELIC: { cdkV2: true }` in `src/features.ts` and `cdkV2Enabled: true` in `db-config.json`.

## Configuration

### Required Settings

- **Account ID** (`accountId`): New Relic account ID, placed in the endpoint path. Marked as a secret key.
- **Insert Key** (`insertKey`): New Relic Insights insert key, sent in the `Api-Key` header. Marked as a secret key.

### Optional Settings

- **Data Center** (`dataCenter`): `us` (default) or `eu`. Selects the collector host.
- **Custom Event Type** (`customEventType`): Value of `eventType` in the payload. Defaults to `rudderstack`.
- **Send Device Context** (`sendDeviceContext`, default `false`): Flattens `message.context` into the payload.
- **Send userId and anonymousId** (`sendUserIdanonymousId`, default `false`): Adds `userId` and `anonymousId`.

## Integration Functionalities

> New Relic supports **Cloud mode** only.

### Supported Message Types

- Track only.

### Implementation

- **Implemented in**: CDK v2 (YAML workflow)
- **Processor vs Router**: Processor (`transformAtV1: "processor"`).

### Authentication

- Header `Api-Key: <insertKey>` plus `Content-Type: application/json`. The account ID is in the URL path.
- New Relic now describes Insights insert keys as "older keys that are not recommended for use by customers, but are still supported", and recommends license keys (`ingest - license`) instead ([New Relic API keys](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/)). No end-of-life date is published.
- The current Event API page says the request must use a **License** key in the `Api-Key` header ([Event API](https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/introduction-event-api/)). Because the code just forwards the configured value in `Api-Key`, a license key pasted into the "Insert Key" field should work.
- **NEEDS REVIEW**: The UI and schema still call the field "Insert Key". Consider relabelling it to accept a license key, and confirm whether legacy insert keys are accepted in the `Api-Key` header (older docs paired insert keys with `X-Insert-Key`).

### Batching Support

- **Supported**: No. One request per event. The Event API accepts an array of events up to 1 MB per POST, but this integration does not use it.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No.

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: No.

### Additional Functionalities

- **Flattening**: `properties` (and `context` when enabled) are flattened with `flattenJson`, because the Event API accepts only string and number values.
- **Booleans** are converted to strings.
- **Reserved NRQL words** (`config.js`, for example `select`, `from`, `limit`) used as keys are wrapped in single quotes.
- **Reserved attributes** `accountId`, `appId` and `eventType` are dropped from the computed payload before `eventType` is set.

### Validations

- `message.type` must be present and exactly `track` (case-sensitive).

### Rate Limits

From the [Event API docs](https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/introduction-event-api/):

- 100,000 POSTs per minute per account (429 for the rest of the minute after that).
- 1 MB max payload per POST, 255 attributes per event, 255-character attribute names, 4,096-character values.

## General Queries

### Event Ordering

- Not required. Each event carries its own `timestamp` (seconds), and New Relic stores events as an append-only time series.

### Data Replay Feasibility

- **Missing data**: Feasible. Events keep their original `timestamp`. **NEEDS REVIEW**: New Relic may reject timestamps outside its accepted window (older than about 24 hours, per historic Event API docs).
- **Already delivered data**: Not safe. Events have no dedupe key, so replays create duplicates.

### Multiplexing

- **No**.

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `procWorkflow.yaml` (`prepareContext` step, `baseEndpoint`): `https://insights-collector.newrelic.com/v1/accounts/<accountId>/events` (US) and `https://insights-collector.eu01.nr-data.net/v1/accounts/<accountId>/events` (EU)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Event API introduction](https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/introduction-event-api/)

Insights insert keys are "not recommended" but still supported, with no end date ([New Relic API keys](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/)). The [end-of-life notices](https://docs.newrelic.com/eol/) list no Event API or insert key entry.

### Latest Available Version

- **Version:** `v1`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Event API introduction](https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/introduction-event-api/)

`v1` is the only Event API version. The current docs show `https://insights-collector.newrelic.com/v1/accounts/events` without the account ID in the path. A JP data center (`insights-collector.jp.nr-data.net`) is also listed but not supported by this integration. NEEDS REVIEW: confirm whether the account-ID path form is still preferred.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Event API introduction](https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/introduction-event-api/)
- [New Relic API keys](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/)
- [System limits](https://docs.newrelic.com/docs/data-apis/manage-data/view-system-limits/)

### Changelog References

- **Changelog:** [New Relic release notes](https://docs.newrelic.com/docs/release-notes/); [What's new in New Relic](https://docs.newrelic.com/whats-new/)
- **Deprecations:** [End-of-life notices](https://docs.newrelic.com/eol/)
- **Versions:** None found
- **Feed:** [What's new RSS](https://docs.newrelic.com/whats-new/feed.xml); [End-of-life RSS](https://docs.newrelic.com/eol/feed.xml)
- **Announcements:** None found
- **Last checked:** 2026-11-16

## FAQ

> This section will be populated with frequently asked questions as they arise from usage and support requests.
