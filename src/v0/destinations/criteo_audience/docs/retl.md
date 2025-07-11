# Criteo Audience RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes**

The Criteo Audience destination supports RETL functionality. Evidence:
- `supportedSourceTypes` includes `warehouse` which indicates RETL support
- `supportsVisualMapper: true` indicates VDM v1 support
- `disableJsonMapper: true` (JSON mapper disabled, only VDM supported)
- Supports data flow from warehouses/databases to Criteo for audience management

## RETL Support Analysis

### Which type of retl support does it have?
- **JSON Mapper**: Not supported (`disableJsonMapper: true`)
- **VDM V1**: Supported (`supportsVisualMapper: true` in `db-config.json`)
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`)

### Does it have vdm support?
**Yes** - `supportsVisualMapper: true` is present in `db-config.json`, confirming VDM V1 support.

### Does it have vdm v2 support?
**No** - Missing both:
- `supportedMessageTypes > record` in `db-config.json`
- Record event type handling in transformer code

### Connection config
Standard Criteo Audience configuration applies:
- **Client ID**: Criteo API client ID
- **Client Secret**: Criteo API client secret
- **Audience ID**: Target audience segment ID
- **Audience Type**: Type of identifier (email, maid, gum, identityLink)

## RETL Flow Implementation

### Warehouse Integration

Criteo Audience supports RETL through warehouse sources with VDM v1 functionality:

- **Supported**: Yes, warehouse sources can send data to Criteo via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Audiencelist events only
- **Data Flow**: Warehouse/Database → RudderStack → Criteo (via Audience API)
- **Mapping**: VDM v1 transforms warehouse data to Criteo audience format

### Supported Message Types for RETL
```json
"supportedMessageTypes": {
  "cloud": ["audiencelist"]
}
```

### RETL Event Processing

The Criteo Audience destination processes RETL events through audiencelist events for audience management.

## Data Flow

### RETL Data Processing

1. **Data Extraction**: Warehouse/database data extracted by RudderStack
2. **VDM v1 Mapping**: Data transformed using visual data mapper configuration
3. **Event Construction**: Warehouse records converted to Criteo audiencelist events
4. **Batch Processing**: Identifiers chunked into batches of 50,000
5. **API Delivery**: Audience updates sent to Criteo Audience API

### Example RETL Event

```javascript
// Warehouse record transformed to Criteo audiencelist event
{
  "type": "audiencelist",
  "properties": {
    "listData": {
      "add": [
        { "email": "user1@example.com" },
        { "email": "user2@example.com" }
      ],
      "remove": [
        { "email": "user3@example.com" }
      ]
    }
  }
}
```

## Configuration

### Required Settings

- **audienceId**: Criteo Audience Segment ID
- **audienceType**: Type of identifier to use (email, maid, gum, identityLink)
- **gumCallerId**: Required when audienceType is 'gum'

### Optional Settings

- None

## Data Mapping

### Standard Fields

| RudderStack Field                          | Criteo Field  | Notes                               |
| ------------------------------------------ | ------------- | ----------------------------------- |
| `properties.listData.[op].[].email`        | `identifiers` | When audienceType is 'email'        |
| `properties.listData.[op].[].maid`         | `identifiers` | When audienceType is 'maid'         |
| `properties.listData.[op].[].gum`          | `identifiers` | When audienceType is 'gum'          |
| `properties.listData.[op].[].identityLink` | `identifiers` | When audienceType is 'identityLink' |

Where `[op]` can be either `add` or `remove` to specify the operation type.

### Custom Fields

| RudderStack Field     | Criteo Field     | Notes                            |
| --------------------- | ---------------- | -------------------------------- |
| `Config.audienceType` | `identifierType` | Type of identifier being used    |
| `Config.gumCallerId`  | `gumCallerId`    | Required for GUM identifier type |

## Transformation Logic

### Event Validation

1. **Required Fields**:

   - `type`: Must be 'audiencelist'
   - `properties`: Must be present
   - `properties.listData`: Must be present
   - `properties.listData.add` or `properties.listData.remove`: At least one must be present

2. **Identifier Validation**:
   - Each object in `add` or `remove` arrays must contain the identifier type specified in the configuration
   - For GUM identifier type, `gumCallerId` must be provided in the configuration

### Payload Construction

1. **Batch Processing**:

   - Identifiers are automatically chunked into batches of 50,000
   - Each batch is processed as a separate request
   - Chunking is handled by the `populateIdentifiers` function

2. **Payload Structure**:

   ```javascript
   // For adding users
   {
     data: {
       type: 'ContactlistAmendment',
       attributes: {
         operation: 'add',
         identifierType: 'email' | 'maid' | 'gum' | 'identityLink',
         internalIdentifiers: false,
         gumCallerId: 'your-gum-caller-id', // Only for GUM type
         identifiers: ['identifier1', 'identifier2', ...]
       }
     }
   }

   // For removing users
   {
     data: {
       type: 'ContactlistAmendment',
       attributes: {
         operation: 'remove',
         identifierType: 'email' | 'maid' | 'gum' | 'identityLink',
         internalIdentifiers: false,
         gumCallerId: 'your-gum-caller-id', // Only for GUM type
         identifiers: ['identifier1', 'identifier2', ...]
       }
     }
   }
   ```

3. **Operation Handling**:
   - Each request can only perform one operation (add or remove)
   - If both add and remove operations are present in the input, they are processed as separate requests
   - The operation type is determined by the source of the identifiers (add or remove array)

## Error Handling

### Error Types

1. **Configuration Errors**:

   - Missing required configuration
   - Invalid audience type
   - Missing GUM caller ID for GUM audience type

2. **Validation Errors**:

   - Missing required fields
   - Invalid event type
   - Invalid identifier format

3. **API Errors**:
   - 401: Authentication errors
   - 404: Invalid audience ID
   - 429: Rate limiting
   - 500/503: Server errors

### Retry Logic

1. **Retryable Errors**:

   - 429: Rate limiting
   - 500: Internal server error
   - 503: Service unavailable

2. **Retry Strategy**:
   - Maximum 3 retries
   - Exponential backoff with jitter
   - Retry delay increases with each attempt

## Performance Considerations

### Batch Size

- Maximum 50,000 identifiers per batch
- Automatic chunking for larger datasets
- Parallel processing of chunks

### Rate Limiting

- Automatic handling of rate limits
- Exponential backoff for retries
- Request throttling based on response headers

## Rate Limits and Constraints

### Criteo API Limits
- **Batch Size**: Maximum 50,000 identifiers per batch
- **Rate Limiting**: Automatic handling with exponential backoff
- **Request Throttling**: Based on response headers
- **Retry Strategy**: Maximum 3 retries with exponential backoff

### RETL Processing Constraints
- **Message Types**: Limited to audiencelist events only
- **VDM v1 Only**: JSON mapper disabled (`disableJsonMapper: true`)
- **Cloud Mode Only**: Device mode not supported for RETL
- **Identifier Types**: Supports email, maid, gum, identityLink

### Batch Processing
- **Automatic Chunking**: Large datasets split into 50,000 identifier batches
- **Parallel Processing**: Multiple chunks processed concurrently
- **Operation Separation**: Add and remove operations processed separately

## Summary

The Criteo Audience destination supports RETL functionality through:

- **RETL Support**: Yes, via warehouse source type support
- **JSON Mapper**: Not supported (`disableJsonMapper: true`)
- **VDM v1**: Supported (`supportsVisualMapper: true`)
- **VDM v2**: Not supported (no `record` message type)
- **Supported Events**: Audiencelist events only
- **API Integration**: Criteo Audience API for audience management
- **Batch Processing**: Automatic chunking up to 50,000 identifiers per batch

**Key Features**:
- Audience segment management with add/remove operations
- Support for multiple identifier types (email, maid, gum, identityLink)
- Automatic batch processing for large datasets
- Comprehensive error handling and retry logic
- Rate limit management with exponential backoff

**Limitations**:
- VDM v1 only (no JSON mapper or VDM v2)
- Limited to audiencelist events for audience management
- Requires proper audience configuration and identifier types
