# Zapier Destination

Implementation in **CDK v2**: `src/cdk/v2/destinations/zapier/` (`procWorkflow.yaml`, `utils.js`). `cdkV2Enabled: true` in `db-config.json` and `ZAPIER: { cdkV2: true }` in `src/features.ts`. No v0 or v1 folder.

## Overview

Posts the raw RudderStack event to one or more Zapier "Catch Hook" URLs (Webhooks by Zapier trigger). Events can be routed to different Zaps by event or page/screen name.

## Configuration

| Key                     | Required | Used for                                                                                                    |
| ----------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `zapUrl`                | Yes      | Default webhook URL. Secret key (the URL itself is the credential). `ngrok.io` URLs are rejected by schema. |
| `trackEventsToZap`      | No       | `{ from: eventName, to: zapUrl }` rows. Matching is case-insensitive; one event can map to several URLs.    |
| `pageScreenEventsToZap` | No       | `{ from: pageOrScreenName, to: zapUrl }` rows, matched against `message.name`.                              |

## Integration Functionalities

### Implementation Language

CDK v2 (YAML workflow).

### Supported Message Types

`track`, `page`, `screen` from all supported source types (cloud mode). Other types fail with `message type ... is not supported`.

### Authentication

None. The Catch Hook URL contains the account and hook IDs and acts as the secret. No headers other than `content-type: application/json`. No auth change announced by Zapier for Catch Hooks (checked 2026-11-16).

### Processor vs Router

Processor (`transformAtV1: "processor"`).

### Batching

No.

### Intermediate Calls

None.

### Proxy Delivery

No.

### User Deletion

No.

### OAuth Support

No.

### Validations

- `message.type` required and must be `track`, `page` or `screen`.

### Rate Limits

[Webhooks by Zapier rate limits](https://help.zapier.com/hc/en-us/articles/29972220283789): 20,000 requests every 5 minutes per user; 1,000 requests every 5 minutes per Zap on legacy webhook routes (URLs without a Zapier user ID). Over the limit Zapier returns 429. Payload limit 10 MB for Catch Hook triggers. A Zap that is off or deleted returns 404 ([Trigger Zaps from webhooks](https://help.zapier.com/hc/en-us/articles/8496288690317)).

## General Queries

### Event Ordering

Not required by Zapier; each webhook starts an independent Zap run. Ordering matters only if the customer's Zap writes state downstream.

### Data Replay Feasibility

- **Missing data**: feasible.
- **Already delivered**: replays trigger the Zap again; Zapier does not dedupe Catch Hook payloads.

### Multiplexing

Yes. When an event or page/screen name maps to several URLs, one response per URL is produced (`buildResponseList`). A mapped event goes only to its mapped URLs, not to `zapUrl`.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `src/cdk/v2/destinations/zapier/procWorkflow.yaml` (`prepareContext` step, `zapUrl`; `trackEndpoint` and `endpointForOthers` steps for per-event URLs)

Catch Hook URLs (`https://hooks.zapier.com/hooks/catch/{userId}/{hookId}/`) are supplied by the customer.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Trigger Zaps from webhooks](https://help.zapier.com/hc/en-us/articles/8496288690317)

Zapier distinguishes legacy webhook routes (without user ID) only by a lower rate limit ([rate limits](https://help.zapier.com/hc/en-us/articles/29972220283789)).

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Trigger Zaps from webhooks](https://help.zapier.com/hc/en-us/articles/8496288690317)

## Documentation Links

- [Trigger Zaps from webhooks](https://help.zapier.com/hc/en-us/articles/8496288690317)
- [Webhooks by Zapier rate limits](https://help.zapier.com/hc/en-us/articles/29972220283789)

### Changelog References

- **Changelog:** [Zapier changelog](https://zapier.com/changelog); [Product updates (Zapier help)](https://help.zapier.com/hc/en-us/categories/13951101412877-Product-updates)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** [Updated webhook behaviour: Catch Hook URLs return 404 when the Zap is off or deleted](https://help.zapier.com/hc/en-us/articles/24290475355277-Maximize-efficiency-with-updated-webhook-behaviour)
- **Last checked:** 2026-11-16

## RETL

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_To be populated._
