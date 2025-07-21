# MoEngage Business Logic and Mappings

## Overview

The MoEngage destination transforms RudderStack events into MoEngage API calls using specific mapping configurations for each event type. The destination supports three main event types: Identify, Track, and Alias.

## Event Type Handling

### Identify Events

**Purpose**: Create or update user profiles in MoEngage

**API Endpoint**: `POST /v1/customer/<workspace_id>`

**Payload Structure**:
```json
{
  "type": "customer",
  "customer_id": "<user_identifier>",
  "attributes": {
    // User attributes
  }
}
```

**Field Mappings**:

| RudderStack Field | MoEngage Field | Required | Description |
|------------------|----------------|----------|-------------|
| `userId` or `traits.userId` or `traits.id` or `context.traits.userId` or `context.traits.id` or `anonymousId` | `customer_id` | Yes | Unique identifier for the user |
| `traits` | `attributes` | No | User attributes (flattened or merged based on `useObjectData` setting) |

**Special Handling**:
- If `useObjectData` is enabled, nested objects in traits are merged
- If `useObjectData` is disabled, nested objects are flattened with dot notation
- Apple family platforms (iPadOS, tvOS, etc.) are normalized to "iOS"

### Device Information (Identify Sub-flow)

**Condition**: When Identify event contains both `context.device.type` and `context.device.token`

**API Endpoint**: `POST /v1/device/<workspace_id>`

**Payload Structure**:
```json
{
  "type": "device",
  "customer_id": "<user_identifier>",
  "attributes": {
    "platform": "<device_platform>",
    "push_id": "<device_token>",
    // Additional device attributes
  }
}
```

**Field Mappings**:

| RudderStack Field | MoEngage Field | Required | Description |
|------------------|----------------|----------|-------------|
| `userId` or `anonymousId` | `customer_id` | Yes | User identifier |
| `context.device.type` or `channel` | `platform` | Yes | Device platform |
| `context.device.token` | `push_id` | Yes | Push notification token |
| `context.device.model` | `model` | No | Device model |
| `properties.push_preference` or `properties.pushPreference` | `push_preference` | No | Push notification preference |
| `context.app.version` | `app_version` | No | Application version |
| `context.os.version` | `os_version` | No | Operating system version |
| `properties.active` | `active` | No | Device active status |

### Track Events

**Purpose**: Track custom events and user behavior

**API Endpoint**: `POST /v1/event/<workspace_id>`

**Payload Structure**:
```json
{
  "type": "event",
  "customer_id": "<user_identifier>",
  "actions": [{
    "action": "<event_name>",
    "attributes": {
      // Event properties
    },
    "current_time": "<timestamp>",
    // Additional event metadata
  }]
}
```

**Field Mappings**:

| RudderStack Field | MoEngage Field | Required | Description |
|------------------|----------------|----------|-------------|
| `userId` or `traits.userId` or `traits.id` or `context.traits.userId` or `context.traits.id` or `anonymousId` | `customer_id` | Yes | User identifier |
| `event` | `actions[0].action` | Yes | Event name |
| `properties` | `actions[0].attributes` | No | Event properties (flattened or merged based on `useObjectData`) |
| `context.device.type` or `channel` | `actions[0].platform` | No | Device platform |
| `context.app.version` | `actions[0].app_version` | No | Application version |
| `timestamp` or `originalTimestamp` | `actions[0].current_time` | No | Event timestamp |
| `context.timezone` | `actions[0].user_timezone_offset` | No | User timezone offset (converted to seconds) |

### Alias Events

**Purpose**: Merge user profiles for identity resolution

**API Endpoint**: `POST /v1/customer/merge?app_id=<workspace_id>`

**Payload Structure**:
```json
{
  "merge_data": [{
    "retained_user": "<new_user_id>",
    "merged_user": "<previous_user_id>"
  }]
}
```

**Field Mappings**:

| RudderStack Field | MoEngage Field | Required | Description |
|------------------|----------------|----------|-------------|
| `userId` | `merge_data[0].retained_user` | Yes | The user ID to retain |
| `previousId` | `merge_data[0].merged_user` | Yes | The user ID to merge into the retained user |

## Validation Rules

### General Validations

1. **Message Type**: Must be one of `identify`, `track`, or `alias`
2. **User Identifier**: At least one user identifier must be present
3. **API Configuration**: `apiId`, `apiKey`, and `region` must be configured

### Identify Event Validations

1. **Customer ID**: Must be present from one of the mapped fields
2. **Device Information**: Both `context.device.type` and `context.device.token` required for device tracking

### Track Event Validations

1. **Event Name**: `event` field is required
2. **Customer ID**: Must be present from one of the mapped fields

### Alias Event Validations

1. **User IDs**: Both `userId` and `previousId` are required
2. **Different IDs**: `userId` and `previousId` must be different values

## Data Type Handling

### Object Data Type Support

When `useObjectData` is enabled:
```javascript
// Input traits
{
  "name": "John Doe",
  "address": {
    "city": "New York",
    "country": "USA"
  }
}

// Output attributes (merged)
{
  "name": "John Doe",
  "address": {
    "city": "New York", 
    "country": "USA"
  }
}
```

When `useObjectData` is disabled:
```javascript
// Input traits  
{
  "name": "John Doe",
  "address": {
    "city": "New York",
    "country": "USA"
  }
}

// Output attributes (flattened)
{
  "name": "John Doe",
  "address.city": "New York",
  "address.country": "USA"
}
```

### Platform Normalization

Apple family devices are normalized to "iOS":
- `iPadOS` → `iOS`
- `tvOS` → `iOS`
- `watchOS` → `iOS`

## Authentication

All API calls use Basic Authentication:
```
Authorization: Basic <base64(apiId:apiKey)>
```

Additional headers:
- `Content-Type: application/json`
- `MOE-APPKEY: <apiId>` (except for Alias events)

## Error Handling

The destination handles various error scenarios:

1. **Configuration Errors**: Missing required configuration fields
2. **Transformation Errors**: Invalid payload construction
3. **Instrumentation Errors**: Unsupported event types or missing required fields

## Regional Endpoint Selection

Based on the `region` configuration:

| Region | API Base URL |
|--------|-------------|
| US | `https://api-01.moengage.com` |
| EU | `https://api-02.moengage.com` |
| IND | `https://api-03.moengage.com` |

## Use Cases

### User Profile Management
- Create new user profiles with Identify events
- Update existing user attributes
- Track device information for push notifications

### Event Tracking
- Track user interactions and behaviors
- Capture custom events with properties
- Monitor user engagement metrics

### Identity Resolution
- Merge anonymous users with identified users
- Consolidate user profiles across different identifiers
- Maintain user identity consistency
