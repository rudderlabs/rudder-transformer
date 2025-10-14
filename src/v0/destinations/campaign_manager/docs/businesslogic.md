# Campaign Manager (DCM) Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Campaign Manager (formerly DoubleClick Campaign Manager - DCM) destination integration. It covers how RudderStack events are mapped to Campaign Manager's API format, the specific API endpoints used, and special handling for various conversion types.

Campaign Manager is Google's ad management and serving platform. This integration allows you to send conversion data from RudderStack to Campaign Manager for conversion tracking and attribution.

## API Reference

**Base URL**: `https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/{profileId}/conversions/{requestType}`

**API Documentation**: [Google Campaign Manager 360 Conversions API](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions)

**Supported Request Types**:
- `batchinsert` - [Insert new conversions](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions/batchinsert)
- `batchupdate` - [Update existing conversions](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions/batchupdate)

## Field Mappings

### Required Fields

| RudderStack Field | Campaign Manager Field | Notes |
|-------------------|------------------------|-------|
| `properties.floodlightConfigurationId` | `floodlightConfigurationId` | Required. The Floodlight configuration ID |
| `properties.floodlightActivityId` | `floodlightActivityId` | Required. The Floodlight activity ID |
| `properties.ordinal` | `ordinal` | Required. Unique identifier for deduplication |
| `properties.quantity` | `quantity` | Required. Quantity of conversions |
| `timestamp` | `timestampMicros` | Required. Converted to microseconds |

### User Identifiers

At least one of the following user identifiers is required:

| RudderStack Field | Campaign Manager Field | Notes |
|-------------------|------------------------|-------|
| `properties.gclid` | `gclid` | Google Click ID |
| `properties.matchId` | `matchId` | Match ID from Floodlight tag |
| `properties.dclid` | `dclid` | DoubleClick Click ID |
| `properties.mobileDeviceId` | `mobileDeviceId` | Mobile device ID |
| `properties.impressionId` | `impressionId` | Impression ID |
| `properties.encryptedUserId` | `encryptedUserId` | Encrypted user ID |
| `properties.encryptedUserIdCandidates` | `encryptedUserIdCandidates` | Array of encrypted user ID candidates |

### Conversion Value

| RudderStack Field | Campaign Manager Field | Notes |
|-------------------|------------------------|-------|
| `properties.value` | `value` | Conversion value (monetary) |
| `properties.total` | `value` | Fallback to total if value not present |
| `properties.revenue` | `value` | Fallback to revenue if value/total not present |

### Custom Variables

| RudderStack Field | Campaign Manager Field | Notes |
|-------------------|------------------------|-------|
| `properties.customVariables` | `customVariables` | Array of custom Floodlight variables |

### Privacy and Compliance Fields

| RudderStack Field | Campaign Manager Field | Notes |
|-------------------|------------------------|-------|
| `properties.limitAdTracking` | `limitAdTracking` | Limit Ad Tracking flag (batchinsert only) |
| `properties.childDirectedTreatment` | `childDirectedTreatment` | COPPA compliance flag (batchinsert only) |
| `properties.treatmentForUnderage` | `treatmentForUnderage` | Treatment for underage users |
| `properties.nonPersonalizedAd` | `nonPersonalizedAd` | Non-personalized ad flag |

**Note**: `limitAdTracking` and `childDirectedTreatment` cannot be updated and are only supported for `batchinsert` requests.

## API Endpoints and Request Flow

### Batch Insert Conversions

**Endpoint**: `POST https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/{profileId}/conversions/batchinsert`

**Documentation**: [batchinsert API](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions/batchinsert)

**Request Flow**:
1. Track events with `properties.requestType = "batchinsert"` are sent to the batchinsert endpoint
2. Conversions are batched (up to 1000 per request)
3. Each conversion is validated for required fields and at least one user identifier
4. Privacy and compliance flags are included if configured
5. Timestamp is converted to microseconds
6. Authentication is done via OAuth 2.0 Bearer token

**Example Payload**:
```json
{
  "kind": "dfareporting#conversionsBatchInsertRequest",
  "conversions": [
    {
      "floodlightConfigurationId": "12345678",
      "floodlightActivityId": "87654321",
      "ordinal": "20231015-123456",
      "timestampMicros": "1697376000000000",
      "quantity": 1,
      "value": 99.99,
      "gclid": "TeSter-123",
      "limitAdTracking": false,
      "childDirectedTreatment": false,
      "treatmentForUnderage": false,
      "nonPersonalizedAd": false,
      "customVariables": [
        {
          "kind": "dfareporting#customFloodlightVariable",
          "type": "U1",
          "value": "custom_value"
        }
      ]
    }
  ]
}
```

