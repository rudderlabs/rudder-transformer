# Blueshift Destination

Implementation in **JavaScript** (`src/v0/destinations/blueshift`). There is no CDK v2 or v1 implementation.

## Overview

Sends users (`identify`) to the Blueshift Customers API and events (`track`, `group`) to the Blueshift Event API. Blueshift was acquired by BlueConic in 2026; the Blueshift help center now redirects to a BlueConic-hosted site, while the developer portal and API hosts are unchanged.

## Configuration

### Required Settings

- **Event API Key** (`eventApiKey`, secret): used for `track` and `group`.
- **Users API Key** (`usersApiKey`, secret): used for `identify`.
- **Data Center** (`dataCenter`): `standard` (default) → `https://api.getblueshift.com`, `eu` → `https://api.eu.getblueshift.com`.

These three keys are defined in `ui-config.json` and `db-config.json` but not in `schema.json`, which only defines consent fields. `NEEDS REVIEW`: add them to the schema in rudder-integrations-config.

## Integration Functionalities

> Implementation language: JavaScript (v0)

### Supported Message Types

Cloud mode only: `identify`, `track`, `group`.

### Authentication

HTTP Basic auth: `Authorization: Basic base64(<apiKey>)` with `Content-Type: application/json`. `track`/`group` use `eventApiKey`; `identify` uses `usersApiKey`.

Blueshift documents Basic auth with the API key as username and an empty password, i.e. `base64("<apiKey>:")` ([Send an event](https://developer.blueshift.com/reference-link/post_api-v1-event)). The code encodes the key **without** the trailing colon. `NEEDS REVIEW`: this works in production today, but it relies on Blueshift's lenient parsing.

No Blueshift announcement of an auth change or API key deprecation was found. The BlueConic acquisition has not (yet) changed the Blueshift API; BlueConic's own API moved to OAuth-based REST API v2 and retired v1 on July 1 2024, which is unrelated to Blueshift's API but worth watching.

### Batching Support

None. Blueshift has a bulk events endpoint (`/api/v1/bulkevents`) that this integration does not use.

### Intermediate Calls

None.

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported (no `deleteUsers.js`).

### OAuth Support

No.

### Processor vs Router

Router destination (`transformAtV1: "router"`, `simpleProcessRouterDest`).

### Additional Functionalities

- Ecommerce event names are mapped to Blueshift standard events (`Product Viewed` → `view`, `Order Completed` → `purchase`, etc.). See [businesslogic.md](docs/businesslogic.md).
- `group` is sent as an `identify` event to the Event API with `group_id`.

### Validations

- `track`: `event` required; after mapping and replacing spaces with `_`, the event name must not contain `.`, any digit, or exceed 64 characters.
- `identify`: `userId` (incl. `anonymousId`) or email required.
- `group`: `groupId` and `userId` (incl. `anonymousId`) required.
- Missing API key for the message type → `ConfigurationError`.

### Rate Limits

`NEEDS REVIEW`: Blueshift does not publish per-endpoint limits in the pages we could reach. The developer portal reference pages are the place to confirm.

## General Queries

### Event Ordering

- **Identify**: updates the customer profile; ordering required.
- **Track / Group**: no `timestamp` is mapped, so Blueshift records events at receipt time (unless the user passes `timestamp` inside `properties`, which is copied through). Order affects recorded order and campaign triggers.

### Data Replay Feasibility

- **Missing data**: can be replayed, but events land at replay time and may trigger campaigns.
- **Already delivered data**: `event_uuid` (from `messageId`) is sent. `NEEDS REVIEW`: whether Blueshift deduplicates on `event_uuid`; if it does, replaying already delivered events is safe.

### Multiplexing

None.

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `transform.js` (`${baseURL}/api/v1/event`, `${baseURL}/api/v1/customers`); hosts in `config.js` (`BASE_URL`, `BASE_URL_EU`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Send an event](https://developer.blueshift.com/reference-link/post_api-v1-event)

### Latest Available Version

- **Version:** `v1`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Blueshift developer portal](https://developer.blueshift.com/)

v1 is the latest version of the Event and Customers APIs.

## Documentation Links

### API Documentation

- [Blueshift developer portal](https://developer.blueshift.com/)
- [Send an event](https://developer.blueshift.com/reference-link/post_api-v1-event)
- [Create or update a customer](https://developer.blueshift.com/reference-link/post_api-v1-customers)
- [Use API keys (authentication)](https://developer.blueshift.com/docs/authentication-of-api-requests)
- [API keys (Blueshift support)](https://support-blueshift.blueconic.com/en/articles/809452-api-keys)
- [BlueConic acquires Blueshift (MarTech)](https://martech.org/blueconic-acquires-blueshift-as-cdps-move-from-data-to-action/)

### Changelog References

- **Changelog:** [Blueshift release notes (hosted by BlueConic)](https://support-blueshift.blueconic.com/en/collections/1458023-release-notes)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Blueshift has no developer API changelog. The release notes cover Launchpad product releases. Monthly product updates are also posted on blueshift.com under `/product-update/`, which blocks automated access.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
