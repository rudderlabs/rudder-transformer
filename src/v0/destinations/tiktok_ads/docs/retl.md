# TikTok Ads RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes**

The TikTok Ads destination supports RETL functionality. Evidence:
- `supportedSourceTypes` includes `warehouse` which indicates RETL support
- JSON mapper is supported by default (no `disableJsonMapper: true` in config)
- Supports data flow from warehouses/databases to TikTok Ads

## RETL Support Analysis

### Which type of retl support does it have?
- **JSON Mapper**: Supported (default, no `disableJsonMapper: true`)
- **VDM V1**: Not supported (`supportsVisualMapper` not present in `db-config.json`)
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`)

### Does it have vdm support?
**No** - `supportsVisualMapper` is not present in `db-config.json`

### Does it have vdm v2 support?
**No** - Missing both:
- `supportedMessageTypes > record` in `db-config.json`
- Record event type handling in transformer code

### Connection config
Standard TikTok Ads configuration applies:
- **Access Token**: Same access token used for event stream functionality
- **Pixel Code**: Required for Events API
- **Test Event Code**: Optional, for testing events

## RETL Flow Implementation

### Warehouse Integration

TikTok Ads supports RETL through warehouse sources with JSON mapper functionality:

- **Supported**: Yes, warehouse sources can send data to TikTok Ads via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Track events only
- **Data Flow**: Warehouse/Database → RudderStack → TikTok Ads (via Events API)
- **Mapping**: JSON mapper transforms warehouse data to TikTok Ads event format

### Supported Message Types for RETL
```json
"supportedMessageTypes": {
  "cloud": ["track"]
}
```

### RETL Event Processing

The TikTok Ads destination processes RETL events through the same logic as event stream, supporting only track events.

## Data Flow

### RETL Data Processing

1. **Data Extraction**: Warehouse/database data extracted by RudderStack
2. **JSON Mapping**: Data transformed using JSON mapper configuration
3. **Event Construction**: Warehouse records converted to TikTok Ads track events
4. **API Delivery**: Events sent to TikTok Ads via Events API

### Example RETL Event

```javascript
// Warehouse record transformed to TikTok Ads track event
{
  "type": "track",
  "event": "CompletePayment",
  "properties": {
    "order_id": "12345",
    "value": 99.99,
    "currency": "USD",
    "contents": [...]
  },
  "context": {
    "traits": {
      "email": "user@example.com"
    }
  }
}
```

## Rate Limits and Constraints

### TikTok Ads API Limits
- **Events API**: 1000 requests per minute per access token
- **Event Batch Size**: Up to 1000 events per request
- **Event Properties**: Standard TikTok Ads event parameters

### RETL Processing Constraints
- **Message Types**: Limited to track events only
- **JSON Mapper Only**: No visual mapper or VDM v2 support
- **Cloud Mode Only**: Device mode not supported for RETL

## Technical Limitations

### Why RETL is Not Supported

1. **API Constraints**: TikTok's Events API is designed for real-time event tracking, not bulk data operations
2. **Event-Centric Model**: TikTok Ads focuses on event-based tracking rather than profile-based data updates
3. **Real-time Optimization**: TikTok's ad optimization algorithms work best with real-time event data

### Supported Data Types

- **Events**: Real-time tracking events (purchases, page views, etc.)
- **User Context**: User attributes sent with events
- **Product Data**: E-commerce product information
- **Custom Properties**: Event-specific custom properties

## Recommendations

### For Warehouse Data Activation

1. **Use Event Stream**: Transform warehouse data into track events
2. **Batch Processing**: Process warehouse data in batches to generate events
3. **Real-time Sync**: Set up real-time or near-real-time data pipelines
4. **Event Modeling**: Model warehouse data as discrete events rather than profile updates

### Data Modeling Best Practices

When sending warehouse data to TikTok Ads:

1. **Event-First Approach**: Model data as events (purchases, views, interactions)
2. **Include Timestamps**: Use actual event timestamps from warehouse data
3. **User Context**: Include user identifiers and context with each event
4. **Deduplication**: Use consistent event IDs to prevent duplicates

## Future Considerations

While RETL is not currently supported, the integration could potentially be extended to support:

1. **Bulk Event Upload**: Processing warehouse records as batch events
2. **Audience Sync**: Integration with TikTok's Custom Audiences API
3. **Profile Updates**: If TikTok introduces profile-based APIs

However, any such extensions would require:
- Updates to the destination configuration
- New transformer logic for record event handling
- Compliance with TikTok's API capabilities and limitations

## Summary

The TikTok Ads destination supports RETL functionality through:

- **RETL Support**: Yes, via warehouse source type support
- **JSON Mapper**: Supported by default for data transformation
- **VDM v1**: Not supported (no `supportsVisualMapper`)
- **VDM v2**: Not supported (no `record` message type)
- **Supported Events**: Track events only
- **API Integration**: TikTok Ads Events API for event delivery

**Limitations**:
- No VDM v1 or VDM v2 support (JSON mapper only)
- Limited to track events only
- No identify, page, screen, group, or alias event support for RETL
