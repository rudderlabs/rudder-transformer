# Bluecore Business Logic and Field Mappings

## Overview

This document provides detailed information about the business logic, data mappings, and processing flows implemented in the Bluecore destination integration. The integration transforms RudderStack events into Bluecore's API format for customer profile management and e-commerce tracking.

## Data Mapping Architecture

The Bluecore integration uses a configuration-driven mapping approach with separate mapping files for different event types:

### Mapping Configuration Files

1. **`bluecoreCommonConfig.json`**: Common properties shared across all event types
2. **`bluecoreIdentifyConfig.json`**: Properties specific to identify events
3. **`bluecoreTrackConfig.json`**: Properties specific to track events
4. **`bluecoreSubscriptionEventConfig.json`**: Properties specific to subscription events

## Event Processing Flows

### Identify Event Processing Flow

```
RudderStack Identify Event
    ↓
1. Validate message type = "identify"
    ↓
2. Extract user traits from message
    ↓
3. Apply bluecoreCommonConfig mappings
    ↓
4. Apply bluecoreIdentifyConfig mappings
    ↓
5. Set event type to "customer_patch"
    ↓
6. Construct customer object with mapped properties
    ↓
7. Add Bluecore namespace as token
    ↓
8. Determine distinct_id (priority: userId > email > anonymousId)
    ↓
9. Validate required fields
    ↓
10. Send to Bluecore API
```

### Track Event Processing Flow

```
RudderStack Track Event
    ↓
1. Validate message type = "track"
    ↓
2. Extract event name and properties
    ↓
3. Check for event name mapping (custom → standard)
    ↓
4. Determine event type:
   - Standard e-commerce events
   - Subscription events
   - Custom events
    ↓
5. Apply appropriate mapping configuration
    ↓
6. Handle special event types:
   - subscription_event → optin/unsubscribe
   - E-commerce events → product array processing
    ↓
7. Construct payload with customer object
    ↓
8. Add Bluecore namespace as token
    ↓
9. Determine distinct_id (priority: email > userId > anonymousId)
    ↓
10. Validate event-specific requirements
    ↓
11. Send to Bluecore API
```

## Detailed Field Mappings

### Common Properties (All Events)

Based on `bluecoreCommonConfig.json`:

| Source Path            | Destination Path                 | Type   | Required | Notes               |
| ---------------------- | -------------------------------- | ------ | -------- | ------------------- |
| `traits.name`          | `properties.customer.name`       | String | No       | Customer full name  |
| `traits.firstName`     | `properties.customer.first_name` | String | No       | Customer first name |
| `traits.lastName`      | `properties.customer.last_name`  | String | No       | Customer last name  |
| `traits.age`           | `properties.customer.age`        | Number | No       | Customer age        |
| `traits.gender`        | `properties.customer.sex`        | String | No       | Customer gender     |
| `traits.address`       | `properties.customer.address`    | Object | No       | Customer address    |
| `traits.email`         | `properties.customer.email`      | String | No       | Customer email      |
| `context.app.version`  | `properties.client`              | String | No       | Application version |
| `context.device.model` | `properties.device`              | String | No       | Device model        |

### Identify Event Specific Properties

Based on `bluecoreIdentifyConfig.json`:

| Source Path             | Destination Path | Type   | Required | Notes                           |
| ----------------------- | ---------------- | ------ | -------- | ------------------------------- |
| `traits.action`         | `event`          | String | No       | Action type for identify events |
| `context.traits.action` | `event`          | String | No       | Fallback for action field       |

### Subscription Event Properties

Based on `bluecoreSubscriptionEventConfig.json`:

| Source Path        | Destination Path        | Type   | Required | Notes                                            |
| ------------------ | ----------------------- | ------ | -------- | ------------------------------------------------ |
| `properties`       | `properties`            | Object | No       | All properties (excluding channelConsents, list) |
| `traits.name`      | `properties.name`       | String | No       | Customer name                                    |
| `traits.firstName` | `properties.first_name` | String | No       | Customer first name                              |
| `traits.lastName`  | `properties.last_name`  | String | No       | Customer last name                               |
| `traits.age`       | `properties.age`        | Number | No       | Customer age                                     |
| `traits.gender`    | `properties.sex`        | String | No       | Customer gender                                  |
| `traits.address`   | `properties.address`    | Object | No       | Customer address                                 |
| `traits.email`     | `properties.email`      | String | No       | Customer email                                   |

