# Facebook Conversions API - RETL Functionality

## RETL Support Status

**RETL Support**: ❌ **Not Available**

The Facebook Conversions API destination does not support RETL (Real-time Extract, Transform, Load) functionality.

## Technical Analysis

### VDM v2 Support

- **Record Event Type**: Not supported
- **MappedToDestination Logic**: Not implemented
- **Database Configuration**: No `record` event type in `supportedMessageTypes`

```json
// From db-config.json
"supportedMessageTypes": {
  "cloud": ["page", "screen", "track"]
  // Note: "record" is not included
}
```

### Implementation Details

The destination uses a standard processor-based implementation:

```json
// From db-config.json
"transformAtV1": "processor"
```

This configuration indicates that the destination:
- Processes events individually
- Does not support batch warehouse operations
- Lacks RETL-specific event handling logic

### Code Analysis

The transform logic in `transform.js` only handles:
- `EventType.PAGE`
- `EventType.SCREEN` 
- `EventType.TRACK`

No handling for `record` event types or `mappedToDestination` flags is present.

## Alternative Approaches for Warehouse Data

Since RETL is not supported, consider these alternatives for sending warehouse data to Facebook:

### 1. Facebook Bulk Import API

**Recommended for**: Large-scale historical data imports

- **Endpoint**: Facebook's native bulk import functionality
- **Format**: CSV or JSON file uploads
- **Capacity**: Handles millions of events efficiently
- **Use Case**: Initial data migration, historical data backfill

**Implementation Steps**:
1. Export data from warehouse in Facebook-compatible format
2. Use Facebook's bulk import interface in Events Manager
3. Map warehouse fields to Facebook event parameters
4. Schedule regular bulk imports for batch processing

### 2. Custom ETL Pipeline

**Recommended for**: Automated warehouse-to-Facebook data flows

```javascript
// Example custom ETL approach
const warehouseToFacebook = async (warehouseData) => {
  // 1. Extract data from warehouse
  const events = await extractFromWarehouse(warehouseData);
  
  // 2. Transform to Facebook format
  const facebookEvents = events.map(transformToFacebookEvent);
  
  // 3. Send via Conversions API
  await sendToFacebookAPI(facebookEvents);
};
```

**Components**:
- **Data Extraction**: Query warehouse for event data
- **Data Transformation**: Convert to Facebook Conversions API format
- **Batch Processing**: Send events in batches to Facebook
- **Error Handling**: Retry logic and failure management

### 3. Real-time Streaming Integration

**Recommended for**: Ongoing real-time data synchronization

- **Method**: Use RudderStack's standard cloud mode integration
- **Trigger**: Stream events from warehouse to RudderStack
- **Processing**: Events processed through standard Facebook Conversions destination
- **Latency**: Near real-time event delivery

### 4. Facebook S3 Data Import

**Recommended for**: Automated file-based imports

- **Setup**: Configure S3 bucket for Facebook data import
- **Format**: Upload events in Facebook-specified format
- **Automation**: Schedule regular file uploads
- **Processing**: Facebook automatically processes uploaded files

## Warehouse Integration Patterns

### Pattern 1: Scheduled Batch Export

```sql
-- Example warehouse query for Facebook events
SELECT 
  user_id as external_id,
  email,
  event_name,
  event_time,
  properties,
  custom_data
FROM warehouse_events 
WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
  AND facebook_sent = false;
```

### Pattern 2: Change Data Capture (CDC)

- **Monitor**: Warehouse table changes
- **Trigger**: Real-time event streaming
- **Transform**: Convert to Facebook format
- **Send**: Via standard RudderStack integration

### Pattern 3: Hybrid Approach

1. **Historical Data**: Use bulk import for existing data
2. **Real-time Data**: Use RudderStack cloud mode for new events
3. **Batch Updates**: Regular bulk imports for data corrections

## Data Mapping Considerations

When implementing alternative approaches, ensure proper mapping:

### User Data Mapping

