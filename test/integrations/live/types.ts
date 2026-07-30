import { z } from 'zod';

type AuthType = 'apiKey' | 'oauth' | 'basic' | 'serviceAccount' | 'custom';
type AccountDefinition = { type: string; category: string; name: string };

// Resolved credentials for one destination.
type LiveSecret = {
  authType: AuthType;
  config: Record<string, unknown>; // merged into destination.Config
  secret?: Record<string, string>; // merged into metadata.secret
  resourceIds?: Record<string, string>; // account-scoped: listId, pixelId, measurementId, etc.
  oauthRefresh?: {
    // if authType is oauth, sent to rudder-auth /auth/v1/refresh
    refreshToken: string; // the long-lived token: the only oauth secret stored
    accountDefinition: AccountDefinition;
    providerFields?: Record<string, string>; // e.g. Salesforce instance_url, Google Cloud project ID, etc.
  };
  readback?: Record<string, unknown>; // credentials for the optional verify() hook, e.g. API key, etc.
};

type LiveResource = { type: string; id: string };

// Run-scoped context threaded through every step of a scenario. Build data from these — never
// from string literals — so each run is isolated and repeatable.
interface RunContext {
  readonly runId: string; // unique id for this scenario run
  readonly resources: LiveResource[]; // resources registered so far (for later steps / cleanup)
  readonly liveSecret: LiveSecret; // resolved credentials for the destination

  // Memoised unique id for an entity kind (e.g. 'user'); stable within a run, distinct across runs.
  identity(entity: string): string;
  // Unique, sink-safe email address for the run (override the domain via LIVE_TEST_EMAIL_DOMAIN).
  email(entity?: string): string;
  // ISO timestamp relative to run start; `offset` like '-3h' / '+1d' (empty = run start).
  now(offset?: string): string;
  // Record a created resource so later steps can reference it and cleanup can remove it.
  register(resource: LiveResource): void;
  // Register an ad-hoc teardown fn (for resources discovered dynamically); drained after the scenario.
  addCleanup(fn: () => void | Promise<void>): void;
}

// Fields shared by every step.
interface Step {
  name: string;
}

// A pipeline step: seed -> /routerTransform -> /proxy, asserting the event is delivered.
interface PipelineStep extends Step {
  stepType: 'pipeline';
  seed: (ctx: RunContext) => Record<string, unknown>;
  // Merged into the /routerTransform input metadata, overriding defaults — e.g. { dontBatch: true }.
  metadataOverride?: Record<string, unknown>;
  // Exact number of /routerTransform outputs this step expects. The step knows what it seeded, so
  // pin the count when set — a batching regression that collapses/fans out events is otherwise
  // waved through by the default `> 0` check. Omit to keep the loose `> 0` assertion.
  expectedOutputs?: number;
  // Exact number of proxy requests across all outputs (where a dontBatch regression would slip
  // through). Omit to keep the loose per-output `> 0` assertion.
  expectedProxyRequests?: number;
  // Re-run seed -> transform -> deliver up to this many extra times (backoff) if delivery fails.
  // For routes that decide create-vs-update by searching an eventually-consistent index: a
  // freshly set-up record can be missed on the first try and 409, then found on a retry. Only use
  // where a failed attempt persists nothing (e.g. a 409-on-create), so a retry is safe to repeat.
  retries?: number;
  // Sleep this long before the first delivery attempt. For an update scenario whose setup just
  // created the record, this gives HubSpot's eventually-consistent Search index extra time to
  // reflect it before the transform's create-vs-update search runs — so the event resolves to an
  // update instead of being misrouted to a create (which 409s on the duplicate).
  delayBeforeMs?: number;
}

// An action step: a direct destination-API side effect (seed/mutate/delete state), run in order.
interface ActionStep extends Step {
  stepType: 'action';
  run: (ctx: RunContext) => Promise<void>;
}

// A verify step: a read-back assertion. `check` resolves on success and fails via a jest
// expectation (expect(...)) — the failed matcher is surfaced as the step failure.
interface VerifyStep extends Step {
  stepType: 'verify';
  check: (ctx: RunContext) => Promise<void>;
}

type LiveStep = PipelineStep | ActionStep | VerifyStep;

// A scenario is an ordered list of steps (pipeline | action | verify) sharing one RunContext.
// Setup, teardown and read-back are expressed as action/verify steps — no lifecycle hooks.
type LiveScenario = {
  id: string; // stable identifier, shown in test output and used to select scenarios
  description: string; // one-line summary of the behavior under test
  steps: LiveStep[];

  enabled?: boolean; // default true; set false to keep the scenario in the tree without running it
  // Run this scenario against a modified destination.Config (derived from the spec's base config).
  configOverride?: (base: Record<string, unknown>) => Record<string, unknown>;
  // The common trailing read-back, declared on the scenario the way `cleanup` is: the framework
  // runs `check` after the steps and retries it on a thrown matcher error (jest `expect`) with
  // backoff, rethrowing the last error on exhaustion — so destination code shrinks to the
  // assertion and the poll boilerplate lives here. For ordering cases (verify-after-setup or
  // mid-scenario), use a VerifyStep in `steps` instead.
  verify?: {
    check: (ctx: RunContext) => Promise<void>;
    attempts?: number; // default 4
    delayMs?: (attempt: number) => number; // default 1000 * 2 ** attempt
  };
  // Scenario teardown: armed at scenario start, drained after its steps finish (LIFO, best-effort),
  // and run even if a step failed. Prefer this over a trailing cleanup step.
  cleanup?: (ctx: RunContext) => void | Promise<void>;
};

