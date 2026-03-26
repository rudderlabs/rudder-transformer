# Salesforce Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Salesforce destination integration. It covers how RudderStack events are mapped to Salesforce's REST API format, the specific API endpoints used, record lookup strategies, and special handling for various scenarios.

This single transformer codebase handles two destination types via `DestHandlerMap` in `src/constants/destinationCanonicalNames.js`:

| Dashboard Destination           | DestinationDefinition Name | Transformer Folder    |
| ------------------------------- | -------------------------- | --------------------- |
| Salesforce (legacy, deprecated) | `SALESFORCE`               | `salesforce`          |
| Salesforce V2 (OAuth)           | `SALESFORCE_OAUTH`         | `salesforce` (mapped) |

## Authentication Flows

The transformer supports two authentication flows determined by `collectAuthorizationInfo()` in `utils.js`:

### 1. OAuth Flow (SALESFORCE_OAUTH)

- Triggered when `metadata.secret` is present
- Token and instance URL are read directly from `metadata.secret.access_token` and `metadata.secret.instance_url`
- Authorization header: `Bearer <token>`

### 2. Legacy Flow (SALESFORCE)

- Triggered for legacy `SALESFORCE` destinations without OAuth secrets
- Performs a username/password grant against Salesforce's OAuth2 token endpoint:
  - Production: `https://login.salesforce.com/services/oauth2/token`
  - Sandbox: `https://test.salesforce.com/services/oauth2/token`
- Uses `SALESFORCE_CLIENT_ID` and `SALESFORCE_CLIENT_SECRET` environment variables
- Tokens are cached with configurable TTL (`ACCESS_TOKEN_CACHE_TTL` env var, default: no caching)
- Authorization header: `Bearer <token>` (token already includes "Bearer" prefix)

## Supported Message Types

Only **identify** events are supported. Any other message type throws an `InstrumentationError`.

## Field Mappings

### Lead Object Mappings (SFIdentifyLeadConfig.json)

Applied when the target object is `Lead`, `mapProperty` is enabled, and the event is **not** mapped to destination (i.e., not rETL/VDM).

| RudderStack Field (traits)           | Salesforce Lead Field | Notes                    |
| ------------------------------------ | --------------------- | ------------------------ |
| `email`                              | `Email`               | Required for lead lookup |
| `firstName`                          | `FirstName`           |                          |
| `lastName`                           | `LastName`            |                          |
| `company.name` or `company`          | `Company`             | Defaults to `"n/a"`      |
| `phone`                              | `Phone`               |                          |
| `mobilePhone`                        | `MobilePhone`         |                          |
| `title`                              | `Title`               |                          |
| `website`                            | `Website`             |                          |
| `description`                        | `Description`         |                          |
| `address.city` or `city`             | `City`                |                          |
| `address.state` or `state`           | `State`               |                          |
| `address.country` or `country`       | `Country`             |                          |
| `address.postalCode` or `postalCode` | `PostalCode`          |                          |
| `address.street` or `street`         | `Street`              |                          |
| `company.annualRevenue`              | `AnnualRevenue`       |                          |
| `company.employee_count`             | `NumberOfEmployees`   |                          |
| `company.industry`                   | `Industry`            |                          |
| `LeadSource`                         | `LeadSource`          |                          |
| `rating`                             | `Rating`              |                          |
| `status`                             | `Status`              |                          |

Any trait not in the `SFIgnoreLeadConfig.json` ignore list is mapped as a custom field with `__c` suffix (e.g., `customField` -> `customField__c`).

### Contact Object Mappings (SFIdentifyContactConfig.json)

Applied when the target object is `Contact`, `mapProperty` is enabled, and the event is **not** mapped to destination.

| RudderStack Field (traits)           | Salesforce Contact Field | Notes |
| ------------------------------------ | ------------------------ | ----- |
| `email`                              | `Email`                  |       |
| `firstName`                          | `FirstName`              |       |
| `lastName`                           | `LastName`               |       |
| `accountId`                          | `AccountId`              |       |
| `phone`                              | `Phone`                  |       |
| `mobilePhone`                        | `MobilePhone`            |       |
| `title`                              | `Title`                  |       |
| `department`                         | `Department`             |       |
| `birthday`                           | `Birthdate`              |       |
| `description`                        | `Description`            |       |
| `address.city` or `city`             | `MailingCity`            |       |
| `address.state` or `state`           | `MailingState`           |       |
| `address.country` or `country`       | `MailingCountry`         |       |
| `address.postalCode` or `postalCode` | `MailingPostalCode`      |       |
| `address.street` or `street`         | `MailingStreet`          |       |

Any trait not in the `SFIgnoreContactConfig.json` ignore list is mapped as a custom field with `__c` suffix.

### Name Handling

First and last names are extracted using `getFirstAndLastName()` utility:

