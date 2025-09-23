# RETL Support for Statsig

## Is RETL supported?

- Yes. `supportedSourceTypes` includes `warehouse` in `db-config.json`, which indicates RETL is enabled for this destination.

## RETL Types

- JSON Mapper: Supported by default (no `disableJsonMapper: true`).
- VDM V1: Not Supported (`supportsVisualMapper: true` is not present in db-config;).
- VDM V2: Not Supported

## Connection Config

- Uses the same destination config keys as cloud mode. `secretKey` remains required.

## RETL Flow

- The Statsig integration forwards the message to the webhook endpoint. There is no dedicated logic for `record` type events; hence, RETL is limited to JSON Mapper flows that map rows into standard event types (identify, track, page, screen, group, alias).


