# Concerns

> Technical debt, TODOs, FIXMEs, security concerns, architectural issues.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.
> Top-5–8 highest-signal items per category, not exhaustive.

## TODO/FIXME concentration
<!-- ticket:RUD-2785 -->

- `src/controllers/regulation.ts::deleteUsers` has unresolved response-shape/status TODOs (status from first element, unused error response object, always-singleton error body), increasing risk of inconsistent deletion semantics.
- `src/index.ts` keeps default batch processing size at 50 with an inline note to reduce later; this leaves uncertain runtime behavior and no encoded rollout guard.
- `src/util/trackingPlan.js::getTrackingPlan` TODO indicates cache correctness gap when `version` is omitted; stale/latest mismatches are possible in that path.
- `src/services/destination/cdkV2Integration.ts::doProcessorTransformation` carries an explicit TODO on return typing, signaling technical debt around type guarantees for core transform responses.
- `src/util/ivmFactory.js` and adjacent user-transform utility code contain multiple TODO markers around field pruning and library handling, indicating ongoing debt in sandbox plumbing.

## Security-relevant concerns
<!-- ticket:RUD-2785 -->

- User transformation execution intentionally runs untrusted customer code (`src/util/customTransformer.js::runUserTransform`), so safety depends on isolate limits and guarded globals; regressions here can become remote-code-exec or data-exfiltration vectors.
- OpenFaaS path executes customer-provided Python code and dynamically deploys functions (`src/util/customTransformer-faas.js`, `src/util/openfaas/index.js`); weak namespace/network policy configuration can broaden blast radius.
- Control-plane artifact fetches rely on runtime URLs and secrets (`CONFIG_BACKEND_URL` and fetch wrappers in `trackingPlan.js`, `customTransforrmationsStore*.js`) with in-memory caching; compromised control-plane responses directly influence transform logic.
- Test guidance in `README.md` relies on contributors not committing real credentials to `maskedSecrets.ts`; this is process-based protection rather than an enforced secret-scanning boundary in code.

## Architectural smells and coupling
<!-- ticket:RUD-2785 -->

- Runtime model is split across v0, v1, CDK v2, and mixed JS/TS modules; behavior for a single destination can cross multiple paradigms, increasing onboarding/debug cost.
- Service selection and fallback behavior (Native vs CDK v2; v1 proxy adapting v0 handlers) create implicit compatibility layers that can mask destination-specific regressions until runtime (`serviceSelector.ts`, `nativeIntegration.ts::deliver`).
- Controllers and services share many loosely typed `any` payloads and metadata objects; weak contracts make refactors fragile and encourage defensive runtime checks.
- `src/util` acts as a broad catch-all for caching, networking, sandboxing, and infra helpers, creating high coupling between unrelated runtime concerns.

## Staleness and documentation drift
<!-- ticket:RUD-2785 -->

- `memory-bank/03_system_architecture.md` describes user transforms primarily as sandboxed execution and underrepresents direct config-backend fetch/caching and OpenFaaS execution paths present in current runtime code.
- `memory-bank/10_system_dependencies.md` lists older dependency versions (`@rudderstack/integrations-lib` and `@rudderstack/workflow-engine`) that differ from current `package.json`, so it should not be treated as version source-of-truth.
- Broad memory-bank summaries can imply warehouse/source/destination boundaries that are conceptually useful but less precise than the active route/controller/service wiring in `src/`.
