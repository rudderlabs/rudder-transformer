/**
 * Integration tests for the /metrics and /resetMetrics HTTP endpoints.
 *
 * All source modules (applicationRoutes, middleware, metricsRouter, stats) are
 * loaded via dynamic require() inside each beforeAll so that CLUSTER_ENABLED and
 * related env vars are set before prometheus.js reads them as module-level constants.
 * No changes to test/setup.ts are required.
 */

import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { Server } from 'http';
import request from 'supertest';

jest.setTimeout(30000);

const OLD_ENV = process.env;

// ── CLUSTER_ENABLED=false (single-process / default deployment) ───────────────
//
// prometheus.js uses prometheusRegistry.metrics() which returns the full
// Prometheus text format including default Node.js process metrics and any
// custom metrics recorded by addStatMiddleware (e.g. transformer_http_request_duration).
// ─────────────────────────────────────────────────────────────────────────────
describe('metrics endpoint (CLUSTER_ENABLED=false)', () => {
  let mainServer: Server;
  let metricsServer: Server;

  beforeAll(async () => {
    process.env = { ...OLD_ENV, CLUSTER_ENABLED: 'false' };

    // Dynamic requires — source modules must load AFTER CLUSTER_ENABLED is set
    const { addStatMiddleware } = require('../../src/middleware');
    const { metricsRouter } = require('../../src/routes/metricsRouter');
    const { applicationRoutes } = require('../../src/routes');

    // Main app: addStatMiddleware records http_request_duration on every request
    const app = new Koa();
    addStatMiddleware(app);
    app.use(bodyParser({ jsonLimit: '200mb' }));
    applicationRoutes(app);
    mainServer = app.listen();

    // Metrics app: mirrors the standalone metricsApp in src/index.ts
    const metricsApp = new Koa();
    addStatMiddleware(metricsApp);
    metricsApp.use(metricsRouter.routes()).use(metricsRouter.allowedMethods());
    metricsServer = metricsApp.listen();
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await Promise.all([
      createHttpTerminator({ server: mainServer }).terminate(),
      createHttpTerminator({ server: metricsServer }).terminate(),
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

  test('GET /resetMetrics returns 200 with confirmation', async () => {
    const response = await request(metricsServer).get('/resetMetrics');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Metrics reset');
  });
});

// ── CLUSTER_ENABLED=true, USE_METRICS_AGGREGATOR=false ────────────────────────
//
// prometheus.js uses aggregatorRegistry.clusterMetrics() which collects metrics
// from cluster workers via IPC. With no workers in a test environment it resolves
// immediately with an empty string.
// ─────────────────────────────────────────────────────────────────────────────
describe('metrics endpoint (CLUSTER_ENABLED=true, USE_METRICS_AGGREGATOR=false)', () => {
  let metricsServer: Server;
  let terminator: HttpTerminator;

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      jest.isolateModules(() => {
        process.env = { ...OLD_ENV, CLUSTER_ENABLED: 'true', USE_METRICS_AGGREGATOR: 'false' };

        const { addStatMiddleware } = require('../../src/middleware');
        const { metricsRouter } = require('../../src/routes/metricsRouter');

        const metricsApp = new Koa();
        addStatMiddleware(metricsApp);
        metricsApp.use(metricsRouter.routes()).use(metricsRouter.allowedMethods());
        metricsServer = metricsApp.listen();
        terminator = createHttpTerminator({ server: metricsServer });
        resolve();
      });
    });
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await terminator.terminate();
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

// ── CLUSTER_ENABLED=true, USE_METRICS_AGGREGATOR=true ────────────────────────
//
// MetricsAggregator.aggregateMetrics() sends IPC to cluster workers and waits.
// With no workers it times out after METRICS_AGGREGATOR_REQUEST_TIMEOUT_SECONDS,
// causing the endpoint to return 400. afterAll calls shutdownMetricsClient() to
// cleanly tear down the aggregator worker thread.
// ─────────────────────────────────────────────────────────────────────────────
describe('metrics endpoint (CLUSTER_ENABLED=true, USE_METRICS_AGGREGATOR=true)', () => {
  let metricsServer: Server;
  let terminator: HttpTerminator;
  let shutdownStats: () => Promise<void>;

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      jest.isolateModules(() => {
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
      });
    });
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await shutdownStats?.();
    await terminator.terminate();
  });

  test('GET /metrics returns 400 when no cluster workers are available to aggregate', async () => {
    const response = await request(metricsServer).get('/metrics');
    expect(response.status).toBe(400);
    expect(response.text).toContain('timed out');
  }, 5000); // jest per-test timeout > the 1 s aggregator timeout

  test('GET /resetMetrics returns 200 regardless of worker availability', async () => {
    const response = await request(metricsServer).get('/resetMetrics');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Metrics reset');
  });
});
