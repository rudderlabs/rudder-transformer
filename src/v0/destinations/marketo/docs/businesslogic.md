# Marketo Business Logic and Mappings

## Overview

Every event first needs a token (see [README Authentication](../README.md#authentication)) and a Marketo lead ID. The final request is always `POST` with `Content-Type: application/json` and `Authorization: Bearer {token}`.

## Lead ID Resolution (`getLeadId`)

Precedence:

1. RETL/VDM: `context.externalId[].id` where `type` starts with `MARKETO` (`getDestinationExternalIDInfoForRetl`).
2. `context.externalId` of type `marketoLeadId`.
3. If the event has an email (`traits.email` / `context.traits.email`): `GET /rest/v1/leads.json?filterType=email&filterValues={email}`.
4. Otherwise: `GET /rest/v1/leads.json?filterType=userId|anonymousId&filterValues={id}`.
5. Nothing found and `createIfNotExist` on: `POST /rest/v1/leads.json` with `{ action: "createOrUpdate", input: [{ userId }|{ anonymousId }], lookupField: "userId"|"anonymousId" }`.
6. Nothing found and `createIfNotExist` off: `ConfigurationError("Lead creation is turned off on the dashboard")`.

Steps 3 to 5 use the first `result[].id`. Results are cached for 1 day (email cache and userId/anonymousId cache).

## Identify

Endpoint: `https://{accountId}.mktorest.com/rest/v1/leads.json`

```json
{
  "action": "createOrUpdate",
  "input": [{ "...mapped fields": "", "id": 4, "userId": "user-1" }],
  "lookupField": "id"
}
```

### Field Mappings (`data/MARKETOIdentify.json`, from traits)

| Marketo field        | Source keys                                              |
| -------------------- | -------------------------------------------------------- |
| `City`               | `address.city`, `city`                                   |
| `Company`            | `company.name`, `company`                                |
| `Country`            | `address.country`, `country`                             |
| `Email`              | `email`                                                  |
| `FirstName`          | `firstName`                                              |
| `Industry`           | `company.industry`                                       |
| `LastName`           | `lastName`                                               |
| `OriginalSourceInfo` | `leadSource`                                             |
| `NumberOfEmployees`  | `company.employee_count`                                 |
| `Phone`              | `phone`                                                  |
| `PostalCode`         | `address.zip`, `zip`, `address.postalCode`, `postalCode` |
| `Rating`             | `rating`                                                 |
| `State`              | `address.state`, `state`                                 |
| `Address`            | `address.street`, `street`                               |
| `Title`              | `title`                                                  |
| `DateofBirth`        | `birthday`                                               |
| `Website`            | `website`                                                |

Then each `leadTraitMapping` row copies `traits[from]` to `Marketo[to]`. `id` is the resolved lead ID; `userId` is added when present.

### RETL / VDM Identify

- Lead traits come straight from `traits` (no mapping file, no `leadTraitMapping`); the external ID is added to traits.
- If the external ID `type` is `MARKETO-{object}` and `{object}` is not `leads`, the request goes to `/rest/v1/customobjects/{object}.json` with `{ action: "createOrUpdate", dedupeBy: "dedupeFields", input: [traits] }`. `marketoGUID` is removed from traits first.

## Track

Endpoint: `https://{accountId}.mktorest.com/rest/v1/activities/external.json`

```json
{
  "input": [
    {
      "activityDate": "2026-01-01T00:00:00.000Z",
      "activityTypeId": 100001,
      "attributes": [{ "name": "productName", "value": "Shoe" }],
      "leadId": 4,
      "primaryAttributeValue": "SKU-1"
    }
  ]
}
```

| Payload field           | Source                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `activityDate`          | event `timestamp` (generic timestamp paths)                                              |
| `activityTypeId`        | `rudderEventsMapping[event].marketoActivityId`, parsed as integer                        |
| `primaryAttributeValue` | `properties[rudderEventsMapping[event].marketoPrimarykey]`                               |
| `attributes[]`          | every `customActivityPropertyMap` row (except the primary key) whose property is defined |
| `leadId`                | lead ID resolution above                                                                 |

## Error Handling

`marketoResponseHandler` (`util.js`) is used for intermediate calls and for proxy delivery:

| Condition                                                                                     | Result                                                              |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Non-2xx HTTP status                                                                           | `NetworkError` with that status                                     |
| Token response with `expires_in: 0`                                                           | Retryable (500)                                                     |
| `success: false`, code `601`/`602`                                                            | Cached token evicted, then retryable                                |
| Codes `600, 603, 605, 609, 610, 612, 1001, 1003, 1004, 1006, 1013`                            | Aborted (400)                                                       |
| Codes `502, 606, 607, 608, 615`                                                               | Throttled (429)                                                     |
| Codes `601, 602, 604, 611`                                                                    | Retryable (500)                                                     |
| `success: true` but a `result[]` item has a status other than `created/updated/added/removed` | 400, or 429/500 by its reason code. Reason `1015` alone is ignored. |
| Anything else                                                                                 | `UnhandledStatusCodeError`                                          |

## Validations

See [README Validations](../README.md#validations).

## General Use Cases

- Keep Marketo leads in sync with product sign-ups and profile changes.
- Log product actions as custom activities for scoring and smart campaigns.
- Load custom object records from the warehouse.
