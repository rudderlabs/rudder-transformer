# Rakuten Advertising Destination

Implementation in **CDK v2** (`cdkV2Enabled: true` in `db-config.json`; `RAKUTEN: { cdkV2: true, transformerProxy: true }` in `src/features.ts`). Transform code: `src/cdk/v2/destinations/rakuten/` (`procWorkflow.yaml`, `utils.js`, `config.js`).

`src/v0/destinations/rakuten/` holds only `networkHandler.js` (and its test), the proxy delivery handler that parses Rakuten's XML response. There is no v0 transform.

## Overview

Sends order conversions (`track` calls with a `products` array) to the Rakuten Advertising event tracking endpoint (`https://track.linksynergy.com/ep`) as a server-side pixel request. Order and line-item data go in query parameters.

## Configuration

| Config key | UI label    | Used for                                                                       |
| ---------- | ----------- | ------------------------------------------------------------------------------ |
| `mid`      | Merchant ID | `mid` query parameter. Required (`schema.json` and workflow). In `secretKeys`. |

## Integration Functionalities

### Supported Message Types

From `db-config.json`: `cloud: ["track"]`. Any other type fails with `message type <type> is not supported`.

### Authentication

There is no credential. The request carries only the merchant ID (`mid`) as a query parameter, along with `xml=1` and `source=rudderstack`. Headers are `accept: application/json` and `content-type: application/json`.

Rakuten returns `<error>Access denied</error>` (HTTP 200) when pixel tracking is not enabled for the `mid`. Rakuten's server-to-server documentation is not public (access is through the Rakuten account team), so whether this unauthenticated endpoint is planned for retirement could not be checked. Rakuten's other APIs (for example the Advertiser Transaction / Postback APIs on `api.linksynergy.com`) use bearer tokens. NEEDS REVIEW: confirm with Rakuten that `track.linksynergy.com/ep` with `mid` only is still supported.

### Validations

- `mid` required (`ConfigurationError`).
- Message type must be `track`.
- `properties.products` must be a non-empty array.
- Every product needs `sku`, `quantity`, `name`, and either `amount` or `price`.
- `ord` (order ID) and `land` (landing time) are required.

### Rate Limits

Not documented publicly. NEEDS REVIEW.

### Batching Support

**No.** One GET per order.

### Intermediate Calls

None.

### Proxy Delivery

**Yes.** `src/v0/destinations/rakuten/networkHandler.js` (`transformerProxy: true`).

`responseHandler` logic:

| Rakuten response                                            | Result                                                              |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| HTTP 400                                                    | Aborted (400), "invalid Marketing Id"                               |
| 200 with `<error>...</error>` (for example "Access denied") | Aborted (400); message suggests enabling pixel tracking for the mid |
| 200 with `<bad>N</bad>`, N > 0                              | Aborted (400) with the bad-record count                             |
| Any other non-200                                           | Error with that status (5xx/429 retried)                            |
| 200, no errors, `<bad>0</bad>`                              | Success                                                             |

Partial batch handling: not applicable (no batching).

### User Deletion

**No.**

### OAuth Support

**No.**

### Processor vs Router

**Processor** (`transformAtV1: "processor"`).

## General Queries

### Event Ordering

Not required. Each order is independent and carries its own `date` and `land` timestamps.

### Data Replay Feasibility

- **Missing data**: Feasible; the original order and landing times are sent. Rakuten may reject conversions outside the attribution window. NEEDS REVIEW.
- **Already delivered**: Rakuten keys transactions by order ID (`ord`). Whether a repeated `ord` is deduplicated or rejected is not publicly documented. NEEDS REVIEW.

### Multiplexing

**No.**

## Known Issues

- `calculateProductAmount` treats `amount: 0` or `price: 0` as missing (falsy checks). A free item with `price: 0` and no `amount` throws "Either amount or price is required". NEEDS REVIEW.
- The 400 error message says "invalid Marketing Id", but `mid` is the Merchant ID. Cosmetic.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `procWorkflow.yaml` (`response.endpoint`)

Endpoint: `GET https://track.linksynergy.com/ep`.

### Version Deprecation

- **Status:** Unknown
- **Sunset date:** None announced
- **Source:** [Rakuten Advertising developer portal](https://developers.rakutenadvertising.com/)

Rakuten shares the event pixel spec privately; the public developer portal does not document it. No public versioning or deprecation information found.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Rakuten Advertising developer portal](https://developers.rakutenadvertising.com/)

Rakuten also offers token-based server-to-server APIs (Postback API on `api.linksynergy.com`) that are documented only to customers. NEEDS REVIEW.

## Documentation Links

- [Rakuten Advertising developer portal](https://developers.rakutenadvertising.com/)
- [Rakuten Advertising developer portal: access tokens](https://developers.rakutenadvertising.com/guides/access_tokens)

The `/ep` pixel takes no auth header; the access tokens guide applies to Rakuten's token-based APIs.

### Changelog References

- **Changelog:** None found
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

No public changelog, release notes, deprecations page or feed found for Rakuten Advertising APIs. The developer portal is a single-page app that returns `200` for any path.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
