# OpenAI Ads RETL Functionality

## Is RETL supported?

**No.** `supportedSourceTypes` in `db-config.json` does not include `warehouse`.

## Supported RETL types

- **JSON Mapper**: Not applicable.
- **VDM V1**: Not supported (`supportsVisualMapper` not set).
- **VDM V2**: Not supported (no `record` message type; the zod schema accepts only track, page and screen).

## Connection config

Not applicable.
