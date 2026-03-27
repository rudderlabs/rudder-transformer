# Singular Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Singular destination integration. It covers how RudderStack events are mapped to Singular's S2S API format, the specific API endpoints used for each event type, and the special handling for various scenarios.

## API Endpoints and Request Flow

### SESSION Endpoint (`/api/v1/launch`)

**Documentation**: [Singular SESSION Endpoint API Reference](https://support.singular.net/hc/en-us/articles/31394799175963)

**Purpose**: Track user sessions and enable attribution for app installs, re-engagement, and retention metrics.

**When Used**:

- Default session events: `Application Installed`, `Application Updated`, `Application Opened`
- Custom session events defined in `sessionEventList` configuration

**Request Flow**:

1. Event received with session event name
2. Platform detected from `context.os.name`
3. Platform-specific session payload constructed using mapping config
4. Additional parameters added (dnt, openuri, connection type)
5. GET request sent to `https://s2s.singular.net/api/v1/launch`

### EVENT Endpoint V1 (`/api/v1/evt`)

**Documentation**: [Singular EVENT Endpoint API Reference](https://support.singular.net/hc/en-us/articles/31496864868635)

**Purpose**: Track in-app events and revenue for attribution analysis.

**When Used**:

- Non-session track events
- When `integrations.Singular.singularDeviceId` is NOT present

**Request Flow**:

1. Event received with non-session event name
2. Platform detected from `context.os.name`
3. Platform-specific event payload constructed
4. Custom event attributes extracted and added to `e` parameter
5. Revenue parameters added if applicable
6. GET request sent to `https://s2s.singular.net/api/v1/evt`

### EVENT Endpoint V2 (`/api/v2/evt`)

**Documentation**: [Singular EVENT Endpoint API Reference](https://support.singular.net/hc/en-us/articles/31496864868635)

**Purpose**: Simplified event tracking using Singular Device ID (SDID) only.

**When Used**:

- Non-session track events
- When `integrations.Singular.singularDeviceId` IS present

**Request Flow**:

1. Event received with non-session event name
2. `singularDeviceId` detected in integrations object
3. V2 mapping config used (excludes platform device IDs)
4. `sdid` parameter set from `integrations.Singular.singularDeviceId`
5. GET request sent to `https://s2s.singular.net/api/v2/evt`

## Event Processing Logic

### Session Event Detection

See `util.ts` lines 130–134 (`isSessionEvent`). Default session event names are defined in `config.ts` (`SESSIONEVENTS`).

**Case Sensitivity**:

- **Default session events** (`Application Installed`, `Application Updated`, `Application Opened`): Matched **case-insensitively**. Any casing works (e.g., `application installed`, `APPLICATION INSTALLED`).
- **Custom session events** (from `sessionEventList` config): Matched **case-sensitively**. Must match exactly as configured.

### Platform Detection and Normalization

See `util.ts` lines 346–376 (`platformWisePayloadGenerator`). Supported platform mapping is in `config.ts` lines 58–66 (`SUPPORTED_PLATFORM`).

### API Version Selection

See `util.ts` lines 381–396 (`getEndpoint`). V2 is chosen when `integrations.Singular.singularDeviceId` is present; see `shouldUseV2EventApi` at lines 122–123.

## Mapping Configurations

### Android Session Mapping (`SINGULARAndroidSessionConfig.json`)

| RudderStack Field              | Singular Parameter        | Required | Description           |
| ------------------------------ | ------------------------- | -------- | --------------------- |
| `context.os.name`              | `p`                       | Yes      | Platform (Android)    |
| `context.app.namespace`        | `i`                       | Yes      | App package name      |
| `context.app.version`          | `app_v`                   | Yes      | App version           |
| `context.ip` / `request_ip`    | `ip`                      | Yes      | Device IP             |
| `context.os.version`           | `ve`                      | Yes      | OS version            |
| `context.device.model`         | `mo`                      | Yes      | Device model          |
| `context.device.manufacturer`  | `ma`                      | Yes      | Device manufacturer   |
| `context.locale`               | `lc`                      | Yes      | Device locale         |
| `context.app.build`            | `bd`                      | Yes      | Build identifier      |
| `properties.install`           | `install`                 | Yes      | Install indicator     |
| `event`                        | `sessionNotificationName` | Yes      | Session event name    |
| `context.app.name`             | `n`                       | No       | App name              |
| `context.network.carrier`      | `cn`                      | No       | Network carrier       |
| `context.device.token`         | `fcm`                     | No       | FCM token             |
| `context.device.advertisingId` | `aifa`                    | No       | Google Advertising ID |
| `context.device.id`            | `andi`                    | No       | Android ID            |
| `properties.asid`              | `asid`                    | No       | App Set ID            |
| `properties.install_ref`       | `install_ref`             | No       | Install referrer      |
| `userId`                       | `custom_user_id`          | No       | Custom user ID        |
| `timestamp`                    | `utime`                   | No       | Unix timestamp        |
| `timestamp`                    | `install_time`            | Yes      | Install timestamp     |
| `timestamp`                    | `update_time`             | Yes      | Update timestamp      |
| `context.userAgent`            | `ua`                      | No       | User agent            |

### Android Event Mapping (`SINGULARAndroidEventConfig.json`)

| RudderStack Field                    | Singular Parameter        | Required | Description       |
| ------------------------------------ | ------------------------- | -------- | ----------------- |
| `event`                              | `n`                       | Yes      | Event name        |
| `context.os.name`                    | `p`                       | Yes      | Platform          |
| `context.app.namespace`              | `i`                       | Yes      | App identifier    |
| `context.ip` / `request_ip`          | `ip`                      | Yes      | Device IP         |
| `context.os.version`                 | `ve`                      | Yes      | OS version        |
| `userId`                             | `custom_user_id`          | No       | Custom user ID    |
| `properties.is_revenue_event`        | `is_revenue_event`        | No       | Revenue flag      |
| `timestamp`                          | `utime`                   | No       | Unix timestamp    |
| `properties.total/value/revenue`     | `amt`                     | No       | Revenue amount    |
| `properties.currency`                | `cur`                     | No       | Currency code     |
| `properties.purchase_receipt`        | `purchase_receipt`        | No       | Receipt           |
| `properties.product_id/sku`          | `purchase_product_id`     | No       | Product ID        |
| `properties.purchase_transaction_id` | `purchase_transaction_id` | No       | Transaction ID    |
| `context.device.advertisingId`       | `aifa`                    | No       | GAID              |
| `context.device.id`                  | `andi`                    | No       | Android ID        |
| `properties.asid`                    | `asid`                    | No       | App Set ID        |
| `properties.receipt_signature`       | `receipt_signature`       | No       | Receipt signature |

### iOS Session Mapping (`SINGULARIosSessionConfig.json`)

| RudderStack Field                  | Singular Parameter         | Required | Description          |
| ---------------------------------- | -------------------------- | -------- | -------------------- |
| `context.os.name`                  | `p`                        | Yes      | Platform (iOS)       |
| `context.app.namespace`            | `i`                        | Yes      | Bundle ID            |
| `context.app.version`              | `app_v`                    | Yes      | App version          |
| `context.ip` / `request_ip`        | `ip`                       | Yes      | Device IP            |
| `context.os.version`               | `ve`                       | Yes      | OS version           |
| `context.device.model`             | `mo`                       | Yes      | Device model         |
| `context.device.manufacturer`      | `ma`                       | Yes      | Manufacturer (Apple) |
| `context.locale`                   | `lc`                       | Yes      | Device locale        |
| `context.app.build`                | `bd`                       | Yes      | Build identifier     |
| `properties.install`               | `install`                  | Yes      | Install indicator    |
| `properties.install_receipt`       | `install_receipt`          | Yes      | iOS install receipt  |
| `context.device.attTrackingStatus` | `att_authorization_status` | Yes      | ATT status           |
| `event`                            | `sessionNotificationName`  | Yes      | Session event name   |
| `context.device.advertisingId`     | `idfa`                     | Yes      | IDFA                 |
| `context.device.id`                | `idfv`                     | Yes      | IDFV                 |
| `context.app.name`                 | `n`                        | No       | App name             |
| `context.network.carrier`          | `cn`                       | No       | Network carrier      |
| `context.device.token`             | `apns_token`               | No       | APNs token           |
| `properties.userAgent`             | `ua`                       | No       | User agent           |
| `properties.attribution_token`     | `attribution_token`        | No       | ASA attribution      |
| `properties.skan_conversion_value` | `skan_conversion_value`    | No       | SKAN value           |
| `userId`                           | `custom_user_id`           | No       | Custom user ID       |
| `timestamp`                        | `utime`                    | No       | Unix timestamp       |
| `timestamp`                        | `install_time`             | Yes      | Install timestamp    |
| `timestamp`                        | `update_time`              | Yes      | Update timestamp     |

### iOS Event Mapping (`SINGULARIosEventConfig.json`)

| RudderStack Field                    | Singular Parameter         | Required | Description    |
| ------------------------------------ | -------------------------- | -------- | -------------- |
| `event`                              | `n`                        | Yes      | Event name     |
| `context.os.name`                    | `p`                        | Yes      | Platform       |
| `context.app.namespace`              | `i`                        | Yes      | Bundle ID      |
| `context.ip` / `request_ip`          | `ip`                       | Yes      | Device IP      |
| `context.os.version`                 | `ve`                       | Yes      | OS version     |
| `context.device.attTrackingStatus`   | `att_authorization_status` | Yes      | ATT status     |
| `context.device.advertisingId`       | `idfa`                     | Yes      | IDFA           |
| `context.device.id`                  | `idfv`                     | Yes      | IDFV           |
| `userId`                             | `custom_user_id`           | No       | Custom user ID |
| `properties.is_revenue_event`        | `is_revenue_event`         | No       | Revenue flag   |
| `timestamp`                          | `utime`                    | No       | Unix timestamp |
| `properties.skan_conversion_value`   | `skan_conversion_value`    | No       | SKAN value     |
| `properties.total/value/revenue`     | `amt`                      | No       | Revenue amount |
| `properties.currency`                | `cur`                      | No       | Currency code  |
| `properties.purchase_receipt`        | `purchase_receipt`         | No       | Receipt        |
| `properties.product_id/sku`          | `purchase_product_id`      | No       | Product ID     |
| `properties.purchase_transaction_id` | `purchase_transaction_id`  | No       | Transaction ID |

### Unity/PC/Console Event Mapping (`SINGULARUnityEventConfig.json`)

| RudderStack Field                | Singular Parameter | Required | Description        |
| -------------------------------- | ------------------ | -------- | ------------------ |
| `context.os.name`                | `p`                | Yes      | Platform           |
| `context.app.namespace`          | `i`                | Yes      | App identifier     |
| `context.device.id`              | `sdid`             | No       | Singular Device ID |
| `event`                          | `n`                | Yes      | Event name         |
| `context.app.version`            | `av`               | No       | App version        |
| `context.os.version`             | `ve`               | No       | OS version         |
| `properties.os`                  | `os`               | Yes      | OS type            |
| `context.ip` / `request_ip`      | `ip`               | Yes      | Device IP          |
| `properties.install_source`      | `install_source`   | Yes      | Install source     |
| `properties.is_revenue_event`    | `is_revenue_event` | No       | Revenue flag       |
| `timestamp`                      | `utime`            | No       | Unix timestamp     |
| `properties.total/value/revenue` | `amt`              | No       | Revenue amount     |
| `properties.currency`            | `cur`              | No       | Currency code      |
| `context.userAgent`              | `ua`               | No       | User agent         |
| `properties.custom_user_id`      | `custom_user_id`   | No       | Custom user ID     |

### V2 Event Mappings

V2 mappings (in `data/v2/`) are similar to V1 but exclude platform-specific device identifiers (IDFA, IDFV, AIFA, etc.) since V2 uses only `sdid` (Singular Device ID).

### Product Mapping (`SINGULAREventProductConfig.json`)

Used for revenue events with `properties.products` array:

| RudderStack Field                    | Singular Parameter        | Required | Description        |
| ------------------------------------ | ------------------------- | -------- | ------------------ |
| `product_id` / `sku`                 | `purchase_product_id`     | No       | Product identifier |
| `total/value/revenue/price*quantity` | `amt`                     | No       | Amount             |
| `purchase_receipt`                   | `purchase_receipt`        | No       | Receipt            |
| `currency`                           | `cur`                     | No       | Currency           |
| `purchase_transaction_id`            | `purchase_transaction_id` | No       | Transaction ID     |

## Special Handling

### Revenue Events with Products Array

When a non-session event contains `properties.products` array, each product generates a separate revenue event. See `transform.ts` lines 36–40 for the condition and call; see `util.ts` lines 72–97 (`generateRevenuePayloadArray`) for per-product payload construction.

Each product in the array results in:

1. Base payload parameters (platform, IP, timestamp, etc.)
2. Product-specific revenue parameters (amt, cur, purchase_product_id)
3. `is_revenue_event: true` flag
4. Partner identification (`partner: 'rudderstack'`)

### Do Not Track (DNT) Handling

For session events on Android/iOS platforms, `context.device.adTrackingEnabled === true` implies `dnt = 0` (tracking allowed); otherwise `dnt = 1`. See `util.ts` lines 259–270 (`createSessionPayload`).

### Connection Type Detection

See `util.ts` lines 238–239 (`getConnectionType`).

### Match ID for Unity Platforms

For PC/Xbox/PlayStation/Nintendo/MetaQuest platforms, `match_id` is taken from `context.device.advertisingId` when `Config.match_id === 'advertisingId'`, otherwise from `properties.match_id`. See `util.ts` lines 220–231 (`getMatchObject`).

### Data Sharing Options

Privacy consent is read from `integrations.Singular.limitDataSharing` and passed as `data_sharing_options`. See `util.ts` lines 141–150 (`getDataSharingOptionsFromMessage`).

### Custom Event Attributes

Non-mapped properties are extracted and sent as custom event attributes in the `e` parameter. See `util.ts` lines 55–61 (`extractExtraFields`). For V2 API, `singularDeviceId` is excluded from attributes; see `config.ts` (`SINGULAR_V2_EVENT_ATTRIBUTES_EXCLUDED_KEYS`) and `util.ts` lines 321–324.

## Revenue Amount Calculation

The revenue amount (`amt`) is calculated from multiple sources with fallback. See `data/SINGULARAndroidEventConfig.json` (and equivalent iOS/Unity configs) for the `amt` mapping.

Priority:

1. `properties.total`
2. `properties.value`
3. `properties.revenue`
4. `properties.price * properties.quantity` (quantity defaults to 1)

## Timestamp Handling

Timestamps are converted to Unix epoch seconds via the `utime` mapping with `type: "secondTimestamp"`. See the platform event/session configs in `data/` (e.g. `SINGULARAndroidEventConfig.json`).

## Partner Identification

All requests include RudderStack partner identification (`partner: 'rudderstack'`). See `config.ts` line 9 (`PARTNER_OBJECT`) and `util.ts` (e.g. lines 84–86, 296–298) where it is merged into payloads.

## Error Handling

### Validation Errors

| Error                                                                 | Condition                     |
| --------------------------------------------------------------------- | ----------------------------- |
| `InstrumentationError: Event type is required`                        | Missing `message.type`        |
| `InstrumentationError: Event type {type} is not supported`            | `message.type` is not `track` |
| `InstrumentationError: Event name is not present for the event`       | Missing `message.event`       |
| `InstrumentationError: Platform name is missing from context.os.name` | Missing or invalid OS name    |
| `InstrumentationError: Platform {platform} is not supported`          | Unsupported platform          |
| `TransformationError: Failed to Create {platform} {type} Payload`     | Payload construction failed   |

## Request Format

All requests are sent as HTTP GET with URL query parameters. See `transform.ts` lines 42–51 (single-event response) and `util.ts` lines 90–96 (batch response for products array).

## Summary

The Singular destination transforms RudderStack track events into Singular S2S API requests:

1. **Event Classification**: Session vs non-session based on event name
2. **Platform Detection**: Android, iOS, or Unity (PC/Console)
3. **API Selection**: V1 launch (session), V1 evt (event), or V2 evt (SDID-based)
4. **Payload Construction**: Platform-specific mapping configurations
5. **Special Handling**: Revenue events, products array, DNT, connection type
6. **Request Delivery**: HTTP GET with query parameters

Key differentiators by platform and API version:

**V1 API** (default, platform device IDs):

- **Android**: Uses AIFA, ASID, ANDI identifiers
- **iOS**: Uses IDFA, IDFV, ATT status, SKAdNetwork parameters
- **Unity/PC/Console**: Uses `match_id` (from `context.device.advertisingId` or `properties.match_id`)

**V2 API** (when `integrations.Singular.singularDeviceId` is provided):

- **All platforms**: Uses `sdid` (Singular Device ID) instead of platform-specific device IDs
- **Unity/PC/Console**: Also includes `match_id` in addition to `sdid`

[PC & Console Game Integration Guide](https://support.singular.net/hc/en-us/articles/19147380039579-PC-Console-Game-Integration-Guide)
