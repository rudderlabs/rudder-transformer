# Zoho CRM Destination

Implementation in **CDK v2** (`rtWorkflow.yaml` + TypeScript helpers). Proxy delivery (v1) lives in `src/v1/destinations/zoho/networkHandler.js`.

## Overview

Zoho CRM is a customer relationship management platform. This destination is a reverse ETL (VDM v2) destination that upserts warehouse rows into a Zoho CRM module (standard modules such as Leads, Contacts, Accounts, Deals, or custom modules) and deletes records that leave the synced model.

## Configuration

### Destination Settings

- **Event delivery account** (`rudderAccountId`, required): OAuth account of type `DESTINATION_ZOHO_OAUTH`. The account stores the data-centre **Region** option (`US`, `EU`, `IN` in the account UI).
- **Consent management** (`consentManagement`, `oneTrustCookieCategories`, `ketchConsentPurposes`).

### Connection Settings (`connection.config.destination`)

Set per connection in the VDM v2 setup:

- **`object`** (required): Zoho module API name (for example `Leads`).
- **`identifierMappings`** (required): `[{ from, to }]`; `to` values are the Zoho fields used as duplicate-check fields for upsert and as lookup fields for delete.
- **`trigger`**: Workflow trigger behaviour. `Default` (Zoho default triggers), `None` (no triggers), or a specific trigger name (for example `workflow`).
- **`addDefaultDuplicateCheck`**: Also use the module's system duplicate-check field (for example `Email` for Leads/Contacts).
- **`multiSelectFieldLevelDecision`**: `[{ from: <field>, to: "true" | "false" }]`; marks multi-select fields and whether values are appended (`$append_values`).

NEEDS REVIEW: the connection-config UI definition was not found in rudder-integrations-config; keys above come from `types.ts` and the transformer code.

## Integration Functionalities

> Cloud mode only, warehouse sources only.

### Supported Message Types

- **Record**: Yes (`action` `insert`, `update`, `delete`).

From `db-config.json`:

```json
"supportedSourceTypes": ["warehouse"],
"supportedMessageTypes": { "cloud": ["record"] },
"syncBehaviours": ["mirror"],
"supportsVisualMapperV2": true,
"disableJsonMapper": true
```

### Config keys used in code

- `destination.Config.region` (fallback when there is no delivery account) and `destination.deliveryAccount.options.region`.
- Connection config: `object`, `identifierMappings`, `trigger`, `addDefaultDuplicateCheck`, `multiSelectFieldLevelDecision`.

### Batching Support

