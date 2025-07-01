# RETL Functionality - Google Ads Remarketing Lists

## VDM v2 Support

- **Supported**: Yes
- **Evidence**: 
  - `record` event type is present in `supportedMessageTypes` in `db-config.json`
  - `recordTransform.js` implements comprehensive record event handling
  - Support for both VDM v1 and VDM v2 flows

## Record Event Handling

The destination supports three types of record event flows:

### 1. Event Stream Record Events (V1)
- **Flow Detection**: Default flow when no VDM flags are present
- **Configuration Source**: `destination.Config`
- **Audience ID**: Uses configured `audienceId` from destination config

### 2. VDM v1 Record Events
- **Flow Detection**: `isEventSentByVDMV1Flow(event)` returns true
- **Configuration Source**: `destination.Config`
- **Audience ID**: Dynamic resolution using `getOperationAudienceId(audienceId, message)`
- **Special Handling**: Supports audience ID from message properties for dynamic targeting

### 3. VDM v2 Record Events
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

### Data Flow Summary

1. **Record Ingestion**: Records received with action and identifiers
2. **Flow Detection**: Determine VDM v1, VDM v2, or event stream flow
3. **Configuration Resolution**: Extract config from appropriate source
4. **User Schema Mapping**: Map identifiers to Google Ads format
5. **Batching**: Group into chunks of 20 identifiers per operation
6. **API Calls**: Execute three-step offline user data job process
7. **Response Handling**: Map results back to original records

## Limitations

- **Job Processing Time**: Offline user data jobs may take 6+ hours to complete
- **Rate Limits**: Subject to Google Ads API daily operation limits
- **Identifier Limits**: Maximum 100,000 user identifiers per job
- **Consent Requirements**: Must comply with Google's user consent policies
