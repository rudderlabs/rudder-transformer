# Campaign Manager 360 RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes**

The Campaign Manager 360 destination supports RETL functionality. Evidence:

- `supportedSourceTypes` includes `warehouse` in `db-config.json`
- JSON mapper is supported by default (no `disableJsonMapper: true` in config)
- Supports data flow from warehouses/databases to Campaign Manager 360
- Connection mode `warehouse: ["cloud"]` is configured

## RETL Support Analysis

### Which type of retl support does it have?

- **JSON Mapper**: ✅ Supported (default, no `disableJsonMapper: true`)
- **VDM V1**: ❌ Not supported (`supportsVisualMapper` not present in `db-config.json`)
- **VDM V2**: ❌ Not supported (no `record` in `supportedMessageTypes`)

### Does it have vdm support?

**No** - `supportsVisualMapper` is not present in `db-config.json`, indicating no VDM V1 support.

### Does it have vdm v2 support?

**No** - Missing both requirements:

- `supportedMessageTypes > record` not present in `db-config.json`
- No record event type handling in transformer code

### Connection Config

Standard Campaign Manager 360 configuration applies for RETL:

**Required Settings**:

- **OAuth 2.0 Authentication**:
  - Must be configured with Campaign Manager role
  - Requires appropriate scopes (ddmconversions, dfareporting, dfatrafficking)
- **Profile ID**: Campaign Manager profile ID for API requests

**Optional Settings**:

- **Limit Ad Tracking**: Default false
- **Child Directed Treatment**: Default false
- **Non Personalized Ad**: Default false
- **Treatment for Underage**: Default false
- **Enable Enhanced Conversions**: Default false
- **Hash User Identifiers**: Default true (requires Enhanced Conversions enabled)

## RETL Flow Implementation

### Warehouse Integration

Campaign Manager 360 supports RETL through warehouse sources with JSON mapper functionality:

- **Supported**: Yes, warehouse sources can send data to Campaign Manager 360 via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Track events only (conversions)
- **Data Flow**: Warehouse/Database → RudderStack → Campaign Manager 360 (via REST API)
- **Mapping**: JSON mapper transforms warehouse data to Campaign Manager 360 format

### Supported Message Types for RETL

```json
{
  "supportedMessageTypes": {
    "cloud": ["track"]
  }
}
```

**Only track events** are supported from warehouse sources, which are used to send conversion data to Campaign Manager 360.

### Supported Source Types

```json
{
  "supportedSourceTypes": [
    "android",
    "ios",
    "web",
    "unity",
    "amp",
    "cloud",
    "warehouse", // ← RETL support
    "reactnative",
    "flutter",
    "cordova",
    "shopify"
  ]
}
```

### RETL Event Processing

Campaign Manager 360 processes RETL events (from warehouse sources) the same way as regular cloud events:

1. **Event Type**: Only `track` events are supported
2. **Validation**: Same validation rules apply (required fields, user identifiers, etc.)
3. **Request Type**: Must specify `properties.requestType` as `batchinsert` or `batchupdate`
4. **Batching**: Events are batched with limit of 1000 conversions per batch
5. **API Delivery**: Sent to Campaign Manager 360 via conversions API

**No Special RETL Logic**: Unlike some destinations (e.g., Braze), Campaign Manager 360 does not have special handling for `context.mappedToDestination` flag. All events are processed uniformly regardless of source type.

## RETL Data Mapping

### Warehouse Table Structure

For RETL to work effectively, warehouse tables should include the following columns:

#### Required Columns

| Warehouse Column              | Event Property                         | Description                                      |
| ----------------------------- | -------------------------------------- | ------------------------------------------------ |
| `floodlight_configuration_id` | `properties.floodlightConfigurationId` | Floodlight configuration ID                      |
| `floodlight_activity_id`      | `properties.floodlightActivityId`      | Floodlight activity ID                           |
| `ordinal`                     | `properties.ordinal`                   | Unique ordinal for deduplication                 |
| `timestamp`                   | `timestamp`                            | Conversion timestamp (converted to microseconds) |
| `quantity`                    | `properties.quantity`                  | Conversion quantity                              |
| `request_type`                | `properties.requestType`               | Either `batchinsert` or `batchupdate`            |
| `profile_id`                  | `properties.profileId` (optional)      | Override destination config profile ID           |

