import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import gracefulShutdown from 'http-graceful-shutdown';
import dotenv from 'dotenv';
import logger from './logger';
import cluster from './util/cluster';
import { router } from './legacy/router';
import { testRouter } from './testRouter';
import { metricsRouter } from './routes/metricsRouter';
import { addStatMiddleware, addRequestSizeMiddleware } from './middleware';
import { logProcessInfo } from './util/utils';
import { applicationRoutes } from './routes';

const { RedisDB } = require('./util/redisConnector');

dotenv.config();
const clusterEnabled = process.env.CLUSTER_ENABLED !== 'false';
const useUpdatedRoutes = process.env.ENABLE_NEW_ROUTES !== 'false';
const port = parseInt(process.env.PORT || '9090', 10);
const metricsPort = parseInt(process.env.METRICS_PORT || '9091', 10);

const app = new Koa();
addStatMiddleware(app);

const metricsApp = new Koa();
addStatMiddleware(metricsApp);
metricsApp.use(metricsRouter.routes()).use(metricsRouter.allowedMethods());

app.use(
  bodyParser({
    jsonLimit: '200mb',
  }),
);

addRequestSizeMiddleware(app);

if (useUpdatedRoutes) {
  logger.info('Using new routes');
  applicationRoutes(app);
} else {
  // To be depricated
  logger.info('Using old routes');
  app.use(router.routes()).use(router.allowedMethods());
  app.use(testRouter.routes()).use(testRouter.allowedMethods());
}

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
