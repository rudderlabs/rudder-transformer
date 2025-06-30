# Customer.io Business Logic and Mappings

## Overview

This document details the business logic, field mappings, and event processing flows for the Customer.io destination. The implementation handles various event types with specific validation requirements and transformation logic.

## Event Type Processing

### Identify Events

**Purpose**: Create or update user profiles in Customer.io

**Endpoint**: `PUT /api/v1/customers/:id`

**Business Logic**:

````javascript
const identifyResponseBuilder = (userId, message) => {
  const rawPayload = {};
  // if userId is not there simply drop the payload
  const id = userId || getFieldValueFromMessage(message, 'email');
  if (!id) {
    throw new InstrumentationError('userId or email is not present');
  }
````

**Required Fields**:
- `userId` OR `email` (at least one must be present)

**Field Mappings**:
- **User Identifier**: `userId` or `email` → Customer.io user ID
- **Traits**: All traits except reserved ones → Customer.io user attributes
- **Created At**: `traits.createdAt` → `created_at` (Unix timestamp)
- **Anonymous ID**: `anonymousId` → `anonymous_id` (for event merging)
- **Historical Timestamp**: `historicalTimestamp` → `_timestamp` (Unix timestamp)

**Validation Rules**:
- User ID or email is mandatory
- Reserved traits (`createdAt`, `userId`, `anonymousId`) are excluded from attribute mapping
- Dot notation in trait keys is escaped for proper handling

### Track Events

**Purpose**: Send custom events for identified or anonymous users

**Endpoints**: 
- Identified: `POST /api/v1/customers/:id/events`
- Anonymous: `POST /api/v1/events`

**Business Logic**:

````javascript
const defaultResponseBuilder = (message, evName, userId, evType, destination, messageType) => {
  const rawPayload = {};
  let endpoint;
  let trimmedEvName;
  const id = encodePathParameter(userId) || getFieldValueFromMessage(message, 'email');
  
  if (id) {
    endpoint = USER_EVENT_ENDPOINT.replace(':id', id);
  } else {
    endpoint = ANON_EVENT_ENDPOINT;
    // CustomerIO supports 100byte of event name for anonymous users
    trimmedEvName = truncate(evName, 100);
    if (!message.anonymousId) {
      throw new InstrumentationError('Anonymous id/ user id is required');
    }
    rawPayload.anonymous_id = message.anonymousId;
  }
````

**Required Fields**:
- **Identified Events**: `userId` or `email`
- **Anonymous Events**: `anonymousId`
- **Event Name**: Must be a string, validated and trimmed

**Field Mappings**:
- **Event Name**: `event` → `name`
- **Event Type**: Always set to `"event"`
- **Properties**: `properties` → `data`
- **Historical Timestamp**: `historicalTimestamp` → `timestamp` (Unix timestamp)

**Validation Rules**:
- Event name must be a string
- Anonymous event names are truncated to 100 bytes
- Anonymous events require `anonymousId`
- User ID path parameters are URL encoded if they contain special characters

### Page Events

**Purpose**: Track page views

**Endpoints**: Same as Track events

**Business Logic**:

````javascript
case EventType.PAGE:
  evType = 'page'; // customerio mandates sending 'page' for pageview events
  evName = message.name || message.properties?.url;
  break;
````

**Field Mappings**:
- **Event Type**: Set to `"page"`
- **Event Name**: `name` or `properties.url`
- **Properties**: `properties` → `data`

### Screen Events

**Purpose**: Track mobile app screen views

**Business Logic**:

````javascript
case EventType.SCREEN:
  evType = 'event';
  evName = `Viewed ${message.event || message.properties?.name} Screen`;
  break;
````

**Field Mappings**:
- **Event Type**: Set to `"event"`
- **Event Name**: `"Viewed {screen_name} Screen"` format
- **Screen Name**: `event` or `properties.name`

**Special Handling**:
- For anonymous users, screen event names are truncated to 86 bytes (100 - length of "Viewed " and " Screen")

### Group Events

**Purpose**: Manage objects and relationships in Customer.io

**Endpoint**: `POST /api/v2/batch`

**Business Logic**:

````javascript
const groupResponseBuilder = (message) => {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.OBJECT_EVENTS.name]);
  const rawPayload = {
    identifiers: {
      object_id: payload.object_id,
      object_type_id: payload.object_type_id,
    },
    type: 'object',
    action: payload.action && OBJECT_ACTIONS.includes(payload.action) 
      ? payload.action 
      : DEFAULT_OBJECT_ACTION,
    attributes: payload.attributes || {},
    cio_relationships: [],
  };
````

**Field Mappings** (from `customerIoGroup.json`):
- **Object ID**: `groupId` → `object_id` (required)
- **Object Type ID**: `traits.objectTypeId` → `object_type_id` (default: "1")
- **User ID**: `userIdOnly` → `userId`
- **Email**: `context.traits.email`, `properties.email`, or `context.externalId[0].id` → `email`
- **Action**: `traits.action` or `properties.action` → `action`
- **Attributes**: `traits` (excluding action) → `attributes`

**Supported Actions**:
- `identify` (default)
- `delete`
- `add_relationships`
- `delete_relationships`

**Validation Rules**:
- `object_id` is required
- Action must be from supported actions list
- User relationships are established via email or ID

### Alias Events

**Purpose**: Merge user profiles

**Endpoint**: `POST /api/v1/merge_customers`

**Business Logic**:

````javascript
const aliasResponseBuilder = (message, userId) => {
  if (!userId || !message.previousId) {
    throw new InstrumentationError('Both userId and previousId are mandatory for merge operation');
  }
  const cioProperty = validator.isEmail(userId) ? 'email' : 'id';
  const prevCioProperty = validator.isEmail(message.previousId) ? 'email' : 'id';
  const rawPayload = {
    primary: {
      [cioProperty]: userId,
    },
    secondary: {
      [prevCioProperty]: message.previousId,
    },
  };
````

**Required Fields**:
- `userId` (primary profile to keep)
- `previousId` (secondary profile to merge and delete)

**Field Mappings**:
- **Primary**: `userId` → `primary.id` or `primary.email`
- **Secondary**: `previousId` → `secondary.id` or `secondary.email`

**Validation Rules**:
- Both `userId` and `previousId` are mandatory
- Automatically detects if identifier is email or ID format
- Secondary profile is deleted after merge

## Device Management

### Device Registration

**Purpose**: Register mobile device tokens for push notifications

**Endpoint**: `PUT /api/v1/customers/:id/devices`

**Trigger Events**:
- "Application Installed"
- "Application Opened"
- "Application Uninstalled"
- Custom event (configurable via `deviceTokenEventName`)

**Business Logic**:

````javascript
const isDeviceRelatedEvent = isdeviceRelatedEventName(evName, destination);
if (isDeviceRelatedEvent && id && token) {
  const timestamp = message.timestamp || message.originalTimestamp;
  const devProps = {
    ...message.properties,
    id: token,
    last_used: Math.floor(new Date(timestamp).getTime() / 1000),
  };
  const deviceType = get(message, 'context.device.type');
  if (deviceType && typeof deviceType === 'string') {
    devProps.platform = isAppleFamily(deviceType) ? 'ios' : deviceType.toLowerCase();
  }
  set(rawPayload, 'device', devProps);
}
````

**Required Fields**:
- User ID or email
- Device token (`context.device.token`)

**Field Mappings**:
- **Device ID**: `context.device.token` → `device.id`
- **Last Used**: `timestamp` or `originalTimestamp` → `device.last_used` (Unix timestamp)
- **Platform**: `context.device.type` → `device.platform` (iOS/Android)
- **Properties**: All `properties` → device attributes

**Platform Detection**:
- Apple family devices → "ios"
- Other devices → lowercase device type

### Device Deletion

**Purpose**: Remove device tokens

**Endpoint**: `DELETE /api/v1/customers/:id/devices/:device_id`

**Trigger Event**: "Application Uninstalled"

**Required Fields**:
- User ID or email
- Device token

## Data Center Handling

**Business Logic**:

````javascript
// replace default domain with EU data center domain for EU based account
if (destination.Config?.datacenter === 'EU' || destination.Config?.datacenterEU) {
  response.endpoint = response.endpoint.replace('track.customer.io', 'track-eu.customer.io');
}
````

**Endpoint Transformation**:
- **US**: `track.customer.io` (default)
- **EU**: `track-eu.customer.io`

## Batching Logic

### Group Event Batching

**Business Logic**:

````javascript
const getEventChunks = (groupEvents) => {
  const eventChunks = [];
  let batchedData = [];
  let metadata = [];
  let size = 0;

  groupEvents.forEach((events) => {
    const objSize = getSizeInBytes(events);
    size += objSize;
    if (batchedData.length === MAX_BATCH_SIZE || size > 500000) {
      eventChunks.push({ data: batchedData, metadata });
      batchedData = [];
      metadata = [];
      size = 0;
    }
    metadata.push(events.metadata);
    batchedData.push(events.message.body.JSON);
  });
````

**Batching Rules**:
- **Maximum Events**: 1000 events per batch
- **Maximum Size**: 500KB per batch
- **Event Size**: 32KB maximum per individual event

## Validation Requirements

### Configuration Validation

````javascript
const validateConfigFields = (destination) => {
  const { Config } = destination;
  configFieldsToCheck.forEach((configProperty) => {
    if (!Config[configProperty]) {
      throw new ConfigurationError(`${configProperty} not found in Configs`);
    }
  });
};
````

**Required Configuration**:
- `siteID`
- `apiKey`

### Event Validation

**Event Name Validation**:
- Must be a string for Track events
- Automatically trimmed of leading/trailing spaces
- Truncated for anonymous events (100 bytes limit)

**User Identification**:
- Identify events require userId or email
- Anonymous events require anonymousId
- Alias events require both userId and previousId

## Error Handling

### Common Error Scenarios

1. **Missing Required Fields**:
   - `InstrumentationError` for missing userId/email in Identify
   - `InstrumentationError` for missing anonymousId in anonymous events
   - `InstrumentationError` for missing userId/previousId in Alias

2. **Configuration Errors**:
   - `ConfigurationError` for missing API credentials

3. **Data Type Errors**:
   - `InstrumentationError` for non-string event names

### Path Parameter Safety

````javascript
const encodePathParameter = (param) => {
  if (typeof param !== 'string') return param;
  return param.includes('/') ? encodeURIComponent(param) : param;
};
````

**URL Encoding**: User IDs containing forward slashes are automatically URL encoded to prevent API endpoint path issues.

## NEEDS REVIEW

The following aspects require further investigation:

- **Advanced Trait Mapping**: Complex nested object handling in user attributes
- **Custom Attribute Operations**: Support for Customer.io's custom attribute operations (add, remove, update)
- **Event Deduplication**: Implementation of event deduplication using ULID
- **Subscription Preferences**: Handling of Customer.io subscription preferences in user attributes
