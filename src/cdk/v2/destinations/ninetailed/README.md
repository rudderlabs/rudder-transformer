# Ninetailed Destination

Implementation in **CDK v2** (`src/cdk/v2/destinations/ninetailed/`). There is no v0 or v1 folder.

> Ninetailed was acquired by Contentful. Ninetailed docs (`docs.ninetailed.io`) now redirect to `contentful.com/developers/docs/ninetailed/...`, and the product is being folded into Contentful Personalization. Contentful sunset the **legacy Ninetailed app** (dashboard) in March 2026 ([Contentful changelog](https://www.contentful.com/developers/changelog/ninetailed-app-has-been-sunsetted/)). That notice concerns the app; no sunset of the Experience API was found. NEEDS REVIEW.

## Configuration

Config keys read by the transformer (`destination.Config`):

| Key              | UI label                  | Purpose                                                  |
| ---------------- | ------------------------- | -------------------------------------------------------- |
| `organisationId` | Organization ID (API Key) | Path parameter; acts as the only credential (secret key) |
| `environment`    | Environment slug          | Path parameter (for example `main`)                      |

`sendPageInDevice`, `useNativeSDK`, event filtering and consent settings are not read by the transformer.

## Integration Functionalities

### Implementation

- **Implemented in**: CDK v2 (`procWorkflow.yaml`, `rtWorkflow.yaml`, `utils.js`, `config.js`, `data/*.json`)
- **CDK v2 Enabled**: Yes (`cdkV2Enabled: true`; `features.ts`: `NINETAILED: { routerTransform: true, cdkV2: true }`)
- **Processor vs Router**: Router (`transformAtV1: "router"`)

### Supported Message Types

Cloud mode: `track`, `identify`. (`page` is supported only in web device mode.)

### Authentication

- No auth header or token. The organization ID in the URL path identifies the account: `POST https://experience.ninetailed.co/v2/organizations/{organisationId}/environments/{environment}/events`, `Content-Type: application/json`.
- No OAuth. `secretKeys: ["organisationId"]`.
- No announced auth change found. NEEDS REVIEW given the Contentful migration.

### Validations

- `message.type` must be `track` or `identify`.
- `Config.organisationId` and `Config.environment` required (`ConfigurationError`).
- `anonymousId` and `messageId` are required by the mapping (`generalPayloadMapping.json`); `track` requires `event`.

### Batching

- **Supported**: Yes, `track` and `identify` together, in `rtWorkflow.yaml` → `batchResponseBuilder` (`utils.js`).
- **Max batch size**: `MAX_BATCH_SIZE = 200` events per request.
- The Experience API documents per-request limits of up to 200 events, at most 50 `identify` events, across at most 50 unique profiles. The transformer only enforces the 200-event limit. NEEDS REVIEW: a router batch with more than 50 identify events or 50 distinct profiles may be rejected.

### Intermediate Calls

None.

### Proxy Delivery

No.

### User Deletion

No.

### OAuth Support

No.

### Rate Limits

Not found in public docs. NEEDS REVIEW.

## General Queries

### Event Ordering

- **Identify**: Required. Traits update the Ninetailed profile; out-of-order delivery can leave stale traits.
- **Track**: Recommended. Events carry `originalTimestamp`, but they also drive audience and experience evaluation on the profile.

### Data Replay Feasibility

- **Missing data**: Track can be replayed (timestamps included); identify replay may overwrite newer traits.
- **Already delivered**: `messageId` is sent, but no documented deduplication on it was found. NEEDS REVIEW.

### Multiplexing

None. Router batching combines events; it does not split one event into several.

## Version Information

### Current Version

Experience API **v2** (`/v2/organizations/...` in `config.js` `batchEndpoint`).

### Version Deprecation

No deprecation of Experience API v2 found. The legacy Ninetailed app was sunset in March 2026 ([Contentful changelog](https://www.contentful.com/developers/changelog/ninetailed-app-has-been-sunsetted/)). NEEDS REVIEW whether the Experience API host or credentials move to Contentful.

### Latest Available Version

v2 is the latest documented version of the Experience API. NEEDS REVIEW.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Experience API (Contentful docs)](https://contentful.com/developers/docs/ninetailed/experience-api)
- [Ninetailed SDK changelog](https://contentful.com/developers/docs/personalization/ninetailed-changelog.md)

### Changelog References

- [Contentful developer changelog](https://www.contentful.com/developers/changelog/) (Ninetailed entries appear here)
- [Ninetailed app sunset notice](https://www.contentful.com/developers/changelog/ninetailed-app-has-been-sunsetted/)
- [Ninetailed SDK changelog](https://contentful.com/developers/docs/personalization/ninetailed-changelog.md)
- Note: `contentful.com` answered curl with HTTP 429 (bot protection); the URLs were found through web search, and `docs.ninetailed.io` redirects to the Contentful docs. NEEDS REVIEW: confirm in a browser.
- API versions/sunset page and RSS feed: none found. NEEDS REVIEW.

## FAQ

<!-- Populated over time -->
