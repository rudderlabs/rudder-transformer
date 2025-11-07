# Airship RETL Functionality

## Overview

Airship destination **does not support RETL (Real-time Extract, Transform, Load)** functionality.

## VDM v2 Support

- **Supported**: No
- **Reason**: Airship destination does not handle `record` event types
- **Evidence**: The `supportedMessageTypes` in `db-config.json` does not include `record` events

```json
"supportedMessageTypes": {
  "cloud": ["identify", "track", "group"]
}
```

## RETL Flow Support

Airship destination does not implement any RETL-specific logic:

- No handling for `mappedToDestination === true` conditions
- No processing of `record` event types
- No warehouse-to-destination data flows

## Supported Data Flow

Airship destination only supports **Event Stream** functionality:

### Event Stream Flow

- **Supported Event Types**: Identify, Track, Group
- **Processing**: Real-time event processing from RudderStack sources
- **API Integration**: Direct API calls to Airship endpoints
- **Use Cases**:
  - Real-time user profile updates
  - Live event tracking
  - Immediate tag and attribute management

## Alternative Solutions for Warehouse Data

For customers who need to send warehouse data to Airship, consider these alternatives:

### 1. **Airship's Native Import Tools**

- **Bulk Import API**: For large datasets from data warehouses
- **CSV Upload**: Manual or automated CSV file uploads
- **S3 Integration**: Direct integration with S3 for bulk data imports

### 2. **RudderStack Event Stream**

- Use RudderStack's warehouse sources to stream data as events
- Transform warehouse data into Identify, Track, and Group events
- Leverage the existing event stream integration

### 3. **Custom ETL Pipeline**

- Build custom ETL processes to extract data from warehouses
- Transform data into RudderStack event format
- Send through RudderStack's event stream APIs

## Recommendations

For warehouse-to-Airship data flows, we recommend:

1. **Real-time Streaming**: Use the standard cloud mode integration for real-time data
2. **Bulk Processing**: Use Airship's native bulk import capabilities for large historical datasets
3. **Hybrid Approach**: Combine bulk imports for historical data and real-time streaming for ongoing events

## Documentation References

- [Airship API Documentation](https://docs.airship.com/api/ua/)
- [Airship Bulk Import Capabilities](https://docs.airship.com/guides/messaging/data/bulk-import/)
- [RudderStack Warehouse Sources](https://docs.rudderstack.com/sources/warehouse-sources/)
