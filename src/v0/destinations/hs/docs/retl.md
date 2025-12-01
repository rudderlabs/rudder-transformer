# HubSpot RETL Functionality

## Overview

The HubSpot destination provides comprehensive support for Real-time Extract, Transform, Load (rETL) operations from warehouse sources. This enables syncing data from data warehouses (Snowflake, BigQuery, Redshift, etc.) to HubSpot CRM objects.

## RETL Support Status

✅ **Partially Supported**

- **Warehouse Sources**: ✅ Supported (`supportedSourceTypes` includes `warehouse` in `db-config.json`)
- **Visual Data Mapper (VDM) V1**: ✅ Supported (`supportsVisualMapper: true` in `db-config.json`)
- **VDM V2**: ❌ **NOT Supported** (transformer does not handle `record` event type)
- **JSON Mapper**: ✅ Supported (default, not disabled)

## Supported RETL Modes

### 1. JSON Mapper (Default)

- **Status**: Enabled (not disabled in configuration)
- **Message Type**: `identify` with `mappedToDestination: true`
- **Use Case**: Direct JSON mapping from warehouse to HubSpot objects

### 2. Visual Data Mapper V1 (VDM V1)

- **Status**: Supported (`supportsVisualMapper: true`)
- **Message Type**: `identify` with `mappedToDestination: true`
- **Use Case**: Visual mapping interface in RudderStack UI
- **Requirements**: Only works with New API (v3)

### 3. Visual Data Mapper V2 (VDM V2)

