# LinkedIn Ads (Conversions API) Destination

Implementation in **CDK v2** (`procWorkflow.yaml`, `rtWorkflow.yaml`), with a JavaScript proxy handler in `src/v1/destinations/linkedin_ads/networkHandler.js`.

## Configuration

### Required Settings

- **Account** (`rudderAccountId`): LinkedIn OAuth account. The access token arrives in `metadata.secret.accessToken`.
- **Hash Data** (`hashData`, default `true`): SHA-256 hash the email before sending. When `false`, the email is sent as-is and must already be SHA-256 hashed.
- **Conversion Mapping** (`conversionMapping`): list of `{ from: <track event name>, to: <conversion rule ID> }`. One event name can map to several rule IDs.

### Optional Settings

- **Deduplication Key** (`deduplicationKey`): path in the event used as `eventId`. Falls back to `messageId`.
- **Ad Account** (`adAccountId`): not read by the transformer. The config UI uses it (through rudder-integrations-info) to list the account's Conversions API rules.
- Consent settings: applied outside the transformer.

## Integration Functionalities

> Cloud mode only.

### Implementation

- **Implemented in**: CDK v2, `src/cdk/v2/destinations/linkedin_ads/`
- **CDK v2 Enabled**: Yes (`LINKEDIN_ADS: { routerTransform: true, cdkV2: true, transformerProxy: true }` in `src/features.ts`)
- **Processor vs Router**: Router destination (`transformAtV1: "router"`)

### Supported Message Types

- **Track** only.

### Batching Support

- **Supported**: Yes, for track. All successful events in a router batch are merged into `elements` and chunked into requests of up to **5000** conversion events (`MAX_BATCH_SIZE`), matching LinkedIn's batch limit.
- Endpoint: `POST https://api.linkedin.com/rest/conversionEvents` with `X-RestLi-Method: BATCH_CREATE`.

### Intermediate Calls

- None during transformation.

### Proxy Delivery

- **Supported**: Yes (proxy v1). Source: [src/v1/destinations/linkedin_ads/networkHandler.js](../../../../v1/destinations/linkedin_ads/networkHandler.js)
- **Partial batch handling**: Yes, for `422` responses. The `message` is parsed for `Index: <n>, ERROR :: <msg>` entries; matching jobs get `400` (aborted) and the rest get `500` (retried). Any other non-2xx status applies to every job in the batch.
- `401` with `REVOKED_ACCESS_TOKEN` → `400` + `AUTH_STATUS_INACTIVE`; other `401` → `500` + `REFRESH_TOKEN`; `403` → `400` + `AUTH_STATUS_INACTIVE`.
- `426` (version deprecated) is converted to `500` so events are retried.

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: Yes (`auth.type: "OAuth"`, role `linkedin_ads`).
- rudder-auth scopes (`LINKEDIN_OAUTH_SCOPES`): `r_ads`, `rw_conversions`, `rw_dmp_segments`, `profile`, `email`, `openid`. Refresh uses `https://www.linkedin.com/oauth/v2/accessToken`.

### Additional Functionalities

- **One event to several conversion rules**: each mapped rule ID produces its own element (same user and value data, different `conversion` URN).
- **Conversion value**: computed from `properties.products[].price * quantity` or `properties.price * quantity`; currency defaults to `USD`.

### Validations

- `message.type` must be `track`; `event` is required.
- The event name must have a `conversionMapping` entry, otherwise configuration error.
- At least one of: email, `externalId` type `LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID`, `ACXIOM_ID`, `ORACLE_MOAT_ID`.
- `timestamp` (or `originalTimestamp`) must be valid and no more than 90 days old (LinkedIn rejects older conversions).
- `metadata.secret.accessToken` must be present (`OAuthSecretError` otherwise).
- `userInfo` is only sent when both first and last name are present.

### Rate Limits

From the [Conversions API docs](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/conversions-api): up to 600 requests per minute and 500,000 requests per day per member access token; up to 5,000 events per batch request.

## General Queries

### Event Ordering

**Not required.** Conversions carry `conversionHappenedAt` and are not profile updates.

### Data Replay Feasibility

- **Missing data**: feasible within LinkedIn's 90-day window. Older events are rejected by the transformer.
- **Already delivered data**: each element carries `eventId` (dedup key or `messageId`). NEEDS REVIEW: LinkedIn documents `eventId` for deduplication with the Insight Tag; confirm whether server-side resends with the same `eventId` are deduplicated.

### Multiplexing

**Yes.** An event mapped to N conversion rules produces N elements in the batch.

## Version Information

### Current Version

- **Version:** `202609`
- **Where in code:** `config.js` (`API_VERSION`, sent as the `LinkedIn-Version` header; REST path `BATCH_ENDPOINT` = `/rest/conversionEvents`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** 2027-09-15
- **Source:** [Migrations](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/migrations)

LinkedIn monthly versions are supported for at least one year.

### Latest Available Version

- **Version:** `202610`
- **Released:** Unknown
- **Upgrade needed:** Yes
- **Source:** [Recent Marketing API Changes](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/recent-changes)

`202610` (October 2026) is marked Latest on the Recent Marketing API Changes page as of 2026-11-16.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Conversions API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/conversions-api)
- [LinkedIn Marketing API versioning](https://learn.microsoft.com/en-us/linkedin/marketing/versioning)
- [LinkedIn API error handling](https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/error-handling)
- [LinkedIn OAuth 2.0 authorization code flow](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)

### Changelog References

- **Changelog:** [Recent Marketing API Changes](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/recent-changes)
- **Deprecations:** [Migrations (version sunset dates)](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/migrations)
- **Versions:** [Migrations](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/migrations); [LinkedIn Marketing API versioning](https://learn.microsoft.com/en-us/linkedin/marketing/versioning)
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

## FAQ

_To be populated._
