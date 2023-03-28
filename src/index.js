const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
require('dotenv').config();
const gracefulShutdown = require('http-graceful-shutdown');
const logger = require('./logger');

const { router } = require('./versionedRouter');
const { testRouter } = require('./testRouter');
const { metricsRouter } = require('./metricsRouter');
const cluster = require('./util/cluster');
const { addStatMiddleware } = require('./middleware');
const { logProcessInfo } = require('./util/utils');

const clusterEnabled = process.env.CLUSTER_ENABLED !== 'false';

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

app.use(router.routes()).use(router.allowedMethods());
app.use(testRouter.routes()).use(testRouter.allowedMethods());

function finalFunction() {
  logger.error(`Process (pid: ${process.pid}) was gracefully shutdown`);
  logProcessInfo();
}

if (clusterEnabled) {
  cluster.start(port, app, metricsApp);
} else {
  // HTTP server for exposing metrics
  if (process.env.STATS_CLIENT === 'prometheus') {
    metricsApp.listen(metricsPort);
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
