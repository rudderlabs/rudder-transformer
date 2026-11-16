# X Audience Destination

Implementation in **JavaScript** (v0), `src/v0/destinations/x_audience/`. Adds and removes users in an X (Twitter) Ads **Custom Audience** from RETL (VDM V2 `record` events). OAuth helpers are shared with `src/v0/destinations/twitter_ads/util.js`.

## Configuration

### Destination config

- **Event delivery account** (`rudderAccountId`): RudderStack OAuth account for X (role `x_audience`).
- **Select your Account** (`accountId`): X Ads account. Stored as a JSON string; the code uses the first value of `JSON.parse(accountId)`.
- **Enable user data hashing** (`enableHash`): SHA-256 hash identifiers before sending. Leave on unless data is already hashed.
- Consent management fields.

### Connection config

- **Audience ID** (`audienceId`): target Custom Audience. Can be created from the RudderStack UI (`supportsBlankAudienceCreation: true`) through rudder-integrations-info.

## Integration Functionalities

> **Cloud mode** only, sources `cloud` and `warehouse`.

### Supported Message Types

- **record** only (`supportedMessageTypes.cloud: ["record"]`). Other types throw `[X AUDIENCE]: <type> is not supported`.

### Implementation

- **Implemented in**: JavaScript (v0)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router (`transformAtV1: "router"`, `X_AUDIENCE: { routerTransform: true }`)

### Authentication

- **OAuth 1.0a** (HMAC-SHA1), user context. `db-config.json`: `auth.type: "OAuth"`, `role: "x_audience"`, `rudderScopes: ["delivery"]`.
- rudder-auth (`src/routes/auth/x_audience.ts` → `twitter_destination.ts`) runs the 3-legged OAuth 1.0a flow with RudderStack's consumer key and secret and stores `consumerKey`, `consumerSecret`, `accessToken`, `accessTokenSecret`.
- The transformer reads those from `metadata.secret` (`getOAuthFields`, throws `OAuthSecretError` if any is missing) and signs each request with the `oauth-1.0a` package (`getAuthHeaderForRequest`). Headers: `Authorization: OAuth ...`, `Content-Type: application/json`.
- OAuth 1.0a access tokens do not expire unless revoked. There is no refresh flow.
- X Ads API docs still require OAuth 1.0a for all Ads API calls ([Making authenticated requests](https://docs.x.com/x-ads-api/fundamentals/making-authenticated-requests)). No announced move to OAuth 2.0 for the Ads API as of November 2026.

### Validations

- `type` must be `record`.
- `accountId` and `audienceId` are meant to be checked, but the check is broken (see [businesslogic.md](docs/businesslogic.md#known-issues)), so missing values only fail at `JSON.parse` or at X.

### Batching Support

- **Yes.** Events are grouped by `operation_type` + `effective_at` + `expires_at`. Each group becomes one operation object with all its users; operations are packed into requests of at most **2500 operations** and **4,000,000 bytes** (`config.js`).
- X limits: 2500 operations and 5,000,000 bytes per request; the request is atomic (all or nothing).

### Rate Limits

- Audience users endpoint: **1500 requests per minute per ads account** ([Audiences](https://docs.x.com/x-ads-api/audiences)).

### Intermediate Calls

- None in the transformer. rudder-integrations-info calls `GET /12/accounts` (account dropdown) and `POST /12/accounts/:id/custom_audiences` (create audience).

### Proxy Delivery

- **No** (`networkHandler.js` absent). Errors are mapped by rudder-server's generic handling.

### User Deletion

- **No** (`deleteUsers.js` absent).

### OAuth Support

- Yes, OAuth 1.0a via rudder-auth (see Authentication).

### Additional Functionalities

- Sync behaviour `mirror` only (`syncBehaviours`).
- Field values can be comma-separated lists; each is split and hashed individually.

## General Queries

### Event Ordering

- Matters for the same user: an `Update` and a `Delete` for one user must arrive in order. Batching groups by operation type, so a single router batch with both for the same user sends them as separate operations in one request, in group order. NEEDS REVIEW: confirm X processes operations within a request in array order.

### Data Replay Feasibility

- **Missing data**: Replay is safe; adding users is idempotent.
- **Already delivered data**: Replay is safe; re-adding or re-deleting the same user has no extra effect.

### Multiplexing

- No. Many events are merged into fewer requests; one event never produces several requests.

## Version Information

### Current Version

- **Version:** `12`
- **Where in code:** `config.js` (`BASE_URL` = `https://ads-api.twitter.com/12/accounts/:account_id/custom_audiences/:audience_id/users`)

rudder-integrations-info uses `https://ads-api.x.com/12/...`.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Versions](https://docs.x.com/x-ads-api/fundamentals/versioning)

- v12 (introduced 2022-10-27): deprecation and end of life both TBD on the X versioning page. Versions get a 6-month deprecation window once a successor is announced.
- The transformer still uses the `ads-api.twitter.com` host while X's docs use `ads-api.x.com`. No retirement date for the old host has been found. NEEDS REVIEW.

### Latest Available Version

- **Version:** `12`
- **Released:** 2022-10-27
- **Upgrade needed:** No
- **Source:** [Versions](https://docs.x.com/x-ads-api/fundamentals/versioning)

Responses carry an `x-current-api-version` header and calls to deprecated endpoints return `x-api-warn`.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Audiences (custom audience users endpoint)](https://docs.x.com/x-ads-api/audiences)
- [Audiences API reference: `POST accounts/:account_id/custom_audiences/:custom_audience_id/users`](https://docs.x.com/x-ads-api/audiences/reference)
- [Making authenticated requests](https://docs.x.com/x-ads-api/fundamentals/making-authenticated-requests)
- [Rate limiting](https://docs.x.com/x-ads-api/fundamentals/rate-limiting)

### Changelog References

- **Changelog:** [X developer changelog](https://docs.x.com/changelog) (covers Ads API, X API v2 and SDKs)
- **Deprecations:** [X Ads API versions (deprecated and end-of-life dates)](https://docs.x.com/x-ads-api/fundamentals/versioning)
- **Versions:** [X Ads API versions](https://docs.x.com/x-ads-api/fundamentals/versioning)
- **Feed:** [X changelog RSS](https://docs.x.com/changelog/rss.xml)
- **Announcements:** None found
- **Last checked:** 2026-11-16

X also announces Ads API versions on the developer forum (for example [Ads API version 11](https://devcommunity.x.com/t/ads-api-version-11/168814), blocks automated requests).

## FAQ
