# Google Ads Enhanced Conversions Destination

Implementation in **TypeScript**

## Overview

Sends `track` events to Google Ads as conversion adjustments through `ConversionAdjustmentUploadService.UploadConversionAdjustments`. By default each event enhances an existing web conversion (matched by order ID) with hashed first-party user data. It can also send `RESTATEMENT` adjustments that change a conversion's value.

## Configuration

### Required Settings

- **Event delivery account** (`rudderAccountId`): OAuth account (Google sign-in) used to call the Google Ads API.
- **Customer ID** (`customerId`): Google Ads customer ID. Hyphens are removed. Must be a string or number.
- **Sub Account** (`subAccount`, default `false`): Set when the customer is accessed through a manager account.

### Conditionally Required

- **Login Customer ID** (`loginCustomerId`): Required when `subAccount` is `true`. Sent as the `login-customer-id` header.

### Optional Settings

- **List of Conversion** (`listOfConversions`): Conversion action names. Only track events whose `event` matches one of these names are sent.
- **Hashing required** (`requireHash`, default `true`): When `true`, PII is normalised and SHA-256 hashed by RudderStack. When `false`, values are expected to be pre-hashed. Missing in config means `true`.
- **Adjustment Type** (`adjustmentType`, `ENHANCEMENT` or `RESTATEMENT`, default `ENHANCEMENT`).

When the `AMP_enable-google-ads-customer-picker` flag is on, the UI shows pickers for customer ID and conversions instead of text inputs. The stored config keys are the same.

## Integration Functionalities

> Google Ads Enhanced Conversions supports **Cloud mode** only.

### Implementation

- **Implemented in**: TypeScript (v0), `src/v0/destinations/google_adwords_enhanced_conversions/`
- **CDK v2 Enabled**: No
- **Processor vs Router**: Router destination (`transformAtV1: "router"`)
- **Framework**: Native batching framework (`routerTransform.ts` exports a `DestinationIntegration`; `src/features.ts` sets `routerTransform: true, batching: true`). `transform.ts` builds the single adjustment and is reused by the router integration.

### Supported Message Types

```json
"supportedMessageTypes": { "cloud": ["track"] }
```

### Batching Support

- **Supported**: Yes, for track events.
- **Batch size**: Up to 2,000 adjustments per request (`MAX_CONVERSION_ADJUSTMENTS_PER_BATCH`), Google's per-request cap.
- Events are grouped by endpoint, method and headers, so one batch covers one customer ID. Events for different conversion actions can share a batch because the conversion action is resolved per event during transform.

### Intermediate Calls

#### Conversion action lookup

- **Endpoint**: `POST https://googleads.googleapis.com/v25/customers/{customerId}/googleAds:searchStream` (through `GoogleAdsSDK.getConversionActionId` in `@rudderstack/integrations-lib`)
- **Why**: Adjustments need the conversion action resource name (`customers/{id}/conversionActions/{id}`), but the dashboard stores conversion names.
- **Caching**: Cached per `(event name, customerId)` for 24 hours by default (`CONVERSION_ACTION_ID_CACHE_TTL` env var, seconds). A batch makes at most one lookup per distinct conversion name.
- A lookup that returns no conversion action fails the event with an instrumentation error.

### Proxy Delivery

- **Supported**: Yes (proxy v1). Batching destinations get transformer proxy unless `transformerProxy: false` is set. Delivery is defined in `delivery.ts` (`gaecDelivery`), which also injects the `developer-token` header at delivery time so it never appears in router output.
- **Partial batching response handling**: Yes. Requests are sent with `partialFailure: true`. On a 2xx response with a non-zero `partialFailureError`, each adjustment whose `results[i]` entry is empty or missing is aborted, and the rest are marked successful.
- **Auth errors**: On 4xx, `getAuthErrCategory` maps the response to `REFRESH_TOKEN` (token refresh and retry) or `AUTH_STATUS_INACTIVE` (account marked inactive).

### User Deletion

- **Supported**: No (no `deleteUsers.js`).

### OAuth Support

- **Supported**: Yes. `auth.type: "OAuth"` with `rudderScopes: ["delivery"]` in `db-config.json`. The account definition is `accounts/google_adwords_enhanced_conversions_oauth` (`refreshOAuthToken: true`). rudder-auth requests the `https://www.googleapis.com/auth/adwords` scope. The transformer reads the token from `metadata.secret.access_token`.

### Additional Functionalities