### Batch Update Conversions

**Endpoint**: `POST https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/{profileId}/conversions/batchupdate`

**Documentation**: [batchupdate API](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions/batchupdate)

**Request Flow**:
1. Track events with `properties.requestType = "batchupdate"` are sent to the batchupdate endpoint
2. Conversions are batched (up to 1000 per request)
3. `childDirectedTreatment` and `limitAdTracking` fields are removed (cannot be updated)
4. Enhanced conversions (user identifiers) can be added to existing conversions
5. Timestamp is converted to microseconds
6. Authentication is done via OAuth 2.0 Bearer token

**Example Payload**:
```json
{
  "kind": "dfareporting#conversionsBatchUpdateRequest",
  "conversions": [
    {
      "floodlightConfigurationId": "12345678",
      "floodlightActivityId": "87654321",
      "ordinal": "20231015-123456",
      "timestampMicros": "1697376000000000",
      "quantity": 1,
      "value": 99.99,
      "gclid": "TeSter-123",
      "treatmentForUnderage": false,
      "nonPersonalizedAd": false
    }
  ]
}
```

## Special Handling

### Enhanced Conversions

**Supported For**: `batchupdate` requests only

Enhanced conversions allow you to send first-party customer data (hashed) to improve conversion measurement and attribution.

**Configuration**:
- `destination.Config.enableEnhancedConversions`: Must be set to `true`
- `destination.Config.isHashingRequired`: Set to `true` (default) to automatically hash PII data

**Supported User Identifiers**:

| RudderStack Field | Enhanced Conversion Field | Hashing Required |
|-------------------|---------------------------|------------------|
| `context.traits.email` | `hashedEmail` | Yes (SHA-256) |
| `properties.email` | `hashedEmail` | Yes (SHA-256) |
| `context.traits.phone` | `hashedPhoneNumber` | Yes (SHA-256) |
| `properties.phone` | `hashedPhoneNumber` | Yes (SHA-256) |
| `context.traits.firstName` | `addressInfo.hashedFirstName` | Yes (SHA-256) |
| `properties.firstName` | `addressInfo.hashedFirstName` | Yes (SHA-256) |
| `context.traits.lastName` | `addressInfo.hashedLastName` | Yes (SHA-256) |
| `properties.lastName` | `addressInfo.hashedLastName` | Yes (SHA-256) |
| `context.traits.street` | `addressInfo.hashedStreetAddress` | Yes (SHA-256) |
| `properties.street` | `addressInfo.hashedStreetAddress` | Yes (SHA-256) |
| `context.traits.city` | `addressInfo.city` | No |
| `properties.city` | `addressInfo.city` | No |
| `context.traits.state` | `addressInfo.state` | No |
| `properties.state` | `addressInfo.state` | No |
| `context.traits.zip` | `addressInfo.postalCode` | No |
| `properties.zip` | `addressInfo.postalCode` | No |
| `context.traits.country` | `addressInfo.countryCode` | No |
| `properties.country` | `addressInfo.countryCode` | No |

**Normalization and Hashing**:

1. **Email Normalization**:
   - Convert to lowercase
   - Remove leading/trailing whitespace
   - For Gmail addresses: remove dots from local part
   - Hash with SHA-256

2. **Phone Number Normalization**:
   - Parse using libphonenumber-js
   - Format to E.164 standard
   - Hash with SHA-256

3. **Name and Address Normalization**:
   - Convert to lowercase
   - Remove leading/trailing whitespace
   - Hash with SHA-256

