# Courier Destination

Courier is a notification platform. This destination forwards RudderStack `identify` and `track` events to Courier's RudderStack inbound endpoint, where they can trigger Courier automations and update user profiles.

Implementation: `src/v0/destinations/courier/` (JavaScript, v0).

## Configuration

### Required Settings

| Config key | UI label | Description                                                                 |
| ---------- | -------- | --------------------------------------------------------------------------- |
| `apiKey`   | API Key  | Courier API key. Sent as a Bearer token. Marked secret in `db-config.json`. |

Consent settings (`oneTrustCookieCategories`, `ketchConsentPurposes`, `consentManagement`) are handled by the platform, not by this transformer.

## Integration Functionalities

### Implementation

- **Language**: JavaScript (`transform.js`, `config.js`).
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`). `processRouterDest` is exported (uses `simpleProcessRouterDest`) but Courier is not listed in `src/features.ts`, so router transform is not enabled.
- **Not CDK v2**: `cdkV2Enabled` is not set.

### Supported Message Types

| Type       | Supported | Notes                                                 |
| ---------- | --------- | ----------------------------------------------------- |
| `identify` | Yes       | Requires `traits` or `context.traits`.                |
| `track`    | Yes       | Forwarded as-is.                                      |
| others     | No        | Rejected with `Message type <type> is not supported`. |

Courier's own docs say the RudderStack integration accepts `group` events too, but the transformer and `db-config.json` (`supportedMessageTypes.cloud: ["identify", "track"]`) only allow `identify` and `track`.

Supported sources: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, reactnative, flutter, cordova, warehouse, shopify. Cloud mode only.

### Authentication

The code builds these headers (`transform.js` `responseBuilder`):

```
Content-Type: application/json
Authorization: Bearer <Config.apiKey>
```

There is no OAuth (`auth` is not set in `db-config.json`). Courier API keys are now environment-specific (Courier changelog, "Improved API Settings", 2025-09-02, and "Custom Environments", 2026-04-30); the key the user enters decides which Courier environment receives the events. No announced deprecation of API-key auth was found.

### Batching Support

None. One request per event.

### Intermediate Calls

None.

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported (no `deleteUsers.js`).

### OAuth Support

No.

### Additional Functionalities

- **Pass-through payload**: The whole RudderStack message is sent as the request body (after removing `undefined`/`null` top-level values). Courier parses the RudderStack event format on its side.
- For `identify`, `traits` is set to `message.traits || message.context.traits` on the forwarded payload.

### Validations

- `message.type` is required.
- `Config.apiKey` is required (`ConfigurationError`).
- `identify`: `traits` or `context.traits` must be present.

### Rate Limits

Courier does not document a rate limit for the inbound RudderStack endpoint. **NEEDS REVIEW**.

## General Queries

### Event Ordering

- **identify**: Updates the Courier user profile. Ordering matters, since an older identify delivered later can overwrite newer traits.
- **track**: Triggers automations. Ordering is less critical, but automations that depend on profile state may behave differently if they run before the related identify.

### Data Replay Feasibility

- **Missing data**: `identify` can be replayed if newer profile updates are replayed after it. `track` can be replayed, but replays trigger automations (for example notifications) again.
- **Already-delivered data**: Not safe for `track`. There is no documented dedupe on the inbound endpoint, so replays can send duplicate notifications. **NEEDS REVIEW**.

### Rate Limits and Batch Sizes

No batching. Rate limits not documented (see above).

### Multiplexing

No. One input event produces one request.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `config.js` (`API_URL`: `https://api.courier.com/inbound/rudderstack`)

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Courier: RudderStack integration](https://www.courier.com/docs/integrations/cdp/rudderstack)

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Courier API reference](https://www.courier.com/docs/reference/api-overview)

The path has no version segment; Courier's REST API is unversioned. The integration uses the current endpoint documented by Courier.

## Documentation Links

- [Courier: RudderStack integration](https://www.courier.com/docs/integrations/cdp/rudderstack)
- [Courier: Inbound events](https://www.courier.com/docs/journeys/automations/inbound-events)
- [Courier API reference (base URLs, bearer auth, rate limits)](https://www.courier.com/docs/reference/api-overview)
- [Courier: Track an event](https://www.courier.com/docs/api-reference/track-events/track-an-event)

### Changelog References

- **Changelog:** [Courier changelog](https://www.courier.com/changelog)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** [Improved API Settings (environment-specific API keys)](https://www.courier.com/changelog/improved-api-settings); [Custom Environments (2026-04-30)](https://www.courier.com/changelog/new-custom-environments)
- **Last checked:** 2026-11-16

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
