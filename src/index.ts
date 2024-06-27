import dotenv from 'dotenv';
import gracefulShutdown from 'http-graceful-shutdown';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { addRequestSizeMiddleware, addStatMiddleware, initPyroscope } from './middleware';
import { addSwaggerRoutes, applicationRoutes } from './routes';
import { metricsRouter } from './routes/metricsRouter';
import cluster from './util/cluster';
import { RedisDB } from './util/redis/redisConnector';
import { logProcessInfo } from './util/utils';

dotenv.config();

// eslint-disable-next-line import/first
import logger from './logger';

const clusterEnabled = process.env.CLUSTER_ENABLED !== 'false';
const port = parseInt(process.env.PORT ?? '9090', 10);
const metricsPort = parseInt(process.env.METRICS_PORT || '9091', 10);

initPyroscope();

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
