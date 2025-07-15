# Attentive Tag RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **No**

The Attentive Tag destination does not support RETL functionality. Evidence:

- No `supportedSourceTypes` includes `warehouse` in configuration
- No `mappedToDestination` logic handling in transformer code
- No support for data flow from warehouses/databases to Attentive Tag
- No VDM (Visual Data Mapper) support indicated

## RETL Support Analysis

### Which type of retl support does it have?

- **JSON Mapper**: Not supported
- **VDM V1**: Not supported
- **VDM V2**: Not supported

### Does it have vdm support?

**No** - No VDM support indicators found in configuration or code.

### Does it have vdm v2 support?

**No** - No `record` message type support or VDM v2 indicators found.

### Connection config

Standard Attentive Tag configuration applies:

- **API Key**: Attentive Tag API key for authentication
- **Sign Up Source ID**: Required for subscription events
- **Enable New Identify Flow**: Optional setting for new identify flow

## RETL Flow Implementation

### Warehouse Integration

Attentive Tag does not support RETL through warehouse sources:

- **Supported**: No, warehouse sources cannot send data to Attentive Tag via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Identify and track events only
- **Data Flow**: Direct event stream only, no warehouse integration
- **Mapping**: No RETL mapping support

### Supported Message Types for RETL

```json
"supportedMessageTypes": {
  "cloud": ["identify", "track"]
}
```

### RETL Event Processing

The Attentive Tag destination does not implement special handling for events that come from RETL sources. There is no `mappedToDestination` logic in the transformer code.

#### Key RETL-Specific Behaviors

1. **No RETL Support**: The transformer does not include any RETL-specific logic
2. **No Warehouse Integration**: No support for warehouse data sources
3. **No VDM Support**: No visual data mapping capabilities

## Data Flow

### Standard Event Processing

1. **Data Source**: Direct event stream from RudderStack sources
2. **Mapping**: Standard field mapping using JSON configuration files
3. **Event Construction**: Events converted to Attentive Tag format
4. **API Delivery**: Events sent to Attentive Tag via REST API endpoints

### Example Event Processing

```javascript
// Standard identify event
{
  "type": "identify",
  "userId": "user123",
  "traits": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe"
  },
  "context": {
    "externalId": [
      {
        "id": "external_user_123",
        "type": "clientUserId"
      }
    ]
  }
}
```

**Transformed Attentive Tag Payload:**

```json
{
  "user": {
    "email": "user@example.com",
    "phone": "+1234567890"
  },
  "signUpSourceId": "241654",
  "externalIdentifiers": {
    "clientUserId": "external_user_123"
  }
}
```

## Rate Limits and Constraints

### Attentive Tag API Limits

- **REST API**: Standard Attentive Tag API rate limits apply (not publicly documented)
- **Batch Size**: No batching support, events processed individually
- **Request Rate**: Not publicly documented

### RETL Processing Constraints

- **Message Types**: No RETL support
- **JSON Mapper and VDM**: Not supported
- **Cloud Mode Only**: Device mode not supported
- **No Warehouse Integration**: Cannot process warehouse data

## Summary

The Attentive Tag destination does not support RETL functionality:

- **RETL Support**: No
- **JSON Mapper**: Not supported
- **VDM v1**: Not supported
- **VDM v2**: Not supported
- **Supported Events**: Identify and track events only (direct stream)
- **API Integration**: Attentive Tag REST API for data delivery
- **No RETL Logic**: No `mappedToDestination` flag or special handling

**Key Features**:

- Direct event stream processing only
- Standard field mapping using JSON configuration
- No warehouse integration
- No VDM support

**Limitations**:

- No RETL functionality
- No warehouse data source support
- No visual data mapping
- No batch processing
- Limited to identify and track events only

## Alternative Approaches

Since Attentive Tag does not support RETL, consider these alternatives:

1. **Direct Integration**: Use RudderStack's direct event streaming to Attentive Tag
2. **Custom ETL**: Build custom ETL processes to transform warehouse data into RudderStack events
3. **Scheduled Jobs**: Use scheduled jobs to periodically sync warehouse data through RudderStack events
4. **Third-party Tools**: Use third-party ETL tools to transform warehouse data into the required format

## Conclusion

Attentive Tag is designed for real-time event streaming and does not support RETL functionality. For data warehouse integration, consider using direct event streaming or building custom ETL processes to transform warehouse data into RudderStack events.
