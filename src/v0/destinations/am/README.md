# Amplitude Destination

Implementation in **Javascript** (NOT a CDK v2 implementation)

## Overview

Amplitude is a product analytics platform that helps companies understand user behavior, ship the right features, and improve business outcomes. The RudderStack Amplitude integration sends event data to Amplitude for analysis, allowing you to track user actions, identify users, and analyze user behavior patterns.

## Version Information

- **Current Version of Amplitude API used in integration**: HTTP API v2

## Configuration

### Required Settings

- **API Key**: Required for authentication with Amplitude API

  - Must be provided to send events to Amplitude
  - Can be found in your Amplitude project settings under the General tab

- **Data Center**: Specifies the Amplitude data center to use
  - Options: `standard` (US) or `EU`
  - Determines which Amplitude endpoint your data will be sent to

### Optional Settings

- **Secret Key**: Required for user deletion functionality

  - Can be found in your Amplitude project settings under the General tab
  - Used for authentication when sending user deletion requests
  - Required for compliance with privacy regulations (GDPR, CCPA)

- **Group Type Trait**: Specifies the trait to use as the group type

  - Used for group analytics in Amplitude

- **Group Value Trait**: Specifies the trait to use as the group value

  - Used for group analytics in Amplitude

- **User Property Operations**: Configure special operations for user properties

  - **Traits to Increment**: Properties that should be incremented rather than set
  - **Traits to Set Once**: Properties that should only be set if they don't exist
  - **Traits to Append**: Properties where values should be appended to arrays
  - **Traits to Prepend**: Properties where values should be prepended to arrays

- **Page/Screen Tracking Options**:

  - **Track All Pages**: Send all page views to Amplitude
  - **Track Categorized Pages**: Send page views with categories to Amplitude
  - **Track Named Pages**: Send page views with names to Amplitude
  - **Custom Page Event Name**: Define a custom event name for page events
  - **Custom Screen Event Name**: Define a custom event name for screen events

- **E-commerce Options**:

  - **Track Products Once**: Send each product in an order as a single event
  - **Track Revenue Per Product**: Track revenue for each product separately

- **Device ID Options**:

  - **Prefer Anonymous ID for Device ID**: Use anonymousId as the device_id
  - **Use Advertising ID for Device ID**: Use advertising ID as the device_id (Android)
  - **Use IDFA as Device ID**: Use IDFA as the device_id (iOS)

- **Event Filtering**:

  - **Blacklisted Events**: Events that should not be sent to Amplitude
  - **Whitelisted Events**: Only these events will be sent to Amplitude

- **Enhanced User Operations**: Enable advanced user property operations

  - Supports operations like $set, $setOnce, $add, $append, $prepend, $unset

- **Map Device Brand**: Include device brand information in events
  - When enabled, device brand information is included in events

## Integration Functionalities

> Amplitude supports **Device mode** and **Cloud mode**

### Supported Message Types

- **Identify**: Yes - Maps to Amplitude identify API with event_type: `$identify`
- **Track**: Yes - Maps to Amplitude event tracking API
- **Page**: Yes - Converted to track events with configurable naming
- **Screen**: Yes - Converted to track events with configurable naming
- **Group**: Yes - Sets group properties and updates user properties
- **Alias**: Yes - Maps to Amplitude's user mapping functionality

#### Message Type and Connection Modes from `db-config.json`

```json
  "supportedMessageTypes": {
      "cloud": ["alias", "group", "identify", "page", "screen", "track"],
      "device": {
        "web": ["identify", "track", "page", "group"],
        "android": ["identify", "track", "screen"],
        "ios": ["identify", "track", "screen"],
        "reactnative": ["identify", "track", "screen"],
        "flutter": ["identify", "track", "screen"]
      }
    },
    "supportedConnectionModes": {
      "web": ["cloud", "device"],
      "android": ["cloud", "device"],
      "ios": ["cloud", "device"],
      "flutter": ["cloud", "device"],
      "reactnative": ["cloud", "device"],
      "unity": ["cloud"],
      "amp": ["cloud"],
      "cordova": ["cloud"],
      "shopify": ["cloud"],
      "cloud": ["cloud"],
      "warehouse": ["cloud"]
    }
```

