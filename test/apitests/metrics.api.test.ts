import os from 'os';
import path from 'path';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { Server } from 'http';
import request from 'supertest';

jest.setTimeout(30000);

const OLD_ENV = process.env;

// prometheusRegistry.metrics() returns the full Prometheus text format including
// default Node.js process metrics and custom metrics recorded by addStatMiddleware.
describe('metrics endpoint (CLUSTER_ENABLED=false)', () => {
  let mainServer: Server;
  let metricsServer: Server;

  beforeAll(async () => {
    process.env = { ...OLD_ENV, CLUSTER_ENABLED: 'false' };

    const { addStatMiddleware } = require('../../src/middleware');
    const { metricsRouter } = require('../../src/routes/metricsRouter');
    const { applicationRoutes } = require('../../src/routes');

    const app = new Koa();
    addStatMiddleware(app);
    app.use(bodyParser({ jsonLimit: '200mb' }));
    applicationRoutes(app);
    mainServer = app.listen();

    const metricsApp = new Koa();
    addStatMiddleware(metricsApp);
    metricsApp.use(metricsRouter.routes()).use(metricsRouter.allowedMethods());
    metricsServer = metricsApp.listen();
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await Promise.all([
      mainServer && createHttpTerminator({ server: mainServer }).terminate(),
      metricsServer && createHttpTerminator({ server: metricsServer }).terminate(),
    ]);
  });

  test('GET /metrics returns 200 with Prometheus text format', async () => {
    const response = await request(metricsServer).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.text).toContain('# HELP');
    expect(response.text).toContain('# TYPE');
  });

  test('GET /metrics reflects http_request_duration recorded by the main app', async () => {
    await request(mainServer).get('/health');
    const response = await request(metricsServer).get('/metrics');
    expect(response.text).toContain('transformer_http_request_duration');
  });

  test('GET /resetMetrics returns 200', async () => {
    const response = await request(metricsServer).get('/resetMetrics');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Metrics reset');
  });
});

// With CLUSTER_ENABLED=true and no workers, aggregatorRegistry.clusterMetrics()
// resolves immediately with an empty string.
describe('metrics endpoint (CLUSTER_ENABLED=true, USE_METRICS_AGGREGATOR=false)', () => {
  let metricsServer: Server;
  let terminator: HttpTerminator;

  beforeAll(async () => {
    await new Promise<void>((resolve, reject) => {
      jest.isolateModules(() => {
        try {
          process.env = { ...OLD_ENV, CLUSTER_ENABLED: 'true', USE_METRICS_AGGREGATOR: 'false' };

          const { addStatMiddleware } = require('../../src/middleware');
          const { metricsRouter } = require('../../src/routes/metricsRouter');

          const metricsApp = new Koa();
          addStatMiddleware(metricsApp);
          metricsApp.use(metricsRouter.routes()).use(metricsRouter.allowedMethods());
          metricsServer = metricsApp.listen();
          terminator = createHttpTerminator({ server: metricsServer });
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await terminator?.terminate();
  });

  test('GET /metrics returns 200 with empty body when no workers are connected', async () => {
    const response = await request(metricsServer).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.text).toBe('');
  });

  test('GET /resetMetrics returns 200', async () => {
    const response = await request(metricsServer).get('/resetMetrics');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Metrics reset');
  });
});

// With CLUSTER_ENABLED=true and USE_METRICS_AGGREGATOR=true, MetricsAggregator
// spawns a worker thread and aggregates metrics via IPC. Tests verify:
//   1. The worker path is absolute.
//   2. The worker is created only once — a bad path triggers an infinite
//      create→fail→exit→recreate loop that spikes CPU on the primary process.
//   3. With no cluster workers the endpoint times out and returns 400.
describe('metrics endpoint (CLUSTER_ENABLED=true, USE_METRICS_AGGREGATOR=true)', () => {
  let metricsServer: Server;
  let terminator: HttpTerminator;
  let shutdownStats: () => Promise<void>;
  let capturedWorkerCallCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let workerSpy: any;

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const workerThreads = require('worker_threads');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const OriginalWorker: any = workerThreads.Worker;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workerSpy = jest.spyOn(workerThreads as any, 'Worker').mockImplementation(function (
      ...args: unknown[]
    ) {
      return new OriginalWorker(...args);
    });

    // Run from the OS temp dir so a cwd-relative worker path fails to resolve.
    const originalCwd = process.cwd();
    process.chdir(os.tmpdir());

    try {
      await new Promise<void>((resolve, reject) => {
        jest.isolateModules(() => {
          try {
            process.env = {
              ...OLD_ENV,
              CLUSTER_ENABLED: 'true',
              USE_METRICS_AGGREGATOR: 'true',
              METRICS_AGGREGATOR_REQUEST_TIMEOUT_SECONDS: '1',
            };

            const { addStatMiddleware } = require('../../src/middleware');
            const { metricsRouter } = require('../../src/routes/metricsRouter');
            const stats = require('../../src/util/stats');
            shutdownStats = stats.shutdownMetricsClient;

            const metricsApp = new Koa();
            addStatMiddleware(metricsApp);
            metricsApp.use(metricsRouter.routes()).use(metricsRouter.allowedMethods());
            metricsServer = metricsApp.listen();
            terminator = createHttpTerminator({ server: metricsServer });
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      capturedWorkerCallCount = workerSpy.mock.calls.length;
    } finally {
      process.chdir(originalCwd);
    }
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await shutdownStats?.();
    await terminator?.terminate();
    workerSpy?.mockRestore();
  });

  test('worker thread is created with an absolute path (PR #5221)', () => {
    const workerPath = workerSpy.mock.calls[0]?.[0] as string;
    expect(workerPath).toBeDefined();
    expect(path.isAbsolute(workerPath)).toBe(true);
  });

  test('worker thread is created exactly once — broken path triggers a CPU-spiking restart loop', () => {
    expect(capturedWorkerCallCount).toBe(1);
  });

  test('GET /metrics returns 400 when no cluster workers are available', async () => {
    const response = await request(metricsServer).get('/metrics');
    expect(response.status).toBe(400);
    expect(response.text).toContain('timed out');
  }, 5000);

  test('GET /resetMetrics returns 200', async () => {
    const response = await request(metricsServer).get('/resetMetrics');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Metrics reset');
  });
});
