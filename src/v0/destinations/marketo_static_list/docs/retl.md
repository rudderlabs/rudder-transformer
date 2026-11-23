# Marketo Static List RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes`.

## RETL Support Analysis

### Which type of retl support does it have?

- **JSON Mapper**: not supported (`disableJsonMapper: true`).
- **VDM V1**: supported (`supportsVisualMapper: true`); audiences arrive as `audiencelist`.
- **VDM V2**: supported. `record` is in `supportedMessageTypes` and `transformV2.processRecordInputs` handles it.

### Sync behaviour

`syncBehaviours: ["mirror"]`: rows added to the model become `insert`, rows removed become `delete`.

### Connection config

None read by the code. The list ID comes from destination config `staticListId` or the `marketoStaticListId` external ID. `rudder-integrations-info` has a `marketo_static_list` route used for setup (NEEDS REVIEW: what it exposes).

## RETL Flow

1. Group `record` events by list ID.
2. Split by `action` (`insert` → add, `delete` → remove); events without `fields.id` or with another action fail.
3. Emit batched `DELETE` then `POST` requests of up to 300 lead IDs each.

`fields.id` must be the Marketo lead ID; the code does not look up leads by email.