- If `firstName`/`lastName` are provided directly, they are used
- If only `name` is provided, it is split into first and last name (first token -> firstName, last token -> lastName)
- Default for `firstName`: `""` (empty string)
- Default for `lastName`: `"n/a"` (passed as `defaultLastName` from `transform.js`)

## API Endpoints and Request Flow

### Salesforce REST API Version

All API calls use version `v50.0` (defined in `config.js` as `SF_API_VERSION`).

### Identify Events — Record Lookup and Upsert

**Endpoint**: `{instanceUrl}/services/data/v50.0/sobjects/{objectType}[/{recordId}?_HttpMethod=PATCH]`

**Request Flow**:

1. **Determine target object type(s)** via `getSalesforceIdFromPayload()`:

   - **rETL/VDM path** (`mappedToDestination === true`): reads the object type from `context.externalId[0].type` (strips the `Salesforce-` or destination name prefix). If `identifierType` is not `ID`, performs a lookup to resolve the record ID.
   - **ExternalId path**: iterates over `context.externalId` looking for entries with `type` containing `"Salesforce"`. Extracts `salesforceType` (removes `"Salesforce-"` prefix) and uses `id` directly as the record ID.
   - **Default path** (backward compatibility): treats the event as a Lead object. Looks up the lead by email.

2. **Record lookup** (two strategies based on feature flag — see below):

   - **SOQL SDK path**: executes `SELECT Id FROM {objectType} WHERE {identifierType} = {identifierValue}`
   - **Parameterized REST path**: calls `/services/data/v50.0/parameterizedSearch/?q={value}&sobject={type}&in={field}&{type}.fields=id,{field}`

3. **Build request**:

   - If a record ID is found: **PATCH** (update) via `POST` to `{instanceUrl}/services/data/v50.0/sobjects/{objectType}/{recordId}?_HttpMethod=PATCH`
   - If no record ID: **POST** (create) to `{instanceUrl}/services/data/v50.0/sobjects/{objectType}`

4. **Payload construction**:
   - For Lead/Contact with `mapProperty` enabled and not `mappedToDestination`: traits are mapped via config JSONs, unmapped traits become `__c` custom fields
   - For `mappedToDestination` events: traits are sent as-is (except `Id` is removed from payload)
   - For other object types or `mapProperty` disabled: traits are sent as-is

### Lead Lookup Flow

**Endpoint (HTTP)**: `/services/data/v50.0/parameterizedSearch/?q={email}&sobject=Lead&Lead.fields=id,IsConverted,ConvertedContactId,IsDeleted`

**Endpoint (SOQL)**: `SELECT Id, IsConverted, ConvertedContactId, IsDeleted FROM Lead WHERE Email = '{email}'`

**Flow**:

1. Search for the lead by email
2. If no results: return `salesforceType: 'Lead'` with no ID (will create a new lead)
3. If found and `IsDeleted === true`:
   - If also `IsConverted`: throw error "The contact has been deleted"
   - Else: throw error "The lead has been deleted."
4. If found and `IsConverted === true` and `useContactId` config is enabled:
   - Return `salesforceType: 'Contact'` with `ConvertedContactId`
   - If `ConvertedContactId` is null: throw error
5. Otherwise: return `salesforceType: 'Lead'` with the lead's ID

## SOQL Feature Flag

**Environment Variable**: `DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS`

The function `isWorkspaceAndDestTypeSupportedForSoql()` controls whether record lookups use the **SOQL SDK** or the **parameterized REST search** endpoint.

**Rules**:

- Only applies to `SALESFORCE_OAUTH` destinations (returns `false` for legacy `SALESFORCE`)
- Default: SOQL is **enabled** for all `SALESFORCE_OAUTH` workspaces
- Opt-out: add workspace IDs (comma-separated) to `DEST_SALESFORCE_SOQL_SKIP_WORKSPACE_IDS`

**Why this exists**: Some pre-existing workspaces have lookup fields with mismatched data types (e.g., numeric value for a string field). SOQL is strict about types and rejects these queries, whereas the parameterized REST endpoint is lenient. This only affects customers who configured their destinations before SOQL was introduced. New customers see errors immediately and can fix their setup.

See the "SOQL Lookup Feature Flag" section in `README.md` for full context.

## Router Processing

The `processRouterDest` function handles batch processing of events:

1. **Shared authentication**: a single auth call is made for the entire batch (all events in a router batch share the same destination)
2. **Shared SDK instance**: if SOQL is enabled for the workspace, a single `SalesforceSDK.Salesforce` instance is created and reused across all events
3. **Per-event processing**: each event is processed individually via `processSingleMessage()` — there is no payload-level batching
4. **Already-transformed passthrough**: events with `statusCode` already set are passed through without reprocessing

### Metadata Handling for Router

