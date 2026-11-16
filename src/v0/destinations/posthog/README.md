# PostHog Destination

Implementation in **TypeScript** (`src/v0/destinations/posthog/`), on the native batching framework (`routerTransform.ts`).

## Configuration

Settings read by the transformer (`destination.Config`, validated by `PostHogDestinationConfigSchema` in `types.ts`):

- **Team API Key** (`teamApiKey`, required): PostHog project API key. Sent as `api_key` in the batch body.
- **Your Instance** (`yourInstance`, optional): PostHog host. Trailing slash stripped; defaults to `https://app.posthog.com`.
- **Use V2 Group** (`useV2Group`, default `false`): Group calls use the `$group_key`/`$group_type`/`$group_set` mapping instead of the legacy one.

Not used by the cloud transformer: web device-mode settings (`useNativeSDK`, `autocapture`, `capturePageView`, `disableSessionRecording`, `enableLocalStoragePersistence`, `personProfiles`, `xhrHeaders`, `propertyBlackList`) and event filtering (applied by rudder-server).

## Integration Functionalities

> Supports **Cloud mode** and **Device mode** (web: identify, track, page, group).

### Supported Message Types (Cloud)

- **Identify**: `$identify` with traits in `$set`
- **Track**: event name as sent
- **Page**: `$pageview`
- **Screen**: `$screen`
- **Group**: `$groupidentify`
- **Alias**: `$create_alias`

### Implementation

- **Implemented in**: TypeScript (v0), `transform.ts` (payload) + `routerTransform.ts` (`PostHogIntegration`)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router destination (`transformAtV1: "router"`)
- **Batching framework**: GA (`POSTHOG: { routerTransform: true, batching: true }` in `src/features.ts`), so the router path always uses `PostHogIntegration`. `processRouterDest` in `transform.ts` is the legacy path.

### Batching Support

- **Supported**: Yes, all message types.
- `ChunkBatchStrategy` with `maxPayloadSize: '10MB'` and no item limit. Body: `{ "api_key": teamApiKey, "batch": [ ...events ] }`.
- Per-event cap: events over 900,000 bytes are rejected in the transformer (PostHog documents 1 MB; smaller events were also seen to be rejected).

### Rate Limits

PostHog's [API overview](https://posthog.com/docs/api) states that public POST-only endpoints such as capture/batch have no request-level rate limits. The [capture docs](https://posthog.com/docs/api/capture) say a batch request body must be under 20 MB by default and there is no limit on events per batch.

### Intermediate Calls

None.

### Proxy Delivery

- No `networkHandler.js`. Because the destination is on the batching framework, delivery is handled by the framework (`src/services/destination/destinationIntegration/delivery.ts`). `PostHogIntegration` declares no `delivery` spec, so default status handling applies to the whole batch.
- **Partial batching response handling**: No (the batch succeeds or fails as a whole).
- NEEDS REVIEW: whether rudder-server routes PostHog through the transformer proxy (`transformerProxy` in rudder-devops config).

### User Deletion

- **Supported**: No (no `deleteUsers.js`)

### OAuth Support

- **Supported**: No. The project API key goes in the body.

### Additional Functionalities

- **Context properties**: Device, OS, browser (parsed from user agent on web), screen, app, campaign (UTM) and page fields mapped to PostHog `$` properties.
- **Person properties on non-identify events**: `context.traits` sent as `properties.$set`.
- **Groups**: `$groups: { [groupType]: groupKey }` added when type and key are present.

### Validations

- `type` must be one of track, page, screen, identify, alias, group
- `userId` or `anonymousId` required (input schema)
- `teamApiKey` required (non-empty)
- Required mappings: `distinct_id` (all), `event` + `messageId` (track), `$set` + `messageId` (identify), `properties.alias` from `previousId` (alias)
- Event body must be ≤ 900,000 bytes

## General Queries

### Event Ordering

- **Identify / Alias / Group**: Required. They set person/group properties (`$set`, `$group_set`) and merge identities; out-of-order delivery can leave stale values or merge identities in the wrong order.
- **Track / Page / Screen**: Not strictly required; each event carries `timestamp`. They also carry `$set` from `context.traits`, so older events could overwrite newer person properties.

### Data Replay Feasibility

- **Missing data replay**: Feasible for track/page/screen (timestamped). Replay identify/alias/group in order.
- **Already-delivered data replay**: Not safe. The transformer does not set PostHog's `uuid` field (it sends `messageId` and an empty `$insert_id` mapping), so PostHog will likely store replays as new events. NEEDS REVIEW against PostHog's dedupe behavior.

### Multiplexing

- **No**. One input produces one event in the batch.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `config.ts` (`DEFAULT_BASE_ENDPOINT`); `transform.ts` and `routerTransform.ts` (`/batch`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Capture and batch API](https://posthog.com/docs/api/capture)

PostHog's current docs name `https://us.i.posthog.com` and `https://eu.i.posthog.com` as the ingestion hosts. This integration defaults to `https://app.posthog.com`. NEEDS REVIEW: no PostHog notice was found that deprecates `app.posthog.com` for ingestion; decide whether the default should move to `us.i.posthog.com`.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Capture and batch API](https://posthog.com/docs/api/capture)

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Capture and batch API](https://posthog.com/docs/api/capture)
- [API overview (rate limits, authentication)](https://posthog.com/docs/api)
- [Ingestion warnings (event size)](https://posthog.com/docs/data/ingestion-warnings)

### Changelog References

- **Changelog:** [PostHog changelog](https://posthog.com/changelog)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** [PostHog changelog RSS](https://posthog.com/changelog.rss)
- **Announcements:** None found
- **Last checked:** 2026-11-16

## FAQ

> This section will be populated with frequently asked questions as they arise.
