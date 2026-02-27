# Klaviyo Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Klaviyo destination integration. It covers how RudderStack events are mapped to Klaviyo's API format, the specific API endpoints used for each event type, and the special handling for various event types.

## API Versions

The Klaviyo destination supports two API versions:

| Config Value | API Revision | Status            |
| ------------ | ------------ | ----------------- |
| `v1`         | `2023-02-22` | Deprecated        |
| `v2`         | `2024-10-15` | Current (Default) |

The API version is selected via `destination.Config.apiVersion` and affects endpoints, request formats, and available features.

## API Endpoints and Request Flow

### Identify Events

#### V1 API Flow

**Primary Endpoint**: `POST /api/profiles`
**Update Endpoint**: `PATCH /api/profiles/{profileId}`
**Subscription Endpoint**: `POST /api/profile-subscription-bulk-create-jobs`

**Documentation**: [Klaviyo Profiles API](https://developers.klaviyo.com/en/reference/profiles_api_overview)

**Request Flow**:

1. **Profile Creation Attempt**:

   ```
   POST https://a.klaviyo.com/api/profiles
   Headers:
     Authorization: Klaviyo-API-Key {privateApiKey}
     Content-Type: application/json
     Accept: application/json
     revision: 2023-02-22
   ```

2. **Handle Response**:

   - HTTP 201 (Created): Profile created, extract `profileId` from response
   - HTTP 409 (Conflict): Profile exists, extract `duplicate_profile_id` from `errors[0].meta`

3. **Profile Update** (if 409 received):

   ```
   PATCH https://a.klaviyo.com/api/profiles/{profileId}
   ```

4. **Optional Subscription** (if `subscribe` trait is true and `listId` exists):
   ```
   POST https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs
   ```

#### V2 API Flow

**Primary Endpoint**: `POST /api/profile-import`
**Subscription Endpoint**: `POST /api/profile-subscription-bulk-create-jobs`

**Request Flow**:

1. **Profile Import**:

   ```
   POST https://a.klaviyo.com/api/profile-import
   Headers:
     Authorization: Klaviyo-API-Key {privateApiKey}
     Content-Type: application/json
     Accept: application/json
     revision: 2024-10-15
   ```

2. **Optional Subscription** (same as V1)

#### Identify Payload Structure

**V1 Profile Payload**:

```json
{
  "data": {
    "type": "profile",
    "attributes": {
      "email": "user@example.com",
      "phone_number": "+15551234567",
      "external_id": "user123",
      "first_name": "John",
      "last_name": "Doe",
      "organization": "Company",
      "title": "Engineer",
      "image": "https://example.com/avatar.jpg",
      "location": {
        "address1": "123 Main St",
        "address2": "Apt 4",
        "city": "San Francisco",
        "region": "CA",
        "zip": "94103",
        "country": "US",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "timezone": "America/Los_Angeles"
      },
      "properties": {
        "custom_field": "value"
      }
    }
  }
}
```

**V2 Profile Payload**:

```json
{
  "data": {
    "type": "profile",
    "attributes": {
      "email": "user@example.com",
      "phone_number": "+15551234567",
      "external_id": "user123",
      "first_name": "John",
      "last_name": "Doe",
      "properties": {
        "custom_field": "value"
      },
      "meta": {
        "patch_properties": {
          "unset": ["old_field"],
          "append": { "list_field": "new_item" },
          "unappend": { "list_field": "removed_item" }
        }
      }
    }
  }
}
```

### Track Events

**Endpoint**: `POST /api/events`
**Documentation**: [Klaviyo Events API](https://developers.klaviyo.com/en/reference/events_api_overview)

**Request Flow**:

1. For all track events:
   ```
   POST https://a.klaviyo.com/api/events
   Headers:
     Authorization: Klaviyo-API-Key {privateApiKey}
     Content-Type: application/json
     Accept: application/json
     revision: 2023-02-22 (v1) or 2024-10-15 (v2)
   ```

**Payload Structure**:

```json
{
  "data": {
    "type": "event",
    "attributes": {
      "metric": {
        "data": {
          "type": "metric",
          "attributes": {
            "name": "Event Name"
          }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "attributes": {
            "email": "user@example.com",
            "external_id": "user123"
          }
        }
      },
      "properties": {
        "custom_property": "value"
      },
      "time": "2024-01-15T12:00:00Z",
      "unique_id": "message-id-123"
    }
  }
}
```

### Screen Events

**Endpoint**: `POST /api/events`

Screen events are converted to track events with the screen name as the event name.

**Event Name Mapping**:

- Screen event with name "Home" → Track event "Home"

### Group Events

**Subscribe Endpoint**: `POST /api/profile-subscription-bulk-create-jobs`
**Unsubscribe Endpoint**: `POST /api/profile-subscription-bulk-delete-jobs`

**Documentation**: [Klaviyo Subscriptions API](https://developers.klaviyo.com/en/reference/bulk_subscribe_profiles)

**Request Flow**:

1. Validate required fields:

   - `groupId` is required (used as Klaviyo list ID)
   - `subscribe` trait determines subscribe/unsubscribe operation

2. Make subscription API call based on `subscribe` trait value

**Subscribe Payload**:

```json
{
  "data": {
    "type": "profile-subscription-bulk-create-job",
    "attributes": {
      "profiles": {
        "data": [
          {
            "type": "profile",
            "attributes": {
              "email": "user@example.com",
              "phone_number": "+15551234567",
              "subscriptions": {
                "email": { "marketing": { "consent": "SUBSCRIBED" } },
                "sms": { "marketing": { "consent": "SUBSCRIBED" } }
              }
            }
          }
        ]
      }
    },
    "relationships": {
      "list": {
        "data": {
          "type": "list",
          "id": "LIST_ID"
        }
      }
    }
  }
}
```

**Unsubscribe Payload**:

```json
{
  "data": {
    "type": "profile-subscription-bulk-delete-job",
    "attributes": {
      "profiles": {
        "data": [
          {
            "type": "profile",
            "attributes": {
              "email": "user@example.com"
            }
          }
        ]
      }
    },
    "relationships": {
      "list": {
        "data": {
          "type": "list",
          "id": "LIST_ID"
        }
      }
    }
  }
}
```

## Data Mapping

### Standard Profile Fields

| RudderStack Field     | Klaviyo Field  | Notes                        |
| --------------------- | -------------- | ---------------------------- |
| `userId`              | `external_id`  | Primary identifier           |
| `traits.email`        | `email`        | Required for subscriptions   |
| `traits.phone`        | `phone_number` | E.164 format required for V2 |
| `traits.firstName`    | `first_name`   |                              |
| `traits.lastName`     | `last_name`    |                              |
| `traits.title`        | `title`        |                              |
| `traits.organization` | `organization` |                              |
| `traits.avatar`       | `image`        | URL to profile image         |

### Location Mapping

| RudderStack Field            | Klaviyo Field        |
| ---------------------------- | -------------------- |
| `traits.address.street`      | `location.address1`  |
| `traits.address.city`        | `location.city`      |
| `traits.address.state`       | `location.region`    |
| `traits.address.postalCode`  | `location.zip`       |
| `traits.address.country`     | `location.country`   |
| `context.location.latitude`  | `location.latitude`  |
| `context.location.longitude` | `location.longitude` |
| `context.timezone`           | `location.timezone`  |

### Track Event Mapping

| RudderStack Field | Klaviyo Field | Notes             |
| ----------------- | ------------- | ----------------- |
| `event`           | `metric.name` | Event type/name   |
| `properties`      | `properties`  | Custom event data |
| `timestamp`       | `time`        | ISO 8601 format   |
| `messageId`       | `unique_id`   | Deduplication key |

### E-commerce Event Mapping

| RudderStack Event  | Klaviyo Event      |
| ------------------ | ------------------ |
| `product viewed`   | `Viewed Product`   |
| `product clicked`  | `Viewed Product`   |
| `product added`    | `Added to Cart`    |
| `checkout started` | `Started Checkout` |

### E-commerce Product Properties

| RudderStack Field       | Klaviyo Field       |
| ----------------------- | ------------------- |
| `properties.product_id` | `ProductID`         |
| `properties.sku`        | `SKU`               |
| `properties.name`       | `ProductName`       |
| `properties.quantity`   | `Quantity`          |
| `properties.price`      | `ItemPrice`         |
| `properties.url`        | `ProductURL`        |
| `properties.image_url`  | `ImageURL`          |
| `properties.categories` | `ProductCategories` |

## Special Handling

### Profile Identifier Priority

The transformer determines profile identifier using this priority:

1. **Destination External ID**: `context.externalId` with type `klaviyo-profileId`
2. **User ID**: `message.userId`
3. **Email/Phone**: When `enforceEmailAsPrimary` is enabled
4. **Anonymous ID**: Fallback (not recommended)

```javascript
// Code reference for external ID extraction
const profileId = getDestinationExternalIDInfoForRetl(message, 'klaviyo-profileId')?.objectId;
```

### Phone Number Validation (V2 API)

V2 API requires E.164 format for phone numbers:

```javascript
// Valid: +15551234567
// Invalid: (555) 123-4567, 555-123-4567
```

The transformer uses `libphonenumber-js` to validate phone numbers and throws `InstrumentationError` if invalid.

### Custom Properties Extraction

Custom properties are extracted from traits/properties excluding whitelisted Klaviyo fields:

**Whitelisted Fields (excluded from custom properties)**:

- `email`, `phone`, `firstName`, `lastName`, `title`, `organization`
- `city`, `region`, `country`, `zip`, `address`, `timezone`
- `latitude`, `longitude`, `location`, `image`

**E-commerce Exclusion Keys** (for e-commerce events):

- `name`, `product_id`, `sku`, `image_url`, `url`, `brand`, `price`
- `compare_at_price`, `quantity`, `categories`, `products`, `product_names`
- `order_id`, `value`, `checkout_url`, `item_names`, `items`

### Property Flattening

When `flattenProperties` is enabled:

```javascript
// Input
{
  "custom": {
    "nested": {
      "value": "test"
    }
  }
}

// Output (flattened)
{
  "custom.nested.value": "test"
}
```

### Metadata Operations (V2 API)

V2 API supports advanced property operations via integrations object:

```javascript
// Event integrations object
{
  "integrations": {
    "Klaviyo": {
      "fieldsToUnset": ["old_property"],      // Remove properties
      "fieldsToAppend": ["tags"],              // Append to arrays
      "fieldsToUnappend": ["tags"]             // Remove from arrays
    }
  }
}
```

These operations are included in the profile's `meta.patch_properties` object.

## Batching Logic

### Subscription Batching

Subscription events are batched for efficiency:

1. **Grouping**: Events grouped by list ID
2. **Chunking**: Groups chunked into MAX_BATCH_SIZE (100) profiles
3. **Merging**: Profiles in each chunk merged into single request

```javascript
// Batching flow
const subscribeEventGroups = lodash.groupBy(
  subscribeResponseList,
  (event) => event.message.body.JSON.data.attributes.list_id,
);

// Chunk each group
const chunks = lodash.chunk(profiles, MAX_BATCH_SIZE);
```

### Event Ordering

The transformer maintains event ordering through type-based grouping:

```javascript
// Input sequence
['track1', 'identify1', 'track2', 'identify2', 'track3'][
  // Grouped by type
  (['track1'], ['identify1', 'identify2'], ['track2', 'track3'])
];

// Processed in order, maintaining relative sequence
```

## Error Handling

### Profile Creation Errors

| Status Code | Meaning           | Action                                       |
| ----------- | ----------------- | -------------------------------------------- |
| 201         | Profile created   | Extract profileId, continue                  |
| 409         | Duplicate profile | Extract duplicate_profile_id, use for update |
| 400         | Bad request       | Throw InstrumentationError                   |
| 401         | Unauthorized      | Throw ConfigurationError                     |
| 429         | Rate limited      | Retry with backoff                           |
| 5xx         | Server error      | Retry                                        |

### Validation Errors

| Error Type             | Cause                     | Resolution                                |
| ---------------------- | ------------------------- | ----------------------------------------- |
| `InstrumentationError` | Missing required field    | Ensure email/phone/userId is provided     |
| `InstrumentationError` | Invalid phone format (V2) | Use E.164 format                          |
| `ConfigurationError`   | Missing privateApiKey     | Configure API key in destination settings |
| `InstrumentationError` | Missing groupId           | Provide groupId for group events          |

## Suppressed Events

The transformer can suppress duplicate processing:

- When profile is newly created (201 response) and `isNewStatusCodesAccepted()` returns true
- Returns status code 299 to signal event suppression
- Prevents duplicate profile creation from subsequent events

## Consent Handling

### Consent Channels

Consent is managed via `destination.Config.consent` array:

- `email`: Email marketing consent
- `sms`: SMS marketing consent

### Subscription Consent Structure

```json
{
  "subscriptions": {
    "email": {
      "marketing": {
        "consent": "SUBSCRIBED"
      }
    },
    "sms": {
      "marketing": {
        "consent": "SUBSCRIBED"
      }
    }
  }
}
```

## Mapping Configuration Files

The mapping configuration is defined in JSON files within the destination `data/` directory:

| File                    | Purpose                             |
| ----------------------- | ----------------------------------- |
| `KlaviyoIdentify.json`  | V1 identify event mapping           |
| `KlaviyoProfileV2.json` | V2 profile mapping                  |
| `KlaviyoTrack.json`     | V1 track event mapping              |
| `KlaviyoTrackV2.json`   | V2 track event mapping              |
| `KlaviyoGroup.json`     | Group event mapping                 |
| `KlaviyoProfile.json`   | Profile structure mapping           |
| `ViewedProduct.json`    | Viewed Product e-commerce mapping   |
| `AddedToCart.json`      | Added to Cart e-commerce mapping    |
| `StartedCheckout.json`  | Started Checkout e-commerce mapping |
| `Items.json`            | Product items array mapping         |
