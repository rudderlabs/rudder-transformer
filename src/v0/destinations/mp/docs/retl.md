# Mixpanel RETL Functionality

## RETL-Specific Logic

The Mixpanel destination implements special handling for events that come from RETL sources. These events are identified by the presence of the `context.mappedToDestination` flag (defined as `MappedToDestinationKey` in the codebase).

### Key RETL-Specific Behaviors

Based on the codebase analysis, the following RETL-specific behaviors are implemented:

1. **Direct Property Passing**:
   - When an event is marked with `context.mappedToDestination = true`, the transformer likely passes properties directly to Mixpanel without applying the standard mapping logic
   - This allows RETL sources to provide pre-formatted properties that match Mixpanel's expected format

2. **External ID Handling**:
   - For events from RETL sources, there may be special logic to handle external IDs from the context

## VDM v2 Support

Based on the configuration analysis, this destination doesn't appear to support VDM v2 as there's no explicit support for `record` event type in the supported message types.

## Connection Configuration

RETL connections to Mixpanel would require the same configuration parameters as regular connections:

- **Token**: Required for authentication with Mixpanel API
- **Data Residency**: Specifies the Mixpanel data center to use
- **API Secret**: Required for using the Import API

## Data Flow

### RETL Data Flow

1. RudderStack receives events from RETL sources with `context.mappedToDestination = true`
2. Properties are passed directly to Mixpanel without standard mapping
3. The transformer sends the processed events to Mixpanel via the appropriate endpoints:
   - `/import` for events
   - `/engage` for user profiles
   - `/groups` for group profiles

NEEDS REVIEW: The exact RETL implementation details for Mixpanel should be verified as the codebase analysis doesn't show explicit RETL-specific code paths for this destination.
