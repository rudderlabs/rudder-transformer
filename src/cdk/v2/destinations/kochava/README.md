# Kochava Destination

Live implementation in **CDK v2**: `src/cdk/v2/destinations/kochava/` (`procWorkflow.yaml`, `config.js`). `cdkV2Enabled: true` in `db-config.json` and `KOCHAVA: { cdkV2: true }` in `src/features.ts`, so CDK v2 handles all traffic.

`src/v0/destinations/kochava/` holds the older JavaScript transform (`transform.js`, `data/KochavaGenericEvent.json`) with the same logic. It is not used while `cdkV2Enabled` is true.

## Overview

Sends `track` and `screen` events to Kochava as server-to-server post-install events (`action: "event"`).

## Configuration

| Key                                                              | Required | Used for                                                                                              |
| ---------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `apiKey`                                                         | Yes      | Kochava **App GUID**, sent as `kochava_app_id` in the body. Not a secret key in `db-config.json`.     |
| `blacklistedEvents`, `whitelistedEvents`, `eventFilteringOption` | No       | Event filtering. Not read by the transformer; applied before it (device-mode SDKs and rudder-server). |

## Integration Functionalities

### Implementation Language

CDK v2 (YAML workflow).

### Supported Message Types

| Mode                       | Message types     |
| -------------------------- | ----------------- |
| Cloud (all source types)   | `screen`, `track` |
| Device mode (android, ios) | `screen`, `track` |

### Authentication

None in headers. Kochava identifies the app by `kochava_app_id` (App GUID) in the JSON body. No API key, no OAuth. Kochava's post-install setup page mentions no auth change or deprecation (page updated September 29, 2026).

### Processor vs Router

Processor (`transformAtV1: "processor"`).

### Batching

No. Kochava recommends one event per S2S payload, under 2 MB.

### Intermediate Calls

None.

### Proxy Delivery

No.

### User Deletion

No.

### OAuth Support

No.

### Validations

- `message.type` required and must be `track` or `screen`.
- NEEDS REVIEW: `.message.context.os.name.toLowerCase()` is called without a guard; events without `context.os.name` (for example from server sources) may fail at runtime.

### Rate Limits

NEEDS REVIEW: Kochava does not publish rate limits for the S2S post-install endpoint.

## General Queries

### Event Ordering

Not required. Each event carries `usertime` (event timestamp in ms).

### Data Replay Feasibility

- **Missing data**: feasible; `usertime` keeps the original time.
- **Already delivered**: replays create duplicate events. NEEDS REVIEW: no documented dedupe key on post-install events.

### Multiplexing

No.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `procWorkflow.yaml` (`response.endpoint`, `https://control.kochava.com/track/json`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Post-Install Event Setup](https://support.kochava.com/server-to-server-integration/post-install-event-setup/)

Kochava's docs still show this endpoint over `http://`; the code uses `https://`.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Post-Install Event Setup](https://support.kochava.com/server-to-server-integration/post-install-event-setup/)

## Documentation Links

- [Post-Install Event Setup](https://support.kochava.com/server-to-server-integration/post-install-event-setup/)
- [Server-to-Server Integration](https://support.kochava.com/server-to-server-integration/)

### Changelog References

- **Changelog:** None found
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Kochava publishes no public changelog, release notes, deprecations page or feed for the S2S API. `https://support.kochava.com/release-notes/` returns 404 and `https://support.kochava.com/feed/` has no items. Watch the [support site](https://support.kochava.com/).

## RETL

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_To be populated._
