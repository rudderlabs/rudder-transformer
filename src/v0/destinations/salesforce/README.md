# Salesforce Destination

## Overview

This transformer handles Salesforce CRM integration for creating and updating Salesforce objects (primarily Lead and Contact) via the Salesforce REST API. A single codebase serves two dashboard destination types through the `DestHandlerMap` in `src/constants/destinationCanonicalNames.js`:

| Dashboard Destination | Definition Name    | Auth Type                  | Status         |
| --------------------- | ------------------ | -------------------------- | -------------- |
| Salesforce            | `SALESFORCE`       | Legacy (username/password) | **Deprecated** |
| Salesforce V2         | `SALESFORCE_OAUTH` | OAuth                      | Active         |

## Integration Functionalities

### Destination Configuration

Sourced from `schema.json` and `ui-config.json` in `rudder-integrations-config`. Only configurations used in transformer code via `destination.Config` are listed:

| Config Key           | Type    | Default | Used By               | Description                                                                                                                                                                                                                                         |
| -------------------- | ------- | ------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `userName`           | string  | —       | SALESFORCE only       | Salesforce username for legacy auth                                                                                                                                                                                                                 |
| `password`           | string  | —       | SALESFORCE only       | Salesforce password for legacy auth                                                                                                                                                                                                                 |
| `initialAccessToken` | string  | —       | SALESFORCE only       | Salesforce security token for legacy auth                                                                                                                                                                                                           |
| `sandbox`            | boolean | `false` | SALESFORCE only       | Use sandbox token endpoint (`test.salesforce.com`)                                                                                                                                                                                                  |
| `mapProperties`      | boolean | `true`  | Both                  | Map RudderStack traits to standard Salesforce fields via config JSONs. When disabled, traits are sent as-is. `mapProperty` is read as a fallback. Legacy `SALESFORCE` reads only `mapProperty`, which the dashboard never saves, so it always maps. |
| `useContactId`       | boolean | `false` | Both                  | When a Lead is converted, use the `ConvertedContactId` instead of the Lead ID                                                                                                                                                                       |
| `rudderAccountId`    | string  | —       | SALESFORCE_OAUTH only | OAuth account identifier                                                                                                                                                                                                                            |

### Implementation

- **Language**: JavaScript (v0)
- **Path**: `src/v0/destinations/salesforce/`
- **CDK v2**: No (`cdkV2Enabled` is not set in `db-config.json`)

### Supported Message Types

- **identify** — the only supported message type
- Configured in `db-config.json`: `"supportedMessageTypes": ["identify"]` (SALESFORCE_OAUTH) / `"supportedMessageTypes": { "cloud": ["identify"] }` (SALESFORCE)

### Batching

**No payload-level batching**. The router processes events individually — each identify event results in its own Salesforce API call. However, authentication and SDK initialization are shared across the batch.

### Intermediate Calls

Yes. Before creating/updating a record, the transformer makes a **lookup call** to find existing records:

| Scenario                     | SOQL SDK Endpoint                                                                         | HTTP REST Endpoint                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Lead lookup by email         | `SELECT Id, IsConverted, ConvertedContactId, IsDeleted FROM Lead WHERE Email = '{email}'` | `/services/data/v50.0/parameterizedSearch/?q={email}&sobject=Lead&Lead.fields=id,IsConverted,ConvertedContactId,IsDeleted` |
| Record lookup by external ID | `SELECT Id FROM {objectType} WHERE {field} = {value}`                                     | `/services/data/v50.0/parameterizedSearch/?q={value}&sobject={type}&in={field}&{type}.fields=id,{field}`                   |

