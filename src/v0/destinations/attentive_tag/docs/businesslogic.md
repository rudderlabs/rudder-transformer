# Attentive Tag Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Attentive Tag destination integration. It covers how RudderStack events are mapped to Attentive Tag's API format, the specific API endpoints used for each event type, and the special handling for various event types.

## API Endpoints and Request Flow

### Identify Events

**Primary Endpoints**:

- `/subscriptions` (legacy flow)
- `/subscriptions/unsubscribe` (legacy flow)
- `/identity-resolution/user-identifiers` (new flow)
- `/attributes/custom` (new flow)

**Documentation**: [Attentive API Documentation](https://docs.attentivemobile.com/openapi/reference/)

#### Legacy Identify Flow (Default)

**Request Flow**:

1. **Subscribe Operation** (default):

   ```javascript
   // Endpoint: /subscriptions
   // Payload includes user data, signUpSourceId, and externalIdentifiers
   {
     "user": {
       "email": "user@example.com",
       "phone": "+1234567890"
     },
     "signUpSourceId": "241654",
     "externalIdentifiers": {
       "clientUserId": "external_user_123",
       "shopifyId": "shopify_user_456"
     }
   }
   ```

2. **Unsubscribe Operation**:
   ```javascript
   // Endpoint: /subscriptions/unsubscribe
   // Triggered when integrationsObj.identifyOperation === 'unsubscribe'
   {
     "user": {
       "email": "user@example.com",
       "phone": "+1234567890"
     },
     "subscriptions": [
       {
         "type": "MARKETING",
         "channel": "EMAIL"
       },
       {
         "type": "TRANSACTIONAL",
         "channel": "TEXT"
       }
     ],
     "notification": {
       "language": "en-US",
       "disabled": true
     }
   }
   ```

#### New Identify Flow (enableNewIdentifyFlow = true)

**Request Flow**:

1. **Identity Resolution Call**:

   ```javascript
   // Endpoint: /identity-resolution/user-identifiers
   // Made when email/phone AND clientUserId/customIdentifiers are present
   {
     "email": "user@example.com",
     "phone": "+1234567890",
     "clientUserId": "external_user_123",
     "customIdentifiers": [
       {
         "name": "custom_id",
         "value": "custom_value"
       }
     ]
   }
   ```

2. **User Attributes Call**:
   ```javascript
   // Endpoint: /attributes/custom
   // Made when user and properties are not empty
   {
     "user": {
       "email": "user@example.com",
       "phone": "+1234567890",
       "externalIdentifiers": {
         "clientUserId": "external_user_123"
       }
     },
     "properties": {
       "firstName": "John",
       "lastName": "Doe",
       "age": 30
     }
   }
   ```

**Transformations**:

1. User traits are mapped to Attentive Tag user attributes
2. External identifiers are extracted from `context.externalId`
3. Custom identifiers are extracted from `traits.customIdentifiers`
4. Sign-up source ID is required for subscribe operations

### Track Events

**Primary Endpoints**:

- `/events/custom` (custom events)
- `/events/ecommerce/product-view` (product events)
- `/events/ecommerce/add-to-cart` (add to cart)
- `/events/ecommerce/purchase` (purchase)

**Request Flow**:

1. **Custom Events** (default):

   ```javascript
   // Endpoint: /events/custom
   {
     "user": {
       "email": "user@example.com",
       "phone": "+1234567890"
     },
     "type": "custom_event_name",
     "properties": {
       "custom_property": "value"
     },
     "occuredAt": "2023-10-14T13:56:14.945Z"
   }
   ```

2. **E-commerce Events**:

   ```javascript
   // Endpoint: /events/ecommerce/product-view
   {
     "user": {
       "email": "user@example.com",
       "phone": "+1234567890"
     },
     "occuredAt": "2023-10-14T13:56:14.945Z",
     "items": [
       {
         "productId": "prod123",
         "productVariantId": "variant456",
         "name": "Product Name",
         "quantity": 1,
         "price": [
           {
             "value": 1999,
             "currency": "USD"
           }
         ]
       }
     ]
   }
   ```

3. **Subscription Events**:
   ```javascript
   // Event name: subscription_event
   // Handles both subscribe and unsubscribe in single event
   // Makes multiple API calls based on channelConsents
   ```

**Transformations**:

1. Event name is preserved for custom events
2. E-commerce events are mapped to specific endpoints
3. Product data is extracted and formatted
4. Timestamp validation ensures events are within 12 hours

## Mapping Configuration

The mapping configuration is defined in JSON files within the destination directory:

### Identify Configuration (`identifyConfig.json`)

```json
[
  {
    "destKey": "user.phone",
    "sourceKeys": "phone",
    "sourceFromGenericMap": true,
    "required": false
  },
  {
    "destKey": "user.email",
    "sourceKeys": ["traits.email", "context.traits.email", "properties.email"],
    "sourceFromGenericMap": false,
    "required": false
  }
]
```

### Track Configuration (`customTrackConfig.json`)

```json
[
  {
    "destKey": "user.phone",
    "sourceKeys": "phone",
    "sourceFromGenericMap": true,
    "required": false
  },
  {
    "destKey": "user.email",
    "sourceKeys": ["traits.email", "context.traits.email", "properties.email"],
    "sourceFromGenericMap": false,
    "required": false
  },
  {
    "destKey": "occuredAt",
    "sourceKeys": "timestamp",
    "sourceFromGenericMap": true,
    "required": false
  },
  {
    "destKey": "properties",
    "sourceKeys": "properties",
    "sourceFromGenericMap": false,
    "required": false
  },
  {
    "destKey": "externalEventId",
    "sourceKeys": "properties.eventId",
    "required": false
  }
]
```

### Items Configuration (`itemsConfig.json`)

```json
[
  {
    "destKey": "productId",
    "sourceKeys": "product_id",
    "required": true
  },
  {
    "destKey": "name",
    "sourceKeys": "name",
    "required": false
  },
  {
    "destKey": "productVariantId",
    "sourceKeys": "variant",
    "required": true
  },
  {
    "destKey": "quantity",
    "sourceKeys": "quantity",
    "required": false
  },
  {
    "destKey": "productImage",
    "sourceKeys": "image_url",
    "required": false
  },
  {
    "destKey": "productUrl",
    "sourceKeys": "url",
    "required": false
  }
]
```

## Special Event Handling

### Subscription Events

**Event Name**: `subscription_event`

**Business Logic**:

1. Extracts `channelConsents` from event properties
2. Separates subscribe and unsubscribe consents
3. Filters user data based on consents
4. Makes separate API calls for subscribe and unsubscribe operations

**Example**:

```javascript
// Input event
{
  "type": "track",
  "event": "subscription_event",
  "properties": {
    "channelConsents": [
      {
        "channel": "email",
        "consented": true
      },
      {
        "channel": "sms",
        "consented": false,
        "type": "MARKETING"
      }
    ],
    "notification": {
      "language": "en-US"
    }
  }
}

// Results in multiple API calls:
// 1. POST /subscriptions (for email consent)
// 2. POST /subscriptions/unsubscribe (for SMS consent)
```

### E-commerce Events

**Supported Events**:

- `product_viewed` → `/events/ecommerce/product-view`
- `product_list_viewed` → `/events/ecommerce/product-view`
- `product_added` → `/events/ecommerce/add-to-cart`
- `order_completed` → `/events/ecommerce/purchase`

**Product Data Processing**:

1. Extracts product information from `properties.products` array
2. Validates required fields: `product_id`, `product_variant_id`, `price`
3. Formats price as array with value and currency
4. Handles single product case when `products` array is not present

## Validations and Error Handling

### Required Field Validations

1. **Identify Events**:

   - Either `email` or `phone` is required
   - `signUpSourceId` is required for subscribe operations

2. **Track Events**:

   - Event name is required
   - Timestamp must be within 12 hours of occurrence

3. **E-commerce Events**:
   - `product_id` and `product_variant_id` are required
   - `price` is required for product events
   - Products array must be valid array

### Property Validations

1. **Property Key Restrictions**:

   ```javascript
   const validationArray = [`'`, `"`, `{`, `}`, `[`, `]`, ',', `,`];
   // Property keys cannot contain these characters
   ```

2. **Timestamp Validation**:
   ```javascript
   // Events must be within 12 hours of occurrence
   const deltaDay = Math.ceil(moment.duration(current.diff(start)).asHours());
   if (deltaDay > 12) {
     return false;
   }
   ```

### Error Types

1. **Configuration Errors**:

   - Missing API key
   - Missing sign-up source ID for subscribe operations

2. **Instrumentation Errors**:

   - Missing required fields (email/phone, event name)
   - Invalid property keys
   - Events outside 12-hour window
   - Invalid data types

3. **Validation Errors**:
   - Invalid product data structure
   - Missing required product fields
   - Invalid channel consents format

## External Identifiers

### Supported Types

1. **clientUserId**: Client's internal user ID
2. **shopifyId**: Shopify customer ID
3. **klaviyoId**: Klaviyo customer ID
4. **customIdentifiers**: Array of custom name-value pairs

### Mapping Logic

```javascript
// Extracts from context.externalId array
const externalIdentifiers = ['clientUserId', 'shopifyId', 'klaviyoId'];
const externalId = get(message, 'context.externalId');

// Extracts from traits.customIdentifiers
const customIdentifiers = get(message, 'traits.customIdentifiers');
```

## Channel Mapping

### Channel Types

```javascript
const CHANNEL_MAPPING = {
  sms: 'TEXT',
  email: 'EMAIL',
};
```

### Subscription Types

- **MARKETING**: Marketing communications
- **TRANSACTIONAL**: Transactional communications
- **CHECKOUT_ABANDONED**: Abandoned cart communications

## General Use Cases

### User Profile Management

1. **User Identification**: Create and update user profiles with contact information
2. **Attribute Updates**: Update user attributes and preferences
3. **External ID Mapping**: Link users across different systems

### E-commerce Tracking

1. **Product Views**: Track when users view products
2. **Add to Cart**: Track when users add products to cart
3. **Purchases**: Track completed orders and revenue

### Subscription Management

1. **Opt-ins**: Subscribe users to marketing communications
2. **Opt-outs**: Unsubscribe users from specific channels
3. **Consent Management**: Handle granular consent preferences

### Custom Event Tracking

1. **Custom Events**: Track any custom user actions
2. **Property Validation**: Ensure event properties meet requirements
3. **Timestamp Tracking**: Track when events occurred

## Data Flow Examples

### Complete Identify Flow

```javascript
// Input: RudderStack identify event
{
  "type": "identify",
  "userId": "user123",
  "traits": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe"
  },
  "context": {
    "externalId": [
      {
        "type": "clientUserId",
        "id": "external_user_123"
      }
    ]
  }
}

