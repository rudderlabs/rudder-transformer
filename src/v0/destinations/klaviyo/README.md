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
  - `v2`: Uses revision `2024-10-15` (deprecated, scheduled for removal)
  - `v3`: Uses revision `2026-04-15` (default)

### Optional Settings

- **List ID**: Default list for subscribing users during identify calls

  - Used when `subscribe` trait is set to `true` in the event

- **Flatten Properties**: Enable to flatten nested user/event properties (default: `false`)

  - Transforms nested objects into dot-notation keys

- **Enforce Email As Primary**: When enabled, uses email or phone as primary identifier instead of external_id (default: `false`)

- **Consent**: Array of consent channels to manage (default: `["email"]`)

  - Options: `email`, `sms`
  - Controls which marketing channels users are subscribed to

- **Event Filtering**: Control which events are sent to Klaviyo
  - `eventFilteringOption`: `disable`, `whitelistedEvents`, or `blacklistedEvents`
  - `whitelistedEvents`: Array of allowed event names
  - `blacklistedEvents`: Array of blocked event names

## Integration Functionalities

> Klaviyo supports **Cloud mode** and **Device mode**

### Supported Message Types

| Connection Mode | Message Types                  |
| --------------- | ------------------------------ |
| Cloud           | identify, track, screen, group |
| Device (web)    | identify, track, page          |

### Batching Support

- **Supported**: Yes (both V1 and V2)
- **Message Types**: Subscription events (subscribe/unsubscribe)
- **Batch Limits**:
  - Subscription events: 100 profiles per batch
  - Profile and Track events: Not batched together with subscriptions

All API versions use `MAX_BATCH_SIZE` (100) when chunking subscription requests. V1 batches subscribe requests to `POST /api/profile-subscription-bulk-create-jobs`. V2 and V3 batch both subscribe requests to `POST /api/profile-subscription-bulk-create-jobs` and unsubscribe requests to `POST /api/profile-subscription-bulk-delete-jobs`. Profile and track events are sent individually.

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