**Example Transformation**:
```javascript
// Original event
{
  "type": "track",
  "event": "Order Completed",
  "properties": {
    "requestType": "batchupdate",
    "floodlightConfigurationId": "12345678",
    "floodlightActivityId": "87654321",
    "ordinal": "20231015-123456",
    "quantity": 1,
    "value": 99.99,
    "gclid": "TeSter-123",
    "email": "user@example.com",
    "phone": "+1-555-123-4567",
    "firstName": "John",
    "lastName": "Doe"
  }
}

// Transformed to Campaign Manager event
{
  "kind": "dfareporting#conversionsBatchUpdateRequest",
  "conversions": [
    {
      "floodlightConfigurationId": "12345678",
      "floodlightActivityId": "87654321",
      "ordinal": "20231015-123456",
      "timestampMicros": "1697376000000000",
      "quantity": 1,
      "value": 99.99,
      "gclid": "TeSter-123",
      "userIdentifiers": [
        {
          "hashedEmail": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
        },
        {
          "hashedPhoneNumber": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
        },
        {
          "addressInfo": {
            "hashedFirstName": "96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a",
            "hashedLastName": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
          }
        }
      ]
    }
  ]
}
```

### Encrypted User IDs

For privacy-sensitive conversions, you can use encrypted user IDs instead of plain identifiers.

**Required Configuration**:
- `properties.encryptedUserId` or `properties.encryptedUserIdCandidates`: The encrypted user ID(s)
- `properties.encryptionEntityType`: Type of encryption entity (e.g., "DCM_ADVERTISER")
- `properties.encryptionSource`: Source of encryption (e.g., "AD_SERVING")
- `properties.encryptionEntityId`: ID of the encryption entity

**Supported Encryption Entity Types**:
- `ENCRYPTION_ENTITY_TYPE_UNKNOWN`
- `DCM_ACCOUNT`
- `DCM_ADVERTISER`
- `DBM_PARTNER`
- `DBM_ADVERTISER`
- `ADWORDS_CUSTOMER`
- `DFP_NETWORK_CODE`

**Supported Encryption Sources**:
- `ENCRYPTION_SCOPE_UNKNOWN`
- `AD_SERVING`
- `DATA_TRANSFER`

**Example Payload**:
```json
{
  "kind": "dfareporting#conversionsBatchInsertRequest",
  "encryptionInfo": {
    "kind": "dfareporting#encryptionInfo",
    "encryptionEntityType": "DCM_ADVERTISER",
    "encryptionSource": "AD_SERVING",
    "encryptionEntityId": "123456"
  },
  "conversions": [
    {
      "floodlightConfigurationId": "12345678",
      "floodlightActivityId": "87654321",
      "ordinal": "20231015-123456",
      "timestampMicros": "1697376000000000",
      "quantity": 1,
      "value": 99.99,
      "encryptedUserId": "encrypted_user_id_string",
      "encryptedUserIdCandidates": ["candidate1", "candidate2"]
    }
  ]
}
```

### Timestamp Handling

Campaign Manager requires timestamps in microseconds (Unix timestamp with microsecond precision).

**Conversion Logic**:
1. **ISO 8601 with Z (UTC)**: `"2023-10-15T12:00:00.000Z"` → Parse and multiply by 1000
2. **ISO 8601 with timezone**: `"2023-10-15T12:00:00.000+05:30"` → Parse and convert to microseconds
3. **13-digit string (milliseconds)**: `"1697376000000"` → Multiply by 1000
4. **10-digit string (seconds)**: `"1697376000"` → Multiply by 1,000,000
5. **Microseconds**: `"1697376000000000"` → Use as-is

**Example Transformations**:
```javascript
// Input: "2023-10-15T12:00:00.000Z"
// Output: "1697371200000000"

// Input: "1697371200000" (milliseconds)
// Output: "1697371200000000"

// Input: "1697371200" (seconds)
// Output: "1697371200000000"
```

### Custom Variables

Campaign Manager supports custom Floodlight variables to pass additional data with conversions.

**Format**:
```json
{
  "customVariables": [
    {
      "kind": "dfareporting#customFloodlightVariable",
      "type": "U1",
      "value": "custom_value_1"
    },
    {
      "kind": "dfareporting#customFloodlightVariable",
      "type": "U2",
      "value": "custom_value_2"
    }
  ]
}
```

**Variable Types**:
- `U1` to `U100`: Custom user variables
- `NUM1` to `NUM100`: Custom numeric variables

### Batching

**Batch Size**: Up to 1000 conversions per request

**Batching Logic**:
1. Events are grouped by request type (`batchinsert` or `batchupdate`)
2. Each group is chunked into batches of up to 1000 conversions
3. Separate requests are made for each batch
4. If any event in a batch has `encryptionInfo`, it's included in the batch request

**Example Batched Request**:
```json
{
  "kind": "dfareporting#conversionsBatchInsertRequest",
  "conversions": [
    { /* conversion 1 */ },
    { /* conversion 2 */ },
    { /* ... up to 1000 conversions */ }
  ]
}
```

