# AppsFlyer RETL Functionality

## Overview

**RETL Support**: Not Available

The AppsFlyer destination does not currently support RETL (Real-time Extract, Transform, Load) functionality.

## VDM v2 Support

**VDM v2 Support**: No

### Analysis

Based on the configuration analysis:

1. **Missing Record Event Support**: The `db-config.json` file does not include `record` in the `supportedMessageTypes`, which is a requirement for VDM v2 support.

2. **No Record Event Handling**: The transformer implementation (`transform.js`) only handles:
   - `track` events
   - `page` events  
   - `screen` events

3. **No mappedToDestination Logic**: The codebase does not contain any logic that checks for `mappedToDestination === true` or handles record event types.

## Current Implementation

The AppsFlyer destination is designed specifically for **Event Stream** functionality:

- **Supported Message Types**: `track`, `page`, `screen`
- **Processing Mode**: Individual event processing via Server-to-Server API
- **Data Flow**: Direct event forwarding to AppsFlyer endpoints

## RETL Requirements Not Met

For a destination to support RETL functionality, the following requirements must be met:

### 1. Configuration Requirements
- ❌ `record` event type in `supportedMessageTypes`
- ❌ VDM v2 configuration in `db-config.json`

### 2. Implementation Requirements  
- ❌ Record event handling in transformer
- ❌ `mappedToDestination` logic implementation
- ❌ RETL-specific data processing flows

### 3. API Requirements
- ❌ Bulk/batch API endpoints for RETL data
- ❌ RETL-compatible data formats

## Alternative Solutions

For users requiring RETL-like functionality with AppsFlyer:

### 1. Event Stream Processing
- Use the existing event stream functionality
- Process data in real-time as events occur
- Leverage AppsFlyer's Server-to-Server Events API

### 2. Custom Integration
- Implement custom data pipeline outside RudderStack
- Use AppsFlyer's raw data export capabilities
- Build custom ETL processes for historical data

### 3. Third-party Tools
- Consider using AppsFlyer's native data connectors
- Explore AppsFlyer's partnership integrations
- Use AppsFlyer's Push API for data delivery

## Future Considerations

**NEEDS REVIEW**: To enable RETL support for AppsFlyer destination, the following would need to be implemented:

1. **Configuration Updates**:
   - Add `record` to `supportedMessageTypes` in `db-config.json`
   - Configure VDM v2 support parameters

2. **Transformer Updates**:
   - Add record event handling in `transform.js`
   - Implement `mappedToDestination` logic
   - Create RETL-specific data processing flows

3. **API Integration**:
   - Identify suitable AppsFlyer APIs for bulk data operations
   - Implement batch processing capabilities
   - Handle RETL-specific data formats and requirements

4. **Testing and Validation**:
   - Create comprehensive test cases for RETL flows
   - Validate data integrity and processing accuracy
   - Ensure compatibility with existing event stream functionality

## Conclusion

The AppsFlyer destination currently focuses on real-time event streaming and does not support RETL functionality. Users requiring historical data processing or bulk data operations should consider alternative approaches or request RETL support as a feature enhancement.

For current event streaming capabilities, refer to the main [README.md](../README.md) documentation.
