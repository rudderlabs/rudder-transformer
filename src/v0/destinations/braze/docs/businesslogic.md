# Braze Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Braze destination integration. It covers how RudderStack events are mapped to Braze's API format, the specific API endpoints used for each event type, and the special handling for various event types.

## API Endpoints and Request Flow

### Identify Events

**Primary Endpoint**: `/users/track`
**Documentation**: [Braze User Track API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track/)

**Request Flow**:
1. If identity resolution conditions are met:
   ```javascript
   const integrationsObj = getIntegrationsObj(message, 'BRAZE');
   const isAliasPresent = isDefinedAndNotNull(integrationsObj?.alias);
   const brazeExternalID = getDestinationExternalID(message, 'brazeExternalId') || message.userId;

   if ((message.anonymousId || isAliasPresent) && brazeExternalID) {
     // Make identify call
   }
   ```
   - First, an intermediate call is made to `/users/identify` to merge the anonymous user with the identified user
   - Then, the user attributes are sent to `/users/track`
2. If only `userId` or `brazeExternalId` is present (without `anonymousId` or custom alias):
   - User attributes are sent directly to `/users/track` with `external_id` set
3. If only `anonymousId` is present (without `userId` or `brazeExternalId`):
   - An alias-only profile is created with `alias_label: "rudder_id"` and `alias_name: anonymousId`
   - User attributes are sent to `/users/track` with `user_alias` set
4. If custom alias is provided in the integrations object:
   - The custom alias is used instead of the default `rudder_id` alias
   ```javascript
   // Example of custom alias in integrations object
   {
     "integrations": {
       "braze": {
         "alias": {
           "alias_name": "custom-id-123",
           "alias_label": "custom_label"
         }
       }
     }
   }
   ```

**Transformations**:
1. User traits are mapped to Braze user attributes
2. If an anonymousId is present, it's set as a user alias with the label "rudder_id"
3. The userId is mapped to Braze's external_id
4. If brazeExternalId is specified in context.externalId, it's used instead of userId

### Track Events

**Primary Endpoint**: `/users/track`
**Documentation**: [Braze User Track API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track/)

**Request Flow**:
1. For regular track events:
   - Event data is sent to `/users/track` with the event in the `events` array
2. For "Order Completed" events:
   - Purchase data is extracted and sent to `/users/track` with the purchases in the `purchases` array

**Transformations**:
1. Event name is preserved as the Braze event name
2. Event properties are included as Braze event properties
3. Reserved properties are handled according to Braze specifications
4. If the event name is "Order Completed", it's treated as a purchase event

### Page/Screen Events

**Endpoint**: `/users/track`
**Documentation**: [Braze User Track API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track/)

**Request Flow**:
1. Page/Screen events are converted to custom events
2. The formatted event is sent to `/users/track` with the event in the `events` array

**Transformations**:
- Page events: Converted to "Viewed {category} {name} Page"
- Screen events: Converted to "Viewed {name} Screen"

### Group Events

**Primary Endpoint**: `/users/track`
**Documentation**: [Braze User Track API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track/)

