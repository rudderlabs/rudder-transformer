# Marketo Destination

Implementation in **JavaScript**: `src/v0/destinations/marketo/`. No v1 or CDK v2 folder exists for this destination.

## Overview

Sends RudderStack `identify` calls to Marketo as lead create/update calls and `track` calls as custom activities, using the Marketo Engage REST API (`/rest/v1`). For warehouse (RETL/VDM) sources, `identify` can also upsert custom objects.

Related destinations that reuse this code:

- `marketo_static_list` imports `getAuthToken` and `marketoResponseHandler` from `./util.js`.
- `MARKETO_BULK_UPLOAD` is delivered by rudder-server (async destination manager), not by the transformer.

## Configuration

Config keys read from `destination.Config` (from `rudder-integrations-config/src/configurations/destinations/marketo/schema.json`):

| Key                         | Required | Used for                                                                                                                                |
| --------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `accountId`                 | Yes      | Munchkin account ID. Builds `https://{accountId}.mktorest.com` for both the identity and REST endpoints.                                |
| `clientId`                  | Yes      | Client ID of the Marketo LaunchPoint custom service. Sent to the identity endpoint.                                                     |
| `clientSecret`              | Yes      | Client secret of the custom service. Sent to the identity endpoint. Marked as a secret key.                                             |
| `trackAnonymousEvents`      | No       | If `false`, `track` events without `userId` are rejected.                                                                               |
| `createIfNotExist`          | No       | If `true`, a lead is created (by `userId`/`anonymousId`) when lookup finds nothing.                                                     |
| `rudderEventsMapping`       | No       | Rows of `{ event, marketoActivityId, marketoPrimarykey }`: RudderStack event to custom activity type ID and primary attribute property. |
| `customActivityPropertyMap` | No       | Rows of `{ from, to }`: event property to custom activity attribute name.                                                               |
| `leadTraitMapping`          | No       | Rows of `{ from, to }`: trait to Marketo lead field (event stream only).                                                                |

Legacy keys `customActivityEventMap` and `customActivityPrimaryKeyMap` are still read by `formatConfig()` when `rudderEventsMapping` is absent.

## Integration Functionalities

### Implementation Language

JavaScript (v0). `cdkV2Enabled` is not set in `db-config.json`.

### Supported Message Types

| Source types                                                                                                                      | Message types       |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, warehouse, reactnative, flutter, cordova, shopify (all cloud mode) | `identify`, `track` |

Any other type fails with `Message type not supported`.

### Authentication

Marketo uses 2-legged OAuth 2.0 (client credentials) issued by the instance's identity service. This is not RudderStack OAuth: `db-config.json` has no `auth` block and nothing exists in `rudder-auth`.

1. **Token request** (`util.js` → `getAuthToken`):
   `GET https://{accountId}.mktorest.com/identity/oauth/token?client_id={clientId}&client_secret={clientSecret}&grant_type=client_credentials`
   The client ID and secret travel as query parameters (axios `params`). This is the form Adobe documents today.
2. **Token caching**: cached per destination ID in `MARKETO_AUTH` (`Cache`), with TTL = `expires_in` from the response (Marketo tokens last 3600 seconds). A response with `expires_in: 0` raises a retryable error so the next attempt gets a fresh token.
3. **REST calls**: every REST call (lead lookup, lead create, identify upsert, custom object upsert, custom activity) sends the token as `Authorization: Bearer {token}`. The code never sends `access_token` as a query parameter or body field.
4. **Invalid or expired token**: when a REST response carries error `601` (invalid) or `602` (expired), `marketoResponseHandler` deletes the cached token (`authCache.del(destInfo.authKey)`) and the event is retried. `processMetadataForRouter` sets `destInfo.authKey` to the destination ID so the proxy path can do this.

**Adobe auth changes and compliance (checked 2026-11-16):**

