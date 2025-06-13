# Split.io Business Logic and Mappings

## Overview

This document details the business logic and field mappings for the Split.io destination integration. Split.io is a feature flagging and experimentation platform that uses events to measure customer behavior and calculate metrics for experiments.

## Event Processing Flow

### General Flow

1. **Event Type Validation**: Verify that the event type is supported
2. **Event Type ID Processing**: Extract and validate the event type identifier
3. **Field Mapping**: Map RudderStack event fields to Split.io event fields
4. **Property Processing**: Extract and flatten event properties
5. **Payload Construction**: Build the final Split.io event payload
6. **API Request**: Send the event to Split.io Events API

### Event Type Handling

#### Identify Events

**Purpose**: Track user identification and profile updates

**Field Mappings**:
- `eventTypeId`: Extracted from `traits.eventTypeId` or defaults to `identify`
- `key`: Mapped from `userId` (required)
- `trafficTypeName`: Extracted from `traits.trafficTypeName` or `context.traits.trafficTypeName`
- `properties`: All traits except reserved fields

**Business Logic**:
```javascript
case EventType.IDENTIFY:
  traits = getFieldValueFromMessage(message, 'traits');
  if (isDefinedAndNotNull(traits)) bufferProperty = populateOutputProperty(traits);
  break;
```

**Reserved Fields** (excluded from properties):
- `eventTypeId`
- `environmentName`
- `trafficTypeName`
- `key`
- `timestamp`
- `value`
- `revenue`
- `total`

#### Track Events

**Purpose**: Track custom events and user actions

**Field Mappings**:
- `eventTypeId`: Extracted from `event` field (required)
- `key`: Mapped from `userId` (required)
- `value`: Extracted from `properties.revenue`, `properties.value`, or `properties.total`
- `trafficTypeName`: Extracted from `properties.trafficTypeName`
- `properties`: All event properties except reserved fields

**Business Logic**:
```javascript
case EventType.TRACK:
  if (properties) {
    bufferProperty = populateOutputProperty(properties);
  }
  if (message.category) {
    bufferProperty.category = message.category;
  }
  // No prefix modification for track events
  break;
```

#### Page Events

**Purpose**: Track page views and navigation

**Field Mappings**:
- `eventTypeId`: Extracted from `name` field, prefixed with `Viewed_` and suffixed with `_page`
- `key`: Mapped from `userId` (required)
- `properties`: All page properties except reserved fields

**Business Logic**:
```javascript
case EventType.PAGE:
  if (properties) {
    bufferProperty = populateOutputProperty(properties);
  }
  if (message.category) {
    bufferProperty.category = message.category;
  }
  outputPayload.eventTypeId = `Viewed_${outputPayload.eventTypeId}_page`;
  break;
```

**Example Transformation**:
- Input: `name: "Home Page"`
- Output: `eventTypeId: "Viewed_Home_Page_page"`

#### Screen Events

**Purpose**: Track screen views in mobile applications

**Field Mappings**:
- `eventTypeId`: Extracted from `name` field, prefixed with `Viewed_` and suffixed with `_screen`
- `key`: Mapped from `userId` (required)
- `properties`: All screen properties except reserved fields

**Business Logic**:
```javascript
case EventType.SCREEN:
  if (properties) {
    bufferProperty = populateOutputProperty(properties);
  }
  if (message.category) {
    bufferProperty.category = message.category;
  }
  outputPayload.eventTypeId = `Viewed_${outputPayload.eventTypeId}_screen`;
  break;
```

**Example Transformation**:
- Input: `name: "Product Details"`
- Output: `eventTypeId: "Viewed_Product_Details_screen"`

#### Group Events

**Purpose**: Track group-related events and associations

**Field Mappings**:
- `eventTypeId`: Extracted from `traits.eventTypeId` or defaults to group identifier
- `key`: Mapped from `userId` (required)
- `properties`: All group traits except reserved fields

**Business Logic**:
```javascript
case EventType.GROUP:
  if (message.traits) {
    bufferProperty = populateOutputProperty(message.traits);
  }
  break;
```

## Field Mapping Configuration

### Core Field Mappings

The field mappings are defined in `src/v0/destinations/splitio/data/EventConfig.json`:

```json
[
  {
    "destKey": "eventTypeId",
    "sourceKeys": ["event", "name", "type"],
    "metadata": { "type": "toString" },
    "required": true
  },
  {
    "destKey": "key",
    "sourceKeys": "userId",
    "sourceFromGenericMap": true,
    "required": true
  },
  {
    "destKey": "timestamp",
    "sourceKeys": "timestamp",
    "sourceFromGenericMap": true,
    "metadata": { "type": "timestamp" },
    "required": false
  },
  {
    "destKey": "value",
    "sourceKeys": ["properties.revenue", "properties.value", "properties.total"],
    "metadata": { "type": "toFloat" },
    "required": false
  },
  {
    "destKey": "trafficTypeName",
    "sourceKeys": [
      "traits.trafficTypeName",
      "context.traits.trafficTypeName",
      "properties.trafficTypeName"
    ],
    "metadata": { "type": "toString" },
    "required": false
  }
]
```

### Property Processing

#### Property Flattening

Nested objects in properties are flattened using dot notation:

**Input**:
```json
{
  "property1": {
    "property2": 1,
    "property3": "test",
    "property4": {
      "subProp1": { "a": "a", "b": "b" },
      "subProp2": ["a", "b"]
    }
  }
}
```

**Output**:
```json
{
  "property1.property2": 1,
  "property1.property3": "test",
  "property1.property4.subProp1.a": "a",
  "property1.property4.subProp1.b": "b",
  "property1.property4.subProp2[0]": "a",
  "property1.property4.subProp2[1]": "b"
}
```

#### Property Filtering

Properties are filtered to exclude reserved Split.io fields and null/undefined values:

```javascript
function populateOutputProperty(inputObject) {
  const outputProperty = {};
  Object.keys(inputObject).forEach((key) => {
    if (!KEY_CHECK_LIST.includes(key)) {
      outputProperty[key] = inputObject[key];
    }
  });
  return outputProperty;
}
```

## Validation Rules

### Event Type ID Validation

**Regex Pattern**: `/^[\dA-Za-z][\w.-]{0,79}$/`

**Rules**:
- Must start with a letter or number
- Can contain letters, numbers, hyphens, underscores, or periods
- Maximum length of 80 characters
- Spaces are automatically replaced with underscores

**Examples**:
- ✅ Valid: `user_signup`, `page_view`, `button.click`
- ❌ Invalid: `_invalid_start`, `toolongofaneventtypeidthatexceedsthemaximumlengthof80charactersallowed`

### Required Fields

- **key** (userId): Must be present for all events
- **eventTypeId**: Must be present and valid for all events

### Optional Fields

- **timestamp**: Defaults to current timestamp if not provided
- **value**: Used for metrics calculation, extracted from revenue/value/total
- **trafficTypeName**: Falls back to destination configuration if not provided
- **environmentName**: Uses destination configuration if provided

## Error Handling

### Validation Errors

1. **Missing Event Type**: Throws `InstrumentationError` if event type is not provided
2. **Invalid Event Type ID**: Throws `InstrumentationError` if eventTypeId doesn't match regex
3. **Unsupported Event Type**: Throws `InstrumentationError` for unsupported event types

### Transformation Errors

1. **Payload Construction Failure**: Throws `TransformationError` if payload cannot be constructed
2. **Missing Required Fields**: Handled by field mapping validation

## Use Cases

### Feature Flag Experimentation

Split.io events are primarily used to measure the impact of feature flags and experiments:

1. **Conversion Events**: Track when users complete desired actions
2. **Engagement Events**: Measure user interaction with features
3. **Performance Events**: Track timing and performance metrics
4. **Business Metrics**: Calculate revenue and business impact

### Event Properties for Filtering

Event properties can be used to filter metrics in Split.io:

- **User Segments**: Filter by user attributes
- **Feature Variants**: Track different feature implementations
- **A/B Test Groups**: Measure performance across test groups
- **Geographic Regions**: Analyze regional performance differences

### Traffic Type Segmentation

Traffic types allow segmentation of events by entity type:

- **User**: Individual user events
- **Account**: Organization-level events
- **Session**: Session-based events
- **Device**: Device-specific events
