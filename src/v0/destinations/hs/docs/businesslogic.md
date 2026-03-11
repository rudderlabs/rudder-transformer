# HubSpot Business Logic and Mappings

## Overview

This document details the business logic, field mappings, and transformation flows for the HubSpot destination. It covers both Legacy API (v1) and New API (v3) implementations.

## Message Type Support

### Cloud Mode

- ✅ **Identify**: Create or update contact records (both APIs)
- ✅ **Track**: Send custom behavioral events (both APIs)

### Device Mode (Web only)

- ✅ **Identify**: Create or update contact records
- ✅ **Track**: Send custom behavioral events
- ✅ **Page**: Track page views

## Identify Event Flow

### Legacy API (v1) - Non-rETL

```
┌─────────────────────────────────────────────────────────┐
│  1. Validate Destination Config                         │
│     - Check authorizationType                           │
│     - Verify apiKey + hubID OR accessToken              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  2. Extract and Validate Traits                         │
│     - Require email in traits                           │
│     - Throw error if email missing                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  3. Fetch Property Map (if needed)                      │
│     - GET /properties/v1/contacts/properties            │
│     - Cache property types for validation               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  4. Transform Properties                                │
│     - Map standard fields (firstname, lastname, etc.)   │
│     - Format custom properties (lowercase, replace)     │
│     - Validate data types                               │
│     - Convert date fields to UTC midnight               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  5. Format Payload                                      │
│     - Convert to property-value array format            │
│     - Structure: [{ property: "key", value: "val" }]    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  6. Build Request                                       │
│     - Endpoint: /contacts/v1/contact/createOrUpdate/    │
│                 email/:contact_email                    │
│     - Method: POST                                      │
│     - Auth: hapikey param OR Bearer token               │
└─────────────────────────────────────────────────────────┘
```