| Change                                                                                                                                                                     | Date                                                                                                                                                                                               | Our code                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `access_token` query parameter no longer accepted on REST calls; `Authorization: Bearer` header required. Calls using the query parameter fail with `603` (Access denied). | Removed **August 31, 2026** (Adobe authentication page and May/Aug 2026 release notes). Earlier announced dates: June 30, 2025 (Apr 2025 community post), March 31, 2026 (Oct 2025 release notes). | **Compliant.** All REST calls use the header.                                                                                               |
| Identity endpoint (`/identity/oauth/token`) with `client_id`/`client_secret` as query parameters                                                                           | No deprecation announced. Adobe still documents this exact GET form.                                                                                                                               | Matches the documented form. NEEDS REVIEW: credentials in a URL can end up in proxy/access logs; Adobe has not documented a POST body form. |
| SOAP API end of life                                                                                                                                                       | July 31, 2026 (May 2026 release notes); August 31, 2026 in the Sep 2025 community post.                                                                                                            | Not used.                                                                                                                                   |

The incident that triggered this review was in rudder-server's `MARKETO_BULK_UPLOAD`, which sent `access_token` as a multipart form field on the bulk import call. It was fixed in rudder-server PR #7510 (2026-10-20). `rudder-integrations-info` Marketo routes (VDM field and object discovery) also use the Bearer header.

### Processor vs Router

Router destination (`transformAtV1: "router"`, `routerTransform: true` in `src/features.ts`). `processRouterDest` fetches one token for the whole batch, then transforms each event in parallel.

### Batching

No. Each event becomes one REST request with a single-element `input` array.

### Intermediate Calls

Made during transformation (before delivery) for both `identify` and `track`:

| Call            | Endpoint                                                                                  | When                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Get token       | `GET /identity/oauth/token`                                                               | Cache miss for the destination ID.                                                          |
| Lookup by email | `GET /rest/v1/leads.json?filterType=email&filterValues={email}`                           | No `marketoLeadId` external ID (or RETL external ID) and the event has an email.            |
| Lookup by ID    | `GET /rest/v1/leads.json?filterType=userId\|anonymousId&filterValues=...`                 | No external ID and no email. Requires `userId`/`anonymousId` custom lead fields in Marketo. |
| Create lead     | `POST /rest/v1/leads.json` (`action: createOrUpdate`, `lookupField: userId\|anonymousId`) | Lookup found nothing and `createIfNotExist` is on.                                          |

Lead IDs are cached for 1 day (`USER_LEAD_CACHE_TTL`) in `MARKETO_EMAIL_LEAD` and `MARKETO_USER_ID_LEAD`. Note that the "create lead" call writes to Marketo during transformation, outside the delivery retry path.

### Proxy Delivery

Yes. `networkHandler.js` (`transformerProxy: true` in `src/features.ts`). It uses `marketoResponseHandler` to classify Marketo application errors in 200 responses. This is the v0 proxy; there is no per-event partial batch handling (requests are not batched).

### User Deletion

No `deleteUsers.js`.

### OAuth Support

