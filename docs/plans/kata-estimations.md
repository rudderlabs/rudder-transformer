# Kata + Firecracker — Detailed Estimations

Companion to [kata-plan.md](kata-plan.md). All estimates assume one senior engineer
familiar with the relevant codebase(s).

---

## 1. Routing — Option 1a (Predictable K8s DNS names)

### 1.1 rudder-server changes

The routing change is confined to a single file:
`processor/internal/transformer/user_transformer/user_transformer.go`

**Current state:** `userTransformURL()` (line 415) appends `/customTransform` to a static
base URL from env vars (`USER_TRANSFORM_URL` / `PYTHON_TRANSFORM_URL`). WorkspaceID is
already available in the calling function (`Transform()`, line 112).

**Changes needed:**

| Change                                              | File(s)                    | Description                                                                                                             |
|-----------------------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Add `workspaceId` parameter to `userTransformURL()` | `user_transformer.go`      | Pass `clientEvents[0].Metadata.WorkspaceID` from `Transform()`                                                          |
| Construct per-workspace URL                         | `user_transformer.go`      | `fmt.Sprintf("http://%s-%s.transformers.svc.cluster.local:8080/customTransform", prefix, strings.ToLower(workspaceId))` |
| Add config for namespace/domain                     | `user_transformer.go`      | New env vars: `TRANSFORMER_NAMESPACE` (default `transformers`), `TRANSFORMER_DOMAIN` (default `svc.cluster.local`)      |
| Feature flag for gradual rollout                    | `user_transformer.go`      | `USE_PER_WORKSPACE_ROUTING` env var. When false, fall back to current static URL behavior.                              |
| Mirror namespace support                            | `user_transformer.go`      | When `forMirroring`, use `TRANSFORMER_MIRROR_NAMESPACE` (default `transformers-mirror`)                                 |
| Update tests                                        | `user_transformer_test.go` | Add tests for new URL construction, case lowering, feature flag, mirror namespace                                       |

**Lines of code changed:** ~30-50 lines in `user_transformer.go`, ~100-150 lines in tests.

| Task                                                      | Estimate   |
|-----------------------------------------------------------|------------|
| Implement `userTransformURL()` changes + feature flag     | 1 day      |
| Update unit tests                                         | 1 day      |
| Integration test with a local K8s cluster (kind/minikube) | 1 day      |
| Code review + iteration                                   | 1 day      |
| **Subtotal**                                              | **4 days** |

### 1.2 rudderstack-operator changes

The operator needs to create per-workspace Deployments + Services instead of one shared set.

**Current state:** Transformer Helm chart has 11 template files (596 lines total) producing
one Deployment, one Service, one HPA, etc. Workspace IDs are in the CRD spec under
`spec.global.workspaceDetails` (already iterated for metrics).

**Changes needed:**

| Change                            | File(s)                        | Description                                                                            |
|-----------------------------------|--------------------------------|----------------------------------------------------------------------------------------|
| Add workspace list to Helm values | `cluster-states.go` reconciler | Extract workspace IDs from `spec.global.workspaceDetails`, pass as list to Helm values |
| Wrap templates in range loop      | `deployment.yaml` (191 lines)  | `{{- range $wsId, $wsConfig := .Values.workspaces }}` around the Deployment spec       |
| Per-workspace service naming      | `service.yaml`, `_helpers.tpl` | Service name becomes `transformer-{{ lower $wsId }}`                                   |
| Per-workspace HPA                 | `hpa.yaml`                     | One HPA per workspace Deployment, or shared defaults with per-workspace overrides      |
| Kata runtime class                | `deployment.yaml`              | Add `runtimeClassName: kata` to pod spec                                               |
| Per-workspace resource overrides  | `values.yaml`, `_helpers.tpl`  | Allow `workspaces[wsId].resources` to override global defaults                         |
| Workspace deletion grace period   | `cluster-states.go`            | Track workspace removal timestamp, delete Deployment after grace period (e.g., 5 min)  |
| Repeat for pytransformer chart    | `pytransformer/templates/*`    | Same changes as transformer chart                                                      |
| Network policy updates            | `network-policy.yaml`          | Per-workspace policies or shared policy covering all workspace pods                    |
| Update Helm tests                 | `tests/`                       | Test multi-workspace rendering                                                         |

