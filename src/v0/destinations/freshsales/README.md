# Freshsales Destination

Implementation in **JavaScript** (v0, not CDK v2). Code: `src/v0/destinations/freshsales/`.

## Overview

Sends data to Freshsales (Freshsales Suite / Freshworks CRM):

- `identify` upserts a Contact.
- `group` upserts a Sales Account and links the user's Contact to it.
- `track` creates a Sales Activity or updates a Contact's lifecycle stage.

## Configuration

| Config key                       | UI label                                        | Used for                                                                                                         |
| -------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `apiKey`                         | API Key                                         | `Authorization: Token token=<apiKey>`. Required. In `secretKeys`.                                                |
| `domain`                         | Organisation URL                                | Host for every request (`https://<domain>/crm/sales/api/...`), for example `company.myfreshworks.com`. Required. |
| `rudderEventsToFreshsalesEvents` | Map your events with Freshsales Standard Events | Maps RudderStack event names to `sales_activity` or `lifecycle_stage`.                                           |

## Integration Functionalities

### Supported Message Types

From `db-config.json`: `cloud: ["identify", "track", "group"]`.

### Authentication

Every request uses `Authorization: Token token=<apiKey>` and `Content-Type: application/json` (`getHeaders` in `utils.js`). The API key is a per-user key from Profile Settings > API Settings. No OAuth.

The Freshworks CRM API docs still document the `Token token=` API key scheme. No deprecation of API key auth was found. Freshworks offers OAuth only for marketplace apps. ([API docs](https://developers.freshworks.com/crm/api/))

The code assumes the Freshsales Suite URL format (`<bundle alias>/crm/sales/api/...`). Legacy Freshsales Classic accounts (`*.freshsales.io`, paths under `/api/...`) would not work with these paths. NEEDS REVIEW.

### Validations

- **identify**: email required (`emailOnly`: `traits.email`, `context.traits.email`, `properties.email`).
- **group**: `traits.name` (account name) required. If no user email, only the account is upserted.
- **track**: event name required and must resolve (directly or via `rudderEventsToFreshsalesEvents`) to `sales_activity` or `lifecycle_stage` (case-insensitive, spaces become `_`).
  - `sales_activity`: `title`, `start_date`, `end_date`, `owner_id`, `targetable_type` required; one of `salesActivityName` / `salesActivityTypeId`; `targetable_id` required unless `targetable_type` is `contact`, in which case an email is required to look up the contact.
  - `lifecycle_stage`: email required; one of `lifecycleStageId` / `lifecycleStageName`.

### Rate Limits

The Freshworks CRM API docs state 1,000 API requests per hour per account (HTTP 429 when exceeded). Freshworks sells add-ons for higher limits. Intermediate calls count toward this limit.

### Batching Support

**No.** Router transform uses `simpleProcessRouterDest`.

### Intermediate Calls

All use `Token token=` auth on `https://<domain>`.

| Flow                                                     | Call                                                         | Why                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| group (with email)                                       | `POST /crm/sales/api/contacts/upsert?include=sales_accounts` | Get the contact's existing accounts (creates the contact if missing) |
| group (with email)                                       | `POST /crm/sales/api/sales_accounts/upsert`                  | Create/update the account, get its ID                                |
| track `sales_activity` without type ID                   | `GET /crm/sales/api/selector/sales_activity_types`           | Resolve activity type name to ID                                     |
| track `sales_activity` for a contact, no `targetable_id` | `POST /crm/sales/api/contacts/upsert`                        | Get the contact ID (creates the contact if missing)                  |
| track `lifecycle_stage` with name only                   | `GET /crm/sales/api/selector/lifecycle_stages`               | Resolve lifecycle stage name to ID                                   |

Note: the contact lookups use the upsert endpoint, so they create contacts as a side effect.

### Proxy Delivery

**No.** No `networkHandler.js`.

### User Deletion

**No.**

### OAuth Support

**No.**

### Processor vs Router

**Router** (`transformAtV1: "router"`, `FRESHSALES: { routerTransform: true }` in `features.ts`).

## General Queries

### Event Ordering

- **identify / group**: Required. Contact and account upserts overwrite fields, and group appends accounts to the contact.
- **track `lifecycle_stage`**: Required; the last stage written wins.
- **track `sales_activity`**: Not required; each call creates a separate activity with its own dates.

### Data Replay Feasibility

- **identify / group / lifecycle_stage**: Missing data can be replayed in order. Already-delivered data is mostly idempotent (upserts), but group can append a duplicate account link (see Known Issues).
- **sales_activity**: Missing data can be replayed. Already-delivered data creates duplicate activities.

### Multiplexing

**Yes**, for track: if an event maps to several Freshsales events in `rudderEventsToFreshsalesEvents` (for example both `sales_activity` and `lifecycle_stage`), one request is returned per mapped event.

## Known Issues

NEEDS REVIEW for each.

1. **group appends duplicate account links**: `getUserAccountDetails` adds the account to the contact's existing `sales_accounts` without checking if it is already there.
2. **Side-effect contact creation**: lookups use `contacts/upsert`, so a sales activity or group call for an unknown email creates a bare contact.
3. Intermediate call errors use `response.errors.code` as the status, defaulting to `'500'` (string). Freshsales 401/429 responses may not include `errors.code`, so they become retryable 500s.

## Version Information

### Current Version

- **Version:** `Unversioned`
- **Where in code:** `src/v0/destinations/freshsales/config.js` (`CONFIG_CATEGORIES` `baseUrl*` paths and `LIFECYCLE_STAGE_ENDPOINT`, all under `/crm/sales/api/`)

Freshworks CRM (Freshsales Suite) REST API. It has no version in the path.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [Freshworks CRM (Freshsales) API](https://developers.freshworks.com/crm/api/)

### Latest Available Version

- **Version:** `Unversioned`
- **Released:** Unknown
- **Upgrade needed:** No
- **Source:** [Freshworks CRM (Freshsales) API](https://developers.freshworks.com/crm/api/)

## Documentation Links

- [Freshworks CRM (Freshsales) API](https://developers.freshworks.com/crm/api/)
- [Authentication](https://developers.freshworks.com/crm/api/#authentication)
- [Upsert a contact](https://developers.freshworks.com/crm/api/#upsert_a_contact) (`/crm/sales/api/contacts/upsert`)
- [Upsert an account](https://developers.freshworks.com/crm/api/#upsert_an_account) (`/crm/sales/api/sales_accounts/upsert`)
- [Create a sales activity](https://developers.freshworks.com/crm/api/#create_sales_activity) (`/crm/sales/api/sales_activities`)
- [List all sales activities](https://developers.freshworks.com/crm/api/#list_all_sales_activities)
- [Admin configuration (selectors: sales activity types, lifecycle stages)](https://developers.freshworks.com/crm/api/#admin_configuration)
- [Freshsales Classic API (legacy)](https://developer.freshsales.io/api/)

### Changelog References

- **Changelog:** [Freshworks community product updates (Freshsales release notes)](https://community.freshworks.com/product-updates) (blocks automated requests)
- **Deprecations:** None found
- **Versions:** Not versioned
- **Feed:** None found
- **Announcements:** None found
- **Last checked:** 2026-11-16

Freshworks publishes no API changelog for Freshsales; release notes are product-wide. The former "What's new with Freshsales" page now redirects to the Freshsales product page. API-related notices appear occasionally in the [Freshworks developer community](https://community.freshworks.dev/c/product-apis/8).

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## FAQ