**Code Reference**: [HSTransform-v1.js:56-131](../HSTransform-v1.js#L56-L131)

### New API (v3) - Non-rETL

```
┌─────────────────────────────────────────────────────────┐
│  1. Validate Destination Config                         │
│     - Check authorizationType                           │
│     - Verify apiKey + hubID OR accessToken              │
│     - Verify lookupField configuration                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  2. Validate Email (if present in traits)               │
│     - Use validator.isEmail() for validation            │
│     - Throw error if invalid format                     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  3. Check for Existing Contact                          │
│     - If hsContactId in externalId → Use it directly    │
│     - Otherwise → Search via lookupField                │
└─────────────────────────────────────────────────────────┘
                           ↓
         ┌────────────────┴────────────────┐
         ↓                                  ↓
┌─────────────────────┐          ┌─────────────────────┐
│ Contact ID Provided │          │ Search Required     │
│ (hsContactId)       │          │                     │
└─────────────────────┘          └─────────────────────┘
         ↓                                  ↓
         │                    ┌─────────────────────────┐
         │                    │ POST /crm/v3/objects/   │
         │                    │ contacts/search         │
         │                    │ Filter by lookupField   │
         │                    └─────────────────────────┘
         │                                  ↓
         │                    ┌─────────────┴───────────┐
         │                    ↓                         ↓
         │          Contact Found             Contact Not Found
         │          (contactId)               (null)
         │                    │                         │
         └────────────────────┴─────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│  4. Fetch Property Map (if needed)                      │
│     - GET /properties/v1/contacts/properties            │
│     - Cache property types for validation               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  5. Transform Properties                                │
│     - Map standard fields                               │
│     - Format custom properties                          │
│     - Validate data types                               │
│     - Convert date fields to UTC midnight               │
│     - Remove system fields (hs_object_id)               │
└─────────────────────────────────────────────────────────┘
                           ↓
         ┌────────────────┴────────────────┐
         ↓                                  ↓
┌─────────────────────┐          ┌─────────────────────┐
│ Contact Found       │          │ Contact Not Found   │
│ (UPDATE)            │          │ (CREATE)            │
└─────────────────────┘          └─────────────────────┘
         ↓                                  ↓
┌─────────────────────┐          ┌─────────────────────┐
│ Endpoint:           │          │ Endpoint:           │
│ /crm/v3/objects/    │          │ /crm/v3/objects/    │
│ contacts/:contactId │          │ contacts            │
│                     │          │                     │
│ Method: PATCH       │          │ Method: POST        │
│                     │          │                     │
│ Body:               │          │ Body:               │
│ { properties: {...} }│          │ { properties: {...} }│
└─────────────────────┘          └─────────────────────┘
```

**Code Reference**: [HSTransform-v2.js:75-193](../HSTransform-v2.js#L75-L193)

### rETL Flow (Both APIs)

For rETL sources, see detailed flow in [docs/retl.md](retl.md).

**Key Differences**:

- Bulk search before transformation
- Split into create/update operations based on search results
- Support for custom objects and associations
- System field removal
- Property type conversion

## Identify Field Mappings

### Standard Contact Properties

| HubSpot Property | RudderStack Source                                                                                                                                                                   | Required                                  | Notes                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- | ------------------------------------ |
| `email`          | `traits.email`<br>`context.traits.email`<br>`properties.email`                                                                                                                       | Yes (Legacy API)<br>Recommended (New API) | Used as default lookup field         |
| `firstname`      | `traits.firstName`<br>`traits.firstname`<br>`traits.first_name`<br>`context.traits.firstName`<br>`context.traits.firstname`<br>`context.traits.first_name`<br>`properties.firstname` | No                                        | Multiple source variations supported |
| `lastname`       | `traits.lastName`<br>`traits.lastname`<br>`traits.last_name`<br>`context.traits.lastName`<br>`context.traits.lastname`<br>`context.traits.last_name`<br>`properties.lastname`        | No                                        | Multiple source variations supported |
| `phone`          | `traits.phone`<br>`context.traits.phone`<br>`properties.phone`                                                                                                                       | No                                        | Uses generic phone mapping           |
| `address`        | `traits.address.street`<br>`context.traits.address.street`<br>`properties.address.street`                                                                                            | No                                        | Street address only                  |
| `city`           | `traits.address.city`<br>`context.traits.address.city`<br>`properties.address.city`                                                                                                  | No                                        |                                      |
| `state`          | `traits.address.state`<br>`context.traits.address.state`<br>`properties.address.state`                                                                                               | No                                        |                                      |
| `zip`            | `traits.address.postalcode`<br>`context.traits.address.postalcode`<br>`properties.address.postalcode`                                                                                | No                                        | Maps postal code to zip              |
| `country`        | `traits.address.country`<br>`context.traits.address.country`<br>`properties.address.country`                                                                                         | No                                        |                                      |
| `company`        | `traits.company.name`<br>`context.traits.company.name`<br>`properties.company.name`                                                                                                  | No                                        | Company name only                    |

**Code Reference**: [data/HSCommonConfig.json](../data/HSCommonConfig.json)

### Custom Properties

Any trait not in the standard mapping above is processed as a custom property:

1. **Property Key Formatting**:

   - Converted to lowercase
   - Spaces replaced with underscores
   - Dots replaced with underscores
   - Example: `User Name` → `user_name`, `user.email` → `user_email`

2. **Property Validation**:

   - Destination fetches existing properties from HubSpot
   - Only properties that exist in HubSpot are included
   - Properties not found in HubSpot are silently dropped

3. **Type Validation and Conversion**:

   ```javascript
   // String properties
   HubSpot Type: "string"
   If value is object → JSON.stringify(value)
   If value is not string → value.toString()

   // Number properties
   HubSpot Type: "number"
   Value must be numeric → Throws error if not

   // Boolean properties
   HubSpot Type: "bool"
   Value must be boolean → Throws error if object

   // Date properties
   HubSpot Type: "date"
   Value converted to UTC midnight timestamp
   Example: "2025-01-15T10:30:00Z" → 1736899200000
   ```

**Code Reference**: [util.js:167-195](../util.js#L167-L195), [util.js:202-207](../util.js#L202-L207)

### Null Value Handling

HubSpot accepts empty string to clear property values:

```javascript
// RudderStack input
{
  "traits": {
    "email": "user@example.com",
    "phone": null
  }
}

// Transformed to HubSpot
{
  "properties": {
    "email": "user@example.com",
    "phone": ""  // null → empty string to clear property
  }
}
```

**Code Reference**: [util.js:237](../util.js#L237)

### Legacy API Payload Format

```json
{
  "properties": [
    { "property": "email", "value": "user@example.com" },
    { "property": "firstname", "value": "John" },
    { "property": "lastname", "value": "Doe" }
  ]
}
```

### New API Payload Format

```json
{
  "properties": {
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

## Track Event Flow

### Legacy API (v1)

```
┌─────────────────────────────────────────────────────────┐
│  1. Validate Destination Config                         │
│     - Verify Hub ID exists                              │
│     - Check authorizationType                           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  2. Extract Event Data                                  │
│     - Event name (required)                             │
│     - Revenue/value/total (optional)                    │
│     - HubSpot ID from externalId (optional)             │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  3. Fetch Property Map (if traits present)              │
│     - GET /properties/v1/contacts/properties            │
│     - Used for additional properties                    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  4. Build Parameters                                    │
│     - _a: Hub ID                                        │
│     - _n: Event name                                    │
│     - _m: Revenue (from properties.revenue/value/total) │
│     - id: HubSpot ID (if available)                     │
│     - Additional: Custom properties from traits         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  5. Build Request                                       │
│     - Endpoint: https://track.hubspot.com/v1/event      │
│     - Method: GET (with query parameters)               │
│     - Auth: hapikey param OR Bearer token               │
└─────────────────────────────────────────────────────────┘
```

**Code Reference**: [HSTransform-v1.js:141-181](../HSTransform-v1.js#L141-L181)

**Limitations**:

- No custom timestamp support (uses server time)
- Limited analytics capabilities
- GET method with parameters (not POST with body)

### New API (v3)

```
┌─────────────────────────────────────────────────────────┐
│  1. Validate Destination Config                         │
│     - Check authorizationType                           │
│     - Verify event mappings configured (hubspotEvents)  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  2. Validate and Map Event Name                         │
│     - Extract event name from message                   │
│     - Validate event name (not empty, trimmed)          │
│     - Look up mapping in destination config             │
│     - Throw error if mapping not found                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  3. Build Base Payload                                  │
│     - Map standard fields (utk, email, objectId)        │
│     - Set occurredAt timestamp                          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  4. Map Event Properties                                │
│     - Apply property mappings from config               │
│     - Add standard track properties                     │
│       (assetDescription, campaignId, city, etc.)        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  5. Validate Identifier                                 │
│     - Require at least one: email, utk, or objectId     │
│     - Throw error if none present                       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  6. Build Request                                       │
│     - Endpoint: /events/v3/send                         │
│     - Method: POST                                      │
│     - Auth: hapikey param OR Bearer token               │
│     - Body: { eventName, properties, occurredAt, ... }  │
└─────────────────────────────────────────────────────────┘
```

**Code Reference**: [HSTransform-v2.js:202-246](../HSTransform-v2.js#L202-L246)

## Track Field Mappings

### Base Track Properties (New API v3)

| HubSpot Field | RudderStack Source                                                      | Required | Notes                                 |
| ------------- | ----------------------------------------------------------------------- | -------- | ------------------------------------- |
| `eventName`   | Config mapping                                                          | Yes      | Must be configured in `hubspotEvents` |
| `utk`         | `traits.utk`<br>`context.traits.utk`<br>`properties.utk`                | No\*     | User token cookie                     |
| `email`       | `traits.email`<br>`context.traits.email`<br>`properties.email`          | No\*     | Contact email                         |
| `objectId`    | `traits.objectId`<br>`context.traits.objectId`<br>`properties.objectId` | No\*     | Contact ID or visitor ID              |
| `occurredAt`  | `properties.occurred_at`<br>`timestamp`<br>`originalTimestamp`          | No       | Unix timestamp (milliseconds)         |

**\*At least one of `utk`, `email`, or `objectId` is required.**

**Priority**: If multiple identifiers provided, `objectId` > `utk` > `email`

**Code Reference**: [data/HSTrackConfig.json](../data/HSTrackConfig.json)

### Standard Track Properties (New API v3)

These properties are automatically mapped if present:

| HubSpot Property       | RudderStack Source                                                                           | Notes               |
| ---------------------- | -------------------------------------------------------------------------------------------- | ------------------- |
| `hs_asset_description` | `properties.assetDescription`<br>`properties.hsAssetDescription`                             | Asset description   |
| `hs_asset_type`        | `properties.assetType`<br>`properties.hsAssetType`                                           | Type of asset       |
| `hs_campaign_id`       | `properties.campaignId`                                                                      | Campaign identifier |
| `hs_city`              | `traits.address.city`<br>`context.traits.address.city`<br>`properties.address.city`          | User's city         |
| `hs_country`           | `traits.address.country`<br>`context.traits.address.country`<br>`properties.address.country` | User's country      |
| `hs_device_name`       | `context.device.name`                                                                        | Device name         |
| `hs_element_class`     | `properties.elementClass`<br>`properties.hsElementClass`                                     | UI element class    |
| `hs_element_id`        | `properties.elementId`<br>`properties.hsElementId`                                           | UI element ID       |

**Code Reference**: [data/HSTrackPropertiesConfig.json](../data/HSTrackPropertiesConfig.json)

### Custom Event Properties

Custom event properties are mapped via the `hubspotEvents` configuration:

```javascript
// Destination config
{
  "hubspotEvents": [
    {
      "rsEventName": "Product Viewed",
      "hubspotEventName": "pe12345_product_view",
      "eventProperties": [
        { "from": "productId", "to": "product_id" },
        { "from": "category", "to": "product_category" }
      ]
    }
  ]
}

// RudderStack event
{
  "event": "Product Viewed",
  "properties": {
    "productId": "SKU123",
    "category": "Electronics"
  }
}

// Transformed to HubSpot
{
  "eventName": "pe12345_product_view",
  "properties": {
    "product_id": "SKU123",
    "product_category": "Electronics"
  }
}
```

**Code Reference**: [util.js:439-490](../util.js#L439-L490)

### Event Name Requirements (New API v3)

1. **Configuration Required**: Event must be mapped in `hubspotEvents` config
2. **Validation**: Event name is validated (`validateEventName()`)
3. **Trimming**: Event names are trimmed and converted to lowercase for matching
4. **Error Handling**: Throws `ConfigurationError` if event not found in mappings

**Code Reference**: [util.js:439-490](../util.js#L439-L490)

## Batching Logic

### Identify Batching (Legacy API v1)

```
┌─────────────────────────────────────────────────────────┐
│  Collect all Identify events from router                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Separate by source type                                │
│  - rETL create operations                               │
│  - rETL update operations                               │
│  - Regular identify operations                          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Chunk into batches of 1000 (MAX_BATCH_SIZE)           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  For regular identify:                                  │
│  - Extract email from each event                        │
│  - Build batch payload with emails                      │
│  - Endpoint: /contacts/v1/contact/batch/                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  For rETL operations:                                   │
│  - Create: /crm/v3/objects/:objectType/batch/create     │
│  - Update: /crm/v3/objects/:objectType/batch/update     │
└─────────────────────────────────────────────────────────┘
```

**Batch Payload Format (Legacy API)**:

```json
{
  "batch": "[
    {\"email\":\"user1@example.com\",\"properties\":[...]},
    {\"email\":\"user2@example.com\",\"properties\":[...]}
  ]"
}
```

**Note**: Payload is JSON stringified into `batch` field

**Code Reference**: [HSTransform-v1.js:247-391](../HSTransform-v1.js#L247-L391)

### Identify Batching (New API v3)

```
┌─────────────────────────────────────────────────────────┐
│  Collect all Identify events from router                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Separate by operation type                             │
│  - rETL create objects                                  │
│  - rETL update objects                                  │
│  - rETL associations                                    │
│  - Create contacts                                      │
│  - Update contacts                                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Chunk into batches of 100 (MAX_BATCH_SIZE_CRM_CONTACT/│
│                             MAX_BATCH_SIZE_CRM_OBJECT)  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Handle duplicates within batch                         │
│  - For create: Keep last event with same email          │
│  - For update: Keep last event with same contact ID     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Build batch request per operation type                 │
│  - Create Contacts: /batch/create                       │
│  - Update Contacts: /batch/update                       │
│  - Create Objects: /:objectType/batch/create            │
│  - Update Objects: /:objectType/batch/update            │
│  - Associations: /associations/.../batch/create         │
└─────────────────────────────────────────────────────────┘
```

**Batch Payload Format (New API v3)**:

Create Contacts:

```json
{
  "inputs": [
    { "properties": { "email": "user1@example.com", ... } },
    { "properties": { "email": "user2@example.com", ... } }
  ]
}
```

Update Contacts:

```json
{
  "inputs": [
    { "id": "12345", "properties": { "firstname": "Updated", ... } },
    { "id": "67890", "properties": { "firstname": "Another", ... } }
  ]
}
```

**Code Reference**: [HSTransform-v2.js:373-505](../HSTransform-v2.js#L373-L505)

### Track Batching

**Not Supported**: Track events are NOT batched. Each track event results in an individual API request.

**Reason**:

- Legacy API: Designed for single event tracking via GET request
- New API: Has batch endpoint (`/events/v3/send/batch`) supporting 500 events, but not currently implemented in destination

## Validations

### Identify Event Validations

#### Common Validations (Both APIs)

1. **Message Type**:

   ```javascript
   if (!message.type) {
     throw new InstrumentationError('Message type is not present. Aborting message.');
   }
   ```

2. **Supported Message Type**:

   ```javascript
   if (message.type !== 'identify') {
     throw new InstrumentationError(`Message type ${message.type} is not supported`);
   }
   ```

3. **Authorization**:

   ```javascript
   // Legacy API
   if (!Config.hubID) {
     throw new ConfigurationError('Hub ID not found. Aborting');
   }
   if (!Config.apiKey) {
     throw new ConfigurationError('API Key not found. Aborting');
   }

   // New Private App API
   if (!Config.accessToken) {
     throw new ConfigurationError('Access Token not found. Aborting');
   }
   ```

#### Legacy API Specific

1. **Email Required** (non-rETL):
   ```javascript
   if (!traits || !traits.email) {
     throw new InstrumentationError('Identify without email is not supported.');
   }
   ```

#### New API Specific

1. **Lookup Field Configuration**:

   ```javascript
   if (!Config.lookupField) {
     throw new ConfigurationError('lookupField is a required field in webapp config');
   }
   ```

2. **Email Format Validation**:

   ```javascript
   if (traits?.email && !validator.isEmail(traits.email)) {
     throw new InstrumentationError(`Email "${traits.email}" is invalid`);
   }
   ```

3. **Traits or Properties Required** (for search):

   ```javascript
   if (!getFieldValueFromMessage(message, 'traits') && !message.properties) {
     throw new InstrumentationError('Identify - Invalid traits value for lookup field');
   }
   ```

4. **Lookup Field Value Required**:
   ```javascript
   if (!lookupFieldInfo?.value) {
     throw new InstrumentationError(
       'Identify:: email i.e a default lookup field for contact lookup not found in traits',
     );
   }
   ```

#### rETL Specific Validations

1. **Object Type Required**:

   ```javascript
   if (!objectType) {
     throw new InstrumentationError('objectType not found');
   }
   ```

2. **External ID Required**:
   ```javascript
   const { objectType, identifierType } = getDestinationExternalIDInfoForRetl(message, 'HS');
   if (!objectType || !identifierType) {
     throw new InstrumentationError('rETL - external Id not found.');
   }
   ```

### Track Event Validations

#### Common Validations

1. **Event Name Required**:

   ```javascript
   let event = get(message, 'event');
   if (!event) {
     throw new InstrumentationError('event name is required for track call');
   }
   ```

2. **Event Name Validation**:
   ```javascript
   validateEventName(event); // Checks for empty strings, trims
   ```

#### Legacy API Specific

1. **Hub ID Required**:
   ```javascript
   if (!Config.hubID) {
     throw new ConfigurationError('Invalid hub id value provided in the destination configuration');
   }
   ```

#### New API Specific

1. **Event Mappings Required**:

   ```javascript
   if (!hubspotEvents) {
     throw new InstrumentationError('Event and property mappings are required for track call');
   }
   ```

2. **Event Mapping Must Exist**:

   ```javascript
   if (!hubspotEventFound) {
     throw new ConfigurationError(
       `Event name '${event}' mappings are not configured in the destination`,
     );
   }
   ```

3. **Identifier Required**:
   ```javascript
   if (!payload.email && !payload.utk && !payload.objectId) {
     throw new InstrumentationError(
       'Either of email, utk or objectId is required for custom behavioral events',
     );
   }
   ```

### Property Type Validations

1. **Number Properties**:

   ```javascript
   if (propertyMap[hsSupportedKey] === 'number' && typeof propValue !== 'number') {
     throw new InstrumentationError(
       `Property ${traitsKey} data type ${typeof propValue} is not matching with
        Hubspot property data type ${propertyMap[hsSupportedKey]}`,
     );
   }
   ```

2. **Boolean Properties**:
   ```javascript
   if (propertyMap[hsSupportedKey] === 'bool' && typeof propValue === 'object') {
     throw new InstrumentationError(
       `Property ${traitsKey} data type ${typeof propValue} is not matching with
        Hubspot property data type ${propertyMap[hsSupportedKey]}`,
     );
   }
   ```

**Code Reference**:

- [transform.js:26-31](../transform.js#L26-L31)
- [util.js:48-63](../util.js#L48-L63)
- [util.js:334-347](../util.js#L334-L347)
- [util.js:167-195](../util.js#L167-L195)
- [HSTransform-v2.js:80-82](../HSTransform-v2.js#L80-L82)
- [HSTransform-v2.js:143-145](../HSTransform-v2.js#L143-L145)
- [HSTransform-v2.js:217-222](../HSTransform-v2.js#L217-L222)

## Use Cases

### 1. Contact Management (Marketing/Sales)

**Scenario**: Sync user data from your application to HubSpot for marketing and sales activities.

**Implementation**:

- Use Identify events to create/update contact records
- Map user attributes to HubSpot contact properties
- Leverage email as primary identifier
- Use New API (v3) for better validation and features

**Example**:

```javascript
rudderanalytics.identify('user123', {
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  company: { name: 'Acme Inc' },
  phone: '+1-555-0123',
  address: {
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
  },
  // Custom properties
  plan: 'Enterprise',
  mrr: 499,
});
```

### 2. Custom Event Tracking (Product Analytics)

**Scenario**: Track user behavior in your application for segmentation and automation.

**Implementation**:

- Use Track events with New API (v3)
- Configure event mappings in destination settings
- Map event properties to HubSpot custom event properties
- Include timestamps for accurate event ordering

**Example**:

```javascript
// Destination config
{
  "hubspotEvents": [
    {
      "rsEventName": "Course Completed",
      "hubspotEventName": "pe12345_course_complete",
      "eventProperties": [
        { "from": "courseId", "to": "course_id" },
        { "from": "courseName", "to": "course_name" },
        { "from": "score", "to": "final_score" }
      ]
    }
  ]
}

// Track call
rudderanalytics.track("Course Completed", {
  courseId: "CS101",
  courseName: "Introduction to Computer Science",
  score: 95,
  occurred_at: "2025-01-15T14:30:00Z"
});
```

### 3. Warehouse Sync (rETL)

**Scenario**: Sync data from your data warehouse (Snowflake, BigQuery, Redshift) to HubSpot CRM.

**Implementation**:

- Use rETL source with New API (v3)
- Configure external IDs with object type and identifier
- Leverage bulk search optimization for large syncs
- Support custom objects and associations

**Example Use Cases**:

- Sync customer data from warehouse to HubSpot contacts
- Create deals from warehouse data
- Update company records with aggregated metrics
- Create associations between contacts and companies

See [docs/retl.md](retl.md) for detailed rETL implementation.

### 4. Multi-Object Relationships

**Scenario**: Create associations between different HubSpot objects (e.g., link contacts to companies).

**Implementation**:

- Use rETL source with association object type
- Specify fromObjectType, toObjectType, and associationTypeId
- Ensure both objects exist before creating association

**Example**:

```json
{
  "type": "identify",
  "context": {
    "mappedToDestination": true,
    "externalId": [
      {
        "type": "HS-association",
        "objectType": "association",
        "fromObjectType": "contacts",
        "toObjectType": "companies",
        "associationTypeId": "1",
        "toObjectId": "company123"
      }
    ]
  },
  "traits": {
    "from": { "id": "contact456" },
    "to": { "id": "company123" }
  }
}
```

### 5. Legacy API Migration

**Scenario**: Migrate from Legacy API (v1) to New API (v3) for enhanced features.

**Migration Steps**:

1. Update destination configuration: `apiVersion: "newApi"`
2. Configure `lookupField` (usually "email")
3. Update track event mappings to use custom events
4. Test with small batch before full migration
5. Monitor for any validation errors (email format, property types)

**Key Differences**:

- Batch size reduced from 1000 to 100
- Email validation enforced
- Track events require event definitions and mappings
- Better error messages and validation
- Support for custom objects and associations

## Error Handling Patterns

### 1. Configuration Errors

```javascript
// Missing required config
throw new ConfigurationError('Access Token not found. Aborting');

// Invalid event mapping
throw new ConfigurationError(
  `Event name '${event}' mappings are not configured in the destination`,
);

// Missing lookup field (New API)
throw new ConfigurationError('lookupField is a required field in webapp config');
```

**User Action**: Update destination configuration in RudderStack dashboard

### 2. Instrumentation Errors

```javascript
// Missing required field
throw new InstrumentationError('Identify without email is not supported.');

// Invalid data format
throw new InstrumentationError(`Email "${traits.email}" is invalid`);

// Property type mismatch
throw new InstrumentationError(
  `Property ${traitsKey} data type ${typeof propValue} is not matching with
   Hubspot property data type ${propertyMap[hsSupportedKey]}`,
);

// Missing event name
throw new InstrumentationError('event name is required for track call');
```

**User Action**: Fix event data structure or property values in event tracking code

### 3. Network Errors

```javascript
// Property fetch failure
throw new NetworkError(
  `Failed to get hubspot properties: ${JSON.stringify(response)}`,
  httpStatus,
  { [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(httpStatus) },
  response
);

// Search failure
throw new NetworkError(
  `Failed to get hubspot contacts: ${JSON.stringify(response)}`,
  httpStatus,
  { [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(httpStatus) },
  response
);

// Multiple contacts found (ambiguous)
throw new NetworkInstrumentationError(
  'Unable to get single Hubspot contact. More than one contacts found.
   Retry with unique lookupPropertyName and lookupValue'
);
```

**User Action**:

- Check HubSpot API credentials and permissions
- Verify API rate limits not exceeded
- For ambiguous contacts, ensure lookup field is unique

### 4. Transformation Errors

```javascript
// Unknown operation (rETL)
throw new TransformationError('rETL - Unknown hubspot operation');

// Missing operation
throw new TransformationError('rETL - Error in getting operation');

// Invalid operation
throw new TransformationError('Unknown hubspot operation', 400);
```

**User Action**: Contact RudderStack support (likely configuration or code issue)

## Performance Considerations

### 1. Property Map Caching

**Strategy**: Fetch property map once per batch instead of per event

**Implementation**: Check if any event has traits before fetching

```javascript
const traitsFound = tempInputs.some((input) => fetchFinalSetOfTraits(input.message) !== undefined);
if (traitsFound) {
  propertyMap = await getProperties(destination, metadata);
}
```

**Impact**: Reduces API calls by ~99% for large batches

### 2. Bulk Search Optimization (rETL)

**Strategy**: Search for all objects in batch before transformation

**Implementation**:

- Extract all identifier values
- Chunk into groups of 100
- Single search request per chunk
- Mark events as create/update based on results

**Impact**: 1000 events = ~10 search calls instead of 1000

### 3. Duplicate Deduplication (New API)

**Strategy**: Remove duplicates within batch before sending

**Implementation**:

- For creates: Keep last event with same email
- For updates: Keep last event with same contact ID

**Impact**: Prevents batch failures due to duplicates

### 4. Batch Size Optimization

**Legacy API**: 1000 events per batch

- Pro: Fewer API calls for large volumes
- Con: Larger payloads, longer processing time

**New API**: 100 events per batch

- Pro: Faster individual request processing
- Con: More API calls for large volumes
- Reason: HubSpot's standardized batch size across all v3 APIs

### 5. Conditional Property Fetching

Only fetch properties when needed:

- Skip if no traits present
- Skip if property map already cached
- Skip for rETL association events

## Testing Recommendations

### 1. Identify Events

**Test Cases**:

- ✓ Create new contact (email not in HubSpot)
- ✓ Update existing contact (email found in HubSpot)
- ✓ Invalid email format (New API)
- ✓ Missing email (Legacy API)
- ✓ Custom properties with various data types
- ✓ Null values to clear properties
- ✓ Date property conversion
- ✓ Batch with duplicates (same email)

### 2. Track Events

**Test Cases**:

- ✓ Valid event with mapping (New API)
- ✓ Event without mapping (should error)
- ✓ Custom properties mapping
- ✓ Custom timestamp (occurredAt)
- ✓ Various identifiers (email, utk, objectId)
- ✓ Missing all identifiers (should error)

### 3. rETL Operations

**Test Cases**:

- ✓ Create custom object
- ✓ Update custom object
- ✓ Create association
- ✓ Bulk search with pagination
- ✓ Email as identifier with secondary emails
- ✓ Property type conversions
- ✓ System field removal

### 4. Batching

**Test Cases**:

- ✓ Batch size limits (1000 for v1, 100 for v3)
- ✓ Mixed create/update operations
- ✓ Duplicate handling within batch
- ✓ rETL create vs update separation

## Code References

### Main Entry Points

- **transform.js**: Router entry point, orchestration
  - `process()` - Single event processor (deprecated, uses router)
  - `processBatchRouter()` - Batch processing with search optimization
  - `processRouterDest()` - Main router handler

### API Version Implementations

- **HSTransform-v1.js**: Legacy API (v1)

  - `processLegacyIdentify()` - Identify transformation
  - `processLegacyTrack()` - Track transformation
  - `legacyBatchEvents()` - Batch handler

- **HSTransform-v2.js**: New API (v3)
  - `processIdentify()` - Identify transformation
  - `processTrack()` - Track transformation
  - `batchEvents()` - Batch handler with deduplication

### Utilities

- **util.js**: Shared utility functions
  - `validateDestinationConfig()` - Config validation
  - `getProperties()` - Fetch property map
  - `searchContacts()` - Search for existing contacts
  - `splitEventsForCreateUpdate()` - Bulk search and split
  - `formatKey()` - Property key formatting
  - `populateTraits()` - Property type conversion
  - `getEventAndPropertiesFromConfig()` - Event mapping

### Configuration

- **config.js**: Constants and endpoints
  - API endpoints for both versions
  - Batch size constants
  - API version enum

### Mapping Configurations

- **data/HSCommonConfig.json**: Standard contact property mappings
- **data/HSTrackConfig.json**: Base track event mappings
- **data/HSTrackPropertiesConfig.json**: Standard track property mappings

---

**For RETL-specific details, see [docs/retl.md](retl.md).**

**For general destination information, see [README.md](../README.md).**
