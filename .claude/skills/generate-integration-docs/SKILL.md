---
name: generate-integration-docs
description: Generate detailed integration documentation for a rudder-transformer destination. Use when asked to create docs, README, or documentation for a destination integration.
argument-hint: <destination-folder-name> [integrations-config-path]
disable-model-invocation: true
---

# Generate Integration Documentation

Write meticulous docs for one destination, following
[references/integration-docs-guide.md](references/integration-docs-guide.md) point by point. Mark
anything you can't establish with confidence as `NEEDS REVIEW` rather than guessing.

## Inputs

- **Destination folder**: `src/v0/destinations/$ARGUMENTS[0]/` (else `src/v1/destinations/$ARGUMENTS[0]/`).
- **Integrations config**: `$ARGUMENTS[1]`, default
  `../rudder-integrations-config/src/configurations/destinations/$ARGUMENTS[0]`.

## Sources

- **Examples of format and depth**: `src/v0/destinations/am/` and `src/v0/destinations/braze/`
  (`README.md` + `docs/`).
- **Shared code**: check `DestHandlerMap` in `src/constants/destinationCanonicalNames.js` — several
  dashboard destinations may share this transformer; read each one's config and merge into one doc.
- **integrations-config**: `db-config.json` (source/message types, auth, VDM, `transformAtV1`),
  `schema.json` (field definitions, validation), `ui-config.json` (labels, descriptions).
- **`../rudder-integrations-info/`** — VDM config not covered by integrations-config.
- **`../rudder-auth/`** — OAuth flows, token refresh, scopes.
- **The web** — partner rate limits, API version EOL/deprecation and changelogs; cite links.

## Output

```
<destination>/
├── README.md            ← overview, config, functionalities, general queries, versions, FAQ
└── docs/
    ├── businesslogic.md ← mappings, endpoints, request flows, errors, example payloads
    └── retl.md          ← RETL / VDM support
```