#### User Identifier Columns (At least one required)

| Warehouse Column               | Event Property                         | Description                           |
| ------------------------------ | -------------------------------------- | ------------------------------------- |
| `gclid`                        | `properties.gclid`                     | Google Click ID                       |
| `match_id`                     | `properties.matchId`                   | Match ID                              |
| `dclid`                        | `properties.dclid`                     | DoubleClick Click ID                  |
| `mobile_device_id`             | `properties.mobileDeviceId`            | Mobile device ID                      |
| `impression_id`                | `properties.impressionId`              | Impression ID                         |
| `encrypted_user_id`            | `properties.encryptedUserId`           | Encrypted user ID                     |
| `encrypted_user_id_candidates` | `properties.encryptedUserIdCandidates` | Array of encrypted user ID candidates |

#### Optional Columns

| Warehouse Column           | Event Property                      | Description                  |
| -------------------------- | ----------------------------------- | ---------------------------- |
| `value`                    | `properties.value`                  | Conversion value             |
| `revenue`                  | `properties.revenue`                | Alternative to value         |
| `total`                    | `properties.total`                  | Alternative to value         |
| `custom_variables`         | `properties.customVariables`        | Custom variables array       |
| `limit_ad_tracking`        | `properties.limitAdTracking`        | Override destination setting |
| `child_directed_treatment` | `properties.childDirectedTreatment` | Override destination setting |
| `non_personalized_ad`      | `properties.nonPersonalizedAd`      | Override destination setting |
| `treatment_for_underage`   | `properties.treatmentForUnderage`   | Override destination setting |

#### Enhanced Conversion Columns (When enabled)

| Warehouse Column | Event Property                                       | Description                     |
| ---------------- | ---------------------------------------------------- | ------------------------------- |
| `email`          | `traits.email` or `context.traits.email`             | User email (will be hashed)     |
| `phone`          | `traits.phone` or `context.traits.phone`             | User phone (will be hashed)     |
| `first_name`     | `traits.firstName` or `context.traits.firstName`     | First name (will be hashed)     |
| `last_name`      | `traits.lastName` or `context.traits.lastName`       | Last name (will be hashed)      |
| `street`         | `traits.street` or `context.traits.address.street`   | Street address (will be hashed) |
| `city`           | `traits.city` or `context.traits.address.city`       | City (plain text)               |
| `state`          | `traits.state` or `context.traits.address.state`     | State (plain text)              |
| `country`        | `traits.country` or `context.traits.address.country` | Country code (plain text)       |
| `zip`            | `traits.zip` or `context.traits.address.zip`         | Postal code (will be hashed)    |

#### Encryption Info Columns (If using encrypted user IDs)

| Warehouse Column         | Event Property                    | Description                                            |
| ------------------------ | --------------------------------- | ------------------------------------------------------ |
| `encryption_entity_type` | `properties.encryptionEntityType` | One of: DCM_ACCOUNT, DCM_ADVERTISER, DBM_PARTNER, etc. |
| `encryption_source`      | `properties.encryptionSource`     | One of: AD_SERVING, DATA_TRANSFER                      |
| `encryption_entity_id`   | `properties.encryptionEntityId`   | Encryption entity ID                                   |

### Example Warehouse Query for RETL

```sql
SELECT
  -- Required fields
  floodlight_configuration_id,
  floodlight_activity_id,
  ordinal,
  conversion_timestamp as timestamp,
  quantity,
  'batchinsert' as request_type,

  -- User identifier (at least one)
  gclid,

  -- Optional fields
  revenue as value,

  -- Enhanced conversion fields (if enabled)
  email,
  phone,
  first_name,
  last_name,
  city,
  state,
  country,
  postal_code as zip,

  -- Tracking fields
  user_id,
  anonymous_id

FROM conversions_warehouse_table
WHERE conversion_date >= CURRENT_DATE - INTERVAL '7 days'
  AND gclid IS NOT NULL
```

