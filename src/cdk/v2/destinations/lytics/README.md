# Lytics Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/lytics/`). There is no v0 or v1 folder.

> Lytics is now part of Contentstack ("Data & Insights"). Lytics docs at `docs.lytics.com` redirect to `contentstack.com/docs`.

## Configuration

Config keys read by the transformer (`destination.Config`):

| Key      | UI label    | Purpose                                                 |
| -------- | ----------- | ------------------------------------------------------- |
| `apiKey` | API Tokens  | Sent as the `access_token` query parameter (secret key) |
| `stream` | Stream Name | Last path segment of the collect URL                    |

Web device-mode keys (`accountId`, `loadid`, `blockload`, `useNativeSDK`) are not read by the transformer. Event filtering and consent settings are applied outside the transformer.

NEEDS REVIEW: `schema.json` in `rudder-integrations-config` declares only consent properties; `apiKey` and `stream` have no schema validation or `required` entry.

## Integration Functionalities

### Implementation

- **Implemented in**: CDK v2 workflow (`procWorkflow.yaml`, `config.ts`, `data/LYTICSIdentifyConfig.json`)
- **CDK v2 Enabled**: Yes (`cdkV2Enabled: true` in `db-config.json`; `features.ts`: `LYTICS: { cdkV2: true }`)
- **Processor vs Router**: Processor (`transformAtV1: "processor"`). No `rtWorkflow.yaml`.

### Supported Message Types

Cloud mode: `identify`, `page`, `screen`, `track`. Anything else fails with `message type <type> is not supported`.

### Authentication

- No headers carry credentials. The request is `POST https://api.lytics.io/collect/json/{stream}` with `params: { access_token: Config.apiKey }` and `Content-Type: application/json`.
- No OAuth (`auth` not set in `db-config.json`). `secretKeys: ["apiKey"]`.
- Partner auth changes: none found on the [Contentstack Lytics changelog](https://www.contentstack.com/docs/changelog?filter=lytics) as of 2026-11-16. The current Lytics API reference on Contentstack documents header-based auth (OAuth token in `authorization` + `x-project-uid`, or `authtoken`) and regional hosts such as `lytics-api.contentstack.com`. It does not document the `access_token` query parameter or `api.lytics.io`, although the [Data & Insights FAQ](https://www.contentstack.com/docs/data-insights-lytics/faqs) still lists `https://api.lytics.io/collect/json/{stream}`. NEEDS REVIEW: confirm with Contentstack that query-parameter tokens and the `api.lytics.io` host stay supported.

### Validations

- `message.type` required and must be one of the four types above.
- No validation of `stream`; an empty stream produces `.../collect/json/undefined`.

### Batching

- **Supported**: No. One event per request. The workflow has a `$.batchMode` branch, but no router workflow invokes it.

### Intermediate Calls

None.

### Proxy Delivery

No (`networkHandler` absent).

### User Deletion

No (`deleteUsers` absent).

### OAuth Support

No.

### Rate Limits

Not published for the collect endpoint. The Contentstack Lytics API page states 10 requests/second per organization for read and for manage requests (429 when exceeded). NEEDS REVIEW whether that applies to `collect`.

## General Queries

### Event Ordering

- **Identify**: Required. Each request writes user fields; a stale event can overwrite newer values.
- **Track / Page / Screen**: Not strictly required, but the payload carries no timestamp field (the transformer drops `timestamp`/`originalTimestamp`), so Lytics will use receive time. NEEDS REVIEW against Lytics stream timestamp settings.

### Data Replay Feasibility

- **Missing data**: Track/page/screen can be replayed but are stamped with replay time. Identify replays risk overwriting newer profile data.
- **Already delivered**: Not safe; Lytics has no idempotency key in this payload, so events are duplicated.

### Multiplexing

None.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `procWorkflow.yaml` (`prepareContext` step, `https://api.lytics.io/collect/json/{stream}`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Contentstack changelog, Lytics filter](https://www.contentstack.com/docs/changelog?filter=lytics)

The Lytics changelog lists product deprecations (legacy audience builder sunset May 4, 2026; Data Activation Layer deprecated Sep 10, 2026). Neither affects the collect endpoint. The [Lytics API page](https://www.contentstack.com/docs/developers/apis/lytics-api) now lists regional `*lytics-api.contentstack.com` hosts and does not mention `api.lytics.io`. NEEDS REVIEW: whether the collect endpoint will move to a Contentstack host.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Lytics API (Contentstack)](https://www.contentstack.com/docs/developers/apis/lytics-api)

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Lytics API (Contentstack)](https://www.contentstack.com/docs/developers/apis/lytics-api)
- [Lytics Management API](https://www.contentstack.com/docs/developers/apis/lytics-management-api)
- [Data & Insights (Lytics) FAQs](https://www.contentstack.com/docs/data-insights-lytics/faqs)

### Changelog References

- **Changelog:** [Contentstack changelog, Lytics filter](https://www.contentstack.com/docs/changelog?filter=lytics) (`docs.lytics.com/changelog` redirects here)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

## FAQ

<!-- Populated over time -->