The lookup strategy (SOQL vs HTTP) is controlled by the `DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS` feature flag. See the [SOQL Lookup Feature Flag](#soql-lookup-feature-flag) section below for details.

### Proxy Delivery

**Yes** — `networkHandler.js` is implemented. The network handler:

- Uses standard `proxyRequest` and `prepareProxyRequest` adapters
- Applies Salesforce-specific response handling via `salesforceResponseHandler()`

### User Deletion

**Not supported** — no `deleteUsers.js` file exists.

### OAuth Support

- **SALESFORCE_OAUTH**: Yes — `auth.type: "OAuth"` with `rudderScopes: ["delivery"]` in `db-config.json`
- **SALESFORCE (legacy)**: No — uses username/password/security token

### Processor vs Router

**Router destination** — `transformAtV1: "router"` in both `db-config.json` files.

### Partial Batching Response Handling

Not applicable — events are not batched at the payload level. Each event is processed individually in `processRouterDest`.

### Additional Functionalities

#### Lead Conversion Handling

When `useContactId` is enabled and a Lead has been converted, the transformer automatically redirects the update to the converted Contact record.

#### Custom Field Mapping

When `mapProperties` is enabled, every Lead and Contact trait with a non-empty value that is not in the ignore list also gets a `__c` copy, so `FirstName` becomes `FirstName__c`. With it disabled, or for events that carry `mappedToDestination`, traits keep their names.

#### SOQL Injection Prevention

The SOQL path validates `identifierType` against `/^[A-Z_a-z]\w*$/` and escapes `identifierValue` (backslashes and single quotes) before query interpolation.

### Validations

| Validation                        | Error                                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| Missing traits on identify        | `InstrumentationError: "PROCESS IDENTIFY: Invalid traits for Salesforce request"`       |
| Missing email (default Lead path) | `InstrumentationError: "Invalid Email address for Lead Objet"`                          |
| Missing externalId fields (rETL)  | `InstrumentationError: "Invalid externalId. id, type, identifierType must be provided"` |
| Unsupported message type          | `InstrumentationError: "message type {type} is not supported"`                          |
| Invalid SOQL identifier type      | `InstrumentationError: "Invalid identifierType for SOQL query: {value}"`                |
| Deleted lead/contact              | `NetworkInstrumentationError`                                                           |
| Multiple records found (SOQL)     | `NetworkInstrumentationError`                                                           |

### Rate Limits

Salesforce enforces API request limits at the org level. The transformer handles these:

- **HTTP 403 + `REQUEST_LIMIT_EXCEEDED`**: throttled (retried later)
- **HTTP 503 + `SERVER_UNAVAILABLE`**: throttled
- **HTTP 400 + `UNABLE_TO_LOCK_ROW`**: retried (record locked by another process)
- **HTTP 400 + `Too many SOQL queries`**: retried

Throttling cost per identify event: **3 units** (defined in `db-config.json`).

## General Queries

### Event Ordering

**Required for identify events**. Since identify events update Salesforce Lead/Contact profiles, out-of-order events could overwrite newer data with stale values. Salesforce does not provide timestamp-based conflict resolution for standard REST API updates — the last write wins.

### Data Replay Feasibility

#### Missing data replay

**Feasible with caution**. Since identify events are upsert operations (create or update), replaying missing events will create or update records as expected. However, if the Lead has been converted to a Contact since the original event, the replay behavior depends on `useContactId` configuration.

#### Already-delivered data replay

**Safe**. Identify events are idempotent upserts — replaying them will overwrite fields with the same values. A replay after a change to `mapProperties` may build a different payload. However, note that the lookup + update is not atomic, so concurrent replays of the same record could cause race conditions.

### Multiplexing

**Yes, limited**. A single identify event can produce **multiple** output requests when `context.externalId` contains multiple entries with `Salesforce-` prefixed types. Each matching externalId generates a separate Salesforce API call to a different object type.

Example: if `context.externalId` contains both `Salesforce-Lead` and `Salesforce-Account`, two separate requests are generated.

## Version Information

### Current Version

- **Version:** `v50.0`
- **Where in code:** `config.js` (`SF_API_VERSION = '50.0'`), used in `transform.js` and `utils.js` to build `/services/data/v50.0/...` URLs

v50.0 is the Winter '21 release.

### Version Deprecation

- **Status:** Supported
- **Sunset date:** None announced
- **Source:** [REST API end-of-life policy](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/api_rest_eol.htm) (blocks automated requests)

Salesforce retires API versions in waves and announces each wave at least one year ahead:

- Versions 7.0–20.0: retired in Summer '22.
- Versions 21.0–30.0: retired in Summer '25 ([retirement notice](https://help.salesforce.com/s/articleView?id=000389618&language=en_US&type=1)).
- Versions 31.0–40.0: deprecated from Summer '27 and retired from Summer '28, per the end-of-life policy page.

v50.0 is not in any announced wave yet, but it is over five years old and is likely in a future one.

### Latest Available Version

- **Version:** `v68.0`
- **Released:** 2026-10-09
- **Upgrade needed:** Yes
- **Source:** [Salesforce Developers guide to the Winter '27 release](https://developer.salesforce.com/blogs/2026/10/developers-guide-to-the-winter-26-release) (blocks automated requests)

v68.0 is Winter '27; its final instance rollout was 2026-10-09 (the blog URL slug says "winter-26", the post is Winter '27). The code is 18 major versions behind. To upgrade, update `SF_API_VERSION` in `config.js`.

### Legacy Destination Deprecation

The `SALESFORCE` (legacy) destination is officially deprecated:

```json
"options": {
  "deprecated": true,
  "deprecationLabel": "Salesforce is deprecated. Please use Salesforce V2 instead."
}
```

Users should migrate to `SALESFORCE_OAUTH` (Salesforce V2).

## Environment Variables

| Variable                                  | Purpose                                                                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `SALESFORCE_CLIENT_ID`                    | OAuth client ID for legacy auth flow                                                                                   |
| `SALESFORCE_CLIENT_SECRET`                | OAuth client secret for legacy auth flow                                                                               |
| `ACCESS_TOKEN_CACHE_TTL`                  | Token cache TTL in seconds (legacy auth, default: 0 = no caching)                                                      |
| `DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS` | Comma-separated workspace IDs to exclude from SOQL lookups (see [SOQL Lookup Feature Flag](#soql-lookup-feature-flag)) |

## SOQL Lookup Feature Flag

### `DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS`

The environment variable `DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS` is a comma-separated list of workspace IDs that are excluded from the SOQL-based SDK lookup path. These workspaces fall back to the older parameterized REST search (`/services/data/v50.0/parameterizedSearch/`).

The gating logic lives in `isWorkspaceAndDestTypeSupportedForSoql()` in `utils.js`. It only applies to `SALESFORCE_OAUTH` destinations — legacy `SALESFORCE` destinations always use the HTTP path.

### Why this feature flag exists

When we migrated from parameterized REST search to SOQL-based lookups, some existing `SALESFORCE_OAUTH` workspaces started failing. The root cause: customers had configured lookup fields with mismatched data types. For example, a numeric value was provided for a field whose actual Salesforce data type is string. The SOQL query is strict about types and rejects these, whereas the parameterized REST endpoint is lenient and handles the mismatch silently.

### Why we did not fix the type mismatch in code

We considered fetching the field's actual data type from Salesforce metadata and casting/converting the value accordingly before building the SOQL query. We decided this is overkill given the scope of the problem — it only affects a subset of pre-existing customers whose configurations predate the SOQL feature.

### Why this only affects existing customers

New customers onboarding to `SALESFORCE_OAUTH` destinations get SOQL lookups by default. If their field types are misconfigured, they see the error immediately during setup and can fix it. The issue is isolated to older workspaces that were set up before SOQL enforcement, so their misconfigured fields only surface when we remove them from the skip list.

### How to use

Add workspace IDs (comma-separated) to the `DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS` environment variable:

```
DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS=ws-abc123,ws-def456
```

### When can this be removed?

This feature flag can be removed once all workspaces in the skip list have either:

1. Fixed their lookup field data types in Salesforce, or
2. Been confirmed as inactive/decommissioned.

## RETL Support

See [docs/retl.md](docs/retl.md) for detailed RETL documentation.

**Summary**: RETL is supported via VDM V1 (Visual Data Mapper) with warehouse source types. VDM V2 (record events) is not supported. When `mappedToDestination` is true, any Salesforce object type can be targeted, and traits are sent as-is without config-based mapping.

## Business Logic

See [docs/businesslogic.md](docs/businesslogic.md) for detailed business logic documentation including field mappings, authentication flows, record lookup strategies, and example payloads.

## Documentation Links

- [REST API: sObject basic information (create record)](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_basic_info.htm) (blocks automated requests)
- [REST API: parameterized search](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_search_parameterized.htm) (blocks automated requests)
- [OAuth 2.0 username-password flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_username_password_flow.htm&type=5)
- [REST API end-of-life policy](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/api_rest_eol.htm) (blocks automated requests)

### Changelog References

- **Changelog:** [Salesforce release notes](https://help.salesforce.com/s/articleView?id=release-notes.salesforce_release_notes.htm)
- **Deprecations:** [REST API end-of-life policy (retired and deprecated versions)](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/api_rest_eol.htm) (blocks automated requests)
- **Versions:** [REST API end-of-life policy (supported version range)](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/api_rest_eol.htm) (blocks automated requests)
- **Feed:** [Salesforce Developers blog feed](https://developer.salesforce.com/blogs/feed) (blocks automated requests)
- **Announcements:** [Platform API versions 21.0 through 30.0 retirement](https://help.salesforce.com/s/articleView?id=000389618&language=en_US&type=1); [Connected app usage restrictions](https://admin.salesforce.com/blog/2025/get-ready-for-changes-to-connected-app-usage-restrictions) (blocks automated requests); [RudderStack note on Salesforce External Client Apps](https://www.rudderstack.com/docs/releases/salesforce-eca/)
- **Last checked:** 2026-11-16

This destination authenticates with the OAuth 2.0 username-password flow (`grant_type=password`). Salesforce blocks that flow by default in orgs created from Summer '23 onward, and third-party sources report a full retirement in 2027. NEEDS REVIEW: no official Salesforce page with a retirement date for the username-password flow was found.

## FAQ

_No entries yet. Add questions and answers here as they arise from support cases or developer inquiries._
