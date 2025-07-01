# Mixpanel Destination

Implementation in **Javascript** (v0, v1 -> for network proxy)

## Configuration

### Required Settings

- **Token**: Required for authentication with Mixpanel API
  - Used for tracking events and updating user profiles
  - Must be provided for all API calls

- **Data Residency**: Specifies the Mixpanel data center to use
  - Available options: US (default), EU, IN

### Optional Settings

- **Use Mixpanel People**: Enable to send identify calls to Mixpanel's People feature
- **Automatically set all Traits as Super Properties and People Properties**: When enabled, all traits from identify calls are set as super properties and people properties
- **Identity Merge API**: Choose between Original ID Merge and Simplified ID Merge
- **API Secret**: Required for using the Import API (for server-side implementations)
- **GDPR API Token**: Required for user deletion via the GDPR API
- **Group Key Settings**: Configure group analytics settings
- **Strict Mode**: Enable strict validation of requests with error reporting for failed events
- **Ignore "Do Not Track"**: If enabled, Mixpanel will ignore "Do Not Track" setting of browser
- **Use Custom Page Event Name**: Enable custom naming template for page events
- **Page Event Name Template**: Template for custom page event names (e.g., "Viewed {{category}} {{name}} page")
- **Use Custom Screen Event Name**: Enable custom naming template for screen events
- **Screen Event Name Template**: Template for custom screen event names (e.g., "Viewed {{category}} {{name}} screen")
- **Drop Traits in Track Event**: When enabled, drops persisted user traits from track events
- **Union Properties**: Specify identify traits whose values are added to a list property (appear only once)
- **Append Properties**: Specify identify traits whose values are appended to list properties
- **Super Properties**: Specify event properties to set as Super Properties in Mixpanel
- **Set Once Properties**: Specify identify traits that should only be set once and never overwritten
- **People Properties**: Specify identify traits to set as People Properties in Mixpanel
- **Event Increments**: Configure events to increment in Mixpanel People
- **Property Increments**: Configure properties to increment in Mixpanel People
- **Consolidated Page Calls**: Track all pages with consolidated event name (enabled by default)
- **Track Categorized Pages**: Track events for page calls with associated category
- **Track Named Pages**: Track events for page calls with associated name
- **Source Name**: Custom source name sent to Mixpanel for every event
- **Session Replay Percentage**: Percentage of SDK initializations that qualify for replay data capture (web only)
- **Cross Subdomain Cookie**: Persist Mixpanel cookie between different pages (web only)
- **Persistence Type**: Choose persistence storage method (None, Cookie, Local Storage) (web only)
- **Persistence Name**: Custom name for Mixpanel cookie (web only)
- **Secure Cookie**: Mark Mixpanel cookie as secure (HTTPS only) (web only)
- **User Deletion API**: Choose between "engage" (profile deletion) or "task" (GDPR deletion)
- **Use New Mapping**: Enable new field mapping format (recommended for new integrations)
- **Blacklisted Events**: List of events to exclude from sending to Mixpanel
- **Whitelisted Events**: List of events to exclusively send to Mixpanel
- **Event Filtering Option**: Choose between blacklist or whitelist filtering
- **Consent Management**: Configure consent management settings for privacy compliance
- **OneTrust Cookie Categories**: Specify OneTrust cookie categories for consent management
- **Ketch Consent Purposes**: Specify Ketch consent purposes for privacy compliance

## Integration Functionalities

> Mixpanel supports **Device mode** and **Cloud mode**

### Supported Message Types

- Identify
- Track
- Page
- Screen
- Group
- Alias (only with Original ID Merge)

### Event Type to Endpoint Mapping

