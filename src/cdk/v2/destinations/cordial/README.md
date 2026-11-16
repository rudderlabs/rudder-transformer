# Cordial Destination

Implementation in **CDK v2** (YAML workflows)

## Overview

Sends RudderStack `identify` and `track` events to Cordial. Identify calls create or update Cordial contacts; track calls create contact activities.

## Configuration

### Required Settings

- **API Key** (`apiKey`): Cordial API key. Sent as HTTP Basic auth (`base64(apiKey + ":")`).
- **API Base URL** (`apiBaseUrl`): Account-specific Cordial API host, for example `https://usw2.admin.cordial.io`. The workflow appends `/v2/...` paths to it.

### Optional Settings

- Consent settings (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`). These are handled by RudderStack, not by the transformer code.

## Integration Functionalities

> Cordial supports **Cloud mode** only.

### Implementation

- **Implemented in**: CDK v2 (`src/cdk/v2/destinations/cordial/procWorkflow.yaml`, `rtWorkflow.yaml`)
- **CDK v2 Enabled**: Yes (`cdkV2Enabled: true` in `db-config.json`, `CORDIAL: { routerTransform: true, cdkV2: true }` in `src/features.ts`)
- **Processor vs Router**: Router destination (`transformAtV1: "router"`). The router workflow runs the processor workflow per event; it does not batch.

### Supported Message Types

- **Identify**: Create or update a contact
- **Track**: Create a contact activity

```json
"supportedMessageTypes": { "cloud": ["identify", "track"] }
```

Supported source types: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, warehouse, reactnative, flutter, cordova, shopify.

### Batching Support

- **Supported**: No. Each event becomes one request (`batched: false` in `rtWorkflow.yaml`).

### Intermediate Calls

#### Identify: contact lookup

- **Endpoint**: `GET {apiBaseUrl}/v2/contacts/{cordialContactId}` or `GET {apiBaseUrl}/v2/contacts/email:{email}`
- **Code**: `checkIfContactExists` in `utils.js`
- **Why**: Decides between creating the contact (`POST /v2/contacts`) and updating it (`PUT /v2/contacts/...`). A contact exists when the lookup returns HTTP 200 with an `_id`.
- Made for every identify event. Track events make no intermediate call.

### Proxy Delivery

- **Supported**: No. There is no `networkHandler.js` and `src/features.ts` does not enable `transformerProxy` for Cordial.

### User Deletion

- **Supported**: No (no `deleteUsers.js`).

### OAuth Support

- **Supported**: No. API key with Basic auth.

### Validations

- `apiKey` and `apiBaseUrl` must be set.
- Message type must be `identify` or `track`.
- Either a Cordial contact ID (`context.externalId` with type `cordialContactId`) or an email (`traits.email`, `context.traits.email` or `properties.email`) is required.
- Track: `event` is required (mapped to `a`).

### Rate Limits

Cordial does not publish fixed numbers. Limits are set per API, differ by HTTP method and endpoint, and can be customised per account. When a limit is hit the API returns `429 Too Many Requests` with rate-limit headers (`X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`). NEEDS REVIEW: exact limits for `/v2/contacts` and `/v2/contactactivities` for RudderStack customers.

[Cordial API rate limits](https://support.cordial.com/hc/en-us/articles/7323031900301)

## General Queries

### Event Ordering

- **Identify**: Required. Identify updates contact attributes and subscribe status with last-write-wins semantics; out-of-order events can overwrite newer values with stale ones. The create-or-update decision also depends on a lookup, so concurrent or reordered identifies for a new contact can race.
- **Track**: Not strictly required. Each activity carries its own timestamp (`ats`), so Cordial records the original event time.

### Data Replay Feasibility

- **Missing data replay**
  - Identify: Feasible with caution. Replaying old identifies can overwrite newer contact attributes.
  - Track: Feasible. Activities keep their original `ats` timestamp.
- **Already delivered data replay**
  - Identify: Re-sending overwrites contact attributes with the replayed values; no duplicates are created because the contact is looked up first.
  - Track: Not recommended. RudderStack sends no unique ID with the activity, so Cordial records a new activity each time. NEEDS REVIEW: confirm Cordial has no activity deduplication.

### Multiplexing

- **No**. Each event produces one delivery request. The identify contact lookup is an intermediate call, not multiplexing.

## Version Information

### Current Version

Cordial REST API **v2**:

- `GET /v2/contacts/{id}` and `GET /v2/contacts/email:{email}` (lookup)
- `POST /v2/contacts` (create), `PUT /v2/contacts/{id}` or `PUT /v2/contacts/email:{email}` (update)
- `POST /v2/contactactivities` (track)

### Version Deprecation

No deprecation or sunset is announced for v2. Cordial does not publish an API lifecycle policy. NEEDS REVIEW.

### Latest Available Version

v2 is the latest documented version (all paths in the Cordial API reference are under `/v2/`).

## Documentation Links

- [Cordial API reference (v2)](https://developers.cordial.com/api)
- [Contacts API](https://support.cordial.com/hc/en-us/articles/203885958-Contacts-API)
- [Contact activities API](https://support.cordial.com/hc/en-us/articles/203885968)
- [API rate limits](https://support.cordial.com/hc/en-us/articles/7323031900301)

### Changelog References

NEEDS REVIEW: Cordial does not publish a public API changelog, deprecations page or feed. The developer portal footer has a "Changelog" link with no target. The closest related page is the [Cordial product showcase](https://cordial.com/new-releases/), which covers product releases rather than API changes.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
