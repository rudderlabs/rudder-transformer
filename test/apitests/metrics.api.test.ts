import os from 'os';
import path from 'path';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { Server } from 'http';
import request from 'supertest';

// jest.spyOn needs the raw mutable CJS module object — an ESM namespace import
// (`import * as`) is wrapped by TS interop helpers and its properties cannot be
// redefined at runtime.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const workerThreads = require('worker_threads') as typeof import('worker_threads');

jest.setTimeout(30000);

const OLD_ENV = process.env;

interface MetricsServerSetup {
  metricsServer: Server;
  terminator: HttpTerminator;
}

// Shared setup for all describe blocks: overrides the environment, loads the stat
// middleware and metrics router inside jest.isolateModules (so each block gets a
// fresh stats module with its own env baked in, immune to test ordering), and starts
// a Koa server exposing the metrics routes. `setupExtras` runs inside the same
// isolation boundary, letting a block require additional modules that must share the
// isolated module registry.
const createMetricsServer = (
  envOverrides: Record<string, string>,
  setupExtras?: () => void,
): Promise<MetricsServerSetup> =>
  new Promise((resolve, reject) => {
    jest.isolateModules(() => {
      try {
        process.env = { ...OLD_ENV, ...envOverrides };

        const { addStatMiddleware } = require('../../src/middleware');
        const { metricsRouter } = require('../../src/routes/metricsRouter');

        const metricsApp = new Koa();
        addStatMiddleware(metricsApp);
        metricsApp.use(metricsRouter.routes()).use(metricsRouter.allowedMethods());
        const metricsServer = metricsApp.listen();

        setupExtras?.();

        resolve({ metricsServer, terminator: createHttpTerminator({ server: metricsServer }) });
      } catch (err) {
        reject(err);
      }
    });
  });

// prometheusRegistry.metrics() returns the full Prometheus text format including
// default Node.js process metrics and custom metrics recorded by addStatMiddleware.
describe('metrics endpoint (CLUSTER_ENABLED=false)', () => {
  let mainServer: Server;
  let metricsServer: Server;
  let terminator: HttpTerminator;

  beforeAll(async () => {
    ({ metricsServer, terminator } = await createMetricsServer({ CLUSTER_ENABLED: 'false' }, () => {
      // The main app must be built inside the same isolation boundary so it shares
      // the stats module (and Prometheus registry) with the metrics app — requests
      // recorded here must be visible on the /metrics endpoint.
      const { addStatMiddleware } = require('../../src/middleware');
      const { applicationRoutes } = require('../../src/routes');

      const app = new Koa();
      addStatMiddleware(app);
      app.use(bodyParser({ jsonLimit: '200mb' }));
      applicationRoutes(app);
      mainServer = app.listen();
    }));
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await Promise.all([
      mainServer && createHttpTerminator({ server: mainServer }).terminate(),
      terminator?.terminate(),
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
    ({ metricsServer, terminator } = await createMetricsServer({
      CLUSTER_ENABLED: 'true',
      USE_METRICS_AGGREGATOR: 'false',
    }));
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
  let workerSpy: jest.SpyInstance;

  beforeAll(async () => {
    // worker_threads is a Node.js built-in — a singleton that jest.isolateModules
    // does not re-evaluate — so the spy installed here on the shared module object
    // is visible inside the isolated require() in createMetricsServer below.
    const OriginalWorker = workerThreads.Worker;
    workerSpy = jest
      .spyOn(workerThreads, 'Worker')
      .mockImplementation(
        (...args: ConstructorParameters<typeof workerThreads.Worker>) =>
          new OriginalWorker(...args),
      );

    // Run from the OS temp dir so a cwd-relative worker path fails to resolve.
    const originalCwd = process.cwd();
    process.chdir(os.tmpdir());

    try {
      ({ metricsServer, terminator } = await createMetricsServer(
        {
          CLUSTER_ENABLED: 'true',
          USE_METRICS_AGGREGATOR: 'true',
          METRICS_AGGREGATOR_REQUEST_TIMEOUT_SECONDS: '1',
        },
        () => {
          const stats = require('../../src/util/stats');
          shutdownStats = stats.shutdownMetricsClient;
        },
      ));

      // Allow time for any crash-restart cycle to surface: if the worker path were
      // broken, the worker would repeatedly fail, exit, and be recreated, inflating
      // the spy's call count (see PR #5221).
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
