# Mixpanel RETL Functionality

## RETL Support Status

**Current Status**: The Mixpanel destination does not have explicit RETL-specific implementation or special handling for events from RETL sources.

## VDM v2 Support

**VDM v2 Support**: No

Based on the configuration analysis:
- The destination does not support the `record` event type in `supportedMessageTypes`
- No VDM v2-specific logic is implemented in the transformer code
- The destination processes standard event types (identify, track, page, screen, group, alias) only

## Standard Event Stream Processing

The Mixpanel destination processes all events through the standard event stream logic, regardless of their source:

### Supported Event Types
- **Identify**: User profile updates via `/engage` endpoint
- **Track**: Event tracking via `/track` or `/import` endpoints
- **Page**: Page view events (converted to track events)
- **Screen**: Screen view events (converted to track events)
- **Group**: Group profile updates via `/groups` endpoint
- **Alias**: User identity merging via `/import` endpoint with `$merge` event

### Connection Configuration

All connections to Mixpanel use the same configuration parameters:

- **Token**: Required for authentication with Mixpanel API
- **Data Residency**: Specifies the Mixpanel data center to use (US, EU, IN)
- **API Secret**: Required for using the Import API (server-side implementations)
- **Identity Merge API**: Choose between Original ID Merge and Simplified ID Merge

## Data Flow

### Standard Data Flow

1. RudderStack receives events from any source (SDK, cloud app, etc.)
2. Events are processed through standard transformation logic
3. Transformed events are sent to appropriate Mixpanel endpoints:
   - `/import` for server-side event tracking
   - `/track` for client-side event tracking
   - `/engage` for user profile updates
   - `/groups` for group profile updates

### No RETL-Specific Logic

The codebase analysis confirms that there is no special handling for:
- `context.mappedToDestination` flag
- `record` event types
- RETL-specific property mapping
- External ID handling from RETL context

All events are processed using the same transformation and mapping logic regardless of their source.
