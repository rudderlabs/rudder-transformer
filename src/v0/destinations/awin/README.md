# Awin Destination

Awin is an affiliate marketing network. This destination reports conversions (sales) to Awin through its server-to-server (S2S) tracking endpoint, `sread.php`.

Implementation: `src/v0/destinations/awin/` (JavaScript, v0).

## Configuration

### Required Settings

| Config key     | UI label      | Description                                                                |
| -------------- | ------------- | -------------------------------------------------------------------------- |
| `advertiserId` | Advertiser ID | Awin advertiser (merchant) ID. Sent as `merchant`. Listed in `secretKeys`. |

### Optional Settings

| Config key       | Description                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `eventsToTrack`  | Array of `{ eventName }`. Only these events (exact, case-sensitive match) are sent. Others are filtered (status 298). |
| `customFieldMap` | Array of `{ from, to }`: event property → Awin custom parameter `p1`, `p2`, ... (`to` must match `^\s*p\d+\s*$`).     |

## Integration Functionalities

### Implementation

- **Language**: JavaScript (`transform.js`, `utils.js`, `config.js`, mapping in `data/trackConfig.json`).
- **Processor vs Router**: Processor destination (`transformAtV1: "processor"`). `processRouterDest` exists but Awin is not in `src/features.ts`.

### Supported Message Types

| Type    | Supported |
| ------- | --------- |
| `track` | Yes       |
| others  | No        |

Supported sources: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, reactnative, flutter, cordova, warehouse, shopify. Cloud mode only.

### Authentication

None. The request has no auth header; Awin identifies the advertiser by the `merchant` query parameter and attributes the sale through the `cks` (AWC click checksum) parameter.

Awin's current S2S documentation (updated 2026-04-08) does not deprecate `sread.php`, but it "highly recommend[s]" the authenticated **Awin Conversion API**, which uses an OAuth2 access token. No sunset date for `sread.php` S2S was found. **NEEDS REVIEW**: track whether Awin announces an end date for unauthenticated S2S.

### Batching Support

None. One request per event. (The Conversion API supports batches of orders, but it is not used.)

### Intermediate Calls

None.

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported.

### OAuth Support

No.

### Additional Functionalities

- **Event allowlist** (`eventsToTrack`); filtered events return status 298 (`FilteredEventsError`).
- **Product Level Tracking (PLT)**: each item in `properties.products` with all required fields becomes a `bd[n]` parameter (`AW:P|...` format).
- **Custom transaction parameters** (`p1`, `p2`, ...) via `customFieldMap`.
- **Defaults**: `tt=ss`, `tv=2`, `ch=aw`, `testmode=0`, commission group `DEFAULT`.

### Validations

- `Config.advertiserId` required.
- `message.type` required and must be `track`.
- Event name must be in `eventsToTrack` when `eventsToTrack` is an array.
- A product is only added to `bd[]` when `orderReference`, product id, name, price and quantity are all defined.

### Rate Limits

Awin does not publish a rate limit for `sread.php`. **NEEDS REVIEW**.

## General Queries

### Event Ordering

Not required. Each call reports one conversion, keyed by order reference.

### Data Replay Feasibility

- **Missing data**: Possible. Awin's docs say S2S calls should preferably arrive within two minutes of the client-side call to be considered in method prioritisation, and conversions only count within the advertiser's cookie/attribution window. Late replays may not be attributed.
- **Already-delivered data**: Awin de-duplicates transactions by order reference (`ref`) for the same advertiser. **NEEDS REVIEW**: confirm dedupe behaviour for S2S.

### Rate Limits and Batch Sizes

No batching; rate limits not published.

### Multiplexing

No. One event produces one request (products become extra `bd[n]` query parameters on the same request).

## Version Information

### Current Version

- **Version:** `tv=2`
- **Where in code:** `config.js` (`BASE_URL`), `utils.js` (`params.tv`)

Awin S2S tracking: `https://www.awin1.com/sread.php?tt=ss&tv=2...`.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Awin: Direct S2S tracking](https://help.awin.com/developers/docs/direct-s2s)

### Latest Available Version

- **Version:** `tv=2`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Awin: Direct S2S tracking](https://help.awin.com/developers/docs/direct-s2s)

Awin recommends its authenticated, batch **Conversion API** over direct S2S ([Direct S2S tracking](https://help.awin.com/developers/docs/direct-s2s), updated 2026-04-08). Moving to it would require an API token and a new request format.

## Documentation Links

- [Awin: Direct S2S tracking](https://help.awin.com/developers/docs/direct-s2s)
- [Awin: Server-to-server tracking](https://help.awin.com/docs/server-to-server-tracking)
- [Awin: Conversion API](https://help.awin.com/apidocs/conversion-api)
- [Awin: S2S via Conversion API](https://help.awin.com/developers/docs/s2s-via-conversion-api)
- [Awin: API authentication](https://help.awin.com/apidocs/api-authentication)
- [Awin: Product Level Tracking](https://help.awin.com/developers/docs/product-level-tracking-2)
- [Awin: Commission groups](https://help.awin.com/developers/docs/commission-groups)
- [Awin: APIs overview](https://help.awin.com/docs/awins-apis-overview)

`sread.php` takes no auth; the API authentication page applies only to the Conversion API.

### Changelog References

- **Changelog:** [Awin release notes](https://help.awin.com/docs/release-notes)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Awin publishes no developer changelog; the release notes cover the Awin platform. Individual help pages show an update date.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
