# Woopra Destination

Implementation in **JavaScript** (`src/v0/destinations/woopra`). There is no CDK v2 or v1 implementation for this destination.

## Overview

Sends `identify`, `track` and `page` events to Woopra (now part of Appier, branded "Appier AIRIS") through the Woopra HTTP Tracking API. Every event becomes a single `GET` request with all data in query parameters.

## Configuration

### Required Settings

- **Project Name** (`projectName`): the Woopra project domain (for example `example.com`). Sent as the `Project` query parameter. Can be overridden per event with `integrations.woopra.projectName`.

### Optional Settings

The remaining config keys (`cookieName`, `cookiePath`, `cookieDomain`, `clickTracking`, `downloadTracking`, `hideCampaign`, `idleTimeout`, `ignoreQueryUrl`, `outgoingIgnoreSubdomain`, `outgoingTracking`, `useNativeSDK`) are used only by the web device-mode SDK. The cloud-mode transformer reads only `projectName`. Event filtering (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`) and consent settings are applied by rudder-server, not by this code.

## Integration Functionalities

> Implementation language: JavaScript (v0)

### Supported Message Types

- Cloud mode: `identify`, `track`, `page`
- Device mode (web): `identify`, `track`, `page`

### Authentication

There is no authentication. The Woopra tracking endpoint identifies the account by the project name only (`Project` query parameter). No API key or `Authorization` header is sent. If a project has **Secure Tracking** enabled in Woopra, unsigned requests are rejected with `401`; this integration does not support secure (signed) tracking. `NEEDS REVIEW`: confirm whether customers with Secure Tracking enabled can use this destination.

No Woopra announcement of an auth change or deprecation was found.

### Batching Support

None. One request per event (router destination using `simpleProcessRouterDest`).

### Intermediate Calls

None.

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported (no `deleteUsers.js`).

### OAuth Support

No.

### Processor vs Router

Router destination (`transformAtV1: "router"`).

### Validations

- `projectName` must be set, otherwise `InstrumentationError: Project Name field can not be empty`.
- `message.type` is required; only `identify`, `track`, `page` are accepted.
- `track` requires `event`.

### Rate Limits

Woopra does not publish rate limits for the HTTP Tracking API. `NEEDS REVIEW`.

## General Queries

### Event Ordering

- **Identify**: updates visitor properties (`cv_*`). Ordering matters, an older identify can overwrite newer properties.
- **Track / Page**: each request carries a `timestamp` (epoch ms), so Woopra records the event at the original time. Ordering is less critical, but `cv_*` visitor properties are also sent on these requests and can overwrite profile values.

### Data Replay Feasibility

- **Missing data**: can be replayed. The `timestamp` parameter places events at the original time.
- **Already delivered data**: replaying creates duplicates. The integration sends no event ID that Woopra could deduplicate on.

### Multiplexing

None. One input event produces one request.

## Version Information

### Current Version

The Woopra HTTP Tracking API has no version number in its paths. The code uses `https://www.woopra.com/track/identify` and `https://www.woopra.com/track/ce` (`config.js`).

### Version Deprecation

No deprecation announced. Woopra joined Appier (product now listed as "Appier AIRIS (formerly Woopra)"); the announcement says there will be no interruption to Woopra products or services. `NEEDS REVIEW`: monitor for any Appier migration of the tracking endpoint.

### Latest Available Version

The unversioned HTTP Tracking API used here is the current one.

## Documentation Links

### API Documentation

- [Intro: HTTP Tracking API](https://docs.woopra.com/reference/intro-http-tracking)
- [Track custom event (`/track/ce`)](https://docs.woopra.com/reference/track-ce)
- [Track identify (`/track/identify`)](https://docs.woopra.com/reference/track-identify)
- [Woopra is joining Appier](https://www.woopra.com/blog/woopra-is-joining-appier)

### Changelog References

`NEEDS REVIEW`: Woopra/Appier does not publish a developer changelog, deprecations page or RSS feed for the HTTP Tracking API that we could find. The API docs above are the only reference.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