// Output: Attentive Tag API call
POST /subscriptions
{
  "user": {
    "email": "user@example.com",
    "phone": "+1234567890"
  },
  "signUpSourceId": "241654",
  "externalIdentifiers": {
    "clientUserId": "external_user_123"
  }
}
```

### Complete Track Flow

```javascript
// Input: RudderStack track event
{
  "type": "track",
  "event": "Product Viewed",
  "properties": {
    "product_id": "prod123",
    "variant": "variant456",
    "name": "Wireless Headphones",
    "price": 199.99,
    "currency": "USD"
  },
  "timestamp": "2023-10-14T13:56:14.945Z"
}

// Output: Attentive Tag API call
POST /events/ecommerce/product-view
{
  "user": {},
  "occuredAt": "2023-10-14T13:56:14.945Z",
  "items": [
    {
      "productId": "prod123",
      "productVariantId": "variant456",
      "name": "Wireless Headphones",
      "price": [
        {
          "value": 19999,
          "currency": "USD"
        }
      ]
    }
  ]
}
```

## Performance Considerations

1. **No Batching**: Events are processed individually
2. **Rate Limiting**: Standard HTTP retry logic for rate limit handling
3. **Validation Overhead**: Property validation on every event
4. **Timestamp Validation**: Moment.js operations for timestamp validation

## Error Recovery

1. **Retry Logic**: Standard HTTP retry for network errors
2. **Validation Errors**: Events are rejected with specific error messages
3. **Configuration Errors**: Events are rejected with configuration error messages
4. **Partial Failures**: Subscription events may partially succeed (some channels succeed, others fail)
