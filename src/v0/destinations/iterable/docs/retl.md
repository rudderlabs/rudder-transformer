# Iterable RETL Functionality

## Is RETL supported at all?

**RETL (Real-time Extract, Transform, Load) Support**: **Partially Supported**

The Iterable destination supports RETL functionality through catalog management capabilities, but does not support warehouse sources directly. Evidence:
- `supportedSourceTypes` does not include `warehouse`
- `supportsVisualMapper: true` in `db-config.json` indicates VDM v1 support
- Transformer code handles `mappedToDestination` flag for catalog operations
- Catalog-specific endpoints and batching logic implemented

## RETL Support Analysis

### Which type of retl support does it have?
- **JSON Mapper**: Supported (default, no `disableJsonMapper: true`)
- **VDM V1**: Supported (`supportsVisualMapper: true` in `db-config.json`)
- **VDM V2**: Not supported

### Does it have vdm support?
**Yes** - `supportsVisualMapper: true` is present in `db-config.json`, confirming VDM V1 support.

### Does it have vdm v2 support?
**No** - Missing both:
- `supportedMessageTypes > record` in `db-config.json`
- No record event type handling in transformer code

### Connection config
Standard Iterable configuration applies:
- **API Key**: Same API key used for event stream functionality
- **Data Center**: Must match the data center configuration (USDC/EUDC)

## RETL Flow Implementation

### Mapped to Destination Logic

The Iterable destination implements RETL functionality through the `mappedToDestination` flag processing:

```javascript
// From getCategory in transform.js
if (
  get(message, MappedToDestinationKey) &&
  getDestinationExternalIDInfoForRetl(message, 'ITERABLE').objectType !== 'users'
) {
  return getCategoryWithEndpoint(ConfigCategory.CATALOG, dataCenter);
}
```

When `mappedToDestination` is true and the object type is not 'users', the destination:

1. **Catalog Operations**: Routes events to catalog endpoints for product/content management
2. **External ID Processing**: Extracts object type and identifier from external IDs
3. **Dynamic Endpoint Construction**: Builds catalog endpoints based on object type
4. **Batch Processing**: Groups catalog events for efficient API calls (up to 1000 items per batch)

### Catalog Management

The destination includes comprehensive catalog management functionality for RETL operations:

#### Catalog Endpoint Construction
- **Endpoint Pattern**: `/api/catalogs/{objectType}/items`
- **Method**: POST
- **Purpose**: Managing catalog items for product/content synchronization
- **Dynamic Object Types**: Supports any catalog object type via external ID

```javascript
// From getCatalogEndpoint in util.js
const getCatalogEndpoint = (category, message) => {
  const externalIdInfo = getDestinationExternalIDInfoForRetl(message, 'ITERABLE');
  return `${category.endpoint}/${externalIdInfo.objectType}/items`;
};
```

#### Catalog Payload Construction
```javascript
// From constructPayloadItem in transform.js
case 'catalogs':
  rawPayload = constructPayload(message, mappingConfig[category.name]);
  rawPayload.catalogId = getDestinationExternalIDInfoForRetl(
    message,
    'ITERABLE',
  ).destinationExternalId;
  break;
```

### RETL Event Processing

#### Event Detection and Routing
Events are identified as catalog operations when:
- The `mappedToDestination` flag is set to `true`
- The event contains external ID information with object type
- The object type is not 'users' (user events go to standard identify endpoint)

```javascript
// From getCategory in transform.js
if (
  get(message, MappedToDestinationKey) &&
  getDestinationExternalIDInfoForRetl(message, 'ITERABLE').objectType !== 'users'
) {
  return getCategoryWithEndpoint(ConfigCategory.CATALOG, dataCenter);
}
```

#### External ID Structure for Catalog Events
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

#### User Events vs Catalog Events
- **User Events**: `objectType: 'users'` → routed to standard identify endpoint
- **Catalog Events**: Any other `objectType` → routed to catalog endpoints

## Data Flow

### RETL Event Processing

