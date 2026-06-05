# Stack

> Dependencies, frameworks, tooling.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.

## Language and runtime
<!-- ticket:RUD-2785 -->

- Node.js runtime is pinned via `.nvmrc` to `20.19.5`.
- The codebase is mixed TypeScript and JavaScript: TypeScript entrypoints/controllers/services (`src/index.ts`, `src/controllers/*.ts`, `src/services/*.ts`) coexist with JavaScript runtime utilities and many destination modules (`src/util/*.js`, `src/v0/destinations/*`).
- Build pipeline uses TypeScript compiler (`tsc`) plus targeted bundling for sandbox assets (`package.json` scripts `build:ci`, `build:custom-audience-sandbox`; `tsconfig.json`, `tsconfig.test.json`).

## Runtime frameworks and core libraries
<!-- ticket:RUD-2785 -->

- HTTP service framework: `koa@^3.1.2` with `@koa/router@^12.0.0`, `koa-bodyparser@^4.4.0`, and Swagger UI integration (`koa2-swagger-ui@^5.7.0`).
- Observability and metrics: `prom-client@^15.1.3`, `@bugsnag/js`, optional `@pyroscope/nodejs`, plus internal stats wrappers (`src/util/stats*`).
- Destination/source transformation utilities rely on `@rudderstack/integrations-lib@^0.2.70`, `@rudderstack/json-template-engine@^0.19.5`, and `@rudderstack/workflow-engine@^0.9.0`.
- User-transform execution stack includes `isolated-vm@5.0.3` and OpenFaaS integration helpers under `src/util/openfaas`.

## State, data plane, and external integrations
<!-- ticket:RUD-2785 -->

- Redis client: `ioredis@^5.3.2`, wrapped in `src/util/redis/redisConnector.js` for runtime state and cache-like coordination.
- Control-plane fetch layer: `node-fetch@^2.6.12` and custom proxy-aware fetch wrappers (`src/util/fetch*`) used by tracking plan and transformation store modules.
- Network delivery stack uses `axios@^1.16.0` with destination network handlers and test-time `axios-mock-adapter` fixtures.

## Developer tooling and CI
<!-- ticket:RUD-2785 -->

- Formatting and linting: `prettier@^3.2.4`, `eslint@^8.57.1`, TypeScript ESLint plugins, invoked via `npm run lint`.
- Testing: `jest@^29.5.0` with multiple configs (`jest.config.js`, `jest.config.typescript.js`, `jest.default.config.js`), `supertest`, and component fixture runner under `test/integrations/component.test.ts`.
- Release/workflow automation: `standard-version`, commitlint, husky hooks, and GitHub workflows including `verify.yml`, `ut-tests.yml`, `dt-test-and-report-code-coverage.yml`, and release/deploy pipelines in `.github/workflows/`.
