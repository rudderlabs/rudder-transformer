# Mixpanel Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Mixpanel destination integration. It covers how RudderStack events are mapped to Mixpanel's API format, the specific API endpoints used for each event type, and the special handling for various event types.

## API Endpoints and Request Flow

### Identify Events

**Primary Endpoint**: `/engage`
**Secondary Endpoint (for identity resolution)**: `/import` with `$merge` event
**Documentation**: [Mixpanel Engage API](https://developer.mixpanel.com/reference/profile-set)

**Request Flow**:
1. If identity resolution conditions are met (both userId and anonymousId present and Original ID Merge enabled):
   ```javascript
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
   - First, a `$merge` event is sent to `/import` to merge the anonymous user with the identified user
   - Then, the user attributes are sent to `/engage`

2. If only `userId` is present:
   - User attributes are sent directly to `/engage` with `$distinct_id` set to userId

3. If only `anonymousId` is present:
   - User attributes are sent to `/engage` with `$distinct_id` set to anonymousId

**Transformations**:
1. User traits are mapped to Mixpanel user attributes
2. The userId or anonymousId is mapped to Mixpanel's `$distinct_id`
3. If using Simplified ID Merge, special properties are set:
   ```javascript
   properties = {
     ...properties,
     distinct_id: message.userId || `$device:${message.anonymousId}`,
     $device_id: message.anonymousId,
     $user_id: message.userId,
   };
   ```

### Track Events

**Primary Endpoint**: `/track` or `/import`
**Documentation**: [Mixpanel Track API](https://developer.mixpanel.com/reference/track-event) or [Mixpanel Import API](https://developer.mixpanel.com/reference/import-events)

**Request Flow**:
1. Event data is formatted according to Mixpanel's requirements
2. The event is sent to `/track` (client-side) or `/import` (server-side)
3. If People is enabled, user attributes may also be sent to `/engage`

**Transformations**:
1. Event name is preserved as the Mixpanel event name
2. Event properties are included as Mixpanel event properties
3. User traits may be included in the event properties based on configuration
4. The userId or anonymousId is set as `distinct_id`
5. Timestamp is converted to Unix timestamp in milliseconds
6. UTM parameters are extracted from context.campaign and added to properties
7. Browser information is added for web events

```javascript
let properties = {
  ...message.properties,
  ...traits,
  ...mappedProperties,
  token: destination.Config.token,
  distinct_id: message.userId || message.anonymousId,
  time: unixTimestamp,
  ...buildUtmParams(message.context?.campaign),
};

if (message.channel === 'web' && message.context?.userAgent) {
  const browser = getBrowserInfo(message.context.userAgent);
  properties.$browser = browser.name;
  properties.$browser_version = browser.version;
}
```

### Page/Screen Events

**Endpoint**: `/track` or `/import`
**Documentation**: [Mixpanel Track API](https://developer.mixpanel.com/reference/track-event) or [Mixpanel Import API](https://developer.mixpanel.com/reference/import-events)

**Request Flow**:
1. Page/Screen events are converted to custom events
2. The formatted event is sent to `/track` or `/import`

**Transformations**:
- Page events: Converted to "Loaded a Page" or a custom name based on configuration
- Screen events: Converted to "Loaded a Screen" or a custom name based on configuration

```javascript
let eventName;
if (type === 'page') {
  eventName = useUserDefinedPageEventName
    ? generatePageOrScreenCustomEventName(message, userDefinedPageEventTemplate)
    : 'Loaded a Page';
} else {
  eventName = useUserDefinedScreenEventName
    ? generatePageOrScreenCustomEventName(message, userDefinedScreenEventTemplate)
    : 'Loaded a Screen';
}
```

### Group Events

**Primary Endpoint**: `/groups`
**Documentation**: [Mixpanel Groups API](https://developer.mixpanel.com/reference/group-set-property)

**Request Flow**:
1. Group information is formatted according to Mixpanel's requirements
2. The group data is sent to `/groups`

**Transformations**:
1. Group traits are mapped to Mixpanel group properties
2. The groupId is set as the group identifier

### Alias Events

**Endpoint**: `/import` with `$merge` event
**Documentation**: [Mixpanel Identity Merge API](https://developer.mixpanel.com/reference/identity-merge)

**Request Flow**:
1. The alias event is transformed into a merge request
2. The request is sent to `/import` with a `$merge` event

**Payload Structure**:
```json
{
  "event": "$merge",
  "properties": {
    "$distinct_ids": ["previousId", "userId"],
    "token": "your_token"
  }
}
```

**Note**: Alias events are not supported when using Simplified ID Merge.

## Special Handling

### Identity Resolution

Mixpanel offers two identity resolution systems:

1. **Original ID Merge**:
   - Uses the `$merge` event to combine user profiles
   - Requires both userId and anonymousId
   - Implemented via the `/import` endpoint

2. **Simplified ID Merge**:
   - Uses Mixpanel's newer identity resolution system
   - Sets special properties on events:
     - `distinct_id`: userId or `$device:${anonymousId}`
     - `$device_id`: anonymousId
     - `$user_id`: userId

### User Deletion

**Endpoints**:
- `/engage` with `$delete` operation
- GDPR API for deletion tasks

When a user deletion request is received:

1. The request is processed through one of two methods:
   - Profile deletion via Engage API
   - GDPR deletion task creation

2. User IDs are batched (up to 1000 users per batch for profile deletion or 1999 for GDPR deletion)

3. Each batch is sent to the appropriate endpoint

**Example Payload for Profile Deletion**:
```json
{
  "$token": "your_token",
  "$distinct_id": "user123",
  "$delete": null,
  "$ignore_alias": true
}
```

### Property Validation

Mixpanel imposes limits on properties:
- Maximum of 255 property keys per event
- Maximum of 255 elements in arrays
- Maximum payload size of 1MB

The implementation includes validation to ensure these limits are not exceeded:

```javascript
// Property limits
// ref: https://developer.mixpanel.com/reference/track-event
const MAX_PROPERTY_KEYS_COUNT = 255;
const MAX_ARRAY_ELEMENTS_COUNT = 255;
const MAX_PAYLOAD_SIZE_BYTES = 1024 * 1024; // 1MB
```

## Multiplexing

The Mixpanel destination can generate multiple API calls from a single input event in specific scenarios:

### Multiplexing Scenarios

1. **Identify Events with Identity Merge**:
   - Input: Identify event with both userId and anonymousId
   - Output:
     - API Call 1: POST `/import` with `$merge` event
     - API Call 2: POST `/engage` with user attributes
   - Multiplexing: YES

2. **Track Events with People Updates**:
   - Input: Track event with People enabled
   - Output:
     - API Call 1: POST `/track` or `/import` with event data
     - API Call 2: POST `/engage` with user attributes
   - Multiplexing: YES

3. **Group Events**:
   - Input: Group event
   - Output:
     - API Call 1: POST `/track` or `/import` with event data
     - API Call 2: POST `/groups` with group attributes
   - Multiplexing: YES

## Mapping Configuration

The mapping configuration is defined in JSON files within the destination directory:

- `MPIdentifyConfig.json`: Defines how RudderStack identify events map to Mixpanel
- `MPSetOnceConfig.json`: Defines properties that should only be set once
- `MPProfilePropertiesAndroid.json`: Android-specific profile properties
- `MPProfilePropertiesIOS.json`: iOS-specific profile properties
- `MPEventPropertiesConfig.json`: Event property mappings