**Lines of code changed:** ~200-300 lines across Helm templates, ~50-100 lines in reconciler.

| Task                                                                  | Estimate    |
|-----------------------------------------------------------------------|-------------|
| Design per-workspace Helm values schema                               | 1 day       |
| Modify transformer chart templates (range loop, naming, kata runtime) | 3 days      |
| Modify pytransformer chart templates (same changes)                   | 2 days      |
| Update reconciler to pass workspace list to Helm values               | 2 days      |
| Implement workspace deletion grace period                             | 1 day       |
| Per-workspace HPA / resource overrides                                | 2 days      |
| Helm template unit tests (`helm template --set`)                      | 2 days      |
| Integration test: deploy multi-workspace setup on staging cluster     | 2 days      |
| Code review + iteration                                               | 2 days      |
| **Subtotal**                                                          | **17 days** |

### 1.3 Kata + Firecracker infrastructure

| Task                                                                           | Estimate   |
|--------------------------------------------------------------------------------|------------|
| Set up Kata Containers runtime on K8s nodes (or verify cloud provider support) | 2 days     |
| Verify Firecracker VMM works with transformer container images                 | 1 day      |
| Benchmark Kata cold start time with transformer image                          | 1 day      |
| Configure RuntimeClass `kata` in cluster                                       | 0.5 days   |
| Document node pool requirements (nested virtualization, kernel modules)        | 0.5 days   |
| **Subtotal**                                                                   | **5 days** |

### 1.4 End-to-end validation

| Task                                                                                       | Estimate   |
|--------------------------------------------------------------------------------------------|------------|
| Deploy full stack on staging: rudder-server (1a routing) + operator (per-workspace) + Kata | 2 days     |
| Functional testing: events flow through per-workspace transformers correctly               | 2 days     |
| Performance testing: latency/throughput comparison vs shared deployment                    | 1 day      |
| Failure testing: workspace deletion, pod crash, DNS resolution failures                    | 1 day      |
| Mirror mode validation: mirror namespace receives traffic correctly                        | 1 day      |
| **Subtotal**                                                                               | **7 days** |

### 1a Total

| Component             | Estimate                 |
|-----------------------|--------------------------|
| rudder-server         | 4 days                   |
| rudderstack-operator  | 17 days                  |
| Kata infrastructure   | 5 days                   |
| End-to-end validation | 7 days                   |
| **Total**             | **33 days (~6.5 weeks)** |

**Can be parallelized:** rudder-server changes (4 days) and operator changes (17 days)
can be done by two engineers in parallel. Kata infrastructure can start in parallel too.
With 2 engineers, the critical path is ~17 days operator + 7 days validation = **~5 weeks**.

---

## 2. Scale to zero — Operator wake-up endpoint (OPTIONAL)

### 2.1 Operator changes

| Change                             | File(s)                                             | Description                                                                              |
|------------------------------------|-----------------------------------------------------|------------------------------------------------------------------------------------------|
| Add HTTP server to operator        | `main.go` or new `server.go`                        | Lightweight HTTP endpoint alongside the controller manager                               |
| `POST /wake/{workspaceId}` handler | new `handlers/wake.go`                              | Sets `replicas=1` on the Deployment for the given workspace, returns 202 Accepted        |
| Idempotency                        | handler                                             | If already scaled up, return 200 immediately                                             |
| Metrics                            | handler                                             | `workspace_wakeup_total`, `workspace_wakeup_latency_seconds`                             |
| Scale-down controller              | new `controllers/idle_scaler.go` or extend existing | Watch Prometheus metrics for per-workspace request rate; scale to 0 after idle threshold |
| Prometheus query integration       | controller                                          | Query `rate(http_requests_total{workspace_id="..."}[30m])` or similar                    |
| Configuration                      | values.yaml                                         | `idleThresholdMinutes`, `wakeupPort`, `enableScaleToZero` feature flag                   |