- **Status**: ❌ **NOT Supported**
- **Reason**: Transformer code does not handle `record` event type
- **Code Reference**: [transform.js:34-54](../transform.js#L34-L54) - Switch statement only handles `identify` and `track` types
- **Note**: While warehouse sources and VDM V1 work via `identify` events with `mappedToDestination: true`, full VDM V2 with `record` type is not implemented

## API Version Requirements

| Feature                  | Legacy API (v1) | New API (v3) | Required |
| ------------------------ | --------------- | ------------ | -------- |
| Standard Contacts        | ✓               | ✓            | Either   |
| Custom Objects           | ✗               | ✓            | New API  |
| Associations             | ✗               | ✓            | New API  |
| Bulk Search Optimization | ✗               | ✓            | New API  |
| VDM V2 (Record Type)     | ✗               | ✗            | N/A      |

**Recommendation**: Use New API (v3) for all rETL use cases to access full functionality.

## Supported HubSpot Objects

### Standard Objects

- **Contacts**: Create, update, and search contacts
- **Companies**: Create, update, and search companies
- **Deals**: Create, update, and search deals
- **Tickets**: Create, update, and search tickets

### Custom Objects

- **Any Custom Object**: Full support for HubSpot custom objects
- **Associations**: Create associations between any objects (standard or custom)

## RETL Flow Overview

### 1. Event Structure

rETL events from warehouse sources include:

```json
{
  "type": "identify",
  "context": {
    "mappedToDestination": true,
    "externalId": [
      {
        "type": "HS-contacts-email",
        "id": "user@example.com",
        "identifierType": "email",
        "objectType": "contacts"
      }
    ]
  },
  "traits": {
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "company": "Acme Inc"
  }
}
```

### 2. External ID Format

The `externalId` array contains crucial information for object identification:

| Field            | Description                                | Example                          |
| ---------------- | ------------------------------------------ | -------------------------------- |
| `type`           | Format: `HS-{objectType}-{identifierType}` | `HS-contacts-email`              |
| `id`             | The identifier value                       | `user@example.com`               |
| `identifierType` | Property used for identification           | `email`, `id`, `customId`        |
| `objectType`     | HubSpot object type                        | `contacts`, `companies`, `deals` |

**Association Format** (for creating associations):

```json
{
  "type": "HS-association",
  "id": "fromObjectId",
  "objectType": "association",
  "fromObjectType": "contacts",
  "toObjectType": "companies",
  "toObjectId": "toObjectId",
  "associationTypeId": "1"
}
```

### 3. Processing Flow

#### Step 1: Bulk Object Search

```
┌─────────────────────────────────────────────────────────┐
│  Before transformation, search for ALL objects in batch │
│  to determine which need CREATE vs UPDATE operations    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Extract unique identifier values from all events       │
│  (e.g., all email addresses)                           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Chunk identifiers into groups of 100                   │
│  (MAX_CONTACTS_PER_REQUEST = 100)                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Search HubSpot for existing objects                    │
│  Endpoint: /crm/v3/objects/:objectType/search          │
│  Handle pagination if needed                            │
└─────────────────────────────────────────────────────────┘
```

**Code Reference**: [util.js:668-702](../util.js#L668-L702)

#### Step 2: Mark Events as Create or Update

```
┌─────────────────────────────────────────────────────────┐
│  For each event, check if identifier was found in       │
│  search results                                         │
└─────────────────────────────────────────────────────────┘
                           ↓
         ┌────────────────┴────────────────┐
         ↓                                  ↓
    Found in HubSpot                  Not found in HubSpot
         ↓                                  ↓
┌─────────────────────┐          ┌─────────────────────┐
│ Mark as UPDATE      │          │ Mark as CREATE      │
│ Store hsSearchId    │          │ No hsSearchId       │
│ in externalId       │          │                     │
└─────────────────────┘          └─────────────────────┘
```

**Code Reference**: [util.js:740-795](../util.js#L740-L795)

#### Step 3: Transformation

```
┌─────────────────────────────────────────────────────────┐
│  Transform each event based on operation type           │
└─────────────────────────────────────────────────────────┘
                           ↓
         ┌────────────────┴────────────────┐
         ↓                                  ↓
    CREATE Operation              UPDATE Operation
         ↓                                  ↓
┌─────────────────────┐          ┌─────────────────────┐
│ Endpoint:           │          │ Endpoint:           │
│ /crm/v3/objects/    │          │ /crm/v3/objects/    │
│ :objectType         │          │ :objectType/        │
│                     │          │ {hsSearchId}        │
│ Method: POST        │          │ Method: PATCH       │
└─────────────────────┘          └─────────────────────┘
```

#### Step 4: Batching

```
┌─────────────────────────────────────────────────────────┐
│  Separate events by operation type                      │
└─────────────────────────────────────────────────────────┘
                           ↓
         ┌────────────────┴────────────────┐
         ↓                                  ↓
┌─────────────────────┐          ┌─────────────────────┐
│ CREATE events       │          │ UPDATE events       │
│ Chunk by 100        │          │ Chunk by 100        │
│ (or 1000 for v1)    │          │ (or 1000 for v1)    │
└─────────────────────┘          └─────────────────────┘
         ↓                                  ↓
┌─────────────────────┐          ┌─────────────────────┐
│ Batch Endpoint:     │          │ Batch Endpoint:     │
│ /crm/v3/objects/    │          │ /crm/v3/objects/    │
│ :objectType/        │          │ :objectType/        │
│ batch/create        │          │ batch/update        │
└─────────────────────┘          └─────────────────────┘
```

**Code Reference (Legacy API)**: [HSTransform-v1.js:183-245](../HSTransform-v1.js#L183-L245)
**Code Reference (New API)**: [HSTransform-v2.js:248-371](../HSTransform-v2.js#L248-L371)

## Property Handling

### Property Type Conversion

The destination automatically handles property type conversions:

```javascript
// Date properties → UTC midnight timestamp
{
  "lastContactDate": "2025-01-15T10:30:00Z"
  // Converted to: 1736899200000 (2025-01-15 00:00:00 UTC)
}

// String properties → Always converted to string
{
  "customField": { "nested": "object" }
  // Converted to: '{"nested":"object"}'
}

// Number properties → Must be numeric (validation)
{
  "revenue": "1000"  // ❌ Will throw error
  "revenue": 1000    // ✓ Correct format
}

// Boolean properties → Must be boolean (validation)
{
  "isCustomer": "true"  // ❌ Will throw error
  "isCustomer": true    // ✓ Correct format
}
```

**Code Reference**: [util.js:167-195](../util.js#L167-L195), [util.js:818-835](../util.js#L818-L835)

### System Field Removal

HubSpot system fields are automatically removed before sending:

```javascript
// System fields (automatically removed)
const HUBSPOT_SYSTEM_FIELDS = ['hs_object_id'];

// Example:
{
  "hs_object_id": "12345",  // ← Removed automatically
  "firstname": "John",       // ← Sent to HubSpot
  "lastname": "Doe"          // ← Sent to HubSpot
}
```

**Code Reference**: [config.js:92](../config.js#L92), [util.js:887](../util.js#L887)

### Custom Property Creation

If properties don't exist in HubSpot:

1. Properties must be created in HubSpot UI or via API first
2. Destination validates against existing properties (fetches via API)
3. Unknown properties are excluded from the payload
4. Only properties matching HubSpot's property definitions are sent

**Code Reference**: [util.js:97-158](../util.js#L97-L158)

## Email as Identifier - Special Handling

When using `email` as the identifier type, the destination includes additional logic to prevent duplicates:

### Primary vs Secondary Email

- **Primary Email**: The main `email` property on a contact
- **Secondary Email**: The `hs_additional_emails` property (semicolon-separated list)

### Search Strategy

```
┌─────────────────────────────────────────────────────────┐
│  Search for contacts where:                             │
│  1. email = "user@example.com"  OR                      │
│  2. hs_additional_emails contains "user@example.com"    │
└─────────────────────────────────────────────────────────┘
```

**Why This Matters**:

- Prevents creating duplicate contacts when email exists as secondary email
- Avoids HubSpot's "409 Duplicate records found" error
- Ensures proper contact matching

**Code Reference**: [util.js:624-661](../util.js#L624-L661)

### Update Behavior with Secondary Email

If a contact is found via secondary email:

```javascript
// Mark the event to NOT override the primary email field
{
  externalId: [
    {
      type: 'HS-contacts-email',
      id: 'user@example.com',
      identifierType: 'email',
      objectType: 'contacts',
      hsSearchId: '12345',
      useSecondaryObject: true, // ← Prevents overwriting primary email
    },
  ];
}
```

This ensures:

- Contact is updated (not created as duplicate)
- Primary email field is not overwritten with secondary email value
- Secondary email list remains intact

**Code Reference**: [util.js:709-730](../util.js#L709-L730), [util.js:837-848](../util.js#L837-L848)

## Creating Associations

Associations link HubSpot objects together (e.g., Contact → Company, Deal → Contact).

### Association Event Structure

```json
{
  "type": "identify",
  "context": {
    "mappedToDestination": true,
    "externalId": [
      {
        "type": "HS-association",
        "id": "fromObjectId123",
        "objectType": "association",
        "fromObjectType": "contacts",
        "toObjectType": "companies",
        "toObjectId": "toObjectId456",
        "associationTypeId": "1"
      }
    ]
  },
  "traits": {
    "from": { "id": "fromObjectId123" },
    "to": { "id": "toObjectId456" }
  }
}
```

### Association Type IDs

Common association type IDs:

| Association Type   | From → To            | Type ID |
| ------------------ | -------------------- | ------- |
| Contact to Company | contacts → companies | 1       |
| Company to Contact | companies → contacts | 2       |
| Deal to Contact    | deals → contacts     | 3       |
| Contact to Deal    | contacts → deals     | 4       |
| Deal to Company    | deals → companies    | 5       |
| Company to Deal    | companies → deals    | 6       |

> For custom association types, refer to [HubSpot Association Type Documentation](https://developers.hubspot.com/docs/api/crm/associations)

### Processing Flow

```
┌─────────────────────────────────────────────────────────┐
│  Detect objectType = "association"                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Skip bulk search (associations don't need search)      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Build association payload                              │
│  {                                                      │
│    from: { id: "fromObjectId" },                       │
│    to: { "id": "toObjectId" },                         │
│    type: "associationTypeId"                           │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Batch associations (100 per batch)                     │
│  Endpoint: /crm/v3/associations/:fromObjectType/        │
│            :toObjectType/batch/create                   │
└─────────────────────────────────────────────────────────┘
```

**Code Reference**: [transform.js:89](../transform.js#L89), [HSTransform-v2.js:93-114](../HSTransform-v2.js#L93-L114)

## Batch Size Limits

| Object Type    | Operation | Legacy API (v1) | New API (v3) |
| -------------- | --------- | --------------- | ------------ |
| Contacts       | Create    | 1000            | 100          |
| Contacts       | Update    | 1000            | 100          |
| Custom Objects | Create    | N/A             | 100          |
| Custom Objects | Update    | N/A             | 100          |
| Associations   | Create    | N/A             | 100          |

**Code Reference**: [config.js:20](../config.js#L20), [config.js:40](../config.js#L40), [config.js:58](../config.js#L58)

## Performance Optimizations

### 1. Bulk Search Before Transformation

**Problem**: Searching for each contact individually = 1 API call per event

**Solution**: Single bulk search for entire batch before transformation

**Impact**:

- 1000 events → 1 search call (or ~10 for pagination) instead of 1000 calls
- Significantly reduces API usage and transformation time
- Stays within rate limits more easily

**Code Reference**: [transform.js:91-92](../transform.js#L91-L92), [util.js:668-702](../util.js#L668-L702)

### 2. Property Map Caching

**Problem**: Fetching properties for every event = N API calls

**Solution**: Fetch properties once per batch and reuse

**Impact**:

- 1000 events → 1 property fetch call instead of 1000 calls
- Only fetched when traits are present
- Cached across entire batch

**Code Reference**: [transform.js:95-101](../transform.js#L95-L101)

### 3. Duplicate Handling in Batches

**Problem**: Same email/ID in batch causes HubSpot batch API errors

**Solution**: Automatically deduplicate within batch, keeping last occurrence

**Impact**:

- Prevents 400 errors from HubSpot
- Ensures batch succeeds even with duplicates
- Last value wins for duplicate identifiers

**Code Reference**: [HSTransform-v2.js:287-308](../HSTransform-v2.js#L287-L308), [HSTransform-v2.js:309-333](../HSTransform-v2.js#L309-L333)

## Error Handling

### Common Errors and Solutions

#### 1. Invalid Email Format (New API only)

```
Error: Email "invalid-email" is invalid
```

**Solution**: Validate email format before syncing

**Code Reference**: [HSTransform-v2.js:80-82](../HSTransform-v2.js#L80-L82)

#### 2. Property Type Mismatch

```
Error: Property customField data type object is not matching with
       Hubspot property data type number
```

**Solution**: Ensure data types match HubSpot property definitions

**Code Reference**: [util.js:167-195](../util.js#L167-L195)

#### 3. Missing External ID

```
Error: rETL - external Id not found.
```

**Solution**: Ensure `externalId` array is properly configured in VDM

**Code Reference**: [util.js:502-506](../util.js#L502-L506)

#### 4. Missing Object Type

```
Error: objectType not found
```

**Solution**: Include `objectType` in `externalId` array

**Code Reference**: [HSTransform-v2.js:122-124](../HSTransform-v2.js#L122-L124)

#### 5. System Fields Error

```
Error: Property hs_object_id cannot be set
```

**Solution**: System fields are automatically removed (should not occur)

**Code Reference**: [util.js:887](../util.js#L887)

## Best Practices

### 1. Use New API (v3)

✅ **Do**:

- Configure `apiVersion: "newApi"` for rETL sources
- Leverage custom objects and associations

❌ **Don't**:

- Use Legacy API for new rETL implementations
- Mix API versions in the same sync

### 2. Choose Appropriate Identifier

✅ **Do**:

- Use email for contacts when available
- Use unique IDs for custom objects
- Consider using HubSpot's record ID when available

❌ **Don't**:

- Use non-unique fields as identifiers
- Use fields that can change frequently

### 3. Property Management

✅ **Do**:

- Create properties in HubSpot before syncing
- Match data types exactly (number, string, boolean, date)
- Use proper date format (ISO 8601 or Unix timestamp)

❌ **Don't**:

- Send properties that don't exist in HubSpot
- Send mismatched data types (string for number, etc.)
- Include HubSpot system fields in payload

### 4. Batch Size Considerations

✅ **Do**:

- Let the destination handle batching automatically
- Monitor API usage in HubSpot
- Consider rate limits for high-volume syncs

❌ **Don't**:

- Manually split batches (destination handles this)
- Exceed rate limits without backoff strategy

### 5. Association Management

✅ **Do**:

- Ensure both objects exist before creating association
- Use correct association type IDs
- Verify `fromObjectType` and `toObjectType` match your objects

❌ **Don't**:

- Create associations to non-existent objects
- Use incorrect association type IDs
- Skip validation of object existence

## Monitoring and Debugging

### Check VDM Configuration

Verify that your Visual Data Mapper configuration includes:

1. **External ID Mapping**: Properly configured with `objectType` and `identifierType`
2. **Property Mappings**: All warehouse columns mapped to HubSpot properties
3. **API Version**: Set to `newApi` for rETL

### Review Transformation Logs

Look for these log patterns:

```
# Successful bulk search
rETL - Searching for X objects in HubSpot

# Object found (will update)
rETL - Object found with ID: 12345

# Object not found (will create)
rETL - Object not found, will create

# Batching
Batching N events for operation: createObject/updateObject
```

### Common Log Errors

```
# Missing configuration
Error: rETL - objectType or identifier type not found

# Property type mismatch
Error: Property ... data type ... is not matching with Hubspot property data type ...

# System field error (shouldn't occur but indicates bug)
Error: Property hs_object_id cannot be set
```

## Limitations

### 1. Record Event Type - VDM V2

**Status**: ❌ **NOT SUPPORTED**

The HubSpot destination does **not** support the `record` event type required for VDM V2:

**Evidence**:

1. **Transformer Code**: The switch statement in [transform.js:34-54](../transform.js#L34-L54) only handles `EventType.IDENTIFY` and `EventType.TRACK`. Any `record` type events will throw an error: `"Message type record is not supported"`

2. **VDM V2 Requirements** (per memory-bank guidelines):
   - ❌ `supportedMessageTypes` must include `record` in `db-config.json`
   - ❌ **AND** transformer code must have logic handling `record` event type

**Current Behavior**:

- HubSpot uses `identify` events with `mappedToDestination: true` for warehouse syncs
- This provides VDM V1 functionality but not full VDM V2 capabilities
- The `record` event type is defined in constants but not handled by HubSpot transformer

**Recommendation**: If VDM V2 support is needed, implement a case for `EventType.RECORD` in the transform.js switch statement.

### 2. Search API Limitations

- Maximum 100 results per search request (with pagination)
- Search queries are limited to simple equality filters
- Complex queries (AND/OR combinations) have limited support

### 3. Property Limitations

- Only properties that exist in HubSpot can be updated
- Property data types cannot be changed after creation
- Some system properties are read-only

### 4. Association Limitations

- Associations require both objects to exist first
- Cannot create associations in same batch as object creation
- Limited to 100 associations per batch request (despite docs saying 2000)

### 5. Legacy API Limitations

- No support for custom objects
- No support for associations
- No bulk search optimization
- No email format validation

## Code Structure Reference

### Key Files

- **transform.js**: Main entry point, batch orchestration, split logic
- **HSTransform-v1.js**: Legacy API implementation
- **HSTransform-v2.js**: New API implementation
- **util.js**: Utility functions including search, property handling, formatting
- **config.js**: Endpoints, constants, batch size limits

### Key Functions

| Function                     | File                  | Purpose                                 |
| ---------------------------- | --------------------- | --------------------------------------- |
| `splitEventsForCreateUpdate` | util.js:740           | Bulk search and create/update splitting |
| `getExistingContactsData`    | util.js:668           | Perform bulk search for objects         |
| `performHubSpotSearch`       | util.js:533           | Execute paginated search API calls      |
| `setHsSearchId`              | util.js:710           | Store HubSpot ID in externalId          |
| `addExternalIdToHSTraits`    | util.js:837           | Add identifier to traits for create     |
| `populateTraits`             | util.js:818           | Convert property types (dates, etc.)    |
| `removeHubSpotSystemField`   | util.js:887           | Remove system fields from payload       |
| `batchIdentify` (v2)         | HSTransform-v2.js:248 | Batch logic for New API                 |
| `batchIdentifyForrETL` (v1)  | HSTransform-v1.js:183 | Batch logic for Legacy API              |

---

**For additional details on general functionality, see the main [README.md](../README.md).**

**For field mappings and business logic, see [businesslogic.md](businesslogic.md).**
