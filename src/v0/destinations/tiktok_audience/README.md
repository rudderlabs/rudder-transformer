# TikTok Audience Destination

Implementation in **TypeScript** (`src/v0/destinations/tiktok_audience/`). There is no CDK v2 workflow folder.

`db-config.json` sets `cdkV2Enabled: true`, but `src/features.ts` only lists `TIKTOK_AUDIENCE: { routerTransform: true }` with no `cdkV2`, so the transformer runs this native v0 code. **NEEDS REVIEW**: the `cdkV2Enabled` flag in `db-config.json` looks stale.

## Configuration

### Required Settings

- **Event delivery account** (`rudderAccountId`): RudderStack OAuth account (`DESTINATION_TIKTOK_AUDIENCE_OAUTH`).
- **Advertiser ID** (`advertiserId`): chosen from the account's advertisers (`listAdvertisers` in rudder-integrations-info). Used for `record` events.

### Connection Settings (VDM V2)

- `audienceId`: TikTok audience (segment) ID.
- `isHashRequired`: whether RudderStack hashes identifiers.

## Integration Functionalities

> TikTok Audience is a **warehouse-only** (Audiences / rETL) destination with `syncBehaviours: ["mirror"]`.

### Supported Message Types

- `record` (VDM V2 / Audiences): current flow.
- `audiencelist`: legacy VDM V1 flow (`transform.ts`).

### Implementation

- **Implemented in**: TypeScript (v0)
- **Processor vs Router**: Router (`transformAtV1: "router"`). Only `processRouterDest` is exported.

### Authentication

- OAuth 2.0 authorization-code flow implemented in rudder-auth (`src/implementations/oauth/tiktok/index.ts`, legacy `src/controllers/oauthImplementations/tiktok.ts`). The token endpoint is `https://business-api.tiktok.com/open_api/v1.3/oauth/token/`. rudder-auth stores `accessToken` and `advertiserIds` (first advertiser only in the callback middleware).
- The transformer sends `Access-Token: <metadata.secret.accessToken>` and `Content-Type: application/json`.
- `refreshOAuthToken: false` in the account `db-config.json`. TikTok Marketing API access tokens are long-lived and stay valid until the advertiser revokes authorization. **NEEDS REVIEW**: confirm on the TikTok API for Business authentication page (the portal blocks automated fetches). No networkHandler, so a revoked token is not mapped to an `AUTH_STATUS_INACTIVE` / re-auth prompt.
- No announced change to TikTok's auth model was found.

### Batching Support

- **Supported**: Yes, for `record`. Records in one router batch are grouped by advertiser ID, action and `id_schema`; each group becomes one `segment/mapping` request with many `batch_data` rows.
- No size cap is applied in code. TikTok's limit is reported as 10,000 users per request (via Braze docs, [TikTok audience sync](https://www.braze.com/docs/partners/canvas_audience_sync/tiktok_audience_sync)). **NEEDS REVIEW**: a large router batch could exceed it.
- `audiencelist`: one request per action (`add` / `remove`) per event.

### Intermediate Calls

- None in the transformer. Audience creation and listing (`/open_api/v1.3/segment/audience/`, `/open_api/v1.3/dmp/custom_audience/list/`) and advertiser lookup (`/open_api/v1.3/oauth2/advertiser/get`) run in rudder-integrations-info.

### Proxy Delivery

- **Supported**: No (no `networkHandler`).

### User Deletion

- **Supported**: No (removal from audiences happens through `delete` records).

### OAuth Support

- **Supported**: Yes (`auth.type: "OAuth"`, role `tiktok_audience`).

### Additional Functionalities

- **Hashing**: SHA-256 for `EMAIL_SHA256`, `PHONE_SHA256`, `IDFA_SHA256`, `AAID_SHA256`; MD5 for `IDFA_MD5`, `AAID_MD5`.
- **Normalization** (record flow, when hashing): email has spaces removed, is lower-cased and must pass `validator.isEmail` (invalid emails become empty and are counted in the `tiktok_audience_invalid_email` metric); IDFA/AAID are trimmed and lower-cased. Phone is not normalized.
- **Hashing consistency**: `validateHashingConsistency` checks pre-hashed values against `isHashRequired`.
- **Positional rows**: `id_schema` is the sorted list of identifier keys; missing values become `{}` so each `batch_data` row lines up with `id_schema`.

### Validations