| Task                                                             | Estimate    |
|------------------------------------------------------------------|-------------|
| Design wake-up API contract + idle detection logic               | 1 day       |
| Implement wake-up HTTP endpoint in operator                      | 2 days      |
| Implement idle-scaler controller (Prometheus query + scale down) | 3 days      |
| Tests for wake-up handler (unit + integration)                   | 2 days      |
| Tests for idle-scaler (mock Prometheus, verify scale decisions)  | 2 days      |
| **Subtotal**                                                     | **10 days** |

### 2.2 rudder-server changes

| Change                        | File(s)               | Description                                                                           |
|-------------------------------|-----------------------|---------------------------------------------------------------------------------------|
| Detect "scaled to zero" error | `user_transformer.go` | On connection refused / no endpoints, distinguish from actual failure                 |
| Call wake-up endpoint         | `user_transformer.go` | `POST http://rudderstack-operator.{ns}:8081/wake/{workspaceId}?language=javascript`   |
| Retry with backoff            | `user_transformer.go` | Retry the original request after wake-up call, with configurable backoff and max wait |
| Circuit breaker               | `user_transformer.go` | Don't spam wake-up endpoint if workspace is consistently failing to start             |
| Configuration                 | env vars              | `OPERATOR_WAKEUP_URL`, `SCALE_TO_ZERO_ENABLED`, `WAKEUP_MAX_WAIT_SECONDS`             |

| Task                                                         | Estimate   |
|--------------------------------------------------------------|------------|
| Implement wake-up call + retry logic in rudder-server        | 2 days     |
| Add circuit breaker for repeated wake-up failures            | 1 day      |
| Unit tests                                                   | 1 day      |
| Integration test: scale-to-zero → wake-up → request succeeds | 2 days     |
| **Subtotal**                                                 | **6 days** |

### 2.3 Prometheus metrics prerequisite

| Task                                                                                | Estimate   |
|-------------------------------------------------------------------------------------|------------|
| Ensure per-workspace request rate metrics exist (rudder-server or transformer side) | 1 day      |
| Configure Prometheus scraping for transformer pods                                  | 0.5 days   |
| Verify metrics are queryable by the operator                                        | 0.5 days   |
| **Subtotal**                                                                        | **2 days** |

### Scale-to-zero total (OPTIONAL)

| Component                                 | Estimate                 |
|-------------------------------------------|--------------------------|
| Operator (wake-up endpoint + idle scaler) | 10 days                  |
| rudder-server (wake-up call + retry)      | 6 days                   |
| Prometheus metrics                        | 2 days                   |
| **Total**                                 | **18 days (~3.5 weeks)** |

---

## 3. Bun migration

### 3.1 Dependency audit

The project has **68 production dependencies** and **49 dev dependencies**. The only native
addon is `isolated-vm` (which will be removed). The rest are pure JS/TS.

| Task                                                                             | Estimate     |
|----------------------------------------------------------------------------------|--------------|
| Install Bun and run `bun install` — identify immediate failures                  | 0.5 days     |
| Audit all 68 production deps for Bun compatibility (check bun.sh/docs/ecosystem) | 1.5 days     |
| Audit 49 dev deps (especially Jest, ESLint, TypeScript toolchain)                | 1 day        |
| Identify and document incompatible packages with alternatives                    | 0.5 days     |
| **Subtotal**                                                                     | **3.5 days** |

### 3.2 Fix incompatible dependencies

Based on common Bun incompatibilities in Node.js projects:

