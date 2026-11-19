# DCM Floodlight Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/dcm_floodlight/procWorkflow.yaml` + `utils.js`). `cdkV2Enabled: true` in `db-config.json` and `DCM_FLOODLIGHT: { cdkV2: true }` in `src/features.ts`. There is no v0 or v1 implementation. Canonical names: `dcm floodlight`, `DCM Floodlight`, `DCMFloodlight`, etc. (`src/constants/destinationCanonicalNames.js`).

## Overview

Fires Google Campaign Manager 360 (formerly DoubleClick Campaign Manager) Floodlight conversion tags from the server for mobile app traffic. Each `track` or `page` event that matches a configured conversion event becomes one `GET` request to the Floodlight activity URL, keyed by the device advertising ID (`dc_rdid`).

## Configuration

### Required Settings

- **Advertiser ID** (`advertiserId`): Floodlight configuration ID, sent as `src`.
- **Conversion Events** (`conversionEvents`): list mapping RudderStack event names to Floodlight tags. Each row: `eventName`, `floodlightActivityTag` (`cat`), `floodlightGroupTag` (`type`), `salesTag` (boolean), `customVariables` (`from` property → `to` `uN`). The code throws if no row matches.

### Optional Settings

- **Activity Tag** (`activityTag`) and **Group Tag** (`groupTag`): defaults for `cat` and `type`, overridden per conversion event.
- `countingMethod` is in the config but not read by the cloud-mode code.
- `conversionLinker`, `allowAdPersonalizationSignals`, `tagFormat`, `doubleclickId`, `googleNetworkId`, `useNativeSDK`: web device mode only.
- Event filtering and consent settings are applied by rudder-server.

## Integration Functionalities

> Implementation language: CDK v2 (YAML workflow)

### Supported Message Types

- Cloud mode: `track`, `page`
- Device mode (web): `identify`, `track`, `page`

### Authentication

None. Floodlight tags are public pixel URLs; the account is identified by `src` (advertiser ID), `cat` and `type`. The only header sent is `User-Agent` (copied from `context.userAgent`). No credentials, so no auth deprecation applies. Google's EU user consent requirements still apply to the consent flags (`npa`, `tfua`, `tag_for_child_directed_treatment`).

### Batching Support

None.

### Intermediate Calls

None.

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported.

### OAuth Support

No.

### Processor vs Router

Processor destination (`transformAtV1: "processor"`).

### Additional Functionalities

- **Counter vs Sales tag** per conversion event: sales tags send `ord` (order ID), `qty`, `cost`; counter tags send `ord = messageId` and drop `qty`/`cost`.
- **Custom Floodlight variables** (`u1`, `u2`, ...): values taken from properties/traits, URL-encoded; values containing `"`, `<`, `>`, `#` and booleans are skipped.
- **Privacy flags** via the integrations object (`integrations["DCM Floodlight"]` or any canonical name in `destinationCanonicalNames.js`): `COPPA` → `tag_for_child_directed_treatment`, `GDPR` → `tfua`, `npa` → `npa`. Values must be `true/1` or `false/0`.

### Validations

- `message.type` required, must be `track` or `page`.
- `context.device.advertisingId` required.
- `context.userAgent` required.
- `track` requires `event`.
- The event name (lower-cased, trimmed) must match a `conversionEvents[].eventName`, otherwise `Conversion event not found`.

### Rate Limits

Google publishes no rate limits for Floodlight tag requests.

## General Queries

### Event Ordering

Not required. Each conversion is independent and there is no profile update.

### Data Replay Feasibility

- **Missing data**: can be replayed, but the request carries no timestamp, so Floodlight records the conversion at receipt time. Late conversions may fall outside attribution windows.
- **Already delivered data**: `ord` is sent (order ID for sales tags, `messageId` for counter tags), so a replay sends the same `ord`. `NEEDS REVIEW`: whether CM360 then deduplicates depends on the activity's counting method.

### Multiplexing

None.

## Version Information

### Current Version

- **Version:** Unversioned
- **Where in code:** `utils.js` (`BASE_URL`), `https://ad.doubleclick.net/ddm/activity/`

This is the Floodlight tag endpoint, not the Campaign Manager 360 REST API.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Track mobile app conversions with Floodlight](https://support.google.com/campaignmanager/answer/4568975)

No deprecation is announced for the `ddm/activity` tag URL. The separate CM360 REST API (not used here) is at v5, with no deprecation or sunset announced on Google's [deprecation schedule](https://developers.google.com/doubleclick-advertisers/deprecation).

### Latest Available Version

- **Version:** Unversioned
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Track mobile app conversions with Floodlight](https://support.google.com/campaignmanager/answer/4568975)

Google recommends the Google tag (gtag.js) for web; the server-side image-tag URL format remains documented for in-app conversion tracking.

## Documentation Links

### API Documentation

- [Track mobile app conversions with Floodlight](https://support.google.com/campaignmanager/answer/4568975)
- [Custom Floodlight variables](https://support.google.com/campaignmanager/answer/2823222)
- [Floodlight in-app tag parameters (`dc_rdid`, `dc_lat`, `tag_for_child_directed_treatment`)](https://support.google.com/campaignmanager/answer/7554821)

### Changelog References

- **Changelog:** [Campaign Manager 360 API release notes](https://developers.google.com/doubleclick-advertisers/rel_notes)
- **Deprecations:** [Campaign Manager 360 API deprecation schedule](https://developers.google.com/doubleclick-advertisers/deprecation)
- **Versions:** Not versioned
- **Feed:** [Google Ads developer blog Atom feed](https://developers.google.com/ads/blog/rss.xml)
- **Announcements:** None found
- **Last checked:** 2026-11-16

Google publishes no changelog specific to Floodlight tag URL parameters. The linked release notes and deprecation schedule cover the CM360 REST API, not tag URLs; tag changes are announced in Campaign Manager 360 Help Center articles.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
