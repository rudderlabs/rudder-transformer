# Candu Destination

Implementation in **JavaScript** (`src/v0/destinations/candu/`). There is no CDK v2 or v1 implementation.

## Configuration

### Required Settings

- **API Key** (`apiKey`): Candu workspace API key. Marked as a secret key in `db-config.json`. An empty or whitespace-only key raises a configuration error.

## Integration Functionalities

> Candu supports **Cloud mode** only.

### Supported Message Types

- Identify, Track.

### Implementation

- **Implemented in**: JavaScript (v0)
- **Processor vs Router**: Router (`transformAtV1: "router"`; `CANDU: { routerTransform: true }` in `src/features.ts`). `processRouterDest` uses `simpleProcessRouterDest`, so each event is still transformed and sent on its own.

### Authentication

- The code sends `Authorization: Basic <base64(apiKey)>`. The API key alone is base64-encoded, with no `username:password` colon.
- Candu's current REST API docs describe `Authorization: Bearer <API_KEY>` for `https://api.candu.ai/api/eventWebhook` ([Candu REST API](https://developers.candu.ai/docs/get-data-into-candu-via-the-rest-api)).
- **NEEDS REVIEW**: Confirm with Candu that the Basic scheme used here is still accepted, or move to Bearer. No dated announcement of an auth change was found.

### Batching Support

- **Supported**: No. Candu's endpoint accepts an array of events, but the integration sends one event per request.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No.

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: No.

### Additional Functionalities

- Adds `context: { source: "RudderStack" }` to every payload.
- Casts `userId` to a string.

### Validations

- `apiKey` must be non-empty after trimming.
- `message.type` must be present and be identify or track (case-insensitive).
- Track: `event` is required (mapping `required: true`).
- Candu's docs say identify needs `traits` and `userId`, and track needs `userId` and `event`. The integration does not enforce `userId`, so anonymous-only events reach Candu and may be rejected there.

### Rate Limits

- Not documented by Candu. **NEEDS REVIEW**.

## General Queries

### Event Ordering

- **Identify**: Updates user traits used for segmentation. Ordering matters; an older identify delivered later overwrites newer traits.
- **Track**: Carries `timestamp`, so ordering is less important.

### Data Replay Feasibility

- **Missing data**: Track can be replayed (timestamp preserved). Identify replays are safe only if replayed in order.
- **Already delivered data**: Identify replays are idempotent (traits overwrite). Track replays will likely duplicate; `messageId` is sent but Candu does not document dedupe on it. **NEEDS REVIEW**.

### Multiplexing

- **No**.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `config.js` (`endpoint`: `https://api.candu.ai/api/eventWebhook`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Candu REST API (eventWebhook)](https://developers.candu.ai/docs/get-data-into-candu-via-the-rest-api)

Candu does not publish an API versioning policy.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Candu REST API (eventWebhook)](https://developers.candu.ai/docs/get-data-into-candu-via-the-rest-api)

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Candu REST API (eventWebhook endpoint and API key auth)](https://developers.candu.ai/docs/get-data-into-candu-via-the-rest-api)
- [Get user data into Candu](https://docs.candu.ai/en/articles/5917572-get-user-data-into-candu)

### Changelog References

- **Changelog:** [Candu changelog](https://www.candu.ai/changelog) (product changelog; not API-specific)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

## FAQ

> This section will be populated with frequently asked questions as they arise from usage and support requests.
