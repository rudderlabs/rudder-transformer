# Bluecore RETL (Reverse ETL) Functionality

## Overview

**RETL Support Status**: Not Available

The Bluecore destination integration does not currently support RETL (Reverse ETL) functionality. This integration is designed specifically for event stream processing and does not handle `record` message types that are typically used in RETL workflows.

## VDM v2 Support

**VDM v2 Support**: Not Available

- The Bluecore destination does not support Visual Data Mapper (VDM) v2 functionality
- No `record` message type support is present in the configuration
- The integration is focused on real-time event streaming rather than batch data synchronization

## Configuration Analysis

Based on the destination configuration in `db-config.json`:

```json
{
  "supportedMessageTypes": {
    "cloud": ["identify", "track"]
  }
}
```

**Key Findings:**

- Only `identify` and `track` message types are supported
- No `record` message type support (required for RETL)
- Cloud mode only - no warehouse connection capabilities

## RETL Alternative Approaches

Since Bluecore does not support native RETL functionality through RudderStack, consider these alternative approaches:

### 1. Event Stream to Bluecore

- Use standard `identify` and `track` events to sync customer data
- Implement real-time data synchronization instead of batch processing
- Leverage Bluecore's customer profile management for data consolidation

### 2. Custom Data Pipeline

- Extract data from your warehouse using other tools
- Transform data into RudderStack event format
- Send events through RudderStack's event stream pipeline to Bluecore

### 3. Direct API Integration

- Use Bluecore's direct API for bulk data operations
- Implement custom ETL processes outside of RudderStack
- Consider Bluecore's bulk import capabilities if available

## Connection Configuration

**RETL Connection Settings**: Not Applicable

Since RETL is not supported, there are no specific connection configuration options for reverse ETL workflows. The standard destination configuration applies:

- **Bluecore Namespace**: Required for authentication
- **Event Mappings**: Optional custom event mappings
- **Connection Mode**: Cloud mode only

## Data Flow Limitations

### What's Not Supported:

- Bulk data synchronization from warehouses
- `record` message type processing
- Scheduled data syncs
- Table-to-destination mapping
- Column-level data transformations typical in RETL

### What's Supported Instead:

- Real-time event streaming
- Individual customer profile updates
- E-commerce event tracking
- Subscription management events

## Recommendations

### For Bulk Data Needs:

1. **Evaluate Bluecore's Native Import Options**: Check if Bluecore provides bulk import APIs or file-based import capabilities
2. **Consider Event Stream Approach**: Design your data pipeline to send individual events rather than bulk records
3. **Hybrid Approach**: Use RETL for other destinations and event streams for Bluecore

### For Real-time Requirements:

1. **Use Event Streams**: Leverage the existing event stream integration for real-time data sync
2. **Optimize Event Volume**: Use event filtering to manage the volume of events sent to Bluecore
3. **Monitor Performance**: Track event processing times and success rates

## Future Considerations

For information about potential future RETL support:

- Check for `record` message type support in future releases
- Monitor RudderStack updates for VDM v2 integration possibilities

## Related Documentation

- [Main Bluecore Documentation](../README.md) - Complete integration guide
- [Business Logic Documentation](./businesslogic.md) - Detailed business logic and mappings
- [RudderStack RETL Documentation](https://docs.rudderstack.com/data-pipelines/reverse-etl/) - General RETL information

---

**Note**: This document reflects the current state of RETL support for the Bluecore destination. For the most up-to-date information about potential RETL capabilities, please check the latest RudderStack documentation or contact the RudderStack support team.