**Granular Response Handling** (V1 Router):

The V1 network handler provides individual status for each conversion in a batch:

```json
{
  "status": [
    {
      "conversion": { /* conversion 1 data */ },
      "kind": "dfareporting#conversionStatus"
      // No errors = success
    },
    {
      "conversion": { /* conversion 2 data */ },
      "errors": [
        {
          "code": "INVALID_ARGUMENT",
          "message": "Invalid floodlight activity ID"
        }
      ],
      "kind": "dfareporting#conversionStatus"
    }
  ],
  "hasFailures": true
}
```

**Benefits**:
- Individual event tracking: Know exactly which conversions succeeded or failed
- Partial batch success: Some events can succeed while others fail
- Detailed error messages: Each failed event includes specific error information
- Automatic retry logic: Only retryable events are retried, aborted events are filtered out

## Validations

### Pre-Transformation Validations

1. **Message Type**: Must be `track`
   - Error: `"Message Type missing. Aborting message."`

2. **Properties Object**: Must be present
   - Error: `"properties must be present in event. Aborting message"`

3. **Request Type**: Must be either `batchinsert` or `batchupdate`
   - Error: `"properties.requestType must be one of batchinsert or batchupdate."`

### Post-Transformation Validations

1. **User Identifier**: At least one of the following must be present:
   - `gclid`
   - `matchId`
   - `dclid`
   - `encryptedUserId`
   - `encryptedUserIdCandidates`
   - `mobileDeviceId`
   - `impressionId`
   
   Error: `"Atleast one of encryptedUserId, encryptedUserIdCandidates, matchId, mobileDeviceId, gclid, dclid, impressionId."`

2. **Encryption Info Validation**: If `encryptedUserId` or `encryptedUserIdCandidates` is used, `encryptionInfo` must be complete
   - Must include: `encryptionEntityType`, `encryptionSource`, `encryptionEntityId`
   - Error: `"If encryptedUserId or encryptedUserIdCandidates is used, provide proper values for properties.encryptionEntityType, properties.encryptionSource and properties.encryptionEntityId"`

## Error Handling

### Network Handler

The Campaign Manager integration includes custom error handling for batch conversion responses with **granular per-event status reporting**.

#### V1 Router (Recommended)

The V1 network handler provides individual status for each event in a batch:

**Process Flow**:
1. Send batch of up to 1000 conversions
2. Receive `response.status` array with individual event results
3. Iterate through each event status
4. Classify each event as success, retryable, or abortable
5. Return individual status per event to RudderStack

**Error Classification**:

**Retryable Errors** (status code 500):
- `INTERNAL` - Internal server errors
- `UNAVAILABLE` - Service temporarily unavailable
- Any other errors not in abortable list
- Events will be automatically retried by RudderStack

**Non-Retryable Errors** (status code 400 - Aborted):
- `PERMISSION_DENIED` - Authentication or permission issues
  - Check OAuth credentials and Campaign Manager permissions
- `INVALID_ARGUMENT` - Invalid request parameters
  - Verify floodlight IDs, ordinal format, and required fields
- `NOT_FOUND` - Resource not found
  - Verify Floodlight configuration and activity IDs exist

**Success** (status code 200):
- No errors in the event status
- Conversion successfully recorded in Campaign Manager

**Example Response Handling**:

```javascript
// Batch with 3 conversions
// Response from Campaign Manager:
{
  "hasFailures": true,
  "status": [
    {
      "conversion": { "ordinal": "order-1" },
      "kind": "dfareporting#conversionStatus"
      // Event 1: Success (no errors)
    },
    {
      "conversion": { "ordinal": "order-2" },
      "errors": [
        {
          "code": "INVALID_ARGUMENT",
          "message": "Invalid floodlight activity ID"
        }
      ],
      "kind": "dfareporting#conversionStatus"
      // Event 2: Aborted (400)
    },
    {
      "conversion": { "ordinal": "order-3" },
      "errors": [
        {
          "code": "INTERNAL",
          "message": "Internal server error"
        }
      ],
      "kind": "dfareporting#conversionStatus"
      // Event 3: Retryable (500)
    }
  ]
}

// RudderStack receives:
[
  { statusCode: 200, metadata: {...}, error: "success" },       // Event 1
  { statusCode: 400, metadata: {...}, error: "Invalid..." },    // Event 2
  { statusCode: 500, metadata: {...}, error: "Internal..." }    // Event 3
]
```

