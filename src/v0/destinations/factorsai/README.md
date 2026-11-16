# Factors AI Destination

Implementation in **JavaScript** (`src/v0/destinations/factorsai/`)

## Configuration

### Required Settings

- **API Key** (`factorsAIApiKey`): The key generated in Factors AI under Settings > Integrations > RudderStack > Get API Key. Marked as a secret in `db-config.json`.

### Optional Settings

- Consent management settings (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`). These are handled by the RudderStack consent framework, not by this transformer.

## Integration Functionalities

> Factors AI supports **Cloud mode** only.

### Supported Message Types

- **Identify**, **Track**, **Page**, **Group** (`supportedMessageTypes.cloud` in `db-config.json`)

### Implementation

- **Implemented in**: JavaScript (v0)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`). A `processRouterDest` exists and wraps `process` with `simpleProcessRouterDest`.
- **Supported sources**: web, mobile SDKs, cloud, warehouse, Shopify and others listed in `db-config.json`.

### Authentication

- HTTP Basic auth. The code builds `Authorization: Basic base64("<factorsAIApiKey>:")` (API key as username, empty password).
- No OAuth. `auth` is not set in `db-config.json`.
- **Auth changes announced by Factors AI**: none found. Factors AI does not publish an API reference or changelog for this endpoint. NEEDS REVIEW.

### Batching Support

- **Supported**: No. Each event becomes one `POST` request.

### Intermediate Calls

- None.

### Proxy Delivery

- **Supported**: No (`networkHandler.js` is not present).

### User Deletion

- **Supported**: No (`deleteUsers.js` is not present).

### OAuth Support

- **Supported**: No.

### Additional Functionalities

- All four message types go to one endpoint, `https://api.factors.ai/integrations/rudderstack_platform`. Factors AI routes them by the `type` field in the body.
- Track `properties` are flattened with `flattenJson` because Factors AI does not accept nested properties. Page and Group payloads are not flattened.
- `context.ip` is set from `context.ip`, falling back to `request_ip`.
- The whole `context` object is forwarded in the payload.

### Validations

- `message.type` must be present and one of identify, track, page, group.
- `timestamp` is required for every type (from the generic timestamp map).
- Track: `event` is required.
- Group: `groupId` is required.
- See [docs/businesslogic.md](docs/businesslogic.md) for full mappings.

### Rate Limits

- Not documented publicly by Factors AI. NEEDS REVIEW.

## General Queries

### Event Ordering

- **Identify / Group**: Ordering is recommended. These update user and account traits, so an older event delivered later can overwrite newer traits.
- **Track / Page**: Each event carries a `timestamp`, so ordering matters less. Session and attribution logic in Factors AI may still be affected by late events. NEEDS REVIEW.

### Data Replay Feasibility

- **Missing data**: Track and Page can be replayed because they carry their original timestamps. Replay Identify and Group in order.
- **Already delivered data**: Replaying probably creates duplicates. `messageId` is sent, but there is no documentation that Factors AI deduplicates on it. NEEDS REVIEW.

### Multiplexing

- No. One input event produces one request.

## Version Information

### Current Version

- No version in the endpoint path: `https://api.factors.ai/integrations/rudderstack_platform`. This is a partner-built endpoint for RudderStack, not a versioned public API.

### Version Deprecation

- No deprecation announced. Factors AI publishes no lifecycle policy for this endpoint. NEEDS REVIEW.

### Latest Available Version

- Not applicable. The endpoint is unversioned. NEEDS REVIEW with Factors AI if a newer ingestion endpoint exists.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Factors AI: RudderStack integration (help center)](https://help.factors.ai/en/articles/7283693-rudderstack-integration)
- [RudderStack docs: Factors AI destination](https://www.rudderstack.com/docs/destinations/streaming-destinations/factors/)

### Changelog References

- NEEDS REVIEW: Factors AI does not publish a developer changelog, deprecations page, version list or changelog feed for its API. `https://www.factors.ai/changelog` returns 404. The closest source is the [Factors AI blog](https://www.factors.ai/blog), which covers product news, not API changes.

## FAQ

_No entries yet._
