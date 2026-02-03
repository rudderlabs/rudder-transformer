# Klaviyo Destination

Implementation in **JavaScript**

## Configuration

### Required Settings

- **Private API Key**: Required for authentication with Klaviyo REST API

  - Passed via `Authorization: Klaviyo-API-Key {privateApiKey}` header
  - Must have appropriate permissions for profiles, events, and subscriptions

- **Public API Key**: Required for client-side SDK implementations (device mode)

- **API Version**: Specifies the Klaviyo API revision to use
  - `v1`: Uses revision `2023-02-22` (deprecated, scheduled for removal)
  - `v2`: Uses revision `2024-10-15` (recommended, default)

### Optional Settings

- **List ID**: Default list for subscribing users during identify calls

  - Used when `subscribe` trait is set to `true` in the event

- **Flatten Properties**: Enable to flatten nested user/event properties (default: `false`)

  - Transforms nested objects into dot-notation keys

- **Enforce Email As Primary**: When enabled, uses email or phone as primary identifier instead of external_id (default: `false`)

- **Consent**: Array of consent channels to apply (default: `["email"]`)

  - Options: `email`, `sms`
  - Controls which marketing channels users are subscribed to

- **Event Filtering**: Control which events are sent to Klaviyo
  - `eventFilteringOption`: `disable`, `whitelistedEvents`, or `blacklistedEvents`
  - `whitelistedEvents`: Array of allowed event names
  - `blacklistedEvents`: Array of blocked event names

## Integration Functionalities

> Klaviyo supports **Cloud mode** and **Device mode** (web only)

### Supported Message Types

| Connection Mode | Message Types                  |
| --------------- | ------------------------------ |
| Cloud           | identify, track, screen, group |
| Device (web)    | identify, track, page          |

### Batching Support

- **Supported**: Yes
- **Message Types**: Subscription events (subscribe/unsubscribe)
- **Batch Limits**:
  - Subscription events: 100 profiles per batch
  - Profile and Track events: Not batched together with subscriptions

### Rate Limits

Klaviyo uses a fixed-window rate limiting algorithm with burst (1-second) and steady (1-minute) windows. Rate limits are per-account.

#### Rate Limit Tiers

| Tier | Burst (per second) | Steady (per minute) |
| ---- | ------------------ | ------------------- |
| XS   | 1                  | 15                  |
| S    | 3                  | 60                  |
| M    | 10                 | 150                 |
| L    | 75                 | 700                 |
| XL   | 350                | 3500                |

#### Endpoint-Specific Rate Limits

The following endpoints are used by the Klaviyo transformer:

