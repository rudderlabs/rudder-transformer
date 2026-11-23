# Freshsales Business Logic

Base URL: `https://<Config.domain>`. Headers on every request: `Authorization: Token token=<apiKey>`, `Content-Type: application/json`.

## Identify

**Endpoint:** `POST /crm/sales/api/contacts/upsert`

Body:

```json
{
  "contact": { "...mapped fields" },
  "unique_identifier": { "emails": "<email>" }
}
```

`address` objects are flattened to `"street city state country postalCode"`.

### Mapping (`identifyConfig.json`)

| Freshsales field                                 | Source                                                                                                     |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `emails`                                         | generic `emailOnly` (required)                                                                             |
| `first_name`, `last_name`                        | generic `firstName`, `lastName`                                                                            |
| `work_number`                                    | generic `phone`                                                                                            |
| `mobile_number`                                  | `traits.mobileNumber`                                                                                      |
| `external_id`                                    | generic `userId`                                                                                           |
| `job_title`                                      | `traits.job_title` / `traits.jobTitle`                                                                     |
| `address`, `city`, `state`, `country`, `zipcode` | generic `address`, `traits.city` / `traits.address.*`, generic `zipcode`                                   |
| `sales_accounts`                                 | `traits.salesAccounts` / `traits.sales_accounts`                                                           |
| `territory_id`, `lead_source_id`, `owner_id`     | `traits.territoryId`, `traits.leadSourceId`, `traits.ownerId`                                              |
| `subscription_status`, `subscription_types`      | `traits.subscriptionStatus`, `traits.subscriptionTypes`                                                    |
| `medium`, `campaign_id`, `keyword`               | `traits.medium`; `traits.campaignId` / `context.campaign.name`; `traits.keyword` / `context.campaign.term` |
| `time_zone`                                      | `traits.timeZone` / `context.timeZone`                                                                     |
| `facebook`, `twitter`, `linkedin`                | `traits.facebookUserName`, `traits.twitterUserName`, `traits.linkedinUserName`                             |
| `contact_status_id`, `lifecycle_stage_id`        | `traits.contactStatusId`, `traits.lifecycleStageId`                                                        |
| `created_at`, `updated_at`                       | generic `createdAt`, `timestamp`                                                                           |

All `traits.*` sources also fall back to `context.traits.*`.

## Group

Mapping from `groupConfig.json`: `name` (required), `industry_type_id`, `business_type_id`, `phone`, `number_of_employees`, `annual_revenue`, `address` (flattened), `city`, `state`, `country`, `zipcode`, `website`, `territory_id`, `parent_sales_account_id`, `owner_id`, `facebook`, `twitter`, `linkedin`, `created_at`, `updated_at`, all from `traits.*` (camelCase keys, for example `traits.numberOfEmployees`).

Flow:

1. If no user email: return `POST /crm/sales/api/sales_accounts/upsert` with `{ unique_identifier: { name }, sales_account: payload }`.
2. Otherwise:
   1. `POST /crm/sales/api/contacts/upsert?include=sales_accounts` for the email, read `contact.sales_accounts`.
   2. `POST /crm/sales/api/sales_accounts/upsert` (by name), read `sales_account.id`.
   3. Return `POST /crm/sales/api/contacts/upsert` with `contact.sales_accounts` = existing accounts plus `{ id, is_primary }` (`is_primary: true` only if the contact had no accounts).

## Track

The event name, or each mapped name from `rudderEventsToFreshsalesEvents`, is normalised (lowercase, spaces to `_`) and must be one of:

### `sales_activity`

**Endpoint:** `POST /crm/sales/api/sales_activities`, body `{ "sales_activity": {...} }`.

Mapping (`SalesActivityConfig.json`):

| Freshsales field                    | Source                                                              |
| ----------------------------------- | ------------------------------------------------------------------- |
| `title`                             | `properties.title` (required)                                       |
| `start_date`, `end_date`            | `properties.startDate`, `properties.endDate` (required)             |
| `owner_id`                          | `properties.ownerId` (required)                                     |
| `targetable_type`                   | `context.externalId.type` (required)                                |
| `targetable_id`                     | `context.externalId.id`                                             |
| `sales_activity_name`               | `properties.salesActivityName`                                      |
| `sales_activity_type_id`            | `properties.salesActivityTypeId`                                    |
| `sales_activity_outcome_id`         | `properties.salesActivityOutcomeId`                                 |
| `notes`, `location`, `checkedin_at` | `properties.notes`, `properties.location`, `properties.checkedinAt` |
| `creater_id`                        | `properties.createrId`                                              |
| `latitude`, `longitude`             | `context.location.*` / `context.address.*`                          |
| `created_at`, `updated_at`          | `timestamp`                                                         |

If only `sales_activity_name` is given, the type ID is looked up via `GET /crm/sales/api/selector/sales_activity_types` (exact name match). If `targetable_id` is missing and the type is `contact`, the contact ID is fetched via `contacts/upsert` with the user's email.

### `lifecycle_stage`

**Endpoint:** `POST /crm/sales/api/contacts/upsert`

Body: `{ "contact": { "lifecycle_stage_id": <id> }, "unique_identifier": { "emails": <email> } }`. The ID is `properties.lifecycleStageId`, or is resolved from `properties.lifecycleStageName` via `GET /crm/sales/api/selector/lifecycle_stages`.

## Error Handling

- Missing fields or unsupported event: `InstrumentationError`.
- Lookup not found (activity type, lifecycle stage, contact ID): `InstrumentationError` / `NetworkInstrumentationError` (aborted).
- Intermediate call non-2xx: `NetworkError` with status from `errors.code` (default `500`).
- Delivery: server default HTTP handling (no proxy).

## Use Cases

- Keep Freshsales contacts and accounts in sync with product data.
- Log product events as sales activities, and move contacts through lifecycle stages.