| Risk area                                     | Likely impact                                            | Estimate |
|-----------------------------------------------|----------------------------------------------------------|----------|
| Jest → `bun:test` migration or jest-bun shim  | 156 test files across `src/` and `test/`                 | 4-5 days |
| ESLint / TypeScript tooling                   | Usually works, may need config tweaks                    | 1 day    |
| `node-fetch` → Bun built-in `fetch`           | Bun has native fetch; `node-fetch` may still work        | 0.5 days |
| Koa / `@koa/router` compatibility             | Koa works on Bun but some middleware may have edge cases | 1 day    |
| Build scripts (`npm run copy`, transpilation) | Bun has built-in TS support; build pipeline simplifies   | 1 day    |
| Other edge cases discovered during audit      | Unknown unknowns                                         | 2 days   |
| **Subtotal**                                  | **9.5-10.5 days**                                        |

### 3.3 Runtime migration

| Task                                                                      | Estimate   |
|---------------------------------------------------------------------------|------------|
| Replace `node` with `bun` in Dockerfile entrypoint                        | 0.5 days   |
| Update Dockerfile: `node:` base → `oven/bun:` base                        | 0.5 days   |
| Remove transpilation step (Bun runs TS natively) or verify it still works | 1 day      |
| Update `package.json` scripts for Bun (`bun run` vs `npm run`)            | 0.5 days   |
| Update CI/CD pipelines (GitHub Actions / internal CI)                     | 1.5 days   |
| Fix runtime edge cases found during smoke testing                         | 3 days     |
| **Subtotal**                                                              | **7 days** |

### 3.4 Validation

| Task                                                                        | Estimate    |
|-----------------------------------------------------------------------------|-------------|
| Run full test suite under Bun, fix failures                                 | 3 days      |
| Performance benchmarking: Bun vs Node.js (startup time, throughput, memory) | 2 days      |
| Staging deployment + soak test (24-48h under production-like load)          | 3 days      |
| Canary rollout to one production workspace                                  | 2 days      |
| **Subtotal**                                                                | **10 days** |

### Bun migration total

| Phase                 | Estimate                  |
|-----------------------|---------------------------|
| Dependency audit      | 3.5 days                  |
| Fix incompatibilities | 10 days                   |
| Runtime migration     | 7 days                    |
| Validation            | 10 days                   |
| **Total**             | **~30.5 days (~6 weeks)** |

---

## 4. Issue 2 Option C — Remove isolated-vm using Bun Workers

Since Bun migration is happening, we can use Bun's Web Worker API instead of Node.js
`child_process.fork()` for intra-tenant isolation. This combines ivm removal and Bun
migration into a single architectural change.

### 4.1 Architecture

```
┌─ Main Process (Koa/Fastify on Bun) ──────────────────────┐
│                                                           │
│  POST /customTransform                                    │
│    → group events by transformation                       │
│    → for each transformation:                             │
│        → acquire worker from WorkerPool                   │
│        → postMessage({code, events, libraries})           │
│        → onmessage({results})                             │
│        → release worker back to pool                      │
│                                                           │
│  WorkerPool                                               │
│    ├─ Worker 1 (new Worker("worker.ts"))  ← busy          │
│    ├─ Worker 2 (new Worker("worker.ts"))  ← idle          │
│    ├─ Worker 3 (new Worker("worker.ts"))  ← busy          │
│    └─ Worker 4 (new Worker("worker.ts"))  ← idle          │
└───────────────────────────────────────────────────────────┘
```

**Bun Workers vs Node.js child_process:**

| Aspect          | Bun Workers                                 | Node.js child_process                 |
|-----------------|---------------------------------------------|---------------------------------------|
| Isolation       | Separate JavaScriptCore instance            | Separate V8 process                   |
| IPC             | `postMessage()` / structured clone (fast)   | JSON over IPC channel or stdin/stdout |
| Startup         | ~1-5ms (thread, not process)                | ~30-50ms (fork)                       |
| Memory          | Shared address space but separate JS heaps  | Fully separate address spaces         |
| Crash isolation | Worker crash doesn't kill main process      | Same — child crash is isolated        |
| Resource limits | No per-worker memory limit (Bun limitation) | `--max-old-space-size` per process    |

