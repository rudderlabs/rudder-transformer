import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import { Command } from 'commander';
import { createHttpTerminator } from 'http-terminator';
import type { Server } from 'http';
import { configureBatchProcessingDefaults } from '@rudderstack/integrations-lib';
import { applicationRoutes } from '../../src/routes/index';
import { getEnrolledDestinations } from './live/registry';
import { SecretResolver } from './live/secretResolver';
import { RunContextImpl } from './live/runContext';
import { runPipelineStep } from './live/runPipelineStep';
import { retryUntilPasses } from './live/poll';
import { OAuthTokenResolver } from './live/oauthTokenResolver';
import { RudderAuthContainer } from './live/rudderAuthContainer';
import type { LiveSecret, EnrolledDestination } from './live/types';

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

  const resolver = new SecretResolver();
  const authContainer = new RudderAuthContainer();
  const agent = () => request(server);
  let tokenResolver: OAuthTokenResolver | undefined;

  const enrolledDestinations: EnrolledDestination[] = getEnrolledDestinations(opts.destination);
  // eslint-disable-next-line no-console
  console.log(
    `[live] resolved ${enrolledDestinations.length} destination(s): ` +
      `${enrolledDestinations.map((d) => d.destination).join(', ') || '(none)'}`,
  );
  if (enrolledDestinations.length === 0) {
    test.skip('No enrolled destinations matched. Skipping live suite.', () => {});
    return;
  }

  // Manage the rudder-auth container when an OAuth destination is enrolled.
  const hasOAuthDestination = enrolledDestinations.some((d) => d.spec.authType === 'oauth');
  beforeAll(async () => {
    if (hasOAuthDestination) {
      const rudderAuthUrl = await authContainer.start();
      tokenResolver = new OAuthTokenResolver(rudderAuthUrl);
    }
  }, 900000);
  afterAll(async () => {
    if (hasOAuthDestination) {
      await authContainer.stop();
    }
  });

  // One describe per enrolled destination: resolve its credentials and base config, then run its
  // enabled scenarios. A missing/invalid secret throws here (fail-closed), failing the destination.
  describe.each(enrolledDestinations)('$destination', ({ destination, spec }) => {
    const liveSecret: LiveSecret = resolver.resolve(destination);

    beforeAll(async () => {
      if (spec.authType === 'oauth') {
        if (!tokenResolver) {
          throw new Error(
            '[live] OAuth destination enrolled but rudder-auth token resolver is not ready',
          );
        }
        // Merge rudder-auth's refreshed secret wholesale (mirroring rudder-server) so each
        // transform finds its token under whatever key it reads (accessToken | access_token).
        const secret = await tokenResolver.resolveSecret(destination, liveSecret);
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

      beforeAll(() => {
        // Arm scenario cleanup if present; drained after steps (LIFO, best-effort).
        if (scenario.cleanup) {
          ctx.addCleanup(() => scenario.cleanup!(ctx));
        }
      });

      afterAll(async () => {
        await ctx.runCleanups();
      });

      // Short-circuit: once a step in this scenario fails, skip the remaining steps and the
      // read-back. Later steps build on earlier ones, so continuing only cascades noise and
      // burns live API calls on an already-doomed scenario.
      let scenarioFailed = false;
      const skipIfFailed = (what: string): boolean => {
        if (scenarioFailed) {
          // eslint-disable-next-line no-console
          console.warn(`[live] skipping ${what} — an earlier step in this scenario failed`);
        }
        return scenarioFailed;
      };

      test.each(scenario.steps)(
        'step: $name',
        async (step) => {
          if (skipIfFailed(`step "${step.name}"`)) {
            return;
          }
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
          if (skipIfFailed('read-back')) {
            return;
          }
          await retryUntilPasses(() => check(ctx), { attempts, delayMs });
        }, 120000);
      }
    });
  });
});
