# Campaign Manager 360 Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Campaign Manager 360 destination integration. It covers how RudderStack track events are mapped to Campaign Manager 360's Conversions API format, the specific API endpoints used, validation rules, and special handling for enhanced conversions.

## API Endpoints and Request Flow

### Track Events → Conversion API

**Primary Endpoints**:

1. `POST https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/{profileId}/conversions/batchinsert`
2. `POST https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/{profileId}/conversions/batchupdate`

**Documentation**:

- [Conversions: batchinsert](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions/batchinsert)
- [Conversions: batchupdate](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions/batchupdate)
- [Enhanced Conversions](https://developers.google.com/doubleclick-advertisers/guides/conversions_ec)

### Request Flow for Track Events

```
Track Event
    ↓
Validate Event (validateRequest)
    ↓
Process Track (processTrack)
    ↓
  - Apply Track Config mapping
  - Convert timestamp to microseconds
  - Apply destination config defaults
  - Handle Enhanced Conversions (if enabled)
  - Prepare encryption info (if needed)
    ↓
Build Response (buildResponse)
    ↓
Post-validate (postValidateRequest)
    ↓
Router Batching (processRouterDest)
    ↓
  - Group by request type (batchinsert/batchupdate)
  - Chunk into batches of 1000 conversions
  - Generate batch requests
    ↓
API Delivery via Proxy
```

## Message Type Handling

### Track Events

**Supported**: ✅ Yes

**Purpose**: Send conversion events to Campaign Manager 360

**Implementation**: `processTrack()` function in `transform.js`

**Required Fields**:

```javascript
{
  type: 'track',
  properties: {
    requestType: 'batchinsert' | 'batchupdate',  // Required
    floodlightConfigurationId: string,            // Required
    floodlightActivityId: string,                 // Required
    ordinal: string,                              // Required
    quantity: number,                             // Required
    profileId: string,                            // Optional (uses destination config if not provided)

    // At least one user identifier required:
    gclid: string,                                // Google Click ID
    matchId: string,                              // Match ID
    dclid: string,                                // DoubleClick Click ID
    mobileDeviceId: string,                       // Mobile Device ID
    impressionId: string,                         // Impression ID
    encryptedUserId: string,                      // Encrypted User ID
    encryptedUserIdCandidates: string[],          // Encrypted User ID Candidates
  },
  timestamp: string | number,                     // Required (ISO 8601 or Unix)
}
```

### Unsupported Message Types

- **Identify**: ❌ Not supported
- **Page**: ❌ Not supported
- **Screen**: ❌ Not supported
- **Group**: ❌ Not supported
- **Alias**: ❌ Not supported

All unsupported message types will throw an error: `Message type {messageType} not supported`

## Field Mappings

### Track Event → Conversion Object

Mapping configuration: `data/CampaignManagerTrackConfig.json`

| Source Field                                                     | Destination Field           | Type    | Required | Notes                            |
| ---------------------------------------------------------------- | --------------------------- | ------- | -------- | -------------------------------- |
| `properties.floodlightConfigurationId`                           | `floodlightConfigurationId` | string  | ✅ Yes   | Floodlight configuration ID      |
| `properties.ordinal`                                             | `ordinal`                   | string  | ✅ Yes   | Unique ordinal for deduplication |
| `timestamp`                                                      | `timestampMicros`           | string  | ✅ Yes   | Converted to microseconds        |
| `properties.floodlightActivityId`                                | `floodlightActivityId`      | string  | ✅ Yes   | Floodlight activity ID           |
| `properties.quantity`                                            | `quantity`                  | number  | ✅ Yes   | Conversion quantity              |
| `properties.value` or `properties.total` or `properties.revenue` | `value`                     | number  | ❌ No    | Conversion value (to number)     |
| `properties.customVariables`                                     | `customVariables`           | array   | ❌ No    | Custom variables                 |
| `properties.mobileDeviceId`                                      | `mobileDeviceId`            | string  | ❌ No    | Mobile device ID                 |
| `properties.encryptedUserIdCandidates`                           | `encryptedUserIdCandidates` | array   | ❌ No    | Encrypted user ID candidates     |
| `properties.gclid`                                               | `gclid`                     | string  | ❌ No    | Google Click ID                  |
| `properties.matchId`                                             | `matchId`                   | string  | ❌ No    | Match ID                         |
| `properties.dclid`                                               | `dclid`                     | string  | ❌ No    | DoubleClick Click ID             |
| `properties.impressionId`                                        | `impressionId`              | string  | ❌ No    | Impression ID                    |
| `properties.limitAdTracking`                                     | `limitAdTracking`           | boolean | ❌ No    | Limit ad tracking flag           |
| `properties.treatmentForUnderage`                                | `treatmentForUnderage`      | boolean | ❌ No    | GDPR underage treatment          |
| `properties.childDirectedTreatment`                              | `childDirectedTreatment`    | boolean | ❌ No    | COPPA child treatment            |
| `properties.nonPersonalizedAd`                                   | `nonPersonalizedAd`         | boolean | ❌ No    | Non-personalized ad flag         |

### Destination Config Defaults

Some fields can be overridden at the event level or use destination config defaults:

```javascript
// Priority: event properties > destination config
requestJson.nonPersonalizedAd = isDefinedAndNotNull(requestJson.nonPersonalizedAd)
  ? requestJson.nonPersonalizedAd
  : destination.Config.nonPersonalizedAd;

requestJson.treatmentForUnderage = isDefinedAndNotNull(requestJson.treatmentForUnderage)
  ? requestJson.treatmentForUnderage
  : destination.Config.treatmentForUnderage;

requestJson.childDirectedTreatment = isDefinedAndNotNull(requestJson.childDirectedTreatment)
  ? requestJson.childDirectedTreatment
  : destination.Config.childDirectedTreatment;

requestJson.limitAdTracking = isDefinedAndNotNull(requestJson.limitAdTracking)
  ? requestJson.limitAdTracking
  : destination.Config.limitAdTracking;
```

**Note**: For `batchupdate` requests, `childDirectedTreatment` and `limitAdTracking` are removed from the payload as updating these fields is not allowed.

### Profile ID Resolution

Profile ID is resolved with the following priority:

```javascript
const profileId = message.properties.profileId
  ? Number(message.properties.profileId)
  : Number(destination.Config.profileId);
```

1. Event-level: `properties.profileId` (highest priority)
2. Destination config: `destination.Config.profileId` (fallback)

## Enhanced Conversions

### Overview

Enhanced Conversions allow you to provide user identifiers (email, phone, address) to improve conversion matching accuracy. This feature is only available for `batchupdate` requests.

### Configuration

- **Enable Enhanced Conversions**: `destination.Config.enableEnhancedConversions` must be `true`
- **Hash User Identifiers**: `destination.Config.isHashingRequired` (default: `true`)
- **Request Type**: Must be `batchupdate`

### Enhanced Conversion Field Mappings

Mapping configuration: `data/CampaignManagerEnhancedConversionConfig.json`

| Source Field                                         | Destination Field                 | Hashed | Required | Notes                            |
| ---------------------------------------------------- | --------------------------------- | ------ | -------- | -------------------------------- |
| `traits.email` or `context.traits.email`             | `hashedEmail`                     | ✅ Yes | ❌ No    | SHA-256 hash of normalized email |
| `traits.phone` or `context.traits.phone`             | `hashedPhoneNumber`               | ✅ Yes | ❌ No    | SHA-256 hash of E.164 phone      |
| `traits.firstName` or `context.traits.firstName`     | `addressInfo.hashedFirstName`     | ✅ Yes | ❌ No    | SHA-256 hash of first name       |
| `traits.lastName` or `context.traits.lastName`       | `addressInfo.hashedLastName`      | ✅ Yes | ❌ No    | SHA-256 hash of last name        |
| `traits.street` or `context.traits.address.street`   | `addressInfo.hashedStreetAddress` | ✅ Yes | ❌ No    | SHA-256 hash of street           |
| `traits.city` or `context.traits.address.city`       | `addressInfo.city`                | ❌ No  | ❌ No    | Plain text city                  |
| `traits.state` or `context.traits.address.state`     | `addressInfo.state`               | ❌ No  | ❌ No    | Plain text state                 |
| `traits.country` or `context.traits.address.country` | `addressInfo.countryCode`         | ❌ No  | ❌ No    | Plain text country code          |
| `traits.zip` or `context.traits.address.zip`         | `addressInfo.postalCode`          | ✅ Yes | ❌ No    | SHA-256 hash of postal code      |

### Normalization and Hashing Logic

#### Email Normalization

```javascript
const normalizeEmail = (email) => {
  const domains = ['@gmail.com', '@googlemail.com'];
  const matchingDomain = domains.find((domain) => email.endsWith(domain));

  if (matchingDomain) {
    // Remove dots from local part for Gmail addresses
    const localPart = email.split('@')[0].replace(/\./g, '');
    return `${localPart}${matchingDomain}`;
  }

  return email;
};
```

**Examples**:

- `john.doe@gmail.com` → `johndoe@gmail.com`
- `j.o.h.n@gmail.com` → `john@gmail.com`
- `john.doe@example.com` → `john.doe@example.com` (unchanged)

#### Phone Normalization

```javascript
const normalizePhone = (phone, countryCode) => {
  const phoneNumberObject = parsePhoneNumber(phone, countryCode);
  if (phoneNumberObject && phoneNumberObject.isValid()) {
    return phoneNumberObject.format('E.164');
  }
  throw new InstrumentationError('Invalid phone number');
};
```

**Examples**:

- `4155552671` with `US` → `+14155552671`
- `9876543210` with `IN` → `+919876543210`
- `123` with `US` → Error: Invalid phone number

#### Text Normalization (Names, Street Address)

```javascript
const normalizedValue = value.trim().toLowerCase();
```

**Examples**:

- `  John  ` → `john`
- `SMITH` → `smith`
- `123 Main St` → `123 main st`

#### Hashing

All sensitive fields are hashed using SHA-256:

```javascript
const hashedValue = sha256(normalizedValue);
```

**Example**:

- `john@gmail.com` → normalize → `john@gmail.com` → hash → `96a8f4d3e8c5b4f7...`

### Enhanced Conversion Processing Flow

```javascript
// In processTrack function
if (
  destination.Config.enableEnhancedConversions &&
  message.properties.requestType === 'batchupdate'
) {
  const userIdentifiers = CommonUtils.toArray(
    prepareUserIdentifiers(message, destination.Config.isHashingRequired ?? true),
  );

  if (userIdentifiers.length > 0) {
    requestJson.userIdentifiers = userIdentifiers;
  }
}
```

### User Identifiers Structure

The `userIdentifiers` array can contain up to 3 objects:

```javascript
[
  {
    hashedEmail: 'sha256_hash_of_normalized_email',
  },
  {
    hashedPhoneNumber: 'sha256_hash_of_e164_phone',
  },
  {
    addressInfo: {
      hashedFirstName: 'sha256_hash_of_firstname',
      hashedLastName: 'sha256_hash_of_lastname',
      hashedStreetAddress: 'sha256_hash_of_street',
      city: 'San Francisco', // Plain text
      state: 'CA', // Plain text
      countryCode: 'US', // Plain text
      postalCode: 'sha256_hash_of_zip',
    },
  },
];
```

**Note**: Each type of identifier is added as a separate object in the array. If email is present, one object with `hashedEmail`. If phone is present, one object with `hashedPhoneNumber`. If address info is present, one object with `addressInfo`.

## Encryption Support

### When to Use Encryption

Use encrypted user IDs when you need to send conversions for users whose IDs are encrypted by Google's DoubleClick system.

### Required Fields

```javascript
{
  properties: {
    // One of these:
    encryptedUserId: "encrypted_id_string",
    encryptedUserIdCandidates: ["encrypted_id_1", "encrypted_id_2"],

    // All of these are required:
    encryptionEntityType: "DCM_ACCOUNT" | "DCM_ADVERTISER" | "DBM_PARTNER" | "DBM_ADVERTISER" | "ADWORDS_CUSTOMER" | "DFP_NETWORK_CODE",
    encryptionSource: "AD_SERVING" | "DATA_TRANSFER",
    encryptionEntityId: "entity_id_string"
  }
}
```

### Encryption Info Processing

```javascript
const encryptionInfo = {};

if (message.properties.encryptedUserId || message.properties.encryptedUserIdCandidates) {
  // Validate and set encryption entity type
  if (EncryptionEntityType.includes(message.properties.encryptionEntityType)) {
    encryptionInfo.encryptionEntityType = message.properties.encryptionEntityType;
  }

  // Validate and set encryption source
  if (EncryptionSource.includes(message.properties.encryptionSource)) {
    encryptionInfo.encryptionSource = message.properties.encryptionSource;
  }

  // Set encryption entity ID
  encryptionInfo.encryptionEntityId = message.properties.encryptionEntityId;

  // Validate all required fields are present
  if (
    isDefinedAndNotNull(encryptionInfo.encryptionSource) &&
    isDefinedAndNotNull(encryptionInfo.encryptionEntityType) &&
    isDefinedAndNotNull(encryptionInfo.encryptionEntityId)
  ) {
    encryptionInfo.kind = 'dfareporting#encryptionInfo';
  } else {
    throw new InstrumentationError(
      'If encryptedUserId or encryptedUserIdCandidates is used, provide proper values for ' +
        'properties.encryptionEntityType, properties.encryptionSource and properties.encryptionEntityId',
    );
  }
}
```

### Encryption Info in Request

If encryption info is provided, it's added at the batch level:

```javascript
{
  "kind": "dfareporting#conversionsBatchInsertRequest",
  "encryptionInfo": {
    "kind": "dfareporting#encryptionInfo",
    "encryptionEntityType": "DCM_ACCOUNT",
    "encryptionSource": "AD_SERVING",
    "encryptionEntityId": "123456"
  },
  "conversions": [
    {
      "encryptedUserId": "encrypted_id_string",
      // ... other conversion fields
    }
  ]
}
```

## Timestamp Conversion

### Conversion Logic

Campaign Manager 360 requires timestamps in microseconds. The `convertToMicroseconds` function handles various input formats:

```javascript
function convertToMicroseconds(input) {
  const timestamp = Date.parse(input);

  if (!Number.isNaN(timestamp)) {
    // Valid date string
    if (input.includes('Z')) {
      // ISO 8601 with 'Z' → milliseconds
      return timestamp * 1000;
    }
    // Other date strings
    return timestamp.toString().length === 13
      ? timestamp * 1000 // milliseconds
      : timestamp * 1000000; // seconds
  }

  if (/^\d+$/.test(input)) {
    // Numeric string
    if (input.length === 13) {
      return parseInt(input, 10) * 1000; // milliseconds
    }
    if (input.length === 10) {
      return parseInt(input, 10) * 1000000; // seconds
    }
    return parseInt(input, 10); // assume microseconds
  }

  return timestamp;
}
```

### Examples

| Input                           | Type                          | Output (microseconds) |
| ------------------------------- | ----------------------------- | --------------------- |
| `2021-01-04T08:25:04.780Z`      | ISO 8601 with Z               | `1609748704780000`    |
| `2022-11-17T00:22:02.903+05:30` | ISO 8601 with offset          | `1668624722903000`    |
| `1697013935`                    | Unix seconds (10 digits)      | `1697013935000000`    |
| `1697013935000`                 | Unix milliseconds (13 digits) | `1697013935000000`    |
| `1668624722903333`              | Unix microseconds (16 digits) | `1668624722903333`    |

## Batching Logic

### Router-level Batching

Campaign Manager 360 implements batching at the router level in `processRouterDest`:

```javascript
const processRouterDest = async (inputs, reqMetadata) => {
  const batchErrorRespList = [];
  const eventChunksArray = [];

  // Process each event
  await Promise.all(
    inputs.map(async (event) => {
      try {
        const proccessedRespList = process(event);
        eventChunksArray.push({
          message: proccessedRespList,
          metadata: event.metadata,
          destination,
        });
      } catch (error) {
        batchErrorRespList.push(handleRtTfSingleEventError(event, error, reqMetadata));
      }
    }),
  );

  // Batch successful events
  let batchResponseList = [];
  if (eventChunksArray.length > 0) {
    batchResponseList = batchEvents(eventChunksArray);
  }

  return [...batchResponseList, ...batchErrorRespList];
};
```

### Batching Strategy

1. **Group by Request Type**:

   ```javascript
   const groupedEventChunks = lodash.groupBy(
     eventChunksArray,
     (event) => event.message.body.JSON.kind,
   );
   // Results in:
   // {
   //   'dfareporting#conversionsBatchInsertRequest': [...],
   //   'dfareporting#conversionsBatchUpdateRequest': [...]
   // }
   ```

2. **Chunk by Size**:

   ```javascript
   const eventChunks = lodash.chunk(
     groupedEventChunks[eventKind],
     MAX_BATCH_CONVERSATIONS_SIZE, // 1000
   );
   ```

3. **Generate Batch Requests**:
   ```javascript
   eventChunks.forEach((chunk) => {
     const batchEventResponse = generateBatch(eventKind, chunk);
     batchedResponseList.push(getSuccessRespEvents(...));
   });
   ```

### Batch Request Structure

```javascript
{
  "batchedRequest": {
    "body": {
      "JSON": {
        "kind": "dfareporting#conversionsBatchInsertRequest",
        "conversions": [
          // Up to 1000 conversion objects
        ],
        "encryptionInfo": {
          // Only if any conversion uses encrypted user IDs
        }
      }
    },
    "endpoint": "https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/{profileId}/conversions/batchinsert",
    "headers": {
      "Authorization": "Bearer {access_token}",
      "Content-Type": "application/json"
    }
  },
  "metadata": [ /* array of metadata for all batched events */ ],
  "destination": { /* destination config */ }
}
```

### Batching Constraints

- **Maximum batch size**: 1000 conversions
- **Separate batches**: `batchinsert` and `batchupdate` requests are batched separately
- **Shared encryption info**: If any conversion in the batch uses encrypted user IDs, the encryption info is shared at batch level

## Validation Rules

### Pre-request Validation (validateRequest)

```javascript
function validateRequest(message) {
  // 1. Properties must exist
  if (!message.properties) {
    throw new InstrumentationError(
      '[CAMPAIGN MANAGER (DCM)]: properties must be present in event. Aborting message',
    );
  }

  // 2. Request type must be valid
  if (
    message.properties.requestType !== 'batchinsert' &&
    message.properties.requestType !== 'batchupdate'
  ) {
    throw new InstrumentationError(
      '[CAMPAIGN MANAGER (DCM)]: properties.requestType must be one of batchinsert or batchupdate.',
    );
  }
}
```

### Post-request Validation (postValidateRequest)

```javascript
function postValidateRequest(response) {
  const conversion = response.body.JSON.conversions[0];

  // 1. Encryption info validation
  if (
    (conversion.encryptedUserId || conversion.encryptedUserIdCandidates) &&
    !response.body.JSON.encryptionInfo
  ) {
    throw new InstrumentationError(
      '[CAMPAIGN MANAGER (DCM)]: encryptionInfo is a required field if encryptedUserId or encryptedUserIdCandidates is used.',
    );
  }

  // 2. User identifier validation
  if (
    !conversion.gclid &&
    !conversion.matchId &&
    !conversion.dclid &&
    !conversion.encryptedUserId &&
    !conversion.encryptedUserIdCandidates &&
    !conversion.mobileDeviceId &&
    !conversion.impressionId
  ) {
    throw new InstrumentationError(
      '[CAMPAIGN MANAGER (DCM)]: Atleast one of encryptedUserId, encryptedUserIdCandidates, matchId, mobileDeviceId, gclid, dclid, impressionId.',
    );
  }
}
```

### Message Type Validation

```javascript
if (!message.type) {
  throw new InstrumentationError(
    '[CAMPAIGN MANAGER (DCM)]: Message Type missing. Aborting message.',
  );
}

const messageType = message.type.toLowerCase();
if (messageType !== EventType.TRACK) {
  throw new InstrumentationError(`Message type ${messageType} not supported`);
}
```

## Error Handling

### Network Handler Response Handling

The `networkHandler.js` implements custom error handling for Campaign Manager 360 responses:

```javascript
function checkIfFailuresAreRetryable(response) {
  const { status } = response;

  if (Array.isArray(status)) {
    for (const st of status) {
      for (const err of st.errors) {
        // Non-retryable error codes
        if (
          err.code === 'PERMISSION_DENIED' ||
          err.code === 'INVALID_ARGUMENT' ||
          err.code === 'NOT_FOUND'
        ) {
          return false;
        }
      }
    }
  }

  return true; // All other errors are retryable
}
```

### Response Handler

```javascript
const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
  const { response, status } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    // Check for partial failures
    if (response.hasFailures === true) {
      if (checkIfFailuresAreRetryable(response)) {
        throw new RetryableError(
          `Campaign Manager: Retrying during CAMPAIGN_MANAGER response transformation`,
          500,
          destinationResponse,
        );
      } else {
        throw new AbortedError(
          `Campaign Manager: Aborting during CAMPAIGN_MANAGER response transformation`,
          400,
          destinationResponse,
        );
      }
    }

    return {
      status,
      message: `[CAMPAIGN_MANAGER Response Handler] - Request Processed Successfully`,
      destinationResponse,
    };
  }

  throw new NetworkError(
    `Campaign Manager: ${response.error?.message} during CAMPAIGN_MANAGER response transformation`,
    500,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    getAuthErrCategoryFromStCode(status),
  );
};
```

### Error Categories

| Error Type        | Code                | Retryable | Description                                                         |
| ----------------- | ------------------- | --------- | ------------------------------------------------------------------- |
| Permission Denied | `PERMISSION_DENIED` | ❌ No     | Insufficient permissions                                            |
| Invalid Argument  | `INVALID_ARGUMENT`  | ❌ No     | Invalid data format or values                                       |
| Not Found         | `NOT_FOUND`         | ❌ No     | Resource not found (e.g., conversion doesn't exist for batchupdate) |
| Other API Errors  | Various             | ✅ Yes    | Temporary failures, rate limits, etc.                               |
| HTTP 4xx          | 400-499             | ❌ No     | Client errors (except specific retryable cases)                     |
| HTTP 5xx          | 500-599             | ✅ Yes    | Server errors                                                       |

## Common Use Cases

### Use Case 1: Basic Conversion Tracking (batchinsert)

**Scenario**: Track new conversions with Google Click ID

**Event Structure**:

```javascript
{
  type: 'track',
  event: 'Conversion',
  timestamp: '2024-10-14T10:30:00.000Z',
  properties: {
    requestType: 'batchinsert',
    floodlightConfigurationId: '12345',
    floodlightActivityId: '67890',
    ordinal: 'order_12345',
    quantity: 1,
    value: 99.99,
    gclid: 'Tester_GwAcC12345'
  }
}
```

**Generated Conversion**:

```json
{
  "kind": "dfareporting#conversionsBatchInsertRequest",
  "conversions": [
    {
      "floodlightConfigurationId": "12345",
      "floodlightActivityId": "67890",
      "ordinal": "order_12345",
      "timestampMicros": "1697279400000000",
      "quantity": 1,
      "value": 99.99,
      "gclid": "Tester_GwAcC12345"
    }
  ]
}
```

### Use Case 2: Enhanced Conversion Update (batchupdate)

**Scenario**: Add user identifiers to existing conversion

**Event Structure**:

```javascript
{
  type: 'track',
  event: 'Conversion Update',
  timestamp: '2024-10-14T10:30:00.000Z',
  traits: {
    email: 'john.doe@gmail.com',
    phone: '+14155552671',
    firstName: 'John',
    lastName: 'Doe',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    zip: '94102'
  },
  properties: {
    requestType: 'batchupdate',
    floodlightConfigurationId: '12345',
    floodlightActivityId: '67890',
    ordinal: 'order_12345',
    quantity: 1,
    gclid: 'Tester_GwAcC12345'
  }
}
```

**Generated Conversion** (with hashing):

```json
{
  "kind": "dfareporting#conversionsBatchUpdateRequest",
  "conversions": [
    {
      "floodlightConfigurationId": "12345",
      "floodlightActivityId": "67890",
      "ordinal": "order_12345",
      "timestampMicros": "1697279400000000",
      "quantity": 1,
      "gclid": "Tester_GwAcC12345",
      "userIdentifiers": [
        {
          "hashedEmail": "96a8f4d3e8c5b4f7..." // SHA-256 of johndoe@gmail.com
        },
        {
          "hashedPhoneNumber": "f3b2c5d8a1e4..." // SHA-256 of +14155552671
        },
        {
          "addressInfo": {
            "hashedFirstName": "a1b2c3d4e5f6...", // SHA-256 of john
            "hashedLastName": "b2c3d4e5f6a1...", // SHA-256 of doe
            "city": "San Francisco", // Plain text
            "state": "CA", // Plain text
            "countryCode": "US", // Plain text
            "postalCode": "c3d4e5f6a1b2..." // SHA-256 of 94102
          }
        }
      ]
    }
  ]
}
```

### Use Case 3: Mobile Conversion with Encrypted User ID

**Scenario**: Track mobile app conversion with encrypted user ID

**Event Structure**:

```javascript
{
  type: 'track',
  event: 'In-App Purchase',
  timestamp: '2024-10-14T10:30:00.000Z',
  properties: {
    requestType: 'batchinsert',
    floodlightConfigurationId: '12345',
    floodlightActivityId: '67890',
    ordinal: 'transaction_abc123',
    quantity: 1,
    value: 4.99,
    mobileDeviceId: 'ABC123-456-DEF',
    encryptedUserId: 'encrypted_user_id_string',
    encryptionEntityType: 'DCM_ADVERTISER',
    encryptionSource: 'AD_SERVING',
    encryptionEntityId: '789012',
    limitAdTracking: true,
    nonPersonalizedAd: true
  }
}
```

**Generated Conversion**:

```json
{
  "kind": "dfareporting#conversionsBatchInsertRequest",
  "encryptionInfo": {
    "kind": "dfareporting#encryptionInfo",
    "encryptionEntityType": "DCM_ADVERTISER",
    "encryptionSource": "AD_SERVING",
    "encryptionEntityId": "789012"
  },
  "conversions": [
    {
      "floodlightConfigurationId": "12345",
      "floodlightActivityId": "67890",
      "ordinal": "transaction_abc123",
      "timestampMicros": "1697279400000000",
      "quantity": 1,
      "value": 4.99,
      "mobileDeviceId": "ABC123-456-DEF",
      "encryptedUserId": "encrypted_user_id_string",
      "limitAdTracking": true,
      "nonPersonalizedAd": true
    }
  ]
}
```

### Use Case 4: Offline Conversion with Custom Variables

**Scenario**: Track offline conversion with custom data

**Event Structure**:

```javascript
{
  type: 'track',
  event: 'Store Purchase',
  timestamp: '2024-10-14T10:30:00.000Z',
  properties: {
    requestType: 'batchinsert',
    floodlightConfigurationId: '12345',
    floodlightActivityId: '67890',
    ordinal: 'store_sale_xyz789',
    quantity: 2,
    value: 149.98,
    matchId: 'customer_loyalty_456',
    customVariables: [
      { kind: 'dfareporting#customFloodlightVariable', type: 'U1', value: 'premium_member' },
      { kind: 'dfareporting#customFloodlightVariable', type: 'U2', value: 'store_123' }
    ]
  }
}
```

**Generated Conversion**:

```json
{
  "kind": "dfareporting#conversionsBatchInsertRequest",
  "conversions": [
    {
      "floodlightConfigurationId": "12345",
      "floodlightActivityId": "67890",
      "ordinal": "store_sale_xyz789",
      "timestampMicros": "1697279400000000",
      "quantity": 2,
      "value": 149.98,
      "matchId": "customer_loyalty_456",
      "customVariables": [
        {
          "kind": "dfareporting#customFloodlightVariable",
          "type": "U1",
          "value": "premium_member"
        },
        { "kind": "dfareporting#customFloodlightVariable", "type": "U2", "value": "store_123" }
      ]
    }
  ]
}
```

## Summary

The Campaign Manager 360 destination processes track events to send conversion data to Google's Campaign Manager 360 API. Key characteristics:

- **Message Type**: Track events only
- **Request Types**: batchinsert (new) and batchupdate (existing)
- **Batching**: Up to 1000 conversions per batch, grouped by request type
- **Enhanced Conversions**: Supported for batchupdate with automatic PII hashing
- **User Identifiers**: Flexible support (gclid, matchId, mobileDeviceId, encryptedUserId, etc.)
- **Encryption**: Full support for encrypted user IDs with required encryption info
- **Timestamp Handling**: Automatic conversion to microseconds from various formats
- **Validation**: Comprehensive pre and post-request validation
- **Error Handling**: Smart retry logic based on error types
- **Privacy Compliance**: Support for COPPA, GDPR, and ad tracking limitations
