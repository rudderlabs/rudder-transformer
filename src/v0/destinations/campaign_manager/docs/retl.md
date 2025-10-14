# Campaign Manager RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes - Supported**

The Campaign Manager destination supports RETL functionality for warehouse sources. Evidence from `db-config.json`:
- ✅ `supportedSourceTypes` includes `warehouse`
- ✅ `supportedConnectionModes` includes `warehouse: ["cloud"]`
- ✅ Warehouse configuration section is present
- ✅ Supports batch conversion imports from warehouse data

## RETL Support Analysis

### Which type of RETL support does it have?
- **JSON Mapper**: Supported via standard track event transformation
- **VDM V1**: Not explicitly configured (`supportsVisualMapper` not set)
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`)

**Type**: **Standard RETL with Track Events**

Campaign Manager uses standard track event processing for RETL. Warehouse data is transformed into track events with conversion data, which are then sent to Campaign Manager's batchinsert or batchupdate APIs.

### Does it have VDM support?
**No** - No visual data mapper (VDM V1) is explicitly configured for this destination.

### Does it have VDM v2 support?
**No** - Missing both:
- `supportedMessageTypes > record` in configuration
- Record event type handling in transformer code

### Connection config
**Supported**: `warehouse` source with `cloud` connection mode

The warehouse source type is configured to use cloud mode, meaning:
- Warehouse data is synced to RudderStack
- Data is transformed into track events
- Events are sent via cloud mode to Campaign Manager API
- Batching is handled automatically (up to 1000 conversions per batch)

## How RETL Works with Campaign Manager

Since Campaign Manager supports warehouse sources, you can sync conversion data directly from your warehouse to Campaign Manager. Here's how to implement RETL for conversion tracking:

### 1. Configure Warehouse Source

Set up a warehouse source in RudderStack:

1. **Create Warehouse Source**: In RudderStack dashboard, add your warehouse (Snowflake, BigQuery, Redshift, etc.) as a source
2. **Connect to Campaign Manager**: Add Campaign Manager as a destination for the warehouse source
3. **Configure Sync Settings**: Set up the sync schedule and table/view to sync from

### 2. Prepare Warehouse Data

Structure your warehouse table/view with the required conversion fields:

```sql
-- Example warehouse table for conversions
CREATE TABLE conversions_to_sync (
  id VARCHAR(255),
  event_name VARCHAR(255),
  user_id VARCHAR(255),
  timestamp TIMESTAMP,
  request_type VARCHAR(50),
  floodlight_configuration_id VARCHAR(255),
  floodlight_activity_id VARCHAR(255),
  ordinal VARCHAR(255),
  quantity INTEGER,
  value DECIMAL(10,2),
  gclid VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);
```

### 3. Map Warehouse Columns to RudderStack Event

The warehouse columns are mapped to track event properties:

```javascript
// Warehouse row is automatically transformed to:
{
  "type": "track",
  "event": "Order Completed",  // from event_name column
  "userId": "user123",          // from user_id column
  "timestamp": "2023-10-15T12:00:00Z",  // from timestamp column
  "properties": {
    "requestType": "batchinsert",  // from request_type column
    "floodlightConfigurationId": "12345678",  // from floodlight_configuration_id
    "floodlightActivityId": "87654321",  // from floodlight_activity_id
    "ordinal": "order-20231015-123456",  // from ordinal column
    "quantity": 1,  // from quantity column
    "value": 99.99,  // from value column
    "gclid": "TeSter-123",  // from gclid column
    "email": "customer@example.com",  // from email column (for enhanced conversions)
    "phone": "+1-555-123-4567",  // from phone column
    "firstName": "John",  // from first_name column
    "lastName": "Doe"  // from last_name column
  }
}
```

### 4. Configure Column Mappings

In RudderStack's warehouse source configuration, map your warehouse columns to the expected event structure:

| Warehouse Column | RudderStack Field | Campaign Manager Field |
|------------------|-------------------|------------------------|
| `event_name` | `event` | - |
| `user_id` | `userId` | - |
| `timestamp` | `timestamp` | `timestampMicros` |
| `request_type` | `properties.requestType` | - |
| `floodlight_configuration_id` | `properties.floodlightConfigurationId` | `floodlightConfigurationId` |
| `floodlight_activity_id` | `properties.floodlightActivityId` | `floodlightActivityId` |
| `ordinal` | `properties.ordinal` | `ordinal` |
| `quantity` | `properties.quantity` | `quantity` |
| `value` | `properties.value` | `value` |
| `gclid` | `properties.gclid` | `gclid` |
| `email` | `properties.email` | `userIdentifiers.hashedEmail` |
| `phone` | `properties.phone` | `userIdentifiers.hashedPhoneNumber` |

### 5. Automatic Batching and Sync

Once configured, RudderStack handles:
- ✅ **Automatic Syncing**: Regularly syncs data from warehouse based on schedule
- ✅ **Event Transformation**: Converts warehouse rows to track events
- ✅ **Batching**: Groups up to 1000 conversions per API request
- ✅ **Error Handling**: Retries failed conversions automatically
- ✅ **Deduplication**: Uses ordinal for deduplication on Campaign Manager side

**Data Flow**:
```
Warehouse → RudderStack Warehouse Source → Track Events → Campaign Manager API
```

## RETL Use Cases

### Use Case 1: Offline Conversion Import

Import offline conversions (in-store purchases, phone orders) from your warehouse:

**Warehouse Query**:
```sql
SELECT
  'In-Store Purchase' as event_name,
  customer_id as user_id,
  purchase_date as timestamp,
  'batchinsert' as request_type,
  '12345678' as floodlight_configuration_id,
  '87654321' as floodlight_activity_id,
  CONCAT('store-', transaction_id) as ordinal,
  1 as quantity,
  total_amount as value,
  crm_match_id as match_id
