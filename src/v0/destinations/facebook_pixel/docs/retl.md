# Facebook Pixel RETL Functionality

## RETL-Specific Logic

The Facebook Pixel destination does not implement any special handling for events that come from RETL sources. Unlike some other destinations that have specific logic for events marked with `context.mappedToDestination = true`, the Facebook Pixel destination treats all events uniformly regardless of their source.

### Key RETL Behaviors

1. **No Special RETL Handling**:
   - The Facebook Pixel destination does not check for the `MappedToDestinationKey` flag
   - All events follow the same transformation and processing logic
   - No special user attribute handling for RETL events

2. **Standard Event Processing**:
   - RETL events are processed using the same logic as regular event stream events
   - User data mapping follows the standard configuration mappings
   - No bypass of validation or transformation logic for RETL events

3. **Uniform Data Flow**:
   - Both RETL and event stream events use the same API endpoint: `/events`
   - Same authentication and header requirements apply
   - Identical payload structure for both event types

## VDM v2 Support

**Not Supported**: The Facebook Pixel destination does not support VDM v2.

### Evidence of No VDM v2 Support

1. **No Record Event Type**: The `supportedMessageTypes` in `db-config.json` does not include `record` event type
2. **No Record Handling**: The transformer code does not include any handling for `record` event type in the switch statement
3. **Supported Message Types**:
   - Cloud mode: `identify`, `page`, `screen`, `track`
   - Device mode (web): `track`, `page`

## Connection Configuration

The Facebook Pixel destination uses the same configuration for both RETL and event stream sources:

- **Required**: Pixel ID, Access Token (for cloud mode)
- **Optional**: All standard configuration options apply equally to RETL events
- **No RETL-specific configuration**: No additional settings are required or available for RETL sources

## Data Flow

### Standard Data Flow (Both RETL and Event Stream)

1. **Event Reception**: RudderStack receives events from any source (RETL or event stream)
2. **Validation**: Events are validated for required fields and proper format
3. **Transformation**: Events are transformed using the standard mapping configuration
4. **API Call**: Transformed events are sent to Facebook Conversions API `/events` endpoint
5. **Response Handling**: API responses are processed using standard error handling

### Event Processing Pipeline

```
Input Event (RETL or Event Stream)
         ↓
Event Type Validation (identify/track/page/screen)
         ↓
User Data Mapping (using FBPIXELUserDataConfig.json)
         ↓
Common Data Mapping (using FBPIXELCommonConfig.json)
         ↓
Custom Data Processing (properties flattening, PII handling)
         ↓
Payload Construction
         ↓
API Request to Facebook Conversions API
         ↓
Response Processing
```

### No RETL-Specific Branching

Unlike destinations such as Braze or CustomerIO that have conditional logic based on `mappedToDestination`, the Facebook Pixel destination follows a single code path for all events:

```javascript
// No conditional logic like this exists in Facebook Pixel:
// if (get(message, MappedToDestinationKey)) {
//   // RETL-specific logic
// } else {
//   // Event stream logic
// }
```

## Limitations for RETL Use Cases

1. **No Pre-formatted Data Support**: RETL sources cannot send pre-formatted Facebook Pixel data that bypasses transformation
2. **Standard Validation**: All RETL events must conform to RudderStack's standard event schema
3. **No Bulk Operations**: RETL events are processed individually, same as event stream events
4. **No Record Type Support**: Cannot handle VDM v2 record events for warehouse-to-destination syncing

## Recommendations for RETL Implementation

Since the Facebook Pixel destination treats RETL events the same as event stream events:

1. **Use Standard Event Types**: Ensure RETL sources send events as `identify`, `track`, `page`, or `screen` types
2. **Follow Standard Schema**: RETL events should follow RudderStack's standard event schema
3. **Configure Mapping**: Use the standard destination configuration for field mapping
4. **Consider Event Volume**: Since there's no batching, high-volume RETL sources may result in many individual API calls

## Future RETL Enhancements

**NEEDS REVIEW**: Consider whether Facebook Pixel destination should implement RETL-specific optimizations such as:
- Batching support for RETL events
- Pre-formatted data handling for warehouse sources
- VDM v2 record type support
- RETL-specific configuration options
