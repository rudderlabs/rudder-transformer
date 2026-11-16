# Gladly Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/gladly/procWorkflow.yaml`, `rtWorkflow.yaml`)

## Overview

Creates or updates Gladly customer profiles from `identify` events, for event stream and RETL (warehouse)
sources.

## Configuration

Config keys from `schema.json` that the transformer reads (`destination.Config`):

| Key        | Required | Used for                                                             |
| ---------- | -------- | -------------------------------------------------------------------- |
| `domain`   | Yes      | Gladly org host, used as `https://{domain}/api/v1/customer-profiles` |
| `userName` | Yes      | Email of the Gladly API user (Basic auth username)                   |
| `apiToken` | Yes      | Gladly API token (Basic auth password). Listed in `secretKeys`.      |

### Authentication

`getHeaders` in `utils.js` builds HTTP Basic auth:

```
Authorization: Basic base64(<userName>:<apiToken>)
Content-Type: application/json
```

Gladly documents token-based Basic auth where the token belongs to a user with the **API User**
permission. Tokens are environment-specific (a sandbox token does not work in production)
([REST API](https://developer.gladly.com/rest/),
[Generate API tokens](https://help.gladly.com/generate-api-tokens-and-create-webhooks)). No change to
REST API authentication was found in Gladly release notes up to the June 2026 release. Gladly has changed
auth for some of its own partner integrations (for example Ordergroove moving from HMAC to API keys in
October 2025), which does not affect this API.

## Integration Functionalities

### Supported Message Types

`identify` only, cloud mode, for all SDK sources plus `cloud` and `warehouse`.

### Implementation

- **Implemented in**: CDK v2 (`cdkV2Enabled: true`, `GLADLY: { routerTransform: true, cdkV2: true }` in
  `src/features.ts`)
- **Processor vs Router**: Router destination (`transformAtV1: "router"`). `rtWorkflow.yaml` runs the
  processor workflow per event and returns unbatched responses.

### Validations

- `apiToken`, `domain` and `userName` must be set (configuration error otherwise).
- At least one of email, phone, `id` (Gladly customer ID) or `externalCustomerId` must be present:
  `One of phone, email, userId or GladlyCustomerId is required for an identify call`.

### Rate Limits

Gladly documents a default REST API rate limit, but its value was not readable from the reference page.
**NEEDS REVIEW**: add the number from [Gladly REST API → Rate Limit](https://developer.gladly.com/rest/).

### Batching Support

None. Gladly's customer-profiles API takes one customer per request.

### Intermediate Calls

**Customer lookup** before every write, when the payload has an email, phone or `externalCustomerId`:

- `GET https://{domain}/api/v1/customer-profiles?{query}`, where `query` is the first of
  `email=`, `phoneNumber=`, `externalCustomerId=` that is available.
- Lookup `400`, or `200` with an empty array → create (`POST`).
- Lookup `200` with results → update (`PATCH .../customer-profiles/{response[0].id}`).
- Any other non-2xx status fails the event with that status, so a transient error never creates a
  duplicate customer.
- No lookup when only a Gladly customer `id` is present: the event goes straight to create (`POST` with
  `id`).

### Proxy Delivery

No `networkHandler.js`. Not supported.

### User Deletion

No `deleteUsers.js`. Not supported.

### OAuth Support

No.

### Additional Functionalities

- Event stream: traits not in the reserved list (`email`, `phone`, `address`, `name`, `avatar`, `firstName`,
  `lastName`, `userId`) are sent as `customAttributes`.
- `address` objects are stringified (`JSON.stringify`).
- RETL (`mappedToDestination`) uses a separate field resolution path. See [docs/retl.md](docs/retl.md).

## General Queries

### Event Ordering

Required. Each identify does a lookup and then a create or a full-field `PATCH`, so out-of-order events can
overwrite newer profile data. Two identifies for a new customer processed close together can both see
"not found" and both `POST`, creating duplicates.

### Data Replay Feasibility

- **Missing data**: Can be replayed if replayed in order; older data overwrites newer values otherwise.
- **Already delivered data**: Replay is safe for existing customers (lookup → `PATCH`). Replays for
  customers created by the first delivery also resolve to `PATCH`.

### Multiplexing

No. One output request per event (the lookup is an intermediate call, not a delivered event).

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `src/cdk/v2/destinations/gladly/utils.js` (`getEndpoint`, `/api/v1/customer-profiles`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Gladly REST API: URL path versioning](https://developer.gladly.com/rest/#section/URL-Path-Versioning)

Gladly uses URL path versioning and documents which changes it treats as backwards compatible. Gladly does retire older report API versions (ContactExportReport and ContactExportReportV2, and Contact Summary and Work Sessions reports deprecated on 2026-09-02, per the [June 2026 release notes](https://help.gladly.com/docs/june-2026-releases)), which this destination does not use.

### Latest Available Version

- **Version:** `v1`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Gladly REST API reference](https://developer.gladly.com/rest/)

`v1` is the only REST API version for customer profiles.

## Documentation Links

### API Documentation

- [Gladly REST API reference](https://developer.gladly.com/rest/)
- [Find customers](https://developer.gladly.com/rest/#operation/findCustomers) (`GET /api/v1/customer-profiles`)
- [Create customer](https://developer.gladly.com/rest/#operation/createCustomer) (`POST /api/v1/customer-profiles`)
- [Update customer](https://developer.gladly.com/rest/#operation/updateCustomer) (`PATCH /api/v1/customer-profiles/{customerId}`)
- [Authentication (Basic auth)](https://developer.gladly.com/rest/#section/Authentication)
- [Generate API tokens and create webhooks](https://help.gladly.com/generate-api-tokens-and-create-webhooks)

### Changelog References

- **Changelog:** [What's New and Product Releases](https://help.gladly.com/docs/whats-new)
- **Deprecations:** [Non-backwards compatible changes](https://developer.gladly.com/rest/#section/Non-Backwards-Compatible-Changes)
- **Versions:** None found
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Gladly has no developer changelog for the REST API. The product release notes are grouped by year ([2026 release notes](https://help.gladly.com/docs/2026-release-notes)), with one page per month. No 2026 release note mentions a change to the customer-profiles API or to API token auth.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
