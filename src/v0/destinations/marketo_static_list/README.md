# Marketo Static List Destination

Implementation in **JavaScript**: `src/v0/destinations/marketo_static_list/`. No v1 or CDK v2 folder exists.

## Overview

Adds and removes Marketo leads (by Marketo lead ID) to and from a static list, using the Marketo Engage REST API List Membership endpoints. Used by audience (`audiencelist`) and VDM v2 (`record`) syncs.

Shares authentication and response handling with the Marketo destination: `getAuthToken` and `marketoResponseHandler` come from `../marketo/util.js`. `transformV2.js` also imports `formatConfig` from `../marketo/config.js`.

## Configuration

| Key            | Required | Used for                                                                                     |
| -------------- | -------- | -------------------------------------------------------------------------------------------- |
| `accountId`    | Yes      | Munchkin account ID; builds `https://{accountId}.mktorest.com`.                              |
| `clientId`     | Yes      | Custom service client ID for the identity endpoint.                                          |
| `clientSecret` | Yes      | Custom service client secret for the identity endpoint.                                      |
| `staticListId` | No       | Default list ID. Overridden per event by `context.externalId` of type `marketoStaticListId`. |

All three credentials are `secretKeys` in `db-config.json`.

## Integration Functionalities

### Implementation Language

JavaScript (v0). `transform.js` handles `audiencelist`; `transformV2.js` handles `record`.

### Supported Message Types

| Source types              | Message types            |
| ------------------------- | ------------------------ |
| cloud, warehouse, shopify | `record`, `audiencelist` |

### Authentication

Same mechanism as [Marketo](../marketo/README.md#authentication):

- Token: `GET https://{accountId}.mktorest.com/identity/oauth/token?client_id=...&client_secret=...&grant_type=client_credentials`.
- Cached per destination ID in a separate cache `MARKETO_STATIC_LIST_AUTH` with TTL = `expires_in`.
- List calls send `Authorization: Bearer {token}`. The token is never sent as an `access_token` query parameter.
- On `601`/`602` during proxy delivery the cached token is evicted and the request is retried.

**Compliance with Adobe's header-only change** (`access_token` query parameter removed **August 31, 2026**): compliant. The identity call with credentials in the query string is still Adobe's documented form; no deprecation announced. Details, dates and URLs: [Marketo README](../marketo/README.md#authentication).

### Processor vs Router

Router (`transformAtV1: "router"`). `processRouterDest` checks the token once, groups by message type, then:

- `record`: grouped by list ID, then by action, and batched (`transformV2.processRecordInputs`).
- `audiencelist`: `simpleProcessRouterDest` per event.

### Batching

Yes. Lead IDs are chunked by `MAX_LEAD_IDS_SIZE = 300` (Marketo's maximum per call).

- `record`: many events with the same list ID and action are combined into one or more requests (`batched: true`).
- `audiencelist`: one event's `listData.add`/`listData.remove` IDs are chunked; one event can produce several requests.

### Intermediate Calls

Only the token request.

### Proxy Delivery

Yes, `networkHandler.js` (`transformerProxy: true`). It reuses `marketoResponseHandler`. Per-lead results with status other than `added`/`removed` (for example `skipped` with reason `1004`) fail the whole request with 400, or 429/500 by reason code. There is no partial-batch handling: a batched `record` request succeeds or fails as one.

### User Deletion

No.

### OAuth Support

No RudderStack OAuth.

### Additional Functionalities

- `syncBehaviours: ["mirror"]` in `db-config.json`.
- `isAudienceSupported: true`.

### Validations

- `audiencelist`: `message.type` must be `audiencelist`; list ID must come from config or external ID (`No static listId is provided`); at least one ID in `listData.add`/`listData.remove`.
- `record`: `action` must be `insert` or `delete` and `fields.id` must be set, else that event fails with `Invalid action type or no leadIds found ...`.

### Rate Limits

Same Marketo instance limits as [Marketo](../marketo/README.md#rate-limits): 100 calls per 20 seconds, 10 concurrent, 50,000 per day. Up to 300 lead IDs per call; standard calls are limited to an 8 KB URI, and 300 IDs in the query string can approach that.

## General Queries

### Event Ordering

Required per lead: an add followed by a remove of the same lead gives a different result if reordered. Within one `audiencelist` event, removes are emitted before adds. For `record` batches, delete requests are emitted before insert requests.

### Data Replay Feasibility

- **Missing data**: replay is safe if replayed in order.
- **Already delivered**: adding a lead already in the list or removing one already absent is harmless (Marketo returns `skipped`). NEEDS REVIEW: `skipped` currently fails the request in `nestedResponseHandler`, so replays of already-applied changes may surface as errors.

### Multiplexing

Yes for `audiencelist`: one event can produce a remove request and an add request, each chunked by 300 IDs.

## Version Information

### Current Version

Marketo Engage REST API **v1**: `POST|DELETE /rest/v1/lists/{listId}/leads.json?id=...` and `/identity/oauth/token`.

### Version Deprecation

No sunset announced for REST v1. The `access_token` query parameter was removed on August 31, 2026; this code is not affected. See [Marketo README](../marketo/README.md#version-deprecation).

### Latest Available Version

v1 (only version).

## Documentation Links

- [List Membership](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/lead-database/list-membership)
- [Static Lists](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/assets/static-lists)
- [Authentication](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/authentication)
- [REST API limits](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/rest-api)
- [Error codes](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/error-codes)

### Changelog References

- Release notes (current): https://experienceleague.adobe.com/en/docs/marketo/using/release-notes/current
- Release notes, August 2026: https://experienceleague.adobe.com/en/docs/marketo/using/release-notes/previous-releases/2026/release-notes-aug-26
- Deprecation announcement (Sep 16, 2025): https://experienceleaguecommunities.adobe.com/adobe-marketo-engage-27/updates-to-deprecation-of-soap-api-and-access-token-in-query-parameter-for-rest-api-147711
- NEEDS REVIEW: no Marketo developer changelog page or RSS/Atom feed exists. See the full list in the [Marketo README](../marketo/README.md#changelog-references).

## RETL

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_To be populated._
