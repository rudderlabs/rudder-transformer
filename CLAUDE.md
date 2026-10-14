# CLAUDE.md — Project Instructions for rudder-transformer

## Post-Change Verification

Before committing:

1. **Lint & format**: `npm run lint` (prettier + eslint --fix); stage and commit any diff.
2. **Unit tests**: `npm test -- --testPathPattern="<destination_name>" --no-coverage`.
3. **Integration tests**: `npm run test:ts -- component --destination=<destination_name>`.

## Project Structure

- **Source**: `src/v0/destinations/<destination>/` (v0), `src/v1/destinations/<destination>/` (CDK v2).
- **Unit tests**: co-located `*.test.ts`.
- **Integration tests**: `test/integrations/destinations/<destination>/`, run by
  `test/integrations/component.test.ts` — `common.ts` (shared fixtures), `router/data.ts`,
  `dataDelivery/data.ts`, `network.ts` (mocked partner responses), `live.ts` (live tests).
- **Optional `mocks.ts`** — only for jest mock functions (e.g. `defaultMockFns` using
  `jest.replaceProperty` to shrink `MAX_BATCH_SIZE`); never a re-export of `networkCallsData`
  (import that from `network.ts`).

`processor/` exists only where a processor transform remains. **A new batching-framework destination
is router-only** — every transform fixture goes in `router/data.ts` (see the `writing-tests` and
`deprecate-processor-transform` skills).

## Skills

Before writing or modifying code, read all `.claude/skills/*/SKILL.md` files and follow them.

## Conventions

- Conventional commits: `type(scope): description` (e.g. `feat(fb_custom_audience): ...`, `fix(gaoc): ...`).
- **Allowed types are a closed list** (`commitlint.config.js` `type-enum`): `fix`, `feat`, `chore`,
  `refactor`, `docs`, `test`, `ci`, `style`. The `commitlint` job (`.github/workflows/commitlint.yml`)
  checks **every commit in the PR range**, so a bad type needs a history rewrite of the pushed
  branch — get it right first time. Formatting-only commits are `style` or `chore`, never
  `format`/`fmt`/`lint`.

## Specs Beat Tickets

When a Linear ticket and the merged `rudder-specs` spec disagree on a field name, shape or default,
**the spec wins** — tickets are pre-spec summaries. Don't implement both spellings "for
compatibility": a new integration has no legacy payload, and the extra branch is dead code that
diverges from what the config UI can produce. Confirm per-mapping field names against the spec and
its `rudder-integrations-config` PR; canonical names are in `rudder-integrations-config/CONVENTIONS.md`.
