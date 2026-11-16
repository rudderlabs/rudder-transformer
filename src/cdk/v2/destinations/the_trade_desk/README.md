# The Trade Desk Audience Destination

Implementation in **CDK v2** (`rtWorkflow.yaml` + JavaScript helpers). Proxy delivery lives in `src/v0/destinations/the_trade_desk/networkHandler.js`.

## Overview

The Trade Desk (TTD) is a demand-side platform for programmatic advertising. This destination ("The Trade Desk Audience" in the dashboard) is a reverse ETL audience destination: it adds user IDs to, or removes them from, a first-party data segment for an advertiser through TTD's first-party data API (`POST /data/advertiser`).

The separate conversions destination is `the_trade_desk_real_time_conversions` and is not covered here.

## Configuration

### Required Settings

- **Advertiser ID** (`advertiserId`): From the Advertiser Preferences page in the TTD platform UI.
- **Advertiser Secret Key** (`advertiserSecretKey`): From the same page. Used to sign requests (`TtdSignature`). Secret.
- **Data Server** (`dataServer`, default `usEastCoast`): Regional data server. Options: `apac`, `tokyo`, `usEastCoast`, `usWestCoast`, `ukEu`, `china`.
- **Segment name / Audience ID** (`audienceId`): Segment name to upload into. Set by the audience (VDM) setup; the workflow aborts without it.

### Optional Settings

- **TTL (in days)** (`ttlInDays`, UI default `30`, range 0 to 180): How long a user stays in the segment after an insert.
- **Consent management** (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`).

### Environment

- `THE_TRADE_DESK_DATA_PROVIDER_SECRET_KEY`: RudderStack's data-provider secret, used for the `TtdSignature-dp` header at delivery time.

## Integration Functionalities

> Cloud mode only, warehouse sources only.

### Supported Message Types

- **Record**: Yes (`action` `insert` or `delete`).

From `db-config.json`:

```json
"supportedSourceTypes": ["warehouse"],
"supportedMessageTypes": { "cloud": ["record"] },
"syncBehaviours": ["mirror"]
```

### Config keys used in code

`audienceId`, `advertiserId`, `advertiserSecretKey`, `dataServer`, `ttlInDays`.

### Batching Support

- **Supported**: Yes, for all record events in a router batch.
- Each identifier in each record becomes one item in `Items`; items from all events are combined and chunked by size, up to **2.5 MB** per request (`MAX_REQUEST_SIZE_IN_BYTES = 2500000`).
- All successful events of the batch share the resulting request(s) (`getSuccessRespEvents(..., batched = true)`).

### Intermediate Calls

None during transformation.

### Proxy Delivery

- **Supported**: Yes (v0 proxy). Source: `src/v0/destinations/the_trade_desk/networkHandler.js`. Enabled with `transformerProxy: true` in `src/features.ts`.
- The proxy adds the HMAC signature headers (they cannot be computed before the final body is known):
  - `TtdSignature`: Base64(HMAC-SHA1(JSON body, `advertiserSecretKey`))
  - `TtdSignature-dp`: Base64(HMAC-SHA1(JSON body, `THE_TRADE_DESK_DATA_PROVIDER_SECRET_KEY`))
- Missing secrets raise a `PlatformError`.
- **Partial batch handling**: No. TTD returns `200` with `FailedLines` when some IDs cannot be parsed; the proxy then aborts the whole request (`AbortedError`, 400), so every event in that batch is marked failed.

### User Deletion

- **Supported**: No. There is no `deleteUsers.js`. (Record `delete` actions remove users from the segment; that is not GDPR user deletion.)

### OAuth Support

- **Supported**: No. Advertiser secret key signing.

### Processor vs Router

- `transformAtV1: "router"`; router-only CDK v2 workflow.

### Additional Functionalities

- **Blank audience creation** (`supportsBlankAudienceCreation`): rudder-integrations-info `createAudience` returns the entered name as the audience ID; no TTD API call is made. The segment is created in TTD when data is first uploaded under that name. NEEDS REVIEW.

### Validations

- `audienceId`, `advertiserId`, `advertiserSecretKey` must be present (whole batch aborted otherwise).
- `ttlInDays`, if set, must be between 0 and 180.
- `message.type` must be `record`; other types fail per event.
- `action` must be `insert` or `delete`.
- `fields` must be non-empty and every field value must be truthy.

### Rate Limits

- The partner portal documentation is JavaScript-rendered and was not readable for this write-up. Rate limits for `POST /data/advertiser` are not recorded here. NEEDS REVIEW ([Rate limits](https://partner.thetradedesk.com/v3/portal/api/doc/RateLimits)).
- Request size: the code caps requests at 2.5 MB. NEEDS REVIEW against TTD's documented limit.

## General Queries

### Event Ordering

- **Record insert/delete**: Ordering matters for the same ID. An `insert` followed by a `delete` must arrive in that order or the user ends up in the wrong state. Within a single request, all items are applied together, and RETL mirror syncs produce one action per row per sync, so conflicts are uncommon.

### Data Replay Feasibility

- **Missing data replay**: Feasible. Inserts and deletes are idempotent segment operations. A replayed insert resets the TTL from the replay time.
- **Already delivered data replay**: Safe. Re-adding a user refreshes the TTL; re-deleting is a no-op.

### Multiplexing

- **Partially**. One record with several identifiers (for example `DAID` and `UID2`) produces several `Items` entries, but they are batched into the same request, not separate requests.

## Version Information

### Current Version

- TTD first-party data API, partner portal v3: `POST https://<data-server>/data/advertiser`.

### Version Deprecation

- No deprecation of `POST /data/advertiser` was found. TTD publishes upcoming changes for the Data API on the partner portal, but the page could not be read without JavaScript. NEEDS REVIEW.

### Latest Available Version

- v3 partner portal (current). NEEDS REVIEW for any newer data upload API.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Post data to advertiser (first-party data)](https://partner.thetradedesk.com/v3/portal/data/doc/post-data-advertiser-external)
- [Data environments (data servers)](https://partner.thetradedesk.com/v3/portal/data/doc/DataEnvironments)
- [API rate limits](https://partner.thetradedesk.com/v3/portal/api/doc/RateLimits)

### Changelog References

- Data API release notes: [https://partner.thetradedesk.com/v3/portal/data/doc/ReleaseNotesData](https://partner.thetradedesk.com/v3/portal/data/doc/ReleaseNotesData)
- Data API release notes archive: [https://partner.thetradedesk.com/v3/portal/data/doc/ReleaseNotesDataArchives](https://partner.thetradedesk.com/v3/portal/data/doc/ReleaseNotesDataArchives)
- Data API upcoming changes (deprecations): [https://partner.thetradedesk.com/v3/portal/data/doc/UpcomingChangesData](https://partner.thetradedesk.com/v3/portal/data/doc/UpcomingChangesData)
- API versions and sunset dates page / RSS feed: none found. NEEDS REVIEW

## FAQ

_No entries yet._
