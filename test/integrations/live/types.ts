import { z } from 'zod';

// Account definition rudder-auth uses to describe an OAuth account.
const AccountDefinitionSchema = z.object({
  type: z.string(),
  category: z.string(),
  name: z.string(),
});
type AccountDefinition = z.infer<typeof AccountDefinitionSchema>;

// Resolved credentials for one destination, validated at the LIVE_SECRET_<DEST> boundary by
// SecretResolver. The type is inferred from the schema (z.infer) so it can never drift from what
// is actually validated — one source of truth for the secret shape. Unknown keys are stripped;
// unset `authType`/`config` fall back to their defaults.
const LiveSecretSchema = z.object({
  authType: z.enum(['apiKey', 'oauth', 'basic', 'serviceAccount', 'custom']).default('apiKey'),
  config: z.record(z.unknown()).default({}), // merged into destination.Config
  secret: z.record(z.string()).optional(), // merged into metadata.secret
  resourceIds: z.record(z.string()).optional(), // account-scoped: listId, pixelId, audience ids, etc.
  oauthRefresh: z
    .object({
      refreshToken: z.string(), // the long-lived token: the only oauth secret stored
      accountDefinition: AccountDefinitionSchema.optional(),
      providerFields: z.record(z.string()).optional(), // e.g. Salesforce instance_url, GCP project id
    })
    .optional(),
  readback: z.record(z.unknown()).optional(), // credentials for the optional verify() hook
});
type LiveSecret = z.infer<typeof LiveSecretSchema>;
type AuthType = LiveSecret['authType'];
type OAuthVersion = 'v0' | 'v1';

interface LiveResource {
  type: string;
  id: string;
}

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

// Fields of the /routerTransform input `metadata` a scenario may override (the harness always sets
// jobId/attemptNum/userId/sourceId/destinationId/workspaceId/secret). Kept explicit — not a loose
// Record — so a step can only set fields transforms actually read: dontBatch (un-batched delivery)
// and workspaceId (per-workspace feature-flag gating on metadata.workspaceId, e.g. HubSpot's rETL
// split). Add fields here as new needs arise. NOTE: destination.Config is NOT here — per-scenario
// config is owned by resolveConfig + the scenario's configOverride.
interface MetadataOverride {
  workspaceId?: string;
  dontBatch?: boolean;
}

// Top-level fields of the /routerTransform input `destination` a scenario may override (the harness
// always sets ID/Config/Enabled). Kept explicit — not a loose Record — so a step can only override
// fields transforms actually read. Currently just WorkspaceID, for per-workspace feature-flag gating
// on destination.WorkspaceID (e.g. Braze's per-job delivery mapping). Config is deliberately absent —
// it's owned by resolveConfig + configOverride, so there's one clear source for per-scenario config.
// Add fields here as new gating needs arise.
interface DestinationOverride {
  WorkspaceID?: string;
}

// A pipeline step: seed -> /routerTransform -> /proxy, asserting the event is delivered.
interface PipelineStep extends Step {
  stepType: 'pipeline';
  seed: (ctx: RunContext) => Record<string, unknown>;
  // Merged into the /routerTransform input metadata, overriding defaults — e.g. { dontBatch: true }.
  metadataOverride?: MetadataOverride;
  // Merged into the /routerTransform input `destination` object, overriding defaults — e.g.
  // { WorkspaceID: '...' } to exercise a transform gated on destination.WorkspaceID.
  destinationOverride?: DestinationOverride;
  // Exact number of /routerTransform outputs this step expects. The step knows what it seeded, so
  // pin the count when set — a batching regression that collapses/fans out events is otherwise
  // waved through by the default `> 0` check. Omit to keep the loose `> 0` assertion.
  expectedOutputs?: number;
  // Exact number of proxy requests across all outputs (where a dontBatch regression would slip
  // through). Omit to keep the loose per-output `> 0` assertion.
  expectedProxyRequests?: number;
  // Assert every proxy request this step produces targets this endpointPath. This is not a
  // payload-shape assertion (those stay with the mocked suite) — it pins *which code path the
  // transform took*. A scenario that exists to prove a feature flag routes events somewhere new
  // would otherwise pass green when the flag silently failed to apply, because the old path
  // delivers a 2xx just as happily.
  expectedEndpointPath?: string;
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
interface LiveScenario {
  id: string; // stable identifier, shown in test output and used to select scenarios
  description: string; // one-line summary of the behavior under test
  steps: readonly LiveStep[];