**Key risk: Bun Workers don't support per-worker memory limits.** If a transformation
allocates unbounded memory, it can grow until the process OOM-kills. Mitigation: since
each tenant runs in a Kata VM with cgroup memory limits, an OOM affects only that tenant.
The worker pool detects the crash and replaces the worker.

### 4.2 Files requiring changes

**Same core files as Option A, but targeting Bun APIs:**

| File                                       | Current role                     | Change needed                                |
|--------------------------------------------|----------------------------------|----------------------------------------------|
| `src/util/ivmFactory.js`                   | Creates V8 isolates              | Replace entirely with WorkerPool             |
| `src/util/customTransformer-v1.js`         | Orchestrates ivm execution       | Rewrite to use WorkerPool `postMessage`      |
| `src/util/customTransformer.js`            | Entry point, V0/V1/FaaS dispatch | Simplify to WorkerPool only                  |
| `src/util/customTransformer-faas.js`       | OpenFaaS handler                 | Remove (Python goes to pytransformer now)    |
| `src/util/customTransformerFactory.js`     | Language dispatch                | Remove or simplify (JS only)                 |
| `src/util/ivmCache/*` (5 files, 694 lines) | ivm caching                      | Remove (caching moves to worker)             |
| `package.json`                             | Dependencies                     | Remove `isolated-vm`, update scripts for Bun |

**New files:**

| File                      | Purpose                                                                      | Estimated lines |
|---------------------------|------------------------------------------------------------------------------|-----------------|
| `src/sandbox/pool.ts`     | WorkerPool manager (pre-warming, acquire/release, lifecycle, crash recovery) | ~200-250        |
| `src/sandbox/worker.ts`   | Bun Worker entry point (message loop, compile, execute, cache)               | ~300-400        |
| `src/sandbox/protocol.ts` | Message types for postMessage (request/response schemas)                     | ~50-80          |
| `src/sandbox/timeout.ts`  | Watchdog timer for worker execution timeout                                  | ~50-80          |

**Test files to rewrite:** 10 files, ~6,200 lines total (many will be simplified since
the new architecture is simpler than ivm).

### 4.3 Effort breakdown

| Task                                                                            | Estimate                |
|---------------------------------------------------------------------------------|-------------------------|
| **Design**                                                                      |                         |
| Design WorkerPool architecture + message protocol                               | 2 days                  |
| Prototype: verify Bun Worker isolation, `postMessage` perf, crash recovery      | 2 days                  |
| **Implementation**                                                              |                         |
| Implement WorkerPool (`pool.ts`) — pre-warming, acquire/release, lifecycle      | 3 days                  |
| Implement worker entry point (`worker.ts`) — message loop, compile, execute     | 4 days                  |
| Implement sandbox APIs in worker (fetch proxy, geolocation, getCredential, log) | 3 days                  |
| Build capability-restricted sandbox (frozen globals, whitelisted API injection) | 3 days                  |
| Build module bundler/resolver (pre-bundle user code + libraries for worker)     | 2 days                  |
| Implement execution timeout (watchdog timer + worker.terminate())               | 1 day                   |
| Implement worker-side transformation cache (LRU by versionId + libraryIds)      | 1 day                   |
| Rewrite `customTransformer-v1.js` → WorkerPool integration                      | 2 days                  |
| Remove ivm code paths, OpenFaaS paths, cleanup `customTransformer.js`           | 2 days                  |
| Remove `customTransformer-faas.js`, simplify `customTransformerFactory.js`      | 1 day                   |
| **Testing**                                                                     |                         |
| Rewrite ivm cache tests → WorkerPool tests                                      | 2 days                  |
| Rewrite user transformation tests (10 files, ~6,200 lines)                      | 5 days                  |
| Integration tests: transformEvent, transformBatch, libraries, credentials       | 2 days                  |
| Performance benchmarking: Bun Workers vs current ivm                            | 1 day                   |
| **Stabilization**                                                               |                         |
| Fix edge cases (error formatting, metadata handling)                            | 2 days                  |
| Soak testing on staging (24-48h)                                                | 2 days                  |
| Buffer for unknowns                                                             | 3 days                  |
| **Total**                                                                       | **~44 days (~9 weeks)** |