### Rate Limits

Amplitude enforces rate limits to ensure system stability:

| Endpoint                 | Rate Limit                                                   | Payload & Batch Size Limits                                                                    | Description                  |
| ------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------- |
| `/2/httpapi`             | 30 events/second per user/device                             | 1 MB per request                                                                               | Main event tracking endpoint |
| `/batch`                 | 1000 events/second per user/device && 500,000 events per day | 20 MB per request, 2000 events per batch                                                       | Batch event upload endpoint  |
| `/api/2/deletions/users` | 1 request/second                                             | 100 users per batch, 8 parallel requests per project                                           | User deletion endpoint       |
| `/groupidentify`         | No official documentation found                              | 1 MB per request & group identifies per request is 1024 & group properties per request is 1024 | Group identify endpoint      |

### Batching Support

- **Supported**: Yes
- **Message Types**: All message types
- **Batch Limits**:
  - Maximum batch size: 20 MB
  - Maximum events per batch: 500
  - Events exceeding these limits are sent in multiple batches
- **Batch Endpoint**: Uses `/batch` endpoint for improved performance
- **Batching Logic**: Events are automatically batched when possible to optimize API usage

### Intermediate Calls

The Amplitude destination does not make any intermediate API calls. All events are processed and sent directly to the appropriate Amplitude endpoint.

### Proxy Delivery

- **Supported**: No - _This is not yet enabled & still in testing phase_
- **Source Code Path**: `src/v0/destinations/am/networkHandler.js`
- **Implementation**: Custom network handler with error handling and retry logic
- **Features**:
  - Handles rate limiting (429 errors) by throwing ThrottledError
  - Does not require complex throttled user/device processing since event ordering is not guaranteed for Amplitude
  - Supports both retryable and non-retryable error handling