## Business Logic Rules

### Distinct ID Resolution Logic

The integration implements a priority-based system for determining the user identifier:

#### For Identify Events:

1. `userId` (highest priority)
2. `email`
3. `externalId.bluecoreExternalId`
4. `anonymousId` (lowest priority)

#### For Track Events:

1. `email` (highest priority)
2. `userId`
3. `externalId.bluecoreExternalId`
4. `anonymousId` (lowest priority)

### Event Name Mapping Logic

The integration supports custom event name mapping through configuration:

```javascript
// Default mappings from config.js
const EVENT_NAME_MAPPING = [
  { src: ['product viewed'], dest: 'viewed_product' },
  { src: ['products searched'], dest: 'search' },
  { src: ['product added'], dest: 'add_to_cart' },
  { src: ['product removed'], dest: 'remove_from_cart' },
  { src: ['product added to wishlist'], dest: 'wishlist' },
  { src: ['order completed'], dest: 'purchase' },
];
```

### Subscription Event Logic

Special handling for subscription-related events:

```javascript
// Subscription event determination
if (event === 'subscription_event') {
  const emailConsent = message.properties.channelConsents.email;
  if (emailConsent === true) {
    event = 'optin';
  } else if (emailConsent === false) {
    event = 'unsubscribe';
  }
}
```

### Product Array Normalization

For e-commerce events, the integration normalizes product arrays:

1. **Product ID Resolution**: Uses `product_id`, `sku`, or `id` in that order
2. **Required Fields**: Ensures `id`, `name`, and `price` are present
3. **Array Structure**: Maintains consistent product object structure

## Validation Rules

### Required Field Validations

#### All Events:

- Bluecore namespace must be present in destination configuration
- Message type must be 'identify' or 'track'
- Distinct ID must be determinable from available fields

#### Identify Events:

- No additional required fields beyond common validations

#### Track Events:

- Event name is required
- For search events: `search_term` is required
- For purchase events: `order_id`, `total`, and `products` array are required
- For subscription events: `channelConsents.email` must be boolean

#### E-commerce Events:

- Products array is required for: viewed_product, add_to_cart, remove_from_cart, wishlist, purchase
- Each product must have at least an `id` field

### Data Type Validations

- **Email**: Must be string format (validation delegated to Bluecore)
- **Age**: Must be numeric
- **Boolean Fields**: channelConsents.email must be boolean for subscription events
- **Arrays**: Products must be array format
- **Objects**: Address and customer objects must be valid JSON objects

## Error Handling Logic

### Validation Errors

1. **Missing Namespace**: Throws ConfigurationError
2. **Missing Distinct ID**: Throws InstrumentationError
3. **Invalid Event Type**: Throws InstrumentationError
4. **Missing Required Fields**: Throws InstrumentationError with specific field information

### Data Processing Errors

1. **Invalid Data Types**: Attempts conversion, falls back to exclusion
2. **Null/Undefined Values**: Automatically excluded from payload
3. **Empty Arrays**: Handled gracefully, may result in validation errors downstream

## Use Cases and Applications

### E-commerce Tracking

- **Product Catalog Sync**: Track product views, searches, and interactions
- **Shopping Cart Management**: Monitor add/remove cart actions
- **Purchase Tracking**: Complete order and revenue tracking
- **Recommendation Engine**: Provide data for personalized recommendations

### Customer Profile Management

- **Profile Creation**: Create new customer profiles with demographic data
- **Profile Updates**: Update existing customer information in real-time
- **Identity Resolution**: Link anonymous users to identified profiles
- **Segmentation**: Enable customer segmentation based on behavior and attributes

### Email Marketing Automation

- **Subscription Management**: Handle opt-in and unsubscribe events
- **Campaign Triggering**: Trigger automated campaigns based on user actions
- **Personalization**: Provide customer data for personalized email content
- **List Management**: Maintain accurate email subscription lists

### Analytics and Insights

- **Behavioral Analytics**: Track user behavior patterns
- **Conversion Tracking**: Monitor conversion funnels and rates
- **Customer Journey**: Map complete customer journey across touchpoints
- **Performance Metrics**: Measure campaign and product performance

---

**Note**: This business logic documentation is based on the current implementation. For specific implementation details, refer to the source code in the utils.js and config.js files.