#### V0 Processor (Legacy)

The V0 handler checks `hasFailures` flag and determines retry/abort for the entire batch based on error codes found in any event.

### Benefits of Granular Error Handling

1. **Partial Batch Success**: Successfully processed conversions are acknowledged even if others fail
2. **Detailed Diagnostics**: Each event includes specific error messages for troubleshooting
3. **Cost Optimization**: Avoid re-sending successful conversions
4. **Better Monitoring**: Track success rate at individual event level

## Configuration Options

### Destination Config

| Config Field | Type | Required | Default | Description |
|-------------|------|----------|---------|-------------|
| `profileId` | string | Yes | - | Campaign Manager Profile ID |
| `nonPersonalizedAd` | boolean | No | false | Default non-personalized ad flag |
| `treatmentForUnderage` | boolean | No | false | Default underage treatment flag |
| `childDirectedTreatment` | boolean | No | false | Default child-directed treatment flag (batchinsert only) |
| `limitAdTracking` | boolean | No | false | Default limit ad tracking flag (batchinsert only) |
| `enableEnhancedConversions` | boolean | No | false | Enable enhanced conversions with user identifiers |
| `isHashingRequired` | boolean | No | true | Automatically hash PII data for enhanced conversions |

### Event-Level Overrides

Event-level properties can override destination config defaults:

```javascript
{
  "type": "track",
  "event": "Order Completed",
  "properties": {
    "profileId": "987654321",  // Override config profileId
    "requestType": "batchinsert",
    "floodlightConfigurationId": "12345678",
    "floodlightActivityId": "87654321",
    "ordinal": "unique-ordinal-123",
    "quantity": 1,
    "value": 99.99,
    "gclid": "TeSter-123",
    "nonPersonalizedAd": true,  // Override config default
    "treatmentForUnderage": false,
    "childDirectedTreatment": false,
    "limitAdTracking": false
  }
}
```

## General Use Cases

### Conversion Tracking

Campaign Manager is primarily used for tracking conversions from advertising campaigns:

- **Standard Conversions**: Track purchases, sign-ups, form submissions
- **Custom Conversions**: Track custom events with Floodlight activities
- **Cross-Device Conversions**: Track conversions across devices using encrypted IDs
- **Offline Conversions**: Import offline conversions with match IDs

### Attribution and Measurement

- **Multi-Touch Attribution**: Track user journey across multiple touchpoints
- **Cross-Channel Attribution**: Attribute conversions to the correct advertising channel
- **Conversion Path Analysis**: Analyze the path users take before converting

### Privacy-Compliant Tracking

- **Enhanced Conversions**: Improve attribution while maintaining privacy with hashed PII
- **Encrypted User IDs**: Use encrypted identifiers for privacy-sensitive use cases
- **COPPA Compliance**: Flag conversions from children for COPPA compliance
- **Limited Ad Tracking**: Respect user privacy preferences with LAT flags

### E-commerce Use Cases

- **Purchase Tracking**: Track completed purchases with value and quantity
- **Shopping Cart Events**: Track cart additions and abandonments
- **Dynamic Remarketing**: Track product views for dynamic remarketing campaigns
- **Revenue Attribution**: Attribute revenue to advertising campaigns

## Mapping Configuration Files

The mapping configuration is defined in JSON files within the destination directory:

- `CampaignManagerTrackConfig.json`: Mapping for Track events and conversion fields
- `CampaignManagerEnhancedConversionConfig.json`: Mapping for enhanced conversion user identifiers

## Best Practices

1. **Use Unique Ordinals**: Ensure ordinals are unique per conversion to prevent duplicate counting
2. **Include User Identifiers**: Always include at least one user identifier (preferably gclid or dclid)
3. **Enable Enhanced Conversions**: For better attribution, enable enhanced conversions and send hashed PII
4. **Set Proper Privacy Flags**: Configure privacy flags appropriately based on your use case and regulations
5. **Batch Conversions**: Take advantage of batching for high-volume conversion imports
6. **Monitor Failures**: Check Campaign Manager for conversion import failures and retry as needed
7. **Use batchupdate Carefully**: Only use batchupdate for conversions that already exist in Campaign Manager
8. **Validate Floodlight IDs**: Ensure floodlightConfigurationId and floodlightActivityId are correct

