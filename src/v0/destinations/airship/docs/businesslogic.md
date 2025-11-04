# Airship Business Logic and Mappings

## Overview

This document details the business logic, field mappings, and transformation rules implemented in the Airship destination.

## Event Type Handling

### Identify Events

**Purpose**: Update user profiles with attributes and tags in Airship

**API Endpoints Used**:

- `POST /api/named_users/tags` - For tag operations
- `POST /api/named_users/{userId}/attributes` - For attribute updates

**Flow Logic**:

1. Extract traits from the identify event
2. Separate traits into tag-eligible and attribute-eligible data
3. Create tag payload for add/remove operations
4. Create attribute payload for user profile updates
5. Generate separate API calls if both tags and attributes are present

**Required Fields**:

- `userId` - Maps to Named User ID in Airship
- `traits` - Contains the data to be processed

**Validation Rules**:

- API Key is required for authorization
- Traits object must be present and non-empty
- userId is mandatory for all operations

### Track Events

**Purpose**: Send custom events to Airship for analytics and campaign triggers

**API Endpoints Used**:

- `POST /api/custom-events` - For custom event tracking

**Flow Logic**:

1. Extract event name and convert to lowercase
2. Replace spaces with underscores in event name
3. Extract custom properties from event properties
4. Transform session ID to UUID format if present
5. Create custom event payload with user context

**Required Fields**:

- `event` - Event name (required)
- `userId` - Maps to Named User ID
- Both `apiKey` and `appKey` are required for Track events

**Validation Rules**:

- Event name is mandatory
- Both API Key and App Key must be configured
- Session ID must be convertible to UUID format if provided

### Group Events

**Purpose**: Manage group-level tags and attributes for users

**API Endpoints Used**:

- `POST /api/named_users/tags` - For group tag operations
- `POST /api/named_users/{userId}/attributes` - For group attribute updates

**Flow Logic**:

1. Extract group traits from the event
2. Process traits similar to Identify events but with group-specific tag groups
3. Create separate payloads for group tags and group attributes
4. Generate API calls for both tag and attribute operations if applicable

**Required Fields**:

- `userId` - Maps to Named User ID
- `traits` - Contains group-related data

**Validation Rules**:

- API Key is required for authorization
- Group traits must be present and non-empty
- userId is mandatory

## Field Mappings

### Identify Event Mapping

```json
[
  {
    "destKey": "audience.named_user_id",
    "sourceKeys": "userId",
    "sourceFromGenericMap": true,
    "required": true
  }
]
```

### Track Event Mapping

```json
[
  {
    "destKey": "name",
    "sourceKeys": "event",
    "required": true
  },
  {
    "destKey": "value",
    "sourceKeys": "properties.value",
    "required": false
  },
  {
    "destKey": "interaction_id",
    "sourceKeys": "properties.interactionId",
    "required": false
  },
  {
    "destKey": "interaction_type",
    "sourceKeys": "properties.interactionType",
    "required": false
  },
  {
    "destKey": "session_id",
    "sourceKeys": ["properties.sessionId", "context.sessionId"],
    "required": false,
    "metadata": {
      "type": "toString"
    }
  },
  {
    "destKey": "transaction",
    "sourceKeys": "properties.transaction",
    "required": false
  }
]
```

### Group Event Mapping

```json
[
  {
    "destKey": "audience.named_user_id",
    "sourceKeys": "userId",
    "sourceFromGenericMap": true,
    "required": true
  }
]
```

## Data Processing Logic

### Tag Processing

**Tag Groups**:

- **Identify Events**: `rudderstack_integration`
- **Group Events**: `rudderstack_integration_group`

**Tag Operations**:

- **Add Tags**: Traits with boolean `true` values or string values are added as tags
- **Remove Tags**: Traits with boolean `false` values are removed as tags

**Reserved Traits for Tags**:
The following traits are processed as tags rather than attributes:

- Any trait that matches reserved tag patterns
- Boolean traits (true = add tag, false = remove tag)

### Attribute Processing

**Attribute Types Supported**:

- String attributes
- Number attributes
- Boolean attributes
- Timestamp attributes (with automatic conversion)
- JSON attributes (through integrations object)

**Timestamp Conversion**:

- Configurable timestamp attributes are automatically converted to Airship format
- Format: `YYYY-MM-DD[T]HH:mm:ss[Z]`
- Supports various input formats (Unix timestamps, ISO strings, etc.)

**JSON Attributes**:
Special handling through the integrations object:

```javascript
{
  "integrations": {
    "airship": {
      "JSONAttributes": {
        "custom_object": {
          "key": "value"
        }
      },
      "removeAttributes": ["attribute_to_remove"]
    }
  }
}
```

### Custom Event Properties

**Property Extraction**:

- All properties under `properties` object are extracted
- Excluded properties (defined in `AIRSHIP_TRACK_EXCLUSION`) are filtered out
- Custom properties are sent as-is to Airship

**Event Name Processing**:

1. Convert event name to lowercase
2. Replace spaces with underscores
3. Apply same processing to `value` field if it's a string

## API Endpoints Used

### Named Users Tags API

- **Endpoint**: `POST /api/named_users/tags`
- **Purpose**: Add or remove tags for named users
- **Used By**: Identify and Group events
- **Payload Structure**: Contains `add` and `remove` objects with tag arrays

### Named Users Attributes API

- **Endpoint**: `POST /api/named_users/{userId}/attributes`
- **Purpose**: Set or remove user attributes
- **Used By**: Identify and Group events
- **Payload Structure**: Contains `attributes` array with action, key, value, timestamp

### Custom Events API

- **Endpoint**: `POST /api/custom-events`
- **Purpose**: Track custom events for analytics and triggers
- **Used By**: Track events
- **Payload Structure**: Contains event details, user context, and custom properties

## Data Center Selection

**Logic**:

```javascript
let BASE_URL = BASE_URL_US; // Default to US
BASE_URL = dataCenter ? BASE_URL_EU : BASE_URL;
```

**URLs**:

- **US Data Center**: `https://go.urbanairship.com`
- **EU Data Center**: `https://go.airship.eu`

## Authentication

**Headers Used**:

```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/vnd.urbanairship+json; version=3',
  'Authorization': `Bearer ${apiKey}`,
  'X-UA-Appkey': `${appKey}` // Only for Track events
}
```

## Error Handling

**Configuration Errors**:

- Missing API Key for any event type
- Missing App Key for Track events
- Invalid data center configuration

**Instrumentation Errors**:

- Missing event name for Track events
- Empty or missing traits for Identify/Group events
- Invalid session ID format for Track events
- Unsupported message types

**Validation Rules**:

- All events require a valid `userId`
- Traits/properties must be non-empty objects
- Session IDs must be convertible to UUID format
- Event names are mandatory for Track events
- Maximum payload size: 5 MiB per request
- JSON attributes cannot contain arrays (objects and primitives only)
- Attribute keys with dots are automatically converted to underscores
- Timestamp attributes must be in valid date/time format

## Use Cases

### User Profile Management

- **Identify Events**: Update user attributes and tags
- **Group Events**: Manage group memberships and group-specific attributes
- **Attribute Updates**: Real-time profile enrichment

### Event Tracking

- **Track Events**: Custom event analytics
- **Campaign Triggers**: Events that trigger automated campaigns
- **User Journey Tracking**: Track user interactions and behaviors

### Segmentation

- **Tag-based Segmentation**: Use tags for audience targeting
- **Attribute-based Segmentation**: Use attributes for personalization
- **Group-based Segmentation**: Target users based on group memberships
