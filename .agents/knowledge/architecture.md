# Architecture

> Component layout, internal relationships, data flow.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.

## Runtime topology
<!-- ticket:RUD-2785 -->

- The service boots from `src/index.ts` and wires Koa middleware (error handling, stats, body parsing, request-size tracking) before attaching route groups via `applicationRoutes` in `src/routes/index.ts::applicationRoutes`.
- Request handling is split by capability: destination transforms/proxy (`src/routes/destination.ts`, `src/routes/delivery.ts`), source transform/hydrate (`src/routes/source.ts`), tracking-plan validation (`src/routes/trackingPlan.ts`), and user transforms (`src/routes/userTransform.ts`).
- Controllers are thin transport adapters that normalize input/output and delegate behavior to services (`src/controllers/*.ts`), while service selection is centralized in `src/helpers/serviceSelector.ts::ServiceSelector`.
- The destination lane has two concrete implementations selected at runtime by destination/workspace flags: native handlers (`src/services/destination/nativeIntegration.ts`) and CDK v2 workflows (`src/services/destination/cdkV2Integration.ts`).

## Data and control flow
<!-- ticket:RUD-2785 -->

- Destination processor flow: `DestinationController.destinationTransformAtProcessor` preprocesses payloads, applies `DynamicConfigParser.process`, and dispatches to `DestinationService.doProcessorTransformation`.
- Destination router flow: `DestinationController.destinationTransformAtRouter` validates shape (`checkInvalidRtTfEvents`), preprocesses, then calls `DestinationService.doRouterTransformation`, which groups events by destination metadata (`groupRouterTransformEvents`) and transforms batches concurrently (`mapInBatches`).
- Source flow: `SourceController.sourceTransform` and `SourceController.sourceHydrate` route to `NativeIntegrationSourceService.sourceTransformRoutine` / `.sourceHydrateRoutine`, where hydrate is explicitly limited to supported source types.
- Delivery flow: proxy endpoints call `NativeIntegrationDestinationService.deliver`, which chooses destination-specific network handlers and can adapt v0 handler responses into v1 delivery-job responses.

## State and external dependencies
<!-- ticket:RUD-2785 -->

- Tracking-plan metadata is fetched directly from config-backend and cached in-process (`src/util/trackingPlan.js::getTrackingPlan`, NodeCache key `tpId::version`).
- User transformation artifacts are fetched directly from config-backend and cached (`src/util/customTransforrmationsStore.js::getTransformationCode`, `src/util/customTransforrmationsStore-v1.js::getTransformationCodeV1`, `getLibraryCodeV1`, `getRudderLibByImportName`).
- Runtime shared state for rate/control paths uses Redis via `src/util/redis/redisConnector.js::RedisDB` with reconnect/backoff and expiring writes.
- User transform execution path is language-dependent via `src/util/customTransformerFactory.js::UserTransformHandlerFactory`: JavaScript/other languages use isolated-vm handlers (`src/util/customTransformer.js`), while `python`/`pythonfaas` paths go through OpenFaaS orchestration (`src/util/customTransformer-faas.js`, `src/util/openfaas/index.js`).

## Testing architecture
<!-- ticket:RUD-2785 -->

- Unit tests are co-located with source files (repo convention in `CLAUDE.md`), while integration/component scenarios are centralized under `test/integrations`.
- `test/integrations/component.test.ts` spins a local Koa app using `applicationRoutes` and drives endpoint-level assertions from fixture files under `test/integrations/destinations/<destination>/{processor,router,dataDelivery,batch}`.
- Component runs depend on mock network responses from per-destination `network.ts` fixtures and optional env override support through `test/integrations/envUtils.ts` patterns documented in `README.md`.

## Cross-cutting
<!-- ticket:RUD-2785 -->

- Controller/service layering keeps API transport concerns separate, but core behavior depends on shared runtime helpers (`DynamicConfigParser`, stats tagging, post-transformation handlers), so regressions often span `src/controllers/*` and `src/services/*` together.
- User transform reliability and security posture are constrained by a dual runtime model (`customTransformer.js` isolated-vm and `customTransformer-faas.js` OpenFaaS), with path selection hidden behind `UserTransformHandlerFactory`; both paths must be considered when debugging language-specific issues.
- Architectural docs in `memory-bank/03_system_architecture.md` emphasize sandboxed user transforms, while current code also includes config-backend fetch + cache loops for tracking plans and transformation artifacts (`trackingPlan.js`, `customTransforrmationsStore*.js`), which are control-plane dependencies not optional implementation details.
- Repository testing strategy mirrors runtime entry points: destination/source/user-transform endpoints are exercised through route-driven component tests (`test/integrations/component.test.ts`) and destination-scoped fixtures, reinforcing the route-controller-service boundary as the primary integration seam.
