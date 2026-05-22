# Coding Conventions

> Discovered coding conventions in the codebase.
> This file is append-only - agents add discoveries, never delete.

(Add conventions as you discover them)

## File naming and location

- v0 destinations live at `src/v0/destinations/<snake_case_dest>/`
- v1 destinations live at `src/v1/destinations/<snake_case_dest>/`
- Destination name in code (e.g., `ITERABLE_AUDIENCE`) must match `batchedDestinationsMap.ts` key (uppercase with underscores)
- `misc.ts` uses the destination name lowercase with underscores as the directory name: `iterable_audience`

## BatchDestination class conventions

- Always export the class as `Integration`: `export class Integration extends BatchDestination {...}`  
  (misc.ts loads it as `.Integration`)
- Constructor validates that `this.connection` exists for connection-dependent destinations; throws `InstrumentationError` if absent
- Pre-compute connection-derived constants in constructor, not in `transformEvent` (called per event)
- `this.connection\!.config.destination` is the convention to access connection config (non-null assert is idiomatic when connection is required)

## TypeScript conventions

- Use Zod for runtime schema validation in `getInputSchema()` and in `types.ts`
- Use `z.infer<typeof Schema>` to derive TypeScript types from Zod schemas
- Import error types from `@rudderstack/integrations-lib`: `InstrumentationError`, `ConfigurationError`
- Import `TransformerProxyError` from `src/v0/util/errorTypes` (v1 networkHandler only)
- Use `import type` for type-only imports
- `.passthrough()` on Zod objects to allow extra fields through validation

## Commit conventions

Conventional commits format: `type(scope): description`
- `feat(iterable_audience):`
- `fix(iterable_audience):`
- `test(iterable_audience):`
- Separate commits per logical unit (new module, its tests, wiring/registration)

## v1 networkHandler conventions

```typescript
// Standard mixin pattern — networkHandler is a constructor function bound to `this`
function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}
export { networkHandler };
```

Import `prepareProxyRequest`, `proxyRequest` from `src/adapters/network`
Import `processAxiosResponse` from `src/adapters/utils/networkUtils`

## Test conventions

- Unit tests co-located as `*.test.ts` alongside source files
- Integration tests at `test/integrations/destinations/<dest>/`
- Integration test data in `test/integrations/destinations/<dest>/router/data.ts`
- Run unit tests: `npm test -- --testPathPattern="iterable_audience" --no-coverage`
- Run integration tests: `npm run test:ts -- component --destination=iterable_audience`
- Exercise BatchDestination via `processBatchedDestination(inputs, Integration, {})` in unit tests

## Error classification in v1 (networkHandler)

| HTTP | Error type | Notes |
|---|---|---|
| 401 | `TransformerProxyError` with `AuthErrorCategory: 'AUTH'` | Every metadata at 401 |
| 404 | `TransformerProxyError` | Every metadata at 404 |
| 429 | `TransformerProxyError` | Framework retry engages |
| 5xx | `TransformerProxyError` | Framework retry engages |
| 2xx with failedUpdates | Per-record statusCode in `responseWithIndividualEvents` | See patterns.md |

## Iterable API authentication

- HTTP header: `Api-Key: <secret.apiKey>`
- **Never** pass as a query string (Iterable enforces stricter rate limiting on query-string auth)
- US datacenter: `https://api.iterable.com/api/`
- EU datacenter: `https://api.eu.iterable.com/api/`
