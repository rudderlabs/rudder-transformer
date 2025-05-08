# Braze Destination

Implementation in **Javascript**

## Configuration

### Required Settings

- **REST API Key**: Required for authentication with Braze REST API

  - Must have appropriate permissions for the operations you want to perform
  - For user deletion, the API key must have the `users.delete` permission

- **Data Center**: Specifies the Braze data center to use

  - Format: `[REGION]-[NUMBER]` (e.g., `US-01`, `EU-01`)
  - Available data centers:
    - US: `US-01` through `US-08` (e.g., `US-01`, `US-02`, etc.)
    - EU: `EU-01` through `EU-02` (e.g., `EU-01`, `EU-02`)
    - Other regions: Consult Braze documentation for the latest available regions

- **App Key**: Required for SDK implementations (device mode)

### Optional Settings

- **Support Deduplication**: Enable to avoid sending duplicate user attributes
- **Prefix Properties**: Add a prefix to all properties sent to Braze
- **Enable Nested Array Operations**: Enable operations on nested arrays
- **Enable Nested Object Operations**: Enable operations on nested objects
- **Track Anonymous User**: Enable tracking of users without a userId
- **Enable Subscription Group in Group Call**: Enable subscription group functionality in group calls

## Integration Functionalities

### Supported Message Types

- Identify
- Track
- Page
- Screen
- Group
- Alias

### Batching Support

- **Supported**: Yes
- **Message Types**: All message types
- **Batch Limits**:
  - Track events (includes Page and Screen events): 75 events per batch
  - Identify events: 50 events per batch
  - Alias events: 50 events per batch
  - Subscription events: 25 events per batch
  - User deletion: 50 users per batch

### Intermediate Calls

- **Supported**: Yes
- **Use Case**: Identity resolution through the Braze Identify API
- **Endpoint**: `/users/identify`
- This functionality merges anonymous users (with anonymousId) with identified users (with userId/external_id)

```Javascript
// The condition that leads to intermediate identify call:
const brazeExternalID = getDestinationExternalID(message, 'brazeExternalId') || message.userId;
if ((message.anonymousId || isAliasPresent) && brazeExternalID) {
  await processIdentify({ message, destination });
} else {
  collectStatsForAliasMissConfigurations(destination.ID);
}
```

### Merging Behavior

- **User Identity Resolution**:

  - RudderStack uses Braze's `/users/identify` endpoint when processing Identify events with both userId and anonymousId
  - This merges alias-only users with identified users (those with external_id)
  - By default, Braze merges specific fields from the anonymous user to the identified user
  - Fields merged include: basic user attributes, custom attributes, event data, purchase data, session data, and message history

- **Alias Handling**:

  - For Alias events, RudderStack uses Braze's alias merging functionality
  - Users can only have one alias for a specific label
  - If a user already exists with the same external_id and has an existing alias with the same label, profiles will not be combined

- **Considerations**:
  - Merging is handled automatically for Identify events when both userId and anonymousId are present
  - For more complex merging scenarios, consider using Braze's `/users/merge` endpoint directly
  - When merging users, be aware that some data might not be merged if the merge_behavior is set to "none"

### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/braze/networkHandler.js`
- Handles both v0 and v1 proxy requests

