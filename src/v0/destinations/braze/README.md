# Braze Destination

Implementation in **Javascript**

## Configuration

### Required Settings

- **REST API Key**: Required for authentication with Braze REST API

  - Must have appropriate permissions for the operations you want to perform
  - For user deletion, the API key must have the `users.delete` permission

- **Data Center**: Specifies the Braze data center to use

  - Format: `[REGION]-[NUMBER]` (e.g., `US-01`, `EU-01`, `AU-01`)
  - Available data centers:
    - US: `US-01` through `US-08` (e.g., `US-01`, `US-02`, etc.)
    - EU: `EU-01` through `EU-03` (e.g., `EU-01`, `EU-02`)
    - AU: `AU-01`

- **App Key**: Required for SDK implementations (device mode)

### Optional Settings

- **Support Deduplication**: Enable to avoid sending duplicate user attributes
- **Enable Nested Array Operations**: Enable operations on nested arrays
- **Track Anonymous User**: Enable tracking of users without a userId
- **Enable Subscription Group in Group Call**: Enable subscription group functionality in group calls

## Integration Functionalities

> Braze supports **Device mode** and  **Hybrid mode**

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
  - Alias events: 50 events per batch
  - Subscription events: 25 events per batch
  - User deletion: 50 users per batch

### Rate Limits

The Braze API enforces rate limits to ensure system stability. Here are the rate limits for the endpoints used by this destination:

| Endpoint | Event Types | Rate Limit | Batch Limits | Description |
|----------|-------------|------------|--------------|-------------|
| `/users/track` | Identify, Track, Page, Screen, Group | 3,000 requests per 3 seconds | 75 events, 75 purchases, 75 attributes per request | Used for sending track events, user attributes, and purchases |
| `/users/identify` | Identify (with both userId and anonymousId) | 20,000 requests per minute | - | Used for identity resolution (merging anonymous and identified users) |
| `/users/delete` | User Deletion (via Suppression API) | 20,000 requests per minute | 50 users per batch | Used for user deletion |
| `/users/export/ids` | Any event when deduplication is enabled | 2,500 requests per minute* | - | Used for fetching user profiles (for deduplication) |
| `/users/merge` | Alias | 20,000 requests per minute | - | Used for merging user profiles |
| `/subscription/status/set` | Group (with subscription groups enabled) | 5,000 requests per minute | - | Used for updating subscription group status |

*Note: For accounts created after August 22, 2024, the rate limit for `/users/export/ids` is 250 requests per minute.

#### Monitoring Rate Limits

Every API response from Braze includes the following headers:
- `X-RateLimit-Limit`: Maximum number of requests allowed in the current time window
- `X-RateLimit-Remaining`: Number of requests remaining in the current time window
- `X-RateLimit-Reset`: Time at which the current rate limit window resets (UTC epoch seconds)

#### Handling Rate Limit Errors

If you exceed rate limits, Braze will return a `429 Too Many Requests` status code. The destination implements exponential backoff retry logic to handle these errors.

