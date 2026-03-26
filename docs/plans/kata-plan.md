# Kata + Firecracker Plan for rudder-transformer

## Context

### Current Architecture

```
                              ┌──JS──▶ rudder-transformer (isolated-vm, single shared deployment)
rudder-server ──check lang──▶│
                              └──Py──▶ rudder-pytransformer (RestrictedPython + ProcessPool, single shared deployment)
```

- **rudder-transformer**: Node.js service running all tenants' JS transformations in a single deployment.
  Isolation is provided by `isolated-vm` (V8 isolates with 128MB memory limit per isolate).
- **rudder-pytransformer**: Python service running all tenants' Python transformations in a single deployment.
  Isolation is provided by a `ProcessPool` of sandboxed subprocesses using RestrictedPython.
- **isolated-vm** is in maintenance mode and is the main motivator for this migration.

### Target Architecture

```
rudder-server
    │
    ├──JS──▶ [routing] ──▶ rudder-transformer (tenant A pod, Kata+Firecracker)
    │                  ──▶ rudder-transformer (tenant B pod, Kata+Firecracker)
    │                  ──▶ ...
    │
    └──Py──▶ [routing] ──▶ rudder-pytransformer (tenant A pod, Kata+Firecracker)
                       ──▶ rudder-pytransformer (tenant B pod, Kata+Firecracker)
                       ──▶ ...
```

One deployment per tenant/workspace, with Kata Containers + Firecracker providing VM-level
isolation between tenants. `isolated-vm` is removed from rudder-transformer.

---

## Issue 1: Tenant Routing

rudder-server already knows the transformation language and workspaceId, but today it hits a
single shared deployment URL. With one deployment per tenant, it needs to resolve the correct
per-tenant endpoint.

### Option 1: Client-side routing (rudder-server resolves directly)

rudder-server constructs the target URL itself, with no intermediary.

#### 1a: Predictable K8s DNS names

Each tenant deployment gets a K8s Service with a deterministic name:

```
jstransformer-{workspaceId}.transformers.svc.cluster.local
pytransformer-{workspaceId}.transformers.svc.cluster.local
```

rudder-server builds the URL from the workspaceId:

```go
func transformerURL(workspaceId, language string) string {
    prefix := "jstransformer"
    if strings.HasPrefix(language, "python") {
        prefix = "pytransformer"
    }
    return fmt.Sprintf("http://%s-%s.transformers.svc.cluster.local:8080", prefix, strings.ToLower(workspaceId))
}
```

| Pros                                       | Cons                                                                            |
|--------------------------------------------|---------------------------------------------------------------------------------|
| Zero extra network hops                    | Tight coupling: naming convention must be shared between provisioner and client |
| No additional infrastructure               | K8s DNS label limits (63 chars); workspaceId must be DNS-safe or hashed         |
| Sub-millisecond resolution (K8s DNS cache) | No centralized routing logic for overrides / failover                           |
| Simple to implement                        | Every rudder-server instance needs to "know" the convention                     |

#### 1b: Config backend lookup table

A mapping `workspaceId → transformer URL` stored in the config backend (or a dedicated
discovery service), fetched and cached by rudder-server.

```go
// In rudder-server, cached with TTL
url, err := configBackend.GetTransformerURL(workspaceId, language)
```

| Pros                                                                           | Cons                                            |
|--------------------------------------------------------------------------------|-------------------------------------------------|
| Fully decoupled: routing logic is centralized                                  | Extra dependency on config backend availability |
| Supports complex strategies (shared pools for small tenants, custom overrides) | Cache invalidation lag when deployments change  |
| Can encode failover / blue-green URLs                                          | Slightly more implementation effort             |

#### 1c: Consistent hashing

Hash workspaceId to a ring of deployments (like a hash ring / rendezvous hashing).

| Pros               | Cons                                                                                     |
|--------------------|------------------------------------------------------------------------------------------|
| No external lookup | Doesn't naturally fit "one deployment per tenant" — fits "N tenants share M pods" better |
| Deterministic      | Rebalancing on scale events is complex                                                   |
|                    | Poor fit for this use case since tenant count == deployment count                        |

