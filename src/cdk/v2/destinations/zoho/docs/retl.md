# Zoho CRM RETL Functionality

## Is RETL supported at all?

**Yes.** RETL is the only supported source: `supportedSourceTypes: ["warehouse"]`.

## RETL Support Analysis

### Which type of RETL support does it have?

- **JSON Mapper**: Not supported (`disableJsonMapper: true`).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Supported (`supportsVisualMapperV2: true`, `record` in `supportedMessageTypes`, handled by `processRecordInputsV2`).
- **Sync behaviour**: `mirror` (`syncBehaviours: ["mirror"]`). `isAudienceSupported: true`.

### VDM objects and fields

From rudder-integrations-info (`src/routes/zoho/`):

- **Objects**: Zoho modules that are `creatable`, `editable` and `api_supported`, labelled by plural label. Modules that are `deletable` support `upsert` and `mirror`; others only `upsert`.
- **Fields**: fetched from `/crm/v6/settings/fields?module=<module>`; the module's system duplicate-check field is flagged as an identifier candidate.

### Connection config

`connection.config.destination`:

| Key                             | Purpose                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| `object`                        | Zoho module API name                                          |
| `identifierMappings`            | `[{ from, to }]`; `to` fields are duplicate-check/lookup keys |
| `trigger`                       | `Default`, `None`, or a trigger name                          |
| `addDefaultDuplicateCheck`      | Add the module's system duplicate-check field                 |
| `multiSelectFieldLevelDecision` | Multi-select fields and append decision                       |

## RETL Flow

| `action`           | Behaviour                                                                              |
| ------------------ | -------------------------------------------------------------------------------------- |
| `insert`, `update` | Batched upsert, 100 records per request                                                |
| `delete`           | COQL lookup of record IDs by identifiers, then batched delete by IDs (100 per request) |

See [businesslogic.md](businesslogic.md) for the full flow and payloads.