FROM offline_purchases
WHERE synced_to_campaign_manager = false
```

### Use Case 2: Enhanced Conversions from CRM Data

Enhance existing online conversions with customer data from your CRM/warehouse:

**Warehouse Query**:
```sql
SELECT
  'Order Completed' as event_name,
  customer_id as user_id,
  conversion_date as timestamp,
  'batchupdate' as request_type,
  '12345678' as floodlight_configuration_id,
  '87654321' as floodlight_activity_id,
  order_id as ordinal,
  1 as quantity,
  order_total as value,
  click_id as gclid,
  email,
  phone,
  first_name,
  last_name,
  city,
  state,
  zip_code as zip,
  country_code as country
FROM crm_conversions
WHERE enhanced_conversion_sent = false
```

### Use Case 3: Aggregated Conversion Reporting

Send aggregated conversion data from warehouse analytics:

**Warehouse Query**:
```sql
SELECT
  event_type as event_name,
  user_id,
  event_timestamp as timestamp,
  'batchinsert' as request_type,
  floodlight_config_id as floodlight_configuration_id,
  floodlight_activity_id,
  CONCAT(event_type, '-', DATE(event_timestamp), '-', user_id) as ordinal,
  conversion_count as quantity,
  total_revenue as value,
  google_click_id as gclid