**Verdict on 1c**: Not a good fit. This is better suited for shared-nothing pools, not dedicated
per-tenant deployments.

### Option 2: Gateway service (dedicated router)

A lightweight service sits between rudder-server and the per-tenant deployments.

#### 2a: Custom gateway

A purpose-built Go/Rust service that:

1. Receives transformation requests from rudder-server
2. Extracts workspaceId from the request (header or body)
3. Looks up the target pod (from a local cache of workspace→endpoint mappings)
4. Proxies the request

| Pros                                                | Cons                                           |
|-----------------------------------------------------|------------------------------------------------|
| Full control over routing logic                     | Another service to build, deploy, and maintain |
| Can do health checking, circuit breaking, retries   | Single point of failure (needs HA)             |
| rudder-server config stays static (one URL)         | Extra network hop (~1-3ms per request)         |
| Can handle tenant onboarding/offboarding gracefully | Operational burden                             |

#### 2b: K8s Gateway API / Ingress with header-based routing

Use the standard K8s Gateway API (or nginx ingress) with routing rules based on a
`X-Workspace-Id` header:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: js-transformer-route-tenant-abc
spec:
  parentRefs:
    - name: transformer-gateway
  rules:
    - matches:
        - headers:
            - name: X-Workspace-Id
              value: "abc123"
            - name: X-Transform-Language
              value: "javascript"
      backendRefs:
        - name: jstransformer-abc123
          port: 8080
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: py-transformer-route-tenant-abc
spec:
  parentRefs:
    - name: transformer-gateway
  rules:
    - matches:
        - headers:
            - name: X-Workspace-Id
              value: "abc123"
            - name: X-Transform-Language
              value: "python"
      backendRefs:
        - name: pytransformer-abc123
          port: 8080