### User Deletion

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/am/deleteUsers.js`
- **Endpoint**: `/api/2/deletions/users`
- **Authentication**: Requires both API Key and Secret Key (Basic Auth)
- **Batch Size**: Up to 100 users per batch
- **Rate Limit**: 1 request per second, up to 8 parallel requests per project
- **Implementation**:
  - Users are deleted based on their user_id
  - Batches are processed in parallel
  - Supports both US and EU data centers
  - Includes `requester: "RudderStack"` and `ignore_invalid_id: "true"` in requests

### OAuth Support

- **Supported**: No
- The Amplitude destination uses API key authentication, not OAuth.

### Additional Functionalities

#### Enhanced User Property Operations

- **Supported**: Yes
- **Configuration**: Enable via `enableEnhancedUserOperations` setting
- **How It Works**:
  - When enabled, user properties are processed with operations like $set, $setOnce, $add, etc.
  - Properties specified in traitsToIncrement are added to $add operation
  - Properties specified in traitsToSetOnce are added to $setOnce operation
  - Properties specified in traitsToAppend are added to $append operation
  - Properties specified in traitsToPrepend are added to $prepend operation
  - Properties specified in integrations.Amplitude.fieldsToUnset are added to $unset operation

#### Skip User Properties Sync

- **Supported**: Yes
- **How It Works**:
  - When `integrations.Amplitude.skipUserPropertiesSync` is set to true, the `$skip_user_properties_sync` flag is added to the payload
  - This prevents Amplitude from syncing user properties across projects

#### Device and OS Information

- **Supported**: Yes
- **How It Works**:
  - For web events, device and OS information is extracted from the user agent
  - For mobile events, device and OS information is extracted from the context
  - This information is included in the event payload

#### Revenue Tracking

- **Supported**: Yes
- **How It Works**:
  - Track events with revenue properties receive special handling
  - Revenue amount, price, quantity, and product information are extracted
  - Supports both single revenue events and per-product revenue tracking
  - Revenue properties are moved to root level and removed from event_properties

#### E-commerce Event Multiplexing

- **Supported**: Yes
- **Configuration**: Controlled by `trackProductsOnce` and `trackRevenuePerProduct` settings
- **How It Works**:
  - When `trackProductsOnce` is enabled, each product in an order generates a separate "Product Purchased" event
  - Original order event is preserved alongside individual product events
  - Supports revenue tracking per product when `trackRevenuePerProduct` is enabled

### Validations

- **User ID or Device ID Required**: Either user_id or device_id must be specified for all events
- **Event Type Required**: Event type is required for all events
- **API Key Required**: API key must be provided in the destination configuration
- **User ID Length**: User IDs must be at least 5 characters (configurable via min_id_length option)
- **Device ID Length**: Device IDs must be at least 5 characters (configurable via min_id_length option)

## General Queries

### Event Ordering

#### Identify, Group, Alias

These event types update user profiles in Amplitude. While Amplitude doesn't explicitly require strict event ordering, sending events out of order could result in older attributes overwriting newer ones.

#### Track, Page, Screen

Amplitude events include a timestamp field, which is populated with the event's timestamp. Amplitude processes events based on this timestamp, not the order in which they are received.

> **Note**: We have disabled event ordering for Amplitude by setting the guaranteeUserEventOrder flag to false on the server.
>
> When event ordering is enabled, the server attempts to preserve the order of events. In such cases, if a 429 (Too Many Requests) error occurs, the server throttles further events until all queued events (from the beginning) are successfully processed.
>
> Previously, a 429 at the userId/deviceId level caused throttling across the entire destination. To mitigate this, we temporarily updated the 429 response to a 500.
>
> However, since event ordering is now disabled, we can safely return 429 as is—it will no longer cause throttling for the entire destination.

### Data Replay Feasibility

#### Missing Data Replay

- **Identify Events**:

  - **Feasible with Caution**: Replaying missing identify events is feasible but could overwrite newer user attributes with older ones if not handled carefully.

- **Track/Page/Screen Events**:
  - **Feasible**: Amplitude processes events based on their timestamp, so replaying missing events will place them in the correct chronological order.
  - **Note**: Each event is treated as a unique occurrence, so replaying will create new events in Amplitude.

#### Already Delivered Data Replay

- **Not Recommended for Any Event Type**:
  - Amplitude treats each event as unique, even if it appears to be a duplicate
  - Replaying already delivered events will create duplicates in Amplitude
  - This could skew analytics and trigger campaigns multiple times
  - There is no built-in deduplication mechanism in Amplitude

### Multiplexing

- **Track Events with Revenue and Products**:

  - **Multiplexing**: YES (when trackProductsOnce is enabled)
  - **Conditions**: When `trackProductsOnce` is enabled and the event contains a products array
  - **Behavior**:
    - The original track event is sent
    - Each product in the products array generates a separate "Product Purchased" event
    - If `trackRevenuePerProduct` is enabled, each product event includes revenue tracking
  - **Example**: An "Order Completed" event with 3 products generates 4 total events (1 original + 3 product events)

- **Group Events with Group Identify**:

  - **Multiplexing**: YES
  - **Behavior**:
    - First API Call: `/2/httpapi` - To update user properties with group information
    - Second API Call: `/groupidentify` - To update group properties
  - **Note**: This is true multiplexing as both calls deliver different aspects of the same event to Amplitude

- **Revenue Events (Single Product)**:
  - **Multiplexing**: NO
  - **Behavior**: Single API call to `/2/httpapi` with revenue properties at root level
  - **Note**: Revenue properties are moved from event_properties to root level but it's still a single event

## Version Information

### Current Version

Amplitude HTTP API v2 is used for event tracking.

### API Endpoints

- **Event Tracking**:

  - US: `https://api2.amplitude.com/2/httpapi`
  - EU: `https://api.eu.amplitude.com/2/httpapi`

