# Iterable RETL Functionality

## Overview

**NEEDS REVIEW** - The Iterable destination appears to have limited RETL (Real-time Extract, Transform, Load) functionality. Based on the codebase analysis, RETL support is not explicitly configured in the database configuration, but there are indications of catalog management capabilities.

## VDM v2 Support

**NEEDS REVIEW** - VDM v2 support is not explicitly configured in the database configuration. The `supportedMessageTypes` in `db-config.json` does not include `record` type, which typically indicates VDM v2 support.

## Connection Configuration

For RETL functionality, the following configuration parameters are relevant:

### Required Settings
- **API Key**: Same API key used for event stream functionality
- **Data Center**: Must match the data center configuration (USDC/EUDC)

### RETL-Specific Settings
**NEEDS REVIEW** - No specific RETL configuration parameters were found in the schema.json or implementation.

## RETL Flow Implementation

### Catalog Management

The destination includes catalog management functionality that appears to be designed for RETL operations:

#### Catalog Endpoint
- **Endpoint Pattern**: `/api/catalogs/{objectType}/items`
- **Method**: POST
- **Purpose**: Managing catalog items for product/content synchronization

#### External ID Handling
The implementation includes RETL-specific external ID handling:

```javascript
const getCatalogEndpoint = (category, message) => {
  const externalIdInfo = getDestinationExternalIDInfoForRetl(message, 'ITERABLE');
  return `${category.endpoint}/${externalIdInfo.objectType}/items`;
};
```

### Record Event Processing

The destination implements catalog-based RETL functionality through the following mechanisms:

#### Catalog Event Detection
Events are identified as catalog operations when:
- The event contains external ID information with object type
- The event is processed through the catalog endpoint construction logic
- The `mappedToDestination` flag is set to `true`

#### External ID Structure
```javascript
context: {
  mappedToDestination: true,
  externalId: [
    {
      id: 'catalog_item_123',
      identifierType: 'catalog_identifier',
      objectType: 'products' // Used for endpoint construction
    },
  ],
}
```

### Mapped to Destination Logic

The destination implements RETL-specific processing when `mappedToDestination === true`:

1. **External ID Addition**: Adds external ID information to event traits
2. **Catalog Endpoint Construction**: Builds dynamic catalog endpoints
3. **Batch Processing**: Groups catalog events for efficient processing

#### Processing Flow
```javascript
// From updateUserEventPayloadBuilder in util.js
if (get(message, MappedToDestinationKey)) {
  addExternalIdToTraits(message);
}
```

#### Endpoint Construction
```javascript
// From getCatalogEndpoint in util.js
const getCatalogEndpoint = (category, message) => {
  const externalIdInfo = getDestinationExternalIDInfoForRetl(message, 'ITERABLE');
  return `${category.endpoint}/${externalIdInfo.objectType}/items`;
};
```

## Data Flow

### RETL Event Processing

The RETL data flow follows this pattern:

1. **Event Reception**: Receive events with `mappedToDestination: true`
2. **External ID Processing**: Extract object type and identifier from external IDs
3. **Catalog Endpoint Construction**: Build dynamic catalog endpoints based on object type
4. **Payload Preparation**: Map event traits to catalog update format
5. **Batch Processing**: Group catalog events for efficient API calls
6. **API Delivery**: Send catalog updates to Iterable

#### Event Categorization
```javascript
// From categorizeEvent in util.js
if (message.endpoint.includes('api/catalogs')) {
  return { type: 'catalog', data: { message, metadata, destination } };
}
```

#### Batch Processing
```javascript
// From batchCatalogEvents in util.js
const batchCatalogEvents = (catalogEvents) => {
  const catalogEventsChunks = lodash.chunk(
    catalogEvents,
    configurations.CATALOG_MAX_ITEMS_PER_REQUEST, // 1000 items
  );
  // Process each chunk as a separate batch
};
```

### Supported Operations

The destination supports the following RETL operations:

- **Catalog Item Creation**: Adding new items to Iterable catalogs
- **Catalog Item Updates**: Updating existing catalog items
- **Bulk Catalog Operations**: Processing up to 1000 catalog items per batch
- **Dynamic Object Types**: Supports any catalog object type via external ID

## Rate Limits and Constraints

### API Limits
- **Catalog Endpoint**: 5 requests/second per API key
- **Batch Size**: 1000 items per request (based on `CATALOG_MAX_ITEMS_PER_REQUEST`)
- **Request Size**: 4MB maximum request size

### Processing Constraints
- **Object Type Requirement**: External ID must include object type for catalog operations
- **Identifier Validation**: Valid identifier required for catalog item operations

## Error Handling

**NEEDS REVIEW** - RETL-specific error handling patterns are not clearly defined in the current implementation.

## Configuration Example

**NEEDS REVIEW** - No specific RETL configuration examples are available in the current implementation.

## Limitations

1. **VDM v2 Support**: Not explicitly configured or documented
2. **Record Event Types**: Support for record events is not clearly defined
3. **RETL Configuration**: No specific RETL configuration parameters identified
4. **Documentation**: Limited documentation for RETL-specific functionality

## Recommendations

1. **Review RETL Implementation**: Verify if RETL functionality is fully implemented
2. **Add VDM v2 Support**: Configure record message type support if needed
3. **Document RETL Configuration**: Add specific configuration parameters for RETL
4. **Add RETL Examples**: Provide configuration and usage examples
5. **Error Handling**: Implement comprehensive RETL-specific error handling

## Related Documentation

- [Main README](../README.md) - General destination functionality
- [Business Logic](businesslogic.md) - Event processing and mapping details
- [Iterable Catalogs API](https://api.iterable.com/api/docs#catalogs) - Official API documentation
