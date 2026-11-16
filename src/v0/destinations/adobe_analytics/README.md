# Adobe Analytics Destination

Implementation in **JavaScript** (v0), `src/v0/destinations/adobe_analytics/`. No v1 or CDK v2 folder exists.

Cloud mode sends one XML hit per event to the Adobe Analytics **Data Insertion API**.

## Configuration

Config keys read by the transformer (`destination.Config`, normalized by `config.js` `formatDestinationConfig`; mapping keys are lowercased):

| Key                                                                                                    | Purpose                                                                                  |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `reportSuiteIds` (required)                                                                            | Sent as `<reportSuiteID>`                                                                |
| `trackingServerSecureUrl`                                                                              | Host for the endpoint `https://<host>/b/ss//6` (`https://` added if missing)             |
| `rudderEventsToAdobeEvents`                                                                            | Custom track/page/screen name → Adobe event(s) (comma-separated)                         |
| `eventMerchEventToAdobeEvent`, `eventMerchProperties`                                                  | Merchandising events in the `events` string (`eventN=value`)                             |
| `productMerchEventToAdobeEvent`, `productMerchProperties`, `productMerchEvarsMap`, `productIdentifier` | Product string events, merchandising eVars, and product identifier (`name`, `id`, `sku`) |
| `eVarMapping`, `hierMapping`, `listMapping` (+ delimiter), `customPropsMapping` (+ delimiter)          | Property → `eVarN`, `hierN`, `listN`, `propN`                                            |
| `contextDataMapping`, `contextDataPrefix`                                                              | Property → `contextData.<prefix><key>`                                                   |
| `marketingCloudOrgId`                                                                                  | Sent as `marketingcloudorgid`                                                            |
| `dropVisitorId`, `timestampOption`, `preferVisitorId`, `timestampOptionalReporting`                    | Control `visitorID` and `timestamp` (see business logic)                                 |
| `noFallbackVisitorId`                                                                                  | Skip `fallbackVisitorId` from `externalId` type `AdobeFallbackVisitorId`                 |
| `trackPageName`                                                                                        | Send `pageName` when `overridePageView` is set                                           |

Device-mode-only keys (`trackingServerUrl`, heartbeat and proxy URLs, `sslHeartbeat`, `mobileEventMapping`, `eventsToTypes`) are not read by the cloud-mode transformer.

## Integration Functionalities

### Implementation

- **Implemented in**: JavaScript (v0)
- **CDK v2 Enabled**: No
- **Processor vs Router**: Processor (`transformAtV1: "processor"`). `processRouterDest` exists (`simpleProcessRouterDest`), but `features.ts` does not set `routerTransform` for `ADOBE_ANALYTICS`.

### Supported Message Types

Cloud mode: `track`, `page`, `screen`. Page/screen use `message.name` as the event name and go through the same track logic.

### Authentication

- **None.** The Data Insertion API is unauthenticated; the hit is routed by tracking server host and report suite ID. Headers: `Content-type: application/xml` only. No `secretKeys`, no OAuth.
- No auth change announced for the Data Insertion API. Adobe's 1.4 API / WSSE end-of-life does not apply to it ([Adobe Analytics 1.4 API EOL](https://experienceleague.adobe.com/en/docs/discontinued/using/analytics-1-4-apis) states the Data Insertion API is not impacted). The recommended replacement, the Bulk Data Insertion API, requires Adobe IMS (OAuth server-to-server) credentials.

### Validations

- `message.type` required; only `track`/`page`/`screen`.
- Event name required (`Event name is not present`).
- Track events must be a built-in ecommerce event, mapped in `rudderEventsToAdobeEvents`, or carry `properties.overrideEventName`; otherwise `ConfigurationError`.

### Batching

No. One hit per request (Data Insertion API accepts one hit per request).

### Intermediate Calls

None.

### Proxy Delivery

- **Supported**: Yes (`features.ts`: `ADOBE_ANALYTICS: { transformerProxy: true }`), `src/v0/destinations/adobe_analytics/networkHandler.js`.
- Adobe returns XML with HTTP 200 even on failure. The handler extracts `<status>`/`<reason>` and throws `InstrumentationError` (aborted, not retried) when status is `FAILURE`.
- No partial batching (single-hit requests).

### User Deletion

No.

### OAuth Support

No.

### Rate Limits

No published limit for the Data Insertion API found. NEEDS REVIEW.

## General Queries

### Event Ordering

- With **timestamps enabled** (`timestamp` sent), Adobe processes hits by timestamp; ordering is less critical, though Adobe expects hits within a visit to arrive in order. NEEDS REVIEW.
- With **timestamps disabled** (`visitorID` only), Adobe uses arrival time, so order matters for visit/path reporting.

### Data Replay Feasibility

- **Missing data**: Feasible only for timestamp-enabled report suites (timestamp is sent). Otherwise replayed hits are recorded at replay time.
- **Already delivered**: Not feasible; Adobe has no dedup key on Data Insertion hits, so replays double-count. (`purchaseID` dedups purchases only.)

### Multiplexing

None.

## Version Information

### Current Version

Data Insertion API, XML POST to `https://<trackingServerSecureUrl>/b/ss//6` (format `6` = XML response; empty report-suite segment because the RSID is in the XML body). See `transform.js` `responseBuilderSimple`.

### Version Deprecation

No end-of-life announced. Adobe "plans to continue support for the Data Insertion API" but recommends the Bulk Data Insertion API for new server-side implementations ([Data Insertion API](https://developer.adobe.com/analytics-collection-apis/methods/data-insertion/)).

### Latest Available Version

- [Bulk Data Insertion API](https://developer.adobe.com/analytics-collection-apis/methods/bulk-data-insertion/endpoints) (CSV batches, IMS auth).
- Adobe Experience Platform Edge Network (Web SDK / Edge Network Server API) as the long-term collection path. Moving would change payload format and auth. NEEDS REVIEW.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Analytics collection APIs overview](https://developer.adobe.com/analytics-collection-apis/)
- [Data Insertion API](https://developer.adobe.com/analytics-collection-apis/methods/data-insertion/)
- [Data Insertion API (Experience League)](https://experienceleague.adobe.com/en/docs/analytics/import/c-data-insertion-api)
- [Bulk Data Insertion API endpoints](https://developer.adobe.com/analytics-collection-apis/methods/bulk-data-insertion/endpoints)

### Changelog References

- [Adobe Analytics release notes (latest)](https://experienceleague.adobe.com/en/docs/analytics/release-notes/latest)
- [Adobe Analytics 1.4 API end-of-life](https://experienceleague.adobe.com/en/docs/discontinued/using/analytics-1-4-apis) (discontinued-features page)
- API versions / sunset page for the Data Insertion API and RSS feed: none found. NEEDS REVIEW.

## FAQ

<!-- Populated over time -->
