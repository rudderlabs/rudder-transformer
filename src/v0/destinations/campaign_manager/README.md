# Campaign Manager 360 Destination

Implementation in **Javascript**

## Configuration

### Required Settings

- **Profile ID**: User profile ID associated with Campaign Manager 360 account

  - Required for constructing API endpoints
  - Can be overridden per event via `properties.profileId`
  - Used in endpoint: `https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/{profileId}/conversions/{requestType}`

- **OAuth 2.0 Authentication**:
  - Authentication type: OAuth 2.0
  - Provider: Google
  - Role: `campaign_manager`
  - Scopes required:
    - `https://www.googleapis.com/auth/userinfo.profile`
    - `https://www.googleapis.com/auth/userinfo.email`
    - `https://www.googleapis.com/auth/ddmconversions`
    - `https://www.googleapis.com/auth/dfareporting`
    - `https://www.googleapis.com/auth/dfatrafficking`
  - Implementation: `rudder-auth/src/routes/auth/campaign_manager.ts`

### Optional Settings

- **Limit Ad Tracking**: (Boolean, default: false)

  - When set to true, conversions will be used for reporting but not targeting
  - This prevents remarketing
  - Can be overridden per event via `properties.limitAdTracking`

- **Child Directed Treatment**: (Boolean, default: false)

  - Indicates if the request may come from a user under the age of 13 (COPPA compliance)
  - Cannot be updated in `batchupdate` requests
  - Can be overridden per event via `properties.childDirectedTreatment`

- **Non Personalized Ad**: (Boolean, default: false)

  - Indicates whether the conversion was for a non-personalized ad
  - Can be overridden per event via `properties.nonPersonalizedAd`

- **Treatment for Underage**: (Boolean, default: false)

  - Indicates if the request may come from a user under the age of 16 (GDPR compliance)
  - Can be overridden per event via `properties.treatmentForUnderage`

- **Enable Enhanced Conversions**: (Boolean, default: false)

  - When enabled, allows sending user identifiers (email, phone, address) for better conversion matching
  - Only works with `batchupdate` request type
  - Requires user identifiers in the event

- **Hash User Identifiers**: (Boolean, default: true)
  - When enabled with Enhanced Conversions, RudderStack will hash user identifiers (email, phone, name, address)
  - Disable if you're already sending hashed data
  - Prerequisite: `enableEnhancedConversions` must be enabled

## Integration Functionalities

### Implementation Type

- **Type**: Javascript (not CDK v2)
- **Location**: `src/v0/destinations/campaign_manager/`

### Processor vs Router Destination

- **Type**: Router destination
- **Config**: `transformAtV1 = "router"` in `db-config.json`
- **Batching**: Implemented at router level in `processRouterDest` function

### Supported Message Types

- **Track**: ✅ Supported
  - Used for sending conversion events to Campaign Manager 360
- **Identify**: ❌ Not supported
- **Page**: ❌ Not supported
- **Screen**: ❌ Not supported
- **Group**: ❌ Not supported
- **Alias**: ❌ Not supported

### Batching Support

- **Supported**: Yes
- **Message Types**: Track events only
- **Batch Limits**:
  - Maximum conversions per batch: **1000** (`MAX_BATCH_CONVERSATIONS_SIZE`)
  - Batching logic groups events by request type (`batchinsert` vs `batchupdate`)
  - Implementation: `batchEvents()` and `generateBatch()` functions in `transform.js`

### Proxy Delivery Support

- **Supported**: Yes
- **Implementation**: `src/v1/destinations/campaign_manager/networkHandler.js`
- **Partial Batching Response Handling**: It supports partial handling. If a batch of events failed it return the status as per the failed events. There is not any dontBatch directive as the destination response contains per event status.

### User Deletion Support

- **Supported**: No
- **File**: `deleteUsers.js` does not exist in the destination folder

### OAuth Support