## RETL Processing Flow

### 1. Data Extraction from Warehouse

```
Warehouse Table
    ↓
RudderStack Sync
    ↓
JSON Mapper applies mappings
    ↓
Track Event Generated
```

### 2. Event Validation

- Validates message type is `track`
- Validates `properties.requestType` is `batchinsert` or `batchupdate`
- Validates required fields present
- Validates at least one user identifier present
- Validates encryption info if using encrypted user IDs

### 3. Event Transformation

```javascript
// Track Config mapping applied
{
  floodlightConfigurationId: properties.floodlightConfigurationId,
  ordinal: properties.ordinal,
  timestampMicros: convertToMicroseconds(timestamp),
  floodlightActivityId: properties.floodlightActivityId,
  quantity: properties.quantity,
  value: properties.value || properties.total || properties.revenue,
  gclid: properties.gclid,
  // ... other mappings
}
```

### 4. Enhanced Conversions (if enabled)

For `batchupdate` requests with `enableEnhancedConversions: true`:

```javascript
// Enhanced Conversion Config mapping applied
{
  userIdentifiers: [
    { hashedEmail: sha256(normalizeEmail(traits.email)) },
    { hashedPhoneNumber: sha256(normalizePhone(traits.phone, countryCode)) },
    {
      addressInfo: {
        hashedFirstName: sha256(traits.firstName.toLowerCase().trim()),
        hashedLastName: sha256(traits.lastName.toLowerCase().trim()),
        hashedStreetAddress: sha256(traits.street.toLowerCase().trim()),
        city: traits.city,
        state: traits.state,
        countryCode: traits.country,
        postalCode: sha256(traits.zip),
      },
    },
  ];
}
```

### 5. Batching

- Events grouped by `requestType` (batchinsert vs batchupdate)
- Each group chunked into batches of 1000 conversions
- Separate API request for each batch

### 6. API Delivery

```
POST https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/{profileId}/conversions/{requestType}

Authorization: Bearer {access_token}
Content-Type: application/json

{
  "kind": "dfareporting#conversionsBatchInsertRequest",
  "conversions": [ /* up to 1000 conversions */ ],
  "encryptionInfo": { /* if applicable */ }
}
```

## Rate Limits and Constraints

### Campaign Manager 360 API Limits

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

### RETL Processing Constraints

- **Message Types**: Only `track` events supported
- **Cloud Mode Only**: Device mode not applicable for warehouse sources
- **JSON Mapper Only**: No VDM v1 or v2 support
- **No mappedToDestination Handling**: Events processed uniformly regardless of source

## Common RETL Use Cases

### Use Case 1: Historical Conversion Upload

**Scenario**: Upload historical conversions from data warehouse to Campaign Manager 360

**Warehouse Query**:

```sql
SELECT
  floodlight_configuration_id,
  floodlight_activity_id,
  conversion_ordinal as ordinal,
  conversion_timestamp,
  1 as quantity,
  conversion_value as value,
  google_click_id as gclid,
  'batchinsert' as request_type
FROM historical_conversions
WHERE conversion_date BETWEEN '2024-01-01' AND '2024-12-31'
  AND google_click_id IS NOT NULL
```

**Considerations**:

- Use `batchinsert` request type
- Ensure `ordinal` values are unique per conversion
- Maintain chronological order for accurate reporting
- Verify conversions are within attribution window

### Use Case 2: Enhanced Conversion Enrichment

**Scenario**: Add user identifiers to existing conversions for better matching

**Warehouse Query**:

```sql
SELECT
  c.floodlight_configuration_id,
  c.floodlight_activity_id,
  c.ordinal,
  c.conversion_timestamp,
  c.quantity,
  c.gclid,
  'batchupdate' as request_type,

  -- Enhanced conversion data
  u.email,
  u.phone,
  u.first_name,
  u.last_name,
  u.city,
  u.state,
  u.country

FROM conversions c
JOIN users u ON c.user_id = u.id
WHERE c.conversion_date >= CURRENT_DATE - INTERVAL '30 days'
  AND u.email IS NOT NULL
```

**Configuration**:

- Set `enableEnhancedConversions: true`
- Set `isHashingRequired: true` (RudderStack will hash PII)
- Use `batchupdate` request type

**Considerations**:

- Only works with `batchupdate`
- Conversions must already exist in Campaign Manager 360
- User identifiers will be hashed automatically
- Phone numbers normalized to E.164 format

### Use Case 3: Offline Conversion Tracking

**Scenario**: Send offline conversion data (e.g., in-store purchases) to Campaign Manager 360

**Warehouse Query**:

```sql
SELECT
  '12345' as floodlight_configuration_id,
  '67890' as floodlight_activity_id,
  CONCAT(order_id, '_', transaction_timestamp) as ordinal,
  transaction_timestamp as timestamp,
  1 as quantity,
  order_total as value,
  customer_match_id as match_id,
  'batchinsert' as request_type
FROM offline_sales
WHERE sale_date = CURRENT_DATE - INTERVAL '1 day'
  AND customer_match_id IS NOT NULL
```

**Considerations**:

- Use `matchId` if gclid not available
- Ensure ordinal is unique for each conversion
- Include conversion value for ROI tracking

## Troubleshooting RETL

### Issue: "Properties must be present in event"

**Cause**: Track event doesn't have properties object

**Solution**: Ensure warehouse mapping includes properties fields:

```json
{
  "type": "track",
  "properties": {
    "floodlightConfigurationId": "...",
    "requestType": "batchinsert"
    // ... other properties
  }
}
```

### Issue: "At least one of gclid, matchId, ... must be present"

**Cause**: No user identifier provided

**Solution**: Ensure at least one user identifier column is mapped:

- `gclid`
- `matchId`
- `dclid`
- `mobileDeviceId`
- `impressionId`
- `encryptedUserId` (with encryption info)

### Issue: "encryptionInfo is required if encryptedUserId is used"

**Cause**: Using encrypted user IDs without providing encryption info

**Solution**: Provide all three encryption fields:

```json
{
  "properties": {
    "encryptedUserId": "...",
    "encryptionEntityType": "DCM_ACCOUNT",
    "encryptionSource": "AD_SERVING",
    "encryptionEntityId": "123456"
  }
}
```

### Issue: Enhanced conversions not working

**Cause**: Multiple possible causes

**Solution Checklist**:

1. ✅ `enableEnhancedConversions: true` in destination config
2. ✅ `requestType: 'batchupdate'` in event
3. ✅ User identifier fields (email, phone, etc.) present in traits
4. ✅ Conversion already exists in Campaign Manager 360

## Summary

The Campaign Manager 360 destination supports RETL functionality with the following characteristics:

- **RETL Support**: ✅ Yes, via warehouse source type support
- **JSON Mapper**: ✅ Supported for data transformation
- **VDM v1**: ❌ Not supported
- **VDM v2**: ❌ Not supported (no record message type)
- **Supported Events**: Track events only (conversions)
- **API Integration**: Campaign Manager 360 Conversions API (v4)
- **Batching**: Up to 1000 conversions per batch
- **Enhanced Conversions**: ✅ Supported for batchupdate requests

**Key Features**:

- Historical conversion uploads via `batchinsert`
- Enhanced conversion enrichment via `batchupdate`
- Automatic PII hashing for user identifiers
- Flexible user identifier support (gclid, matchId, mobileDeviceId, etc.)
- Encrypted user ID support

**Limitations**:

- Only track events supported (no identify, page, etc.)
- No VDM v1 or v2 support
- No special `mappedToDestination` handling
- Enhanced conversions only work with `batchupdate`
