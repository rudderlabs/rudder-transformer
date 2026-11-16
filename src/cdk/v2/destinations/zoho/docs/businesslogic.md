# Zoho CRM Business Logic and Mappings

## Overview

Router workflow (`rtWorkflow.yaml`):

1. `validateConfig`: region must resolve (`getRegion`).
2. `validateInput`: non-empty array.
3. `processRecordEvents`: `processRecordInputsV2` (`transformRecordV2.ts`) for `record` events.
4. `failOtherEvents`: non-`record` events fail with `Event type <type> is not supported`.

## Record Flow (`processRecordInputsV2`)

1. Read `connection.config.destination` from the first event (`object`, `identifierMappings`, ...).
2. Group events by `message.action` (lowercased).
3. `insert` + `update` → upsert path.
4. `delete` → COQL lookup, then delete path.
5. Build batches, return successes followed by per-event errors.

NEEDS REVIEW: events whose `action` is not `insert`, `update` or `delete` are not returned at all (neither success nor error).

### Upsert (`insert`, `update`)

For each event:

1. `allFields = { ...identifiers, ...fields }`; empty → `` `fields` cannot be empty ``.
2. Mandatory field check for standard modules (fields mapped but empty fail the event).
3. Multi-select fields (keys in `multiSelectFieldLevelDecision`) are wrapped in an array.

Request (per 100 records):

```
POST https://www.zohoapis.<dc>/crm/v6/<object>/upsert
Authorization: Zoho-oauthtoken <accessToken>
```

| Payload key              | Value                                                                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`                   | Array of formatted `allFields` objects                                                                                                                                        |
| `duplicate_check_fields` | Unique list of `identifierMappings[].to`, plus the module's system duplicate-check field when `addDefaultDuplicateCheck` is true (custom modules use the SDK's default field) |
| `$append_values`         | `{ <field>: <"true"/"false"> }` from `multiSelectFieldLevelDecision`                                                                                                          |
| `trigger`                | `Default` → omitted; `None` → `[]`; otherwise `[<trigger>]`                                                                                                                   |

### Delete

1. Events without `identifiers` fail with `` `identifiers` cannot be empty ``.
2. `chunkByIdentifierLimit`: split events so that no field has more than 50 distinct values per batch.
3. Per batch, build and send a COQL query:

```
POST https://www.zohoapis.<dc>/crm/v6/coql
{ "select_query": "SELECT id, Email FROM Leads WHERE Email in ('a@x.com', 'b@x.com')" }
```

Multiple identifier fields are combined with nested `OR` groups (Zoho does not accept flat `A OR B OR C`). Strings are quoted with `\` and `'` escaped; arrays are joined with `;`.

4. Filter records for exact matches on all identifiers, then map each event (by `jobId`) to its record IDs. A `204` or empty result → event fails with "No <object> is found for record identifier ...".
5. Request (per 100 record IDs):

```
DELETE https://www.zohoapis.<dc>/crm/v6/<object>?ids=<id1>,<id2>&wf_trigger=<trigger !== 'None'>
```

NEEDS REVIEW: delete IDs and delete metadata are chunked separately by 100. When one event matches several records, ID chunks and metadata chunks no longer line up, and the v1 proxy maps `response.data[i]` (per ID) to `metadata[i]` (per event).

## Example Payload

Input (`object: "Leads"`, `identifierMappings: [{ from: "email", to: "Email" }]`, `trigger: "None"`):

```json
{
  "message": {
    "type": "record",
    "action": "insert",
    "identifiers": { "Email": "jane@example.com" },
    "fields": { "Last_Name": "Doe", "First_Name": "Jane" }
  }
}
```

Output:

```json
{
  "endpoint": "https://www.zohoapis.com/crm/v6/Leads/upsert",
  "method": "POST",
  "headers": { "Authorization": "Zoho-oauthtoken <accessToken>" },
  "body": {
    "JSON": {
      "duplicate_check_fields": ["Email"],
      "data": [{ "Email": "jane@example.com", "Last_Name": "Doe", "First_Name": "Jane" }],
      "$append_values": {},
      "trigger": []
    }
  }
}
```

## Error Handling

- Transform:
  - Missing connection config / object / identifierMappings → `ConfigurationError` for the batch.
  - Mandatory field empty → per-event `ConfigurationError`.
  - COQL `INVALID_TOKEN` → `RetryableError` (500, `REFRESH_TOKEN`).
  - Other COQL API errors → `NetworkError` with status-based type.
  - No match / no identifier values → `InstrumentationError`.
- Delivery (v1 proxy, `src/v1/destinations/zoho/networkHandler.js`):
  - 2xx: per-entry status from `response.data[i].status`; non-success entries → 400 for that event.
  - `INVALID_TOKEN` → 500 with auth error category (token refresh).
  - Other errors → `TransformerProxyError` with the response status.
  - NEEDS REVIEW: the per-event error message reads `element.messaege` (typo), so the Zoho message shows as `undefined`.

## General Use Cases

- Syncing warehouse-modelled leads, contacts, accounts or deals into Zoho CRM.
- Mirroring an audience so records that leave the model are deleted from Zoho.
