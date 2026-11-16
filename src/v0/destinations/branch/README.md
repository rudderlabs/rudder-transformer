# Branch Destination

Implementation in **JavaScript** (v0, not CDK v2). The live code is `src/v0/destinations/branch/`; there is no v1 or CDK v2 folder. Dashboard name: Branch Metrics (`BRANCH`).

## Overview

Branch (branch.io) is a mobile deep linking and attribution platform. The cloud-mode integration logs standard and custom events to the Branch Events API v2 so they appear in Branch attribution reports.

## Configuration

Source: `rudder-integrations-config/src/configurations/destinations/branch/`.

| Config key (`destination.Config`)                                       | UI label                         | Required | Used in transformer                                                           |
| ----------------------------------------------------------------------- | -------------------------------- | -------- | ----------------------------------------------------------------------------- |
| `branchKey`                                                             | Branch Key                       | Yes (UI) | Yes, sent as `branch_key` in the body                                         |
| `eventsMapping`                                                         | Map Your Events To Branch Events | No       | Yes, maps a RudderStack event name (`from`) to a Branch standard event (`to`) |
| `eventFilteringOption`, `whitelistedEvents`, `blacklistedEvents`        | Event filtering                  | No       | No                                                                            |
| `consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes` | Consent settings                 | No       | No                                                                            |

`schema.json` only defines the consent fields; `branchKey` and `eventsMapping` are defined only in `ui-config.json`. **NEEDS REVIEW**: the schema does not enforce `branchKey`. `secretKeys` is empty (the Branch Key is a public app key, also used in client SDKs).

## Integration Functionalities

### Implementation

- JavaScript: `transform.js`, `utils.js`, `config.js`, `data/eventMapping.js`.
- `transformAtV1: "processor"` and `BRANCH` is not listed in `src/features.ts`, so it is a **processor** destination. `processRouterDest` is exported but unused.

### Supported Message Types

| Message type | Cloud mode | Device mode (android, ios) |
| ------------ | ---------- | -------------------------- |
| Track        | Yes        | Yes                        |
| Identify     | Yes        | Yes                        |

Supported sources: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, warehouse, reactnative, flutter, cordova, shopify.

The type check is case-sensitive (`message.type` must be exactly `track` or `identify`).

### Authentication

- No auth header. The Branch Key is sent in the JSON body as `branch_key`. Headers are `Content-Type: application/json` and `Accept: application/json`.
- This matches the current Branch Events API docs ("For calls to the Events API, you need your Branch Key").
- No announced change to Events API authentication (such as moving from the Branch Key to an access token) was found. Branch moved dashboard single sign-on to Auth0 ([release note](https://help.branch.io/account-hub/improved-single-sign-on-sso-experience.md)); that does not affect the Events API.

### Batching Support

No.

### Intermediate Calls

None.

### Proxy Delivery

No (`networkHandler.js` is not present).

### User Deletion

No (`deleteUsers.js` is not present).

### OAuth Support

No.

### Additional Functionalities

- **Standard vs custom events**: event names that match the built-in list in `data/eventMapping.js` (or are mapped with `eventsMapping`) go to `/v2/event/standard`; everything else goes to `/v2/event/custom`.
- **Device IDs**: `idfa`/`idfv` (iOS family) and `android_id`/`aaid` (Android) are taken from `context` based on `context.os.name`.
- **ATT status**: `context.device.attTrackingStatus` `3` sets `limit_ad_tracking: false`; `2` sets `true`.
- **Google DMA consent**: Branch's Events API accepts `user_data.dma_eea`, `dma_ad_personalization`, `dma_ad_user_data` and marks them required for EEA users since March 6, 2024 ([release note](https://help.branch.io/account-hub/google-dma-compliance.md)). The integration does not send them. **NEEDS REVIEW**.

### Validations

- Track requires `event`.
- Other types are rejected with `Message type is not supported`.
- No check that `user_data` contains one of the identifiers Branch requires (`developer_identity`, `browser_fingerprint_id`, or OS plus device ID). In practice `developer_identity` is always set because generic `userId` falls back to `anonymousId`.

### Rate Limits

Branch enforces Events API limits per app and returns `429`. Limits are not published; Branch says to contact the account manager ([Events API](https://help.branch.io/apidocs/events.md)).

## General Queries

### Event Ordering

- Events are attribution conversions and carry no timestamp in the payload; Branch records receipt time. Ordering is not required for correctness, but delivery delay shifts attribution time.
- **Identify** is sent as a custom event, so ordering is not critical.

### Data Replay Feasibility

- **Missing data**: Branch states events must be sent in real time and past events are not backfilled into reports. Replay of old data is not useful.
- **Already delivered data**: replaying creates duplicates; there is no dedupe key (`event_data.transaction_id` is informational).

### Multiplexing

No. One request per event.

## Version Information

### Current Version

- Events API **v2**: `https://api2.branch.io/v2/event/standard` and `https://api2.branch.io/v2/event/custom` (`config.js`).

### Version Deprecation

- No deprecation announced for Events API v2. Branch's older v1 custom event endpoint is marked deprecated in its [public API repo](https://github.com/BranchMetrics/branch-deep-linking-public-api); this integration does not use v1.

### Latest Available Version

- v2 is the latest Events API version.

## Documentation Links

- [Branch Events API reference](https://help.branch.io/apidocs/events.md)
- [Branch Events API overview](https://help.branch.io/apidocs/events/overview.md)
- [Track Branch Events](https://help.branch.io/developer-hub/track-branch-events.md)
- [EU Hosted Data](https://help.branch.io/account-hub/eu-hosted-data-for-new-enterprise-customers.md)

### Changelog References

- [Branch release notes index](https://help.branch.io/account-hub/category/release-notes.md) (product and API release notes; also available as [llms.txt](https://help.branch.io/account-hub/category/release-notes/llms.txt))
- **NEEDS REVIEW**: no API-specific deprecations page, version sunset page or RSS feed found. The HTML help pages block non-browser clients; the `.md` URLs above load.
- Note: `docs.branchapp.com` is a different company (Branch payments), not Branch.io.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
