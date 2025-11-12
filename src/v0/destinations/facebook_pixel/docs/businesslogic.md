# Facebook Pixel Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Facebook Pixel destination integration. It covers how RudderStack events are mapped to Facebook's Conversions API format, the specific API endpoints used for each event type, and the special handling for various event types.

## API Endpoints and Request Flow

### Single Endpoint for All Events

**Primary Endpoint**: `https://graph.facebook.com/v22.0/{PIXEL_ID}/events`
**Method**: POST
**Documentation**: [Facebook Conversions API Events Endpoint](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/)

**Request Flow**:
All event types (Identify, Track, Page, Screen) are sent to the same endpoint with different payload structures:

1. **Authentication**: Access token is included as a query parameter
2. **Payload Construction**: Event data is formatted according to Facebook's Conversions API specification
3. **API Request**: Single POST request to the events endpoint
4. **Response Processing**: Standard HTTP response handling with Facebook-specific error processing

### Event Type Processing

#### Identify Events

**Endpoint**: `/events`
**Requirement**: Advanced Mapping must be enabled in destination configuration

**Request Flow**:

1. **Configuration Check**: Verify that `advancedMapping` is enabled
   ```javascript
   if (advancedMapping) {
     category = CONFIG_CATEGORIES.USERDATA;
   } else {
     throw new ConfigurationError(
       'For identify events, "Advanced Mapping" configuration must be enabled',
     );
   }
   ```
2. **User Data Mapping**: Map user traits to Facebook user data format
3. **Payload Construction**: Create payload with user_data only (no custom_data)
4. **API Request**: Send to `/events` endpoint

**Transformations**:

1. User traits are mapped to Facebook's user data fields using `FBPIXELUserDataConfig.json`
2. PII data is automatically hashed using SHA-256
3. External ID is derived from userId, traits.userId, traits.id, or anonymousId
4. Email addresses are trimmed, lowercased, and hashed
5. Phone numbers are hashed
6. Gender values are converted to Facebook's expected format

#### Track Events

**Endpoint**: `/events`

**Request Flow**:

1. **Event Name Validation**: Ensure event name is present and is a string
2. **Event Mapping**: Check if event should be mapped to a Facebook standard event
3. **Category Determination**: Determine event category (standard vs custom)
4. **Payload Construction**: Create payload with both user_data and custom_data
5. **API Request**: Send to `/events` endpoint

**Transformations**:

1. **Standard E-commerce Events**: Automatic mapping to Facebook standard events:

   - `Product List Viewed` → `ViewContent`
   - `Product Viewed` → `ViewContent`
   - `Product Added` → `AddToCart`
   - `Order Completed` → `Purchase`
   - `Products Searched` → `Search`
   - `Checkout Started` → `InitiateCheckout`

2. **Custom Event Processing**:

   - Event properties are flattened and included in custom_data
   - Reserved properties are excluded: `opt_out`, `event_id`, `action_source`
   - Special arrays (`content_ids`, `contents`) are preserved without flattening

3. **Value Field Handling**:
   - Revenue is mapped to `value` field
   - Value field identifier can be configured (`properties.value` or `properties.price`)

#### Page Events

**Endpoint**: `/events`

**Request Flow**:

1. **Standard Page Call Check**: Determine if page events should be sent as standard PageView events
2. **Event Name Construction**: Create appropriate event name
3. **Payload Construction**: Create payload with user_data and custom_data
4. **API Request**: Send to `/events` endpoint

**Transformations**:

1. **Standard PageView**: When `standardPageCall` is enabled, sent as Facebook's standard PageView event
2. **Custom Page Event**: When disabled, sent as custom event with page information
3. **Property Mapping**: Page properties are included in custom_data

#### Screen Events

**Endpoint**: `/events`

**Request Flow**:
Similar to Page events but for mobile screen views

**Transformations**:

1. Screen events are treated similarly to page events
2. Screen name and properties are mapped to custom_data
3. User data is included in user_data section

## Special Handling

### PII Data Processing

**Automatic Hashing**: The destination automatically processes PII data according to Facebook's requirements

**Default PII Properties**:

- email, firstName, lastName, first_name, last_name
- gender, city, country, phone, state, zip, postalCode, birthday

**Processing Logic**:

1. **Whitelist Processing**: Properties in whitelist are included even if they contain PII
2. **Blacklist Processing**: Properties in blacklist are excluded or hashed based on configuration
3. **Default PII Handling**: Default PII properties are automatically hashed unless whitelisted
4. **Custom Hashing**: Integration object can specify custom hashing behavior

**Example Configuration**:

```javascript
// Blacklist with hashing
blacklistPiiProperties: [{ blacklistPiiProperties: 'phone', blacklistPiiHash: true }];

// Whitelist (no hashing)
whitelistPiiProperties: [{ whitelistPiiProperties: 'email' }];
```