| Event Type | Endpoints Used | Lowest Rate Limit | Limiting Endpoint |
|------------|----------------|-------------------|-------------------|
| **Identify** | `/engage` | No explicit rate limit specified | `/engage` |
| **Track** | `/import` (server-side) or `/track` (client-side) | 2GB uncompressed JSON/minute (~30k events/sec) | `/import` or `/track` |
| **Page** | `/import` (server-side) or `/track` (client-side) | 2GB uncompressed JSON/minute (~30k events/sec) | `/import` or `/track` |
| **Screen** | `/import` (server-side) or `/track` (client-side) | 2GB uncompressed JSON/minute (~30k events/sec) | `/import` or `/track` |
| **Group** | `/import` (or `/track`) + `/groups` | No explicit rate limit specified | `/groups` |
| **Alias (Original ID Merge)** | `/import` with `$merge` event | 2GB uncompressed JSON/minute (~30k events/sec) | `/import` |

**Notes:**
- Track, Page, and Screen events may also trigger additional `/engage` calls when People properties are enabled
- Group events generate both a tracking event and a group profile update
- Identify events with Original ID Merge may generate additional `/import` calls for identity merging
- Rate limits for `/engage` and `/groups` endpoints are not explicitly specified by Mixpanel
- All endpoints share the same Ingestion API rate limit of 2GB uncompressed JSON/minute when specified

### Batching Support

- **Supported**: Yes
- **Message Types**: All message types
- **Implementation**: Events are automatically batched by endpoint type for optimal performance
- **Batch Limits** (RudderStack Implementation):
  - Import API: 2000 events per batch (matches Mixpanel limit)
  - Engage API (People profiles): 2000 profiles per batch (matches Mixpanel limit)
  - Groups API: 200 groups per batch (conservative limit, Mixpanel allows 2000)
  - User deletion: 1000 users per batch (profile deletion) or 1999 users per batch (GDPR deletion task)
- **Compression**: GZIP compression enabled for Import API requests when supported
- **Payload Validation**: Each batch validated against Mixpanel's 1MB payload limit before sending

### Rate Limits and Batch Sizes

## Externally Imposed Limits (Mixpanel API)

Mixpanel enforces the following limits on their API endpoints:

| Endpoint | Rate Limit | Batch Size Limit | Payload Size Limit | Event Size Limit | Description |
|----------|------------|------------------|-------------------|------------------|-------------|
| `/import` | 2GB uncompressed JSON/minute (~30k events/sec) | 2000 events per batch | 10MB uncompressed per request | 1MB per event | Server-side event tracking with historical data support |
| `/track` | 2GB uncompressed JSON/minute (~30k events/sec) | 2000 events per batch | Same as `/import` | 1MB per event | Client-side event tracking (last 5 days only) |
| `/engage` | Not explicitly specified | 2000 profiles per batch | 1MB per profile update | 1MB per profile | User profile updates |
| `/groups` | Not explicitly specified | 2000 groups per batch | 1MB per group update | 1MB per group | Group profile updates |

### Mixpanel API Validation Rules ( Based on public docs )

- **Property Limits**: Maximum 255 properties per event
- **Array Limits**: Maximum 255 elements in arrays
- **Nesting Depth**: Maximum 3 levels of nested objects
- **Object Keys**: Maximum 255 keys per nested object
- **String Truncation**: All strings truncated to 255 characters
- **Required Fields**: `event`, `time`, `distinct_id`, `$insert_id` for events
- **Time Validation**: Events before 1971-01-01 or >1 hour in future are rejected

## Internally Imposed Limits (RudderStack Implementation)

RudderStack implements additional batching and validation limits for optimal performance:

| Operation | RudderStack Batch Limit | Mixpanel API Limit | Purpose |
|-----------|------------------------|-------------------|---------|
| **Import Events** | 2000 events per batch | 2000 events per batch | Matches Mixpanel limit for optimal throughput |
| **Engage Profiles** | 2000 profiles per batch | 2000 profiles per batch | Matches Mixpanel limit for user profile updates |
| **Groups Profiles** | 200 groups per batch | 2000 groups per batch | Conservative limit for group operations |
| **User Deletion (Profile)** | 1000 users per batch | Not specified | Conservative batching for deletion operations |
| **User Deletion (GDPR)** | 1999 users per batch | Not specified | Near-maximum batching for GDPR compliance |