| Endpoint                                          | Purpose                        | Burst | Steady | Docs Reference                                                                                   |
| ------------------------------------------------- | ------------------------------ | ----- | ------ | ------------------------------------------------------------------------------------------------ |
| `POST /api/profiles`                              | Create profile (V1)            | 75/s  | 700/m  | [Create Profile](https://developers.klaviyo.com/en/reference/create_profile)                     |
| `PATCH /api/profiles/{id}`                        | Update profile (V1)            | 75/s  | 700/m  | [Update Profile](https://developers.klaviyo.com/en/reference/update_profile)                     |
| `POST /api/profile-import`                        | Create/Update profile (V2)     | 75/s  | 700/m  | [Create or Update Profile](https://developers.klaviyo.com/en/reference/create_or_update_profile) |
| `POST /api/events`                                | Create event                   | 350/s | 3500/m | [Create Event](https://developers.klaviyo.com/en/reference/create_event)                         |
| `POST /api/profile-subscription-bulk-create-jobs` | Subscribe profiles to list     | 75/s  | 700/m  | [Bulk Subscribe](https://developers.klaviyo.com/en/reference/bulk_subscribe_profiles)            |
| `POST /api/profile-subscription-bulk-delete-jobs` | Unsubscribe profiles from list | 75/s  | 700/m  | [Bulk Unsubscribe](https://developers.klaviyo.com/en/reference/bulk_unsubscribe_profiles)        |

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

#### E-commerce Event Mapping (V1 API Only)

Special handling for e-commerce events with automatic event name conversion is **supported only when using the V1 API** (`apiVersion: v1`). The V2 API passes event names through as-is without conversion.

| RudderStack Event  | Klaviyo Event (V1) |
| ------------------ | ------------------ |
| `product viewed`   | `Viewed Product`   |
| `product clicked`  | `Viewed Product`   |
| `product added`    | `Added to Cart`    |
| `checkout started` | `Started Checkout` |

When using the V2 API, send events with the desired Klaviyo metric names directly (e.g., `Viewed Product`, `Added to Cart`).

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

   - **Multiplexing**: YES (both V1 and V2)
   - **Condition**: `subscribe` trait is defined and `listId` is configured

   | API | First API Call                                                             | Second API Call                                                                                                                  |
   | --- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
   | V1  | `POST /api/profiles` or `PATCH /api/profiles/{id}` - Create/update profile | `POST /api/profile-subscription-bulk-create-jobs` - Subscribe to list                                                            |
   | V2  | `POST /api/profile-import` - Create/update profile                         | `POST /api/profile-subscription-bulk-create-jobs` (subscribe) or `POST /api/profile-subscription-bulk-delete-jobs` (unsubscribe) |

   - **Note**: V1 only supports subscription (`subscribe: true`). V2 and V3 both support subscribe and unsubscribe based on the `subscribe` trait value.
   - **V3 Note**: Subscription payloads always include a `subscriptions` object built from consent config (and trait overrides). If the resolved subscriptions are empty (no consent provided, or consent channels don't match available identifiers), the transformer rejects the event with an `InstrumentationError` before it reaches Klaviyo.

2. **Group Events**:

   - **Multiplexing**: NO (both V1 and V2)
   - Single call to subscription endpoint based on `subscribe` trait value
   - **V1**: Subscribe only (`subscribe: true` required) → `POST /api/profile-subscription-bulk-create-jobs`
   - **V2**: Subscribe or unsubscribe → `POST /api/profile-subscription-bulk-create-jobs` or `POST /api/profile-subscription-bulk-delete-jobs`

3. **Track/Screen Events**:

   - **Multiplexing**: NO (both V1 and V2)
   - Single call to `POST /api/events`

#### Event Type Grouping

The transformer groups consecutive events of the same type to maintain ordering while optimizing batching:

```javascript
// Input: ['user1 track1', 'user1 identify 1', 'user1 track 2', 'user2 identify 1']
// Grouped: [['user1 track1'], ['user1 identify 1', 'user2 identify 1'], ['user1 track 2']]
```

## Version Information

### Current Version

- **API:** `apiVersion: v1` (also used when `apiVersion` is not set)
- **Version:** `2023-02-22`
- **Where in code:** `config.ts` (`KLAVIYO_VERSION_CONFIG[KLAVIYO_API_VERSION.V1].revision`, `getKlaviyoRevision`)
- **API:** `apiVersion: v2`
- **Version:** `2024-10-15`
- **Where in code:** `config.ts` (`KLAVIYO_VERSION_CONFIG[KLAVIYO_API_VERSION.V2].revision`, `getKlaviyoRevision`)
- **API:** `apiVersion: v3`
- **Version:** `2026-04-15`
- **Where in code:** `config.ts` (`KLAVIYO_VERSION_CONFIG[KLAVIYO_API_VERSION.V3].revision`, `getKlaviyoRevision`)

The revision is sent in the `revision` request header. `transform.ts` also hardcodes `2023-02-22` for one request path.

### Version Deprecation

- **API:** `apiVersion: v1`
- **Status:** Sunset
- **Sunset date:** 2025-02-22
- **Source:** [API versioning and deprecation policy](https://developers.klaviyo.com/en/docs/api_versioning_and_deprecation_policy)
- **API:** `apiVersion: v2`
- **Status:** Sunset
- **Sunset date:** 2026-10-15
- **Source:** [Klaviyo API changelog](https://developers.klaviyo.com/en/docs/changelog_)
- **API:** `apiVersion: v3`
- **Status:** Supported
- **Sunset date:** 2028-04-15
- **Source:** [API versioning and deprecation policy](https://developers.klaviyo.com/en/docs/api_versioning_and_deprecation_policy)

Klaviyo supports each revision for 2 years: stable for the first year, deprecated for the second, then retired ("no longer supported"). The changelog states `2024-10-15` was supported until 2026-10-15. The `2023-02-22` and `2026-04-15` dates are derived from the 2-year policy; `2026-04-15` becomes deprecated on 2027-04-15. Retired revisions may still respond but can break without notice.

**Recommendation**: `apiVersion: v1` and `v2` now send retired revisions. Use `apiVersion: v3` when strict consent enforcement on both subscribe and unsubscribe requests is acceptable.

### Latest Available Version

- **Version:** `2026-10-15`
- **Released:** 2026-10-15
- **Upgrade needed:** Yes
- **Source:** [Klaviyo API changelog](https://developers.klaviyo.com/en/docs/changelog_)

**Breaking changes between `apiVersion` settings:**

- V2 requires E.164 phone number format
- V2 uses `/api/profile-import` instead of `/api/profiles` for profile creation
- V2 supports additional metadata operations (fieldsToUnset, fieldsToAppend, fieldsToUnappend)

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

Identifier priority depends on configuration and API version.

**V1 API**:

- **If `enforceEmailAsPrimary` is enabled**: Use `email` and `phone_number` as identifiers. `external_id` is omitted.
- **Otherwise**: Use `external_id` (mapped from `userId`).

**V2 API**:

1. **If `context.externalId` with type `klaviyo-profileId` is present**: Mapped to `data.id` for profile update operations (e.g., when profile already exists in Klaviyo).
2. **If `enforceEmailAsPrimary` is enabled**: Use `email` and `phone_number` as identifiers. `external_id` is omitted.
3. **Otherwise**: Use `external_id` (mapped from `userId`).

## Documentation Links

### REST API Documentation

- [Klaviyo API Overview](https://developers.klaviyo.com/en/reference/api_overview)
- [Authentication](https://developers.klaviyo.com/en/docs/authenticate_)
- [Profiles API](https://developers.klaviyo.com/en/reference/profiles_api_overview)
- [Create Profile](https://developers.klaviyo.com/en/reference/create_profile)
- [Update Profile](https://developers.klaviyo.com/en/reference/update_profile)
- [Create or Update Profile (profile-import)](https://developers.klaviyo.com/en/reference/create_or_update_profile)
- [Events API](https://developers.klaviyo.com/en/reference/events_api_overview)
- [Create Event](https://developers.klaviyo.com/en/reference/create_event)
- [Subscriptions API](https://developers.klaviyo.com/en/reference/bulk_subscribe_profiles)
- [Bulk Unsubscribe Profiles](https://developers.klaviyo.com/en/reference/bulk_unsubscribe_profiles)
- [Rate Limits](https://developers.klaviyo.com/en/docs/rate_limits_and_error_handling)
- [API Versioning Policy](https://developers.klaviyo.com/en/docs/api_versioning_and_deprecation_policy)

### Changelog References

- **Changelog:** [Klaviyo API changelog](https://developers.klaviyo.com/en/docs/changelog_)
- **Deprecations:** [API versioning and deprecation policy](https://developers.klaviyo.com/en/docs/api_versioning_and_deprecation_policy)
- **Versions:** [API overview and revisions](https://developers.klaviyo.com/en/reference/api_overview)
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

### RETL Functionality

For RETL (Reverse ETL) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
