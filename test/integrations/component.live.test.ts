import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import { Command } from 'commander';
import { createHttpTerminator } from 'http-terminator';
import { Server } from 'http';
import { configureBatchProcessingDefaults } from '@rudderstack/integrations-lib';
import { applicationRoutes } from '../../src/routes/index';
import { getEnrolledDestinations } from './live/registry';
import { SecretResolver } from './live/secretResolver';
import { RunContextImpl } from './live/runContext';
import { runPipelineStep } from './live/runPipelineStep';
import { LiveSecret, EnrolledDestination } from './live/types';

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
  const agent = () => request(server as unknown as Parameters<typeof request>[0]);

  const enrolledDestinations: EnrolledDestination[] = getEnrolledDestinations(opts.destination);
  if (enrolledDestinations.length === 0) {
    test.skip('No enrolled destinations matched. Skipping live suite.', () => {});
    return;
  }

  describe.each(enrolledDestinations)('$destination', ({ destination, spec }) => {
    const liveSecret: LiveSecret = resolver.resolve(destination);
    const destinationConfig = spec.resolveConfig(liveSecret);

    const activeScenarios = spec.scenarios.filter((s) => s.enabled !== false);
    if (activeScenarios.length === 0) {
      test.skip(`${destination}: no enabled scenarios`, () => {});
      return;
    }

    describe.each(activeScenarios)('scenario: $id', (scenario) => {
      const ctx = new RunContextImpl({ liveSecret });
      const scenarioConfig = scenario.configOverride?.(destinationConfig) ?? destinationConfig;

      beforeAll(() => {
        // Arm scenario cleanup if present; drained after steps (LIFO, best-effort).
        if (scenario.cleanup) {
          ctx.addCleanup(() => scenario.cleanup!(ctx));
        }
      });

      afterAll(async () => {
        await ctx.runCleanups();
      });

      test.each(scenario.steps)(
        'step: $name',
        async (step) => {
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
                http: {
                  post: async (url, body) =>
                    agent()
                      .post(url)
                      .send(body as object),
                },
              });
          }
        },
        60000,
      );
    });
  });
});