### RudderStack Validation Enforcement

RudderStack validates payloads before sending to Mixpanel:

```javascript
// Property limits enforced by RudderStack
const MAX_PROPERTY_KEYS_COUNT = 255;
const MAX_ARRAY_ELEMENTS_COUNT = 255;
const MAX_PAYLOAD_SIZE_BYTES = 1024 * 1024; // 1MB
```

- **Payload Size**: 1MB limit enforced before API call
- **Property Count**: 255 property limit validated recursively
- **Array Size**: 255 element limit for all arrays
- **Geo Source**: Only `null` or `'reverse_geocoding'` allowed for `$geo_source`

### Rate Limiting Behavior

- **Mixpanel Rate Limit Response**: HTTP 429 status code with retry-after header
- **RudderStack Handling**: Automatic retry with exponential backoff for rate limit errors
- **Batch Size Optimization**: Conservative group batch size (200) to reduce rate limit likelihood
- **Compression**: GZIP compression reduces bandwidth usage for Import API calls
- **Error Reporting**: Detailed error messages for validation failures and API limits exceeded

### Intermediate Calls

#### Identity Merge Flow
- **Supported**: Yes
- **Use Case**: Identity resolution through the Mixpanel Merge API
- **Endpoint**: `/import` with `$merge` event
- **Conditions**: When both userId and anonymousId are present and Identity Merge API is set to "Original"

```javascript
// The condition that leads to intermediate merge call:
if (
  destination.Config?.identityMergeApi !== 'simplified' &&
  messageClone.userId &&
  messageClone.anonymousId &&
  isImportAuthCredentialsAvailable(destination)
) {
  // Create $merge event
  const trackPayload = {
    event: '$merge',
    properties: {
      $distinct_ids: [messageClone.userId, messageClone.anonymousId],
      token: destination.Config.token,
    },
  };
  // Send merge event
  returnValue.push(identifyTrackResponse);
}
```

### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: `src/v1/destinations/mp/networkHandler.ts`

