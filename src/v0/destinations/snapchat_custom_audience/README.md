# Snapchat Custom Audience Destination

Adds and removes users in a Snapchat Customer List (formerly Snap Audience Match, SAM) audience segment through the Snap Marketing (Ads) API. It is an audience destination fed by RETL / audience sources (`audiencelist` events).

Implementation: `src/v0/destinations/snapchat_custom_audience/` (JavaScript, v0).

## Configuration

### Required Settings

| Config key        | UI label   | Description                                                                                                       |
| ----------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| `rudderAccountId` | Account    | RudderStack OAuth account (Snapchat login). Not read by transformer code; the token arrives in `metadata.secret`. |
| `segmentId`       | Segment ID | Snapchat audience segment ID. Listed in `secretKeys`.                                                             |
| `schema`          | Schema     | Identifier type: `email` (default), `phone` or `mobileAdId`.                                                      |

### Optional Settings

| Config key       | Description                                                                    |
| ---------------- | ------------------------------------------------------------------------------ |
| `disableHashing` | Default `false`. When `true`, values are sent as-is (must already be SHA-256). |

## Integration Functionalities

### Implementation

- **Language**: JavaScript (`transform.js`, `utils.js`, `config.js`, `networkHandler.js`).
- **Processor vs Router**: Router destination (`transformAtV1: "router"`; `SNAPCHAT_CUSTOM_AUDIENCE: { routerTransform: true, transformerProxy: true }` in `src/features.ts`).

### Supported Message Types

| Type           | Supported |
| -------------- | --------- |
| `audiencelist` | Yes       |
| others         | No        |

Supported sources: cloud, warehouse, shopify. `isAudienceSupported: true`, `syncBehaviours: ["mirror"]`.

### Authentication

OAuth 2.0 (`auth.type: "OAuth"`, role `snapchat_custom_audience`, `rudderScopes: ["delivery"]`).

- Header built by `generateResponse`: `Authorization: Bearer <metadata.secret.access_token>` (via `getAccessToken(metadata, 'access_token')`), plus `Content-Type: application/json`.
- rudder-auth (`src/routes/auth/snapchat_custom_audience.ts`): authorize URL `https://accounts.snapchat.com/login/oauth2/authorize`, token URL `https://accounts.snapchat.com/accounts/oauth2/token`, scope `snapchat-marketing-api`.
- Refresh (`src/controllers/refreshTokenMethods/snapchat_custom_audience.ts`): `POST https://accounts.snapchat.com/login/oauth2/access_token` with `grant_type=refresh_token`, client id/secret as query params. Stores the returned `access_token` and `refresh_token`.
- Snap access tokens expire after **3600 seconds** (Snap changelog 2024-09-18: "Access token expiry is now 3600 seconds = 60 minutes"; previously shorter). 401 responses mark the token for refresh (see Proxy Delivery).
- Snap's docs list `https://accounts.snapchat.com/login/oauth2/access_token` as the token URL; rudder-auth's initial token exchange uses `.../accounts/oauth2/token`. Both work today. **NEEDS REVIEW** if Snap removes the older path.
- No announced change to Snap OAuth or the marketing API scope was found in the Snap changelog, announcements or breaking-changes pages.

### Batching Support

No cross-event batching. Within one event, identifiers are split into chunks of up to **100,000** (Snap's per-request limit), one request per chunk.

### Intermediate Calls

None.

### Proxy Delivery

Supported: `src/v0/destinations/snapchat_custom_audience/networkHandler.js` (proxy v0 style, `transformerProxy: true`).

- 2xx → success.
- Auth error category `REFRESH_TOKEN` (from `getAuthErrCategoryFromErrDetailsAndStCode`, 401) → `RetryableError` (500) so the server refreshes the token and retries.
- 403 (without `error.details`) gets auth error category `AUTH_STATUS_INACTIVE`, which marks the account inactive; the error itself is raised by the branches below.
- `error_code: "E3002"` (permissions) → `AbortedError`.
- Anything else → `NetworkError` with Snap's status.

#### Partial Batching Response Handling

Not applicable (one request per chunk, no per-record response parsing).

### User Deletion

Not supported (no `deleteUsers.js`).

### OAuth Support

Yes (see Authentication).

### Additional Functionalities

- **Hashing and normalisation** before SHA-256, unless `disableHashing` is set (see [businesslogic.md](docs/businesslogic.md)).
- **Key lookup**: identifier keys are matched in several cases (`email`/`EMAIL`/`Email`, `phone`/`mobile`..., `mobileId`/`mobileAdId`/`mobile_id`...).

### Validations

- `type` must be `audiencelist`; `properties.listData` with `add` and/or `remove` required.
- At least one record must have a value for the configured schema, else `Required schema parameter <schema> is not found from payload`.

### Rate Limits

Snap Ads API: about 10 requests/second per access token and 20 requests/second per app; 429 when exceeded ([rate limits](https://developers.snap.com/marketing-api/Ads-API/rate-limits)). Max 100,000 identifiers per request.

## General Queries

### Event Ordering

Required between add and remove for the same user (mirror sync). If a remove is delivered before an earlier add, the user ends up in the segment wrongly.

### Data Replay Feasibility

- **Missing data**: Replay is possible if ordering is kept.
- **Already-delivered data**: Adding an identifier already in the segment, or removing one that is not, has no lasting effect, so replays are safe in practice. **NEEDS REVIEW**.

### Rate Limits and Batch Sizes

See above.

### Multiplexing

Yes. An event with both `add` and `remove` produces at least two requests (POST and DELETE), and lists above 100,000 identifiers produce one request per chunk.

## Version Information

### Current Version

Snap Marketing API **v1** (`https://adsapi.snapchat.com/v1`, `config.js`).

### Version Deprecation

No deprecation of v1 or of the segment users endpoints has been announced. Snap's policy: deprecation date is 90 days after the announcement, with end of life two weeks after sunset ([breaking changes log](https://developers.snap.com/marketing-api/Ads-API/breaking-changes-log)). Snap's docs mark the `id` field in the add-users body as legacy ("should be skipped for new implementations"); this code only sends `id` for removals, where Snap still lists it as required.

### Latest Available Version

v1 is the latest Ads API version. (Snap's Conversions API is separately versioned, v3, and not used here.)

## Documentation Links

- [Snap: Customer Lists (segments and users)](https://developers.snap.com/api/marketing-api/Ads-API/audience-creation/customer-lists)
- [Snap: Authentication](https://developers.snap.com/api/marketing-api/Ads-API/authentication)
- [Snap: Rate limits](https://developers.snap.com/marketing-api/Ads-API/rate-limits)

### Changelog References

- [Snap Marketing API changelog](https://developers.snap.com/marketing-api/Ads-API/changelog)
- [Snap Marketing API announcements](https://developers.snap.com/marketing-api/Ads-API/announcements)
- [Snap Marketing API breaking changes log](https://developers.snap.com/marketing-api/Ads-API/breaking-changes-log) (deprecation policy; entries not updated since 2020)
- [Snap Marketing API newsletter](https://developers.snap.com/marketing-api/Ads-API/newsletter)
- No RSS feed found.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
