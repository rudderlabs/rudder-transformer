# MoEngage RETL Functionality

## VDM v2 Support

**Supported**: No

The MoEngage destination does not support VDM v2 (Warehouse Destinations v2) functionality. This is evidenced by:

- No `record` event type in the `supportedMessageTypes` configuration
- No handling for `record` events in the transformation logic
- No `mappedToDestination` logic implementation

## RETL Flow

Since MoEngage does not support VDM v2, there is no specific RETL (Real-time Extract, Transform, Load) flow implemented for this destination.

### Supported Event Types for Cloud Mode

The MoEngage destination supports the following event types in cloud mode:

- **Identify**: For updating user attributes and profiles
- **Track**: For tracking custom events and user behavior
- **Alias**: For merging user profiles and identity resolution

### Warehouse Integration

For warehouse-based data integration with MoEngage, consider:

1. **Alternative Approaches**:
   - Use MoEngage's Bulk Import API for large-scale data imports
   - Implement custom ETL processes using MoEngage's Data APIs
   - Use MoEngage's S3 Data Import feature for batch processing

2. **API-Based Integration**:
   - Leverage MoEngage's Track User API for user attribute updates
   - Use Create Event API for event data ingestion
   - Implement custom scheduling for batch data processing

## Recommendations

For warehouse-to-MoEngage data flows, we recommend:

1. **Batch Processing**: Use MoEngage's bulk import capabilities for large datasets
2. **Real-time Streaming**: Use the standard cloud mode integration for real-time data
3. **Hybrid Approach**: Combine batch imports for historical data and real-time streaming for ongoing events

## Documentation References

- [MoEngage Bulk Import API](https://developers.moengage.com/hc/en-us/articles/4413174113044-Bulk-Import)
- [MoEngage S3 Data Import](https://developers.moengage.com/hc/en-us/articles/4577796892308-S3-Data-Import)
- [MoEngage Data APIs Overview](https://developers.moengage.com/hc/en-us/articles/4404674776724-Overview)
