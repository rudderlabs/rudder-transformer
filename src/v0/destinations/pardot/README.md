# Pardot (Salesforce Marketing Cloud Account Engagement) Destination

Implementation in **JavaScript** (`src/v0/destinations/pardot/`)

Pardot was renamed Marketing Cloud Account Engagement by Salesforce. The destination creates or updates prospects with the Account Engagement API v4 prospect `upsert` endpoint.

## Configuration

### Required Settings

- **Event delivery account** (`rudderAccountId`): A Salesforce OAuth account (rudder-auth role `pardot`). The only field in `schema.json`.
- **Business Unit Id** (`businessUnitId`): Account Engagement business unit ID (18 characters, starts with `0Uv`). Sent as the `Pardot-Business-Unit-Id` header. Listed in `secretKeys`. Required by the code.
- **Campaign Id** (`campaignId`): Default campaign for new prospects. Required by the code.

`businessUnitId` and `campaignId` are in `ui-config.json` but not in `schema.json`. NEEDS REVIEW.

## Integration Functionalities

> Pardot supports **Cloud mode** only.

### Supported Message Types

- **Identify** only.

### Implementation

- **Implemented in**: JavaScript (v0)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router destination (`transformAtV1: "router"`; `PARDOT: { routerTransform: true, transformerProxy: true }` in `src/features.ts`). Only `processRouterDest` is exported.

### Authentication

- **OAuth 2.0 through Salesforce** (`auth.type: "OAuth"`, `auth.role: "pardot"` in `db-config.json`).
- rudder-auth (`src/routes/auth/pardot.ts`) uses `passport-salesforce` with a RudderStack Salesforce **Connected App** (client id/secret from the `pardot` OAuth config). Scope for destinations: `offline_access pardot_api`.
- Token refresh (`src/controllers/refreshTokenMethods/pardot.ts`): `POST {instance_url}/services/oauth2/token` with `grant_type=refresh_token`. `invalid_grant` marks the account for re-authorization.
- Transformer: reads `metadata.secret.access_token` and sends:
  - `Authorization: Bearer <access_token>`
  - `Pardot-Business-Unit-Id: <businessUnitId>`
- Pardot error code `184` (access token invalid/expired) is mapped to `REFRESH_TOKEN`, so rudder-server refreshes the token and retries.

### Auth Changes and Deprecations (Salesforce)

