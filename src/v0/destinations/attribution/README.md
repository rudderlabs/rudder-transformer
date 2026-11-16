# Attribution Destination

Implementation in **JavaScript**: `src/v0/destinations/attribution/`. No v1 or CDK v2 folder.

## Overview

Forwards RudderStack events, nearly unchanged, to Attribution (attributionapp.com), a multi-touch marketing attribution tool. Attribution accepts the Segment/RudderStack event spec, so the code sends the whole message inside a `batch` array.

## Configuration

| Key        | Required | Used for                                                                                                                                        |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `writeKey` | Yes      | Attribution **Project ID** (Attribution's docs call it Project ID; found under Settings → Setup Instructions). Basic auth username. Secret key. |

## Integration Functionalities

### Implementation Language

JavaScript (v0).

### Supported Message Types

`alias`, `group`, `identify`, `page`, `screen`, `track` from all supported source types (cloud mode). The code does not filter by type; it only requires `message.type`.

### Authentication

HTTP Basic auth: `Authorization: Basic base64("{writeKey}:")` (Project ID as username, empty password). This matches Attribution's documented server-side auth for `https://track.attributionapp.com/v1/t`. No OAuth. No auth change or deprecation announced (checked 2026-11-16; Attribution has no public API changelog).

### Processor vs Router

Processor (`transformAtV1: "processor"`). No router transform.

### Batching

No. Each event is sent as `{ "batch": [event] }` to the import endpoint, one event per request.

### Intermediate Calls

None.

### Proxy Delivery

No `networkHandler.js`.

### User Deletion

No.

### OAuth Support

No.

### Validations

- `message.type` required (`Event type is required`).
- `writeKey` required (`No writeKey in config`).

### Rate Limits

NEEDS REVIEW: Attribution does not publish rate limits for its tracking API.

## General Queries

### Event Ordering

- `identify`, `alias`, `group`: ordering matters for stitching visitors to users.
- `page`, `track`: each carries `timestamp`; Attribution builds visits from timestamps, so ordering is flexible.

### Data Replay Feasibility

- **Missing data**: replay is feasible; events keep their original `timestamp`.
- **Already delivered**: Attribution ignores events with a repeated `messageId` ([track docs](https://help.attributionapp.com/docs/http-track)); the code forwards `messageId` unchanged, so replays should be deduped. NEEDS REVIEW: confirmed only for `/v1/t`, not for `/v1/import`.

### Multiplexing

No.

## Version Information

### Current Version

`https://track.attributionapp.com/v1/import` (`config.js`), i.e. tracking API **v1**.

### Version Deprecation

None announced.

### Latest Available Version

v1. NEEDS REVIEW: Attribution's public docs describe `POST /v1/t` (single track call) but do not document `/v1/import`, which this code uses. Confirm with Attribution that `/v1/import` with a `batch` array is still supported.

## Documentation Links

- [HTTP track API](https://help.attributionapp.com/docs/http-track)
- [RudderStack setup in Attribution docs](https://docs.attributionapp.com/docs/rudderstack)
- [Install the snippet (page/identify/track requirements)](https://docs.attributionapp.com/docs/install-the-snippet)

### Changelog References

- NEEDS REVIEW: Attribution publishes no changelog, release notes, deprecations page or feed for its tracking API. The only changelog found covers its MCP tools, not the tracking API: https://docs.attributionapp.com/docs/mcp-changelog
- Docs index (lists every docs page, useful for spotting new pages): https://docs.attributionapp.com/llms.txt

## RETL

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_To be populated._