### User Deletion

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/mp/deleteUsers.js`
- **Methods**:
  - Profile deletion via Engage API
  - GDPR deletion task creation (requires GDPR API Token)

### OAuth Support

- **Supported**: No
- **Authentication Method**: API Token-based authentication
- **Required Credentials**: Project Token and optionally API Secret for Import API

### Validations

The Mixpanel destination enforces several validation rules to ensure data quality and API compliance:

#### Property Limits
- **Maximum Property Keys**: 255 property keys per event
- **Maximum Array Elements**: 255 elements in arrays
- **Maximum Payload Size**: 1MB per request
- **Geo Source Validation**: `$geo_source` must be either `null` or `'reverse_geocoding'`

#### Required Fields
- **Token**: Required for all API calls
- **Distinct ID**: Either `userId` or `anonymousId` must be present
- **Event Name**: Required for track events
- **GDPR API Token**: Required when using GDPR deletion tasks

#### Event Type Restrictions
- **Alias Events**: Not supported when using Simplified ID Merge
- **Group Events**: Require Group Key Settings to be configured
- **Revenue Events**: Must include valid revenue value in properties

#### Identity Merge Validation
- **Original ID Merge**: Requires both `userId` and `anonymousId` for merge operations
- **Simplified ID Merge**: Automatically handles identity resolution without explicit merge events

### Additional Functionalities

#### Super Properties

- **Supported**: Yes
- **Configuration**: Enable via settings in destination config
- **How It Works**: Properties specified in the Super Properties list are included in all events sent to Mixpanel

#### Set Once Properties

- **Supported**: Yes
- **Configuration**: Enable via settings in destination config
- **How It Works**: Properties specified in the Set Once Properties list are only set once for a user profile

#### People Properties

- **Supported**: Yes
- **Configuration**: Enable via settings in destination config and "Use Mixpanel People"
- **How It Works**: Properties specified in the People Properties list are sent to Mixpanel People

#### Property Increments

- **Supported**: Yes
- **Configuration**: Configure via Event Increments and Property Increments settings
- **How It Works**: Specified properties are incremented rather than overwritten

#### Group Analytics

- **Supported**: Yes
- **Configuration**: Configure via Group Key Settings
- **How It Works**: Allows tracking user actions in the context of groups (organizations, accounts, etc.)

#### Event Deduplication

- **Supported**: Yes (Automatic)
- **Implementation**: RudderStack automatically maps `messageId` to `$insert_id` for all events
- **How It Works**: Mixpanel deduplicates events using event name, distinct_id, timestamp, and $insert_id
- **Benefits**: Prevents duplicate events during data replay, network retries, or integration issues
- **Query-Time**: Duplicates filtered immediately in Mixpanel reports
- **Storage**: Duplicate events removed during Mixpanel's compaction process

## General Queries

### Event Ordering

#### Identify, Alias
These event types require strict event ordering as they are used for identity resolution. Out-of-order events could lead to incorrect user profiles.

#### Track, Page, Screen
Mixpanel events include a timestamp, which allows for proper ordering of events regardless of when they are received. However, if events update user profiles, ordering becomes important to avoid overwriting newer attributes with older ones.

### Data Replay Feasibility

#### Deduplication Support

RudderStack leverages Mixpanel's built-in event deduplication mechanism by automatically sending `$insert_id` with every event:

- **$insert_id Generation**: RudderStack maps `messageId` to `$insert_id` for all events
- **UUID Format**: The `$insert_id` is truncated to the last 36 characters to ensure proper UUID format
- **Deduplication Logic**: Mixpanel deduplicates events based on: `event`, `distinct_id`, `time`, and `$insert_id`

#### Missing Data Replay

- **Track Events**: **SAFE** - RudderStack's automatic `$insert_id` generation enables safe replay. Mixpanel will deduplicate identical events automatically.
- **Page/Screen Events**: **SAFE** - Same deduplication protection as track events.
- **Identify Events**: **CAUTION** - While deduplicated, replaying identify events may overwrite newer profile attributes with older ones. Consider timestamp ordering.
- **Group Events**: **SAFE** - Deduplication prevents duplicate group profile updates.

#### Already Delivered Data Replay

- **Recommended Approach**: Data replay is safe due to RudderStack's implementation of Mixpanel's deduplication
- **Automatic Deduplication**: Events with identical `event`, `distinct_id`, `time`, and `$insert_id` are automatically deduplicated by Mixpanel
- **Query-Time Protection**: Duplicate events are filtered out in Mixpanel reports immediately
- **Storage Optimization**: Mixpanel's compaction process removes duplicate events from storage over time

#### Implementation Details

```javascript
// RudderStack automatically maps messageId to $insert_id
{
  "sourceKeys": "messageId",
  "destKey": "$insert_id"
}

