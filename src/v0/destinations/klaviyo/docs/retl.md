# Klaviyo RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes**

The Klaviyo destination supports RETL functionality. Evidence:

- `supportedSourceTypes` includes `warehouse` which indicates RETL support
- JSON mapper is supported by default (no `disableJsonMapper: true` in config)
- `supportsVisualMapper: true` indicates VDM v1 support
- Supports data flow from warehouses/databases to Klaviyo

## RETL Support Analysis

### Which type of RETL support does it have?

- **JSON Mapper**: Supported (default, no `disableJsonMapper: true`)
- **VDM V1**: Supported (`supportsVisualMapper: true` in `db-config.json`)
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`)

### Does it have VDM support?

**Yes** - `supportsVisualMapper: true` is present in `db-config.json`, confirming VDM V1 support.

### Does it have VDM V2 support?

**No** - Missing both:

- `supportedMessageTypes > record` in `db-config.json`
- Record event type handling in transformer code

### Connection Config

Standard Klaviyo configuration applies:

- **Private API Key**: Klaviyo private API key for authentication
- **Public API Key**: Klaviyo public API key
- **API Version**: v1 or v2 (v2 recommended)
- **List ID**: Default list for subscriptions
- **Consent**: Email and/or SMS consent channels
- **Flatten Properties**: Option to flatten nested properties

## RETL Flow Implementation

### Warehouse Integration

Klaviyo supports RETL through warehouse sources with both JSON mapper and VDM v1 functionality:

- **Supported**: Yes, warehouse sources can send data to Klaviyo via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: group, identify, screen, track
- **Data Flow**: Warehouse/Database → RudderStack → Klaviyo (via REST API)
- **Mapping**: JSON mapper and VDM v1 transform warehouse data to Klaviyo format

### Supported Message Types for RETL

```json
"supportedMessageTypes": {
  "cloud": ["group", "identify", "screen", "track"]
}
```

### RETL Event Processing

The Klaviyo destination processes RETL events similarly to event stream events, with the following considerations:

#### Key RETL-Specific Behaviors

1. **Profile Creation/Update**:

   - RETL identify events create or update profiles in Klaviyo
   - Uses the same two-step process (create → update) as event stream
   - Profile deduplication handled via 409 Conflict response

2. **List Subscriptions**:

   - Group events can subscribe/unsubscribe profiles from lists
   - Requires `groupId` (as list ID) and `subscribe` trait

3. **Event Tracking**:

   - Track events from RETL sources create events in Klaviyo
   - Supports e-commerce event mapping

4. **Mapped to Destination Support**:
   - **NEEDS REVIEW**: The Klaviyo transformer may support `context.mappedToDestination` flag for pre-formatted data
   - When enabled, traits may be passed directly without standard mapping

## Data Flow

### RETL Data Processing

1. **Data Extraction**: Warehouse/database data extracted by RudderStack
2. **Mapping**: Data transformed using JSON mapper or VDM v1 configuration
3. **Event Construction**: Warehouse records converted to Klaviyo events
4. **API Delivery**: Events sent to Klaviyo via REST API endpoints

### Example RETL Identify Event

```json
{
  "type": "identify",
  "userId": "user123",
  "traits": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+15551234567",
    "subscribe": true,
    "custom_attribute": "value"
  },
  "context": {
    "externalId": [
      {
        "id": "klaviyo_profile_id",
        "type": "klaviyo-profileId"
      }
    ]
  }
}
```

### Example RETL Track Event

```json
{
  "type": "track",
  "userId": "user123",
  "event": "Order Completed",
  "properties": {
    "orderId": "order_123",
    "total": 99.99,
    "currency": "USD",
    "products": [
      {
        "product_id": "prod_1",
        "name": "Product Name",
        "price": 49.99,
        "quantity": 2
      }
    ]
  }
}
```

### Example RETL Group Event (Subscribe to List)

```json
{
  "type": "group",
  "userId": "user123",
  "groupId": "LIST_ID_HERE",
  "traits": {
    "subscribe": true,
    "email": "user@example.com"
  }
}
```

## Rate Limits and Constraints

### Klaviyo API Limits

- **REST API**: Standard Klaviyo API rate limits apply
- **Batch Size**: 100 profiles per subscription batch
- **Request Rate**: Per-account limits with burst and steady windows

### RETL Processing Constraints

- **Message Types**: Supports identify, track, screen, and group
- **JSON Mapper and VDM v1**: Both supported for data transformation
- **Cloud Mode Only**: Device mode not supported for RETL
- **Profile Identifiers**: Email, phone (E.164), or external_id required

## Batching for RETL

### Subscription Batching

RETL events that result in subscription operations are batched:

- **Batch Size**: Up to 100 profiles per API call
- **Grouping**: Subscriptions grouped by list ID
- **Ordering**: Profiles updates processed before subscriptions

### Profile Updates

Profile update events are not batched together but maintain ordering for consistency.

## Summary

The Klaviyo destination supports RETL functionality through:

- **RETL Support**: Yes, via warehouse source type support
- **JSON Mapper**: Supported by default for data transformation
- **VDM v1**: Supported (`supportsVisualMapper: true`)
- **VDM v2**: Not supported (no `record` message type)
- **Supported Events**: identify, track, screen, group
- **API Integration**: Klaviyo REST API for data delivery

**Key Features**:

- Profile creation and updates from warehouse data
- List subscription management via group events
- E-commerce event tracking with automatic mapping
- Batch subscription operations for efficiency

**Limitations**:

- No VDM v2 support (no record message type)
- Cloud mode only for RETL functionality
- No full profile deletion (only list unsubscription)
