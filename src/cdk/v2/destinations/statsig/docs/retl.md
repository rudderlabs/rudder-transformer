# RETL Support for Statsig

## Is RETL supported?

- Yes. `supportedSourceTypes` includes `warehouse` in `db-config.json`, which indicates RETL is enabled for this destination.

## RETL Types

- JSON Mapper: Supported by default (no `disableJsonMapper: true`).
- VDM V1: Supported (`supportsVisualMapper: true` is not present in db-config; NEEDS REVIEW). The presence of `warehouse` indicates at least JSON Mapper is available; VDM availability requires confirmation.
- VDM V2: NEEDS REVIEW. Requires both `supportsVisualMapper: true` and `supportedMessageTypes.record` plus transformer support for `record` events. Record handling is not implemented in the Statsig transformer.

## Connection Config

- Uses the same destination config keys as cloud mode. `secretKey` remains required.

## RETL Flow

- The Statsig integration forwards the message to the webhook endpoint. There is no dedicated logic for `record` type events; hence, RETL is limited to JSON Mapper flows that map rows into standard event types (identify, track, page, screen, group, alias).

## Notes

- Confirm VDM support flags in the integrations config repository if VDM is required. Marked as NEEDS REVIEW above where uncertain.