### 4.4 Risk factors

| Risk | Impact | Mitigation |
|------|--------|------------|
| Bun Worker `postMessage` has size limits or perf issues with large event batches | Medium | Benchmark early in prototype phase; fall back to `child_process` if needed |
| No per-worker memory limits in Bun | Medium | Kata VM cgroup limits as safety net; monitor RSS per worker |
| Bun Worker crash recovery edge cases | Medium | Extensive testing in prototype phase |
| `fetch()` inside Bun Worker may behave differently than in main thread | Low | Test all fetch patterns (proxy, timeout, redirect, streaming) |
| **Worker sandbox: user code has access to Worker globals** | **High** | See section 4.4.1 below |
| **ES module loading: `new Function()`/`eval()` can't handle `import`/`export`** | **High** | See section 4.4.2 below |
| **isolated-vm is V8-only — won't work during Bun migration phase** | **High** | See section 4.4.3 below |

#### 4.4.1 Worker sandbox (OpenAI reviewer P1)

A separate Bun Worker JS heap is **NOT a security boundary**. The current ivm implementation
(`src/util/ivmFactory.js`) only injects whitelisted APIs (`fetch`, `geolocation`,
`getCredential`, `log`) into an otherwise empty V8 context. User code cannot access Node.js
globals, `require()`, `process`, `fs`, etc.

Running untrusted transformation code directly inside a Bun Worker would expose the worker's
runtime globals and module system — this is a security regression.

**Mitigation: Build a capability-restricted sandbox inside each worker.**

The worker entry point (`worker.ts`) must:
1. Create a restricted execution environment where user code can only access whitelisted APIs.
2. Use a combination of:
   - **Frozen/sealed global proxy**: Intercept all global access, only expose whitelisted
     functions (`fetch`, `geolocation`, `getCredential`, `log`, `metadata`).
   - **Bun's `vm`-like API or `new Function()` with controlled scope**: Compile user code
     in a closure that receives only the whitelisted APIs as arguments.
   - **`Object.freeze(globalThis)` before user code runs**: Prevent modification of globals.
3. Strip or shadow dangerous APIs: `Bun.spawn`, `Bun.file`, `Bun.write`, `process`, `require`,
   dynamic `import()`.

**Additional effort: +3 days** (included in updated estimate below).

This is the same approach rudder-pytransformer uses with RestrictedPython — a language-level
sandbox inside the process, not relying on OS-level isolation alone.

#### 4.4.2 ES module loading (OpenAI reviewer P2)

The current ivm uses `isolate.compileModule()` with a custom resolver to handle user
transformations that `import` libraries. `new Function()` and `eval()` cannot handle
`import`/`export` syntax.

**Mitigation: Build a module bundler/resolver in the worker.**

Options:
1. **Pre-bundle user code + libraries** in the main process before sending to the worker:
   concatenate library code with user code, replacing `import` statements with inlined
   module references. This is what ivm already does conceptually (compiles each library
   as a module and resolves imports at instantiation time).
2. **Use Bun's native module resolution** inside the worker: write library code to temp
   files, let Bun's `import()` resolve them. Simpler but relies on filesystem (which may
   be read-only in Kata).
