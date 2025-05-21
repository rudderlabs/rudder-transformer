# Bluecore Business Logic

This document outlines the business logic implemented in the Bluecore destination integration.

## Data Mappings

### Identify Events

When processing identify events, the following mappings are applied:

1. The event type is set to `customer_patch`
2. User traits are mapped to Bluecore customer properties:
   - `email` → `properties.customer.email`
   - `firstName`/`first_name` → `properties.customer.first_name`
   - `lastName`/`last_name` → `properties.customer.last_name`
   - `phone` → `properties.customer.phone`
   - Other traits are included as-is in the customer object

### Track Events

For track events, the following logic is applied:

1. Check if the event name matches any of the special events (optin, unsubscribe)
2. Check if the event name needs to be mapped using the event mapping configuration
3. Map event properties to Bluecore properties
4. Include user information in the customer object

### Subscription Events

For subscription events, special handling is applied:

1. For direct `optin` events, the event type remains `optin`
2. For direct `unsubscribe` events, the event type remains `unsubscribe`
3. For `subscription_event` events:
   - If `channelConsents.email` is `true`, the event is mapped to `optin`
   - If `channelConsents.email` is `false`, the event is mapped to `unsubscribe`

## Flow of Logic

### Identify Event Flow

1. Validate that the message type is `identify`
2. Extract user traits from the message
3. Set the event type to `customer_patch`
4. Map user traits to Bluecore customer properties
5. Construct the final payload with the Bluecore namespace
6. Send the payload to Bluecore's API

### Track Event Flow

1. Validate that the message type is `track`
2. Extract event name and properties
3. Check if the event name needs to be mapped using the event mapping configuration
4. Handle special events (optin, unsubscribe, subscription_event)
5. Map event properties to Bluecore properties
6. Include user information in the customer object
7. Construct the final payload with the Bluecore namespace
8. Send the payload to Bluecore's API

## Validations

### Required Fields

- **Bluecore Namespace**: Required in the destination configuration
- **Email**: Recommended for proper user identification
- **Event Type**: Must be either `identify` or `track`

### Field Formats

- **Email**: Must be a valid email format
- **Event Name**: String
- **Properties**: Object

## General Use Cases

The Bluecore integration enables the following use cases:

1. **User Profile Management**: Sending identify events to create and update user profiles in Bluecore
2. **E-commerce Tracking**: Tracking user interactions with products (views, searches, purchases)
3. **Marketing Subscription Management**: Managing user opt-in and opt-out preferences for marketing communications

## Exclusion Lists

The integration excludes certain fields from being sent to Bluecore:

- **Identify Exclusion List**: name, firstName, first_name, firstname, lastName, last_name, lastname, email, age, sex, address, action, event
- **Track Exclusion List**: All identify exclusions plus query, order_id, total, products

These fields are handled specially in the mapping logic.
