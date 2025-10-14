# Campaign Manager (DCM) Destination

## Overview

The Campaign Manager destination integration allows you to send conversion tracking data from RudderStack to Google Campaign Manager 360 (formerly DoubleClick Campaign Manager - DCM). This enables you to track and measure conversions from your advertising campaigns.

Campaign Manager 360 is Google's comprehensive ad management and serving platform for advertisers and agencies. It helps you manage your digital campaigns across websites and mobile platforms.

## Features

- ✅ **Batch Conversion Import**: Insert up to 1000 conversions per API request
- ✅ **Conversion Updates**: Update existing conversions with additional data
- ✅ **Enhanced Conversions**: Improve attribution with hashed first-party customer data
- ✅ **Encrypted User IDs**: Support for privacy-safe user identification
- ✅ **Custom Variables**: Pass custom Floodlight variables with conversions
- ✅ **Privacy Compliance**: Support for COPPA, Limited Ad Tracking, and other privacy flags
- ✅ **Multiple User Identifiers**: Support for gclid, dclid, matchId, mobileDeviceId, and more
- ✅ **Automatic Hashing**: Automatically hash PII data for enhanced conversions
- ✅ **RETL Support**: Direct warehouse-to-Campaign Manager conversion syncs
- ✅ **Granular Error Handling**: Individual success/failure status for each event in a batch

## Supported Event Types

| Event Type | Supported | Notes |
|------------|-----------|-------|
| Track | ✅ Yes | Required for all conversion tracking |
| Identify | ❌ No | Not supported |
| Page | ❌ No | Not supported |
| Screen | ❌ No | Not supported |
| Group | ❌ No | Not supported |
| Alias | ❌ No | Not supported |

## Quick Start

### 1. Configure Campaign Manager Destination

In your RudderStack dashboard:

1. Add Campaign Manager as a destination
2. Configure the following required settings:
   - **Profile ID**: Your Campaign Manager profile ID
   - **OAuth Credentials**: Set up OAuth 2.0 authentication

Optional settings:
   - **Enable Enhanced Conversions**: Enable to send hashed first-party data
   - **Hash PII Data**: Automatically hash email, phone, and address data
   - **Privacy Flags**: Set default values for privacy compliance

### 2. Send a Conversion Event

**Basic Conversion (batchinsert)**:
```javascript
rudderanalytics.track("Order Completed", {
  requestType: "batchinsert",
  floodlightConfigurationId: "12345678",
  floodlightActivityId: "87654321",
  ordinal: "order-2023-10-15-123456",
  quantity: 1,
  value: 99.99,
  gclid: "TeSter-123"
});
```

**Enhanced Conversion (batchupdate)**:
```javascript
rudderanalytics.track("Order Completed", {
  requestType: "batchupdate",
  floodlightConfigurationId: "12345678",
  floodlightActivityId: "87654321",
  ordinal: "order-2023-10-15-123456",
  quantity: 1,
  value: 99.99,
  gclid: "TeSter-123",
  email: "customer@example.com",
  phone: "+1-555-123-4567",
  firstName: "John",
  lastName: "Doe"
});
```

## API Endpoints

This integration uses the Campaign Manager 360 API v4:

- **Base URL**: `https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/{profileId}/conversions/{requestType}`
- **batchinsert**: Insert new conversions
- **batchupdate**: Update existing conversions with additional data

API Documentation: [Google Campaign Manager 360 Conversions API](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions)

## Required Fields

Every conversion event must include:

- `properties.requestType`: Either "batchinsert" or "batchupdate"
- `properties.floodlightConfigurationId`: Your Floodlight configuration ID
- `properties.floodlightActivityId`: The Floodlight activity ID for this conversion
- `properties.ordinal`: Unique identifier for deduplication
- `properties.quantity`: Conversion quantity (usually 1)
- **At least one user identifier**: gclid, dclid, matchId, mobileDeviceId, impressionId, encryptedUserId, or encryptedUserIdCandidates

## Request Types

### batchinsert

Use `batchinsert` to insert new conversions into Campaign Manager:

- ✅ Supports all privacy flags
- ✅ Can include custom variables
- ✅ Requires unique ordinal per conversion
- ✅ Supports encrypted user IDs

### batchupdate

Use `batchupdate` to update existing conversions (e.g., adding enhanced conversion data):

- ✅ Can add user identifiers to improve attribution
- ✅ Supports enhanced conversions with hashed PII
- ❌ Cannot update `childDirectedTreatment` or `limitAdTracking` flags
- ✅ Must match original conversion by ordinal and identifiers

## Enhanced Conversions

Enhanced conversions allow you to send first-party customer data to improve conversion measurement:

**Configuration**:
- Set `enableEnhancedConversions: true` in destination config
- Set `isHashingRequired: true` to automatically hash PII (recommended)

**Supported Fields**:
- Email address (hashed)
- Phone number (normalized to E.164, then hashed)
- First name (hashed)
- Last name (hashed)
- Street address (hashed)
- City (unhashed)
- State (unhashed)
- Postal code (unhashed)
- Country code (unhashed)