3. **Use a lightweight bundler** (e.g., Bun's built-in bundler via `Bun.build()`) to
   produce a single self-contained script from user code + libraries.

**Recommendation: Option 1 (pre-bundle in main process).** This keeps the worker simple
and avoids filesystem dependencies.

**Additional effort: +2 days** (included in updated estimate below).

#### 4.4.3 isolated-vm incompatibility with Bun (OpenAI reviewer P1)

`isolated-vm` is a native V8 addon. Bun uses JavaScriptCore, not V8. Therefore,
**isolated-vm will not work at all under Bun**. The Phase 1 estimate ("Bun migration,
ivm still works") was incorrect.

**Impact on sequencing:** A "Bun first, ivm later" sequential approach requires one of:

1. **Disable user transforms during Bun migration** — put user transforms behind a
   feature flag, route all user transform traffic to a parallel Node.js deployment
   until Phase 2 (Bun Workers) is complete. This keeps the migration safe but requires
   running two deployments temporarily.
2. **Do ivm removal first on Node.js (Option A)** — then migrate to Bun. This is the
   Option A path (~12 weeks sequential).
3. **Combined approach** — migrate to Bun and replace ivm with Bun Workers simultaneously.
   This is the only path that avoids running two deployments.

**Revised recommendation:** The combined approach (~9 weeks) is now more attractive since
the sequential "Bun first" path requires maintaining a Node.js sidecar deployment for
user transforms during Phase 1.

**Additional effort for sequential path: +1 week** for setting up and maintaining the
dual-deployment during Phase 1 (Node.js handles user transforms, Bun handles everything
else). Updated in sequencing table below.

### 4.5 Comparison: Option A (Node.js child_process) vs Option C (Bun Workers)

| Aspect                                       | Option A                                                         | Option C                                                                          |
|----------------------------------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| **Total effort**                             | ~31 days (ivm removal) + ~30 days (Bun migration) = **~61 days** | ~30 days (Bun migration) + ~44 days (ivm removal with Workers) = **~74 days**            |
| **If done in sequence**                      | 12 weeks                                                         | 15 weeks (+ ~1 wk dual-deployment overhead, see 4.4.3)                                   |
| **If Bun migration first, then ivm removal** | Bun (6 wks) → child_process pool (6 wks) = 12 wks                | Bun (7 wks, needs Node.js sidecar for user transforms) → Bun Workers (9 wks) = 16 wks    |
| **If ivm removal first, then Bun**           | child_process pool (6 wks) → Bun (6 wks) = 12 wks                | N/A (Option C requires Bun)                                                              |
| **Combined (do both at once)**               | Not applicable                                                   | **~50 days (~10 wks)** — saves dual-deployment overhead, higher risk                     |
| **IPC performance**                          | JSON serialization over IPC channel                              | Structured clone via `postMessage` (faster)                                       |
| **Startup per worker**                       | ~30-50ms (process fork)                                          | ~1-5ms (thread)                                                                   |
| **Memory per worker**                        | Higher (full V8 + Node.js per process)                           | Lower (shared Bun runtime, separate JS heap)                                      |
| **Memory limits**                            | Yes (`--max-old-space-size`)                                     | No (Bun limitation) — rely on Kata cgroup                                         |
| **Battle-tested**                            | Very (Node.js child_process is decades old)                      | Less (Bun Workers are newer)                                                      |
| **Long-term maintenance**                    | Two patterns (child_process pool + Bun runtime)                  | One pattern (native Bun Workers)                                                  |

### 4.6 Recommended sequencing

**Important: `isolated-vm` is a V8 native addon and will NOT work under Bun (JavaScriptCore).**
This means a sequential "Bun first, ivm later" approach requires running a Node.js sidecar
deployment for user transforms during the Bun migration phase.

| Phase | Duration | Description |
|-------|----------|-------------|
| **Sequential: Phase 1 (Bun migration)** | 7 weeks | Migrate rudder-transformer to Bun. User transforms routed to a parallel Node.js deployment (feature flag). Adds ~1 week for dual-deployment setup/maintenance. |
| **Sequential: Phase 2 (Bun Workers)** | 9 weeks | Build WorkerPool with sandbox + module bundler. Remove ivm and Node.js sidecar. |
| **Total sequential** | **16 weeks** | |
| **Combined (recommended)** | **~10 weeks** | Migrate to Bun and build Bun WorkerPool simultaneously. No Node.js sidecar needed. Higher risk but avoids dual-deployment complexity. |

**Recommendation: Combined approach.** The sequential path requires maintaining a
dual-deployment (Bun for everything except user transforms, Node.js for user transforms)
which adds operational complexity and a ~6 week overhead compared to the combined approach.
The combined approach is riskier (harder to debug — is it Bun or the Worker?) but avoids
this overhead.

**De-risk the combined approach with a 2-day prototype (included in estimate):**
Before committing, spend 2 days building a minimal Bun Worker prototype that:
1. Receives user code via `postMessage`
2. Executes it in a capability-restricted sandbox
3. Handles `import`/`export` via pre-bundled code
4. Returns results

If the prototype fails, fall back to Option A (Node.js child_process, 6 wks) + Bun
migration later (6 wks) = 12 weeks total on the safer path.

---

## Summary

| Work item                               | Estimate              | Optional? | Dependencies                      |
|-----------------------------------------|-----------------------|-----------|-----------------------------------|
| **1a Routing**                          | 33 days (~6.5 weeks)  | No        | None                              |
| **Scale to zero**                       | 18 days (~3.5 weeks)  | Yes       | 1a routing complete               |
| **Bun + ivm removal combined (Opt C)** | 50 days (~10 weeks)   | No        | None (self-contained)             |
| **Bun + ivm removal sequential**       | 80 days (~16 weeks)   | No        | Requires Node.js sidecar in Ph. 1 |

### Sequencing options

```
Option 1 — Combined Bun + ivm, sequential with routing (1 engineer, ~16.5 weeks):
  1a Routing (6.5 wks) → Bun + ivm combined (10 wks)

Option 2 — Parallel routing + combined Bun+ivm (2 engineers, ~10 weeks):
  Engineer A: 1a Routing (6.5 wks) ──────────────────────────────┐
  Engineer B: Bun + ivm combined (10 wks) ←── merge after both done
  Critical path: 10 weeks

Option 3 — Parallel + scale to zero (2 engineers, ~13.5 weeks):
  Engineer A: 1a Routing (6.5 wks) → Scale to zero (3.5 wks) → integration (2 wks)
  Engineer B: Bun + ivm combined (10 wks) → integration (2 wks)
  Critical path: 12 weeks

Option 4 — Fallback if Bun Worker prototype fails (2 engineers, ~12.5 weeks):
  Engineer A: 1a Routing (6.5 wks) ──────────────────────────────┐
  Engineer B: ivm removal Node.js child_process (6 wks) → Bun migration (6 wks)
  Critical path: 12 weeks
```

### OpenAI Reviewer Feedback

Reviewed by OpenAI Codex (gpt-5.4). Three issues were identified and addressed:

**[P1] isolated-vm won't survive the Bun phase:** `isolated-vm` is a V8 addon and won't
load under Bun (JavaScriptCore). The original "Bun first, ivm later" sequential estimate
was understated — it requires a Node.js sidecar for user transforms during Phase 1.
Revised: sequential path increased from 14 to 16 weeks. Combined approach recommended
to avoid dual-deployment overhead.

**[P1] Worker sandbox needed:** A separate Bun Worker heap is not a security boundary.
The current ivm whitelists only `fetch`, `geolocation`, `getCredential`, `log`. Running
untrusted code directly in a Worker exposes runtime globals. Added +3 days for building
a capability-restricted sandbox (frozen globals, whitelisted API injection).

**[P2] ES module loading:** `new Function()`/`eval()` can't handle `import`/`export`.
Current ivm uses `compileModule()` with custom resolvers. Added +2 days for building a
module pre-bundler that resolves library imports before sending code to the Worker.