- **Batch Event Upload**:

  - US: `https://api2.amplitude.com/batch`
  - EU: `https://api.eu.amplitude.com/batch`

- **User Deletion**:

  - US: `https://amplitude.com/api/2/deletions/users`
  - EU: `https://analytics.eu.amplitude.com/api/2/deletions/users`

- **Group Identify**:

  - US: `https://api2.amplitude.com/groupidentify`
  - EU: `https://api.eu.amplitude.com/groupidentify`

- **User Mapping (Alias)**:
  - US: `https://api2.amplitude.com/usermap`
  - EU: `https://api.eu.amplitude.com/usermap`

### Version Deprecation

Amplitude HTTP API v2 is the current version and there is no announced deprecation date. Amplitude maintains backward compatibility for their APIs and typically provides ample notice before deprecating any API version. The HTTP API v2 replaced the deprecated HTTP API v1.

## Documentation Links

### API Documentation

- [Amplitude HTTP API V2](https://amplitude.com/docs/apis/analytics/http-v2)
- [Amplitude Batch Event Upload API](https://amplitude.com/docs/apis/analytics/batch-event-upload)
- [Amplitude Group Identify API](https://amplitude.com/docs/apis/analytics/group-identify)
- [Amplitude User Privacy API](https://amplitude.com/docs/apis/analytics/user-privacy)
- [Amplitude User Mapping API](https://amplitude.com/docs/apis/analytics/user-mapping)
- [Amplitude API Authentication](https://amplitude.com/docs/apis/authentication)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For detailed information about business logic and mappings, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## FAQ

### How does Amplitude handle duplicate events?

Amplitude does not have built-in deduplication for events. Each event sent to Amplitude is treated as a unique occurrence, even if it has the same properties as a previously sent event. This means that if you replay data, you will create duplicate events in Amplitude. To prevent duplicates, use the `insert_id` field which Amplitude uses for deduplication within a 7-day window.

### Can I update user properties without sending an event?

Yes, you can update user properties without sending an event by using an Identify call with event_type set to `$identify`. This will update the user properties without creating a new event in Amplitude.

### How does Amplitude handle anonymous users?

Amplitude uses the device_id field to track anonymous users. When you send events with only a device_id (no user_id), Amplitude creates an anonymous user profile. If you later send events with both a device_id and user_id, Amplitude will merge the anonymous user profile with the identified user profile.

### How are group properties updated in Amplitude?

Group properties are updated using the Group call, which sets the group type and value in the `groups` object and also updates user properties with the group information. Additionally, a separate request is made to the `/groupidentify` endpoint to update group properties.

### What happens when I exceed rate limits?

When you exceed Amplitude's rate limits (30 events/second per user/device), you'll receive a 429 error response. The RudderStack destination handles this by throwing a ThrottledError, which triggers retry logic. Since Amplitude does not guarantee event ordering (`guaranteeUserEventOrder` is false), the destination uses simplified throttle handling without checking individual throttled users/devices or converting 429s to 500s.

### How does batching work in the Amplitude destination?

The Amplitude destination automatically batches events to optimize API usage. Events are batched up to 20 MB or 500 events per batch when using the `/batch` endpoint. Individual events use the `/2/httpapi` endpoint with smaller limits (1 MB, 2000 events for Growth/Enterprise plans).

### Can I use custom event names for page and screen events?

Yes, you can configure custom event names for page and screen events using the `userProvidedPageEventString` and `userProvidedScreenEventString` settings. You can use template variables like `{{properties.name}}` to dynamically generate event names.

### How does revenue tracking work?

Revenue tracking is automatically enabled when a track event contains a `revenue` property. The destination extracts revenue information and moves it to the root level of the Amplitude payload. You can also enable per-product revenue tracking for e-commerce events.

### What user property operations are supported?

When Enhanced User Operations is enabled, the destination supports Amplitude's user property operations: `$set`, `$setOnce`, `$add`, `$append`, `$prepend`, and `$unset`. These are configured through the destination settings for traits to increment, set once, append, or prepend.
