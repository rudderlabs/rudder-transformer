# Twitter Ads (X Ads) Destination

Implementation in **JavaScript** (`src/v0/destinations/twitter_ads/`). There is no CDK v2 or v1 implementation. The destination sends web conversions to the X Ads **Conversion API for Web**.

## Configuration

### Required Settings

- **Account** (`rudderAccountId`): RudderStack OAuth account (role `twitter_ads`). Provides the OAuth 1.0a secrets in `metadata.secret`.
- **Pixel ID** (`pixelId`): X pixel ID, used in the endpoint path. `properties.pixelId` overrides it per event.

### Optional Settings

- **Event mapping** (`twitterAdsEventNames`): `rudderEventName` to `twitterEventId`. Needed unless `properties.eventId` is sent.

## Integration Functionalities

> Twitter Ads supports **Cloud mode** only.

### Supported Message Types

- Track only.

### Implementation

- **Implemented in**: JavaScript (v0)
- **Processor vs Router**: Router (`transformAtV1: "router"`; `TWITTER_ADS: { routerTransform: true }` in `src/features.ts`). `simpleProcessRouterDest` transforms each event on its own.

### Authentication

- **OAuth 1.0a (HMAC-SHA1)** user context. `util.js` signs each request with the `oauth-1.0a` package using `consumerKey`, `consumerSecret`, `accessToken`, `accessTokenSecret` from `metadata.secret`, and sends the result as the `Authorization` header.
- The account is created through rudder-auth's `passport-twitter` strategy (`src/routes/auth/twitter_ads.ts` and `twitter_destination.ts` in `rudder-auth`), which stores the consumer key/secret alongside the user token and secret. `rudderScopes: ["delivery"]` in `db-config.json`.
- OAuth 1.0a user tokens do not expire; there is no refresh flow.
- Missing secret fields raise `OAuthSecretError`.
- X's docs describe Conversion API auth as User Access Tokens from a 3-legged OAuth flow, with the user holding `AD_MANAGER` or `ACCOUNT_ADMIN` access ([Web conversions](https://docs.x.com/x-ads-api/measurement/web-conversions)). No announcement retiring OAuth 1.0a for the Ads API was found in the [X developer changelog](https://docs.x.com/changelog). Recent OAuth entries there (OAuth 2.0 for the Account Activity API, January 15, 2026; token exchange, September 21, 2026) concern X API v2, not Ads. **NEEDS REVIEW**: re-check periodically; X is moving other APIs to OAuth 2.0.

### Batching Support

- **Supported**: No. One conversion per request (`conversions: [ ... ]` with one item). The API accepts a conversions array; the per-request limit is not documented on the current page.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`).

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: Yes (`auth.type: "OAuth"`, role `twitter_ads`).

### Additional Functionalities

- Email is trimmed, lower-cased and SHA-256 hashed; phone is trimmed and SHA-256 hashed (no E.164 normalization).
- `properties.contents` items are renamed (`id` to `content_id`, `groupId` to `content_group_id`, `name` to `content_name`, `type` to `content_type`, `price` to string `content_price`, `quantity` to `num_items`).
- Event names are matched to `twitterEventId` case-insensitively after trimming.

### Validations

- `message.type` must be track.
- `properties` must be present.
- At least one of `properties.twclid`, `properties.email`, `properties.phone`, or `properties.ip_address` with `properties.user_agent`. `ip_address` or `user_agent` alone is attached to the first identifier.
- `email`, `phone`, `ip_address`, `user_agent` must be strings.
- `event_id` must come from `properties.eventId` or the event mapping.

### Rate Limits

- 60,000 events per ad account per 15-minute window ([Web conversions](https://docs.x.com/x-ads-api/measurement/web-conversions)). General Ads API limits: [rate limiting](https://docs.x.com/x-ads-api/fundamentals/rate-limiting).

## General Queries

### Event Ordering

- Not required. Each conversion carries `conversion_time`.

### Data Replay Feasibility

- **Missing data**: Feasible; `conversion_time` is preserved. **NEEDS REVIEW**: X's lookback window for late conversions.
- **Already delivered data**: Safe only when `properties.conversionId` is sent. X uses `conversion_id` to dedupe conversions; without it, replays duplicate.

### Multiplexing

- **No**.

## Version Information

### Current Version

- **Version:** `12`
- **Where in code:** `config.js` (`BASE_URL` = `https://ads-api.twitter.com/12/measurement/conversions`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Versions](https://docs.x.com/x-ads-api/fundamentals/versioning)

- v12 (introduced 2022-10-27) has no deprecation or end-of-life date; the versioning page lists both as TBD. Versions get a 6-month deprecation window once a successor is announced.
- The code still uses the `ads-api.twitter.com` host. X's current docs and examples use `ads-api.x.com`. No retirement date for the twitter.com host was found. NEEDS REVIEW.

### Latest Available Version

- **Version:** `12`
- **Released:** 2022-10-27
- **Upgrade needed:** No
- **Source:** [Versions](https://docs.x.com/x-ads-api/fundamentals/versioning)

v12 is the latest listed version. The X changelog's 2026-10-29 entry (Conversion API for App Events) still uses `/12/` paths.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Web conversions (Conversion API, includes the `POST /12/measurement/conversions/:pixel_id` request)](https://docs.x.com/x-ads-api/measurement/web-conversions)
- [Making authenticated requests (OAuth 1.0a)](https://docs.x.com/x-ads-api/fundamentals/making-authenticated-requests)
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

> This section will be populated with frequently asked questions as they arise from usage and support requests.
