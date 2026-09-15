# CLAUDE.md — Project Instructions for rudder-transformer

## Post-Change Verification

After making code changes, always run these checks before committing:

1. **Lint & format**: `npm run lint` (runs prettier + eslint --fix). If it produces diffs, stage and commit them.
2. **Unit tests**: `npm test -- --testPathPattern="<destination_name>" --no-coverage` for the affected destination.
3. **Integration tests**: `npm run test:ts -- component --destination=<destination_name>` for the affected destination.

## Project Structure

- **Source code**: `src/v0/destinations/<destination>/` (v0 transformers), `src/v1/destinations/<destination>/` (CDK v2)
- **Unit tests**: Co-located as `*.test.ts` alongside source files
- **Integration tests**: `test/integrations/destinations/<destination>/` with a single test runner at `test/integrations/component.test.ts`
- **Integration test files**: `common.ts` (shared fixtures), `router/data.ts`, `dataDelivery/data.ts`, `network.ts` (mocked partner responses), `live.ts` (live integration tests)
- **Optional**: `mocks.ts` — only when the destination needs jest mock functions (e.g. `defaultMockFns` using `jest.replaceProperty` to shrink `MAX_BATCH_SIZE`). It is **not** a place to re-export `networkCallsData`; import that from `network.ts` directly.

A `processor/` sub-folder exists only in destinations that still have a processor transform.
**A new destination built on the batching framework does not get one** — it is
router-transform-only, so every transform fixture belongs in `router/data.ts`. See the
`writing-tests` and `deprecate-processor-transform` skills.

## Skills

Before writing or modifying code, read all `.claude/skills/*/SKILL.md` files and follow the conventions defined in them.

## Conventions

- Commit messages follow conventional commits: `type(scope): description` (e.g., `feat(fb_custom_audience): ...`, `fix(gaoc): ...`)
- **The allowed commit types are a closed list**, enforced by `commitlint.config.js` `type-enum`:
  `fix`, `feat`, `chore`, `refactor`, `docs`, `test`, `ci`, `style`. Anything else fails the
  `commitlint` job (`.github/workflows/commitlint.yml`). Commitlint checks **every commit in
  the PR range**, so a bad type cannot be fixed by adding another commit — it needs a history
  rewrite of an already-pushed branch. Get the type right the first time; formatting-only
  commits are `style` or `chore`, never `format`/`fmt`/`lint`.

## Specs Beat Tickets

When a Linear ticket and the merged spec in `rudder-specs` disagree on a field name, shape, or
default, **the spec wins** — a ticket description is a summary written before the spec was
finalised. Do not implement both spellings "for compatibility": on a brand-new integration
there is no legacy payload to be compatible with, and the extra branch is dead code that
silently diverges from what the config UI can actually produce. Confirm against the spec (and
the corresponding `rudder-integrations-config` PR) before implementing a per-mapping field
name, and see `rudder-integrations-config/CONVENTIONS.md` for the canonical names.
