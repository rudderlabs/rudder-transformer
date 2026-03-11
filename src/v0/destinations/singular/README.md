# Singular Destination

Implementation in **TypeScript** (v0)

## Configuration

### Required Settings

- **API Key**: Singular SDK Key for API authentication (required)

  - Retrieve from: Singular UI → Main Menu → [Developer Tools](https://app.singular.net/?#/react/sdk_integration)
  - Do NOT use Reporting API Key - requests will be rejected
  - Pattern: Alphanumeric with underscores (e.g., `sdkKey_afdadsf7asf56`)

### Optional Settings

- **API Secret**: Secret key for additional authentication

  - Pattern: Alphanumeric only

- **Session Event List**: Custom events to treat as session events

  - These are in addition to default session events: `Application Installed`, `Application Updated`, `Application Opened`
  - Default session events are matched **case-insensitively** (e.g., `application installed`, `Application Installed`, `APPLICATION INSTALLED` all work)
  - Custom session events from `sessionEventList` are matched **case-sensitively** (exact match required)
  - All session events are sent to the SESSION endpoint (`/api/v1/launch`) instead of the EVENT endpoint

- **Match ID (Unity platforms)**: Match ID source for Unity/PC/Console platforms

  - Options: `advertisingId` (default) or `hash` (maps to `properties.match_id`)
  - Used for PC/Console game attribution where standard mobile device IDs are not available
  - [PC & Console Game Integration Guide](https://support.singular.net/hc/en-us/articles/19147380039579-PC-Console-Game-Integration-Guide)

- **Event Filtering**: Client-side event filtering for device-mode integrations

  - Options: Disable, Allowlist (whitelistedEvents), Denylist (blacklistedEvents)

- **Consent Management**: Support for OneTrust, Ketch, Iubenda, and Custom consent providers

## Integration Functionalities

> Singular supports **Device mode** and **Cloud mode** for mobile platforms (Android, iOS, React Native, Cordova)

### Implementation Type

- **v0 TypeScript Implementation**: Located at `src/v0/destinations/singular/`
- **Not CDK v2**: Standard v0 destination implementation

### Supported Message Types

- **Track** (Cloud mode only)

| Platform     | Cloud Mode | Device Mode             |
| ------------ | ---------- | ----------------------- |
| Android      | track      | identify, track, screen |
| iOS          | track      | identify, track, screen |
| React Native | track      | identify, track, screen |
| Cordova      | track      | identify, track, screen |
| Web          | track      | -                       |
| Unity        | track      | -                       |
| Flutter      | track      | -                       |
| Cloud        | track      | -                       |
| Warehouse    | track      | -                       |

### Batching Support

- **Supported**: No
- **Note**: Singular processes requests individually—no batch support in their API. Events are sent as individual GET requests.

### Intermediate Calls

- **Supported**: No
- The Singular destination does not make any intermediate API calls. All events are transformed and sent directly to the appropriate endpoint.

### Proxy Delivery

- **Supported**: No
- No custom `networkHandler.ts` file is present
- Standard HTTP delivery is used

### User Deletion

- **Supported**: No
- No `deleteUsers.ts` file is present in the destination

### OAuth Support

- **Supported**: No
- Uses API Key authentication only

### Processor vs Router Destination

- **Type**: Processor Destination
- `config.transformAtV1 == "processor"` in `db-config.json`

### Partial Batching Response Handling

- **Supported**: No
- No custom networkHandler, standard single-event processing

### Event Multiplexing

- **Supported**: Yes (for revenue events with products array)
- **Scenario**: When a non-session event contains a `properties.products` array, each product generates a separate revenue event
- This multiplexing occurs to send individual revenue tracking for each product in an order

```typescript
// Multiplexing logic for products array
if (!sessionEvent && Array.isArray(message?.properties?.products)) {
  return generateRevenuePayloadArray(message.properties.products, payload, Config, {
    endpoint,
    endpointPath,
  });
}
```

### Supported Platforms

| Platform                              | RudderStack Platform Mapping |
| ------------------------------------- | ---------------------------- |
| Android                               | `ANDROID`                    |
| iOS (including iPadOS, watchOS, tvOS) | `IOS`                        |
| PC                                    | `unity`                      |
| Xbox                                  | `unity`                      |
| PlayStation                           | `unity`                      |
| Nintendo                              | `unity`                      |
| MetaQuest                             | `unity`                      |

#### Match ID for PC/Console Platforms

For Unity/PC/Console platforms (PC, Xbox, PlayStation, Nintendo, MetaQuest), the `match_id` parameter is used for attribution since standard mobile advertising IDs (IDFA, AIFA) are not available.

**Configuration Options**:

- `advertisingId` (default): Uses `context.device.advertisingId` as the match_id value
- `hash`: Uses `properties.match_id` from the event payload

**Implementation Logic**:

```typescript
// If config is 'advertisingId' and advertisingId exists, use it
if (Config.match_id === 'advertisingId' && message?.context?.device?.advertisingId) {
  return { match_id: message?.context?.device?.advertisingId };
}
// Otherwise use properties.match_id if available
if (message.properties?.match_id) {
  return { match_id: message.properties.match_id };
}
```

**Documentation**: [PC & Console Game Integration Guide](https://support.singular.net/hc/en-us/articles/19147380039579-PC-Console-Game-Integration-Guide)

### API Endpoints

| Endpoint         | Version | Event Type     | Description                                                                   |
| ---------------- | ------- | -------------- | ----------------------------------------------------------------------------- |
| `/api/v1/launch` | V1      | Session Events | App lifecycle events (install, update, open)                                  |
| `/api/v1/evt`    | V1      | Custom Events  | Standard event tracking with platform device IDs                              |
| `/api/v2/evt`    | V2      | Custom Events  | SDID-based event tracking (requires `integrations.Singular.singularDeviceId`) |

#### V2 Event API Selection

The V2 event API is used when `integrations.Singular.singularDeviceId` is present in the message:

```typescript
const shouldUseV2EventApi = (message: SingularMessage): boolean =>
  getSingularDeviceIdFromMessage(message) !== undefined;
```

### Data Privacy Support

- **Limit Data Sharing**: Supported via `integrations.Singular.limitDataSharing`
  - Pass `true` to limit data sharing (user opted out)
  - Pass `false` to allow data sharing (user opted in)

```javascript
// Example usage
{
  "integrations": {
    "Singular": {
      "singularDeviceId": "40009df0-d618-4d81-9da1-cbb3337b8dec",  // Triggers V2 Event API
      "limitDataSharing": false  // Privacy consent (true = opted out, false = opted in)
    }
  }
}
```

## Validations

### Required Fields

| Field                                 | Event Type | Platform | Required |
| ------------------------------------- | ---------- | -------- | -------- |
| `event`                               | Track      | All      | Yes      |
| `context.os.name`                     | Track      | All      | Yes      |
| `context.app.namespace`               | Track      | All      | Yes      |
| `context.ip` or `request_ip`          | Track      | All      | Yes      |
| `context.os.version`                  | Track      | All      | Yes      |
| `context.device.attTrackingStatus`    | Track      | iOS      | Yes      |
| `context.device.advertisingId` (idfa) | Track      | iOS      | Yes      |
| `context.device.id` (idfv)            | Track      | iOS      | Yes      |

### Session Event Requirements (Additional)

| Field                         | Platform     | Required |
| ----------------------------- | ------------ | -------- |
| `context.app.version`         | All          | Yes      |
| `context.device.model`        | Android, iOS | Yes      |
| `context.device.manufacturer` | Android, iOS | Yes      |
| `context.locale`              | Android, iOS | Yes      |
| `context.app.build`           | Android, iOS | Yes      |
| `properties.install`          | Android, iOS | Yes      |
| `properties.install_receipt`  | iOS          | Yes      |

### Validation Errors

- `Event type is required`: Missing `message.type`
- `Event type {type} is not supported`: Only `track` events are supported in cloud mode
- `Event name is not present for the event`: Missing `message.event`
- `Platform name is missing from context.os.name`: Missing OS name
- `Platform {platform} is not supported`: Unsupported platform

## Rate Limits

**NEEDS REVIEW**: Singular's S2S API documentation does not publicly specify explicit rate limits for the SESSION (`/api/v1/launch`) or EVENT (`/api/v1/evt`, `/api/v2/evt`) endpoints. Contact Singular support or your Customer Success Manager for specific rate limit information for your account.

### Processing Constraints

Based on the [S2S Integration Guide](https://support.singular.net/hc/en-us/articles/360037640812-Server-to-Server-Integration-Guide):

- **Real-time Processing**: Requests are processed individually—no batch support
- **No Bulk Import**: Events must be sent as individual GET requests
- **Chronological Order**: Events must be sent in the order they occurred
- **Session-First**: SESSION must be established before any EVENT calls

### Error Handling

- Refer to [S2S Response Codes & Error Handling](https://support.singular.net/hc/en-us/articles/31542603988379) for HTTP status codes and error responses

## General Queries

### Event Ordering

#### Session Events (Application Installed, Updated, Opened)

- **Required**: Yes (Critical)
- Session events MUST be sent before any other events
- Singular's attribution processing depends on receiving SESSION before EVENT calls
- Invalid session order results in data inconsistencies and attribution errors

#### Track Events

- **Required**: Yes (Chronological)
- Events must be sent in the order they occurred
- Singular processes events based on timestamps (`utime` parameter)

> **Critical**: SESSION must be established before any event tracking. Events must be sent chronologically.

### Data Replay Feasibility

#### Missing Data Replay

- **Feasibility**: Limited
- **SESSION Events**: Can be replayed, but may cause attribution issues if out of order
- **EVENT Events**: Can be replayed with proper timestamps
- **Constraint**: Singular does not deduplicate data—implement server-side deduplication to prevent duplicates

#### Already Delivered Data Replay

- **Not Recommended**
- Singular does not deduplicate events—replaying will create duplicate records
- **Impact**: Duplicate events may skew analytics and attribution metrics

> **Important**: Singular explicitly states "No Deduplication: Singular does not deduplicate data—implement server-side deduplication to prevent duplicates" — [EVENT Endpoint API Reference](https://support.singular.net/hc/en-us/articles/31496864868635-Server-to-Server-EVENT-Endpoint-API-Reference)

### Multiplexing

- **Supported**: Yes (Revenue Events with Products)
- When a track event contains `properties.products` array (non-session event), the destination generates multiple individual revenue events
- Each product in the array results in a separate API call to the EVENT endpoint

#### Multiplexing Scenarios

1. **Track Events with Products Array**:

   - Input: Track event with `properties.products` array
   - Output: N API calls to `/api/v1/evt` or `/api/v2/evt` (one per product)
   - Multiplexing: YES

2. **Standard Track Events**:

   - Input: Track event without products array
   - Output: Single API call
   - Multiplexing: NO

3. **Session Events**:
   - Input: Session event (Application Installed/Updated/Opened or custom)
   - Output: Single API call to `/api/v1/launch`
   - Multiplexing: NO (products array is ignored for session events)

## Version Information

### Current API Version

- **SESSION Endpoint**: V1 (`/api/v1/launch`)
- **EVENT Endpoint**: V1 (`/api/v1/evt`) and V2 (`/api/v2/evt`)

### Version Selection

| API Version | Endpoint         | Use Case                                           |
| ----------- | ---------------- | -------------------------------------------------- |
| V1          | `/api/v1/launch` | All session events                                 |
| V1          | `/api/v1/evt`    | Events with platform device IDs (IDFA, AIFA, etc.) |
| V2          | `/api/v2/evt`    | Events with Singular Device ID (SDID) only         |

### Deprecation Information

**NEEDS REVIEW**: No specific deprecation timeline found in Singular's documentation. The V1 and V2 APIs appear to be maintained in parallel for different use cases rather than as successor versions.

## Documentation Links

### Singular S2S API Documentation

- [S2S Integration Guide](https://support.singular.net/hc/en-us/articles/360037640812-Server-to-Server-Integration-Guide)
- [SESSION Endpoint API Reference](https://support.singular.net/hc/en-us/articles/31394799175963-Server-to-Server-SESSION-Endpoint-API-Reference)
- [EVENT Endpoint API Reference](https://support.singular.net/hc/en-us/articles/31496864868635-Server-to-Server-EVENT-Endpoint-API-Reference)
- [S2S Response Codes & Error Handling](https://support.singular.net/hc/en-us/articles/31542603988379)
- [S2S Integration Testing Guide](https://support.singular.net/hc/en-us/articles/360002675072)
- [Retrieving Device Data Guide](https://support.singular.net/hc/en-us/articles/30848622982299-Server-to-Server-Retrieving-Device-Data-Guide)
- [PC & Console Game Integration Guide](https://support.singular.net/hc/en-us/articles/19147380039579-PC-Console-Game-Integration-Guide)

### Standard Events Documentation

- [Defining In-App Events](https://support.singular.net/hc/en-us/articles/360036736891)
- [Standard Event Naming Convention](https://support.singular.net/hc/en-us/articles/7648172966299)

## RETL Functionality

For RETL (Reverse ETL) functionality, please refer to [docs/retl.md](docs/retl.md)

## Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## Source Code Structure

```
src/v0/destinations/singular/
├── transform.ts          # Main transformation logic
├── config.ts             # Configuration constants and mappings
├── types.ts              # TypeScript type definitions
├── util.ts               # Utility functions
└── data/                 # Mapping configuration files
    ├── SINGULARAndroidEventConfig.json
    ├── SINGULARAndroidSessionConfig.json
    ├── SINGULARIosEventConfig.json
    ├── SINGULARIosSessionConfig.json
    ├── SINGULARUnityEventConfig.json
    ├── SINGULARUnitySessionConfig.json
    ├── SINGULAREventProductConfig.json
    └── v2/
        ├── SINGULARAndroidEventConfig.json
        ├── SINGULARIosEventConfig.json
        └── SINGULARUnityEventConfig.json
```

## Test Files

```
test/integrations/destinations/singular/
├── processor/data.ts     # Processor test cases
└── router/data.ts        # Router test cases
```
