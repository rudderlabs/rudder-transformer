import { z } from 'zod';
import { EnvOverride } from '../envUtils';

// The part of rudder-auth's account definition an integration has to state for itself: the
// destination `type` and the account-definition `name` rudder-auth resolves its implementation
// from (`name.toLowerCase()`). `category` is not here — it is 'destination' for every live spec,
// so the resolver supplies it rather than making each spec repeat a constant it cannot vary.
//
// A plain type, not a zod schema: this is declared in TypeScript by the spec, so the compiler
// already checks it. Zod earns its place at the LIVE_SECRET_<DEST> boundary, where the input is
// untrusted JSON — this is not that.
interface AccountDefinition {
  type: string;
  name: string;
}

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
  // Replaces the secret the harness would otherwise pass (the resolved credentials, refreshed by
  // rudder-auth for OAuth destinations). Its purpose is negative testing: handing a transform a
  // credential the destination will reject is the only way to reach a delivery spec's auth branch
  // live, since a real account's grant cannot be revoked on demand without breaking every other
  // scenario. Pair it with `expectedFailure.category`.
  secret?: Record<string, string>;
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

// A pipeline step: seed -> /routerTransform -> /proxy, asserting the events are delivered.
interface PipelineStep extends Step {
  stepType: 'pipeline';
  // The event to drive through the pipeline — or SEVERAL, returned as an array, which the runner
  // puts in a single /routerTransform call as one `input[]` entry each. The array form is the only
  // way to exercise router-level batching live: whether N events collapse into one delivery request
  // (pin it with expectedOutputs/expectedProxyRequests — a grouping regression that fans them out
  // still delivers 2xx on each) and whether every job comes back with a delivery verdict.
  seed: (ctx: RunContext) => Record<string, unknown> | Record<string, unknown>[];
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
  // Declares that this step is expected to fail, and how. One field for every kind of failure —
  // a rejected item, a bad credential, a throttled batch — so the step API does not grow a
  // separate flag per error class.
  //
  //   items    seed indices whose jobs must come back NOT delivered; every other seeded job must
  //            be delivered. Omit to mean the whole batch — an EMPTY array is rejected, since it
  //            would otherwise read as "declared a failure, expect none" and pass silently.
  //            Naming the index is the point for a partial failure: it asserts WHICH job the
  //            destination's delivery spec blamed, and blaming the wrong one still yields one
  //            success and one failure.
  //   category the error category the delivery reported, when it reports one (rudder-server reads
  //            it to decide whether a credential is worth refreshing). Asserting it is what
  //            separates a specific failure branch from the generic one — both abort the job.
  //
  // A step declaring this no longer requires the batch's top-level status to be 2xx, because a
  // partial or auth failure legitimately isn't.
  expectedFailure?: {
    items?: readonly number[];
    category?: string;
  };
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
  // flag rather than by destination.Config (e.g. CustomerIO's event-stream V2 rollout switch), which
  // is otherwise unreachable from a spec. Scenarios run sequentially, so one scenario's env never
  // leaks into the next. `undefined` unsets a variable.
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
  // The rudder-auth account definition for a `v1` refresh, which resolves the implementation from
  // `name.toLowerCase()`. Static, public metadata mirroring the control plane's
  // `accounts/<dest>_oauth/db-config.json`, NOT a credential — hence declared here rather than
  // stored in LIVE_SECRET_<DEST>.
  //
  // Required for `oauthVersion: 'v1'` and stated outright, never derived from the destination name.
  // The `DESTINATION_<DEST>_OAUTH` convention holds for most destinations but not all — see
  // google_adwords_remarketing_lists, which has both a legacy and a `_DM_OAUTH` definition — and a
  // derivation that is usually right is worse than none: where it guesses wrong it sends a
  // plausible name that rudder-auth resolves to nothing, and the failure surfaces as a refresh
  // error rather than as the missing declaration it actually is.
  accountDefinition?: AccountDefinition;
  // Environment variables set for the duration of this destination's scenarios and restored after.
  // Use this for destination/scenario-specific switches, including the temporary
  // batching-framework delivery rollout flag when a live spec must exercise framework delivery.
  // Do not set the batching-framework transform rollout flag for destinations already marked
  // batching-GA in features.ts.
  envOverrides?: EnvOverride;
  // Secret-derived environment variables, applied and restored alongside `envOverrides` (and
  // winning over them on a key collision). For transforms or SDKs that read a *credential* from
  // process.env rather than from destination.Config or metadata.secret — e.g. Google Ads' shared
  // `GOOGLE_ADS_DEVELOPER_TOKEN`. `envOverrides` is a static literal and so can't carry a secret;
  // this keeps every live credential inside the one LIVE_SECRET_<DEST> blob.
  resolveEnv?: (s: LiveSecret) => EnvOverride;
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

// One seeded event paired with the jobId its /routerTransform input carries. Built by the runner so
// jobIds are unique across a multi-event step and stay stable for the whole call.
interface SeededEvent {
  message: Record<string, unknown>;
  jobId: number;
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
  SeededEvent,
  LiveHttpResponse,
  LiveHttpClient,
  DeliveryFailure,
  RunPipelineStepParams,
  PollCheckResult,
  PollUntilOptions,
  RetryUntilPassesOptions,
};
