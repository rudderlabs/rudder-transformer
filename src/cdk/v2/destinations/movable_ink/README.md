# Movable Ink Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/movable_ink/`)

## Configuration

### Required Settings

- **Movable Ink Endpoint** (`endpoint`): The account-specific Behavior Events collector URL issued by Movable Ink (for example `https://collector.movableink-dmz.com/behavioral/<key>`). Events are POSTed to this URL as-is.
- **Access Key** (`accessKey`): Username for HTTP Basic authentication. Secret.
- **Access Secret** (`accessSecret`): Password for HTTP Basic authentication. Secret.

### Other Settings

- Consent management (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`) is applied by rudder-server, not by the transformer.

## Integration Functionalities

> Movable Ink supports **Cloud mode** only.

### Supported Message Types

- **Identify**: Sent to the Behavior Events collector as a user event
- **Track**: Sent to the Behavior Events collector as a behavioral event

Any other type fails with `message type <type> is not supported`.

### Implementation

- **Implemented in**: CDK v2 (`procWorkflow.yaml`, `rtWorkflow.yaml`, `utils.js`, `config.js`)
- **CDK v2 Enabled**: Yes (`cdkV2Enabled: true`)
- **Processor vs Router**: Router destination (`transformAtV1: "router"`)

### Batching Support

- **Supported**: Yes, for both Identify and Track
- Successful events are chunked with `BatchUtils.chunkArrayBySizeAndLength`:
  - **Max events per batch**: 1000 (`MAX_BATCH_SIZE`)
  - **Max request size**: 1,000,000 bytes (`MAX_REQUEST_SIZE_IN_BYTES`)
- Batched body: `{ "events": [ ...payloads ] }`. All events of a batch are sent to the first event's `endpoint` with its credentials.

### Rate Limits

NEEDS REVIEW: Movable Ink's Behavior Events API reference is login-gated and its rate limits and batch limits are not public. The 1000 events / 1 MB limits come from the transformer code, not from published partner docs.

### Intermediate Calls

None.

### Proxy Delivery

- **Supported**: No (no `networkHandler.js`)

### User Deletion

- **Supported**: No (no `deleteUsers.js`)

### OAuth Support

- **Supported**: No. HTTP Basic auth: `Authorization: Basic base64(accessKey:accessSecret)`.

### Additional Functionalities

- **Pass-through payload**: The entire RudderStack message is forwarded, with `userId`, `timestamp` and `anonymousId` overwritten (see [business logic](docs/businesslogic.md)). Movable Ink drops fields not configured in the client's event schema on the Movable Ink side.

### Validations

- `endpoint`, `accessKey`, `accessSecret` must be set (configuration errors otherwise)
- `timestamp` or `originalTimestamp` must be present
- Track: `event` must be present
- At least one of `userId`, email (generic `email` paths) or `anonymousId` must be present
- E-commerce events:
  - `Products Searched` requires `properties.query`
  - `Product Added`, `Product Removed`, `Product Viewed`, `Category Viewed` require `properties.product_id`

## General Queries

### Event Ordering

- **Identify / Track**: Each event carries a millisecond `timestamp`, and the collector ingests behavioral events rather than overwriting profile state. Strict ordering is likely not required. NEEDS REVIEW: Movable Ink does not publicly document how out-of-order events are treated.

### Data Replay Feasibility

- **Missing data replay**: Feasible; events carry their original timestamp.
- **Already-delivered data replay**: Not safe. The transformer sends no dedupe key besides the forwarded `messageId`; NEEDS REVIEW whether Movable Ink dedupes on any field.

### Multiplexing

- **No**. One input event produces one payload (batched with others in router mode).

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `procWorkflow.yaml` (`response.endpoint = .destination.Config.endpoint`)

The destination does not call a versioned API path. It POSTs to the customer-configured collector URL (`collector.movableink-dmz.com/behavioral/<key>`).

### Version Deprecation

- **Status:** Unknown
- **Sunset date:** None announced
- **Source:** [Movable Ink SDK: Behavior Events (iOS)](https://sdk-mobile.movableink.com/ios-sdk/behavior-events)

Movable Ink has no public API lifecycle page; the Behavior Events API reference is login-gated.

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Movable Ink SDK: Behavior Events (iOS)](https://sdk-mobile.movableink.com/ios-sdk/behavior-events)

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Movable Ink SDK: Behavior Events (iOS)](https://sdk-mobile.movableink.com/ios-sdk/behavior-events)
- [RudderStack Movable Ink docs](https://www.rudderstack.com/docs/destinations/streaming-destinations/movable-ink/)

The Behavior Events API reference (`learning.movableink.com`) is login-gated, and the developer docs page (`https://movableink.com/developers/docs`) returns 404. Endpoint keys and Basic auth credentials come from the Movable Ink Client Experience team.

### Changelog References

- **Changelog:** [Movable Ink mobile SDK changelog](https://sdk-mobile.movableink.com/changelog)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** [iOS SDK releases (Atom)](https://github.com/movableink/ios-sdk/releases.atom)
- **Announcements:** None found
- **Last checked:** 2026-11-16

Movable Ink has no public changelog for the Behavior Events collector API. The mobile SDK changelog covers changes to the behavior event schema sent through the SDKs (for example, the `meta` field in SDK v2.1), which is the closest public source. Collector changes are communicated through the Client Experience team.

## FAQ

> This section will be populated with frequently asked questions as they arise.
