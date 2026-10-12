import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import { Command } from 'commander';
import { createHttpTerminator } from 'http-terminator';
import type { Server } from 'http';
import { join } from 'path';
import { configureBatchProcessingDefaults } from '@rudderstack/integrations-lib';
import {
  discoverLiveSpecs,
  LiveOAuthTokenResolver,
  LiveRudderAuthContainer,
  resolveLiveSecret,
  retryUntilPasses,
} from '@rudderstack/integrations-lib/build/live-test';
import { applicationRoutes } from '../../src/routes/index';
import { RunContextImpl } from './live/runContext';
import { runPipelineStep } from './live/runPipelineStep';
import { readString } from './live/coerce';
import { EnvManager, EnvOverride } from './envUtils';
import { LiveSecretSchema } from './live/types';
import type { LiveSecret, EnrolledDestination, LiveSpec } from './live/types';

describe('Live Integration Test Suite', () => {
  // npm run test:live
  // npm run test:live:coverage
  // npm run test:live -- --destination=<dest>
  // npm run test:live:coverage -- --destination=<dest>
  const command = new Command()
    .allowUnknownOption()
    .allowExcessArguments()
    .option('-d, --destination <string>', 'Comma-separated destination(s) to run')
    .parse();
  const opts = command.opts();

  let server: Server;
  beforeAll(async () => {
    configureBatchProcessingDefaults({
      batchSize: 1,
      yieldThreshold: 1,
      sequentialProcessing: true,
    });
    const app = new Koa();
    app.use(bodyParser({ jsonLimit: '200mb' }));
    applicationRoutes(app);
    server = app.listen();
  });
  afterAll(async () => {
    if (server) {
      await createHttpTerminator({ server }).terminate();
    }
  });

  const agent = () => request(server);
  let tokenResolver: LiveOAuthTokenResolver | undefined;

  const enrolledDestinations: EnrolledDestination[] = discoverLiveSpecs<LiveSpec>({
    layout: {
      kind: 'directory',
      dir: join(__dirname, 'destinations'),
      specFile: 'live',
    },
    filter: opts.destination,
  }).map(({ name, spec }) => ({ destination: name, spec }));
  // eslint-disable-next-line no-console
  console.log(
    `[live] resolved ${enrolledDestinations.length} destination(s): ` +
      `${enrolledDestinations.map((d) => d.destination).join(', ') || '(none)'}`,
  );
  if (enrolledDestinations.length === 0) {
    test.skip('No enrolled destinations matched. Skipping live suite.', () => {});
    return;
  }

  // Manage the rudder-auth container when an OAuth destination is enrolled; it forwards only the
  // enrolled OAuth destinations' credentials.
  const oauthDestinations = enrolledDestinations
    .filter((d) => d.spec.authType === 'oauth')
    .map((d) => d.destination);
  const hasOAuthDestination = oauthDestinations.length > 0;
  const authContainer = new LiveRudderAuthContainer({
    entries: oauthDestinations.map((name) => ({ name, category: 'destination' })),
  });
  beforeAll(async () => {
    if (hasOAuthDestination) {
      const rudderAuthUrl = await authContainer.start();
      tokenResolver = new LiveOAuthTokenResolver(rudderAuthUrl);
    }
  }, 900000);
  afterAll(async () => {
    if (hasOAuthDestination) {
      await authContainer.stop();
    }
  }, 120000);

  // One describe per enrolled destination: resolve its credentials and base config, then run its
  // enabled scenarios.
  //
  // A missing or invalid secret throws here (fail-closed) — and note that "here" is the describe
  // body, which jest evaluates at COLLECTION time, so the throw fails the whole suite file ("Test
  // suite failed to run", zero tests) rather than only the destination at fault. That is fine as
  // things stand, because CI runs one destination per matrix job (see .github/scripts/
  // live-test-matrix.js), so a file is a destination. Anything that starts running several
  // destinations in one jest process would need this moved into a beforeAll to keep one
  // unprovisioned secret from taking the others down with it.
  describe.each(enrolledDestinations)('$destination', ({ destination, spec }) => {
    const liveSecret: LiveSecret = resolveLiveSecret(destination, { schema: LiveSecretSchema });

    // Applied around the whole destination rather than per scenario: the flags a live spec names
    // gate the transform and delivery paths themselves, so every scenario has to run under them.
    // `resolveEnv` contributes the secret-derived variables (a credential something reads from
    // process.env) and is merged last, so it wins on a key collision with the static literal.
    //
    // A resolveEnv value is required to be non-empty, and a violation fails here at the credential
    // boundary. Letting an empty one through would DELETE the variable (EnvOverride's semantics for
    // undefined) and the run would fail later, once per scenario, as whatever error the consuming
    // code raises for a missing credential — far from the secret field that is actually at fault.
    const envManager = new EnvManager();
    const resolvedEnv = spec.resolveEnv?.(liveSecret) ?? {};
    Object.entries(resolvedEnv).forEach(([key, value]) => {
      if (!value) {
        throw new Error(
          `[live:${destination}] resolveEnv returned an empty value for ${key} — the secret field ` +
            `it maps is missing from LIVE_SECRET_${destination.toUpperCase()}.`,
        );
      }
    });
    const destinationEnv: EnvOverride = { ...spec.envOverrides, ...resolvedEnv };
    beforeAll(() => {
      envManager.takeSnapshot(destination, Object.keys(destinationEnv));
      envManager.applyOverrides(destinationEnv);
    });
    afterAll(() => {
      envManager.restoreSnapshot(destination);
      envManager.cleanup();
    });

    beforeAll(async () => {
      if (spec.authType === 'oauth') {
        if (!tokenResolver) {
          throw new Error(
            '[live] OAuth destination enrolled but rudder-auth token resolver is not ready',
          );
        }
        // Merge rudder-auth's refreshed secret wholesale (mirroring rudder-server) so each
        // transform finds its token under whatever key it reads (accessToken | access_token).
        const secret = await tokenResolver.resolveSecret({
          name: destination,
          category: 'destination',
          version: spec.oauthVersion ?? 'v0',
          oauthRefresh: liveSecret.oauthRefresh,
          accountDefinition: spec.accountDefinition,
        });
        liveSecret.secret = { ...(liveSecret.secret ?? {}), ...secret };
      }
    });

    const destinationConfig = spec.resolveConfig(liveSecret);
    // Audience / VDM destinations require connection.config on /routerTransform input.
    const connectionConfig = spec.resolveConnection?.(liveSecret);
    const connection = connectionConfig
      ? {
          sourceId: 'live-sourceId',
          destinationId: `live-${destination}`,
          enabled: true,
          config: connectionConfig,
        }
      : undefined;

    const activeScenarios = spec.scenarios.filter((s) => s.enabled !== false);
    if (activeScenarios.length === 0) {
      test.skip(`${destination}: no enabled scenarios`, () => {});
      return;
    }

    describe.each(activeScenarios)('scenario: $id', (scenario) => {
      const ctx = new RunContextImpl({ liveSecret });
      const scenarioConfig =
        scenario.configOverride?.(destinationConfig, liveSecret) ?? destinationConfig;
      // rudder-server attaches the connected account to the destination; mirror it from the spec's
      // declared account definition so transforms that branch on it see the production shape.
      const deliveryAccount = spec.accountDefinition
        ? {
            id: readString(scenarioConfig.rudderAccountId, `live-${destination}-account`),
            accountDefinitionName: spec.accountDefinition.name,
          }
        : undefined;

      const envManager = new EnvManager();

      beforeAll(() => {
        // Env-gated transforms: apply this scenario's overrides before any step runs, and restore
        // them once it's done (see LiveScenario.envOverride). Scenarios run sequentially, so the
        // snapshot/restore pair keeps each one's flags to itself.
        if (scenario.envOverride) {
          envManager.takeSnapshot(scenario.id, Object.keys(scenario.envOverride));
          envManager.applyOverrides(scenario.envOverride);
        }
        // Arm scenario cleanup if present; drained after steps (LIFO, best-effort).
        if (scenario.cleanup) {
          ctx.addCleanup(() => scenario.cleanup!(ctx));
        }
      });

      afterAll(async () => {
        await ctx.runCleanups();
      }, 120000);

      // Registered after the cleanup hook so teardown still sees the scenario's env.
      afterAll(() => {
        if (scenario.envOverride) {
          envManager.restoreSnapshot(scenario.id);
        }
      });

      // Short-circuit: once a step in this scenario fails, don't run the remaining steps or the
      // read-back. Later steps build on earlier ones, so continuing only cascades noise and burns
      // live API calls on an already-doomed scenario.
      //
      // They are reported as FAILURES, not passes. Returning early would make jest record a green
      // tick for an assertion that never executed — a read-back that silently "passes" is the exact
      // failure mode this suite exists to remove. The message says why, so the cascade is still
      // trivially distinguishable from the one real failure at the top of the scenario.
      let scenarioFailed = false;
      const failIfSkipped = (what: string): void => {
        if (scenarioFailed) {
          throw new Error(
            `[live] ${what} did not run — an earlier step in this scenario failed. ` +
              'This is not an independent failure: fix the first failing step in this scenario.',
          );
        }
      };

      test.each(scenario.steps)(
        'step: $name',
        async (step) => {
          failIfSkipped(`step "${step.name}"`);
          try {
            // Steps run in declared order; dispatch by discriminant — action = direct API side
            // effect, verify = read-back assertion, pipeline = seed -> transform -> deliver -> assert.
            switch (step.stepType) {
              case 'action':
                await step.run(ctx);
                return;
              case 'verify':
                await step.check(ctx);
                return;
              case 'pipeline':
                await runPipelineStep({
                  destination,
                  scenarioId: scenario.id,
                  step,
                  ctx,
                  config: scenarioConfig,
                  connection,
                  deliveryAccount,
                  http: {
                    post: async (url, body) => agent().post(url).send(body),
                  },
                });
                return;
              default: {
                // Exhaustive discriminated-union check: adding a new step type without a case here
                // becomes a compile error rather than a silent no-op.
                const exhaustive: never = step;
                throw new Error(`[live] unknown step type: ${JSON.stringify(exhaustive)}`);
              }
            }
          } catch (err) {
            scenarioFailed = true;
            throw err;
          }
        },
        120000,
      );

      // The scenario's common trailing read-back: framework owns the polling, retrying the
      // assertion on a thrown matcher error with backoff (see LiveScenario.verify).
      if (scenario.verify) {
        const { check, attempts, delayMs } = scenario.verify;
        test('verify: scenario read-back', async () => {
          failIfSkipped('scenario read-back');
          await retryUntilPasses(() => check(ctx), { attempts, delayMs });
        }, 120000);
      }
    });
  });
});
