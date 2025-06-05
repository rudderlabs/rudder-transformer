import 'dotenv/config';
import gracefulShutdown from 'http-graceful-shutdown';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { configureBatchProcessingDefaults } from '@rudderstack/integrations-lib';
import { addRequestSizeMiddleware, addStatMiddleware, addProfilingMiddleware } from './middleware';
import { addSwaggerRoutes, applicationRoutes } from './routes';
import { metricsRouter } from './routes/metricsRouter';
import cluster from './util/cluster';
import { RedisDB } from './util/redis/redisConnector';
import { logProcessInfo } from './util/utils';

// eslint-disable-next-line import/first
import logger from './logger';
import { memoryFenceMiddleware } from './middlewares/memoryFencing';
import { concurrentRequests } from './middlewares/concurrentRequests';

const clusterEnabled = process.env.CLUSTER_ENABLED !== 'false';
const port = parseInt(process.env.PORT ?? '9090', 10);
const metricsPort = parseInt(process.env.METRICS_PORT || '9091', 10);

configureBatchProcessingDefaults({
  batchSize: parseInt(process.env.BATCH_PROCESSING_BATCH_SIZE || '50', 10), // TODO: we should decrease the default value to 20 after we have enough confidence in the performance of the batch processing
  yieldThreshold: parseInt(process.env.BATCH_PROCESSING_YIELD_THRESHOLD || '5', 10), // Yield control back to the event loop every 5ms by default
  sequentialProcessing: true, // wherever concurrent processing is needed, it should be enabled explicitly in the respective call
});

const app = new Koa();
addProfilingMiddleware(app);
addStatMiddleware(app); // Track request time and status codes
// Memory fencing middleware needs to come early in the middleware stack,
// before any other middleware that might allocate memory.
// It is disabled by default
if (process.env.MEMORY_FENCING_ENABLED === 'true') {
  app.use(
    memoryFenceMiddleware({
      thresholdPercent: parseInt(process.env.MEMORY_FENCING_THRESHOLD_PERCENT || '80', 10),
      statusCode: parseInt(process.env.MEMORY_FENCING_STATUS_CODE || '503', 10),
    }),
  );
}
app.use(concurrentRequests()); // Track concurrent requests

const metricsApp = new Koa();
addStatMiddleware(metricsApp);
metricsApp.use(metricsRouter.routes()).use(metricsRouter.allowedMethods());

app.use(bodyParser({ jsonLimit: '200mb' }));
addRequestSizeMiddleware(app); // Track request and response sizes

addSwaggerRoutes(app);

applicationRoutes(app);

function finalFunction() {
  RedisDB.disconnect();
  logger.info('Redis client disconnected');
  logger.error(`Process (pid: ${process.pid}) was gracefully shutdown`);
  logProcessInfo();
}

if (clusterEnabled) {
  cluster.start(port, app, metricsApp);
} else {
  // HTTP server for exposing metrics
  if (process.env.STATS_CLIENT === 'prometheus') {
    const metricsServer = metricsApp.listen(metricsPort);

    gracefulShutdown(metricsServer, {
      signals: 'SIGINT SIGTERM SIGSEGV',
      timeout: 30000, // timeout: 30 secs
      forceExit: false, // Don't force exit. Let graceful shutdown of server handle it.
    });
  }

  const server = app.listen(port);

  process.on('SIGTERM', () => {
    logger.error(`SIGTERM signal received`);
  });

  process.on('SIGINT', () => {
    logger.error(`SIGINT signal received`);
  });

  process.on('SIGSEGV', () => {
    logger.error(`SIGSEGV - JavaScript memory error occurred`);
  });

  gracefulShutdown(server, {
    signals: 'SIGINT SIGTERM SIGSEGV',
    timeout: 30000, // timeout: 30 secs
    forceExit: true, // triggers process.exit() at the end of shutdown process
    finally: finalFunction,
  });

  logger.info(`App started. Listening on port: ${port}`);
}

export default app;
