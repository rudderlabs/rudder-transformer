# Split.io RETL Functionality

## Overview

Split.io destination **does not support RETL (Real-time Extract, Transform, Load)** functionality.

## VDM v2 Support

- **Supported**: No
- **Reason**: Split.io destination does not handle `record` event types
- **Evidence**: The `supportedMessageTypes` in `db-config.json` does not include `record` events

## RETL Flow Support

Split.io destination does not implement any RETL-specific logic:

- No handling for `mappedToDestination === true` conditions
- No processing of `record` event types
- No warehouse-to-destination data flows

## Supported Data Flow

Split.io destination only supports **Event Stream** functionality:

- Real-time event processing from RudderStack SDKs
- Cloud mode integration only
- Direct API calls to Split.io Events API

## Alternative Approaches

For warehouse-to-Split.io data flows, consider:

1. **Batch Event Processing**: Use Split.io's bulk events API directly from your data warehouse
2. **ETL Tools**: Use external ETL tools to process warehouse data and send to Split.io
3. **Custom Integration**: Build custom scripts to extract data from warehouse and send to Split.io Events API

## Documentation References

- [Split.io Events API](https://docs.split.io/reference/events-overview)
- [Split.io Bulk Events API](https://docs.split.io/reference/create-events)
- [RudderStack Event Stream Documentation](https://rudderstack.com/docs/destinations/streaming-destinations/)
