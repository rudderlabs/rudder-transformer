# Facebook Custom Audience RETL Documentation

## RETL Support

**Supported**: Yes

Facebook Custom Audience destination supports RETL (Reverse ETL) functionality, allowing you to sync audience data from your warehouse to Facebook Custom Audiences.

## RETL Types Supported

### JSON Mapper Support

**Supported**: No

JSON Mapper is explicitly disabled for Facebook Custom Audience destination:

- Configuration: `"disableJsonMapper": true` in db-config.json
- Reason: Facebook Custom Audience requires specific field mappings and data transformations that are better handled through VDM flows

### VDM v1 Support

**Supported**: Yes

VDM v1 (Visual Data Mapper v1) is supported:

- Configuration: `"supportsVisualMapper": true` in db-config.json
- Allows visual mapping of warehouse fields to Facebook Custom Audience schema fields
- Supports custom field mapping through the RudderStack dashboard

**Note**: VDM v1 is supported but as we moved from audience list to record events, VDM v2 is being used now.

### VDM v2 Support

**Supported**: Yes

VDM v2 (Visual Data Mapper v2) is supported:

- Configuration: `"supportedMessageTypes": {"cloud": ["audiencelist", "record"]}` includes record type
- Enhanced VDM experience with improved field mapping capabilities
- Supports `record` message type processing in the transformer code

## Connection Configuration

### Warehouse Connection

When connecting from a warehouse source:

**Required Configuration**:

- **Ad Account ID**: The Facebook Ad Account ID where audiences will be managed
- **Access Token**: Facebook access token with `ads_read` and `ads_management` permissions
- **Connection Mode**: Must be set to "cloud"

**Optional Configuration**:

- **App Secret**: For enhanced security with app secret proof
- **User Schema**: Defines which fields to sync (automatically determined in VDM v2)
- **Is Hash Required**: Whether to hash user data (default: true)
- **Disable Format**: Whether to skip data formatting (default: false)

### Supported Source Types

- **Warehouse**: Primary RETL source type
- **Cloud**: For event stream integration
- **Shopify**: For e-commerce platform integration

## RETL Flow Implementation

### VDM v1 Flow

For events sent through VDM v1:

1. **Field Mapping**: Uses `context.destinationFields` to determine user schema
2. **Audience ID**: Extracted from `getDestinationExternalIDInfoForRetl()` with object type 'FB_CUSTOM_AUDIENCE'
3. **Data Processing**: Processes mapped fields according to Facebook's requirements
4. **Batching**: Applies 10,000 user limit per batch

```javascript
// VDM v1 Detection
if (isEventSentByVDMV1Flow(event)) {
  const { objectType } = getDestinationExternalIDInfoForRetl(message, 'FB_CUSTOM_AUDIENCE');
  operationAudienceId = objectType;
  updatedUserSchema = getSchemaForEventMappedToDest(message);
}
```

### VDM v2 Flow

For events sent through VDM v2:

1. **Field Mapping**: Uses `message.identifiers` to determine user schema
2. **Audience ID**: Uses configured audience ID from connection settings
3. **Data Processing**: Processes identifier fields directly
4. **Value-Based Audiences**: Supports `isValueBasedAudience` configuration

```javascript
// VDM v2 Detection and Processing
if (isEventSentByVDMV2Flow(event)) {
  const identifiers = message?.identifiers;
  userSchema = Object.keys(identifiers);
  // Process with value-based audience support
}
```

## Record Event Type Handling

### Supported Actions

- **Insert**: Adds users to the custom audience (maps to 'add' operation)
- **Update**: Updates user data in the custom audience (maps to 'add' operation)
- **Delete**: Removes users from the custom audience (maps to 'remove' operation)

### Action Processing

```javascript
const processAction = async (action, operation) => {
  if (groupedRecordsByAction[action]) {
    // Special validation for value-based audiences
    if (
      isValueBasedAudience &&
      !cleanUserSchema.includes('LOOKALIKE_VALUE') &&
      operation === 'add'
    ) {
      throw new ConfigurationError(
        'LOOKALIKE_VALUE field is required for Value-Based Custom Audiences.',
      );
    }

    // Batch processing with user count limits
    const recordChunksArray = returnArrayOfSubarrays(
      groupedRecordsByAction[action],
      MAX_USER_COUNT,
    );
    return processRecordEventArray(recordChunksArray, config, destination, operation, audienceId);
  }
  return null;
};
```

### Data Transformation

1. **Field Validation**: Ensures all schema fields are supported by Facebook
2. **Data Formatting**: Applies Facebook-specific formatting rules (unless disabled)
3. **Hashing**: Applies SHA-256 hashing to appropriate fields
4. **Batching**: Groups records into batches respecting size and count limits

## Value-Based Custom Audiences

### Special Considerations

For value-based custom audiences:

- **Required Field**: `LOOKALIKE_VALUE` must be included in the schema
- **Validation**: Enforced during record processing for 'add' operations
- **Data Type**: Numeric values, defaults to 0 if invalid
- **Configuration**: `isValueBasedAudience` flag in connection config

### Implementation

```javascript
// Value-based audience validation
if (isValueBasedAudience && !cleanUserSchema.includes('LOOKALIKE_VALUE') && operation === 'add') {
  throw new ConfigurationError(
    'LOOKALIKE_VALUE field is required for Value-Based Custom Audiences.',
  );
}

// LOOKALIKE_VALUE processing
if (propertyName === 'LOOKALIKE_VALUE') {
  const lookalikeValue = Number(normalizedValue);
  const validLookalikeValue =
    Number.isFinite(lookalikeValue) && lookalikeValue >= 0 ? lookalikeValue : 0;
  dataElement.push(validLookalikeValue);
  return dataElement;
}
```

## Error Handling

### Configuration Errors

- Missing audience ID for VDM v1 flows
- Invalid schema fields not supported by Facebook
- Missing LOOKALIKE_VALUE for value-based audiences

### Data Validation Errors

- Invalid field formats that cannot be normalized
- Empty or null required fields
- Payload size exceeding limits

### Response Handling

- Batch-level success/failure handling - all records in a batch succeed or fail together
- Failed batches are reported with appropriate error messages
- No individual record-level error reporting within batches

## Performance Considerations

### Batching Strategy

- **User Count Batching**: Maximum 10,000 users per batch
- **Payload Size Batching**: Maximum 60,000 bytes per request
- **Automatic Chunking**: When limits are exceeded, automatic subdivision occurs

### Memory Management

- Uses `mapInBatches` and `forEachInBatches` for processing large datasets
- Prevents memory overflow with large audience lists
- Yields control during processing to avoid blocking

### Monitoring

- Statistics tracking for null field values
- Destination-specific metrics for data quality
- Error categorization for troubleshooting

## Best Practices

1. **Field Selection**: Choose multiple identifier fields for better match rates
2. **Data Quality**: Ensure clean, formatted data before syncing
3. **Batch Size**: Monitor payload sizes to optimize performance
4. **Error Monitoring**: Set up alerts for configuration and data validation errors
5. **Value-Based Audiences**: Ensure LOOKALIKE_VALUE is properly calculated and included