| Endpoint                                          | Purpose                        | Burst  | Steady  | Docs Reference                                                                                            |
| ------------------------------------------------- | ------------------------------ | ------ | ------- | --------------------------------------------------------------------------------------------------------- |
| `POST /api/profiles`                              | Create profile (V1)            | 75/s   | 700/m   | [Create Profile](https://developers.klaviyo.com/en/reference/create_profile)                              |
| `PATCH /api/profiles/{id}`                        | Update profile (V1)            | 75/s   | 700/m   | [Update Profile](https://developers.klaviyo.com/en/reference/update_profile)                              |
| `POST /api/profile-import`                        | Create/Update profile (V2)     | 75/s   | 700/m   | [Create or Update Profile](https://developers.klaviyo.com/en/reference/create_or_update_profile)          |
| `POST /api/events`                                | Create event                   | 350/s  | 3500/m  | [Create Event](https://developers.klaviyo.com/en/reference/create_event)                                  |
| `POST /api/profile-subscription-bulk-create-jobs` | Subscribe profiles to list     | 75/s   | 700/m   | [Bulk Subscribe](https://developers.klaviyo.com/en/reference/bulk_subscribe_profiles)                     |
| `POST /api/profile-subscription-bulk-delete-jobs` | Unsubscribe profiles from list | 75/s   | 700/m   | [Bulk Unsubscribe](https://developers.klaviyo.com/en/reference/bulk_unsubscribe_profiles)                 |

#### Rate Limit Headers

Non-429 responses include these headers:

- `RateLimit-Limit`: Maximum requests per time period
- `RateLimit-Remaining`: Approximate requests left in current window
- `RateLimit-Reset`: Seconds until window resets

#### Handling Rate Limit Errors

When rate limits are exceeded, Klaviyo returns `HTTP 429` with a `Retry-After` header. Implement exponential backoff with randomization to avoid thundering herd effects.

[Docs Reference](https://developers.klaviyo.com/en/docs/rate_limits_and_error_handling)

### Payload Limits

| Constraint               | Value               |
| ------------------------ | ------------------- |
| Max payload size         | 5 MB (decompressed) |
| Max properties per event | 400                 |
| Max string field size    | 100 KB              |
| Max array items          | 4,000               |
| Max nested object levels | 10                  |
| Max profile payload      | 100 KB              |

### Intermediate Calls

#### Identify Flow (V1 API - Two-Step Profile Creation)

- **Supported**: Yes
- **Use Case**: Create or update profile, then optionally subscribe to list
- **First Call**: `POST /api/profiles` - Create profile (returns 201 or 409 for duplicate)
- **Second Call**: `PATCH /api/profiles/{profileId}` - Update profile with additional properties (if profile already exists)
- **Optional Third Call**: `POST /api/profile-subscription-bulk-create-jobs` - Subscribe to list (if `subscribe` trait is true and `listId` is configured)

```javascript
// The condition that triggers subscription:
if (traitsInfo.subscribe && (message.context?.externalId || listId)) {
  // Add subscription request
}
```

#### Profile Deduplication Handling

When creating a profile that already exists (409 Conflict response), the transformer:

1. Extracts the duplicate profile ID from `errors[0].meta.duplicate_profile_id`
2. Uses this ID for subsequent PATCH operations instead of failing

### Profile Identification

- **External ID**: Uses `userId` or `context.externalId` with type `klaviyo-profileId`
- **Alias Support**: Creates profiles with email/phone as primary identifier when `enforceEmailAsPrimary` is enabled
- **Phone Number Validation**: V2 API requires E.164 format (e.g., `+15551234567`)

### Proxy Delivery

- **Supported**: No explicit proxy handler found
- The transformer implements careful event ordering for delivery consistency

### User Deletion

- **Full Profile Deletion**: Not supported by Klaviyo API
- **List Unsubscription**: Supported via `POST /api/profile-subscription-bulk-delete-jobs`
  - Used when GROUP event has `subscribe: false` trait

### OAuth Support

- **Supported**: No (uses API key authentication)

### Additional Functionalities

#### E-commerce Event Mapping

Special handling for e-commerce events with automatic event name conversion:

| RudderStack Event  | Klaviyo Event      |
| ------------------ | ------------------ |
| `product viewed`   | `Viewed Product`   |
| `product clicked`  | `Viewed Product`   |
| `product added`    | `Added to Cart`    |
| `checkout started` | `Started Checkout` |

#### Metadata Operations (V2 API)

The V2 API supports advanced profile operations via integrations object:

```javascript
// Via integrations.Klaviyo in the event
{
  "fieldsToUnset": ["old_property"],      // Remove properties from profile
  "fieldsToAppend": ["list_property"],    // Append to array properties
  "fieldsToUnappend": ["list_property"]   // Remove from array properties
}
```

#### Custom Properties Extraction

- Extracts custom properties from traits/properties beyond standard Klaviyo fields
- Optionally flattens nested objects when `flattenProperties` is enabled
- E-commerce events exclude specific keys from custom properties (product_id, sku, price, etc.)

#### Suppress Events Feature

- When a profile is newly created (201 response), the transformer can return a 299 status code
- This signals to suppress duplicate processing for events that created the profile

## General Queries

### Event Ordering

#### Identify, Group

These event types modify user profiles and list subscriptions. Event ordering is important to avoid:

- Stale profile data overwriting newer updates
- Incorrect subscription states

**Recommendation**: Maintain ordering for profile-modifying events.

#### Track, Screen

Track events include a `time` field populated from the event's timestamp. Klaviyo processes events based on this timestamp, reducing strict ordering requirements.

However, if track events include profile attributes, those attributes should still be ordered.

> For best results, maintain event ordering for all event types that modify profile data.

### Data Replay Feasibility

#### Missing Data Replay

- **Identify Events**: Feasible with caution. Profile updates are idempotent, but ordering matters.
- **Track Events**: Feasible. Each event has a unique_id (derived from messageId) to prevent duplicates.
- **Group Events**: Feasible. Subscription state can be re-established.

#### Already Delivered Data Replay

- **Track Events**: Klaviyo supports `unique_id` field to identify duplicate events

  - Events with the same `unique_id`, metric, and profile are deduplicated
  - The transformer uses `messageId` as `unique_id`
  - Replay is feasible if events have consistent messageIds

- **Identify Events**: Profile updates are idempotent (same data produces same result)
  - Replay is feasible but may trigger unnecessary API calls

### Multiplexing

- **Supported**: Yes
- **Description**: The Klaviyo destination can generate multiple API calls from a single input event.

#### Multiplexing Scenarios

1. **Identify Events with Subscription**:

   - **Multiplexing**: YES
   - First API Call: `POST /api/profiles` or `PATCH /api/profiles/{id}` - Update profile
   - Second API Call: `POST /api/profile-subscription-bulk-create-jobs` - Subscribe to list
   - **Condition**: `subscribe` trait is true and `listId` is configured

2. **Group Events**:

   - **Multiplexing**: NO
   - Single call to subscription endpoint based on `subscribe` trait value

3. **Track/Screen Events**:
   - **Multiplexing**: NO
   - Single call to `POST /api/events`

#### Event Type Grouping

The transformer groups consecutive events of the same type to maintain ordering while optimizing batching:

```javascript
// Input: ['user1 track1', 'user1 identify 1', 'user1 track 2', 'user2 identify 1']
// Grouped: [['user1 track1'], ['user1 identify 1', 'user2 identify 1'], ['user1 track 2']]
```

## Version Information

### Current Version

- **V1 API**: Revision `2023-02-22` (deprecated)
- **V2 API**: Revision `2024-10-15` (current default)

### API Version Lifecycle

Klaviyo provides **2 years** of support for each API revision:

1. **Stable** (Year 1): Active support, non-breaking changes only
2. **Deprecated** (Year 2): Use discouraged, migration recommended
3. **Retired** (Year 3+): No longer supported, breakages likely

### Version Deprecation Schedule

| Revision   | Status     | Planned Retirement |
| ---------- | ---------- | ------------------ |
| 2023-02-22 | Deprecated | ~February 2025     |
| 2024-10-15 | Stable     | ~October 2026      |

**Recommendation**: Use `apiVersion: v2` for new integrations and upgrade existing integrations to avoid deprecation.

### Breaking Changes Between Versions

- V2 requires E.164 phone number format
- V2 uses `/api/profile-import` instead of `/api/profiles` for profile creation
- V2 supports additional metadata operations (fieldsToUnset, fieldsToAppend, fieldsToUnappend)

[Version Policy Reference](https://developers.klaviyo.com/en/docs/api_versioning_and_deprecation_policy)

## Processor vs Router Destination

- **Type**: Router destination (`transformAtV1: "router"`)
- This enables batching of subscription events and event ordering optimization

## Partial Batching Response Handling

- No explicit `networkHandler.js` found in the destination directory, not on transformer Proxy
- Error handling for partial batch failures is not implemented

## Validations

### Required Fields

| Event Type | Required Fields                                                   |
| ---------- | ----------------------------------------------------------------- |
| Identify   | At least one of: `email`, `phone_number`, `external_id`, `userId` |
| Track      | `event` name, profile identifier                                  |
| Group      | `groupId` (used as list ID), `subscribe` trait                    |
| Screen     | `name`, profile identifier                                        |

### Phone Number Format

- V2 API: Must be E.164 format (e.g., `+15551234567`)
- Throws `InstrumentationError` if invalid format

### Profile Identifier Priority

1. `destination external_id` with type `klaviyo-profileId`
2. `userId`
3. Email/phone (when `enforceEmailAsPrimary` is enabled)
4. `anonymousId` (not recommended, prefer email/phone)

## Documentation Links

### REST API Documentation

- [Klaviyo API Overview](https://developers.klaviyo.com/en/reference/api_overview)
- [Profiles API](https://developers.klaviyo.com/en/reference/profiles_api_overview)
- [Events API](https://developers.klaviyo.com/en/reference/events_api_overview)
- [Subscriptions API](https://developers.klaviyo.com/en/reference/bulk_subscribe_profiles)
- [Rate Limits](https://developers.klaviyo.com/en/docs/rate_limits_and_error_handling)
- [API Versioning Policy](https://developers.klaviyo.com/en/docs/api_versioning_and_deprecation_policy)

### RETL Functionality

For RETL (Reverse ETL) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
