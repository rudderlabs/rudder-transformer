# Conventions

> Coding conventions and naming schemes — things a linter can't catch.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.

## Repository workflow conventions
<!-- ticket:RUD-2785 -->

- Repo-level instructions require reading all skill docs in `.claude/skills/*/SKILL.md` before changes (`CLAUDE.md`).
- Commit subject format is conventional commits with scope (`type(scope): description`) (`CLAUDE.md`, `commitlint.config.js`).
- Post-change checks default to `npm run lint`, affected unit tests, and affected component tests for changed destinations (`CLAUDE.md`).

## Source and test layout conventions
<!-- ticket:RUD-2785 -->

- Destination implementation is split by generation lane: legacy and custom integrations under `src/v0/destinations/<destination>/`, CDK-backed destination code in `src/v1/destinations/<destination>/` (documented in `CLAUDE.md` and reflected in tree layout).
- Unit tests are colocated as `*.test.ts` alongside implementation files for destination modules (`CLAUDE.md`; examples across `src/v0/destinations/*`).
- Component tests are data-driven fixtures under `test/integrations/destinations/<destination>/` with feature folders (`processor`, `router`, `dataDelivery`, `batch`) consumed by a single runner `test/integrations/component.test.ts`.

## Runtime naming and boundary conventions
<!-- ticket:RUD-2785 -->

- Controllers expose verb-first static methods mapped directly from routes (`DestinationController.destinationTransformAtProcessor`, `SourceController.sourceHydrate`, `UserTransformController.testRun`).
- Service types are selected through explicit interface contracts (`DestinationService`, `SourceService`) and centralized constants (`INTEGRATION_SERVICE` in `src/routes/utils/constants`).
- Transformation artifact identifiers use version IDs as cache keys and API lookup keys (`versionId` in `customTransforrmationsStore*.js` and user-transform controllers), so runtime behavior assumes immutable versioned artifacts.

## Testing data and secrets conventions
<!-- ticket:RUD-2785 -->

- Destination component tests are expected to keep reusable fixtures in `common.ts` and use plain object entries in `data.ts` (repo-local guidance in `.claude/skills/writing-tests/SKILL.md`).
- Secret-like values in destination tests should be derived placeholders in `maskedSecrets.ts`, with real credentials injected via env overrides only (`README.md` testing guidance).
