# Reddit Audience Destination

Implementation in **TypeScript** on the batching framework (`DestinationIntegration`), in `src/v0/destinations/reddit_audience/`. No v1 or CDK v2 folder exists. This is a separate destination from the event-stream `reddit` (Conversions API) destination in `src/cdk/v2/destinations/reddit/`.

RETL-only (VDM v2 `record` events) destination that adds and removes users in a Reddit Ads custom audience.

## Configuration

### Destination config

| Key                          | Purpose                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `rudderAccountId` (required) | OAuth account (`DESTINATION_REDDIT_AUDIENCE_OAUTH`)                                                         |
| `adAccountId`                | Used only by `rudder-integrations-info` to list/create audiences; not read by the transformer (passthrough) |

### Connection config (`connection.config.destination`)

| Key                         | Purpose                                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| `audienceId` (required)     | Reddit custom audience ID (`ca.`-prefixed)                                                          |
| `isHashRequired` (required) | `true`: transformer normalizes and SHA-256 hashes; `false`: values must already be 64-hex           |
| `identifierMappings`        | `from` warehouse column → `to` `EMAIL_SHA256` / `MAID_SHA256` (resolved upstream by rudder-sources) |

Schemas: `types.ts` (zod).

## Integration Functionalities

### Implementation

- **Implemented in**: TypeScript (`routerTransform.ts`, `utils.ts`, `delivery.ts`, `classify.ts`, `config.ts`, `types.ts`)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router (`transformAtV1: "router"`; `features.ts`: `REDDIT_AUDIENCE: { routerTransform: true, batching: true }`)

### Supported Message Types

`record` only (`supportedMessageTypes.cloud: ["record"]`), actions `insert`, `update` → `ADD`; `delete` → `REMOVE`. Sync behaviour: `mirror`.

### Authentication