- Record: zod schema requires `destination.ID`, `Config.advertiserId`, `connection.config.destination.isHashRequired` and `audienceId`, `metadata.workspaceId`, `metadata.secret.accessToken`, `action` in insert/update/delete, `identifiers`, `fields`.
- Identifier keys must be one of the six supported traits; at least one must have a value.
- Audience list: zod schema requires `type: audienceList`, `properties.listData` with only `add`/`remove` keys, `Config.isHashRequired`, `metadata.secret.advertiserIds` and `accessToken`.
- Other message types fail with `unsupported event found <type>`.

### Rate Limits

- Reported as 50 QPS and 10,000 users per request for the segment API, with a reported daily cap of 24 update operations per audience. These come from partner docs, not TikTok ([Braze](https://www.braze.com/docs/partners/canvas_audience_sync/tiktok_audience_sync), [Redpoint](https://docs.redpointglobal.com/bpd/tiktok-api)). **NEEDS REVIEW** against TikTok's API docs.

## General Queries

### Event Ordering

- Required per user. An `insert` followed by a `delete` for the same user gives a different result if reordered. Records are grouped by action within a batch, so add and delete requests for the same batch are sent separately.

### Data Replay Feasibility

- **Missing data**: Feasible; mirror sync recomputes the diff.
- **Already delivered data**: Safe. Adding an existing member or deleting an absent one has no extra effect.

### Multiplexing

- `audiencelist`: one event with both `add` and `remove` produces two requests.
- `record`: no multiplexing; many records combine into one request.

## Version Information

### Current Version

- **Version:** `v1.3`
- **Where in code:** `config.ts` (`BASE_URL`, `ENDPOINT` = `/segment/mapping/`)

rudder-auth and rudder-integrations-info also use v1.3.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [API Reference Overview (current version v1.3)](https://business-api.tiktok.com/portal/docs/api-reference/v1.3) (blocks automated requests)

v1.2 was retired on 2023-08-15 in favour of v1.3 ([Hevo](https://mini-docs.hevodata.com/sources/marketing/tiktok-ads/), [Boomi upgrade notes](https://help.boomi.com/docs/Atomsphere/Data_Integration/APIUpgradesChangelog/2023/tiktok-api-upgrade-13), both third-party). No sunset date for v1.3 and no deprecation of the `/segment/` endpoints was found. The portal's 2027-01-01 Smart+ change covers campaign, ad group and ad creation endpoints only, not audiences.

### Latest Available Version

- **Version:** `v1.3`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [API Reference Overview (current version v1.3)](https://business-api.tiktok.com/portal/docs/api-reference/v1.3) (blocks automated requests)

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [About API for Business](https://ads.tiktok.com/help/article/marketing-api)
- TikTok API for Business portal: [API for Business docs](https://business-api.tiktok.com/portal/docs) (blocks automated requests; the audience create doc ID `1739940506015746` is referenced in rudder-integrations-info)
- [Create or delete an audience segment](https://business-api.tiktok.com/portal/docs?id=1739940583739393) (Segment API, which includes `/segment/mapping/`; blocks automated requests)
- [Authentication](https://business-api.tiktok.com/portal/docs?id=1738373164380162) (blocks automated requests)
- [API Reference Overview (v1.3)](https://business-api.tiktok.com/portal/docs/api-reference/v1.3) (lists `/segment/audience/` and `/segment/mapping/`; blocks automated requests)
- [Audience types](https://business-api.tiktok.com/portal/docs/audience-types/v1.3) (blocks automated requests)
- [Create a Custom Audience](https://business-api.tiktok.com/portal/docs/create-a-custom-audience/v1.3) (blocks automated requests)
- [Permission scope](https://business-api.tiktok.com/portal/docs/permission-scope/v1.3) (segment endpoints need the Create and Update Custom Audiences scope; blocks automated requests)

### Changelog References

- **Changelog:** [API for Business blog (weekly "API For Business Platform Update" posts)](https://business-api.tiktok.com/portal/blog) (blocks automated requests)
- **Deprecations:** None found
- **Versions:** [Hevo: TikTok Ads API v1.2 deprecated 2023-08-15, v1.3 only](https://mini-docs.hevodata.com/sources/marketing/tiktok-ads/) (third-party)
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

The portal's [About the Guide](https://business-api.tiktok.com/portal/docs/about-the-guide/v1.3) (blocks automated requests) page describes a weekly "What's New" section, but no direct URL for it was found, so the blog's platform-update posts are linked instead. TikTok publishes no API version lifecycle page; the v1.2 sunset date comes from a third-party connector doc. No RSS feed for the portal blog was found. The [TikTok for Developers changelog](https://developers.tiktok.com/doc/changelog) (blocks automated requests) covers Login Kit, Research API and other developer products, not the Marketing API.

## FAQ

> This section will be populated with frequently asked questions as they arise from usage and support requests.
