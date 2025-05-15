# Mixpanel Destination

Implementation in **Javascript**

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
- **Group Key Settings**: Configure group analytics settings
- **API Secret**: Required for using the Import API (for server-side implementations)
- **GDPR API Token**: Required for user deletion via the GDPR API

## Integration Functionalities

> Mixpanel supports **Device mode** and **Cloud mode**

### Supported Message Types

- Identify
- Track
- Page
- Screen
- Group
- Alias (only with Original ID Merge)

### Batching Support

- **Supported**: Yes
- **Message Types**: All message types
- **Batch Limits**:
  - Import API: 2000 events per batch
  - Engage API (People profiles): 2000 profiles per batch
  - Groups API: 200 groups per batch
  - User deletion: 1000 users per batch (profile deletion) or 1999 users per batch (GDPR deletion task)

### Rate Limits

Mixpanel enforces rate limits to ensure system stability. Here are the rate limits for the endpoints used by this destination:

| Endpoint | Event Types | Rate Limit | Batch Limits | Description |
|----------|-------------|------------|--------------|-------------|
| `/import` | All event types | 2GB of uncompressed JSON/minute or ~30k events per second | 2000 events per batch, 10MB max | Used for server-side event tracking |
| `/track` | All event types | Same as `/import` | 2000 events per batch | Used for client-side event tracking |
| `/engage` | Identify | 1000 events per second | 2000 profiles per batch | Used for updating user profiles |
| `/groups` | Group | Not specified | 200 groups per batch | Used for updating group profiles |

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

## General Queries

### Event Ordering

#### Identify, Alias
These event types require strict event ordering as they are used for identity resolution. Out-of-order events could lead to incorrect user profiles.

#### Track, Page, Screen
Mixpanel events include a timestamp, which allows for proper ordering of events regardless of when they are received. However, if events update user profiles, ordering becomes important to avoid overwriting newer attributes with older ones.

### Data Replay Feasibility

#### Missing Data Replay

- **Identify Events**: Not recommended. Replaying identify events could create duplicate profiles or overwrite newer attributes with older ones.
- **Track Events**: Feasible with caution. Mixpanel will process events based on their timestamp, but duplicate events could occur if not properly deduplicated.

#### Already Delivered Data Replay

- **Not Recommended**: Mixpanel treats each event as unique, even if it appears to be a duplicate. Replaying events will create duplicates in Mixpanel, potentially skewing analytics.
- **Exception**: If using the Import API with proper `$insert_id` values for deduplication, replay is safer.

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

### Current Version

Mixpanel API is versioned by endpoint rather than having global API versions. The implementation uses the current stable endpoints.

## Documentation Links

### API Documentation

- [Mixpanel API Overview](https://developer.mixpanel.com/reference/overview)
- [Import API](https://developer.mixpanel.com/reference/import-events)
- [Track API](https://developer.mixpanel.com/reference/track-event)
- [Engage API](https://developer.mixpanel.com/reference/profile-set)
- [Groups API](https://developer.mixpanel.com/reference/group-set-property)
- [Identity Merge](https://developer.mixpanel.com/reference/identity-merge)
- [User Deletion](https://developer.mixpanel.com/reference/delete-profile)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
