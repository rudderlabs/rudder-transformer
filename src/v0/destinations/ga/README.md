# Google Analytics (Universal Analytics) and Google Analytics 360 Destination

Implementation in **JavaScript** (v0)

> **Partner product is shut down.** Google stopped processing Universal Analytics (UA) hits on July 1, 2023 (standard) and July 1, 2024 (UA 360), and shut off UA data and API access from the week of July 1, 2024. The `GA` destination is marked `deprecated: true` in `rudder-integrations-config` ("Google sunsetted Google Analytics (UA). Please set up Google Analytics 4 instead"). `GA360` is **not** marked deprecated there, although it targets the same retired UA collection endpoint. See [Version Information](#version-information).

## Destinations Covered

| Dashboard destination | Display name         | Transformer code                                                                                |
| --------------------- | -------------------- | ----------------------------------------------------------------------------------------------- |
| `GA`                  | Google Analytics     | `src/v0/destinations/ga/`                                                                       |
| `GA360`               | Google Analytics 360 | Same code, via `DestHandlerMap` (`ga360: 'ga'`) in `src/constants/destinationCanonicalNames.js` |

Differences in `rudder-integrations-config`:

| Item                    | GA                                                   | GA360                       |
| ----------------------- | ---------------------------------------------------- | --------------------------- |
| `auth` (OAuth)          | `OAuth`, provider Google, `rudderScopes: ["delete"]` | None                        |
| `rudderDeleteAccountId` | Yes                                                  | No                          |
| `supportsVisualMapper`  | `true`                                               | Not set                     |
| Web device-mode types   | `track`, `page`                                      | `identify`, `track`, `page` |
| `options.deprecated`    | `true`                                               | Not set                     |

## Configuration

Config keys read by the transformer (`destination.Config`):

| Key                                                                 | Purpose                                                                                                         |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `trackingID` (required)                                             | UA property ID, sent as `tid`; also the `webPropertyId` for user deletion                                       |
| `enableServerSideIdentify`                                          | Must be `true` for cloud-mode `identify`; otherwise the event fails with `server side identify is not on`       |
| `serverSideIdentifyEventCategory` / `serverSideIdentifyEventAction` | Event category (trait name) and action for identify hits. Action defaults to `User Enriched`, category to `All` |
| `enhancedEcommerce`                                                 | Enables Enhanced Ecommerce product actions (`pa`, `pr<n>*`, `il1pi<n>*`, `promoa`)                              |
| `nonInteraction`                                                    | Default `ni` for non-ecommerce track hits                                                                       |
| `dimensions`, `metrics`, `contentGroupings`                         | Map event properties (traits for identify) to `cd<n>`, `cm<n>`, `cg<n>`                                         |
| `customMappings`                                                    | Legacy dimension/metric mapping, used only when `dimensions` and `metrics` are both absent                      |
| `includeSearch`                                                     | Append the URL query string to `dp`                                                                             |
| `doubleClick`, `anonymizeIp`, `enhancedLinkAttribution`             | Set `npa=1`, `aip=1`, and `linkid` respectively                                                                 |
| `sendUserId`                                                        | Send `message.userId` as `uid`                                                                                  |
| `disableMd5`                                                        | Do not fall back to `md5(userId)` for `cid`                                                                     |
| `useNativeSDK`                                                      | Read only by `deleteUsers.js` to choose `propertyId` vs `webPropertyId`                                         |

Web device-mode-only keys (`trackCategorizedPages`, `sampleRate`, `optimize`, `namedTracker`, and so on) are not read by the transformer. Event filtering (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`) and consent settings are applied by rudder-server/SDKs, not here.

## Integration Functionalities

### Implementation

- **Implemented in**: JavaScript, `src/v0/destinations/ga/`. No v1 or CDK v2 folder exists.
- **CDK v2 Enabled**: No
- **Processor vs Router**: `transformAtV1: "processor"` for both GA and GA360. `features.ts` also declares `routerTransform: true`; `processRouterDest` is `simpleProcessRouterDest` over the same `process`.

### Supported Message Types

Cloud mode: `identify` (only with `enableServerSideIdentify`), `page`, `screen`, `track`.

### Authentication

- **Event delivery**: None. The Measurement Protocol v1 (`POST https://www.google-analytics.com/collect`) is unauthenticated; the property is identified by `tid=trackingID`. No headers are built.
- **User deletion**: OAuth 2.0 (Google), GA only. The access token comes from rudder-server in the `x-rudder-dest-info` header (`rudderDestInfo.secret.access_token`) and is sent as `Authorization: Bearer <token>`. In `rudder-auth` the `google_analytics` role requests `analytics.user.deletion`, `userinfo.profile` and `userinfo.email` for the destination category (`src/routes/auth/google_analytics.ts`).
- `networkHandler.js` (`gaResponseHandler`) maps deletion errors: `invalidCredentials` / `UNAUTHENTICATED` → `REFRESH_TOKEN`; 403 `insufficientPermissions` → `AUTH_STATUS_INACTIVE`.

### Validations

- `message.type` required; `track` needs a string `event`.
- Enhanced Ecommerce: unknown event names inside a mapped category throw (`unknown ProductEvent type`, `unknown TransactionEvent type`); transaction events (`checkout started`, `order updated`, `order completed`, `order cancelled`) require a non-empty `properties.products`.
- `page`: `properties.url` (via `GApageUrl`) must parse as a URL, else `Invalid Url`.
- The 8192-byte payload check (`validatePayloadSize` in `utils.js`) exists but its call is commented out in `transform.js`.

### Batching

- **Supported**: No. Each event becomes one `/collect` hit (sent as query `params`). The Measurement Protocol `/batch` endpoint (up to 20 hits) is not used.

### Intermediate Calls

None.

### Proxy Delivery

- **Supported**: No. `networkHandler.js` exists but only parses user-deletion responses. `features.ts` does not set `transformerProxy` for GA.

### User Deletion

- **Supported**: Yes (`features.ts`: `regulations: true`), `src/v0/destinations/ga/deleteUsers.js`.
- **Endpoint**: `POST https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert`, one request per user, `id.type: USER_ID`.
- The UA User Deletion API stopped working with the UA shutdown (July 2024). The old reference page now redirects to the GA4 Admin API `properties.submitUserDeletion`.

### OAuth Support

- **GA**: Yes, `auth.type: "OAuth"`, used only for user deletion (`rudderScopes: ["delete"]`).
- **GA360**: No.

### Additional Functionalities

- Client ID (`cid`) priority: `integrations["Google Analytics"].clientId` → `externalId` type `gaExternalId` → `traits.cid` → `anonymousId` → `md5(userId)` (skipped when `disableMd5`).
- `gclid` / `dclid` from `externalId` types `googleAdsId` / `googleDisplayAdsId`.
- `qt` (queue time) = now − event timestamp.

### Rate Limits

Historical UA Measurement Protocol limits no longer apply because the endpoint no longer processes data. NEEDS REVIEW if any traffic still flows.

## General Queries

### Event Ordering

UA hits carried `qt` so Google back-dated them (up to 4 hours). Ordering was not required for track/page/screen. Identify hits are events too, so ordering only affected custom-dimension values. With UA shut down, this is moot.

### Data Replay Feasibility

- **Missing data**: Not feasible. UA no longer processes hits, and `qt` only covered 4 hours.
- **Already delivered**: Not feasible. UA had no idempotency key; replays created duplicate hits.

### Multiplexing

None. One input → one hit.

## Version Information

### Current Version

- **API:** Universal Analytics Measurement Protocol
- **Version:** `v1`
- **Where in code:** `config.js` (`GA_ENDPOINT`, `https://www.google-analytics.com/collect`); `transform.js` (`v: '1'` in the raw payload)
- **API:** Google Analytics User Deletion API
- **Version:** `v3`
- **Where in code:** `config.js` (`GA_USER_DELETION_ENDPOINT`)

### Version Deprecation

- **API:** Universal Analytics Measurement Protocol
- **Status:** Sunset
- **Sunset date:** 2023-07-01
- **Source:** [Universal Analytics is going away](https://support.google.com/analytics/answer/11583528)
- **API:** Google Analytics User Deletion API
- **Status:** Sunset
- **Sunset date:** 2024-07-01
- **Source:** [Universal Analytics is going away](https://support.google.com/analytics/answer/11583528)

Standard UA properties stopped processing hits on 2023-07-01. UA 360 properties had a one-time extension to 2024-07-01. Google shut off UA data, UI and API access (including the User Deletion API) from the week of 2024-07-01 and deleted data that was not exported. Every endpoint this destination calls is end-of-life, so events sent to GA or GA360 are not recorded by Google. NEEDS REVIEW: GA360 should probably also be marked `deprecated` in `rudder-integrations-config`.

### Latest Available Version

- **API:** GA4 Measurement Protocol (replaces the UA Measurement Protocol)
- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** Yes
- **Source:** [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- **API:** Google Analytics Admin API `properties.submitUserDeletion` (replaces the User Deletion API)
- **Version:** `v1alpha`
- **Released:** Unknown
- **Upgrade needed:** Yes
- **Source:** [GA4 Admin API: submitUserDeletion](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties/submitUserDeletion)

The GA4 Measurement Protocol (`/mp/collect`) needs `measurement_id` and `api_secret`. RudderStack ships it as the separate `GA4` / `GA4_V2` destinations. The data model differs (events with parameters instead of hit types and Enhanced Ecommerce `pr<n>` parameters), so this is a replacement, not an upgrade path.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [UA Measurement Protocol (legacy docs)](https://developers.google.com/analytics/legacy/universal-analytics)
- [UA Measurement Protocol v1 overview](https://developers.google.com/analytics/devguides/collection/protocol/v1)
- [UA Measurement Protocol v1 parameter reference](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference)
- [User Deletion API v3](https://developers.google.com/analytics/devguides/config/userdeletion/v3)
- [User Deletion API v3: userDeletionRequests.upsert](https://developers.google.com/analytics/devguides/config/userdeletion/v3/reference/userDeletion/userDeletionRequest/upsert)
- [Universal Analytics shutdown](https://support.google.com/analytics/answer/11583528)
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [GA4 Admin API: submitUserDeletion](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties/submitUserDeletion)

### Changelog References

- **Changelog:** [Google Analytics release notes ("What's new")](https://support.google.com/analytics/answer/9164320); [GA4 Measurement Protocol changelog](https://developers.google.com/analytics/devguides/collection/protocol/ga4/changelog)
- **Deprecations:** [Universal Analytics is going away](https://support.google.com/analytics/answer/11583528)
- **Versions:** None found
- **Feed:** None found
- **Announcements:** [Universal Analytics sunset timeline](https://support.google.com/analytics/answer/11583528)
- **Last checked:** 2026-11-16

## FAQ

<!-- Populated over time -->
