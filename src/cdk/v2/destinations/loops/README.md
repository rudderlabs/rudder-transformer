# Loops Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/loops/procWorkflow.yaml`). `cdkV2Enabled: true` in `db-config.json` and `LOOPS: { cdkV2: true }` in `src/features.ts`. There is no v0 or v1 implementation.

## Overview

Sends `identify` (contact upsert) and `track` (event) calls to the Loops REST API v1.

## Configuration

### Required Settings

- **API Key** (`apiKey`, secret): Loops API key. Schema pattern: 32 lower-case hex characters.

Consent settings are applied by rudder-server, not by this workflow.

## Integration Functionalities

> Implementation language: CDK v2 (YAML workflow)

### Supported Message Types

Cloud mode only: `identify`, `track`.

### Authentication

`Authorization: Bearer <apiKey>` header plus `Content-Type: application/json`. This matches the Loops API docs. No auth change or deprecation has been announced in the [Loops API changelog](https://loops.so/docs/api-reference/changelog) (checked through November 2026).

### Batching Support

None. Loops has no batch endpoint for contacts or events.

### Intermediate Calls

None.

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported.

### OAuth Support

No.

### Processor vs Router

Processor destination (`transformAtV1: "processor"`).

### Validations

- `message.type` is required and must be `identify` or `track`.
- `apiKey` must be configured.
- `identify`: email (generic `emailOnly`) is required. Loops now accepts `userId` alone on Update contact (changelog, Aug 21 2025), so this check is stricter than the API.
- `track`: either email or `userId` (generic `userIdOnly`) is required, and `event` is required.

### Rate Limits

Baseline **10 requests per second per team**; `429` when exceeded, with `x-ratelimit-limit` / `x-ratelimit-remaining` headers ([API intro](https://loops.so/docs/api-reference/intro)).

## General Queries

### Event Ordering

- **Identify**: upserts the contact. Ordering matters; an older identify overwrites newer properties.
- **Track**: Loops has no event timestamp field, so events are recorded and trigger workflows at receipt time. Contact properties sent with the event also update the contact, so ordering still matters for those.

### Data Replay Feasibility

- **Missing data**: identify can be replayed. Replayed track events are recorded at replay time and can trigger workflows (sending emails) late.
- **Already delivered data**: replaying track events duplicates them and can re-trigger workflows. Loops supports an `Idempotency-Key` header on Send event (added Apr 29 2025), but this integration does not send it.

### Multiplexing

None.

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `procWorkflow.yaml` (`$.context.endpoint`: `https://app.loops.so/api/v1/contacts/update`, `https://app.loops.so/api/v1/events/send`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Loops API changelog](https://loops.so/docs/api-reference/changelog)

The 2025-09-11 changelog entry deprecated the top-level `error` and `path` keys in error responses (replaced by `success` and `message`). This affects error parsing only, and this integration does not parse responses.

### Latest Available Version

- **Version:** `v1`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [API introduction](https://loops.so/docs/api-reference/intro)

v1 is the only published version.

## Documentation Links

### API Documentation

- [API introduction (auth, rate limits)](https://loops.so/docs/api-reference/intro)
- [Update contact](https://loops.so/docs/api-reference/update-contact)
- [Send event](https://loops.so/docs/api-reference/send-event)

### Changelog References

- **Changelog:** [Loops API changelog](https://loops.so/docs/api-reference/changelog); [Loops product changelog](https://loops.so/changelog)
- **Deprecations:** None found
- **Versions:** None found
- **Feed:** [API changelog RSS](https://loops.so/docs/api-reference/changelog/rss.xml)
- **Announcements:** None found
- **Last checked:** 2026-11-16

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
