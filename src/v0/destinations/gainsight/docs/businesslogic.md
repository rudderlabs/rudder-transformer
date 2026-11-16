# Gainsight Business Logic

## Identify

**Endpoint:** `PUT https://<domain>/v1.0/api/people`
**Headers:** `Accesskey`, `Content-Type: application/json`

Flow:

1. Require `accessKey` and an email.
2. Build the payload from `data/GainsightIdentify.json`.
3. Add custom traits from `traits` and `context.traits`, excluding `IDENTIFY_EXCLUSION_KEYS`.
4. Keep standard fields; rename custom traits via `personMap`; drop unmapped custom traits.
5. If `Name` is empty, build it from `FirstName MiddleName LastName`.

### Mapping (`GainsightIdentify.json`)

| Gainsight field        | Source                                 | Notes                 |
| ---------------------- | -------------------------------------- | --------------------- |
| `Email`                | `traits.email`, `context.traits.email` | required              |
| `Name`                 | `traits.name`, `context.traits.name`   |                       |
| `FirstName`            | generic `firstName`                    |                       |
| `LastName`             | generic `lastName`                     |                       |
| `MiddleName`           | generic `middleName`                   |                       |
| `LinkedinUrl`          | `traits.linkedinUrl`                   |                       |
| `Location`             | `traits.location`                      | stringified if object |
| `ExternalRecordID__gc` | `traits.externalRecordId`              | stringified if object |
| `EmailOptOut`          | `traits.emailOptOut`                   |                       |
| `DynamicResolutionKey` | `traits.dynamicResolutionKey`          | stringified if object |
| `Timezone`             | `traits.timezone`                      |                       |
| `Comments`             | `traits.comments`                      | stringified if object |
| `MasterRecordID`       | `traits.masterRecordID`                |                       |
| `MasterAvatarTypeCode` | `traits.masterAvatarTypeCode`          | number                |

All trait sources also fall back to `context.traits.*`.

## Group

**Final endpoint:** `PUT https://<domain>/v1.0/api/people`

Flow:

1. Require `accessKey`, `traits.name`, `context.traits.email`.
2. Search the Company: `POST /v1/data/objects/query/Company` with `{ select: ["Name"], where: { conditions: [{ name: "Name", operator: "EQ", value: [<name>] }] } }`.
3. Build the Company payload from `data/GainsightGroup.json` plus custom `traits` (excluding `GROUP_EXCLUSION_KEYS`), renamed via `companyMap`.
4. If no record found: `POST /v1/data/objects/Company` with `{ records: [payload] }`. Otherwise: `PUT /v1/data/objects/Company?keys=Name`. Read `data.records[0].Gsid` from the response.
5. Return the Person upsert: `{ "Email": <context.traits.email>, "companies": [{ "Company_ID": <Gsid> }] }`.

Steps 2 and 4 run during transformation. They are not retried by the router as part of delivery; failures surface as transformation errors.

### Mapping (`GainsightGroup.json`)

| Gainsight field                                           | Source                                                        | Notes                 |
| --------------------------------------------------------- | ------------------------------------------------------------- | --------------------- |
| `Name`                                                    | `traits.name`                                                 | required              |
| `Employees`, `Users`, `LifecycleInWeeks`                  | `traits.employees`, `traits.users`, `traits.lifecycleInWeeks` | number                |
| `CustomerlifetimeInMonths`                                | `traits.customerLifetimeInMonths`                             | number                |
| `Arr`, `Mrr`                                              | `traits.arr`, `traits.mrr`                                    |                       |
| `BillingAddress`, `Summary`, `Industry`, `TickerSymbol`   | matching `traits.*`                                           | stringified if object |
| `CompanyType`, `Csm`, `ManagedAs`, `ParentCompany`        | matching `traits.*`                                           |                       |
| `OriginalContractDate`, `RenewalDate`                     | matching `traits.*`                                           |                       |
| `Stage`, `Status`, `Tags`, `SfdcAccountId`, `IndustryNew` | matching `traits.*`                                           |                       |

## Track

**Endpoint:** `POST https://<domain>/v1.0/api/eventManager/event`

Headers:

| Header                                  | Source                                                                            |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `sharedSecret`, `topicName`, `tenantId` | Config (required)                                                                 |
| `eventName`                             | `eventNameMap[event]` (required)                                                  |
| `eventVersion`                          | `eventVersionMap[event]` (required)                                               |
| `contractId`                            | `context.externalId` of type `gainsightEventContractId`, else `Config.contractId` |
| `Accesskey`                             | `Config.accessKey` if set                                                         |

Body: all of `message.properties` (custom fields extraction with no exclusions).

### Example

Input:

```json
{
  "type": "track",
  "event": "Product Viewed",
  "properties": { "plan": "pro", "seats": 10 }
}
```

Output (config maps `Product Viewed` to `product_viewed` / `v01`):

```json
{
  "method": "POST",
  "endpoint": "https://demo.gainsightcloud.com/v1.0/api/eventManager/event",
  "headers": {
    "sharedSecret": "<secret>",
    "topicName": "rudder",
    "tenantId": "<tenant>",
    "Content-Type": "application/json",
    "eventName": "product_viewed",
    "eventVersion": "v01",
    "Accesskey": "<key>"
  },
  "body": { "JSON": { "plan": "pro", "seats": 10 } }
}
```

## Error Handling

- Missing config keys: `ConfigurationError("<key> is required for <method>")` (400, aborted). The code passes a stray `500` second argument, which the constructor ignores.
- Missing event/name/email: `InstrumentationError` (400).
- Intermediate call failures: `NetworkError` with the Gainsight status, or `RetryableError` (500) for empty/non-200 success.
- Delivery errors on the final request are handled by the server's default HTTP handling (no proxy).

## Use Cases

- Keep Gainsight Person and Company records in sync with product data.
- Trigger Journey Orchestrator programs from product events.