// Code truncates to UUID format for SDK compatibility
if (mappedProperties.$insert_id) {
  mappedProperties.$insert_id = mappedProperties.$insert_id.slice(-36);
}
```

### Multiplexing

- **Supported**: Yes
- **Description**: The Mixpanel destination can generate multiple API calls from a single input event in specific scenarios.

#### Multiplexing Scenarios

1. **Identify Events with Identity Merge**:
   - **Multiplexing**: YES
   - First API Call: `/import` with `$merge` event - To merge anonymous and identified users
   - Second API Call: `/engage` - To update user profile attributes

2. **Track Events with People Updates**:
   - **Multiplexing**: YES
   - First API Call: `/track` or `/import` - To send the event
   - Second API Call: `/engage` - To update user profile attributes (when People is enabled)

3. **Group Events**:
   - **Multiplexing**: YES
   - First API Call: `/track` or `/import` - To send the event
   - Second API Call: `/groups` - To update group profile attributes

## Version Information

### Current API Versions

Mixpanel API is versioned by endpoint rather than having global API versions. The implementation uses the current stable endpoints:

- **Import API**: Current stable version (no versioning in URL)
- **Track API**: Current stable version (no versioning in URL)
- **Engage API**: Current stable version (no versioning in URL)
- **Groups API**: Current stable version (no versioning in URL)
- **GDPR API**: v3.0 (as specified in endpoint URL)

### API Endpoint Versioning

- **Base Endpoints**: No version deprecation concerns as Mixpanel maintains backward compatibility
- **GDPR API**: Uses v3.0 which is the current stable version
- **No Breaking Changes**: Mixpanel typically maintains backward compatibility for their APIs

### Implementation Version

- **Transformer Version**: v0 (JavaScript implementation)
- **Network Handler**: v1 (TypeScript implementation for proxy delivery)
- **CDK v2**: Not enabled (`cdkV2Enabled: false` in db-config.json)

## Documentation Links

### API Documentation

- [Mixpanel API Overview](https://developer.mixpanel.com/reference/overview)
- [Import API](https://developer.mixpanel.com/reference/import-events)
- [Track API](https://developer.mixpanel.com/reference/track-event)
- [Engage API](https://developer.mixpanel.com/reference/profile-set)
- [Groups API](https://developer.mixpanel.com/reference/group-set-property)
- [Identity Merge](https://developer.mixpanel.com/reference/identity-merge)
- [Event Deduplication](https://developer.mixpanel.com/reference/event-deduplication)
- [User Deletion](https://developer.mixpanel.com/reference/delete-profile)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## FAQ

### Common Questions

**Q: What's the difference between Original ID Merge and Simplified ID Merge?**
A: Original ID Merge requires explicit merge events to link anonymous and identified users, while Simplified ID Merge automatically handles identity resolution using special properties. See the [Mixpanel documentation](https://help.mixpanel.com/hc/en-us/articles/14383975110292) for detailed differences.

**Q: Why are my alias events not working?**
A: Alias events are not supported when using Simplified ID Merge. Switch to Original ID Merge if you need alias functionality.

**Q: How do I enable Group Analytics?**
A: Configure Group Key Settings in the destination configuration. Group events will only be sent if at least one group key is specified.

**Q: What happens if I exceed the 255 property limit?**
A: The destination validates payload limits and will throw an error if the maximum number of properties (255) or array elements (255) is exceeded.

**Q: Can I replay data to Mixpanel?**
A: Yes, data replay is safe with RudderStack! RudderStack automatically generates `$insert_id` from `messageId` for all events, enabling Mixpanel's built-in deduplication. Duplicate events are automatically filtered out in reports and eventually removed from storage.

**Q: What happens if I hit Mixpanel's rate limits?**
A: Mixpanel returns HTTP 429 status codes when rate limits are exceeded. RudderStack automatically retries with exponential backoff. The 2GB/minute limit is quite generous for most use cases.

**Q: Why does RudderStack use smaller batch sizes for Groups API?**
A: RudderStack uses 200 groups per batch (vs Mixpanel's 2000 limit) as a conservative approach to reduce the likelihood of hitting rate limits and improve reliability for group operations.

**Q: How can I optimize for high-volume data sending?**
A: Use the Import API (server-side) with GZIP compression enabled. Ensure events are properly batched and avoid exceeding the 1MB payload limit per batch. RudderStack automatically handles `$insert_id` for deduplication.

**Q: How does event deduplication work?**
A: RudderStack automatically maps `messageId` to `$insert_id` for all events. Mixpanel deduplicates events based on four properties: event name, distinct_id, timestamp, and $insert_id. This provides automatic protection against duplicate events during data replay or network retries.
