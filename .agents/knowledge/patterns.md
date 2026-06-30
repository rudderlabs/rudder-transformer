# Patterns

> Recurring idioms specific to this repo (error handling, state management,
> retries, logging, DI, request lifecycle).
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.
> Every observed idiom includes a `file:line` reference.

## Request lifecycle and layering
<!-- ticket:RUD-2785 -->

- Route modules compose feature flags and activation guards before controller invocation (`src/routes/destination.ts`, `src/routes/userTransform.ts`, `src/routes/source.ts`).
- Controllers capture request metadata once, delegate to services, then run a common response finalizer (`src/controllers/destination.ts::destinationTransformAtRouter`, `src/controllers/source.ts::sourceTransform`, `src/controllers/userTransform.ts::transform`, all calling `ControllerUtility.postProcess`).
- Service dispatch is policy-driven and cached via `ServiceSelector.fetchCachedService`, so destination implementation switching (Native vs CDK v2) happens in one place (`src/helpers/serviceSelector.ts`).

## Error mapping and fallback shape
<!-- ticket:RUD-2785 -->

- Transform paths wrap per-event failures into normalized response envelopes rather than throwing raw errors (`src/services/destination/postTransformation.ts` consumers in destination/source/user-transform controllers).
- Native destination and source services use `mapInBatches` and catch per-item exceptions so one failed event usually yields error objects instead of aborting the whole request (`src/services/destination/nativeIntegration.ts`, `src/services/source/nativeIntegration.ts`).
- Tracking-plan validation treats retryable exceptions specially (`RetryRequestError` stops loop and escalates status), while non-retry failures still emit event-level validation responses (`src/services/trackingPlan.ts::validate`).

## State and caching idioms
<!-- ticket:RUD-2785 -->

- Config-backend fetches are memoized with version-key caches (`NodeCache` and object maps) to avoid repeated control-plane calls (`src/util/trackingPlan.js`, `src/util/customTransforrmationsStore.js`, `src/util/customTransforrmationsStore-v1.js`).
- OpenFaaS function metadata and library-version relevance are cached per function name to reduce deployment/extraction overhead (`src/util/openfaas/index.js::functionListCache`, `src/util/customTransformer-faas.js::libVersionIdsCache`).
- Redis access is wrapped behind `RedisDB` with lazy initialization, readiness checks, timeout race, and operation-specific metrics (`src/util/redis/redisConnector.js`).

## User transform execution idiom
<!-- ticket:RUD-2785 -->

- `userTransformHandler` always resolves transformation code (live fetch in prod, inline revision in test mode) and delegates execution to a factory-chosen runtime (`src/util/customTransformer.js::userTransformHandler`, `src/util/customTransformerFactory.js::UserTransformHandlerFactory`).
- Isolated-vm execution injects controlled globals (`fetch`, `fetchV2`, `geolocation`, `metadata`) and enforces timeout/memory limits (`src/util/customTransformer.js::runUserTransform`).
- Python-language transforms route through OpenFaaS setup + invoke operations with deterministic function naming derived from workspace/version/library IDs (`src/util/customTransformer-faas.js::generateFunctionName`, `setOpenFaasUserTransform`, `runOpenFaasUserTransform`).