// Per-destination contract at test/integrations/destinations/<dest>/live.ts, loaded by the registry.
type LiveSpec = {
  enabled: boolean; // false parks the whole destination — the registry skips it
  authType: AuthType;
  // Map the resolved secret into the destination.Config the transform expects (merge non-secret
  // defaults with the credentials in `s.config`).
  resolveConfig: (s: LiveSecret) => Record<string, unknown>;
  scenarios: LiveScenario[];
};

// A destination enrolled to run, paired with its spec.
type EnrolledDestination = { destination: string; spec: LiveSpec };

// Live-local wire schemas: include `endpointPath` (stripped by the shared
// ProcessorTransformationOutputSchema) and keep destination/metadata loose so we don't require
// Destination's full control-plane shape.
const LiveProcessorOutputSchema = z.object({
  version: z.string(),
  type: z.string(),
  method: z.string(),
  endpoint: z.string(),
  endpointPath: z.string().optional(),
  userId: z.string().optional(),
  headers: z.record(z.unknown()).optional(),
  params: z.record(z.unknown()).optional(),
  body: z
    .object({
      JSON: z.record(z.unknown()).optional(),
      JSON_ARRAY: z.record(z.unknown()).optional(),
      XML: z.record(z.unknown()).optional(),
      FORM: z.record(z.unknown()).optional(),
      GZIP: z.record(z.unknown()).optional(),
    })
    .optional(),
  files: z.record(z.unknown()).optional(),
});

const LiveRouterOutputSchema = z.object({
  batchedRequest: z.array(LiveProcessorOutputSchema).or(LiveProcessorOutputSchema).optional(),
  metadata: z.array(z.record(z.unknown())),
  destination: z.record(z.unknown()),
  batched: z.boolean(),
  statusCode: z.number(),
  error: z.string().optional(),
  statTags: z.record(z.unknown()).optional(),
});

type RouterOutput = z.infer<typeof LiveRouterOutputSchema>;
type BatchedRequest = z.infer<typeof LiveProcessorOutputSchema>;

// Options for buildRouterTransformBody (routerTransformRequest.ts).
type BuildRouterTransformBodyOptions = {
  secret?: Record<string, string>;
  metadataOverride?: Record<string, unknown>;
};

// Minimal HTTP client the pipeline runner drives; wraps SuperTest so the runner stays free of its types.
type LiveHttpResponse = { status: number; body: unknown };
type LiveHttpClient = {
  post: (url: string, body: unknown) => Promise<LiveHttpResponse>;
};

// Structured delivery failure — the retry loop and the throw site both consume this, so the
// human-readable message is assembled once, at the throw (see runPipelineStep).
type DeliveryFailure = {
  proxyStatus: number;
  verdictStatus: number;
  message: string;
  jobStates: unknown[];
};

// Arguments threaded into a single pipeline-step run.
type RunPipelineStepParams = {
  destination: string;
  scenarioId: string;
  step: PipelineStep;
  ctx: RunContext;
  config: Record<string, unknown>;
  http: LiveHttpClient;
};

// ─── Poll helpers (poll.ts) ───

type PollCheckResult<T> = { done: boolean; value: T };

type PollUntilOptions = {
  label: string;
  attempts: number;
  /** Delay before the next attempt; `attempt` is 0-based (after the first check). */
  delayMs: (attempt: number) => number;
  /** Extra wait after a successful check (e.g. search-index settle). */
  settleMs?: number;
  /**
   * When true, return the last observed value on exhaustion instead of throwing — useful for
   * verify steps that want a jest `expect` diff of the final read-back.
   */
  soft?: boolean;
};

type RetryUntilPassesOptions = {
  attempts?: number; // default 4
  delayMs?: (attempt: number) => number; // default 1000 * 2 ** attempt
};

export {
  AccountDefinition,
  AuthType,
  LiveSecret,
  RunContext,
  LiveResource,
  LiveStep,
  LiveScenario,
  LiveSpec,
  EnrolledDestination,
  PipelineStep,
  ActionStep,
  VerifyStep,
  LiveProcessorOutputSchema,
  LiveRouterOutputSchema,
  RouterOutput,
  BatchedRequest,
  BuildRouterTransformBodyOptions,
  LiveHttpResponse,
  LiveHttpClient,
  DeliveryFailure,
  RunPipelineStepParams,
  PollCheckResult,
  PollUntilOptions,
  RetryUntilPassesOptions,
};
