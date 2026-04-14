# CLAUDE.md — Project Instructions for rudder-transformer

## Post-Change Verification

After making code changes, always run these checks before committing:

1. **Lint & format**: `npm run lint` (runs prettier + eslint --fix). If it produces diffs, stage and commit them.
2. **Unit tests**: `npx jest --testPathPattern="<destination_name>" --no-coverage` for the affected destination.
3. **Integration tests**: `npx jest test/integrations/component.test.ts --no-coverage -t "<destination_name>"` for the affected destination.

## Project Structure

- **Source code**: `src/v0/destinations/<destination>/` (v0 transformers), `src/v1/destinations/<destination>/` (CDK v2)
- **Unit tests**: Co-located as `*.test.ts` alongside source files
- **Integration tests**: `test/integrations/destinations/<destination>/` with a single test runner at `test/integrations/component.test.ts`
- **Integration test sub-folders**: `processor/`, `router/`, `dataDelivery/`, `network.ts`, `mocks.ts`

## Conventions

- Commit messages follow conventional commits: `type(scope): description` (e.g., `feat(fb_custom_audience): ...`, `fix(gaoc): ...`)
