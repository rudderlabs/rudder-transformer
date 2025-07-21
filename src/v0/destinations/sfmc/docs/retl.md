# Salesforce Marketing Cloud RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes**

The Salesforce Marketing Cloud destination supports RETL functionality. Evidence:
- `supportedSourceTypes` includes `warehouse` which indicates RETL support
- JSON mapper is supported by default (no `disableJsonMapper: true` in config)
- `supportsVisualMapper: true` indicates VDM v1 support
- Transformer code implements `mappedToDestination` logic handling
- Supports data flow from warehouses/databases to SFMC

## RETL Support Analysis

### Which type of retl support does it have?
- **JSON Mapper**: Supported (default, no `disableJsonMapper: true`)
- **VDM V1**: Supported (`supportsVisualMapper: true` in `db-config.json`)
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`)

### Does it have vdm support?
**Yes** - `supportsVisualMapper: true` is present in `db-config.json`, confirming VDM V1 support.

### Does it have vdm v2 support?
**No** - Missing both:
- `supportedMessageTypes > record` in `db-config.json`
- Record event type handling in transformer code

### Connection config
Standard SFMC configuration applies:
- **Client ID**: Your SFMC API client ID
- **Client Secret**: Your SFMC API client secret
- **Subdomain**: Your SFMC instance subdomain
- **External Key**: The external key of the data extension to use for RETL data

## RETL Flow Implementation

### Warehouse Integration

SFMC supports RETL through warehouse sources with both JSON mapper and VDM v1 functionality:

- **Supported**: Yes, warehouse sources can send data to SFMC via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Identify and track events
- **Data Flow**: Warehouse/Database → RudderStack → SFMC (via Data Extensions API)
- **Mapping**: JSON mapper and VDM v1 transform warehouse data to SFMC format

### Supported Message Types for RETL
```json
"supportedMessageTypes": {
  "cloud": ["identify", "track"]
}
```

### RETL Event Processing

The SFMC destination processes RETL events through specialized `mappedToDestination` logic:

1. **Event Detection**: Checks for `context.mappedToDestination` flag
2. **External ID Processing**: Extracts object type and identifier from external IDs
3. **Data Extension Updates**: Routes to Data Extension API endpoints
4. **Trait Mapping**: Maps all message traits to Data Extension values

### Mapped to Destination Logic

```javascript
const mappedToDestination = get(message, MappedToDestinationKey);
if (mappedToDestination && GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())) {
  return retlResponseBuilder(message, destination, metadata);
}
```

### Supported Object Types

Currently, RETL flow only supports **Data Extension** object type:

```javascript
if (objectType?.toLowerCase() === 'data extension') {
  // Process for Data Extension
} else {
  throw new PlatformError('Unsupported object type for rETL use case');
}
```

## Data Flow

### RETL Data Processing

1. **Data Extraction**: Warehouse/database data extracted by RudderStack
2. **Mapping**: Data transformed using JSON mapper or VDM v1 configuration
3. **Event Construction**: Warehouse records converted to SFMC events (identify/track)
4. **External ID Processing**: Extract object type and identifier from external IDs
5. **API Delivery**: Data sent to SFMC Data Extensions API

### Example RETL Event

```javascript
// Warehouse record transformed to SFMC event
{
  "type": "identify",
  "traits": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "plan": "premium"
  },
  "context": {
    "mappedToDestination": true,
    "externalId": [
      {
        "type": "SFMC-data extension",
        "id": "user@example.com",
        "identifierType": "Contact Key"
      }
    ]
  }
}
```

### API Implementation

```javascript
// PUT request to Data Extension
PUT https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/{identifierType}:{destinationExternalId}

{
  "values": {
    ...message.traits
  }
}
```

## Rate Limits and Constraints

### SFMC API Limits
- **Data Extensions API**: Standard SFMC API rate limits apply
- **Authentication**: OAuth 2.0 token-based authentication
- **Request Size**: Standard SFMC API request size limits

### RETL Processing Constraints
- **Object Types**: Limited to Data Extension objects only
- **Message Types**: Identify and track events only
- **External ID Required**: Must include valid SFMC external ID structure
- **Cloud Mode Only**: Device mode not supported for RETL

### RETL External ID Format

For RETL to work with SFMC, the message must include an external ID in the following format:

```json
{
  "context": {
    "externalId": [
      {
        "type": "SFMC-data extension",
        "id": "value-of-identifier",
        "identifierType": "identifier-field-name"
      }
    ]
  }
}
```

Where:
- `type`: Must start with "SFMC-" followed by the object type (currently only "data extension" is supported)
- `id`: The value of the identifier field in the Data Extension
- `identifierType`: The name of the identifier field in the Data Extension

## Summary

The Salesforce Marketing Cloud destination supports RETL functionality through:

- **RETL Support**: Yes, via warehouse source type support
- **JSON Mapper**: Supported by default for data transformation
- **VDM v1**: Supported (`supportsVisualMapper: true`)
- **VDM v2**: Not supported (no `record` message type)
- **Supported Events**: Identify and track events
- **API Integration**: SFMC Data Extensions API for data delivery
- **Object Types**: Data Extension objects only

**Limitations**:
- Limited to Data Extension objects only
- No VDM v2 support (no record message type)
- Requires proper external ID structure for RETL routing