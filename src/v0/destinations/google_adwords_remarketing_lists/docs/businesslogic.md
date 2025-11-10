# Business Logic and Mappings - Google Ads Remarketing Lists

## Data Mappings

### Offline Data Jobs Mapping

Maps event properties to Google Ads offline user data job parameters:

| Source Field                      | Destination Field      | Required | Description                                |
| --------------------------------- | ---------------------- | -------- | ------------------------------------------ |
| `properties.validateOnly`         | `validateOnly`         | No       | Validates request without execution        |
| `properties.enablePartialFailure` | `enablePartialFailure` | No       | Allows partial success in batch operations |
| `properties.enableWarnings`       | `enableWarnings`       | No       | Returns warnings in response               |

### Address Information Mapping

Maps user address data to Google Ads address format:

| Source Field                   | Destination Field | Required | Description                |
| ------------------------------ | ----------------- | -------- | -------------------------- |
| `firstName`, `hashedFirstName` | `hashedFirstName` | No       | User's first name (hashed) |
| `lastName`, `hashedlastName`   | `hashedLastName`  | No       | User's last name (hashed)  |
| `city`                         | `city`            | No       | City name                  |
| `countryCode`, `country`       | `countryCode`     | No       | ISO country code           |
| `postalCode`                   | `postalCode`      | No       | Postal/ZIP code            |

### User Identifier Mapping

Maps user identifiers based on list type and schema:

| User Schema   | Google Ads Field    | Hashing Required | Description                      |
| ------------- | ------------------- | ---------------- | -------------------------------- |
| `email`       | `hashedEmail`       | Yes              | SHA-256 hashed email address     |
| `phone`       | `hashedPhoneNumber` | Yes              | SHA-256 hashed phone number      |
| `addressInfo` | `addressInfo`       | Partial          | Address object with hashed names |

### Special List Types

| Type of List     | Google Ads Field   | Description                  |
| ---------------- | ------------------ | ---------------------------- |
| `userID`         | `thirdPartyUserId` | Third-party user identifiers |
| `mobileDeviceID` | `mobileId`         | Mobile device identifiers    |

## Flow Logic

### Audience List Event Flow

1. **Event Validation**:

   - Validates presence of `message.type`
   - Validates presence of `message.properties`
   - Validates presence of `message.properties.listData`

2. **List Data Processing**:

   - Extracts `add` and `remove` operations from `listData`
   - Validates operation types (only `add` and `remove` supported)
   - Processes each operation type separately

3. **User Identifier Population**:

   - Calls `populateIdentifiers()` for each operation
   - Applies hashing if `isHashRequired` is true
   - Filters identifiers based on `userSchema` configuration
   - Groups identifiers into chunks of 20

4. **Payload Construction**:

   - Creates separate payloads for `add` (create) and `remove` operations
   - Each payload contains multiple operations with 20 identifiers each
   - Applies consent configuration to each payload

5. **Response Building**:
   - Generates API requests for each payload
   - Includes authentication headers and endpoint configuration
   - Returns array of requests for batch processing

### Record Event Flow

1. **Flow Detection**:

   - Determines if event is VDM v1, VDM v2, or event stream
   - Extracts configuration from appropriate source

2. **Action Grouping**:

   - Groups records by action type: `delete`, `insert`, `update`
   - Maps actions to Google Ads operations:
     - `delete` → `remove`
     - `insert` → `create`
     - `update` → `create`

3. **Identifier Processing**:

   - Calls `populateIdentifiersForRecordEvent()`
   - Processes identifiers based on list type and schema
   - Applies hashing and validation

4. **Batch Creation**:

   - Creates chunks of 20 identifiers per operation
   - Builds operations array for offline user data job
   - Applies consent and configuration settings

5. **Response Generation**:
   - Creates success responses for valid records
   - Handles error responses for invalid records
   - Maintains metadata association for tracking

## Validations

### Required Fields

#### Audience List Events

- `message.type` must be "audiencelist"
- `message.properties.listData` must be present
- At least one of `add` or `remove` must be present in `listData`
- User identifiers must match configured `userSchema`

#### Record Events

- `message.type` must be "record"
- `message.action` must be one of: `delete`, `insert`, `update`
- `message.fields` or `message.identifiers` must contain valid user data

### Configuration Validations

- `customerId` is required and must be numeric
- `audienceId` is required for cloud mode
- `loginCustomerId` is required when `subAccount` is true
- `userSchema` must contain valid identifier types

### User Identifier Validations

#### Email Addresses

- Must be valid email format before hashing
- Normalized to lowercase and trimmed
- SHA-256 hashed when `isHashRequired` is true

#### Phone Numbers

- Normalized to remove special characters
- SHA-256 hashed when `isHashRequired` is true

#### Address Information

- `firstName` and `lastName` are hashed when present
- `countryCode` must be valid ISO country code
- `postalCode` is sent in plain text

### Data Quality Checks

- Empty or null identifiers are filtered out
- Invalid email formats are logged and skipped
- Missing required address fields result in incomplete address objects

## General Use Cases

### Customer Remarketing

- **Add Users**: Add customers to remarketing lists based on website behavior
- **Remove Users**: Remove customers who unsubscribed or opted out
- **List Refresh**: Regularly update lists with new customer data

### Audience Segmentation

- **Demographic Targeting**: Use address information for location-based targeting
- **Customer Lifecycle**: Segment customers based on purchase history or engagement
- **Cross-Platform Matching**: Match users across devices using multiple identifiers

### Privacy Compliance

- **Consent Management**: Respect user consent preferences for data usage
- **Data Minimization**: Only send necessary identifiers based on use case
- **Right to be Forgotten**: Remove users upon request

### Data Synchronization

- **Warehouse Integration**: Sync customer data from data warehouses
- **Real-time Updates**: Process real-time events for immediate list updates
- **Batch Processing**: Handle large volumes of customer data efficiently

## Error Handling

### Partial Failures

- Google Ads API supports partial failure mode
- Individual user identifier failures don't fail entire job
- Failed identifiers are logged with specific error reasons

### Common Error Scenarios

- **Invalid Customer ID**: Incorrect or inaccessible customer account
- **List Not Found**: Target user list doesn't exist or isn't accessible
- **Quota Exceeded**: API rate limits or daily quotas exceeded
- **Invalid Identifiers**: Malformed email addresses or phone numbers
- **Consent Issues**: Missing or invalid consent information

### Retry Logic

- Network-level failures are retried automatically
- API-level errors are not retried to avoid duplicate operations
- Jobs that fail to start can be retried with same operations