```javascript
// Warehouse to Facebook user data mapping
const mapUserData = (warehouseUser) => ({
  external_id: sha256(warehouseUser.user_id),
  em: sha256(warehouseUser.email.toLowerCase().trim()),
  ph: sha256(warehouseUser.phone),
  fn: sha256(warehouseUser.first_name.toLowerCase()),
  ln: sha256(warehouseUser.last_name.toLowerCase()),
  // ... other fields
});
```

### Event Data Mapping

```javascript
// Warehouse to Facebook event mapping
const mapEventData = (warehouseEvent) => ({
  event_name: mapEventName(warehouseEvent.event_type),
  event_time: Math.floor(warehouseEvent.timestamp / 1000),
  action_source: 'website', // or determine from context
  custom_data: {
    value: warehouseEvent.revenue,
    currency: warehouseEvent.currency || 'USD',
    // ... other custom properties
  }
});
```

## Implementation Recommendations

### For Large-scale Data Migration

1. **Use Facebook Bulk Import**: Most efficient for historical data
2. **Batch Processing**: Process data in chunks to avoid rate limits
3. **Data Validation**: Ensure data quality before import
4. **Monitoring**: Track import success and failures

### For Ongoing Data Synchronization

1. **Real-time Streaming**: Use RudderStack cloud mode
2. **Event Deduplication**: Implement unique event IDs
3. **Error Handling**: Robust retry mechanisms
4. **Data Quality**: Validate events before sending

### For Mixed Requirements

1. **Hybrid Architecture**: Combine bulk import and real-time streaming
2. **Data Governance**: Clear data flow documentation
3. **Monitoring**: Comprehensive tracking across all data flows
4. **Backup Strategy**: Alternative data delivery methods

## Limitations and Considerations

### Facebook API Limitations

- **Rate Limits**: No specific Conversions API limits, but Graph API limits apply
- **Data Retention**: Facebook's data retention policies
- **Attribution Windows**: Limited attribution window for historical events

### Data Quality Requirements

- **User Matching**: Sufficient user identifiers for Facebook matching
- **Event Timing**: Events should be reasonably recent for attribution
- **Data Format**: Strict adherence to Facebook's data format requirements

### Privacy and Compliance

- **Data Hashing**: PII must be hashed before sending
- **Consent Management**: Ensure proper user consent for data sharing
- **Regional Compliance**: GDPR, CCPA, and other privacy regulations

## Monitoring and Troubleshooting

### Key Metrics to Track

- **Event Delivery Rate**: Percentage of successfully delivered events
- **Data Quality Score**: Facebook's data quality metrics
- **Attribution Performance**: Conversion attribution accuracy
- **Error Rates**: Failed event delivery rates

### Common Issues

1. **Data Format Errors**: Incorrect event structure or missing fields
2. **User Matching Issues**: Insufficient user identifiers
3. **Rate Limiting**: Exceeding Facebook's API limits
4. **Attribution Delays**: Events outside attribution windows

## Future Considerations

### Potential RETL Implementation

If RETL support is added in the future, it would require:

1. **Record Event Support**: Handle `record` event types
2. **MappedToDestination Logic**: Implement warehouse-specific processing
3. **Batch Processing**: Efficient handling of large data volumes
4. **Configuration Updates**: Add RETL-specific settings

### Migration Path

When RETL becomes available:

1. **Gradual Migration**: Phase out custom ETL solutions
2. **Data Validation**: Ensure consistency between approaches
3. **Performance Testing**: Validate RETL performance vs. alternatives
4. **Documentation Updates**: Update integration guides

## Conclusion

While the Facebook Conversions API destination does not currently support RETL functionality, several robust alternatives exist for warehouse-to-Facebook data integration. The choice of approach depends on:

- **Data Volume**: Bulk import for large datasets, streaming for real-time needs
- **Latency Requirements**: Real-time vs. batch processing needs
- **Technical Resources**: Available development and maintenance capacity
- **Data Governance**: Compliance and data quality requirements

For most use cases, a combination of Facebook's bulk import capabilities for historical data and RudderStack's real-time streaming for ongoing events provides an optimal solution.
