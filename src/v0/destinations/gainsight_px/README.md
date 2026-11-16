# Gainsight PX Destination

Implementation in **JavaScript**: `src/v0/destinations/gainsight_px/`. No v1 or CDK v2 folder. `GAINSIGHT_PX_AUDIENCE` and `GAINSIGHT` (CS) are separate destinations.

## Overview

Sends `identify` (user create/update), `group` (account create/update plus user-account link) and `track` (custom events) to the Gainsight PX REST API v1.

## Configuration

| Key                   | Required | Used for                                                                                                     |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `apiKey`              | Yes      | PX REST API key, sent as `X-APTRINSIC-API-KEY`. Secret key.                                                  |
| `productTagKey`       | Yes      | PX product key (`AP-XXXX-X`); sent as `propertyKeys` (users/accounts) and `propertyKey` (events).            |
| `dataCenter`          | No       | `US` (default), `EU`, `US2`; selects the API host. Configurable only for `web` and `warehouse` source types. |
| `userAttributeMap`    | No       | `{ from, to }` rows: trait to PX user custom attribute. Unmapped custom traits are dropped.                  |
| `accountAttributeMap` | No       | `{ from, to }` rows: group trait to PX account custom attribute. Unmapped ones are dropped.                  |
| `globalContextMap`    | No       | `{ from, to }` rows: static global context added to custom events.                                           |

## Integration Functionalities

### Implementation Language

JavaScript (v0).

### Supported Message Types

| Mode                               | Message types                |
| ---------------------------------- | ---------------------------- |
| Cloud (all supported source types) | `identify`, `track`, `group` |
| Device mode (web)                  | `identify`, `track`, `group` |

### Authentication

Static API key in the `X-APTRINSIC-API-KEY` header on every call (lookups, account writes and delivered requests). No OAuth (`db-config.json` has no `auth` block). The PX REST API key is separate from the product tag key. No auth change or deprecation found in the PX API changelog (checked 2026-11-16).

### Processor vs Router

Router (`transformAtV1: "router"`, `routerTransform: true`). `processRouterDest` is `simpleProcessRouterDest`.

### Batching

No.

### Intermediate Calls

| Event                                                           | Call                                                        | Why                                        |
| --------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------ |
| `identify`                                                      | `GET /users/{userId}`                                       | Decide POST (create) vs PUT (update).      |
| `group` (default)                                               | `GET /users/{userId}`                                       | Abort if the user does not exist.          |
| `group` (default)                                               | `GET /accounts/{groupId}`                                   | Decide create vs update.                   |
| `group` (default)                                               | `PUT /accounts/{groupId}` or `POST /accounts`               | Write the account before linking the user. |
| `group` with `integrations.gainsight_px.limitAPIForGroup: true` | `PUT /accounts/{groupId}`, then `POST /accounts` on failure | Fewer calls. See NEEDS REVIEW below.       |

Account writes happen during transformation and are not retried by the delivery path.

### Proxy Delivery

No `networkHandler.js`.

### User Deletion

No `deleteUsers.js`.

### OAuth Support

No.

### Validations

- `apiKey` and `productTagKey` required (`ConfigurationError`).
- `identify`, `group`: `userId` required (`getFieldValueFromMessage(message, 'userId')`, which falls back to `anonymousId`).
- `group`: `groupId` required; default flow aborts if the user does not exist in PX.
- Message types other than `identify`/`track`/`group` are rejected.

### Rate Limits

PX REST API: about 200 requests per second and 1 million requests per day ([PX API docs](https://px-apidocs.gainsight.com/)). A `group` event can use up to 4 calls.

## General Queries

### Event Ordering

- `identify`, `group`: required (profile and account overwrites; `group` needs the user from `identify` first).
- `track`: carries `date` from the event timestamp; ordering is flexible.

### Data Replay Feasibility

- **Missing data**: `track` replay is fine. `identify`/`group` replay is fine if replayed in order.
- **Already delivered**: `identify`/`group` are upserts and safe. `track` replay creates duplicate custom events (NEEDS REVIEW: no documented dedupe key in the PX custom events API).

### Multiplexing

No delivered multiplexing. `group` writes the account during transformation and delivers only the user-account link (`PUT /users/{userId}` with `{ accountId }`).

## Version Information

### Current Version

Gainsight PX REST API **v1** (`https://api.aptrinsic.com/v1`, `https://api-eu.aptrinsic.com/v1`, `https://api-us2.aptrinsic.com/v1`, in `config.js`). PX API docs are versioned separately (documentation version `0.1.6`).

### Version Deprecation

No deprecation announced for v1. The PX API changelog lists only additive changes in 2026 (for example `GET/PUT /v1/content-library` on Oct 6, 2026).

### Latest Available Version

v1.

## Documentation Links

- [PX REST API reference](https://px-apidocs.gainsight.com/)
- [Work with the Gainsight PX REST API](https://support.gainsight.com/PX/API/Work_with_the_Gainsight_PX_REST_API)

### Changelog References

- API changelog: https://px-apidocs.gainsight.com/changes
- API changelog RSS feed: https://px-apidocs.gainsight.com/changes.rss
- Product release notes: https://support.gainsight.com/PX/Release_Notes
- No separate deprecations or API lifecycle page found.

## RETL

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_To be populated._
