# Lytics RETL Functionality

## Is RETL supported?

**Yes**: `warehouse` is in `supportedSourceTypes` with `cloud` connection mode.

## Support Types

- **JSON Mapper**: Yes (`disableJsonMapper` not set).
- **VDM v1**: No (`supportsVisualMapper` not set).
- **VDM v2**: No (`record` not in `supportedMessageTypes`).

## Connection Config

None.

## RETL Flow

There is no `mappedToDestination` or `record` handling in `procWorkflow.yaml`. Warehouse rows reach the destination as ordinary `identify`/`track`/`page`/`screen` events (JSON Mapper or warehouse event models) and follow the event-stream flow in [businesslogic.md](businesslogic.md).

Note: `lytics_bulk_upload` (a separate destination with its own route in `rudder-integrations-info`) is the bulk-upload path for Lytics and is not covered here.