No RudderStack OAuth. See [Authentication](#authentication).

### Additional Functionalities

- RETL custom objects: for VDM events whose external ID `type` is `MARKETO-{object}` with object not `leads`, `identify` upserts to `/rest/v1/customobjects/{object}.json` with `dedupeBy: dedupeFields`.
- `saveDestinationResponse: true` in `db-config.json`.
- Consent management keys (`oneTrustCookieCategories`, `ketchConsentPurposes`, `consentManagement`) are handled by rudder-server, not this code.

### Validations

- `message.type` required; only `identify`/`track`.
- `identify`: traits must exist (`Invalid traits value for Marketo`).
- `track`: `userId` required unless `trackAnonymousEvents`; event must be mapped to an activity ID (`Event is not mapped to Custom Activity`); `properties.{primaryKey}` must be truthy (`Primary Key value is invalid for the event`).
- Lead ID must resolve, or `Lead creation is turned off on the dashboard` / `lookup failure ...` is thrown.

### Rate Limits

From Adobe ([REST API](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/rest-api)):

- 100 calls per 20 seconds per instance (error `606`).
- 10 concurrent calls (error `615`).
- 50,000 calls per day per subscription, reset at 12:00 AM CST (error `607`).
- Standard calls: 8 KB URI, 1 MB body.

These limits are shared across every integration on the customer's Marketo instance. The code maps `502`, `606`, `607`, `608`, `615` to throttled.

## General Queries

### Event Ordering

- `identify`: required. Updates overwrite lead fields (`createOrUpdate`), so out-of-order events can leave stale values.
- `track`: not strictly required. Each custom activity carries `activityDate` from the event timestamp. Ordering still matters when the lead must exist first (a `track` that arrives before the `identify` creating the lead may fail lookup).

### Data Replay Feasibility

- **Missing data**: `track` can be replayed (activities carry their own date). `identify` can be replayed if newer updates for the same lead are replayed after it.
- **Already delivered**: `identify` replay is idempotent (upsert by lead `id`). `track` replay creates duplicate activities; Marketo does not dedupe custom activities.

### Multiplexing

No. One output request per input event. Intermediate lookup/create calls are not delivered outputs.

## Version Information

### Current Version

Marketo Engage REST API **v1** (`/rest/v1/...`) plus the identity service `/identity/oauth/token`. Endpoints are built inline in `transform.js` and `util.js`; there is no version constant.

### Version Deprecation

Adobe has not announced a sunset for REST API v1. Deprecations that matter for this integration:

- `access_token` query parameter: removed August 31, 2026. Code is compliant (header only). See [Authentication](#authentication).
- SOAP API: end of life July 31, 2026 (not used).
- From September 30, 2026, Get Lead Activities / Get Lead Changes with `listId` on lists of 10,000+ leads fail with `1003` (not used by this code).
- From July 31, 2026, Merge Leads with more than 25 IDs fails with `1080` (not used).

### Latest Available Version

v1 is the only REST API version. NEEDS REVIEW: Adobe offers an Adobe IMS bearer token only for its hosted Marketo MCP server (beta); no announcement extends IMS auth to the REST API.

## Documentation Links

- [Authentication](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/authentication)
- [REST API overview and limits](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/rest-api)
- [Base URL](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/base-url)
- [Leads](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/lead-database/leads)
- [Activities](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/lead-database/activities)
- [Custom objects](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/lead-database/custom-objects)
- [Error codes](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/error-codes)
- [Identity API reference](https://developer.adobe.com/marketo-apis/api/identity)

### Changelog References

- Release notes (current month): https://experienceleague.adobe.com/en/docs/marketo/using/release-notes/current
- Release notes, August 2026 (`access_token` removal after August 31, 2026): https://experienceleague.adobe.com/en/docs/marketo/using/release-notes/previous-releases/2026/release-notes-aug-26
- Release notes, May 2026 (SOAP end July 31, 2026; `access_token` August 31, 2026): https://experienceleague.adobe.com/en/docs/marketo/using/release-notes/previous-releases/2026/release-notes-may-26
- Release notes, October 2025 (earlier March 31, 2026 date): https://experienceleague.adobe.com/en/docs/marketo/using/release-notes/previous-releases/2025/release-notes-oct-25
- Deprecation announcement (Adobe community, Sep 16, 2025): https://experienceleaguecommunities.adobe.com/adobe-marketo-engage-27/updates-to-deprecation-of-soap-api-and-access-token-in-query-parameter-for-rest-api-147711
- Original deprecation announcement: https://experienceleaguecommunities.adobe.com/adobe-marketo-engage-27/deprecation-of-soap-api-and-access-token-in-query-parameter-for-rest-api-37
- "Bearer Tokens Now Required" (Adobe community, Apr 21, 2025): https://experienceleaguecommunities.adobe.com/adobe-marketo-engage-27/marketo-engage-rest-api-bearer-tokens-now-required-160950
- NEEDS REVIEW: Adobe publishes no developer changelog page or RSS/Atom feed for the Marketo REST API; monthly release notes and the authentication page carry deprecation notices. Release-note URLs follow `previous-releases/{year}/release-notes-{mon}-{yy}` but not every month exists (July 2026 returns 404).

## RETL

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_To be populated._
