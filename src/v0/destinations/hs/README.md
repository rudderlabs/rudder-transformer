# HubSpot Destination

Implementation in **JavaScript**

## Configuration

### Required Settings

- **Authorization Type**: Choose between legacy API Key authentication or new Private App API authentication

  - `legacyApiKey`: Use legacy API Key (hapikey) for authentication
  - `newPrivateAppApi`: Use Private App access token for authentication

- **API Version**: Choose the HubSpot API version to use
  - `legacyApi` (v1): Legacy API for contacts and events
  - `newApi` (v3): Current CRM API v3 for contacts, custom objects, and behavioral events

### Required Based on Authorization Type

#### Legacy API Key (`legacyApiKey`)

- **Hub ID**: Required for legacy API authentication and track events
- **API Key**: Required legacy API key (hapikey) for authentication

#### Private App API (`newPrivateAppApi`)

- **Access Token**: Required Private App access token for authentication

### Required Based on API Version

#### New API (`newApi`)

- **Lookup Field**: Required field to look up contacts (default: email)
  - Used to search for existing contacts before create/update operations
  - Can be any contact property (email, phone, etc.)

### Optional Settings

- **HubSpot Events**: Event name and property mappings for track calls

  - Map RudderStack event names to HubSpot custom event names
  - Define property mappings for each event

- **Event Filtering**: Filter events using whitelist or blacklist

  - `disable`: No filtering (default)
  - `whitelistedEvents`: Only send specified events
  - `blacklistedEvents`: Don't send specified events

- **Do Association**: Enable association between objects (rETL feature)
  - Used to create associations between HubSpot CRM objects
  - Primarily used with rETL sources

## Integration Functionalities

> HubSpot supports **Device mode** (Web only) and **Cloud mode**

### Supported Message Types

#### Cloud Mode

- **Identify**: Create or update contact records
- **Track**: Send custom behavioral events

#### Device Mode (Web only)

- **Identify**: Create or update contact records
- **Track**: Send custom behavioral events
- **Page**: Track page views

### Implementation

- **Implemented in**: JavaScript (v0)
- **Version**: v0 (located in `src/v0/destinations/hs/`)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router destination (`transformAtV1: "router"`)

### Batching Support

- **Supported**: Yes (for Identify events only)
- **Message Types**: Identify

#### Batch Limits

| API Version     | Operation                        | Endpoint                                                          | Batch Size  | Notes                          |
| --------------- | -------------------------------- | ----------------------------------------------------------------- | ----------- | ------------------------------ |
| Legacy API (v1) | Identify                         | `/contacts/v1/contact/batch/`                                     | 1000        | Create or update contacts      |
| Legacy API (v1) | Track                            | `https://track.hubspot.com/v1/event`                              | No batching | Individual requests only       |
| New API (v3)    | Identify - Create                | `/crm/v3/objects/contacts/batch/create`                           | 100         | Create new contacts            |
| New API (v3)    | Identify - Update                | `/crm/v3/objects/contacts/batch/update`                           | 100         | Update existing contacts       |
| New API (v3)    | Identify - Create Objects (rETL) | `/crm/v3/objects/:objectType/batch/create`                        | 100         | Create custom objects          |
| New API (v3)    | Identify - Update Objects (rETL) | `/crm/v3/objects/:objectType/batch/update`                        | 100         | Update custom objects          |
| New API (v3)    | Identify - Associations (rETL)   | `/crm/v3/associations/:fromObjectType/:toObjectType/batch/create` | 100         | Create associations            |
| New API (v3)    | Track - Single                   | `/events/v3/send`                                                 | No batching | Individual event completion    |
| New API (v3)    | Track - Batch                    | `/events/v3/send/batch`                                           | 500         | Batch events (NOT IMPLEMENTED) |

**Note**:

- The `/events/v3/send/batch` endpoint is available in HubSpot API but is **not yet implemented** in this destination. Track events currently use only the single event endpoint (`/events/v3/send`).
- The destination automatically handles:

- Duplicate email addresses within a batch (for create operations)
- Duplicate contact IDs within a batch (for update operations)
- Segregation of create vs update operations into separate batches
- Proper batching for rETL sources with custom objects

### Rate Limits

The HubSpot API enforces rate limits based on your **HubSpot subscription tier**. Rate limits apply per HubSpot account that installs your app.

#### Tier-Based Rate Limits

| Subscription Tier                  | Per 10 Seconds | Per Day                        | Notes              |
| ---------------------------------- | -------------- | ------------------------------ | ------------------ |
| **Free/Starter**                   | 100 requests   | 250,000 requests               | Base tier          |
| **Professional**                   | 190 requests   | 625,000 requests               | Higher throughput  |
| **Enterprise**                     | 190 requests   | 1,000,000 requests             | Highest throughput |
| **With API Limit Increase Add-on** | 250 requests   | +1,000,000 requests per add-on | Max 2 purchases    |

**OAuth Burst Limits**: OAuth-authenticated apps are limited to **110 requests every 10 seconds per HubSpot account** (excludes Search API).

#### Special Endpoint-Specific Limits

| Endpoint                                                          | Event Types                      | Rate Limit                    | Description                             |
| ----------------------------------------------------------------- | -------------------------------- | ----------------------------- | --------------------------------------- |
| `/contacts/v1/contact/batch/`                                     | Identify (Legacy API)            | Per tier                      | Legacy batch create/update contacts     |
| `/crm/v3/objects/contacts`                                        | Identify (New API)               | Per tier                      | Single contact operations (NOT USED)    |
| `/crm/v3/objects/contacts/batch/create`                           | Identify (New API)               | Per tier                      | Batch create contacts (USED)            |
| `/crm/v3/objects/contacts/batch/update`                           | Identify (New API)               | Per tier                      | Batch update contacts (USED)            |
| `/crm/v3/objects/contacts/search`                                 | Identify (New API)               | **5 requests per second**     | Search for existing contacts            |
| `/crm/v3/objects/:objectType/search`                              | Identify (rETL)                  | **5 requests per second**     | Search for existing objects             |
| `/crm/v3/objects/:objectType/batch/create`                        | Identify (rETL)                  | Per tier                      | Batch create custom objects             |
| `/crm/v3/objects/:objectType/batch/update`                        | Identify (rETL)                  | Per tier                      | Batch update custom objects             |
| `/crm/v3/associations/:fromObjectType/:toObjectType/batch/create` | Identify (rETL - Associations)   | Per tier                      | Batch create associations               |
| `https://track.hubspot.com/v1/event`                              | Track (Legacy API)               | Per tier                      | Legacy track events                     |
| `/events/v3/send`                                                 | Track (New API)                  | **1,250 requests per second** | Custom behavioral events (single)       |
| `/events/v3/send/batch`                                           | Track (New API)                  | **1,250 requests per second** | Custom behavioral events (batch)        |
| `/properties/v1/contacts/properties`                              | Internal (for property fetching) | Per tier                      | Fetch contact properties for validation |

#### Important Notes on Rate Limits

- **Tier-Based Limits**: Rate limits vary significantly based on your HubSpot subscription tier (Free/Starter: 100 req/10s, Professional/Enterprise: 190 req/10s)
- **Search API Exception**: Search API endpoints are limited to **5 requests per second** (regardless of tier)
- **Track Events Exception**: The new API track endpoint (`/events/v3/send`) supports up to **1,250 requests per second**
- **OAuth Apps**: OAuth-authenticated apps have a **110 requests per 10 seconds** burst limit per account (excludes Search API)
- **Daily Limits**: Rate limits reset at midnight based on your account's time zone setting
- **Error Handling**: Exceeding rate limits results in a `429` error response
- **API Limit Increase**: Available for purchase (max 2 add-ons), increases limits to 250 req/10s and adds 1M daily requests per add-on
- **Custom Events**: Limited to 500 unique event definitions per account and 30 million event completions monthly