| Date                       | Change                                                                                                                                                                                                                                                                                                                                           | Impact                                                                                                                                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spring '21 (February 2021) | Legacy Pardot-only authentication (`/api/login` with email, password and user key) retired; Salesforce OAuth required.                                                                                                                                                                                                                           | Already handled: the destination uses Salesforce OAuth. Announcement URL not verified. NEEDS REVIEW.                                                                                                                                                                                           |
| Early September 2025       | Salesforce blocks end users from authorizing **uninstalled** connected apps unless they have the "Approve Uninstalled Connected Apps" or "Use Any API Client" permission. Users who already authorized keep access. ([Salesforce Admins blog](https://admin.salesforce.com/blog/2025/get-ready-for-changes-to-connected-app-usage-restrictions)) | New Pardot authorizations can fail in orgs that have not installed the RudderStack connected app.                                                                                                                                                                                              |
| Spring '26                 | Salesforce disabled creation of new Connected Apps; new integrations must use **External Client Apps (ECA)**. ([RudderStack release note](https://www.rudderstack.com/docs/releases/salesforce-eca/))                                                                                                                                            | RudderStack moved the Salesforce destination to an ECA with PKCE (`destination_salesforce_oauth_v2` in rudder-auth). **Pardot still uses the legacy Connected App role** (`pardot`). Existing app keeps working, but it cannot be recreated and there is no ECA path for Pardot. NEEDS REVIEW. |
| Summer '27 (reported)      | SOAP `login()` for API versions 31.0 to 64.0 removed.                                                                                                                                                                                                                                                                                            | Not used by this destination.                                                                                                                                                                                                                                                                  |

### Batching Support

- **Supported**: No. One identify event becomes one upsert request.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: Yes. `src/v0/destinations/pardot/networkHandler.js` (proxy v0). Tests: `test/integrations/destinations/pardot/dataDelivery/`.
- The proxy appends `format=json` to the form body so Pardot returns JSON.
- Response handling: Pardot puts status in `@attributes.stat` and `@attributes.err_code`. A failure is retried (500) if `err_code` is in `[85, 116, 120, 121, 183, 184, 214]`, else aborted (400). A response without `@attributes` is treated as an error (500 if HTTP was 2xx).
- **Partial batching**: Not applicable.

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: Yes (Salesforce OAuth, role `pardot`).

### Additional Functionalities

- Upsert target chosen by `context.externalId[0]`:
  - `type: pardotId` → `/upsert/id/<id>`
  - `type: crmfid` → `/upsert/fid/<id>` (Salesforce Lead/Contact ID)
  - otherwise → `/upsert/email/<email>`
- `campaign_id` defaults to `Config.campaignId` when not in traits.

### Validations

- `campaignId` and `businessUnitId` must be set (`ConfigurationError`).
- `message.type` must be `identify`.
- Without a valid `externalId` (`type` and `id`), `email` is required.

### Rate Limits

From the [Account Engagement API overview](https://developer.salesforce.com/docs/marketing/pardot/guide/overview.html) (blocks automated requests):

- Daily requests per account: Growth 25,000, Plus 50,000, Advanced 100,000, Premium 100,000. Resets daily in the account's time zone. Exceeding returns error code `122`.
- Concurrent requests: 5. A sixth concurrent request returns error code `66`.

Neither `66` nor `122` is in the retryable list, so these events are aborted. See Known Issues in [docs/businesslogic.md](docs/businesslogic.md).

## General Queries

### Event Ordering

- **Required** for Identify. Each upsert overwrites prospect fields, so an older event delivered later overwrites newer data.

### Data Replay Feasibility

- **Missing data**: Possible only in order, or when the replayed data is older than nothing already in Pardot. Replaying old events after newer ones overwrites fields.
- **Already delivered data**: Upserts are idempotent for the same payload, so replaying the same events in order is safe. It counts against the daily API limit.

### Multiplexing

- No.

## Version Information

### Current Version

- **Version:** `v4`
- **Where in code:** `config.js` (`version = '4'`, `BASE_URL`), giving `https://pi.pardot.com/api/prospect/version/4/do/upsert/...`

v4 is the version for business units with "Allow Multiple Prospects with the Same Email Address" (AMPSEA) enabled. v3 is for business units without it.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Account Engagement API: Version 3 and 4 overview](https://developer.salesforce.com/docs/marketing/pardot/guide/version-3-4-overview.html) (blocks automated requests)

Salesforce has not announced an end-of-life date for v3 or v4. It calls v5 the preferred version and builds new features only there.

### Latest Available Version

- **Version:** `v5`
- **Released:** Unknown
- **Upgrade needed:** Yes
- **Source:** [Salesforce Developers blog: Pardot API v5, why you should upgrade](https://developer.salesforce.com/blogs/2023/01/account-engagement-pardot-api-v5-why-you-should-upgrade) (blocks automated requests)

v5 uses `https://pi.pardot.com/api/v5/objects/prospects` with `/do/upsertLatestByEmail`. Moving to v5 changes request format (JSON instead of form), endpoints and error format.

Note: the code always uses the production host `pi.pardot.com`. Developer and sandbox business units need `pi.demo.pardot.com`, so they are not supported.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Account Engagement API: Get started (rate limits)](https://developer.salesforce.com/docs/marketing/pardot/guide/overview.html) (blocks automated requests)
- [Account Engagement API: Authentication](https://developer.salesforce.com/docs/marketing/pardot/guide/authentication.html) (blocks automated requests)
- [Account Engagement API: Version 3 and 4 overview](https://developer.salesforce.com/docs/marketing/pardot/guide/version-3-4-overview.html) (blocks automated requests)
- [Account Engagement API v4: Prospect object (upsert)](https://developer.salesforce.com/docs/marketing/pardot/guide/prospects-v4.html) (blocks automated requests)
- [Account Engagement API: Error codes](https://developer.salesforce.com/docs/marketing/pardot/guide/error-codes.html) (blocks automated requests)
- [Salesforce Developers blog: Pardot API v5, why you should upgrade](https://developer.salesforce.com/blogs/2023/01/account-engagement-pardot-api-v5-why-you-should-upgrade) (blocks automated requests)
- [RudderStack docs: Pardot destination](https://www.rudderstack.com/docs/destinations/streaming-destinations/pardot/)

The developer.salesforce.com and admin.salesforce.com pages return 403 to automated `curl`; they are indexed by search engines and load in a browser.

### Changelog References

- **Changelog:** [Salesforce release notes (Account Engagement section)](https://help.salesforce.com/s/articleView?id=release-notes.salesforce_release_notes.htm)
- **Deprecations:** None found
- **Versions:** [Account Engagement API: Version 3 and 4 overview](https://developer.salesforce.com/docs/marketing/pardot/guide/version-3-4-overview.html) (blocks automated requests)
- **Feed:** [Salesforce Developers blog feed](https://developer.salesforce.com/blogs/feed) (blocks automated requests)
- **Announcements:** [Connected app usage restrictions](https://admin.salesforce.com/blog/2025/get-ready-for-changes-to-connected-app-usage-restrictions) (blocks automated requests); [RudderStack note on Salesforce External Client Apps](https://www.rudderstack.com/docs/releases/salesforce-eca/)
- **Last checked:** 2026-11-16

No Account Engagement API-specific changelog or deprecations page exists; API changes appear under "Account Engagement" in each Salesforce release.

## FAQ

_No entries yet._