The RETL data flow follows this pattern:

1. **Event Reception**: Receive events with `mappedToDestination: true`
2. **Object Type Detection**: Extract object type from external ID information
3. **Routing Decision**: Route to catalog endpoints (non-users) or identify endpoints (users)
4. **Catalog Endpoint Construction**: Build dynamic catalog endpoints based on object type
5. **Payload Preparation**: Map event traits to catalog update format with catalogId
6. **Batch Processing**: Group catalog events for efficient API calls (up to 1000 items)
7. **API Delivery**: Send catalog updates to Iterable

### Batch Processing Implementation

#### Catalog Event Batching
```javascript
// From batchCatalogEvents in util.js
const batchCatalogEvents = (catalogEvents) => {
  const catalogEventsChunks = lodash.chunk(
    catalogEvents,
    configurations.CATALOG_MAX_ITEMS_PER_REQUEST, // 1000 items
  );
  return catalogEventsChunks.reduce((batchedResponseList, chunk) => {
    const batchedResponse = processCatalogBatch(chunk);
    return batchedResponseList.concat(batchedResponse);
  }, []);
};
```

#### Batch Processing Logic
```javascript
// From processCatalogBatch in util.js
const processCatalogBatch = (chunk) => {
  const metadata = [];
  const documents = {};
  // Process up to 1,000 catalog items per batch
  // Ref: https://api.iterable.com/api/docs#catalogs_bulkUpdateCatalogItems
};
```

### Supported Operations

The destination supports the following RETL operations:

- **Catalog Item Creation**: Adding new items to Iterable catalogs
- **Catalog Item Updates**: Updating existing catalog items
- **Bulk Catalog Operations**: Processing up to 1000 catalog items per batch
- **Dynamic Object Types**: Supports any catalog object type via external ID
- **User Profile Updates**: Standard identify operations for user objects

## Rate Limits and Constraints

### API Limits
- **Catalog Endpoint**: 5 requests/second per API key
- **Batch Size**: 1000 items per request (based on `CATALOG_MAX_ITEMS_PER_REQUEST`)
- **Request Size**: 4MB maximum request size
- **Bulk Update Endpoint**: `/api/catalogs/{catalogName}/items` (POST)

### Processing Constraints
- **Object Type Requirement**: External ID must include object type for catalog operations
- **Identifier Validation**: Valid catalogId required for catalog item operations
- **User vs Catalog Routing**: Object type 'users' routes to identify, others to catalog endpoints

## Configuration Requirements

### Standard Configuration
- **API Key**: Same API key used for event stream functionality
- **Data Center**: Must match the data center configuration (USDC/EUDC)

### RETL Event Structure
```javascript
{
  "type": "identify", // or other event types
  "context": {
    "mappedToDestination": true,
    "externalId": [
      {
        "id": "product_123",
        "identifierType": "catalog_identifier",
        "objectType": "products" // Determines catalog endpoint
      }
    ]
  },
  "traits": {
    // Catalog item attributes
  }
}
```

## Summary

The Iterable destination supports RETL functionality through:

- **VDM v1 Support**: `supportsVisualMapper: true` in configuration
- **Catalog Management**: Dynamic catalog endpoints based on object type
- **Batch Processing**: Efficient batching up to 1000 items per request
- **Mixed Routing**: User events to identify endpoints, catalog events to catalog endpoints
- **External ID Processing**: Proper handling of RETL external ID structure

**Limitations**:
- No VDM v2 support (no record message type)
- No warehouse source type support (catalog operations only through VDM v1)
- Requires proper external ID structure with object type for catalog routing

## Related Documentation

- [Main README](../README.md) - General destination functionality
- [Business Logic](businesslogic.md) - Event processing and mapping details
- [Iterable Catalogs API](https://api.iterable.com/api/docs#catalogs) - Official API documentation
- [Iterable Bulk Update API](https://api.iterable.com/api/docs#catalogs_bulkUpdateCatalogItems) - Bulk catalog operations