### Event Duration Validation

**Validation Rules**:

- **Standard Events**: Events must be sent within 7 days of their occurrence or up to 1 minute in the future
- **Physical Store Events**: Events with `action_source` set to `physical_store` must be sent within 62 days of their occurrence

**Implementation**:

```javascript
const verifyEventDuration = (message, destination, timeStamp) => {
  const actionSource =
    get(message, 'traits.action_source') ||
    get(message, 'context.traits.action_source') ||
    get(message, 'properties.action_source');

  const start = moment.unix(moment(timeStamp).format('X'));
  const current = moment.unix(moment().format('X'));
  const deltaDay = Math.ceil(moment.duration(current.diff(start)).asDays());
  const deltaMin = Math.ceil(moment.duration(start.diff(current)).asMinutes());

  let defaultSupportedDelta = 7;
  if (actionSource === 'physical_store') {
    defaultSupportedDelta = 62;
  }

  if (deltaDay > defaultSupportedDelta || deltaMin > 1) {
    throw new InstrumentationError(
      `Events must be sent within ${defaultSupportedDelta} days of their occurrence or up to one minute in the future.`,
    );
  }
};
```

### Action Source Detection

**Automatic Detection**: The destination sets the `action_source` parameter based on the event channel

**Mapping Logic**:

```javascript
const getActionSource = (commonData, channel) => {
  if (commonData.action_source && ACTION_SOURCES_VALUES.includes(commonData.action_source)) {
    return commonData.action_source;
  }

  switch (channel) {
    case 'web':
      return 'website';
    case 'mobile':
      return 'app';
    default:
      return 'other';
  }
};
```

**Supported Action Sources**:

- email, website, app, phone_call, chat, physical_store, system_generated, other

### Limited Data Usage (CCPA Compliance)

**Configuration**: When `limitedDataUSage` is enabled

**Implementation**:

```javascript
if (limitedDataUSage) {
  const dataProcessingOptions = get(message, 'context.dataProcessingOptions');
  if (dataProcessingOptions && Array.isArray(dataProcessingOptions)) {
    [
      commonData.data_processing_options,
      commonData.data_processing_options_country,
      commonData.data_processing_options_state,
    ] = dataProcessingOptions;
  }
}
```

### Test Destination Support

**Configuration**: When `testDestination` is enabled

**Implementation**:

- Events are sent to Facebook's test environment
- Requires `testEventCode` configuration
- Used for testing and validation purposes

## Mapping Configuration

The mapping configuration is defined in JSON files within the destination directory:

### User Data Mapping (`FBPIXELUserDataConfig.json`)

Maps RudderStack user fields to Facebook user data fields:

- `external_id`: Mapped from userId, traits.userId, traits.id, or anonymousId (hashed)
- `em`: Email address (trimmed, lowercased, hashed)
- `ph`: Phone number (hashed)
- `ge`: Gender (converted to Facebook format)
- `fn`: First name (hashed)
- `ln`: Last name (hashed)
- `ct`: City (hashed)
- `st`: State (hashed)
- `zp`: Zip code (hashed)
- `country`: Country (hashed)
- `db`: Date of birth (hashed)

### Common Data Mapping (`FBPIXELCommonConfig.json`)

Maps common event fields:

- `event_name`: Event name
- `event_time`: Event timestamp
- `event_id`: Unique event identifier
- `action_source`: Source of the action
- `opt_out`: Opt-out flag

### Custom Data Mapping (`FBPIXELPSimpleCustomConfig.json`)

Maps event properties to Facebook custom data fields for different event categories.

## Error Handling

### Configuration Errors

1. **Missing Pixel ID**: Throws ConfigurationError if pixelId is not provided
2. **Missing Access Token**: Required for cloud mode
3. **Advanced Mapping Required**: For Identify events
4. **Invalid Event Name**: Must be string for Track events

### Validation Errors

1. **Event Duration**: Events outside the 7-day window are rejected
2. **Missing Required Fields**: Event type and other required fields must be present
3. **Invalid Data Types**: Proper data type validation for all fields

### Network Errors

1. **Facebook API Errors**: Handled through shared Facebook utilities
2. **Authentication Errors**: Invalid access token or permissions
3. **Rate Limiting**: Handled with appropriate error responses

## Use Cases

### Conversion Tracking

- Track user actions that lead to conversions
- Measure campaign effectiveness
- Optimize ad delivery based on conversion data

### Audience Building

- Create custom audiences based on user behavior
- Build lookalike audiences from existing customers
- Retarget users based on specific actions

### Attribution

- Track user journey across different touchpoints
- Measure cross-device conversions
- Understand customer acquisition paths

### E-commerce Optimization

- Track product views, cart additions, and purchases
- Optimize for specific e-commerce events
- Measure return on ad spend (ROAS)