FROM warehouse_conversions_aggregated
WHERE date >= CURRENT_DATE - 7
```

## Technical Details

### RETL Implementation

Campaign Manager RETL support uses standard track event processing:

1. **Warehouse Source**: Configured as a supported source type
2. **Connection Mode**: Cloud mode (server-side processing)
3. **Message Type**: Standard `track` events (not `record` type)
4. **Transformation**: Uses existing track event transformation logic
5. **Batching**: Automatic batching up to 1000 conversions per request

### Capabilities with RETL

- ✅ **Track Events**: Supports track message type for conversions
- ✅ **Two Request Types**: `batchinsert` for new conversions, `batchupdate` for updating existing ones
- ✅ **Automatic Batching**: Up to 1000 conversions per batch
- ✅ **Enhanced Conversions**: Support for first-party customer data with automatic hashing
- ✅ **Scheduled Syncs**: Regular warehouse-to-Campaign Manager syncs
- ✅ **Multiple User Identifiers**: Support for gclid, dclid, matchId, mobileDeviceId, etc.
- ✅ **Custom Variables**: Pass custom Floodlight variables from warehouse data
- ✅ **Privacy Flags**: Configure privacy compliance flags from warehouse data

### Limitations

- ❌ **No VDM v1 Support**: No visual data mapper interface
- ❌ **No VDM v2 Support**: No `record` message type support
- ❌ **Track Events Only**: Only conversion tracking, no profile/audience updates
- ⚠️ **Schema Requirements**: Warehouse data must include all required conversion fields

## Recommended Integration Patterns

### Pattern 1: Real-Time Conversion Tracking

**Use Case**: Track conversions as they happen on your website or app

```
User Action → RudderStack SDK → Campaign Manager
```

**Implementation**:
- Install RudderStack SDK on your website/app
- Configure Campaign Manager destination in RudderStack
- Send track events for conversion actions

### Pattern 2: Batch Conversion Import

**Use Case**: Import conversions from external systems or offline sources

```
External System → Batch Job → RudderStack HTTP API → Campaign Manager
```

**Implementation**:
- Create scheduled batch job to extract conversions
- Transform to RudderStack track events
- Send via RudderStack HTTP API
- Monitor for failures and retry

### Pattern 3: Enhanced Conversion Pipeline

**Use Case**: Enhance online conversions with offline customer data

```
Online Conversion → Campaign Manager (initial)
Warehouse Data → Batch Job → RudderStack → Campaign Manager (update)
```

**Implementation**:
1. Track initial conversions in real-time with gclid/dclid
2. Join with warehouse customer data (email, phone, address)
3. Send batchupdate events with enhanced data
4. Campaign Manager improves attribution with first-party data

### Pattern 4: Multi-Source Conversion Aggregation

**Use Case**: Aggregate conversions from multiple sources

```
Website → RudderStack → Campaign Manager
Mobile App → RudderStack → Campaign Manager
CRM System → Batch Job → RudderStack → Campaign Manager
```

**Implementation**:
- Configure RudderStack SDKs on all digital properties
- Create batch jobs for offline/CRM conversions
- Use consistent ordinal format across sources
- Campaign Manager deduplicates based on ordinals

## Summary

The Campaign Manager destination **supports RETL functionality** for warehouse sources. Key points:

- ✅ **RETL Supported**: Warehouse source type is supported
- ✅ **Warehouse Sync**: Direct sync from warehouse to Campaign Manager
- ✅ **Track Events**: Uses standard track event transformation
- ✅ **Automatic Batching**: Up to 1000 conversions per batch
- ✅ **Enhanced Conversions**: Supports first-party data with automatic hashing
- ❌ **No VDM v1**: No visual data mapper configuration
- ❌ **No VDM v2**: No `record` message type support

**Configuration**: Warehouse source → Cloud connection mode → Campaign Manager destination

**Best For**:
- Offline conversion imports from CRM/POS systems
- Enhanced conversions with warehouse customer data
- Scheduled batch conversion syncs
- Aggregated conversion reporting
- Multi-source conversion aggregation

## Warehouse Table Schema Best Practices

### Required Columns

Every warehouse table for Campaign Manager RETL should include:

```sql
CREATE TABLE campaign_manager_conversions (
  -- Event metadata
  event_name VARCHAR(255) NOT NULL,
  user_id VARCHAR(255),
  timestamp TIMESTAMP NOT NULL,
  
  -- Campaign Manager required fields
  request_type VARCHAR(50) NOT NULL,  -- 'batchinsert' or 'batchupdate'
  floodlight_configuration_id VARCHAR(255) NOT NULL,
  floodlight_activity_id VARCHAR(255) NOT NULL,
  ordinal VARCHAR(255) NOT NULL,  -- Must be unique
  quantity INTEGER NOT NULL,
  
  -- Conversion value (optional but recommended)
  value DECIMAL(10,2),
  
  -- User identifiers (at least one required)
  gclid VARCHAR(255),
  dclid VARCHAR(255),
  match_id VARCHAR(255),
  mobile_device_id VARCHAR(255),
  impression_id VARCHAR(255),
  
  -- Enhanced conversion fields (optional)
  email VARCHAR(255),
  phone VARCHAR(50),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  street VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  zip VARCHAR(20),
  country VARCHAR(10),
  
  -- Privacy flags (optional)
  limit_ad_tracking BOOLEAN,
  child_directed_treatment BOOLEAN,
  treatment_for_underage BOOLEAN,
  non_personalized_ad BOOLEAN,
  
  -- Sync tracking
  synced_at TIMESTAMP,
  sync_status VARCHAR(50)
);
```

### Indexes for Performance

```sql
-- Index on sync status for efficient querying
CREATE INDEX idx_sync_status ON campaign_manager_conversions(sync_status);

-- Index on timestamp for date-based filtering
CREATE INDEX idx_timestamp ON campaign_manager_conversions(timestamp);

-- Unique index on ordinal for deduplication
CREATE UNIQUE INDEX idx_ordinal ON campaign_manager_conversions(ordinal);
```

## Additional Resources

- [Google Campaign Manager 360 API Documentation](https://developers.google.com/doubleclick-advertisers/rest/v4/conversions)
- [RudderStack Warehouse Sources Documentation](https://www.rudderstack.com/docs/sources/reverse-etl/)
- [Campaign Manager Enhanced Conversions Guide](https://developers.google.com/doubleclick-advertisers/guides/conversions_ec)
- [RudderStack RETL Best Practices](https://www.rudderstack.com/docs/sources/reverse-etl/common-settings/)

