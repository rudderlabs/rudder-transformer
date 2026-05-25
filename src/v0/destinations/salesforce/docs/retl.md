# Salesforce RETL Functionality

## Is RETL Supported?

**Yes** — both `salesforce` and `salesforce_oauth` destinations include `warehouse` in their `supportedSourceTypes` in `db-config.json`.

## RETL Support Types

### JSON Mapper

**Supported** — `disableJsonMapper` is not set to `true` in either `db-config.json`, so JSON Mapper is available by default.

### VDM V1 (Visual Data Mapper)

**Supported** — both destinations have `supportsVisualMapper: true` in `db-config.json`.

### VDM V2

**Not Supported** — neither destination has `record` in `supportedMessageTypes`. The transformer code explicitly rejects any message type other than `identify`:

```javascript
if (message.type === EventType.IDENTIFY) {
  response = await processIdentify({ message, destination, metadata }, stateInfo);
} else {
  throw new InstrumentationError(`message type ${message.type} is not supported`);
}
```

## RETL Flow (VDM V1 via mappedToDestination)

When events arrive with `context.mappedToDestination === "true"`, the following special handling applies:

### 1. ExternalId Resolution

The event must include `context.externalId[0]` with:

| Field            | Required | Description                                                                                                                      |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `type`           | Yes      | Must contain "salesforce" (case-insensitive). Format: `{DestinationDefinitionName}-{ObjectType}` (e.g., `SALESFORCE_OAUTH-Lead`) |
| `id`             | Yes      | The identifier value for lookup (e.g., email address, external ID value)                                                         |
| `identifierType` | Yes      | The Salesforce field to match against (e.g., `Email`, `CustomField__c`, `ID`)                                                    |

### 2. Record Lookup

- If `identifierType` is `ID`: the `id` value is used directly as the Salesforce record ID (no lookup needed)
- If `identifierType` is anything else: a lookup is performed to find the matching record:
  - **SOQL path** (SALESFORCE_OAUTH): `SELECT Id FROM {objectType} WHERE {identifierType} = {id}`
  - **HTTP path**: parameterized search via `/services/data/v50.0/parameterizedSearch/`

### 3. Payload Handling

- Traits are sent **as-is** to Salesforce (no config-based mapping is applied)
- The `Id` field is explicitly removed from the payload (Salesforce rejects updates that include `Id` in the body)
- If `identifierType` is not `ID`, the external ID is appended to traits via `addExternalIdToTraits()`

### 4. Object Type Support

When `mappedToDestination` is true, **any Salesforce object type** is supported — not just Lead and Contact. The object type is derived from the `type` field in the external ID by stripping the destination name prefix.

## Example rETL Event

```json
{
  "type": "identify",
  "traits": {
    "Email": "john@example.com",
    "FirstName": "John",
    "LastName": "Doe",
    "Company": "Acme Inc"
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
```

**Result**: Looks up Lead by Email, then creates or updates the Lead record with the provided traits.

## Connection Config

### salesforce (legacy)

- Warehouse source type: supported
- Connection mode: `cloud` only
- Config fields: `userName`, `password`, `initialAccessToken`, `mapProperties`, `sandbox`, `useContactId`

### salesforce_oauth (V2)

- Warehouse source type: supported
- Connection mode: `cloud` only
- Config fields: `rudderAccountId`, `mapProperties`, `useContactId`
- Auth: OAuth with `delivery` scope

## Limitations

- **No VDM V2 / record event support**: only `identify` events are handled
- **Single record per event**: each rETL event maps to exactly one Salesforce object
- **No bulk operations**: events are processed individually (no Salesforce Bulk API usage)

## Summary

| Feature                     | Supported                     |
| --------------------------- | ----------------------------- |
| RETL (warehouse source)     | Yes                           |
| JSON Mapper                 | Yes                           |
| VDM V1 (Visual Data Mapper) | Yes                           |
| VDM V2 (record events)      | No                            |
| Any Salesforce object type  | Yes (via mappedToDestination) |
| Bulk operations             | No                            |