### User Deletion

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/braze/deleteUsers.js`
- Implements the Braze User Delete API to comply with privacy regulations

### Additional Functionalities

#### Deduplication

- **Supported**: Yes
- **Configuration**: Enable via `supportDedup` setting
- **How It Works**:

  - When enabled, RudderStack maintains a user store with previously sent attributes
  - For each user, attributes that have already been sent are removed from subsequent requests
  - If all attributes for a user have been sent before, the user is dropped from the request
  - The deduplication process uses Braze's `/users/export/ids` endpoint to fetch current user profiles
  - RudderStack then compares incoming attributes with what's already in Braze

- **Important Limitations**:

  - This is a RudderStack-specific feature, not a Braze feature. Braze itself does not deduplicate events
  - Deduplication only affects user attributes, not events or purchases
  - Events and purchases will always be sent to Braze, even if they appear to be duplicates
  - This can lead to duplicate events during data replay scenarios

- **Use Cases**:

  - Reducing data point consumption in Braze by preventing redundant attribute updates
  - Preventing duplicate user profiles during data replay of Identify events
  - Optimizing API usage by only sending changed attributes

- **Implementation Details**:
  - For Track events with user attributes, those attributes are deduplicated
  - For Identify events, if all attributes have been sent before, the user is dropped from the request
  - The deduplication logic is implemented in the `BrazeDedupUtility` class and `processDeduplication` function

#### User Attributes

- Supports comprehensive user profile management

#### Event Tracking

- Supports custom event tracking with properties

#### Purchase Event

- Special handling for purchase/e-commerce events
- Standard properties: product_id, sku, price, quantity, currency

#### Nested Array Operations

- Supports operations on nested arrays in user attributes

#### Nested Object Operations

- Supports operations on nested objects in user attributes

#### Reserved Properties Handling

- Handles reserved properties according to Braze specifications

#### Custom Attribute Operations

- Supports various operations on custom attributes:
  - Remove
  - Update
  - Add
  - Create

## General Queries

### Event Ordering

- **Required**: No specific ordering requirements documented
- Braze processes events based on the timestamp provided

### Data Replay Feasibility

#### Missing Data Replay

- **Feasible**: Yes, for initial data loading
- Braze explicitly supports importing legacy user data through the `/users/track` endpoint
- Events are processed based on the provided timestamp
- According to Braze documentation: "You may submit data through the Braze API for a user who has not yet used your mobile app to generate a user profile. If the user subsequently uses the application all information following their identification using the SDK will be merged with the existing user profile you created using the API call."

#### Already Delivered Data Replay

- **Partially Feasible**: Depends on the message type and configuration
- **Identify Events**:

  - With RudderStack deduplication enabled, duplicate user attributes will be filtered out, preventing duplicate profiles
  - However, this doesn't leverage Braze's merge functionality, which requires explicit calls to `/users/identify` or `/users/merge` endpoints
  - For proper identity resolution during replay, consider implementing custom logic to call these endpoints

- **Track/Page/Screen Events**:

  - **Not Recommended**: Braze treats each event as unique, even if it appears to be a duplicate
  - According to Braze: "Each event object in the events array represents a single occurrence of a custom event by a user at a designated time. This means each event ingested into Braze has its own event ID, so 'duplicate' events are treated as separate, unique events."
  - Replaying these events will create duplicates in Braze, potentially skewing analytics and triggering campaigns multiple times

- **Purchase Events**:

  - **Not Recommended**: Similar to track events, purchase events will be duplicated in Braze
  - This could result in incorrect revenue calculations and purchase counts

- **Configuration Considerations**:
  - For user attribute updates only, enable RudderStack deduplication (`supportDedup` setting)
  - For complete data replay including events, be aware that this will create duplicate events in Braze
  - There is no native way to prevent event duplication in Braze during replay

## Version Information

### Current Version

- Current implementation is in v0 (JavaScript)
- Uses Braze REST API endpoints for data delivery
- Supports both synchronous and asynchronous operations
- No documented end-of-life date for this implementation

### New Version Availability

- No newer version documented at this time
- Braze regularly updates their REST API, but the core endpoints used by this integration remain stable

## Documentation Links

### REST API Documentation

- [Braze REST API Overview](https://www.braze.com/docs/api/basics/)
- [User Track API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track/)
- [User Identify API](https://www.braze.com/docs/api/endpoints/user_data/post_user_identify/)
- [User Delete API](https://www.braze.com/docs/api/endpoints/user_data/post_user_delete/)
- [Subscription Group API](https://www.braze.com/docs/api/endpoints/subscription_groups/)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
