# Amplitude Destination

Implementation in **Javascript**

## Overview

Amplitude is a product analytics platform that helps companies understand user behavior, ship the right features, and improve business outcomes. The RudderStack Amplitude integration sends event data to Amplitude for analysis, allowing you to track user actions, identify users, and analyze user behavior patterns.

## Version Information

- **Current Version**: HTTP API v2
- **Implementation Type**: v0 (JavaScript)
- **Last Updated**: 2023
- **Maintainer**: RudderStack Integration Team

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

### Batching Support

- **Supported**: Yes
- **Message Types**: All message types
- **Batch Limits**:
  - Maximum batch size: 20 MB
  - Maximum events per batch: 500
  - Events exceeding these limits are sent in multiple batches

### Intermediate Calls

The Amplitude destination does not make any intermediate API calls. All events are processed and sent directly to the appropriate Amplitude endpoint.

### Proxy Delivery

- **Supported**: No
- The Amplitude destination does not implement a custom network handler for proxy delivery.

### User Deletion

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/am/deleteUsers.js`
- **Endpoint**: `/api/2/deletions/users`
- **Authentication**: Requires both API Key and Secret Key
- **Batch Size**: Up to 100 users per batch
- **Implementation**:
  - Users are deleted based on their user_id
  - Batches are processed in parallel

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

### Validations

- **User ID or Device ID Required**: Either user_id or device_id must be specified for all events
- **Event Type Required**: Event type is required for all events
- **API Key Required**: API key must be provided in the destination configuration

### Rate Limits

Amplitude enforces rate limits to ensure system stability:

| Endpoint | Rate Limit | Description |
|----------|------------|-------------|
| `/2/httpapi` | 1000 requests/second | Main event tracking endpoint |
| `/api/2/deletions/users` | 100 users per batch | User deletion endpoint |
| `/groupidentify` | 1000 requests/second | Group identify endpoint |

## General Queries

### Event Ordering

#### Identify, Group, Alias

These event types update user profiles in Amplitude. While Amplitude doesn't explicitly require strict event ordering, sending events out of order could result in older attributes overwriting newer ones.

#### Track, Page, Screen

Amplitude events include a timestamp field, which is populated with the event's timestamp. Amplitude processes events based on this timestamp, not the order in which they are received.

> **Recommendation**: Maintain event ordering for all event types to ensure accurate user profiles and event sequencing.

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

- **Track Events with Revenue**:
  - **Multiplexing**: YES
  - When a track event contains revenue, it can generate multiple events:
    - The original track event
    - A separate revenue event with special formatting

- **Order Completed with Products**:
  - **Multiplexing**: YES (when trackProductsOnce is enabled)
  - Each product in the order generates a separate "Product Purchased" event
  - The original order event is still sent

## Version Information

### Current Version

Amplitude HTTP API v2 is used for event tracking.

### API Endpoints

- **Event Tracking**:
  - US: `https://api2.amplitude.com/2/httpapi`
  - EU: `https://api.eu.amplitude.com/2/httpapi`

- **User Deletion**:
  - US: `https://amplitude.com/api/2/deletions/users`
  - EU: `https://analytics.eu.amplitude.com/api/2/deletions/users`

- **Group Identify**:
  - US: `https://api2.amplitude.com/groupidentify`
  - EU: `https://api.eu.amplitude.com/groupidentify`

### Version Deprecation

Amplitude HTTP API v2 is the current version and there is no announced deprecation date. Amplitude maintains backward compatibility for their APIs and typically provides ample notice before deprecating any API version.

## Documentation Links

### API Documentation

- [Amplitude HTTP API V2](https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/)
- [Amplitude Group Identify API](https://www.docs.developers.amplitude.com/analytics/apis/group-identify-api/)
- [Amplitude User Privacy API](https://www.docs.developers.amplitude.com/analytics/apis/user-privacy-api/)
- [Amplitude API Reference](https://www.docs.developers.amplitude.com/analytics/apis/api-reference/)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For detailed information about business logic and mappings, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## FAQ

### How does Amplitude handle duplicate events?

Amplitude does not have built-in deduplication for events. Each event sent to Amplitude is treated as a unique occurrence, even if it has the same properties as a previously sent event. This means that if you replay data, you will create duplicate events in Amplitude.

### Can I update user properties without sending an event?

Yes, you can update user properties without sending an event by using an Identify call with event_type set to `$identify`. This will update the user properties without creating a new event in Amplitude.

### How does Amplitude handle anonymous users?

Amplitude uses the device_id field to track anonymous users. When you send events with only a device_id (no user_id), Amplitude creates an anonymous user profile. If you later send events with both a device_id and user_id, Amplitude will merge the anonymous user profile with the identified user profile.

### How are group properties updated in Amplitude?

Group properties are updated using the Group call, which sets the group type and value in the `groups` object and also updates user properties with the group information. Additionally, a separate request is made to the `/groupidentify` endpoint to update group properties.
