---
name: generate-integration-docs
description: Generate detailed integration documentation for a rudder-transformer destination. Use when asked to create docs, README, or documentation for a destination integration.
argument-hint: <destination-folder-name> [integrations-config-path]
disable-model-invocation: true
---

# Generate Integration Documentation

**Objective:** Create detailed, meticulous integration documentation for the specified destination in `rudder-transformer`.

## Inputs

- **Destination folder**: `src/v0/destinations/$ARGUMENTS[0]/` (or `src/v1/destinations/$ARGUMENTS[0]/` if v0 doesn't exist)
- **Integrations config path**: `$ARGUMENTS[1]` (defaults to `../rudder-integrations-config/src/configurations/destinations/$ARGUMENTS[0]` relative to the repo root, if not provided)

## Guide

Follow the guide at [integration-docs-guide.md](integration-docs-guide.md) bundled with this skill. Thoroughly address every point mentioned in the guide. If parts of the guide are not easily addressable, highlight those sections with `NEEDS REVIEW`.

## Reference Example

Study the example at `src/v0/destinations/am/docs/` to understand the expected format, depth, and structure for each section.

## Important Considerations

1. **Check `src/constants/destinationCanonicalNames.js`** for `DestHandlerMap` entries — multiple dashboard destinations may share the same transformer code. If so, check integrations-config for each mapped destination and merge all information into one doc.

2. **Config setup**: Refer to the integrations-config folder for:

   - `db-config.json` — supported source types, message types, auth type, VDM support, transform mode, etc.
   - `schema.json` — config field definitions and validations
   - `ui-config.json` — UI field labels and descriptions

3. **VDM support**: For some integrations, VDM (Visual Data Mapper) configuration lives in the `rudder-integrations-info` sibling repo. Check `../rudder-integrations-info/` for VDM-related config if it's not fully covered in `rudder-integrations-config`.

4. **Auth information**: For OAuth and auth-related details, refer to the `rudder-auth` sibling repo at `../rudder-auth/`. This can contain auth flow definitions, token refresh logic, and OAuth scope configurations relevant to the destination.

5. **For version deprecation sections**: Search the internet for the destination's API version end-of-life schedules, latest available versions, and deprecation policies. Include reference links.

## Output Structure

Create the following files in the destination folder:

```
<destination>/
├── README.md              ← Primary doc (overview, config, functionalities, general queries, version info, FAQ)
└── docs/
    ├── businesslogic.md   ← Field mappings, API endpoints, request flows, error handling, example payloads
    └── retl.md            ← RETL/VDM support analysis
```

## README.md Sections (Event Stream Focus)

- **Integration Functionalities**

  - Destination config keys used in code (from `destination.Config`)
  - Implementation language (JS/TS or CDK v2)
  - Supported message types
  - Validations (restrictions, required fields per event type)
  - Rate limits (from destination API docs)
  - Batching support (which message types, batch sizes)
  - Intermediate calls (per event type, endpoints, why necessary)
  - Proxy delivery (`networkHandler.js` presence)
    - Partial batching response handling
  - User deletion (`deleteUsers.js` presence)
  - OAuth support (`auth.type` in db-config or accounts sub-directory)
  - Processor vs Router (`transformAtV1` in db-config)
  - Additional functionalities (dedupe, custom logic, etc.)

- **General Queries**

  - Event ordering requirements (per event type)
  - Data replay feasibility (missing data + already-delivered)
  - Rate limits and batch sizes
  - Multiplexing (single input -> multiple outputs)

- **Version Deprecation**

  - Current API version in use
  - End-of-life / deprecation status
  - Latest available version
  - Documentation links

- **RETL section** → link to `docs/retl.md`
- **Business logic** → link to `docs/businesslogic.md`
- **FAQ section** (empty initially, populated over time)

## docs/retl.md Sections

- Is RETL supported? (check `supportedSourceTypes` for `warehouse`)
- JSON Mapper support (check `disableJsonMapper`)
- VDM V1 support (`supportsVisualMapper`)
- VDM V2 support (`supportedMessageTypes` includes `record` + code handles it)
- Connection config
- RETL flow documentation (logic under `mappedToDestination === true` or `record` event handling)

## docs/businesslogic.md Sections

- Field mappings (tables mapping source to destination fields)
- API endpoints and request flow per event type
- Transformations and special handling
- Example payloads (input -> output)
- Error handling
- Validations (required fields, types, formats)
- General use cases
