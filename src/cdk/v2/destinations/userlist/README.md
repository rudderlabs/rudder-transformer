# Userlist Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/userlist/procWorkflow.yaml`)

`cdkV2Enabled: true` in `db-config.json` and `USERLIST: { cdkV2: true }` in `src/features.ts`, so the CDK v2 workflow is the live implementation. `src/v0/destinations/userlist/` holds the older JavaScript transform with the same behaviour. It is not used while CDK v2 is enabled.

Userlist built a RudderStack-specific endpoint that accepts RudderStack events as they are. The transformer forwards the message almost unchanged.

## Configuration

### Required Settings

- **Userlist Push Key** (`pushKey`): Push API key from Userlist (Settings > Push). Listed in `secretKeys`.

`pushKey` is in `ui-config.json` and `db-config.json` but not in `schema.json`. NEEDS REVIEW.

### Optional Settings

- Consent management settings (handled outside this transformer).

## Integration Functionalities

> Userlist supports **Cloud mode** only.

### Supported Message Types

- **Identify**, **Track**, **Group**

### Implementation

- **Implemented in**: CDK v2 (YAML workflow)
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`).

### Authentication

- Header `Authorization: Push <pushKey>` plus `Content-Type: application/json`.
- No OAuth.
- **Auth changes announced by Userlist**: none found. The [Push API reference](https://userlist.com/docs/developers/push-api/) still documents the `Push` scheme. Userlist has no public API changelog.

### Batching Support

- **Supported**: No. The workflow has a `batchMode` branch that returns the bare payload, but no router batching is configured.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No.

### User Deletion

- **Supported**: No.

### OAuth Support

- **Supported**: No.

### Additional Functionalities

- The whole RudderStack message is forwarded. Userlist does the mapping on its side.

### Validations

- `message.type` is required and must be identify, track or group (case-insensitive).
- `userId` is required (from `userId`, `traits.userId`, `traits.id`, `context.traits.userId`, `context.traits.id`). Anonymous events are rejected.

### Rate Limits

- The public Push API (`push.userlist.com`) allows 1,000 requests per minute per account and 100 KB per request. Whether the same limits apply to the RudderStack endpoint (`incoming.userlist.com/rudderstack/events`) is not documented. NEEDS REVIEW.

## General Queries

### Event Ordering

- **Identify / Group**: Recommended. They update user and company properties, which later events can overwrite.
- **Track**: Events carry their `timestamp`, so order matters less.

### Data Replay Feasibility

- **Missing data**: Track can be replayed. Identify and Group should be replayed in order.
- **Already delivered data**: Unknown whether Userlist deduplicates by `messageId`. NEEDS REVIEW.

### Multiplexing

- No.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `procWorkflow.yaml` (`response.endpoint = "https://incoming.userlist.com/rudderstack/events"`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Userlist: RudderStack integration](https://userlist.com/docs/integrations/rudderstack/)

Userlist publishes no version policy for this custom endpoint.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Userlist: RudderStack integration](https://userlist.com/docs/integrations/rudderstack/)

The public Push API at `https://push.userlist.com` is also unversioned.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Userlist: Push API reference](https://userlist.com/docs/developers/push-api/)
- [Userlist: Integration guide](https://userlist.com/docs/getting-started/integration-guide/)
- [Userlist: RudderStack integration](https://userlist.com/docs/integrations/rudderstack/)
- [RudderStack docs: Userlist destination](https://www.rudderstack.com/docs/destinations/streaming-destinations/userlist/)

### Changelog References

- **Changelog:** [Userlist product updates](https://userlist.com/updates/) (product news; no developer changelog)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

`https://userlist.com/changelog/` returns 404. The site's Atom feeds (`/feed.xml`, `/blog/feed.xml`) carry blog posts only, not product updates.

## FAQ

_No entries yet._