**Note**: Enhanced conversions are only supported with `batchupdate` requests.

## User Identifiers

At least one of the following identifiers is required:

| Identifier | Source | Description |
|------------|--------|-------------|
| `gclid` | Google Ads | Google Click ID from Google Ads |
| `dclid` | Display & Video 360 | DoubleClick Click ID |
| `matchId` | Floodlight Tag | Match ID from Floodlight tag |
| `mobileDeviceId` | Device | Mobile advertising ID (IDFA/AAID) |
| `impressionId` | Campaign Manager | Campaign Manager impression ID |
| `encryptedUserId` | Custom | Encrypted user identifier |
| `encryptedUserIdCandidates` | Custom | Array of encrypted user IDs |

## Privacy and Compliance

### Privacy Flags

Set these flags based on your privacy requirements:

```javascript
{
  limitAdTracking: false,           // Limit Ad Tracking (batchinsert only)
  childDirectedTreatment: false,    // COPPA compliance (batchinsert only)
  treatmentForUnderage: false,      // Treatment for underage users
  nonPersonalizedAd: false          // Non-personalized ad serving
}
```

**Note**: `limitAdTracking` and `childDirectedTreatment` can only be set during `batchinsert` and cannot be updated later.

## Custom Variables

Pass custom data with conversions using Floodlight custom variables:

```javascript
{
  customVariables: [
    {
      kind: "dfareporting#customFloodlightVariable",
      type: "U1",
      value: "product_category"
    },
    {
      kind: "dfareporting#customFloodlightVariable",
      type: "U2",
      value: "campaign_code"
    }
  ]
}
```

Variable types: `U1` to `U100` (user variables), `NUM1` to `NUM100` (numeric variables)

## Batching

The integration automatically batches conversions for optimal performance:

- **Batch Size**: Up to 1000 conversions per request
- **Grouping**: `batchinsert` and `batchupdate` requests are batched separately
- **Automatic**: No configuration required

## Error Handling

The integration provides **granular error handling** with individual status for each conversion in a batch:

### Per-Event Status Reporting (V1 Router)

When you send a batch of conversions, Campaign Manager returns individual status for each event:

```
Batch: [Event 1, Event 2, ..., Event 1000]
         ✅        ❌              ✅
      Success   Aborted         Success
```

**Benefits**:
- **Partial Success**: Successful conversions are acknowledged even if others fail
- **Detailed Errors**: Each failed event includes specific error messages
- **Cost Savings**: Avoid re-sending successful conversions

### Error Types

**Retryable Errors** (automatically retried):
- `INTERNAL` - Internal server errors
- `UNAVAILABLE` - Service temporarily unavailable
- Other transient failures

**Non-Retryable Errors** (aborted with details):
- `PERMISSION_DENIED`: Check OAuth credentials and Campaign Manager permissions
- `INVALID_ARGUMENT`: Verify floodlight IDs, ordinal format, and required fields
- `NOT_FOUND`: Verify Floodlight configuration and activity IDs exist

**Example**:
If you send 100 conversions and 2 fail with `INVALID_ARGUMENT`, you'll receive:
- 98 events marked as successful (200)
- 2 events marked as failed (400) with specific error messages
- Only the 2 failed events need investigation/correction

## Detailed Documentation

For comprehensive information, see the detailed documentation:

- **[Business Logic and Mappings](./docs/businesslogic.md)**: Detailed field mappings, API endpoints, transformations, and use cases
- **[RETL Functionality](./docs/retl.md)**: Information about Reverse ETL support and alternatives

## Common Use Cases

### 1. E-commerce Conversion Tracking

Track online purchases with value:

```javascript
rudderanalytics.track("Order Completed", {
  requestType: "batchinsert",
  floodlightConfigurationId: "12345678",
  floodlightActivityId: "87654321",
  ordinal: `order-${orderId}`,
  quantity: 1,
  value: orderTotal,
  gclid: gclid  // from URL parameter
});
```

### 2. Lead Generation Tracking

Track form submissions and leads:

```javascript
rudderanalytics.track("Form Submitted", {
  requestType: "batchinsert",
  floodlightConfigurationId: "12345678",
  floodlightActivityId: "11111111",
  ordinal: `lead-${Date.now()}-${userId}`,
  quantity: 1,
  gclid: gclid
});
```

### 3. Enhanced Conversion with Customer Data

Improve attribution with first-party data:

```javascript
// Step 1: Initial conversion (real-time)
rudderanalytics.track("Order Completed", {
  requestType: "batchinsert",
  ordinal: `order-${orderId}`,
  // ... other required fields
  gclid: gclid
});

// Step 2: Enhance with customer data (batch process)
rudderanalytics.track("Order Completed", {
  requestType: "batchupdate",
  ordinal: `order-${orderId}`,  // Same ordinal
  // ... other required fields
  gclid: gclid,                 // Same identifier
  email: customer.email,
  phone: customer.phone,
  firstName: customer.firstName,
  lastName: customer.lastName
});
```