- **Upsert** (`insert`, `update`): up to **100** records per request (`MAX_BATCH_SIZE`), matching Zoho's upsert limit.
- **Delete**: up to **100** record IDs per request (Zoho's mass delete limit).

### Intermediate Calls

- **Delete only**: Zoho needs record IDs to delete, so the transformer looks them up with COQL:
  - `POST https://www.zohoapis.<dc>/crm/v6/coql` with `SELECT id, <identifier fields> FROM <module> WHERE <field> in (...) OR ...`.
  - Events are grouped so that each query has at most **50** distinct values per field (`COQL_BATCH_SIZE`, Zoho's `IN` limit); queries run in parallel.
  - Results are post-filtered for exact matches on all identifiers and mapped back to events by `jobId`.
  - `INVALID_TOKEN` during lookup → `RetryableError` (500) with `REFRESH_TOKEN`, so the OAuth token is refreshed.

### Proxy Delivery

- **Supported**: Yes, proxy **v1**. Source: `src/v1/destinations/zoho/networkHandler.js`. Enabled with `transformerProxy: true` in `src/features.ts`.
- **Partial batch handling**: Yes. For 2xx responses, each `response.data[i]` is mapped to `metadata[i]`; entries with `status !== 'success'` are marked 400, the rest 200.
- `INVALID_TOKEN` → `TransformerProxyError` (500) with an auth error category, so the token is refreshed.
- Other non-2xx → `TransformerProxyError` with the response status.

### User Deletion

- **Supported**: No. There is no `deleteUsers.js`.

### OAuth Support

- **Supported**: Yes. `auth.type: "OAuth"`, `rudderScopes: ["delivery"]`, account definition `DESTINATION_ZOHO_OAUTH` with `refreshOAuthToken: true`.
- rudder-auth (`src/implementations/oauth/zoho`) requests scopes `ZohoCRM.settings.modules.ALL`, `ZohoCRM.settings.ALL`, `ZohoCRM.settings.fields.ALL`, `ZohoCRM.users.ALL`, `ZohoCRM.modules.ALL`, `ZohoCRM.coql.READ`.
- Requests use `Authorization: Zoho-oauthtoken <accessToken>` from `metadata.secret.accessToken`.

### Processor vs Router

- `transformAtV1: "router"`; router-only CDK v2 workflow.

### Additional Functionalities

- **Data centres**: Base URL from `@rudderstack/integrations-lib` `ZOHO_SDK`: US `zohoapis.com`, EU `zohoapis.eu`, IN `zohoapis.in`, AU `zohoapis.com.au`, CN `zohoapis.com.cn`, JP `zohoapis.jp`, CA `zohoapiscloud.ca`. The account UI only offers US, EU, IN.
- **Multi-select fields**: Values of fields listed in `multiSelectFieldLevelDecision` are wrapped in an array.
- **Workflow triggers**: `trigger` controls the upsert `trigger` array and the delete `wf_trigger` flag.

### Validations

- Region must resolve (from the account options or `Config.region`), else the batch is aborted.
- `connection.config.destination` with `object` and `identifierMappings` is required, else a `ConfigurationError` for the batch.
- Non-`record` events fail per event.
- Upsert: merged `identifiers` + `fields` must be non-empty. System-mandatory fields of standard modules (for example `Last_Name` for Leads/Contacts, `Deal_Name`/`Stage`/`Pipeline` for Deals) fail the event if mapped but empty.
- Delete: `identifiers` must be non-empty; no matching record → per-event `InstrumentationError`.

### Rate Limits

From [Zoho CRM API limits](https://www.zoho.com/crm/developer/docs/api/v8/api-limits.html):

| Item                             | Limit                                                                                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Daily credits (rolling 24 hours) | Edition-based: Free 5,000; Standard 50,000 + 250/user (max 100,000); Professional 50,000 + 500/user; Enterprise 50,000 + 1,000/user; Ultimate 50,000 + 2,000/user |
| Concurrency (per org per app)    | Free 5, Standard 10, Professional 15, Enterprise 20, Ultimate 25; sub-concurrency 10 for COQL                                                                     |
| Upsert                           | 100 records per call; 1 credit per 10 records                                                                                                                     |
| Delete by IDs                    | 100 records per call; 1 credit per 100 records                                                                                                                    |
| COQL                             | 1 credit for up to 200 records returned                                                                                                                           |

## General Queries

### Event Ordering

- **Insert/Update (upsert)**: Ordering matters for the same record; an older row can overwrite newer values. Within a batch, duplicates of the same record are not merged.
- **Delete**: A delete followed by an out-of-order upsert would re-create the record. Mirror syncs send one action per row per sync, which limits this risk.

### Data Replay Feasibility

- **Missing data replay**: Feasible; upserts are idempotent on the duplicate-check fields, and Zoho has no event timestamp to reconcile.
- **Already delivered data replay**: Safe for upserts (same values are rewritten; workflow triggers may fire again unless `trigger` is `None`). Replaying deletes fails per event with "No <module> is found".

### Multiplexing

- **Delete**: One delete event can match several Zoho records (all IDs found are deleted), and every delete batch needs COQL lookup calls before delivery.
- **Upsert**: No multiplexing.

## Version Information

### Current Version

- Zoho CRM REST API **v6** (`/crm/v6/{module}/upsert`, `/crm/v6/{module}`, `/crm/v6/coql`), from `ZOHO_SDK` in `@rudderstack/integrations-lib`.

### Version Deprecation

- Zoho has not announced an end-of-life for v6. The V7 and V8 launch announcements state that older versions are not being deprecated at this time ([V8 announcement](https://help.zoho.com/portal/en/community/topic/zoho-crms-v8-apis-are-here)).

### Latest Available Version

- **v8**. See the [V8 changelog](https://www.zoho.com/crm/developer/docs/api/v8/change-log.html) and [What's new in V8](https://www.zoho.com/crm/developer/docs/api/v8/whats-new.html). No breaking change to upsert, delete or COQL was identified in the V8 changelog. NEEDS REVIEW before upgrading.

## RETL Functionality

See [docs/retl.md](docs/retl.md).

## Business Logic and Mappings

See [docs/businesslogic.md](docs/businesslogic.md).

## Documentation Links

- [Upsert records (v6)](https://www.zoho.com/crm/developer/docs/api/v6/upsert-records.html)
- [Delete records (v6)](https://www.zoho.com/crm/developer/docs/api/v6/delete-records.html)
- [COQL overview (v6)](https://www.zoho.com/crm/developer/docs/api/v6/COQL-Overview.html)
- [API limits (v8)](https://www.zoho.com/crm/developer/docs/api/v8/api-limits.html)

### Changelog References

- API changelog (V8): [https://www.zoho.com/crm/developer/docs/api/v8/change-log.html](https://www.zoho.com/crm/developer/docs/api/v8/change-log.html)
- What's new in V8: [https://www.zoho.com/crm/developer/docs/api/v8/whats-new.html](https://www.zoho.com/crm/developer/docs/api/v8/whats-new.html)
- Zoho CRM release notes (filter by Developer Platform): [https://www.zoho.com/crm/whats-new/release-notes.html?yearOpt=all&labelTag=Developer%20Platform&topicTag=all&DCTag=all&editionTag=all](https://www.zoho.com/crm/whats-new/release-notes.html?yearOpt=all&labelTag=Developer%20Platform&topicTag=all&DCTag=all&editionTag=all)
- Deprecations / API versions and sunset dates page and RSS feed: none found. NEEDS REVIEW

## FAQ

_No entries yet._