```

**Documentation:** https://gateway-api.sigs.k8s.io/api-types/httproute/#rules

**Note:** A shared gateway must match on both workspace ID and language to avoid
misrouting — a workspace can have both JS and Python transformations targeting
different backends.

| Pros                                              | Cons                                                                 |
|---------------------------------------------------|----------------------------------------------------------------------|
| Standard K8s pattern, well-tested, no custom code | Configuration management: need to create/update HTTPRoute per tenant |
| Rich ecosystem (envoy, nginx, traefik)            | Config reload latency on tenant changes                              |
| Built-in load balancing and health checks         | Potentially thousands of route rules at scale                        |
| rudder-server just adds a header                  | Gateway controller must support this scale                           |

**Scaling analysis (gateway-api-bench, 2025-2026 data):**

Most gateway controllers struggle at the thousands-of-routes scale. The `gateway-api-bench`
project (by an Istio maintainer) is the most comprehensive public benchmark, testing up to
5,000-40,000 routes:

| Controller    | Max tested routes    | Route propagation (3K) | Errors under changes | Key limit                                           |
|---------------|----------------------|------------------------|----------------------|-----------------------------------------------------|
| Istio         | 40,000 (ListenerSet) | 120-300ms              | None                 | Memory scales linearly (~1-2 GB at 5K)              |
| Envoy Gateway | 5,000                | ~600ms (2s under load) | 14,808 x 503         | 82x CPU overhead vs best; GC pressure               |
| NGINX Ingress | 40,000 domains       | Timed out (>5 min)     | 500 errors           | Full reload per change; OOM spikes to 22 GB         |
| Traefik       | 5,000 (tested)       | 2-3s per route         | None                 | 180s setup for 1K routes; OOM at 20K                |
| Cilium        | ~1,500 (hard limit)  | Fast at low scale      | Traffic drops        | 1.5 MB etcd object limit; **silent failure** beyond |

Main bottlenecks:

1. **Control plane config reload**: NGINX does full process reloads per change. Envoy-based
   controllers use xDS (dynamic), but State-of-the-World pushes send the entire config on any
   change. Only Delta xDS (Istio) mitigates this.
2. **etcd storage**: Each HTTPRoute is an etcd object. Cilium aggregates into one
   CiliumEnvoyConfig and hits the 1.5 MB etcd limit at ~1,500 routes, failing silently.
3. **Header-based routing specifically**: Envoy's default route matching scans routes **linearly**
   for arbitrary headers (O(N)), while path-based routing can use tries/hashmaps (O(log N) or
   O(1)). A newer Generic Matching API supports sublinear header matching, but it's not the
   default in most Gateway API controllers yet.

**Verdict on 2b**: Only Istio has demonstrated reliable operation at thousands of header-based
routes with zero errors under traffic — but Istio brings heavy operational overhead (service
mesh). The other controllers either fail, produce errors, or have severe performance degradation
at our target scale (one route per tenant = potentially thousands of routes). This is the
strongest argument for Option 1b (config backend lookup) over 2b.

Sources: [gateway-api-bench](https://github.com/howardjohn/gateway-api-bench),
[Envoy AI Gateway benchmark](https://aigateway.envoyproxy.io/blog/benchmarking-control-plane-scaling/),
[Istio scalability docs](https://istio.io/latest/docs/ops/deployment/performance-and-scalability/),
[NGINX Ingress issues #6844, #3907](https://github.com/kubernetes/ingress-nginx/issues/6844),
[Cilium issue #39974](https://github.com/cilium/cilium/issues/39974).

#### 2c: Service mesh (Istio / Envoy sidecar)

Use Istio VirtualService + DestinationRule for header-based routing at the mesh level.

| Pros                                                    | Cons                                 |
|---------------------------------------------------------|--------------------------------------|
| Rich traffic management (canary, fault injection, mTLS) | Heavy operational overhead           |
| Observability built-in (distributed tracing)            | Significant learning curve           |
| No custom gateway code                                  | Resource overhead (sidecars per pod) |
|                                                         | Overkill for this use case           |

**Verdict on 2c**: The operational overhead of a full service mesh is disproportionate to the
routing problem we're solving. Consider only if Istio is already adopted org-wide.

### Option 3: rudderstack-operator provisioning (for any routing option)

Regardless of routing strategy, a provisioner must create per-workspace Deployments + Services.
The `rudderstack-operator` already exists and manages transformer/pytransformer deployments.

See "Provisioner: rudderstack-operator" section below for implementation details.

### Recommendation

**Primary: Option 1a (Predictable K8s DNS names)**

Reasoning:

- **Zero SPOF** — K8s DNS is already there, no extra service dependency.
- **Zero extra hops** — rudder-server constructs the URL locally from the workspaceId.
- **Zero cache invalidation** — the name is derived deterministically, not fetched.
- **Simplest to implement** — a single function in rudder-server, no new infrastructure.
- **rudderstack-operator already creates Services with predictable names** — the Helm
  charts for transformer/pytransformer use template helpers that produce deterministic
  service names. Extending this to per-workspace naming is straightforward.

**DNS safety:** Verified with a real workspaceId (`2kKqx3JR4pBSAbpcp8EJ4xQswpk`, 27 chars).
The longest service name would be `pytransformer-2kkqx3jr4pbsabpcp8ej4xqswpk` (42 chars),
well within the K8s DNS label limit of 63. WorkspaceIds are alphanumeric, so no special
characters need escaping.

**Case sensitivity:** DNS labels are case-insensitive (RFC 1035), but workspaceIds contain
mixed case (e.g., `2kKqx3JR4p...`). The service name must be lowercased:

```go
serviceName := fmt.Sprintf("%s-%s", prefix, strings.ToLower(workspaceId))
```

This is safe as long as no two workspaceIds differ only by case (which would be unusual
for identifiers). If this invariant doesn't hold, use a deterministic hash instead.

**Why NOT 1b (config backend lookup):**

- Config backend becomes a SPOF — if it's down, routing breaks entirely.
- Adds an extra hop (or at minimum, a cache layer with invalidation complexity).
- The flexibility it provides (shared pools, custom overrides, blue-green) is speculative —
  the design is "one deployment per tenant with a predictable name." If that invariant holds,
  1b's flexibility is unnecessary complexity.
- If we later need override capability, we can add it as an opt-in layer on top of 1a
  (e.g., rudder-server checks a config backend override first, falls back to DNS convention).

**Mirror traffic:** rudder-server currently uses static `USER_TRANSFORM_MIRROR_URL` /
`PYTHON_TRANSFORM_MIRROR_URL` for A/B validation. With 1a, mirror traffic works the same
way — rudder-server constructs the mirror URL from the workspaceId using a mirror-specific
naming convention or namespace:

```go
// Production
fmt.Sprintf("http://jstransformer-%s.transformers.svc.cluster.local:8080", workspaceId)
// Mirror
fmt.Sprintf("http://jstransformer-%s.transformers-mirror.svc.cluster.local:8080", workspaceId)
```

This is simpler than maintaining a parallel config backend mapping — just deploy the
mirror environment in a separate namespace.

**This solution applies identically to both rudder-transformer and rudder-pytransformer.**

### Provisioner: rudderstack-operator

The existing `rudderstack-operator` (at `../rudderstack-operator`) already manages
transformer and pytransformer deployments via Helm sub-charts under
`helm-charts/rudderstack-aux/charts/{transformer,pytransformer}/`. It also already
has workspace IDs in its CRD spec (`spec.global.workspaceDetails`).

**What exists today:**

- Helm charts for transformer and pytransformer (Deployment + Service + HPA + probes)
- Predictable service naming via Helm template helpers
- Workspace iteration in the reconciler (currently only for metrics emission)
- Controller-runtime based Go operator with state machine reconciliation

**Changes needed:**

1. **Helm chart loop** — Modify the transformer/pytransformer charts to iterate over a
   workspace list and create one Deployment + Service per workspace:
   ```
   transformer-{workspaceId}     → Deployment + Service
   pytransformer-{workspaceId}   → Deployment + Service
   ```
   Each pod spec gets `runtimeClassName: kata` for Firecracker isolation.

2. **CRD spec extension** — Add per-workspace transformer config under the existing
   `spec.global.workspaceDetails` map (replicas, resource limits), or use shared defaults
   with per-workspace overrides.

3. **Reconciler update** — Extend `cluster-states.go` to pass the workspace list into Helm
   values so the chart can iterate over it.

4. **Workspace lifecycle** — Handle additions/removals: when a workspace disappears from
   the spec, the corresponding Deployment + Service should be garbage-collected.

**Complexity: moderate (~4-5/10)** — the building blocks exist, it's mainly Helm templating
and minor reconciler changes. No new CRDs, no new controllers.

**Scaling concern:** Helm releases are stored in etcd (1 MB default limit per Secret). With
hundreds of workspaces generating hundreds of Deployments+Services in a single
`rudderstack-aux` release, this limit may be hit. Mitigations:

- Increase etcd max request size (`--max-request-bytes`)
- Split into per-workspace Helm releases (more complex, but scales better)
- Use the operator to create raw K8s objects directly (bypass Helm for per-workspace
  resources), keeping Helm only for shared infrastructure

### Workspace deletion and stale deployments

rudder-server fetches transformation configs from the config backend. When a workspace is
deleted, the config backend stops returning transformations for it, so rudder-server
naturally stops routing traffic — no active verification needed.

The only edge case is **in-flight events during the deletion window**: rudder-server has
already resolved the URL but the deployment is being torn down. For these, rudder-server
gets a DNS resolution error or connection refused, which it already handles with retries
and dead-lettering.

The operator should add a **grace period** — keep the deployment alive for a configurable
window (e.g., 5 minutes) after a workspace is removed from the spec, to drain in-flight
requests before garbage-collecting the Deployment + Service.

### Scale to zero and back up

With one deployment per tenant, idle workspaces waste resources. We need a way to scale
inactive deployments to 0 replicas and bring them back when traffic arrives.

Standard HPA cannot scale below `minReplicas=1`. Options:

| Approach                      | Scale to 0                       | Scale back up                                       | Extra infra                       | Cold start                       |
|-------------------------------|----------------------------------|-----------------------------------------------------|-----------------------------------|----------------------------------|
| **KEDA + HTTP Add-on**        | Yes, based on HTTP request count | Interceptor proxy buffers requests while pod starts | KEDA operator + interceptor proxy | ~5-15s (pod startup + Kata boot) |
| **Knative Serving**           | Yes, built-in                    | Activator component buffers requests                | Knative stack (heavy)             | ~5-15s                           |
| **KEDA + Prometheus metrics** | Yes, based on request rate       | Needs a trigger mechanism (see below)               | KEDA operator                     | ~5-15s + trigger delay           |
| **Custom operator logic**     | Yes, operator watches idle time  | rudder-server retry + operator wake-up endpoint     | Wake-up endpoint                  | ~5-15s + retry delay             |

#### Recommended: Custom operator logic + rudder-server wake-up

This keeps the happy path direct (no proxy hop) and only adds complexity during cold starts:

**Scale down:**

- The operator (or KEDA with Prometheus) watches per-workspace request rate metrics
  emitted by rudder-server or the transformer pods themselves.
- When a workspace has zero traffic for N minutes (configurable, e.g., 30 min), the
  operator scales the Deployment to 0 replicas.
- The Service remains in place (so the DNS name still resolves, but there are no endpoints).

**Scale up:**

- rudder-server sends a request to the per-workspace URL.
- With 0 replicas, the connection is refused (no endpoints behind the Service).
- rudder-server detects this and calls a lightweight **wake-up endpoint** on the operator:
  ```
  POST /wake/{workspaceId}?language=javascript
  ```
- The operator sets `replicas=1` on the Deployment.
- rudder-server retries with backoff until the pod is ready.
- Subsequent requests go directly to the pod (no proxy in the path).

**Cold start budget:** Kata+Firecracker VMs boot in ~125ms. The main latency is container
image pull (mitigated by pre-pulling / image caching on nodes) and application startup.
Expect ~5-15s total cold start. rudder-server's existing retry logic (configurable max
retry of 30 with backoff) can absorb this.

**Alternative — KEDA HTTP Add-on:** If the cold start UX is unacceptable (failed first
requests, even with retries), the KEDA HTTP Add-on provides an interceptor proxy that
buffers requests during scale-from-zero. The trade-off is that **all** traffic flows
through the interceptor (not just cold starts), adding a hop on the happy path. Consider
this if retry-based wake-up proves too slow or unreliable.

---

## Issue 2: Removing isolated-vm

### Sub-question 1: Intra-tenant isolation (between transformations of the same workspace)

With Kata+Firecracker providing inter-tenant isolation (one pod per tenant), we still need
isolation between multiple transformations of the same tenant running in the same pod.

The isolation requirements within a tenant are:

1. **State isolation**: One transformation must not read/modify another's data
2. **Fault isolation**: One transformation crashing must not take down the process or affect others
3. **Resource isolation**: One transformation must not consume all CPU/memory

#### Option A: Child Process Pool (recommended)

Mirror rudder-pytransformer's proven architecture. Pool of child Node.js processes, each
executing one transformation at a time.

```
┌─ Main Process (Express/Fastify API) ─────────────────────────┐
│                                                               │
│  POST /customTransform                                        │
│    → group events by transformation                           │
│    → for each transformation:                                 │
│        → acquire worker from ProcessPool                      │
│        → send {code, events, libraries} via IPC               │
│        → receive {results} via IPC                            │
│        → release worker back to pool                          │
│                                                               │
│  ProcessPool                                                  │
│    ├─ Worker 1 (child_process.fork)  ← executing transform A  │
│    ├─ Worker 2 (child_process.fork)  ← idle                   │
│    ├─ Worker 3 (child_process.fork)  ← executing transform B  │
│    └─ Worker 4 (child_process.fork)  ← idle                   │
└───────────────────────────────────────────────────────────────┘
```

Each worker process:

- Receives transformation code + events via IPC (Node.js built-in `child_process` IPC channel
  or JSON over stdin/stdout)
- Compiles and caches the transformation (keyed by versionId + libraryIds)
- Executes the transformation with a CPU timeout (via `setTimeout` + `process.kill(SIGALRM)`)
- Returns results via IPC
- Is recycled after a max lifetime or max number of executions

**Sandboxing within the worker:**

- Since Kata+Firecracker provides the security boundary, we don't need a full VM-level sandbox.
- Use Node.js `vm.createContext()` for basic state isolation (separate global scope).
- The `vm` module is NOT a security sandbox, but within a single tenant's Kata VM, this is
  acceptable — the security boundary is the VM, not the process.
- Alternatively, use `vm` module with `vm.Script` or `vm.Module` for ES module support.

**Resource limits:**

- Memory: Set `--max-old-space-size` per worker process (e.g., 128MB, matching current ivm limit)
- CPU: Use `SIGALRM` or a watchdog timer to kill workers exceeding their time budget
- File descriptors: `ulimit` or `RLIMIT_NOFILE` in worker setup

| Pros                                                 | Cons                                                 |
|------------------------------------------------------|------------------------------------------------------|
| Proven pattern (rudder-pytransformer uses this)      | Higher per-transformation overhead than ivm isolates |
| True process isolation (separate address spaces)     | IPC serialization cost                               |
| OS-level resource limits                             | Slightly more memory per worker than an isolate      |
| Clean crash handling (worker dies, pool replaces it) |                                                      |
| No external dependency (uses Node.js built-ins)      |                                                      |

#### Option B: Worker Threads + vm module

Use `worker_threads` for concurrency with `vm.createContext()` for sandboxing.

| Pros                                             | Cons                                                      |
|--------------------------------------------------|-----------------------------------------------------------|
| Lower overhead than child processes              | Shared process memory (a crash can take down all threads) |
| Faster IPC (SharedArrayBuffer, structured clone) | `vm` module is not a security sandbox                     |
| Less memory per worker                           | Resource limits harder to enforce per-thread              |
|                                                  | V8 heap is shared (one OOM kills all threads)             |

**Verdict**: Worker threads trade fault isolation for performance. Since the whole point is to
replace isolated-vm with something robust, sharing a process defeats the purpose. Not recommended.

#### Option C: Bun Workers (Web Workers)

If migrating to Bun (see sub-question 3), use Bun's Web Worker implementation.

| Pros                                            | Cons                                          |
|-------------------------------------------------|-----------------------------------------------|
| True isolation (separate V8/JSC instances)      | Ties the solution to Bun runtime              |
| Modern Web Worker API                           | Bun's worker implementation is still maturing |
| Better performance than Node.js child processes | Less battle-tested than Node.js child_process |

Since Bun migration is planned (see sub-question 3), this is the recommended approach.
See [kata-estimations.md](kata-estimations.md) for detailed effort breakdown.

#### Recommendation: Option C (Bun Workers)

Since we are migrating to Bun, using Bun's native Web Workers is the natural choice.
It avoids building an intermediate Node.js child process pool that would be thrown away
after the Bun migration. Bun Workers provide true isolation (separate JavaScriptCore
instances), fast IPC via `postMessage` (structured clone), and ~1-5ms startup per worker
(vs ~30-50ms for `child_process.fork()`).

The main trade-off vs Option A is that Bun Workers don't support per-worker memory limits.
This is acceptable because each tenant runs in a Kata VM with cgroup memory limits — an
OOM only affects that tenant's pod.

Option A remains the fallback if Bun Worker stability proves insufficient during prototyping.

### Sub-question 2: Effort estimation to remove isolated-vm

#### Files requiring changes

**Core files to rewrite (high effort):**

| File                                      | Current role                                          | Change needed                                        |
|-------------------------------------------|-------------------------------------------------------|------------------------------------------------------|
| `src/util/ivmFactory.js`                  | Creates V8 isolates, compiles user code, injects APIs | Replace with ProcessPool + worker script             |
| `src/util/customTransformer-v1.js`        | Orchestrates V1 transformation execution via ivm      | Rewrite to use ProcessPool IPC                       |
| `src/util/customTransformer.js`           | Entry point, delegates to V0/V1/FaaS handlers         | Simplify: remove V0/FaaS paths, route to ProcessPool |
| `src/util/ivmCache/manager.js`            | LRU cache of ivm isolates                             | Replace with worker-side transformation cache        |
| `src/util/ivmCache/strategies/isolate.js` | Cache strategy for isolates                           | Remove (caching moves to worker)                     |
| `src/util/ivmCache/contextReset.js`       | Resets ivm context on cache hit                       | Remove                                               |
| `src/util/ivmCache/index.js`              | LRU cache implementation                              | Keep for worker-side caching or replace              |

**New files to create:**

| File                      | Purpose                                                       |
|---------------------------|---------------------------------------------------------------|
| `src/sandbox/pool.js`     | ProcessPool manager (pre-warming, acquire/release, lifecycle) |
| `src/sandbox/worker.js`   | Child process entry point (IPC loop, compile, execute, cache) |
| `src/sandbox/protocol.js` | IPC message types (request/response schemas)                  |

**Files requiring moderate changes:**

| File                                   | Change needed                                               |
|----------------------------------------|-------------------------------------------------------------|
| `src/util/customTransformerFactory.js` | Simplify language dispatch (Python path removal if desired) |
| `src/services/userTransform.ts`        | Minimal changes (interface stays the same)                  |
| `src/controllers/userTransform.ts`     | Minimal changes                                             |
| `src/routes/userTransform.ts`          | No changes (API contract unchanged)                         |
| `package.json`                         | Remove `isolated-vm` dependency                             |

**Test files to update:**

All tests in `test/` that reference ivm, isolate, or mock isolated-vm will need updates.
Based on grep, approximately 5-10 test files.

#### Effort breakdown

| Task                                                                      | Estimate                                        |
|---------------------------------------------------------------------------|-------------------------------------------------|
| Design ProcessPool architecture + IPC protocol                            | 3 days                                          |
| Implement ProcessPool (`pool.js`)                                         | 4 days                                          |
| Implement worker process (`worker.js`)                                    | 4 days                                          |
| Implement sandbox APIs in worker (fetch, geolocation, getCredential, log) | 3 days                                          |
| Rewrite `customTransformer-v1.js` to use ProcessPool                      | 3 days                                          |
| Remove ivm code paths + cleanup `customTransformer.js`                    | 2 days                                          |
| Update/rewrite tests                                                      | 4 days                                          |
| Integration testing + performance benchmarking                            | 3 days                                          |
| Documentation + code review                                               | 2 days                                          |
| Buffer for unknowns                                                       | 3 days                                          |
| **Total**                                                                 | **~31 days (~6 weeks) for one senior engineer** |

**Risk factors that could increase the estimate:**

- `fetch` / `fetchV2` proxying: ivm currently uses `ivm.Reference` callbacks for async operations.
  In a child process model, these become IPC round-trips. Getting the async IPC right (especially
  for streaming or concurrent fetches) adds complexity.
- ES module support: ivm uses `isolate.compileModule()` + custom resolver. Replicating this with
  `vm.Module` (still experimental in Node.js) may require extra work.
- Edge cases in the transformation wrapper (`transformEvent` vs `transformBatch`, metadata
  handling, error formatting) that are currently tightly coupled to ivm APIs.

### Sub-question 3: Effort to migrate from Node.js to Bun

#### Compatibility assessment

**Known risks:**

- **Native addons**: Any dependency using N-API or node-gyp won't work in Bun without a Bun-native
  equivalent. However, if we remove `isolated-vm`, the main native addon blocker is gone.
- **Node.js-specific APIs**: `vm` module behavior may differ. `child_process` is supported but
  may have edge cases.
- **npm ecosystem**: Most pure-JS packages work. Packages relying on Node.js internals may not.
- **Test framework**: Jest has partial Bun support; may need migration to `bun:test`.

**Benefits of Bun:**

- Significantly faster startup time (~5-10x)
- Built-in TypeScript support (no transpilation step)
- Faster `fetch()` implementation
- Built-in SQLite, test runner, bundler
- Web Worker support with proper isolation (JavaScriptCore-based)
- Lower memory footprint

#### Effort breakdown

| Task                                                              | Estimate                                             |
|-------------------------------------------------------------------|------------------------------------------------------|
| Dependency audit (verify all ~200+ packages work with Bun)        | 3 days                                               |
| Fix/replace incompatible dependencies                             | 3-5 days                                             |
| Migrate test suite (Jest → bun:test or verify Jest compatibility) | 5 days                                               |
| Update Dockerfile (Node.js → Bun base image)                      | 1 day                                                |
| Update CI/CD pipelines                                            | 2 days                                               |
| Fix runtime edge cases discovered in testing                      | 5-7 days                                             |
| Performance benchmarking (Bun vs Node.js)                         | 2 days                                               |
| Staging/canary deployment + soak testing                          | 5 days                                               |
| **Total**                                                         | **~26-30 days (~5-6 weeks) for one senior engineer** |

#### Recommendation

**Migrate to Bun first, then remove ivm using Bun Workers (Option C).**

Reasoning:

1. Bun migration is planned — it's not optional.
2. Sequential approach (Bun first, then ivm removal) is safer: each change can be
   validated independently.
3. Skips building a Node.js child process pool that would be discarded after Bun migration.
4. If timeline pressure demands it, both can be combined into ~9 weeks (vs ~14 weeks
   sequential) at the cost of harder debugging.

See [kata-estimations.md](kata-estimations.md) for detailed sequencing options.

---

## Summary

| Decision                   | Recommendation                                                             |
|----------------------------|----------------------------------------------------------------------------|
| **Routing**                | Predictable K8s DNS names (Option 1a), provisioned by rudderstack-operator |
| **Intra-tenant isolation** | Bun Workers (Option C) with capability-restricted sandbox                  |
| **Bun + ivm removal**      | ~10 weeks combined for one senior engineer                                 |
| **1a Routing**             | ~6.5 weeks for one senior engineer                                         |
| **Scale to zero**          | ~3.5 weeks (optional)                                                      |
| **Sequencing**             | Combined Bun migration + ivm removal with Bun Workers                      |
| **Total effort**           | ~10 weeks with 2 engineers in parallel (routing + Bun/ivm)                 |

See [kata-estimations.md](kata-estimations.md) for full breakdown, risk factors, and
parallelization options. Note: `isolated-vm` is V8-only and incompatible with Bun, so
the combined approach avoids the need for a temporary Node.js sidecar deployment.

---

## OpenAI Reviewer Feedback

Reviewed by OpenAI Codex (gpt-5.4). Three issues were identified in the original draft:

### [P2] DNS fallback conflicts with non-deterministic workspace mappings (RESOLVED)

**Issue:** The original draft recommended DNS convention (Option 1a) as fallback for config
backend (Option 1b). But if the config backend returns non-deterministic URLs (shared pools,
blue-green), falling back to DNS convention would route to a non-existent service.

**Resolution:** After further analysis, the plan was revised to recommend 1a as primary (not
as a fallback for 1b). Since the design is "one deployment per tenant with a predictable
name," the mapping is always deterministic and the conflict doesn't apply. 1b was dropped
because it introduces a SPOF and unnecessary complexity for this use case.

### [P3] Gateway API example missing language in match key (FIXED)

**Issue:** The K8s Gateway API example only matched on `X-Workspace-Id`, which is ambiguous
since a workspace can have both JS and Python deployments. Python requests for the same
workspace would be misrouted.

**Resolution:** Updated the HTTPRoute example to match on both `X-Workspace-Id` and
`X-Transform-Language` headers, with separate routes for JS and Python backends.

### [P2] Mirror traffic routing not addressed (FIXED)

**Issue:** rudder-server uses static `USER_TRANSFORM_MIRROR_URL` / `PYTHON_TRANSFORM_MIRROR_URL`
for A/B validation. With per-workspace routing, mirror requests would still hit one shared
endpoint, not exercising the per-tenant architecture being proposed.

**Resolution:** Added mirror traffic section to the recommendation. With 1a, mirror traffic
uses the same deterministic naming convention in a separate K8s namespace
(`transformers-mirror`), requiring no config backend mapping.
