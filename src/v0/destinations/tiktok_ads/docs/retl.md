# TikTok Ads RETL Functionality

## RETL Support Status

**RETL (Real-time Extract, Transform, Load) Support**: **Not Supported**

## VDM v2 Support

**VDM v2 Support**: **No**

The TikTok Ads destination does not support VDM v2 (Warehouse Destinations v2) functionality. This is evidenced by:

1. **Missing Record Message Type**: The `supportedMessageTypes` configuration does not include the `record` message type, which is required for VDM v2 support.

2. **Current Supported Message Types**:
   ```json
   "supportedMessageTypes": {
     "cloud": ["track"],
     "device": {
       "web": ["identify", "track", "page"]
     }
   }
   ```

3. **No Record Event Handling**: The transformer code (`transform.js` and `transformV2.js`) only handles `track` events and does not include logic for processing `record` events.

## Warehouse Integration

While TikTok Ads lists `warehouse` as a supported source type, this refers to the ability to send data from warehouse sources through RudderStack's event stream functionality, not RETL-specific features.

### Warehouse Source Support

- **Supported**: Yes, warehouse sources can send events to TikTok Ads
- **Connection Mode**: Cloud mode only
- **Message Types**: Track events only
- **Data Flow**: Warehouse → RudderStack → TikTok Ads (via Events API)

## Alternative Approaches

For warehouse-based data activation to TikTok Ads, consider these alternatives:

### 1. Event Stream from Warehouse

Use RudderStack's warehouse sources to send track events:

```javascript
// Example: Sending e-commerce events from warehouse
{
  "type": "track",
  "event": "order completed",
  "properties": {
    "order_id": "12345",
    "value": 99.99,
    "currency": "USD",
    "products": [...]
  },
  "context": {
    "traits": {
      "email": "user@example.com"
    }
  }
}
```

### 2. Custom Audiences (Separate Integration)

For audience-based targeting, consider using TikTok's Custom Audiences API through other integrations or direct API calls.

### 3. Batch Processing

Implement batch processing of warehouse data to generate track events that can be sent through the standard event stream flow.

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

The TikTok Ads destination is optimized for real-time event tracking and does not support RETL functionality. For warehouse-based data activation, use the event stream approach by transforming warehouse data into track events that can be processed through the standard TikTok Ads integration flow.