`processMetadataForRouter` enriches each metadata entry with `destInfo.authKey` set to the destination ID. This is used for cache invalidation on auth failures.

## Error Handling

### Salesforce API Errors (networkHandler.js + utils.js)

| HTTP Status | Error Code                                                                                                | Behavior                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 401         | `INVALID_SESSION_ID`                                                                                      | **Retry** (500). OAuth flow: triggers token refresh. Legacy flow: evicts token cache. |
| 403         | `REQUEST_LIMIT_EXCEEDED`                                                                                  | **Throttled**. Org has exceeded API limits.                                           |
| 400         | `CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY` + message contains `UNABLE_TO_LOCK_ROW` or `Too many SOQL queries` | **Retry** (500). Record locked by another job.                                        |
| 503 / 500   | `SERVER_UNAVAILABLE`                                                                                      | **Throttled**. Server maintenance/overload.                                           |
| 503 / 500   | Other                                                                                                     | **Retry** (500).                                                                      |
| Other 4xx   | Any                                                                                                       | **Abort** (400). Non-retryable.                                                       |

### SDK Errors (SOQL path)

| Error Condition                                      | Behavior                                           |
| ---------------------------------------------------- | -------------------------------------------------- |
| Session expired (message contains "session expired") | **Retry** with `REFRESH_TOKEN` auth error category |
| Multiple records found                               | `NetworkInstrumentationError` — ambiguous lookup   |
| Other SDK errors                                     | `NetworkInstrumentationError`                      |

## Throttling Cost

Defined in `db-config.json`:

```json
{
  "throttlingCost": {
    "eventType": {
      "identify": 3
    }
  }
}
```

Each identify event costs **3 units** against the throttling budget. This reflects the fact that each identify may require a lookup call + create/update call.

## Validations

### Required Fields

- **Traits**: must be present on identify events, else `InstrumentationError: "PROCESS IDENTIFY: Invalid traits for Salesforce request"`
- **Email**: required when no externalId is provided (default Lead path), else `InstrumentationError: "Invalid Email address for Lead Objet"`
- **ExternalId fields** (rETL/VDM): `id`, `type`, and `identifierType` are all required, and `type` must contain "salesforce"

### SOQL Safety

- `identifierType` must match regex `/^[A-Z_a-z]\w*$/` to prevent SOQL injection
- `identifierValue` is escaped: backslashes and single quotes are escaped before interpolation

## Example Payloads

### Identify -> Lead Create (no existing record)

```json
// RudderStack Input
{
  "type": "identify",
  "traits": {
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "company": "Acme Inc",
    "phone": "555-1234",
    "customTrait": "value"
  }
}

// Salesforce Output (POST to /services/data/v50.0/sobjects/Lead)
{
  "Email": "john@example.com",
  "FirstName": "John",
  "LastName": "Doe",
  "Company": "Acme Inc",
  "Phone": "555-1234",
  "customTrait__c": "value"
}
```

### Identify -> Lead Update (existing record found)

```json
// Salesforce Output (POST to /services/data/v50.0/sobjects/Lead/{leadId}?_HttpMethod=PATCH)
{
  "Email": "john@example.com",
  "FirstName": "John",
  "LastName": "Doe",
  "Company": "Acme Inc"
}
```

### Identify -> Custom Object via externalId

```json
// RudderStack Input
{
  "type": "identify",
  "traits": {
    "Name": "Test Account"
  },
  "context": {
    "externalId": [
      {
        "type": "Salesforce-Account",
        "id": "acc123"
      }
    ]
  }
}

// Salesforce Output (POST to /services/data/v50.0/sobjects/Account/acc123?_HttpMethod=PATCH)
{
  "Name": "Test Account"
}
```

### rETL/VDM Event (mappedToDestination)

```json
// RudderStack Input
{
  "type": "identify",
  "traits": {
    "Email": "john@example.com",
    "FirstName": "John"
  },
  "context": {
    "mappedToDestination": "true",
    "externalId": [
      {
        "type": "SALESFORCE_OAUTH-Lead",
        "id": "john@example.com",
        "identifierType": "Email"
      }
    ]
  }
}

// Salesforce Output — traits sent as-is, Id removed if present
{
  "Email": "john@example.com",
  "FirstName": "John"
}
```

## Mapping Configuration Files

| File                                | Purpose                                                    |
| ----------------------------------- | ---------------------------------------------------------- |
| `data/SFIdentifyLeadConfig.json`    | Trait-to-Lead field mappings                               |
| `data/SFIdentifyContactConfig.json` | Trait-to-Contact field mappings                            |
| `data/SFIgnoreLeadConfig.json`      | Traits excluded from `__c` custom field creation (Lead)    |
| `data/SFIgnoreContactConfig.json`   | Traits excluded from `__c` custom field creation (Contact) |