- **Supported**: Yes
- **Config**: `config.auth.type = "OAuth"` in `db-config.json`
- **Provider**: Google
- **Role**: `campaign_manager`
- **Access Token**: Retrieved via `getAccessToken(metadata, 'access_token')` and passed in Authorization header

### Additional Functionalities

#### 1. Enhanced Conversions

- **Purpose**: Improve conversion accuracy by providing user identifiers
- **Supported Identifiers**:
  - Email (hashed)
  - Phone number (hashed, E.164 format)
  - First name (hashed)
  - Last name (hashed)
  - Street address (hashed)
  - City (plain text)
  - State (plain text)
  - Country code (plain text)
  - Postal code (hashed)
- **Request Type**: Only works with `batchupdate`
- **Hashing**: SHA-256 hashing applied to sensitive fields
  - Email normalization: Removes dots from Gmail addresses
  - Phone normalization: Converts to E.164 format
  - Text normalization: Trim and lowercase before hashing
- **Configuration Mapping**: `data/CampaignManagerEnhancedConversionConfig.json`

#### 2. Request Type Support

- **batchinsert**: For inserting new conversions
- **batchupdate**: For updating existing conversions
  - Supports enhanced conversions with user identifiers
  - Does not allow updating `childDirectedTreatment` and `limitAdTracking`
- **Required Field**: `properties.requestType` must be either `batchinsert` or `batchupdate`

#### 3. Encryption Support

- **Purpose**: For encrypted user IDs
- **Fields**:
  - `encryptedUserId`: Single encrypted user ID
  - `encryptedUserIdCandidates`: Array of encrypted user ID candidates
- **Required Encryption Info**:
  - `encryptionEntityType`: One of: `DCM_ACCOUNT`, `DCM_ADVERTISER`, `DBM_PARTNER`, `DBM_ADVERTISER`, `ADWORDS_CUSTOMER`, `DFP_NETWORK_CODE`
  - `encryptionSource`: One of: `AD_SERVING`, `DATA_TRANSFER`
  - `encryptionEntityId`: ID of the encryption entity
- **Validation**: All three encryption info fields are required if using encrypted user IDs

### Validations

#### Pre-request Validations

1. **Message Type**: Must be `track`
2. **Properties**: `message.properties` must be present
3. **Request Type**: `properties.requestType` must be `batchinsert` or `batchupdate`

#### Post-request Validations

1. **Encryption Info**: If `encryptedUserId` or `encryptedUserIdCandidates` is used, `encryptionInfo` must be present with all required fields
2. **User Identifier**: At least one of the following must be present:
   - `gclid` (Google Click ID)
   - `matchId`
   - `dclid` (DoubleClick Click ID)
   - `encryptedUserId`
   - `encryptedUserIdCandidates`
   - `mobileDeviceId`
   - `impressionId`

#### Required Fields (from Track Config)

- `floodlightConfigurationId` ✅ Required
- `ordinal` ✅ Required
- `timestampMicros` ✅ Required (converted from `timestamp`)
- `floodlightActivityId` ✅ Required
- `quantity` ✅ Required

#### Optional Fields

- `customVariables`
- `mobileDeviceId`
- `value` (mapped from `properties.value`, `properties.total`, or `properties.revenue`)
- `encryptedUserIdCandidates`
- `gclid`
- `matchId`
- `dclid`
- `impressionId`
- `limitAdTracking`
- `treatmentForUnderage`
- `childDirectedTreatment`
- `nonPersonalizedAd`

### Rate Limits

**Quick Summary**:

- **Batch Size**: Maximum 1000 conversions per request ([reference](https://developers.google.com/doubleclick-advertisers/guides/conversions_faq))
- **Daily Quota**: 50,000 requests per day (can be increased)
- **Rate Limit**: 1 QPS (queries per second) default, up to 10 QPS maximum

**Endpoints**:

- `POST /dfareporting/v4/userprofiles/{profileId}/conversions/batchinsert`
- `POST /dfareporting/v4/userprofiles/{profileId}/conversions/batchupdate`

For detailed rate limits, error handling, and requesting additional quota, see [Rate Limits and Batch Sizes](#rate-limits-and-batch-sizes) section below.

## General Queries

### Event Ordering Required?

**Yes, event ordering is required** for Campaign Manager 360 conversions for the following reasons:

1. **Conversion Updates**:

   - The `batchupdate` request type updates existing conversions
   - If events are processed out of order, you might update a conversion with stale data, overwriting newer information
   - This is especially critical when using enhanced conversions, as user identifiers might be updated over time

2. **Timestamp-based Processing**:

   - All conversions include a `timestampMicros` field that represents when the conversion occurred
   - Campaign Manager 360 uses this timestamp for attribution and reporting
   - Out-of-order events could lead to incorrect attribution windows and reporting discrepancies

3. **Conversion Counting**:

   - The `ordinal` field is used to deduplicate conversions
   - Processing events out of order might affect how conversions are counted and deduplicated

4. **Floodlight Activity Tracking**:
   - Conversions are tied to specific Floodlight activities
   - Sequential processing ensures that conversion funnels and user journeys are accurately represented

**Recommendation**: Maintain event ordering, especially for `batchupdate` operations and when tracking user conversion journeys.

### Data Replay Feasibility

#### What if data is missing & need to replay?

**Feasibility**: **Possible with considerations**

1. **Historical Data Replay**:

   - ✅ Campaign Manager 360 accepts conversions with past timestamps via `timestampMicros`
   - ✅ Can replay missing data by sending `batchinsert` requests with historical timestamps
   - ⚠️ **Consideration**: Check Campaign Manager 360's attribution window limits
   - ⚠️ **Consideration**: Historical conversions might affect reporting retroactively
   - ⚠️ **Consideration**: Ensure `ordinal` values are correct to avoid duplicate counting

2. **Replay Constraints**:

   - Must provide all required fields: `floodlightConfigurationId`, `floodlightActivityId`, `ordinal`, `timestampMicros`, `quantity`
   - Must provide at least one user identifier (gclid, matchId, mobileDeviceId, etc.)
   - Event ordering should be maintained during replay

3. **Best Practices for Replay**:
   - Use `batchinsert` for missing conversions
   - Maintain original `ordinal` values to prevent duplicate counting
   - Preserve original `timestampMicros` values
   - Replay in chronological order

#### What if data is already delivered & need to replay?

**Feasibility**: **Yes, using batchupdate**

1. **Update Existing Conversions**:

   - ✅ Use `batchupdate` request type to update already-delivered conversions
   - ✅ Can add enhanced conversion data to existing conversions
   - ✅ Conversions are identified by their unique combination of: `floodlightActivityId`, `ordinal`, and user identifier

2. **Replay/Update Scenarios**:

   - Adding enhanced conversion data (user identifiers) to existing conversions
   - Correcting conversion values
   - Updating custom variables
   - Note: Cannot update `childDirectedTreatment` and `limitAdTracking` in `batchupdate`

3. **Deduplication**:

   In Campaign Manager 360, duplicates are controlled by the ordinal on a conversion. If multiple conversions share the same Floodlight activity, Floodlight configuration, user identifier (e.g., encryptedUserId/gclid/dclid/matchId/mobileDeviceId), and timestamp, then:

   - Same ordinal: CM360 deduplicates and only one conversion is kept.
   - Different ordinals: CM360 treats them as distinct, and all are kept. ​
   - Campaign Manager 360 uses `ordinal` for deduplication
   - Same `ordinal` + `floodlightActivityId` + user identifier = same conversion (will be updated, not duplicated)

### Rate Limits and Batch Sizes

#### Batch Sizes

**Implemented Batch Limits**:

- **Maximum conversions per batch**: 1000 conversions
- **Constant**: `MAX_BATCH_CONVERSATIONS_SIZE = 1000`
- **Batching Strategy**:
  - Events are grouped by request type (`batchinsert` vs `batchupdate`)
  - Each group is then chunked into batches of 1000 conversions
  - Separate API calls for each batch

#### API Rate Limits

**Default Quota Limits** (from [Campaign Manager 360 API Quotas](https://developers.google.com/doubleclick-advertisers/quotas)):

- **Queries Per Day**: 50,000 requests per project per day (can be increased)
- **Queries Per Second**: 1 QPS per project (default)
  - In Google API Console: "Queries per minute per user" = 60 (default)
  - Can be increased up to 600 (10 QPS maximum)
- **Daily Quota Refresh**: Midnight PST

**Endpoints Used**:

1. `POST /dfareporting/v4/userprofiles/{profileId}/conversions/batchinsert`

   - Batch size: Up to 1000 conversions
   - Rate limit: Subject to the quota limits above (50,000 requests/day, 1 QPS default)

2. `POST /dfareporting/v4/userprofiles/{profileId}/conversions/batchupdate`
   - Batch size: Up to 1000 conversions
   - Rate limit: Subject to the quota limits above (50,000 requests/day, 1 QPS default)
   - Additional constraint: Can only update existing conversions

**Requesting Additional Quota**:

- If you encounter `dailyLimitExceeded` error, you can request additional quota
- Navigate to Campaign Manager 360 API in Google API Console
- Review usage statistics and apply for higher quota if usage is legitimate
- Reference: [Requesting Additional Quota](https://developers.google.com/doubleclick-advertisers/quotas#additional_quota)

**Error Handling**:

- Retryable errors: All errors except `PERMISSION_DENIED`, `INVALID_ARGUMENT`, `NOT_FOUND`
- Non-retryable errors: `PERMISSION_DENIED`, `INVALID_ARGUMENT`, `NOT_FOUND`
- Implementation: `checkIfFailuresAreRetryable()` in `networkHandler.js`

### Multiplexing

**Multiplexing**: **No**

Campaign Manager 360 destination does not multiplex events. Each incoming track event results in a single conversion entry in the final batch payload.

**Flow**:

1. Input: 1 Track event
2. Processing: Validates and transforms event
3. Output: 1 Conversion object in the batch

**Note**: While multiple conversions are batched together, this is batching, not multiplexing. Each input event maps to exactly one output conversion.

## Version Information

### Current Version

**API Version**: `v4` (Campaign Manager 360 API, formerly DCM/DFA Reporting API)

**Evidence**:

- Base URL: `https://dfareporting.googleapis.com/dfareporting/v4/userprofiles`
- API endpoints use `/dfareporting/v4/` path
- Implementation uses v4-specific payload structures

### Version Deprecation

**API v4 Deprecation Timeline**:

- **Deprecation Date**: September 2, 2025
- **Sunset Date**: February 26, 2026
- Google typically provides 6+ months between deprecation and sunset for migration
- Migration to v5 is recommended before the sunset date

### Available Versions

**Yes** - Campaign Manager 360 API v5 is available

**Migration Considerations**:

- Review the v5 API documentation for breaking changes
- Test conversions API endpoints in v5 before migration
- Plan migration timeline to complete before February 26, 2026
- v5 endpoint format: `https://dfareporting.googleapis.com/dfareporting/v5/userprofiles/{profileId}/conversions/{requestType}`

## Documentation Links

### Campaign Manager 360 API Documentation

**Current Version Documentation**:

- [Campaign Manager 360 API Overview](https://developers.google.com/doubleclick-advertisers/)
- [Conversions API](https://developers.google.com/doubleclick-advertisers/guides/conversions_overview)
- [Enhanced Conversions](https://developers.google.com/doubleclick-advertisers/guides/conversions_ec)
- [OAuth 2.0 Authorization](https://developers.google.com/doubleclick-advertisers/authorizing)
- [API Quotas](https://developers.google.com/doubleclick-advertisers/quotas)

**API Reference**:

- [Conversions: batchinsert](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions/batchinsert)
- [Conversions: batchupdate](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions/batchupdate)

## RETL Functionality

For RETL (Reverse ETL) functionality, please refer to [docs/retl.md](docs/retl.md)

## Business Logic and Mappings

For detailed business logic, field mappings, and event processing flow, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## FAQ

### 1. How to handle encrypted user IDs?

If you have encrypted user IDs, set **Hash User Identifiers** to `false` in the destination configuration. This prevents RudderStack from hashing already-encrypted data.

Additionally, you must provide the encryption information:

- `encryptionEntityType`: The type of entity (e.g., `DCM_ACCOUNT`, `DCM_ADVERTISER`)
- `encryptionSource`: The source of encryption (e.g., `AD_SERVING`, `DATA_TRANSFER`)
- `encryptionEntityId`: The ID of the encryption entity

### 2. What's the difference between batchinsert and batchupdate?

- **batchinsert**: Used for inserting new conversions into Campaign Manager 360
- **batchupdate**: Used for updating existing conversions
  - Can add enhanced conversion data (user identifiers) to existing conversions
  - Cannot update `childDirectedTreatment` and `limitAdTracking` fields
  - Requires the conversion to already exist (identified by floodlightActivityId + ordinal + user identifier)

### 3. When should I use enhanced conversions?

Use enhanced conversions when:

- You want to improve conversion matching accuracy by providing user identifiers (email, phone, address)
- You're using `batchupdate` request type (required)
- You have first-party user data (email, phone, name, address)
- You want to enhance existing conversions with additional user matching signals

Enable **Enhanced Conversions** in the destination configuration and provide user identifiers in `traits` or `context.traits`.

### 4. How does deduplication work with ordinal values?

Campaign Manager 360 uses the `ordinal` field for deduplication. If multiple conversions share:

- Same Floodlight activity ID
- Same Floodlight configuration ID
- Same user identifier (gclid, matchId, etc.)
- Same timestamp

Then:

- **Same ordinal**: CM360 deduplicates and only one conversion is kept
- **Different ordinals**: CM360 treats them as distinct conversions, and all are kept

**Best Practice**: Use unique ordinal values (e.g., order ID, transaction ID) to ensure each conversion is tracked separately.

### 5. Can I send conversions for users without a gclid?

Yes! Campaign Manager 360 supports multiple user identifiers. At least one of the following must be provided:

- `gclid` (Google Click ID)
- `matchId` (Match ID)
- `dclid` (DoubleClick Click ID)
- `mobileDeviceId` (Mobile Device ID)
- `impressionId` (Impression ID)
- `encryptedUserId` (Encrypted User ID - requires encryption info)
- `encryptedUserIdCandidates` (Array of encrypted user IDs - requires encryption info)

### 6. What happens if a batchupdate fails because the conversion doesn't exist?

When a `batchupdate` request is made for a non-existent conversion:

1. **Response Structure**: The API response contains:

   - `hasFailures`: Boolean flag set to `true` if any conversions in the batch failed
   - `status[]`: Array with one `ConversionStatus` element per conversion (in the same order as the input)

2. **Error Code**: For a non-existent conversion, the status will indicate error code `NOT_FOUND`

3. **Retry Behavior**: According to Google's Enhanced Conversions documentation:

   - `NOT_FOUND` failures can and should be retried for up to 6 hours
   - This accounts for potential delays in conversion indexing/processing in Campaign Manager 360

4. **Implementation**: RudderStack's error handler treats `NOT_FOUND` as a non-retryable error for immediate failures, but the conversion might succeed if retried later (within the 6-hour window)

**Recommendation**: Ensure conversions exist in Campaign Manager 360 before attempting to update them with enhanced conversion data.
