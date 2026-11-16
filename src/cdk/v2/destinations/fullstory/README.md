# Fullstory Destination

Implementation in **CDK v2** (YAML workflow)

## Overview

Cloud mode sends `identify` calls to the Fullstory Server API users endpoint and `track` calls to the events endpoint. Web, Android and iOS also support device mode through the Fullstory SDKs.

## Configuration

### Settings used by the cloud-mode transformer

- **API Key** (`apiKey`): Fullstory Server API key. Sent as `Authorization: Basic {apiKey}`. Required for cloud mode (the UI note asks for Admin or Architect permissions).

### Other settings

- **FS ORG** (`fs_org`), `fs_debug_mode`, `fs_host`, `useNativeSDK`: device mode only.
- **Event filtering** (`eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`) and consent settings: applied by RudderStack, not the transformer.

## Integration Functionalities

> Fullstory supports **Device mode** (web, android, ios) and **Cloud mode**.

### Implementation

- **Implemented in**: CDK v2 (`src/cdk/v2/destinations/fullstory/procWorkflow.yaml`)
- **CDK v2 Enabled**: Yes (`cdkV2Enabled: true`; `FULLSTORY: { cdkV2: true }` in `src/features.ts`)
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`). There is no router workflow.

### Supported Message Types

```json
"supportedMessageTypes": {
  "cloud": ["track", "identify"],
  "device": {
    "web": ["identify", "track", "page"],
    "android": ["identify", "track", "screen"],
    "ios": ["identify", "track", "screen"]
  }
}
```

- **Identify**: `POST https://api.fullstory.com/v2/users` (create or update a user)
- **Track**: `POST https://api.fullstory.com/v2/events` (create a server event)

### Batching Support

- **Supported**: No. Fullstory has `/v2/users/batch` and `/v2/events/batch` import jobs, but the destination does not use them.

### Intermediate Calls

None.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`, no `transformerProxy` in `src/features.ts`).

### User Deletion

- **Supported**: No (no `deleteUsers.js`).

### OAuth Support

- **Supported**: No. API key auth.

### Validations

- `type` must be present and be `identify` or `track`.
- Track: `event` is required.
- No validation of `apiKey` or of a user identifier. An identify without `userId` is sent with no `uid`. NEEDS REVIEW: Fullstory behaviour for users created without `uid`.

### Rate Limits

Fullstory applies a per-second limit and a burst limit per org but does not publish the numbers. A `429` response includes a `Retry-After` header. NEEDS REVIEW: exact limits for `/v2/users` and `/v2/events`.

[Fullstory API limits](https://developer.fullstory.com/overview/limits/)

## General Queries

### Event Ordering

- **Identify**: Required. `POST /v2/users` upserts the user by `uid`, so a stale identify delivered late overwrites newer properties.
- **Track**: Not required. Each event carries `timestamp` (from `originalTimestamp`).

### Data Replay Feasibility

- **Missing data replay**
  - Identify: Feasible with caution; older traits can overwrite newer ones.
  - Track: Feasible; events keep their original timestamp. With `session.use_most_recent`, Fullstory attaches the event to the most recent session, which may not be the session the event happened in.
- **Already delivered data replay**
  - Identify: Safe; the user is upserted by `uid`.
  - Track: Not recommended. The destination sends no idempotency key, so replayed events are recorded again.

### Multiplexing

- **No**. One input event produces one request.

## Version Information

### Current Version

Fullstory Server API **v2**: `POST /v2/users`, `POST /v2/events`.

### Version Deprecation

No deprecation is announced for v2. Fullstory's policy is to publish breaking changes as a new major version (for example `/v3/users`) that clients opt into, so v2 endpoints are not changed in place.

### Latest Available Version

v2 is the latest Server API version. It replaced the v1 user and event endpoints.

## Documentation Links

- [Server API getting started](https://developer.fullstory.com/server/getting-started/)
- [Create user](https://developer.fullstory.com/server/users/create-user/)
- [Create event](https://developer.fullstory.com/server/events/create-event/)
- [API limits](https://developer.fullstory.com/overview/limits/)

### Changelog References

- [Server API breaking changes policy](https://developer.fullstory.com/server/breaking-changes/)
- NEEDS REVIEW: Fullstory publishes no dedicated Server API changelog, release notes page or RSS feed.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
