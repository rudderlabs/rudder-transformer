# Zendesk Destination

Implementation in **TypeScript/JavaScript** (`transform.ts`, `util.js`, `config.js`)

## Overview

The Zendesk destination creates and updates Zendesk Support users (identify), organizations and organization memberships (group), and sends custom user events through the Zendesk Events API (track). Most Zendesk API calls happen during transformation, not at delivery. See [Intermediate Calls](#intermediate-calls).

## Configuration

Source: `rudder-integrations-config/src/configurations/destinations/zendesk/` (`schema.json`, `ui-config.json`).

### Required Settings

| Config key | UI label          | Used in code | Notes                                                                                         |
| ---------- | ----------------- | ------------ | --------------------------------------------------------------------------------------------- |
| `email`    | Email             | Yes          | Zendesk agent/admin email. Used to build the Basic auth credential `{email}/token:{apiToken}` |
| `apiToken` | API Token         | Yes          | Zendesk API token (secret, listed in `secretKeys`). See [Authentication](#authentication)     |
| `domain`   | Zendesk Subdomain | Yes          | Subdomain only. Base URL is `https://{domain}.zendesk.com/api/v2/`                            |

### Optional Settings

| Config key                    | UI label                                 | Default  | Behaviour in code                                                                                                                                                   |
| ----------------------------- | ---------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sourceName`                  | Source Name                              | `Rudder` | `source` of track events. The value `zendesk` (any case) is rejected with a `ConfigurationError`                                                                    |
| `createUsersAsVerified`       | Create users as verified                 | `false`  | Sets `user.verified: true` on created/updated users and `verified` on primary email identity updates                                                                |
| `sendGroupCallsWithoutUserId` | Send Group Calls without User ID         | `false`  | Group calls with no `userId` only create/update the organization (no membership)                                                                                    |
| `removeUsersFromOrganization` | Enable Removing Users from Organizations | `false`  | Identify with `traits.company.remove` and `traits.company.id` deletes the user's organization membership                                                            |
| `searchByExternalId`          | Update user's primary email              | `false`  | Identify replaces the user's primary email with `traits.email` (via the User Identities API). The key name is historical: it does not change how users are searched |

Consent keys (`oneTrustCookieCategories`, `ketchConsentPurposes`, `consentManagement`) are handled by the platform, not by this code.

## Authentication

### What the code uses today

Every request (intermediate calls and the final delivered request) uses **HTTP Basic auth with a customer API token**, built in `processSingleMessage` (`transform.ts`):

```js
const unencodedBase64Str = `${destinationConfig.email}/token:${destinationConfig.apiToken}`;
headers = {
  Authorization: `Basic ${Buffer.from(unencodedBase64Str).toString('base64')}`,
  'Content-Type': 'application/json',
};
```

- Config fields: `email`, `apiToken`, `domain`. There is no OAuth field or account.
- `db-config.json` has no `auth` block, so the destination is **not** an OAuth destination in RudderStack.
- `rudder-auth` has a `zendesk` OAuth strategy (`src/controllers/oauthImplementations/zendesk.ts`, scope `read`). It is not wired to this destination: no `auth` config, no account, and the transformer never reads an access token. It appears to serve the Zendesk source. NEEDS REVIEW: confirm which product uses that role.
- The final delivered requests also carry Zendesk Marketplace headers from `config.js` (`X-Zendesk-Marketplace-Name: RudderStack`, `X-Zendesk-Marketplace-Organization-Id: 3339`, `X-Zendesk-Marketplace-App-Id: 263241`). Intermediate calls made through `handleHttpRequest` do **not** send these headers.

### What Zendesk now says

Zendesk is removing API tokens and requires third-party integrations to use OAuth:

| Date             | Change                                                                                                                                                                                                                                                                                                   | Source                                                                                                                                                                                                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Aug 12, 2025     | Third-party apps, integrations and bots must not use a customer's API token or the customer's own OAuth client. Multi-customer integrations must go through the Marketplace, use a **global OAuth client** and send the Marketplace headers. Integrations on API tokens or basic auth must move to OAuth | [Developer update: Enhanced security guidelines for third-party apps, integrations, and bots](https://support.zendesk.com/hc/en-us/articles/9590471542170-Developer-update-Enhanced-security-guidelines-for-third-party-apps-integrations-and-bots)                                                    |
| Jan 31, 2026     | Third-party developers must adopt the OAuth refresh-token flow (enforced for global OAuth clients from Feb 2, 2026, per the developer changelog). Access tokens default to a 30-minute TTL and refresh tokens to 30 days                                                                                 | [OAuth refresh token and token expirations](https://support.zendesk.com/hc/en-us/articles/9182123625370-Announcing-support-for-OAuth-refresh-token-grant-type-and-OAuth-access-and-refresh-token-expirations), [Developer changelog](https://developer.zendesk.com/api-reference/changelog/changelog/) |
| Jan 12, 2026     | Email + **password** basic auth for the API removed. This does not apply to `email/token` basic auth, which this destination uses                                                                                                                                                                        | [Deprecation of password access for APIs](https://support.zendesk.com/hc/en-us/articles/9941874259354-Deprecation-of-password-access-for-APIs)                                                                                                                                                         |
| Jun 1, 2026      | API token removal announced for Support APIs (Ticketing, Help Center, Voice)                                                                                                                                                                                                                             | [Announcing the removal of API tokens as an authentication method for API requests](https://support.zendesk.com/hc/en-us/articles/10851263566234-Announcing-the-removal-of-API-tokens-as-an-authentication-method-for-API-requests)                                                                    |
| Jul 28, 2026     | Phase 1: tokens unused for 30 days are auto-deactivated, then deleted after 60 more days. Accounts created on or after this date cannot create or use API tokens                                                                                                                                         | Same article                                                                                                                                                                                                                                                                                           |
| Oct 27, 2026     | Phase 2: no new API tokens can be created (UI or API). Existing active tokens keep working                                                                                                                                                                                                               | Same article                                                                                                                                                                                                                                                                                           |
| **Apr 30, 2027** | Phase 3: all remaining API tokens are permanently deactivated. "There is no opt-out or extension beyond April 30, 2027"                                                                                                                                                                                  | Same article                                                                                                                                                                                                                                                                                           |

Zendesk's [Security and authentication](https://developer.zendesk.com/api-reference/introduction/security-and-auth/) reference now labels the API token section "API token (deprecated)" and says apps distributed to multiple customers must use global OAuth tokens (`Authorization: Bearer {access_token}`).

### Impact

- This destination already breaks the Aug 12, 2025 third-party policy: it uses customer API tokens while identifying itself as a Marketplace app.
- New Zendesk accounts (created on or after Jul 28, 2026) cannot use this destination at all. From Oct 27, 2026 customers cannot create a new token to set it up. All connections stop authenticating on **Apr 30, 2027**.
- A migration needs a global OAuth client with refresh tokens, an `auth` block and account definition in `rudder-integrations-config`, and transformer changes to send `Bearer` tokens and handle token refresh/expiry. NEEDS REVIEW: track the migration owner and ticket.

## Integration Functionalities

> Zendesk supports **Cloud mode** only.

### Supported Message Types

From `db-config.json`: `cloud: ["group", "identify", "track"]`. The code throws `Event type <type> is not supported` for anything else.

Supported source types: `android`, `androidKotlin`, `ios`, `iosSwift`, `web`, `unity`, `amp`, `cloud`, `warehouse`, `reactnative`, `flutter`, `cordova`, `shopify` (all cloud mode).

| Message type | What happens                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Identify     | Create user fields if needed, create or update user, optionally update primary email and remove organization membership |
| Group        | Create organization fields if needed, create or update organization, then add the user to it (or only the organization) |
| Track        | Look up (or create) the user by email, then send a custom event to `users/{id}/events`                                  |

### Implementation

- **Language**: TypeScript (`transform.ts`) with JavaScript helpers. Not CDK v2.
- **Location**: `src/v0/destinations/zendesk/`
- **Processor vs Router**: Router destination (`transformAtV1: "router"`). `processRouterDest` uses `mapInBatches` with `sequentialProcessing: true`, so events in a router request are transformed one at a time, in order.
- **`saveDestinationResponse`**: `true`

### Batching Support

- **Supported**: No. Each event produces its own request(s).

### Rate Limits

Zendesk applies account-wide limits per plan, plus endpoint limits ([Rate limits](https://developer.zendesk.com/api-reference/introduction/rate-limits/)):

| Plan                              | Requests per minute |
| --------------------------------- | ------------------- |
| Team                              | 200                 |
| Growth / Professional             | 400                 |
| Enterprise                        | 700                 |
| Enterprise Plus / High Volume API | 2500                |

Endpoint limits relevant to this destination:

| Endpoint                           | Used by                | Limit                                                                                                                   |
| ---------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `POST users/create_or_update.json` | Identify, Group, Track | 5 requests per minute per unique end user ([Users](https://developer.zendesk.com/api-reference/ticketing/users/users/)) |
| Other endpoints used               | All                    | Account limit only. NEEDS REVIEW: Events API (`users/{id}/events`) limits                                               |

A 429 from an intermediate call becomes a `NetworkError` with a retryable error type (via `getDynamicErrorType`) for calls that throw. Calls that only log (see below) swallow it.

### Intermediate Calls

All intermediate calls go to `https://{domain}.zendesk.com/api/v2/` with the Basic auth header.

#### Identify

1. `GET user_fields.json`: reads existing user fields. On failure, logs and continues.
2. `POST user_fields.json` (one per new trait): creates a user field for each non-object trait not already present and not in the default list (`email`, `name`, `organizationId`, `timezone`, `phone`, `userId`, `id`). Failures are logged only.
3. `POST users/create_or_update.json`: **the actual create/update of the user**. Failure throws `NetworkError`.
4. If `searchByExternalId` and `traits.email`:
   - `GET users/{id}/identities` (errors are swallowed and the step is skipped)
   - `DELETE users/{id}/identities/{identityId}` to remove a non-primary identity that already has the new email
   - `PUT users/{id}/identities/{primaryIdentityId}` to set the new email on the current primary identity
5. If `removeUsersFromOrganization` and `traits.company.remove` and `traits.company.id`:
   - `GET users/search.json?query={email}`
   - `GET users/{id}/organization_memberships.json`
   - `DELETE users/{id}/organization_memberships/{membershipId}.json` when the **first** membership matches `traits.company.id`. Errors are logged and swallowed.

Why: Zendesk only stores custom user data in pre-defined user fields, and identity/membership changes need Zendesk IDs. Because the work is already done, the identify output is returned with status **299** (`SUPPRESS_EVENTS`). rudder-server marks it succeeded without sending it again.

#### Group

1. `GET` / `POST organization_fields.json`: same field auto-creation as identify, using `message.traits`.
2. If `sendGroupCallsWithoutUserId` and no `userId`: no further calls. The delivered request is `POST organizations/create_or_update.json`.
3. Otherwise:
   - `POST organizations/create_or_update.json`: creates/updates the organization to get its ID. A failure becomes `Couldn't create user membership ... as Organization ... wasn't created`.
   - `GET users/search.json?query={context.traits.email}`: finds the Zendesk user.
   - `POST users/create_or_update.json`: creates the user if not found and `context.traits` has `name` and `email`. Otherwise `User not found`.
   - `GET users/{id}/organization_memberships.json`: if the first membership is already this organization, the event fails with `User is already associated with organization`.
   - Delivered request: `POST organization_memberships.json`.

#### Track

1. `GET users/search.json?query={traits.email}`: finds the user. Failure throws `NetworkError`.
2. `POST users/create_or_update.json`: creates the user if not found.
3. Delivered request: `POST users/{zendeskUserId}/events`.

### Proxy Delivery

- **Supported**: No. There is no `networkHandler.js`.

### User Deletion

- **Supported**: No. There is no `deleteUsers.js`.

### OAuth Support

- **Supported**: No. See [Authentication](#authentication). This is the main open risk for the integration.

### Additional Functionalities

- **Automatic custom field creation**: user fields (identify) and organization fields (group) are created on the fly for new non-object traits. Each field is created with `title`, `key` and `description` set to the trait name, and `active: true`.
- **`id` custom field**: `user_fields.id` / `organization_fields.id` are set to the external ID.
- **Primary email replacement**: see `searchByExternalId`.
- **Organization membership removal**: see `removeUsersFromOrganization`.

### Validations

| Event    | Rule                                                                              | Error                                                                                             |
| -------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| All      | Type must be identify, group or track                                             | `Event type <type> is not supported`                                                              |
| All      | `sourceName` must not be `zendesk`                                                | `Invalid source name. The source name \`zendesk\` is not allowed.` (track only, where it is read) |
| Identify | `userId` required                                                                 | `UserId is a mandatory field for identify`                                                        |
| Identify | `traits.name` (or `context.traits.name`) required                                 | `Missing required value from "name"`                                                              |
| Track    | `userId` required                                                                 | `UserId is a mandatory field for track`                                                           |
| Track    | `traits.email` (or `context.traits.email`) required                               | `email not found in traits.`                                                                      |
| Group    | `userId` required unless `sendGroupCallsWithoutUserId`                            | `UserId is a mandatory field for group`                                                           |
| Group    | `traits` required                                                                 | `Organisation Traits are missing. Aborting.`                                                      |
| Group    | User must exist or `context.traits.name` + `context.traits.email` must be present | `User not found`                                                                                  |
| Group    | User must not already be in the organization (first membership only)              | `User is already associated with organization`                                                    |

## General Queries

### Event Ordering

#### Identify

Required. Identify overwrites user attributes and can change the primary email, so an older event processed later writes stale data. The router processes events sequentially within a request.

#### Group

Required. Group creates/updates organization attributes (overwrite) and adds memberships. A stale group event can revert organization fields. A later identify with `company.remove` and an earlier group event can also conflict.

#### Track

Not strictly required. Events carry no timestamp from the RudderStack payload (the code does not map `timestamp`), so Zendesk records them at ingestion time. Out-of-order delivery changes the order shown in the user's event timeline. NEEDS REVIEW: confirm whether the Events API accepts a `created_at` on the event.

### Data Replay Feasibility

#### Missing Data Replay

- **Identify / Group**: Feasible only if replayed in order and no newer data has been sent since, otherwise profiles are overwritten with older values.
- **Track**: Feasible, but events are timestamped at ingestion (see above), so historical timing is lost.

#### Already Delivered Data Replay

- **Identify / Group**: Idempotent in effect (`create_or_update` upserts). Group replays with a user already in the organization fail with `User is already associated with organization`.
- **Track**: Not safe. The Events API has no dedupe key in the payload this destination sends, so replays create duplicate events. NEEDS REVIEW against the [Events API](https://developer.zendesk.com/api-reference/ticketing/users/events-api/events-api/) docs.

### Multiplexing

- **Identify**: Yes. Can return up to 4 responses: identity delete, identity update, membership delete and the user `create_or_update`. All of them have already been executed during transformation and are returned with status 299, so the server does not send them again.
- **Group / Track**: No. One delivered request each, plus the intermediate calls listed above.

## Version Information

### Current Version

- **Zendesk Support REST API v2**: base URL `https://{domain}.zendesk.com/api/v2/` (`getBaseEndpoint` in `config.js`).
- Track uses the Events API (`/api/v2/users/{user_id}/events`), which is also under `/api/v2`.

### Version Deprecation

- Zendesk does not publish versioned REST APIs or version sunset dates. v2 is the only version. Changes follow the [change policy](https://developer.zendesk.com/api-reference/introduction/api_changes/): 3 months' notice for breaking changes to Business Critical endpoints, 1 month for Standard, 1 week for Beta.
- **Auth deprecation is the live risk, not the API version.** API token authentication, which this destination relies on, is deactivated for good on **April 30, 2027**. See [Authentication](#authentication).
- No deprecation was found for the endpoints used (users, user identities, user fields, organizations, organization fields, organization memberships, events). NEEDS REVIEW: re-check the changelog periodically.

### Latest Available Version

- REST API v2 is the latest and only version. No newer version exists to upgrade to.

## Documentation Links

### API Documentation

- [Users](https://developer.zendesk.com/api-reference/ticketing/users/users/) (create_or_update, search)
- [User Identities](https://developer.zendesk.com/api-reference/ticketing/users/user_identities/)
- [User Fields](https://developer.zendesk.com/api-reference/ticketing/users/user_fields/)
- [Organizations](https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/)
- [Organization Fields](https://developer.zendesk.com/api-reference/ticketing/organizations/organization_fields/)
- [Organization Memberships](https://developer.zendesk.com/api-reference/ticketing/organizations/organization_memberships/)
- [Events API](https://developer.zendesk.com/api-reference/ticketing/users/events-api/events-api/)
- [Tracking events](https://developer.zendesk.com/documentation/ticketing/events/tracking-events/)
- [Rate limits](https://developer.zendesk.com/api-reference/introduction/rate-limits/)
- [Security and authentication](https://developer.zendesk.com/api-reference/introduction/security-and-auth/)
- [Set up a global OAuth client](https://developer.zendesk.com/documentation/marketplace/building-a-marketplace-app/set-up-a-global-oauth-client/)
- [Request header requirements for Marketplace apps](https://developer.zendesk.com/documentation/marketplace/building-a-marketplace-app/request-header-requirements-for-marketplace-apps/)
- [OAuth grant-type tokens](https://developer.zendesk.com/api-reference/ticketing/oauth/grant_type_tokens/)
- [Using OAuth authentication with your application](https://support.zendesk.com/hc/en-us/articles/4408845965210-Using-OAuth-authentication-with-your-application)
- [RudderStack Zendesk destination docs](https://www.rudderstack.com/docs/destinations/streaming-destinations/zendesk/)

### Changelog References

- [Zendesk API changelog](https://developer.zendesk.com/api-reference/changelog/changelog/): breaking changes, deprecations and betas announced after June 22, 2022
- [Developer updates (Zendesk help)](https://support.zendesk.com/hc/en-us/sections/4405298889242): announcements and breaking changes for developers, including the auth deprecations
- [What is being removed](https://support.zendesk.com/hc/en-us/articles/4408843026714-What-is-being-removed-updated-August-2026): Zendesk feature-removal list
- [API change policy](https://developer.zendesk.com/api-reference/introduction/api_changes/): notice periods for breaking changes
- Key auth announcements:
  - [Announcing the removal of API tokens as an authentication method for API requests](https://support.zendesk.com/hc/en-us/articles/10851263566234-Announcing-the-removal-of-API-tokens-as-an-authentication-method-for-API-requests)
  - [Developer update: Enhanced security guidelines for third-party apps, integrations, and bots](https://support.zendesk.com/hc/en-us/articles/9590471542170-Developer-update-Enhanced-security-guidelines-for-third-party-apps-integrations-and-bots)
  - [OAuth refresh token grant type and token expirations](https://support.zendesk.com/hc/en-us/articles/9182123625370-Announcing-support-for-OAuth-refresh-token-grant-type-and-OAuth-access-and-refresh-token-expirations)
  - [Deprecation of password access for APIs](https://support.zendesk.com/hc/en-us/articles/9941874259354-Deprecation-of-password-access-for-APIs)
- API versions and sunset dates page: none. Zendesk has a single unversioned v2 API.
- RSS/Atom feed: NEEDS REVIEW. No feed was found for the changelog or the Developer updates section. The section is readable as JSON through the Help Center API: `https://support.zendesk.com/api/v2/help_center/en-us/sections/4405298889242/articles.json?sort_by=created_at&sort_order=desc`.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

<!-- Populated over time. -->
