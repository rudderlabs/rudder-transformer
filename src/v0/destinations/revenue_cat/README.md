# RevenueCat Destination

Implementation in **JavaScript** (`src/v0/destinations/revenue_cat`). There is no CDK v2 or v1 implementation.

## Overview

Sends subscriber attributes (`identify`) and purchase receipts (`track`) to the RevenueCat REST API v1.

## Configuration

### Required Settings

- **Public API Key** (`apiKey`, secret): RevenueCat v1 API key.
- **X-Platform** (`xPlatform`): one of `ios`, `android`, `amazon`, `macos`, `stripe`, `uikitformac` (default `stripe`). Sent as the `X-Platform` header on `track`. Required for `track` only.

Consent settings are applied by rudder-server, not by this code.

## Integration Functionalities

> Implementation language: JavaScript (v0)

### Supported Message Types

Cloud mode only: `identify`, `track`.

### Authentication

Header `Authorization: Basic <apiKey>`, where `<apiKey>` is the **raw key**. The code calls `Buffer.from(Config.apiKey)` without `.toString('base64')`, so interpolating the Buffer yields the plain key. Integration tests (`test/integrations/destinations/revenue_cat/maskedSecrets.ts`) assert this same raw form.

RevenueCat's v1 docs document `Authorization: Bearer <API key>`, and RevenueCat staff note that v1 also accepts the bare key as the header value. A `Basic` scheme with an un-encoded key is neither. `NEEDS REVIEW`: it evidently works today, but it relies on RevenueCat ignoring the scheme; switching to `Bearer` would match the docs.

**Auth change to watch**: REST API v2 requires `Authorization: Bearer <secret key>` and **v1 keys do not work with v2**; new v2 secret keys with explicit permissions must be created ([API v2](https://www.revenuecat.com/docs/api-v2)). RevenueCat has not announced a v1 sunset date; staff describe v2 as an expansion of v1 rather than its deprecation, and v2 does not yet cover all v1 use cases.

### Batching Support

None.

### Intermediate Calls

`identify` first emits `GET /v1/subscribers/{app_user_id}`. In RevenueCat v1 this "get or create" call creates the subscriber if it does not exist, so the following attributes call does not fail on a new user. It is returned as a separate request (multiplexed), not executed during transformation.

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported (no `deleteUsers.js`).

### OAuth Support

No.

### Processor vs Router

Processor destination (`transformAtV1: "processor"`). No `processRouterDest` is exported.

### Validations

- `message.type` and `apiKey` required.
- `identify`: `userId` (generic, falls back to `anonymousId`) required as `app_user_id`.
- `track`: `xPlatform` required; `userId` (generic) and `properties.fetch_token` required.

### Rate Limits

`NEEDS REVIEW`: the v1 reference page does not state rate limits.

## General Queries

### Event Ordering

- **Identify**: overwrites subscriber attributes; ordering required.
- **Track**: posts a store receipt (`fetch_token`). RevenueCat validates the receipt with the store, so order matters little; the receipt itself is the source of truth.

### Data Replay Feasibility

- **Missing data**: can be replayed. Receipts are validated against the store regardless of when they arrive.
- **Already delivered data**: replaying receipts is safe in practice; RevenueCat identifies the purchase by the store token, so the same receipt does not create a new transaction. Replaying identify re-sets the same attributes. `NEEDS REVIEW`: confirm receipt idempotency with RevenueCat docs.

### Multiplexing

- `identify`: 2 requests (`GET /subscribers/{id}` and `POST /subscribers/{id}/attributes`).
- `track` with `properties.products` array: one `POST /receipts` per product.

## Version Information

### Current Version

RevenueCat REST API **v1** (`https://api.revenuecat.com/v1`, `config.js`).

### Version Deprecation

No v1 sunset date announced. v2 is under development and does not yet cover all v1 use cases; RevenueCat says to use v1 for those.

### Latest Available Version

REST API **v2** (`https://api.revenuecat.com/v2`). Breaking differences: Bearer secret keys with scoped permissions (v1 keys rejected), different resource model and ID formats. `NEEDS REVIEW`: whether v2 has equivalents for `POST /receipts` and subscriber attributes before any migration.

## Documentation Links

### API Documentation

- [REST API v1](https://www.revenuecat.com/docs/api-v1)
- [REST API v2](https://www.revenuecat.com/docs/api-v2)
- [API reference index](https://www.revenuecat.com/docs/api-reference/llms.txt)
- [Community: ETA for v2 covering all endpoints](https://community.revenuecat.com/general-questions-7/is-there-any-eta-for-to-complete-v2-version-upgrade-for-all-the-endpoints-3744)

### Changelog References

- [RevenueCat Announcements (community)](https://community.revenuecat.com/revenuecat-announcements-2)
- [REST API v2 page (lists v1 → v2 differences)](https://www.revenuecat.com/docs/api-v2)
- `NEEDS REVIEW`: RevenueCat has no dedicated REST API changelog, deprecations page or RSS feed that we could find.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
