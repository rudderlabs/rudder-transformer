# Vero Destination

Implementation in **JavaScript** (`src/v0/destinations/vero`). There is no CDK v2 or v1 implementation for this destination.

## Overview

Sends users, events, aliases, tags and subscription changes to Vero through the Vero Track API (`https://api.getvero.com/api/v2`).

## Configuration

### Required Settings

- **Authentication Token** (`authToken`, secret): the Vero Track API auth token. Vero 2.0 renamed it "Tracking API Key". The code throws `ConfigurationError: Auth Token required for Authentication` when it is missing (the schema itself does not mark it required).

### Optional Settings

- **API Key** (`apiKey.web`): used only by the web device-mode SDK.
- Event filtering (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`) and consent settings are applied by rudder-server, not by this code.

## Integration Functionalities

> Implementation language: JavaScript (v0)

### Supported Message Types

- Cloud mode: `identify`, `track`, `page`, `screen`, `alias`
- Device mode (web): `identify`, `track`, `page`, `alias`

### Authentication

The auth token is sent in the **JSON request body** as `auth_token` on every request. No `Authorization` header is set. Vero's current Track API reference still documents `auth_token` (or `tracking_api_key`) as the authentication parameter and describes the Track API as stable with no breaking changes since before 2016.

Vero's newer Campaigns API and MCP server use an `Authorization: Bearer` token, and Vero marks Bearer-token auth there as deprecated in favour of OAuth ([MCP authentication](https://help.getvero.com/vero-ai/mcp-authentication)). That change does not apply to the Track API endpoints this integration calls. No sunset date announced for `auth_token`.

### Batching Support

None.

### Intermediate Calls

None. Tag updates are separate requests produced by multiplexing (see below), not lookups.

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported (no `deleteUsers.js`).

### OAuth Support

No.

### Processor vs Router

Processor destination (`transformAtV1: "processor"`). The code also exports `processRouterDest`.

### Additional Functionalities

- **Tags**: `integrations.vero.tags.add` / `integrations.vero.tags.remove` (arrays) on `identify` and `track` produce an extra `PUT /users/tags/edit` request.
- **Unsubscribe / Resubscribe**: a `track` with event name `unsubscribe` or `resubscribe` (case-insensitive) calls `/users/unsubscribe` or `/users/resubscribe` instead of tracking an event.
- **Push channel**: on `identify`, `context.device.token` + `context.os.name` are sent as a `channels` push object.

### Validations

- `message.type` is required.
- `track` requires a non-empty string `event` (`validateEventName`).
- No user identifier check in code. Vero requires `id` or `email` (identify) / `identity` (track), so events without them fail at Vero. `NEEDS REVIEW`.

### Rate Limits

Vero applies customer-specific limits per client IP over a five-minute window and returns `429` when exceeded ([Track API reference](https://help.getvero.com/track-api-reference)). No fixed number is published.

## General Queries

### Event Ordering

- **Identify, Alias, Tags, Unsubscribe/Resubscribe**: change the user profile or subscription state. Ordering is required; an out-of-order identify can overwrite newer data, an out-of-order alias can fail because the previous ID no longer exists.
- **Track / Page / Screen**: events are not timestamped by this integration (no `created_at` is sent), so Vero records them at receipt time. Ordering affects the recorded event order.

### Data Replay Feasibility

- **Missing data**: identify/track can be replayed, but replayed track events are recorded at the replay time, not the original time, and may trigger campaigns.
- **Already delivered data**: the integration sends `extras.check_id` (derived from the event timestamp) on track. `NEEDS REVIEW`: whether Vero deduplicates on `check_id`; if not, replays create duplicates and re-trigger campaigns.

### Multiplexing

- `identify` with tags: 2 requests (`/users/track` + `/users/tags/edit`).
- `track` with tags: 2 requests (`/events/track` + `/users/tags/edit`).

## Version Information

### Current Version

- **Version:** `v2`
- **Where in code:** `config.js` (`BASE_URL`: `https://api.getvero.com/api/v2`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Vero API overview](https://help.getvero.com/api-reference/track/overview)

Vero states the Track API endpoints have had no breaking changes since before 2016. Vero 2.0 (the rebuilt platform) keeps the same Track API and renames Auth Token to Tracking API Key.

### Latest Available Version

- **Version:** `v2`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Vero Track API reference](https://help.getvero.com/track-api-reference)

Vero also offers a separate Campaigns API (Bearer/OAuth, public preview) that does not replace the Track API.

## Documentation Links

### API Documentation

- [Vero Track API reference](https://help.getvero.com/track-api-reference)
- [Vero API overview (base URL, authentication)](https://help.getvero.com/api-reference/overview)
- [Identify (`/users/track`)](https://help.getvero.com/api-reference/users/identify)
- [Track (`/events/track`)](https://help.getvero.com/api-reference/events/track)
- [Alias (`/users/reidentify`)](https://help.getvero.com/api-reference/users/alias)
- [Edit tags (`/users/tags/edit`)](https://help.getvero.com/api-reference/tags/edit)
- [Unsubscribe](https://help.getvero.com/api-reference/users/unsubscribe)
- [Resubscribe](https://help.getvero.com/api-reference/users/resubscribe)
- [Legacy Vero developer docs (referenced in code)](https://developers.getvero.com/)
- [Vero MCP / Campaigns API authentication](https://help.getvero.com/vero-ai/mcp-authentication)

### Changelog References

- **Changelog:** [Vero changelog](https://feedback.getvero.com/changelog)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** [Vero changelog RSS](https://feedback.getvero.com/api/v1/changelog/feed.rss)
- **Announcements:** [Tracking API key management in Vero 2.0 (2025-02-17)](https://feedback.getvero.com/changelog/tracking-api-key-management-in-vero-20)
- **Last checked:** 2026-11-16

The [docs index](https://help.getvero.com/llms.txt) also lists new API pages as they are added.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
