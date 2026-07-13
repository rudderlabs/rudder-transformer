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
  // Re-run seed -> transform -> deliver up to this many extra times (backoff) if delivery fails.
  // For routes that decide create-vs-update by searching an eventually-consistent index: a
  // freshly set-up record can be missed on the first try and 409, then found on a retry. Only use
  // where a failed attempt persists nothing (e.g. a 409-on-create), so a retry is safe to repeat.
  retries?: number;
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
};
