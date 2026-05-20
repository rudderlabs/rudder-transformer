## Repository Rules (From CLAUDE) <!-- RUD-2749 -->
- After code changes, run: `npm run lint`, destination-scoped unit tests, and destination-scoped integration tests.
- Anchor: `CLAUDE.md :: Post-Change Verification`
- Destination code lives in `src/v0/destinations/<dest>/` or `src/v1/destinations/<dest>/`; integration tests in `test/integrations/destinations/<dest>/`.
- Anchor: `CLAUDE.md :: Project Structure`
- Commit format is conventional commits (`type(scope): description`).
- Anchor: `CLAUDE.md :: Conventions`

## Local Skill Constraints (Discoverable) <!-- RUD-2749 -->
- Read and follow `.claude/skills/*/SKILL.md` before destination changes.
- Anchor: `CLAUDE.md :: Skills`
- `batching-framework`: new router-batching integrations should use `BatchDestination` pattern and register rollout in batching map + feature config.
- Anchor: `.claude/skills/batching-framework/SKILL.md`
- `code-structure`: prefer handler maps, avoid unnecessary eslint disables, avoid duplicate validation/try-catch wrappers.
- Anchor: `.claude/skills/code-structure/SKILL.md`
- `typescript-guidelines`: avoid optional chaining where type guarantees presence; cast early; prefer `unknown` over `any`.
- Anchor: `.claude/skills/typescript-guidelines/SKILL.md`
- `writing-tests`: use `it.each`, avoid loose error matchers, keep reusable fixtures in `common.ts`.
- Anchor: `.claude/skills/writing-tests/SKILL.md`

## Destination Runtime Conventions <!-- RUD-2749 -->
- Dynamic handler resolution is canonical (`MiscService` + `FetchHandler` cache), not static imports in controller path.
- Anchor: `src/services/misc.ts :: getDestHandler/getBatchDestinationHandler`
- Anchor: `src/helpers/fetchHandlers.ts :: getDestHandler/getBatchDestinationHandler`
- Router transform feature toggles and batching rollout use config/env instead of hardcoded behavior changes.
- Anchor: `src/features.ts :: defaultFeaturesConfig.routerTransform`
- Anchor: `src/constants/batchedDestinationsMap.ts :: isBatchingFrameworkEnabled`