### 4. Offline Conversion Import

Import offline conversions with match IDs:

```javascript
rudderanalytics.track("In-Store Purchase", {
  requestType: "batchinsert",
  floodlightConfigurationId: "12345678",
  floodlightActivityId: "87654321",
  ordinal: `store-${transactionId}`,
  quantity: 1,
  value: purchaseAmount,
  matchId: customerMatchId,  // from CRM
  timestamp: purchaseDate
});
```

### 5. RETL - Warehouse to Campaign Manager

Import conversions directly from your warehouse (Snowflake, BigQuery, Redshift, etc.):

**Setup**:
1. Configure a warehouse source in RudderStack
2. Connect Campaign Manager as a destination
3. Set up sync schedule and select warehouse table/view

**Warehouse Table Structure**:
```sql
CREATE TABLE campaign_manager_conversions (
  event_name VARCHAR(255),
  user_id VARCHAR(255),
  timestamp TIMESTAMP,
  request_type VARCHAR(50),  -- 'batchinsert' or 'batchupdate'
  floodlight_configuration_id VARCHAR(255),
  floodlight_activity_id VARCHAR(255),
  ordinal VARCHAR(255),
  quantity INTEGER,
  value DECIMAL(10,2),
  gclid VARCHAR(255),
  email VARCHAR(255),  -- For enhanced conversions
  phone VARCHAR(255)
);
```

RudderStack automatically:
- Syncs data on schedule
- Transforms warehouse rows to track events
- Batches up to 1000 conversions per request
- Handles retries and error recovery

**Use Cases**:
- Offline conversion imports from CRM/POS
- Enhanced conversions with warehouse customer data
- Aggregated conversion reporting
- Multi-source conversion sync

See [RETL Documentation](./docs/retl.md) for detailed setup guide.

## Best Practices

1. **Use Unique Ordinals**: Always use unique ordinals per conversion to prevent duplicate counting
   - Format: `{type}-{timestamp}-{uniqueId}` (e.g., `order-20231015-123456`)

2. **Include Multiple Identifiers**: When possible, include multiple user identifiers for better match rates
   - Primary: gclid or dclid
   - Secondary: matchId or mobileDeviceId

3. **Enable Enhanced Conversions**: For better attribution, enable enhanced conversions and send customer data

4. **Set Privacy Flags Correctly**: Always set privacy flags appropriately based on user consent and regulations

5. **Monitor Import Status**: Check Campaign Manager regularly for conversion import failures

6. **Use Timestamp Wisely**: Send the actual conversion timestamp, not the import time

7. **Test Thoroughly**: Use Campaign Manager's test mode to verify conversions before production

8. **Handle Errors Gracefully**: Implement retry logic for transient failures

## Limitations

- Only supports `track` events (no identify, page, or screen events)
- Enhanced conversions only work with `batchupdate` requests
- `childDirectedTreatment` and `limitAdTracking` cannot be updated after initial insert
- Maximum batch size is 1000 conversions per request
- Requires OAuth 2.0 authentication
- No VDM (Visual Data Mapper) v1 or v2 support
- RETL uses standard track event transformation (not `record` message type)

## Authentication

This integration uses OAuth 2.0 for authentication:

1. Create OAuth 2.0 credentials in Google Cloud Console
2. Grant access to Campaign Manager 360 API
3. Configure credentials in RudderStack destination settings
4. RudderStack handles token refresh automatically

Required OAuth Scopes:
- `https://www.googleapis.com/auth/ddmconversions`
- `https://www.googleapis.com/auth/dfareporting`
- `https://www.googleapis.com/auth/dfatrafficking`

## Support and Resources

- **RudderStack Documentation**: [Campaign Manager Destination](https://www.rudderstack.com/docs/destinations/advertising/campaign-manager/)
- **Google API Documentation**: [Campaign Manager 360 API](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions)
- **Enhanced Conversions Guide**: [Google Enhanced Conversions](https://developers.google.com/doubleclick-advertisers/guides/conversions_ec)

## Example Payloads

See the [Business Logic documentation](./docs/businesslogic.md) for detailed examples of:
- Basic conversions
- Enhanced conversions with hashed data
- Encrypted user ID conversions
- Custom variable usage
- Batch conversion imports

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "PERMISSION_DENIED" error | Verify OAuth credentials and API permissions |
| "INVALID_ARGUMENT" error | Check all required fields are present and valid |
| "NOT_FOUND" error | Verify Floodlight configuration and activity IDs |
| Missing conversions | Check ordinal uniqueness and user identifiers |
| Enhanced conversions not working | Ensure `requestType: "batchupdate"` and `enableEnhancedConversions: true` |
| Duplicate conversions | Use unique ordinals for each conversion |

## Version History

- **v4**: [Current version using Campaign Manager 360 API v4](https://developers.google.com/doubleclick-advertisers/rest/v4)
- Supports enhanced conversions with automatic hashing
- [Batch processing up to 1000 conversions per request](https://developers.google.com/doubleclick-advertisers/guides/conversions_faq)

