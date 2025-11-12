# Google Ads Remarketing Lists RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes**

The Google Ads Remarketing Lists destination supports full RETL functionality. Evidence:

- `supportedSourceTypes` includes `warehouse` which indicates RETL support
- `supportsVisualMapper: true` indicates VDM v1 support
- `supportedMessageTypes` includes `record` which indicates VDM v2 support
- `disableJsonMapper: true` (JSON mapper disabled, only VDM supported)
- Comprehensive record event handling in transformer code

## RETL Support Analysis

### Which type of retl support does it have?

- **JSON Mapper**: Not supported (`disableJsonMapper: true`)
- **VDM V1**: Supported (`supportsVisualMapper: true` in `db-config.json`)
- **VDM V2**: Supported (`record` in `supportedMessageTypes`)

### Does it have vdm support?

**Yes** - `supportsVisualMapper: true` is present in `db-config.json`, confirming VDM V1 support.

### Does it have vdm v2 support?

**Yes** - Both requirements met:

- `supportedMessageTypes > record` in `db-config.json`
- `recordTransform.js` implements comprehensive record event handling

### Connection config

Standard Google Ads Remarketing Lists configuration applies:

- **Developer Token**: Google Ads API developer token
- **Customer ID**: Google Ads customer account ID
- **Audience ID**: Target remarketing list ID
- **Type of List**: List type configuration (userID, mobileDeviceID, General)

## RETL Flow Implementation

### Warehouse Integration

Google Ads Remarketing Lists supports RETL through warehouse sources with VDM v1 and VDM v2 functionality:

- **Supported**: Yes, warehouse sources can send data to Google Ads via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Audiencelist and record events
- **Data Flow**: Warehouse/Database → RudderStack → Google Ads (via Customer Match API)
- **Mapping**: VDM v1 and VDM v2 transform warehouse data to Google Ads format

### Supported Message Types for RETL

```json
"supportedMessageTypes": {
  "cloud": ["audiencelist", "record"]
}
```

### Record Event Handling

The destination supports three types of record event flows:

#### 1. Event Stream Record Events (V1)

- **Flow Detection**: Default flow when no VDM flags are present
- **Configuration Source**: `destination.Config`
- **Audience ID**: Uses configured `audienceId` from destination config

#### 2. VDM v1 Record Events

- **Flow Detection**: `isEventSentByVDMV1Flow(event)` returns true
- **Configuration Source**: `destination.Config`
- **Audience ID**: Dynamic resolution using `getOperationAudienceId(audienceId, message)`
- **Special Handling**: Supports audience ID from message properties for dynamic targeting

#### 3. VDM v2 Record Events

- **Flow Detection**: `isEventSentByVDMV2Flow(event)` returns true
- **Configuration Source**: `connection.config.destination`
- **User Schema**: Dynamically derived from `message.identifiers` keys
- **Data Mapping**: `message.identifiers` mapped to `message.fields` for processing

## RETL-Specific Logic

### Mapped to Destination Detection

The destination identifies RETL flows using the `mappedToDestination` flag:

```javascript
const mappedToDestination = get(message, MappedToDestinationKey);
if (!operationAudienceId && mappedToDestination) {
  const { objectType } = getDestinationExternalIDInfoForRetl(
    message,
    'GOOGLE_ADWORDS_REMARKETING_LISTS',
  );
  operationAudienceId = objectType;
}
```

### Record Event Actions

The destination supports three action types for record events:

1. **Insert**: Creates new user identifiers in the list

   - Maps to `create` operation in Google Ads API
   - Adds users to the Customer Match list

2. **Update**: Updates existing user identifiers

   - Maps to `create` operation in Google Ads API
   - Google Ads handles updates as upserts

3. **Delete**: Removes user identifiers from the list
   - Maps to `remove` operation in Google Ads API
   - Removes users from the Customer Match list

### Batch Processing

- **Batch Size**: 20 user identifiers per operation
- **Grouping**: Records are grouped by action type (`delete`, `insert`, `update`)
- **Processing**: Each action group is processed separately with appropriate operation type

### User Identifier Processing

For record events, user identifiers are processed based on:

1. **Type of List Configuration**:

   - `userID`: Uses `thirdPartyUserId` field
   - `mobileDeviceID`: Uses `mobileId` field
   - `General`: Uses configured user schema fields

2. **User Schema Fields**:

   - `email`: Mapped to `hashedEmail`
   - `phone`: Mapped to `hashedPhoneNumber`
   - `addressInfo`: Mapped to address information object

3. **Hashing**: Applied based on `isHashRequired` configuration

### Error Handling

- **Partial Failures**: Supported through Google Ads API partial failure handling
- **Validation**: Records with missing required fields are filtered out
- **Response Mapping**: Success responses are mapped back to original record metadata

### Configuration Inheritance

VDM v2 events inherit configuration from the connection object:

- `audienceId`: Target list ID
- `typeOfList`: List type configuration
- `isHashRequired`: Hashing requirement
- `userDataConsent`: Consent settings
- `personalizationConsent`: Personalization consent

## Data Flow

### RETL Data Processing

1. **Record Ingestion**: Records received with action and identifiers
2. **Flow Detection**: Determine VDM v1, VDM v2, or event stream flow
3. **Configuration Resolution**: Extract config from appropriate source
4. **User Schema Mapping**: Map identifiers to Google Ads format
5. **Batching**: Group into chunks of 20 identifiers per operation
6. **API Calls**: Execute three-step offline user data job process
7. **Response Handling**: Map results back to original records

### Example RETL Event

```javascript
// VDM v2 record event for audience management
{
  "type": "record",
  "action": "insert",
  "identifiers": {
    "email": "user@example.com",
    "phone": "+1234567890"
  },
  "fields": {
    "email": "user@example.com",
    "phone": "+1234567890"
  }
}
```

## Rate Limits and Constraints

### Google Ads API Limits

- **Job Processing Time**: Offline user data jobs may take 6+ hours to complete
- **Rate Limits**: Subject to Google Ads API daily operation limits
- **Identifier Limits**: Maximum 100,000 user identifiers per job
- **Batch Size**: 20 user identifiers per operation

### RETL Processing Constraints

- **Message Types**: Limited to audiencelist and record events
- **VDM Only**: JSON mapper disabled (`disableJsonMapper: true`)
- **Cloud Mode Only**: Device mode not supported for RETL
- **Consent Requirements**: Must comply with Google's user consent policies

## Summary

The Google Ads Remarketing Lists destination supports full RETL functionality through:

- **RETL Support**: Yes, via warehouse source type support
- **JSON Mapper**: Not supported (`disableJsonMapper: true`)
- **VDM v1**: Supported (`supportsVisualMapper: true`)
- **VDM v2**: Supported (`record` in `supportedMessageTypes`)
- **Supported Events**: Audiencelist and record events
- **API Integration**: Google Ads Customer Match API for audience management
- **Flow Types**: Supports event stream, VDM v1, and VDM v2 flows

**Key Features**:

- Comprehensive record event handling with insert/update/delete actions
- Dynamic audience ID resolution for VDM flows
- Batch processing with 20 identifiers per operation
- Support for multiple user identifier types (email, phone, mobile ID, etc.)
- Partial failure handling and response mapping