  enabled?: boolean; // default true; set false to keep the scenario in the tree without running it
  // Process env applied before this scenario's steps and restored after — the live analogue of the
  // component suite's `envOverrides`. For transforms whose behaviour is selected by an env feature
  // flag rather than by destination.Config (e.g. CustomerIO's batching-framework and event-stream
  // V2 rollout switches), which is otherwise unreachable from a spec. Scenarios run sequentially,
  // so one scenario's env never leaks into the next. `undefined` unsets a variable.
  envOverride?: Record<string, string | undefined>;
  // Run this scenario against a modified destination.Config (derived from the spec's base config).
  configOverride?: (base: Record<string, unknown>, secret: LiveSecret) => Record<string, unknown>;
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
}

// Per-destination contract at test/integrations/destinations/<dest>/live.ts, loaded by the registry.
interface LiveSpec {
  enabled: boolean; // false parks the whole destination — the registry skips it
  authType: AuthType;
  oauthVersion?: OAuthVersion;
  // Map the resolved secret into the destination.Config the transform expects (merge non-secret
  // defaults with the credentials in `s.config`).
  resolveConfig: (s: LiveSecret) => Record<string, unknown>;
  // Optional: map secret → connection.config (must include `destination` for VDM audience dests).
  // When set, the harness wraps this as a full connection on each /routerTransform input.
  resolveConnection?: (s: LiveSecret) => Record<string, unknown>;
  scenarios: readonly LiveScenario[];
}

// A destination enrolled to run, paired with its spec.
interface EnrolledDestination {
  destination: string;
  spec: LiveSpec;
}

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
interface BuildRouterTransformBodyOptions {
  secret?: Record<string, string>;
  metadataOverride?: MetadataOverride;
  destinationOverride?: DestinationOverride;
  // Full connection object for RETL / audience destinations that read connection.config
  // (e.g. customAttributeName). Absent for event-stream destinations that don't need it.
  connection?: Record<string, unknown>;
}

// The /routerTransform request body the harness builds (see routerTransformRequest.ts). Declared
// explicitly so the wire contract is a single documented type rather than an inferred literal.
interface RouterTransformInput {
  message: Record<string, unknown>;
  destination: {
    ID: string;
    Config: Record<string, unknown>;
    Enabled: boolean;
  } & DestinationOverride;
  connection?: Record<string, unknown>;
  metadata: {
    jobId: number;
    attemptNum: number;
    userId: string;
    sourceId: string;
    destinationId: string;
    workspaceId: string;
    secret: Record<string, string>;
  } & MetadataOverride;
}
interface RouterTransformRequestBody {
  input: RouterTransformInput[];
  destType: string;
}

// Minimal HTTP client the pipeline runner drives; wraps SuperTest so the runner stays free of its types.
interface LiveHttpResponse {
  status: number;
  body: unknown;
}
interface LiveHttpClient {
  post: (url: string, body: object) => Promise<LiveHttpResponse>;
}

// Structured delivery failure — the retry loop and the throw site both consume this, so the
// human-readable message is assembled once, at the throw (see runPipelineStep).
interface DeliveryFailure {
  proxyStatus: number;
  verdictStatus: number;
  message: string;
  jobStates: unknown[];
}

// Arguments threaded into a single pipeline-step run.
interface RunPipelineStepParams {
  destination: string;
  scenarioId: string;
  step: PipelineStep;
  ctx: RunContext;
  config: Record<string, unknown>;
  http: LiveHttpClient;
  // Optional connection for destinations that require it at transform time (audience / VDM).
  connection?: Record<string, unknown>;
}

// ─── Poll helpers (poll.ts) ───

interface PollCheckResult<T> {
  done: boolean;
  value: T;
}

interface PollUntilOptions {
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
}

interface RetryUntilPassesOptions {
  attempts?: number; // default 4
  delayMs?: (attempt: number) => number; // default 1000 * 2 ** attempt
}

export {
  AccountDefinition,
  AccountDefinitionSchema,
  AuthType,
  OAuthVersion,
  LiveSecret,
  LiveSecretSchema,
  RunContext,
  LiveResource,
  LiveStep,
  LiveScenario,
  LiveSpec,
  EnrolledDestination,
  MetadataOverride,
  DestinationOverride,
  PipelineStep,
  ActionStep,
  VerifyStep,
  LiveProcessorOutputSchema,
  LiveRouterOutputSchema,
  RouterOutput,
  BatchedRequest,
  BuildRouterTransformBodyOptions,
  RouterTransformInput,
  RouterTransformRequestBody,
  LiveHttpResponse,
  LiveHttpClient,
  DeliveryFailure,
  RunPipelineStepParams,
  PollCheckResult,
  PollUntilOptions,
  RetryUntilPassesOptions,
};
