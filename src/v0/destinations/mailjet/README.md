# Mailjet Destination

Implementation in **JavaScript** (`src/v0/destinations/mailjet/`)

## Overview

Adds, subscribes, unsubscribes or removes contacts on a Mailjet contact list from `identify` events, in
batches, using the v3 `managemanycontacts` endpoint.

## Configuration

Config keys from `schema.json` that the transformer reads (`destination.Config`):

| Key                        | Required | Used for                                                                  |
| -------------------------- | -------- | ------------------------------------------------------------------------- |
| `apiKey`                   | Yes      | Mailjet public API key (Basic auth username)                              |
| `apiSecret`                | Yes      | Mailjet secret key (Basic auth password). The only entry in `secretKeys`. |
| `listId`                   | Yes      | Default contact list (overridden by externalId type `listId`)             |
| `contactPropertiesMapping` | No       | `[{ from, to }]`: trait name → Mailjet contact property                   |

### Authentication

```
Authorization: Basic base64(<apiKey>:<apiSecret>)
Content-Type: application/json
```

This matches Mailjet's v3 auth: "V3s are using basic authentication with your public and secret API keys"
([Versioning](https://dev.mailjet.com/docs/email-api/email-api-overview/versioning)). Mailjet's v1 Content
API uses token auth, which this destination does not use. No deprecation of v3 Basic auth or API key pairs
has been announced.

## Integration Functionalities

### Supported Message Types

`identify` only (cloud mode).

### Implementation

- **Implemented in**: JavaScript (v0)
- **Processor vs Router**: Router destination (`transformAtV1: "router"`, `MAILJET: { routerTransform: true }`)

### Validations

- `email` is required (generic `emailOnly`).
- Only `identify` is accepted.
- `integrations.mailjet.Action` must be one of `addforce`, `addnoforce`, `remove`, `unsub`; anything else
  falls back to `addnoforce`.

### Rate Limits

Mailjet does not publish rate limit numbers; clients should back off on `429`
([Rate limits](https://dev.mailjet.com/email/reference/overview/rate-limits/)).

### Batching Support

Yes, identify. Events are grouped by `listId` + `action` and chunked into up to **5,000** contacts per
request (`MAX_BATCH_SIZE`, "decided by trial and error").

### Intermediate Calls

None.

### Proxy Delivery

No `networkHandler.js`. Not supported.

### User Deletion

No `deleteUsers.js`. Not supported. (The `remove` action removes a contact from a list, not from Mailjet.)

### OAuth Support

No.

### Additional Functionalities

- Per-event list override with `context.externalId: [{ type: "listId", id: "<listId>" }]`.
- Per-event action with `integrations.mailjet.Action`.
- Batch size is reported as the `mailjet_packing_size` gauge.

## General Queries

### Event Ordering

Required. Subscription actions (`addforce`, `unsub`, `remove`) and property updates overwrite state, so
out-of-order delivery can leave a contact in the wrong subscription state. Batches for different actions are
sent as separate requests, so order across actions is not kept within one router batch.

### Data Replay Feasibility

- **Missing data**: Can be replayed if replayed in order.
- **Already delivered data**: Replays are idempotent for the same action and properties.

### Multiplexing

No. Many events are combined into one request; one event never produces several.

## Version Information

### Current Version

- **Version:** `v3`
- **Where in code:** `config.js` (`CONFIG_CATEGORIES.IDENTIFY.endpoint`: `https://api.mailjet.com/v3/REST/contactslist/list_ID/managemanycontacts`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Versioning](https://dev.mailjet.com/docs/email-api/email-api-overview/versioning)

v3.1 exists only for the Send API (transactional email) and does not replace the contacts endpoints.

### Latest Available Version

- **Version:** `v3`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Versioning](https://dev.mailjet.com/docs/email-api/email-api-overview/versioning)

v3 is the latest version of the contacts REST API. (Send API v3.1 and Content API v1 cover other features.)

## Documentation Links

### API Documentation

- [Versioning](https://dev.mailjet.com/docs/email-api/email-api-overview/versioning)
- [About the Mailjet API](https://dev.mailjet.com/docs/email-api/email-api-overview/about-mailjet-api)
- [Authentication](https://dev.mailjet.com/docs/email-api/email-api-overview/authentication)
- [Contact management guide](https://dev.mailjet.com/email/guides/contact-management/)
- [Bulk contact management reference](https://dev.mailjet.com/email/reference/contacts/bulk-contact-management/)
- [Rate limits](https://dev.mailjet.com/email/reference/overview/rate-limits/)

### Changelog References

- **Changelog:** [Mailjet product releases](https://www.mailjet.com/releases/) (blocks automated requests)
- **Deprecations:** None found
- **Versions:** [Versioning](https://dev.mailjet.com/docs/email-api/email-api-overview/versioning)
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Mailjet has no developer API changelog (`dev.mailjet.com/changelog` returns 404). The releases page covers product features.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
