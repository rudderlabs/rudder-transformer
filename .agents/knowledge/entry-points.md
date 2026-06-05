# Entry points

> Key entry-point files: read these first to orient in this repo.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.

## First-read files
<!-- ticket:RUD-2785 -->

- `README.md` — high-level service behavior, local setup, and testing patterns (including masked secrets and env overrides for component tests).
- `CLAUDE.md` — repo-operational rules: required local skill review, commit format, and standard verification commands.
- `package.json` — canonical scripts for build/lint/test/release and the dependency surface used by runtime and CI.
- `src/index.ts` — process bootstrap, middleware wiring, cluster/metrics server startup, graceful shutdown, Redis teardown.
- `src/routes/index.ts` — composition point for all Koa route groups (`destination`, `delivery`, `source`, `trackingPlan`, `userTransform`, misc/test endpoints).
- `src/helpers/serviceSelector.ts` — integration-service dispatch policy deciding Native vs CDK v2 destination services and source service implementation.

## Transformation-critical entry points
<!-- ticket:RUD-2785 -->

- `src/controllers/destination.ts` + `src/services/destination/nativeIntegration.ts` — primary destination processor/router/batch orchestration and error shaping.
- `src/controllers/userTransform.ts` + `src/services/userTransform.ts` + `src/util/customTransformerFactory.js` — user transform request path and runtime selection (isolated-vm vs OpenFaaS).
- `src/util/trackingPlan.js` and `src/util/customTransforrmationsStore.js` / `customTransforrmationsStore-v1.js` — direct config-backend dependencies and in-process caches for tracking plans, transformations, and libraries.

## Test and quality entry points
<!-- ticket:RUD-2785 -->

- `test/integrations/component.test.ts` — endpoint-level component test harness and CLI filter semantics (`--destination`, `--feature`, `--id`).
- `test/integrations/destinations/<destination>/` — destination fixture directories defining processor/router/dataDelivery/batch expected behavior.
- `.github/workflows/verify.yml` and `.github/workflows/ut-tests.yml` — CI-level verification baseline for linting and tests.
