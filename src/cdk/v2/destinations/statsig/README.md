# Statsig Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/statsig/procWorkflow.yaml`).

A legacy JavaScript implementation also exists in `src/v0/destinations/statsig/`. It builds the same request and is only used when the CDK v2 path is switched off with the `DISABLE_STATSIG_CDK_V2` environment variable. `STATSIG: { cdkV2: true }` in `src/features.ts` and `cdkV2Enabled: true` in `db-config.json` select the CDK v2 workflow.

## Configuration

### Required Settings

- **Secret Key** (`secretKey`): Statsig **Server Secret Key**, from Project Settings > API Keys in the Statsig console. Marked as a secret key in `db-config.json`.

### Optional Settings

- Consent settings only (`oneTrustCookieCategories`, `ketchConsentPurposes`, `consentManagement`). These are applied by rudder-server, not by the transformer.

## Integration Functionalities

> Statsig supports **Cloud mode** only.

### Supported Message Types

- Identify, Track, Page, Screen, Group, Alias (`supportedMessageTypes.cloud` in `db-config.json`; enforced in the `validateInput` step).

### Implementation

- **Implemented in**: CDK v2 (YAML workflow)
- **Processor vs Router**: `transformAtV1: "router"` in `db-config.json`. There is no `rtWorkflow.yaml` and `src/features.ts` does not set `routerTransform: true` for Statsig, so each event is transformed one at a time. **NEEDS REVIEW**: confirm how rudder-server treats a `router` destination that the transformer does not list for router transform.

### Authentication

- Header `STATSIG-API-KEY: <secretKey>` plus `content-type: application/json`.
- No OAuth (`auth` is not set in `db-config.json`).
- No announced deprecation of server secret keys was found. Statsig supports key rotation from the console ([API keys](https://docs.statsig.com/access-management/api-keys)). **NEEDS REVIEW**: re-check the Statsig API keys page and deprecation notices for changes to the RudderStack webhook auth.

### Batching Support

- **Supported**: No. One request per event.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`, no `transformerProxy` in `src/features.ts`).

### User Deletion

- **Supported**: No (no `deleteUsers.js`).

### OAuth Support

- **Supported**: No.

### Additional Functionalities

- The full RudderStack message is forwarded unchanged as the request body. All field interpretation happens on Statsig's side at the RudderStack webhook.
- Statsig reads `event` and `userId`. Custom unit IDs go in `properties.statsigCustomIDs` (alternating ID type and value) and the environment in `properties.statsigEnvironment.tier` ([Statsig RudderStack integration](https://docs.statsig.com/integrations/data-connectors/rudderstack)).

### Validations

- `message.type` must be present and one of identify, track, group, page, alias, screen. The CDK check is case-sensitive (the v0 code lower-cases first).

### Rate Limits

- Not documented for the RudderStack webhook. **NEEDS REVIEW**.

## General Queries

### Event Ordering

- **Identify / Group / Alias**: Statsig uses these to attach user and unit properties. Out-of-order delivery can leave older properties in place, so ordering is preferred.
- **Track / Page / Screen**: Statsig treats these as metric events with their own timestamps, so ordering is not required.

### Data Replay Feasibility

- **Missing data**: Track/page/screen events can be replayed; Statsig attributes them using the event timestamp. **NEEDS REVIEW**: Statsig may ignore events older than its ingestion window.
- **Already delivered data**: Not safe. No dedupe key is documented for the webhook, so replays will likely double count metric events.

### Multiplexing

- **No**. One input event produces one request.

## Version Information

### Current Version

- **Version:** `v1`
- **Where in code:** `procWorkflow.yaml` (`response.endpoint`, `https://api.statsig.com/v1/webhooks/rudderstack`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Statsig RudderStack integration](https://docs.statsig.com/integrations/data-connectors/rudderstack)

Statsig's server deprecation notices cover SDK initialization changes (for example the direct initialization API, October 31, 2025) that do not affect this webhook ([deprecation notices](https://docs.statsig.com/server/deprecation-notices)).

### Latest Available Version

- **Version:** `v1`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Statsig RudderStack integration](https://docs.statsig.com/integrations/data-connectors/rudderstack)

`v1` is the only webhook version found.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Statsig RudderStack integration](https://docs.statsig.com/integrations/data-connectors/rudderstack)
- [Statsig API keys](https://docs.statsig.com/access-management/api-keys)
- [Statsig HTTP API](https://docs.statsig.com/http-api)

### Changelog References

- **Changelog:** [Statsig product updates](https://www.statsig.com/updates)
- **Deprecations:** [Statsig server deprecation notices](https://docs.statsig.com/server/deprecation-notices)
- **Versions:** None found
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

`https://www.statsig.com/updates/rss.xml` and `https://www.statsig.com/blog/rss.xml` return HTML pages, not feeds.

## FAQ

> This section will be populated with frequently asked questions as they arise from usage and support requests.