- **PII normalisation and hashing**: email, phone, first name, last name and street address are normalised, validated and SHA-256 hashed (`processUserIdentifiers` in `utils.ts`, using the shared audience utilities). Invalid values are dropped and counted in an invalid-field metric. A mismatch between the data and `requireHash` (for example already-hashed values with `requireHash: true`) fails the event.
- **Restatement mode**: With `adjustmentType: RESTATEMENT`, `userIdentifiers` and `userAgent` are removed and the adjustment carries `restatementValue`.

### Validations

- Message type must be `track`, and `event` must be non-empty.
- `event` must match a name in `listOfConversions`.
- `properties.orderId` or `properties.order_id` is required.
- For `ENHANCEMENT`, at least one valid user identifier must remain after normalisation.
- `customerId` must be a string or number; `loginCustomerId` is required (string or number) when `subAccount` is `true`.

### Rate Limits

| Limit                                | Value                                                            |
| ------------------------------------ | ---------------------------------------------------------------- |
| Adjustments per request              | 2,000 (`TOO_MANY_ADJUSTMENTS_IN_REQUEST` above this)             |
| Daily operations, Basic access token | 15,000                                                           |
| Daily operations, Standard access    | No daily cap                                                     |
| Requests per second                  | Not published; Google returns `RESOURCE_EXHAUSTED` when exceeded |

[Google Ads API quotas](https://developers.google.com/google-ads/api/docs/best-practices/quotas)

## General Queries

### Event Ordering

- **Enhancements**: Not required. Each enhancement is matched to an existing conversion by `orderId` and conversion action, and Google rejects a second enhancement for the same pair (`CONVERSION_ALREADY_ENHANCED`). The original conversion must already exist when the enhancement arrives.
- **Restatements**: Required per order. Several restatements for the same order are applied in the order received, so the last one wins. Send `properties.adjustmentDateTime` to make the intended order explicit.

### Data Replay Feasibility

- **Missing data replay**: Feasible only within Google's window. Google requires enhancements within 24 hours of the original conversion; later uploads are not used.
- **Already delivered data replay**: Enhancements are effectively deduplicated: a repeat for the same order ID and conversion action is rejected as already enhanced (and aborted by the partial-failure handling). Replayed restatements overwrite the value again.

### Multiplexing

- **No**. One event produces one conversion adjustment. The conversion action lookup is an intermediate call.

## Version Information

### Current Version

Google Ads API **v25** (`API_VERSION` in `config.ts`):

- `POST /v25/customers/{customerId}:uploadConversionAdjustments`
- `POST /v25/customers/{customerId}/googleAds:searchStream` (conversion action lookup through the SDK)

### Version Deprecation

v25 was released on July 22, 2026 and sunsets in **August 2027**. Google aims to sunset each version about a year after release; requests to a sunset version fail.

Google moved offline conversion imports and enhanced conversions for leads to the Data Manager API (blocked in the Google Ads API from June 15, 2026). No equivalent notice was found for enhanced conversions for web via `UploadConversionAdjustments`. NEEDS REVIEW: watch for a Data Manager migration notice for web enhancements.

### Latest Available Version

**v26** (released October 14, 2026, sunset November 2027), with minor releases v26.1 (October 28, 2026) and v26.2 (November 11, 2026). No `ConversionAdjustmentUploadService` changes were found in the v26 release notes. NEEDS REVIEW before upgrading.

## Documentation Links

- [Enhanced conversions for web (API)](https://developers.google.com/google-ads/api/docs/conversions/enhanced-conversions/web)
- [Google Ads API quotas](https://developers.google.com/google-ads/api/docs/best-practices/quotas)
- [Improvements to conversion adjustment uploads (blog)](https://developers.google.com/ads/blog/posts/2024/08/improvements-to-conversion-adjustment)
- [Changes to offline click conversion import support (blog)](https://developers.google.com/ads/blog/posts/2026/05/changes-to-offline-click-conversion)

### Changelog References

- [Google Ads API release notes](https://developers.google.com/google-ads/api/docs/release-notes)
- [Google Ads API deprecation and sunset dates](https://developers.google.com/google-ads/api/docs/sunset-dates)
- [Google Advertising and Measurement developer blog](https://developers.google.com/ads/blog)
- Feeds: [release announcements](https://developers.google.com/ads/blog/feeds/releases), [deprecation and sunset announcements](https://developers.google.com/ads/blog/feeds/deprecations), [Google Ads API posts](https://developers.google.com/ads/blog/feeds/products/google-ads-api)

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
