# ProfitWell Destination

ProfitWell (now Paddle ProfitWell Metrics) tracks subscription revenue metrics. This destination turns RudderStack `identify` events into ProfitWell subscription create or update calls.

Implementation: `src/v0/destinations/profitwell/` (JavaScript, v0).

## Configuration

### Required Settings

| Config key      | UI label        | Used by    | Description                                                                |
| --------------- | --------------- | ---------- | -------------------------------------------------------------------------- |
| `privateApiKey` | Private API Key | Cloud mode | ProfitWell private API token. Secret (`secretKeys`). Required by the code. |

### Device Mode Settings (not used by this transformer)

| Config key     | Description                                            |
| -------------- | ------------------------------------------------------ |
| `publicApiKey` | Public token for the ProfitWell web SDK (device mode). |
| `siteType`     | Site type for the web SDK.                             |

`schema.json` does not define `privateApiKey`, `publicApiKey` or `siteType` (only consent fields), so these inputs are not validated by schema. **NEEDS REVIEW**.

## Integration Functionalities

### Implementation

- **Language**: JavaScript (`transform.js`, `utils.js`, `config.js`, mappings in `data/`).
- **Processor vs Router**: Router destination (`transformAtV1: "router"`, `PROFITWELL: { routerTransform: true }` in `src/features.ts`). `processRouterDest` uses `simpleProcessRouterDest`.

### Supported Message Types

| Type       | Cloud | Device (web) |
| ---------- | ----- | ------------ |
| `identify` | Yes   | Yes          |
| others     | No    | No           |

Supported sources: android, androidKotlin, ios, iosSwift, web, unity, amp, cloud, reactnative, flutter, cordova, warehouse, shopify.

### Authentication

Every call (lookup, create, update) sends:

```
Authorization: <Config.privateApiKey>
Content-Type: application/json   (create/update only)
```

The raw token is sent with no `Bearer` prefix. No OAuth.

Paddle now hosts the ProfitWell API v2 docs under `classic.paddle.com`, which Paddle labels as legacy documentation ("Paddle Classic, which is no longer available for new signups"). Paddle is also removing **inactive free ProfitWell Metrics accounts** (accounts not accessed for over 12 months; date given per account by email). No dated sunset of `api.profitwell.com/v2` or of private API tokens was found. **NEEDS REVIEW**: confirm with Paddle whether the ProfitWell v2 API has an end-of-life date.

### Batching Support

None. One request per event.

### Intermediate Calls

Every `identify` makes a GET before the write:

| Call                     | Endpoint                                                         | Why                                                                 |
| ------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| Get subscription history | `GET https://api.profitwell.com/v2/users/{userId or userAlias}/` | Decide whether to create a subscription (POST) or update one (PUT). |

### Proxy Delivery

Not supported (no `networkHandler.js`).

### User Deletion

Not supported (no `deleteUsers.js`).

### OAuth Support

No.

### Additional Functionalities

- **Create vs update** based on the user's subscription history (see [businesslogic.md](docs/businesslogic.md)).
- **Currency check**: `plan_currency` is dropped (set to null) if it is not in the built-in ISO currency list.
- **Status check**: `status` other than `active` or `trialing` is dropped.

### Validations

- `message.type` required; `Config.privateApiKey` required.
- One of `externalId` type `profitwellUserId` or `userId` (user alias) is required.
- One of `externalId` type `profitwellSubscriptionId` or `traits.subscriptionAlias` is required.
- `planInterval` must be `month` or `year` (case-insensitive).
- Create requires `email`, `planId`, `planInterval`, `value`. Update requires `planId`, `planInterval`, `value`, `effectiveDate`.
- `effectiveDate` must convert to a positive number (`new Date(Number(date))`), otherwise the event fails.

### Rate Limits

Not documented in the ProfitWell v2 docs we could reach. **NEEDS REVIEW**.

## General Queries

### Event Ordering

Required. Each `identify` creates or updates a subscription (plan, value, status, effective date). Out-of-order delivery can leave a subscription on stale values, and an update delivered before the create for the same alias can create a duplicate subscription.

### Data Replay Feasibility

- **Missing data**: Possible if replayed in order. `effective_date` from the event (or event timestamp) keeps metric history aligned.
- **Already-delivered data**: Replaying an update is idempotent in effect (PUT with same values). Replaying a create after the subscription exists turns into an update because of the history lookup.

### Rate Limits and Batch Sizes

No batching. Two calls per event (GET + POST/PUT).

### Multiplexing

No. Each event produces one delivery request (the GET is made during transformation).

## Version Information

### Current Version

ProfitWell API **v2** (`https://api.profitwell.com/v2/...`, paths in `transform.js` and `utils.js`).

### Version Deprecation

No published end-of-life date for ProfitWell API v2. Paddle lists it as legacy docs on `classic.paddle.com`. **NEEDS REVIEW**.

### Latest Available Version

v2 is the only documented ProfitWell API version. Paddle's current product APIs (Paddle Billing) are a separate platform, not a ProfitWell API v3.

## Documentation Links

- [ProfitWell API v2 (Paddle Classic docs)](https://classic.paddle.com/profitwell/)
- [Paddle: ProfitWell API help article](https://www.paddle.com/help/profitwell-metrics/setup/get-started/profit-well-api)
- [Paddle: ProfitWell Metrics account offboarding FAQs](https://www.paddle.com/help/profitwell-metrics/setup/configure/metrics-account-offboarding-faqs)

### Changelog References

- [Paddle developer changelog](https://developer.paddle.com/changelog) (covers Paddle Billing; ProfitWell API changes are not listed there)
- No ProfitWell-specific changelog, deprecation page or RSS feed was found. **NEEDS REVIEW**

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ

_No entries yet._