[Docs Reference](https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines#app-limits)

### Intermediate Calls

#### Identify Flow - Contact Search (New API v3)

- **Supported**: Yes (when `apiVersion: "newApi"`)
- **Use Case**: Search for existing contacts before create/update operations
- **Endpoint**: `/crm/v3/objects/contacts/search`
- **When Triggered**:
  - For every Identify event (non-rETL) when `hsContactId` is not provided in `externalId`
  - Uses the configured `lookupField` (default: email) to search for existing contacts

```javascript
// The condition that leads to intermediate search call:
const contactId = getDestinationExternalID(message, 'hsContactId');

if (!contactId) {
  contactId = await searchContacts(message, destination, metadata);
}

// If contact found -> UPDATE operation
// If contact not found -> CREATE operation
```

#### Identify Flow - Object Search (rETL with New API v3)

- **Supported**: Yes (when source is rETL and `apiVersion: "newApi"`)
- **Use Case**: Bulk search to determine which objects need create vs update operations
- **Endpoint**: `/crm/v3/objects/:objectType/search`
- **When Triggered**:
  - Before processing a batch of rETL events with `mappedToDestination: true`
  - Searches for all objects in the batch to optimize API calls
  - Supports pagination for large result sets

```javascript
// The condition that leads to intermediate search call for rETL:
const mappedToDestination = get(message, MappedToDestinationKey);
if (mappedToDestination && GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())) {
  // Skip splitting for association objects
  if (objectType?.toLowerCase() !== 'association') {
    // Search for existing objects in batch
    tempInputs = await splitEventsForCreateUpdate(tempInputs, destination, metadata);
  }
}
```

**Note**: For rETL sources, the destination implements an optimization where it searches for all contacts/objects in a batch ONCE before transformation, rather than searching individually for each event. This significantly reduces API calls.

#### Property Fetching (Both API Versions)

- **Supported**: Yes (conditional)
- **Use Case**: Fetch HubSpot property definitions to validate data types and custom properties
- **Endpoint**: `/properties/v1/contacts/properties`
- **When Triggered**:
  - Only when traits are present in the Identify event
  - Cached during router transformation to avoid redundant calls
  - Used to validate property data types and format custom properties

```javascript
// The condition that leads to property fetching:
const traitsFound = tempInputs.some((input) => fetchFinalSetOfTraits(input.message) !== undefined);
if (traitsFound) {
  propertyMap = await getProperties(destination, metadata);
}
```

> No intermediate calls are made for Track events with either API version

### Proxy Delivery

- **Supported**: Yes (Proxy v1)
- **Source Code Path**: [src/v1/destinations/hs/networkHandler.ts](../../../v1/destinations/hs/networkHandler.ts)
- **Test Cases**: [test/integrations/destinations/hs/dataDelivery/](../../../../../test/integrations/destinations/hs/dataDelivery/)

#### Proxy v1 Implementation

HubSpot implements proxy v1 to provide granular handling of partial batch failures. The implementation includes:

**Key Features**:

- Handles both legacy API (`legacyApi`) and new API (`newApi`) versions
- Supports partial batch failure handling for the new API version
- Individual status codes and error messages for each event in a batch
- Uses the `dontBatch` flag to prevent problematic events from being batched in future attempts

**Response Handling**:
The network handler processes different scenarios:

- **Single Event**: Single event in a batch
- **Legacy API with Multiple Events**: All-or-nothing batch processing
- **New API with Multiple Events**: Granular success/failure for each event
- **New API with Partial Failures**: Handles cases where `results` and `errors` arrays are returned

**Error Handling**:

- For 400-level errors with batched events, returns 500 status with `dontBatch: true` to trigger retry with individual events
- Uses `TransformerProxyError` for proper error reporting to rudder-server
- Maps authentication errors appropriately using `getAuthErrCategoryFromStCode`

For implementation details, see the [Proxy Implementation Guide](../../../../../memory-bank/17_proxy_implementation_guide.md).

### User Deletion

- **Supported**: No
- **Source Code Path**: N/A

> HubSpot destination does not implement user deletion functionality via the Suppression/GDPR API.

### OAuth Support

- **Supported**: No
- **Auth Type**: API Key or Private App Access Token only

> HubSpot destination uses either:
>
> - Legacy API Key (hapikey) authentication
> - Private App Access Token authentication
>
> OAuth flow is not currently implemented.

### Additional Functionalities

#### Dual API Version Support

The HubSpot destination uniquely supports two API versions with automatic routing:

- **Legacy API (v1)**: Older contacts and events API

  - File: `HSTransform-v1.js`
  - Best for: Existing integrations using legacy authentication
  - Endpoints: `/contacts/v1/*`, `https://track.hubspot.com/v1/event`

- **New API (v3)**: Current CRM API with enhanced features
  - File: `HSTransform-v2.js`
  - Best for: New integrations, custom objects, rETL
  - Endpoints: `/crm/v3/*`, `/events/v3/send`

**Automatic Version Selection**: The destination automatically routes to the correct implementation based on the `apiVersion` configuration.

#### rETL (Reverse ETL) Support

**Comprehensive rETL Functionality**:

- **Custom Objects**: Create and update any HubSpot custom object
- **Associations**: Create associations between objects (contacts, companies, deals, custom objects)
- **Optimized Batching**: Bulk search before transformation reduces API calls
- **Property Mapping**: Automatic property type conversion (date fields to UTC midnight)
- **System Field Handling**: Automatically removes HubSpot system fields (e.g., `hs_object_id`)

**How It Works**:

1. Events include `externalId` array with object type, identifier type, and identifier value
2. Destination searches for existing objects in bulk (one search for entire batch)
3. Events are split into create vs update operations
4. Operations are batched according to HubSpot's batch size limits
5. System fields are filtered out before sending to HubSpot

#### Email Validation

The destination validates email addresses before sending to HubSpot (New API only):

```javascript
if (traits?.email && !validator.isEmail(traits.email)) {
  throw new InstrumentationError(`Email "${traits.email}" is invalid`);
}
```

#### Property Key Formatting

HubSpot has specific requirements for property names. The destination automatically formats property keys:

- Converts to lowercase
- Replaces spaces with underscores
- Replaces dots with underscores

Example: `First Name` → `first_name`, `user.email` → `user_email`

#### Date Property Handling

Date properties are automatically converted to UTC midnight timestamps:

```javascript
// For properties with type 'date', converts to UTC midnight
const getUTCMidnightTimeStampValue = (propValue) => {
  const time = propValue;
  const date = new Date(time);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime();
};
```

#### Duplicate Handling in Batches

**New API (v3)** includes built-in duplicate handling:

- **Create Operations**: If multiple events in a batch have the same email, only the last one is kept
- **Update Operations**: If multiple events in a batch update the same contact ID, only the last update is kept

This prevents HubSpot API errors due to duplicate identifiers within a single batch.

#### Secondary Property Handling for Email

When using email as the identifier type for rETL sources, the destination also checks the `hs_additional_emails` field:

- Searches for contacts using both primary email and additional emails
- Prevents duplicate contact creation when email exists as secondary email
- Marks contacts found via secondary email to avoid overwriting primary email field

### Validations

#### Identify Events

**Legacy API (v1)**:

- **Email Required**: Email is mandatory in traits for non-rETL sources
- **Valid Email**: No validation performed on email format

**New API (v3)**:

- **Email Format**: Validates email using `validator.isEmail()` (non-rETL only)
- **Lookup Field**: Required in destination config for non-rETL sources
- **Valid Lookup Value**: Must have lookup field value in traits or properties

**rETL Sources (Both APIs)**:

- **Object Type**: Required in `externalId` array
- **Identifier Type**: Required in `externalId` array
- **Identifier Value**: Required in `externalId` array
- **System Fields**: Automatically removed before sending

#### Track Events

**Legacy API (v1)**:

- **Hub ID**: Required in destination configuration
- **Event Name**: Required in event payload

**New API (v3)**:

- **Event Name**: Required and validated (no empty strings, trimmed)
- **Event Mapping**: Must be configured in destination settings (`hubspotEvents`)
- **Identifier**: At least one of email, utk (user token cookie), or objectId (contact/visitor ID) required
- **Property Mapping**: Event properties must be mapped in destination configuration

#### General Validations

- **Authorization**: Either API Key (legacy) or Access Token (new) must be provided
- **Hub ID**: Required for legacy API authentication
- **API Version**: Must be either `legacyApi` or `newApi`
- **Message Type**: Only `identify` and `track` supported for cloud mode
- **Property Data Types**: Validates that payload property types match HubSpot property types
  - String properties: Converts objects to JSON string
  - Number properties: Must be numeric (throws error otherwise)
  - Boolean properties: Must be boolean (throws error for objects)
  - Date properties: Converts to UTC midnight timestamp

## General Queries

### Event Ordering

#### Identify Events

**Event ordering is REQUIRED** for Identify events for both API versions.

**Reasoning**:

- Identify events update contact attributes/properties
- Out-of-order events can cause older data to overwrite newer data
- HubSpot maintains property history but uses "last write wins" logic
- No built-in deduplication or timestamp-based conflict resolution

**Example Risk**:

```
Event 1 (timestamp: 2025-01-15): { firstName: "John Updated" }
Event 2 (timestamp: 2025-01-10): { firstName: "John" }

If Event 2 is processed after Event 1, the firstName will incorrectly be "John"
instead of "John Updated"
```

**Impact**:

- Can result in stale contact data
- Property history will show incorrect update sequence
- Affects marketing automation and segmentation based on properties

[HubSpot Property History Documentation](https://knowledge.hubspot.com/crm-setup/hubspots-change-sources-in-property-history)

#### Track Events

**Event ordering is RECOMMENDED** for Track events with New API (v3).

**Reasoning**:

- Track events (custom behavioral events) include an `occurredAt` timestamp
- HubSpot honors the `occurredAt` timestamp for event ordering in timelines
- However, if events are sent out of order, there may be temporary display issues
- Event analytics and reporting respect the `occurredAt` timestamp

**Legacy API Track Events**:

- Legacy API track events do not support custom timestamps
- Events are recorded with the timestamp when received by HubSpot
- **Event ordering is REQUIRED** for legacy API track events

**Note**: While HubSpot respects timestamps for event display, maintaining order is still recommended to ensure consistent data processing and to avoid potential issues with:

- Workflow triggers based on event sequences
- Real-time reporting dashboards
- Webhook notifications based on event timing

> **Effectively, HubSpot requires event ordering for Identify events and legacy Track events. For new API Track events, ordering is recommended but not strictly required due to timestamp support.**

### Data Replay Feasibility

#### Missing Data Replay

**Identify Events**:

- **Not Feasible** for pure attribute updates
- **Reasoning**: As noted in Event Ordering section, out-of-order Identify events will cause older data to overwrite newer data
- **Risk**: Replaying old Identify events will rollback contact properties to stale values
- **Mitigation**: If properties include proper timestamps, manual cleanup may be possible by reviewing property history

**Track Events (New API v3)**:

- **Feasible** with proper `occurredAt` timestamps
- **Reasoning**: Events include `occurredAt` timestamp which HubSpot honors
- **Requirement**: Must include accurate historical timestamps in replayed events
- **Caveat**: May affect monthly event completion limits (30 million per month)

**Track Events (Legacy API v1)**:

- **Not Recommended**
- **Reasoning**: Legacy API does not support custom timestamps
- **Risk**: Events will be recorded with current timestamp, losing historical accuracy

> **Recommendation**: Avoid replaying missing Identify events. Track events (v3) can be replayed with proper timestamps.

#### Already Delivered Data Replay

**Identify Events**:

- **Not Feasible** for overwrite/correction
- **Reasoning**: HubSpot does not deduplicate based on event IDs or content
- **Behavior**: Each API call updates the contact properties, regardless of previous values
- **Risk**: Will overwrite current data with replayed data

**Track Events (New API v3)**:

- **Not Feasible** for deduplication
- **Reasoning**: HubSpot does not deduplicate events based on event IDs or content
- **Behavior**: Each event is treated as a unique occurrence, even with identical content
- **Quote from HubSpot**: _"Each event ingested into Braze has its own event ID, so 'duplicate' events are treated as separate, unique events."_ (Note: Similar behavior applies to HubSpot)
- **Risk**: Replaying will create duplicate events in timelines and analytics
- **Impact**:
  - Skews event analytics and counts
  - May trigger workflows multiple times
  - Consumes additional event completion quota

**Exception - Marketing Events API**:

- The Marketing Events API is idempotent based on contact ID + interactionDateTime
- This is a special case and does not apply to general custom behavioral events

[HubSpot Events Documentation](https://developers.hubspot.com/docs/api/analytics/events)

> **Recommendation**: Do not replay already delivered data for any event type. Both Identify and Track events will create duplicates or overwrite current data.

### Multiplexing

**Supported**: Yes (limited scenarios)

**Description**: The HubSpot destination can generate multiple API calls from a single input event in specific scenarios.

#### Multiplexing Scenarios

##### 1. Identify Events - Property Fetching (Both API Versions)

- **Multiplexing**: NO (Intermediary call, not multiplexing)
- **Condition**: When traits are present and property map is not cached
- **First API Call**: `/properties/v1/contacts/properties` - Fetch property definitions (intermediary)
- **Second API Call**: Contact create/update endpoint - Send contact data (primary)
- **Note**: This is an optimization call to validate property types, not true multiplexing

##### 2. Identify Events - Contact Search (New API v3)

- **Multiplexing**: NO (Intermediary call, not multiplexing)
- **Condition**: When `hsContactId` is not provided in `externalId`
- **First API Call**: `/crm/v3/objects/contacts/search` - Search for existing contact (intermediary)
- **Second API Call**: `/crm/v3/objects/contacts` or `/crm/v3/objects/contacts/:contactId` - Create or update contact (primary)
- **Note**: Search call determines whether to create or update; not true multiplexing

##### 3. Identify Events - rETL Object Search (New API v3)

- **Multiplexing**: NO (Batch optimization, not multiplexing)
- **Condition**: When source is rETL with `mappedToDestination: true`
- **First API Call(s)**: `/crm/v3/objects/:objectType/search` - Bulk search for existing objects (intermediary)
- **Second API Call(s)**: Batch create or update endpoints (primary)
- **Note**: Single search call for entire batch, not per-event multiplexing

##### 4. Identify Events - rETL Associations (New API v3)

- **Multiplexing**: NO (Single purpose event)
- **Condition**: When `objectType: "association"` in rETL source
- **API Call**: `/crm/v3/associations/:fromObjectType/:toObjectType/batch/create`
- **Note**: Association events have a single purpose and generate a single API call

##### 5. Track Events (Both API Versions)

- **Multiplexing**: NO
- **API Call**: Single track endpoint call
  - Legacy: `https://track.hubspot.com/v1/event`
  - New: `/events/v3/send`
- **Note**: No intermediary calls or multiplexing for track events

> **Summary**: The HubSpot destination does NOT perform true multiplexing. All scenarios involve intermediary/optimization calls before the primary data delivery call. Each input event results in a single data modification API call (with optional preceding search/validation calls).

## Version Information

### Current Implementation

The HubSpot destination implements support for two API versions:

#### Legacy API (v1)

- **Config Value**: `apiVersion: "legacyApi"`
- **Status**: Partially deprecated, but still functional
- **Endpoints**:
  - Contacts: `/contacts/v1/*`
  - Batch Contacts: `/contacts/v1/contact/batch/`
  - Track Events: `https://track.hubspot.com/v1/event`
  - Properties: `/properties/v1/contacts/properties`

#### New API (v3)

- **Config Value**: `apiVersion: "newApi"`
- **Status**: Current recommended version
- **Endpoints**:
  - Contacts: `/crm/v3/objects/contacts`
  - Batch Contacts: `/crm/v3/objects/contacts/batch/*`
  - Search: `/crm/v3/objects/contacts/search`
  - Custom Objects: `/crm/v3/objects/:objectType`
  - Associations: `/crm/v3/associations/:fromObjectType/:toObjectType/batch/create`
  - Track Events: `/events/v3/send`
  - Properties: `/properties/v1/contacts/properties` (still v1)

### Deprecation Timeline

#### Contact Lists API (v1)

- **Sunset Date**: April 30, 2026
- **Status**: Extended (originally scheduled for September 30, 2025)
- **Impact**: Not directly used by this destination
- **Migration**: Use Lists v3 API

[Changelog: Contact Lists API v1 Sunset](https://developers.hubspot.com/changelog/extension-contact-lists-api-v1-sunset-moved-to-april-30-2026)

#### Legacy Behavioral Events Tool

- **Sunset Date**: August 1, 2025
- **Status**: Active deprecation
- **Impact**: Affects legacy track events created in the Legacy Custom Events tool
- **Behavior After Sunset**:
  - Can no longer create new event definitions
  - Can no longer send new completion data
  - Existing event data remains accessible
- **Migration**: Use Custom Events API (`/events/v3/send`)

[HubSpot Knowledge Base: Custom Events](https://knowledge.hubspot.com/reports/create-custom-events)

#### Legacy Contacts API Batch Endpoint

- **Endpoint**: `/contacts/v1/contact/batch/`
- **Status**: Still functional, but rate limits adjusted
- **Impact**: Rate limits have been modified (details in Rate Limits section)
- **Migration Path**: Use `/crm/v3/objects/contacts/batch/create` and `/crm/v3/objects/contacts/batch/update`

[Changelog: Legacy Contacts API Batch Rate Limits](https://developers.hubspot.com/changelog/new-rate-limits-for-the-legacy-contacts-api-batch-create-or-update-endpoint)

#### Legacy Track Events Endpoint

- **Endpoint**: `https://track.hubspot.com/v1/event`
- **Status**: Still functional, limited features
- **Limitations**:
  - No custom timestamps
  - Limited to Hub ID-based tracking
  - Fewer analytics capabilities
- **Migration Path**: Use `/events/v3/send` with custom behavioral events

### API Version Comparison

| Feature                        | Legacy API (v1) | New API (v3)                    |
| ------------------------------ | --------------- | ------------------------------- |
| **Contact Management**         | ✓               | ✓ (Enhanced)                    |
| **Batch Operations**           | ✓ (up to 1000)  | ✓ (up to 100)                   |
| **Custom Objects**             | ✗               | ✓                               |
| **Associations**               | ✗               | ✓                               |
| **rETL Support**               | Partial         | Full                            |
| **Custom Timestamps (Track)**  | ✗               | ✓                               |
| **Email Validation**           | ✗               | ✓                               |
| **Search API**                 | ✗               | ✓                               |
| **Object Property Enrichment** | ✗               | ✓                               |
| **Event Batch Endpoint**       | ✗               | ✓ (500 events)                  |
| **Rate Limits**                | 100 req/10s     | 100 req/10s (1250/s for events) |

### Recommended Version

**Use New API (v3)** for:

- New integrations
- rETL / warehouse sources
- Custom objects and associations
- Enhanced event tracking with timestamps
- Better property validation and handling

**Legacy API (v1) is acceptable for**:

- Existing integrations that don't need v3 features
- Simple contact management use cases
- When larger batch sizes are needed (1000 vs 100)

### Breaking Changes (v1 → v3)

When migrating from Legacy API to New API:

1. **Batch Size**: Reduced from 1000 to 100 contacts per batch
2. **Lookup Field**: Required configuration field for contact search
3. **Email Validation**: Stricter email format validation
4. **Property Formats**: Different property payload structures
5. **Track Events**: Requires event definition creation and mapping
6. **Error Responses**: Different error structures and codes

## RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

## Business Logic and Mappings

For detailed business logic, field mappings, and transformation flows, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## Documentation Links

### HubSpot API Documentation

#### General

- [HubSpot Developer Documentation](https://developers.hubspot.com/docs/)
- [API Usage Guidelines and Limits](https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines)
- [HubSpot Developer Changelog](https://developers.hubspot.com/changelog)
- [Deprecated APIs](https://developers.hubspot.com/docs/api/deprecated-apis)

#### Contacts API

- [CRM API | Contacts (v3)](https://developers.hubspot.com/docs/api-reference/crm-contacts-v3/guide)
- [Legacy Contacts API (v1)](https://legacydocs.hubspot.com/docs/methods/contacts/contacts-overview)
- [Create Contact](https://legacydocs.hubspot.com/docs/methods/contacts/create_contact)
- [Create or Update Contact](https://legacydocs.hubspot.com/docs/methods/contacts/create_or_update)
- [Batch Create or Update Contacts](https://legacydocs.hubspot.com/docs/methods/contacts/batch_create_or_update)

#### Custom Objects API

- [CRM Custom Objects](https://developers.hubspot.com/docs/api/crm/crm-custom-objects)
- [Understanding the CRM](https://developers.hubspot.com/docs/api/crm/understanding-the-crm)

#### Associations API

- [CRM Associations](https://developers.hubspot.com/docs/api/crm/associations)

#### Events API

- [Send Custom Event Completions](https://developers.hubspot.com/docs/api/analytics/events)
- [Create Custom Events](https://knowledge.hubspot.com/reports/create-custom-events)
- [Analyze Custom Events](https://knowledge.hubspot.com/analytics-tools/analyze-custom-behavioral-events)
- [Legacy Events Tool](https://knowledge.hubspot.com/reports/analyze-and-manage-your-legacy-events)
- [Enterprise Events HTTP API (Legacy)](https://legacydocs.hubspot.com/docs/methods/enterprise_events/http_api)

#### Property Management

- [Contact Properties API](https://legacydocs.hubspot.com/docs/methods/contacts/v2/contact-properties-overview)
- [Property History](https://knowledge.hubspot.com/crm-setup/hubspots-change-sources-in-property-history)

#### Deduplication

- [HubSpot Duplicates Management Guide](https://knowledge.ostsdigital.com/hubspot-crm/contacts/deduplicate-contacts-companies-deals-tickets-and-products)

#### Changelog References

- [Contact Lists API v1 Sunset Extension](https://developers.hubspot.com/changelog/extension-contact-lists-api-v1-sunset-moved-to-april-30-2026)
- [Legacy Contacts API Batch Rate Limits](https://developers.hubspot.com/changelog/new-rate-limits-for-the-legacy-contacts-api-batch-create-or-update-endpoint)
- [Fall Spotlight 2025: New & Improved APIs](https://developers.hubspot.com/changelog/new-and-improved-apis-fall-spotlight-2025)

## FAQ

> This section will be populated with frequently asked questions as they arise from usage and support requests.

---

**Note**: This documentation covers the event stream (real-time) functionality of the HubSpot destination. For warehouse/rETL-specific features and implementation details, please refer to [docs/retl.md](docs/retl.md).
