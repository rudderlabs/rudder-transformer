# RETL for Sprig

## Support Summary

| Capability                  | Supported | Evidence                                                                                                         |
| --------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| RETL from warehouse sources | Yes       | `db-config.json` includes `warehouse` in `supportedSourceTypes` and allows `warehouse` in cloud connection mode. |
| JSON Mapper                 | Yes       | Supported by default because `disableJsonMapper` is not set to `true` in `db-config.json`.                       |
| VDM V1 / Visual Mapper      | No        | `supportsVisualMapper` is absent and not set to `true` in `db-config.json`.                                      |
| VDM V2                      | No        | `supportedMessageTypes` does not include `record`, and `procWorkflow.yaml` has no Record-event handling.         |

## Connection Configuration

RETL uses the same cloud destination configuration as event-stream sources:

- `apiKey` is required for cloud delivery and is sent as `Authorization: API-Key <apiKey>`.
- `connectionMode.warehouse` supports only `cloud`.
- Consent-management configuration can be configured for warehouse sources through the shared destination settings.

`environmentId` is a device-mode setting for Sprig SDK installation and is not used by the cloud RETL processor workflow.

## Supported RETL Flow

Sprig supports RETL through the warehouse source type and the standard cloud processor path. Mapped RETL output must still be shaped as a supported RudderStack message type because the Sprig workflow only handles `identify` and `track`.

### Identify requirements for RETL

Warehouse-mode Identify events must include:

- `type: "identify"`
- A `userId` resolvable through the generic `userIdOnly` paths (`userId`, `traits.userId`, `traits.id`, `context.traits.userId`, or `context.traits.id`)
- Destination `apiKey`

Optional profile fields can be supplied in `context.traits`; the workflow forwards `context.traits` as Sprig `attributes` and resolves email into `emailAddress` using the generic email paths.

### Track requirements for RETL

Warehouse-mode Track events must include:

- `type: "track"`
- A `userId` resolvable through the generic `userIdOnly` paths
- A non-empty `event` name
- Destination `apiKey`

The workflow maps the event name to `events[0].event` and converts `timestamp` or `originalTimestamp` to millisecond epoch time for `events[0].timestamp`.

## Unsupported VDM Paths

### VDM V1

VDM V1 is not supported because the destination configuration does not enable `supportsVisualMapper`.

### VDM V2

VDM V2 is not supported because:

- `db-config.json` does not list `record` in `supportedMessageTypes`.
- `procWorkflow.yaml` validates only `identify` and `track`.
- There is no `mappedToDestination === true` or Record-event dispatch path in the Sprig workflow.

## Notes and Limitations

- RETL events are processed individually; Sprig event-stream batching is not implemented.
- Track `properties` are not mapped into the Sprig payload by the current workflow, so RETL mappings that need event details beyond the event name and timestamp must account for that limitation before delivery.
- Replays from warehouse sources should preserve chronological order for Identify payloads to avoid stale attributes overwriting newer values in Sprig.