[Docs Reference](https://braze.com/docs/api/api_limits/#rate-limits-by-request-type)


### Intermediate Calls

#### Identify Flow (with alias or anonymousId)
- **Supported**: Yes
- **Use Case**: Identity resolution through the Braze Identify API
- **Endpoint**: `/users/identify`
- This functionality merges anonymous users (with anonymousId or alias object) with identified users (with userId/external_id -> brazeExternalId)

```Javascript
// The condition that leads to intermediate identify call:
const brazeExternalID = getDestinationExternalID(message, 'brazeExternalId') || message.userId;
if ((message.anonymousId || isAliasPresent) && brazeExternalID) {
  await processIdentify({ message, destination });
} else {
  collectStatsForAliasMissConfigurations(destination.ID);
}
```

> No intermediate calls are made for Track, Page, Screen, Group, and Alias events

### Anonymous User Profiles

- **Alias-Only User Creation**:
  - When only an anonymous Identify or Track call is made (with anonymousId but no userId), RudderStack creates an alias-only profile in Braze
  - The alias is created with:
    - `alias_label`: "rudder_id"
    - `alias_name`: The anonymousId value from the event
  - This allows for tracking anonymous users before they are identified

```Javascript
// Corresponding code
function setAliasObject(payload, message) {
  const integrationsObj = getIntegrationsObj(message, 'BRAZE');
  if (
    isDefinedAndNotNull(integrationsObj?.alias?.alias_name) &&
    isDefinedAndNotNull(integrationsObj?.alias?.alias_label)
  ) {
    const { alias_name, alias_label } = integrationsObj.alias;
    payload.user_alias = {
      alias_name,
      alias_label,
    };
  } else if (message.anonymousId) {
    payload.user_alias = {
      alias_name: message.anonymousId,
      alias_label: 'rudder_id',
    };
  }
  return payload;
}
```

- **External ID Assignment**:
  - If a RudderStack external_id or userId is present in subsequent events, it is added as the Braze external_id
  - This enables proper identity resolution when the user is later identified

### User Identity Resolution Behavior

- **User Identity Resolution**:

  - RudderStack uses Braze's `/users/identify` endpoint when processing Identify events with both userId and anonymousId
  - This merges alias-only users with identified users (those with external_id)
  - By default, Braze merges specific fields from the anonymous user to the identified user
  - Fields merged include: basic user attributes, custom attributes, event data, purchase data, session data, and message history

- **Alias Handling**:

  - For Alias events, RudderStack uses Braze's alias merging functionality
  - Users can only have one alias for a specific label
  - If a user already exists with the same external_id and has an existing alias with the same label, profiles will not be combined


### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/braze/networkHandler.js`

### User Deletion

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/braze/deleteUsers.js`
- Implements the Braze User Delete API to comply with privacy regulations

### Additional Functionalities

#### Deduplication

- **Supported**: Yes
- **Configuration**: Enable via `supportDedup` setting in destination config
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

#### Identify, Alias, Group
These event types require strict event ordering as they are used for identity resolution. One might end up with older attributes overwriting new attributes, leading to incorrect user profiles.

#### Track, Page, Screen (Braze supports updation of user attributes along with track events)

Braze's events object have a mandatory `time` field. RudderStack populates this field with the event's timestamp.
This means that Braze will process events in the order based on their timestamp.

Despite this time-based ordering, the issue here is, the user attributes can end up out of order similar to identify based calls mentioned above.

> Effectively, Braze requires strict event ordering for all event types.

### Data Replay Feasibility

#### Missing Data Replay

- **Not Feasible**:
Based on **Event Ordering** section above, it is not feasible to replay missing data of any event type.

#### Already Delivered Data Replay

- **Not Feasible**

- **Track/Page/Screen Events**:

  - **Not Recommended**: Braze treats each event as unique, even if it appears to be a duplicate
  - According to Braze: "Each event object in the events array represents a single occurrence of a custom event by a user at a designated time. This means each event ingested into Braze has its own event ID, so 'duplicate' events are treated as separate, unique events."
  - Replaying these events will create duplicates in Braze, potentially skewing analytics and triggering campaigns multiple times

- **Purchase Events**:

  - **Not Recommended**: Similar to track events, purchase events will be duplicated in Braze
  - This could result in incorrect revenue calculations and purchase counts

### Multiplexing

- **Supported**: Yes
- **Description**: The Braze destination can generate multiple API calls from a single input event in specific scenarios.

#### Multiplexing Scenarios

1. **Identify Events with Identity Resolution Conditions**:
   - **Multiplexing**: NO
   - **Conditions for Identity Resolution**:
     ```javascript
     const integrationsObj = getIntegrationsObj(message, 'BRAZE');
     const isAliasPresent = isDefinedAndNotNull(integrationsObj?.alias);
     const brazeExternalID = getDestinationExternalID(message, 'brazeExternalId') || message.userId;

     if ((message.anonymousId || isAliasPresent) && brazeExternalID) {
       await processIdentify({ message, destination });
     }
     ```
   - First API Call: `/users/identify` - To merge the anonymous user with the identified user (intermediary call)
   - Second API Call: `/users/track` - To send user attributes (primary call)
   - **Note**: This is not considered true multiplexing as the first call is an intermediary step for identity resolution before the main data delivery. The identify call is only made when specific conditions are met.

2. **Group Events with Subscription Groups Enabled**:
   - **Multiplexing**: YES
   - First API Call: `/users/track` - To send group attributes
   - Second API Call: `/v2/subscription/status/set` - To update subscription status
   - **Note**: This is true multiplexing as both calls deliver different aspects of the same event to Braze.

3. **Events with Deduplication Enabled**:
   - **Multiplexing**: NO
   - First API Call: `/users/export/ids` - To fetch current user profiles (intermediary call)
   - Second API Call: `/users/track` - To send deduplicated attributes (primary call)
   - **Note**: This is not considered true multiplexing as the first call is only to fetch data for deduplication before the main data delivery.

4. **Track Events with Both User Attributes and Event Data**:
   - **Multiplexing**: NO
   - Single API Call to `/users/track` with multiple data types in the payload:
     - `attributes` array - For user profile updates
     - `events` array - For event tracking
   - **Note**: This is not multiplexing as it's a single API call, even though it updates multiple aspects of the user profile.

5. **Purchase Events (Order Completed)**:
   - **Multiplexing**: NO
   - Single API Call to `/users/track` with multiple data types in the payload:
     - `attributes` array - For user profile updates
     - `purchases` array - For purchase tracking
   - **Note**: This is not multiplexing as it's a single API call, even though it updates multiple aspects of the user profile.


## Version Information

### Current Version

Braze doesn't have any versioned releases of thier APIs.

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
