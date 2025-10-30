# Statsig Destination

Implementation in Javascript via CDK v2 (Router v1)

## Configuration

### Required Settings

- **Secret Key**: Server Secret Key from your Statsig Project settings (API Keys tab)

### Optional Settings

- **Consent settings**: Supports consent-gating configuration (Custom, OneTrust, Ketch, Iubenda). See UI and schema for per-source configuration keys.

## Integration Functionalities

> Statsig supports Cloud (server-side) only via this integration

### Implemented Using

- **CDK v2**: `src/cdk/v2/destinations/statsig/procWorkflow.yaml`

### Supported Message Types

- Identify
- Track
- Page
- Screen
- Group
- Alias

Source of truth: `rudder-integrations-config/src/configurations/destinations/statsig/db-config.json > supportedMessageTypes`

### Batching Support

- **Supported**: No
- **Message Types**: All supported types
- **Batch Limits**: No public Statsig webhook batching limits found

### Endpoint and Authentication

- **Endpoint**: `https://api.statsig.com/v1/webhooks/rudderstack`
- **Headers**:
  - `STATSIG-API-KEY: <Secret Key>`
  - `Content-Type: application/json`

### Intermediate Calls

- None. The integration forwards the incoming RudderStack message as JSON to the Statsig webhook endpoint.

### Proxy Delivery

- Not Supported. There is no destination-specific `networkHandler.js`.

### User Deletion

- **Not Supported**: No dedicated deletion handler found for Statsig.

### OAuth Support

- **Not Supported**: Uses Secret Key header, no OAuth config in destination.

### Processor vs Router

- **Router**: `transformAtV1 = "router"` in destination config.

### Partial Batching Response Handling

- NEEDS REVIEW for Statsig-specific behavior via v1 proxy.

### Additional Functionalities

- **Consent gating support**: Configurable via `consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes` (see config files listed below). Actual enforcement is handled by RudderStack consent framework before delivery.

## Validations & Transformations

- Validations:
  - `message.type` is required and must be one of the supported types; otherwise the event is rejected.
- Transformations:
  - None. The event is forwarded as-is to Statsig with required headers.

## Rate Limits

- NEEDS REVIEW. Public, authoritative rate limits for `v1/webhooks/rudderstack` are not documented. Monitor Statsig responses and headers for enforcement details.

## General Queries

### Event Ordering

- Since events are forwarded as-is, any ordering requirements depend on Statsig’s ingestion semantics. For consistency of analytics and exposures, maintain natural event order when possible. NEEDS REVIEW against official Statsig ingestion guidance.

### Data Replay Feasibility

- Missing data replay: Likely feasible for analytics-style events, but may duplicate metrics if events are resent. NEEDS REVIEW against Statsig guidance.
- Already delivered data replay: May create duplicates since Statsig treats each event as a new occurrence. NEEDS REVIEW.

### Multiplexing

- Not applicable. The integration does not generate multiple different API calls per input event.

## Version Information

- The integration targets a Statsig-managed webhook (`/v1/webhooks/rudderstack`). No public versioned API surface identified for this endpoint.

## Documentation Links

- Statsig Docs (general): https://docs.statsig.com/
- Statsig Product: https://statsig.com/

## Source References

- `src/cdk/v2/destinations/statsig/procWorkflow.yaml`
- `src/v0/destinations/statsig/transform.js`
- `rudder-integrations-config/src/configurations/destinations/statsig/schema.json`
- `rudder-integrations-config/src/configurations/destinations/statsig/ui-config.json`
- `rudder-integrations-config/src/configurations/destinations/statsig/db-config.json`

## RETL and Business Logic

- For RETL-specific functionality, see [docs/retl.md](docs/retl.md)
- For business logic and validations, see [docs/businesslogic.md](docs/businesslogic.md)
