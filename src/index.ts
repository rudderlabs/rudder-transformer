import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from './logger';
import dotenv from 'dotenv';
import { router } from './versionedRouter';
import { testRouter } from './testRouter';
import cluster from './util/cluster';
import { addPrometheusMiddleware } from './middleware';
import { applicationRoutes } from './routes';
import { logProcessInfo } from './util/utils';
import gracefulShutdown from 'http-graceful-shutdown';

dotenv.config();
const clusterEnabled = process.env.CLUSTER_ENABLED !== 'false';
const useUpdatedRoutes = process.env.ENABLE_NEW_ROUTES !== 'false';
const port = parseInt(process.env.PORT || '9090', 10);
const app = new Koa();
addPrometheusMiddleware(app);

app.use(
  bodyParser({
    jsonLimit: '200mb',
  }),
);

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
  logger.error(`Process (pid: ${process.pid}) was gracefully shutdown`);
  logProcessInfo();
}


if (clusterEnabled) {
  cluster.start(port, app);
} else {
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
