# LaunchDarkly Segment (Audience) Destination

Implementation in **CDK v2** (`procWorkflow.yaml`)

## Configuration

### Required Settings

- **Access Token** (`accessToken`): LaunchDarkly API access token. Sent as the raw `Authorization` header value (no `Bearer` prefix). Secret key.
- **Client-side ID** (`clientSideId`): LaunchDarkly environment client-side ID. Sent as `environmentId`.
- **Audience ID** (`audienceId`): synced segment (cohort) ID in LaunchDarkly. Sent as `cohortId`.
- **Audience Name** (`audienceName`): synced segment name. Sent as `cohortName`.

### Optional Settings

- **Audience Type** (`audienceType`): LaunchDarkly context kind for the segment members (for example `user`). Sent as `contextKind`; omitted when empty.
- Consent settings (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`): applied outside the transformer.

## Integration Functionalities

> Cloud mode only. Audience destination (`isAudienceSupported: true`, `syncBehaviours: ["mirror"]`).

### Implementation

- **Implemented in**: CDK v2, `src/cdk/v2/destinations/launchdarkly_audience/`
- **CDK v2 Enabled**: Yes (`cdkV2Enabled: true`, `LAUNCHDARKLY_AUDIENCE: { cdkV2: true }` in `src/features.ts`)
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`)

### Supported Message Types

- **audiencelist** only (`supportedMessageTypes.cloud: ["audiencelist"]`). Produced by the VDM v1 audience flow from warehouse sources.

### Batching Support

- **Supported**: No cross-event batching. Within one event, the `add` and `remove` lists are combined and chunked into requests of at most **1000 identifiers** (`MAX_IDENTIFIERS`).

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`).

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: No. API access token.

### Validations

- `audienceId`, `audienceName`, `accessToken`, `clientSideId` must be set in config (configuration error otherwise).
- `message.type` must be `audiencelist`.
- `message.properties.listData` must exist, be non-empty, and its keys must be among `add` / `remove`.
- Members without a truthy `identifier` field are dropped. If nothing remains, the event fails with "`listData` is empty".

### Rate Limits

NEEDS REVIEW: LaunchDarkly does not document a limit for the synced segments endpoint ([Building a synced segments integration](https://launchdarkly.com/docs/guides/integrations/build-synced-segments)). LaunchDarkly REST API calls return `429` with rate-limit headers when throttled.

## General Queries

### Event Ordering

**Required.** Each request adds or removes context keys from the synced segment. Applying an older `remove` after a newer `add` (or vice versa) leaves the segment in the wrong state.

### Data Replay Feasibility

- **Missing data**: feasible if replayed in order; adds/removes are idempotent per context key. NEEDS REVIEW: confirm idempotency on LaunchDarkly's side.
- **Already delivered data**: re-sending the same add/remove is expected to be a no-op, but replaying out of order changes membership.

### Multiplexing

**Yes.** One `audiencelist` event with more than 1000 identifiers is split into several requests of up to 1000 identifiers each. Each request can contain both `add` and `remove` entries.

## Version Information

### Current Version

- **Version:** `v2`
- **Where in code:** `config.js` (`ENDPOINT`, `https://app.launchdarkly.com/api/v2/segment-targets/rudderstack`)

No `LD-API-Version` header is sent, so the REST API date version set on the customer's access token applies.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [REST API versioning](https://launchdarkly.com/docs/api#versioning)

The `/api/v2` path has no announced sunset. The REST API is also date-versioned through the `LD-API-Version` header: the [REST API migration guide](https://launchdarkly.com/docs/guides/api/api-migration-guide) states that version `20220603` reaches end of life on 2026-12-31 and that `20240415` is required after that. New access tokens default to `20240415`. NEEDS REVIEW: whether the synced segments (`segment-targets`) endpoint behaves differently between date versions, and whether customer tokens pinned to `20220603` will fail after 2026-12-31.

### Latest Available Version

- **Version:** `v2`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [REST API versioning](https://launchdarkly.com/docs/api#versioning)

The latest date version is `20240415`, released 2024-04-15 per the versioning table. The current list can be read from [`GET /api/v2/versions`](https://launchdarkly.com/docs/api/other/get-versions).

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Building a synced segments integration](https://launchdarkly.com/docs/guides/integrations/build-synced-segments)
- [REST API migration guide: 20220603 to 20240415](https://launchdarkly.com/docs/guides/api/api-migration-guide)
- [API access tokens](https://launchdarkly.com/docs/home/account/api)
- [REST API authentication](https://launchdarkly.com/docs/api#authentication)
- [REST API versioning](https://launchdarkly.com/docs/api#versioning)
- [Segments API reference](https://launchdarkly.com/docs/api/segments)

### Changelog References

- **Changelog:** [LaunchDarkly product updates](https://launchdarkly.com/changelog/); [Documentation changelog](https://launchdarkly.com/docs/home/changelog)
- **Deprecations:** [REST API migration guide](https://launchdarkly.com/docs/guides/api/api-migration-guide)
- **Versions:** [REST API versioning](https://launchdarkly.com/docs/api#versioning)
- **Feed:** [LaunchDarkly blog RSS](https://launchdarkly.com/blog/feed/)
- **Announcements:** [REST API version `20220603` end of life on 2026-12-31](https://launchdarkly.com/docs/guides/api/api-migration-guide)
- **Last checked:** 2026-11-16

## FAQ

_To be populated._