- **OAuth 2.0** (Reddit). `db-config.json`: `auth.type: "OAuth"`, `role: "reddit_audience"`, `rudderScopes: ["delivery"]`; account definition `DESTINATION_REDDIT_AUDIENCE_OAUTH` with `refreshOAuthToken: true`.
- The access token arrives in `metadata.secret.accessToken` and is sent as `Authorization: Bearer <token>`. Missing token → `OAuthSecretError`.
- Headers also include `User-Agent: web:com.rudderstack.reddit-audience:v1.0.0 (by /u/rudderstack)`; Reddit treats missing/generic user agents as a cause of 403/429.
- `rudder-auth` (`src/implementations/oauth/reddit_audience/index.ts`, `src/lib/config/index.ts`): authorize `https://www.reddit.com/api/v1/authorize` (`duration=permanent`), token `https://www.reddit.com/api/v1/access_token`, scopes `adsread`, `adsedit`, profile `https://ads-api.reddit.com/api/v3/me`. Reddit access tokens expire after ~1 hour (default `expires_in` 3600) and are refreshed with the permanent refresh token.
- This role is separate from the `reddit` (conversions) role, which never requested `adsedit`.
- No announced Reddit OAuth change found. NEEDS REVIEW: the [Ads API changelog](https://ads-api.reddit.com/docs/v3/changelog) renders client-side and could not be read programmatically.

### Validations

- Input validated by zod (`RedditAudienceRouterRequestSchema`); connection config required.
- At least one valid identifier after normalization, else `No valid Reddit identifier (EMAIL_SHA256 / MAID_SHA256) after normalization`.
- Email shape `^[^\s@]+@[^\s.@]+\.[^\s@]+$`; MAID must be a UUID.
- Hash mismatch with `isHashRequired` is rejected by `processAudienceRecord`.

### Batching

- **Supported**: Yes (`ChunkBatchStrategy`), `MAX_BATCH_SIZE = 2500` rows per request (Reddit's documented `user_data` limit).
- Grouped by `internalGroupKey = <ADD|REMOVE>|<column_order>` so each request has one action and one column order.

### Intermediate Calls

None in the transformer. Audience listing/creation happens in `rudder-integrations-info` (`src/routes/reddit_audience/`).

### Proxy Delivery

- **Supported**: Yes, through the batching framework's delivery path (`delivery.ts`, `redditAudienceDelivery`), driven by `batching: true` in `features.ts`. No `networkHandler` file exists (removed in #5569).
- Reddit returns `204 No Content` with no per-row results, so outcomes are per request (no partial-batch handling).

### User Deletion

No.

### OAuth Support

Yes (see Authentication).

### Rate Limits

Reddit does not publish a per-endpoint figure for custom audience updates in sources found. Third-party docs cite figures that disagree. NEEDS REVIEW. 429 responses are classified as `throttled`.

## General Queries

### Event Ordering

Required between `ADD` and `REMOVE` for the same user: delivering a remove before an earlier add leaves the user in the audience. Because ADD and REMOVE go in separate batches, order across batches matters.

### Data Replay Feasibility

- **Missing data**: Feasible; ADD/REMOVE are idempotent membership operations. Replaying an older ADD after a newer REMOVE re-adds the user.
- **Already delivered**: Feasible; re-adding an existing member or removing an absent one has no side effect.

### Multiplexing

None.

## Version Information

### Current Version

- **Version:** `v3`
- **Where in code:** `config.ts` (`BASE_URL`)

Endpoint: `PATCH {BASE_URL}/custom_audiences/{audience_id}/users`.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** 2027-09-30
- **Source:** [Versioning](https://ads-api.reddit.com/docs/v3/guides/versioning)

Reddit moved the Ads API to quarterly versions in Q4 2026. v3 is Stable for Q4 2026 to Q3 2027 and reaches end of support at the end of Q3 2027; from Q4 2027 its requests return `410 Gone`. Responses carry a `Sunset` header 90 and 60 days before end of support and on every response in the last 30 days.

Reddit sunset all v2 endpoints except the Conversions API on 2025-09-30 ([v2 What's New](https://ads-api.reddit.com/docs/v2/history)). This destination never used v2.

### Latest Available Version

- **Version:** `v4` (Preview)
- **Released:** Unknown
- **Upgrade needed:** Yes
- **Source:** [v4 What's New](https://ads-api.reddit.com/docs/v4/history)

v4 is in Preview in Q4 2026 and becomes Stable in Q1 2027 ([Versioning](https://ads-api.reddit.com/docs/v3/guides/versioning)). Reddit gives no exact v4 release day. v4 still has [Update Custom Audience Users](https://ads-api.reddit.com/docs/v4/api/update-custom-audience-users). Move to v4 or later before v3 reaches end of support on 2027-09-30.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Reddit Ads API v3 reference](https://ads-api.reddit.com/docs/v3/)
- [Update Custom Audience Users](https://ads-api.reddit.com/docs/v3/api/update-custom-audience-users)
- [Authenticate (Ads API quick start)](https://ads-api.reddit.com/docs/v3/guides/quick-start/authenticate)
- [Reddit OAuth2 (archived wiki)](https://github.com/reddit-archive/reddit/wiki/OAuth2)

### Changelog References

- **Changelog:** [What's New (v3)](https://ads-api.reddit.com/docs/v3/history); [What's New (v4 Preview)](https://ads-api.reddit.com/docs/v4/history)
- **Deprecations:** [Versioning](https://ads-api.reddit.com/docs/v3/guides/versioning); [What's New (v2, deprecated)](https://ads-api.reddit.com/docs/v2/history)
- **Versions:** [Versioning](https://ads-api.reddit.com/docs/v3/guides/versioning)
- **Feed:** [Ads API blog RSS](https://ads-api.reddit.com/docs/blog/rss.xml)
- **Announcements:** [Introducing Versioning for Reddit Ads API (2026-10-20)](https://ads-api.reddit.com/docs/blog/introducing-versioning); [Introducing System Users for Ads API Integrations (2026-09-03)](https://ads-api.reddit.com/docs/blog/system-users-open-beta)
- **Last checked:** 2026-11-16

## FAQ

<!-- Populated over time -->