**Secondary Endpoint (if subscription groups enabled)**: `/v2/subscription/status/set`
**Documentation**: [Braze Subscription Group API](https://www.braze.com/docs/api/endpoints/subscription_groups/post_update_user_subscription_group_status/)

**Request Flow**:
1. Group information is added as a user attribute with the format `ab_rudder_group_{groupId}: true`
2. This attribute is sent to `/users/track`
3. If subscription groups are enabled and email/phone is present:
   - A separate request is made to `/v2/subscription/status/set` to update subscription status

### Alias Events

**Endpoint**: `/users/merge`
**Documentation**: [Braze Users Merge API](https://www.braze.com/docs/api/endpoints/user_data/post_users_merge/)

**Request Flow**:
1. The alias event is transformed into a merge request
2. The request is sent to `/users/merge` to merge the previousId user into the userId user

**Payload Structure**:
```json
{
  "merge_updates": [
    {
      "identifier_to_merge": {
        "external_id": "previousId"
      },
      "identifier_to_keep": {
        "external_id": "userId"
      }
    }
  ]
}
```

## Special Handling

### Purchase Events

**Endpoint**: `/users/track`
**Documentation**: [Braze User Track API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track/)

Purchase events (Track events with name "Order Completed") receive special handling:

1. Products array is extracted from properties
2. Each product is converted to a Braze purchase object
3. Standard purchase properties (product_id, sku, price, quantity, currency) are mapped directly
4. Additional product properties are included in the purchase object
5. The purchases are sent to `/users/track` in the `purchases` array

**Example Payload**:
```json
{
  "purchases": [
    {
      "product_id": "prod456",
      "price": 89.99,
      "currency": "USD",
      "quantity": 1,
      "time": "2023-01-01T12:00:00.000Z",
      "external_id": "user123"
    }
  ],
  "attributes": [
    {
      "external_id": "user123",
      // Any user attributes from the event
    }
  ],
  "partner": "RudderStack"
}
```

### User Deletion

**Endpoint**: `/users/delete`
**Documentation**: [Braze User Delete API](https://www.braze.com/docs/api/endpoints/user_data/post_user_delete/)

When a user deletion request is received:

1. The request is processed through the RudderStack User Suppression API
2. User IDs are batched (up to 50 users per batch)
3. Each batch is sent to the `/users/delete` endpoint
4. The API key used must have the `users.delete` permission

**Example Payload**:
```json
{
  "external_ids": ["user123", "user456", "user789"]
}
```

### Deduplication Logic

**Endpoints Used**:
- `/users/export/ids` - To fetch current user profiles
- `/users/track` - To send deduplicated attributes

**Documentation**:
- [Braze User Export API](https://www.braze.com/docs/api/endpoints/export/user_data/post_users_identifier/)
- [Braze User Track API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track/)

When deduplication is enabled:

1. The transformer first calls `/users/export/ids` to fetch the current user profiles
2. It maintains a user store with previously sent attributes
3. For each user, attributes that have already been sent are removed from subsequent requests
4. If all attributes for a user have been sent before, the user is dropped from the request
5. Only changed attributes are sent to `/users/track`

**Request Flow**:
1. Fetch current user profiles: `POST /users/export/ids`
2. Compare incoming attributes with stored attributes
3. Send only changed attributes: `POST /users/track`

### Custom Attribute Operations

**Endpoint**: `/users/track`
**Documentation**: [Braze User Track API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track/)

The transformer supports various operations on custom attributes:

- **Remove**: Delete an attribute from a user profile
- **Update**: Update an existing attribute
- **Add**: Add a value to an array attribute
- **Create**: Create a new attribute

These operations are sent to the `/users/track` endpoint in the `attributes` array with the appropriate formatting for each operation type.

## Reserved Properties

**Endpoint**: `/users/track`
**Documentation**: [Braze User Track API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track/)

Certain properties are reserved by Braze and handled specially:

- **Non-billable attributes**: These attributes are always included in requests, even with deduplication enabled
  - country, language, email_subscribe, push_subscribe, subscription_groups
- **Purchase standard properties**: These properties have special handling in purchase events
  - product_id, sku, price, quantity, currency


## Multiplexing

The Braze destination can generate multiple API calls from a single input event in specific scenarios. This section clarifies which scenarios are considered true multiplexing versus those that use intermediary calls.

### Multiplexing Scenarios

1. **Identify Events with Identity Resolution Conditions**:
   
   Input: Identify event meeting specific conditions
   Conditions:
   ```javascript
   const integrationsObj = getIntegrationsObj(message, 'BRAZE');
   const isAliasPresent = isDefinedAndNotNull(integrationsObj?.alias);
   const brazeExternalID = getDestinationExternalID(message, 'brazeExternalId') || message.userId;

   if ((message.anonymousId || isAliasPresent) && brazeExternalID) {
     // Make identify call
   }
   ```
   Output:
   - API Call 1: POST /users/identify (merge anonymous and identified users)
   - API Call 2: POST /users/track (send user attributes)
   Multiplexing: NO (first call is intermediary)
   
   **Note**: This is not considered true multiplexing as the first call is an intermediary step for identity resolution before the main data delivery. The identify call is only made when either `anonymousId` or a custom alias is present AND either `userId` or `brazeExternalId` is present.

2. **Group Events with Subscription Groups Enabled**:
   ```
   Input: Group event with subscription group data
   Output:
   - API Call 1: POST /users/track (send group attributes)
   - API Call 2: POST /v2/subscription/status/set (update subscription status)
   Multiplexing: YES
   ```
   **Note**: This is true multiplexing as both calls deliver different aspects of the same event to Braze.

3. **Events with Deduplication Enabled**:
   ```
   Input: Any event with deduplication enabled
   Output:
   - API Call 1: POST /users/export/ids (fetch current user profiles)
   - API Call 2: POST /users/track (send deduplicated attributes)
   Multiplexing: NO (first call is intermediary)
   ```
   **Note**: This is not considered true multiplexing as the first call is only to fetch data for deduplication before the main data delivery.

4. **Track Events with Both User Attributes and Event Data**:
   ```
   Input: Track event with user attributes
   Output: Single API call to /users/track with multiple data types:
   {
     "attributes": [...],  // User profile updates
     "events": [...]       // Event data
   }
   Multiplexing: NO (single API call)
   ```
   **Note**: This is not multiplexing as it's a single API call, even though it updates multiple aspects of the user profile.

5. **Purchase Events (Order Completed)**:
   ```
   Input: Track event with name "Order Completed"
   Output: Single API call to /users/track with multiple data types:
   {
     "attributes": [...],  // User profile updates
     "purchases": [...]    // Purchase data
   }
   Multiplexing: NO (single API call)
   ```
   **Note**: This is not multiplexing as it's a single API call, even though it updates multiple aspects of the user profile.

## Mapping Configuration

The mapping configuration is defined in JSON files within the destination directory:

- `mapping.json`: Defines how RudderStack events map to Braze events
