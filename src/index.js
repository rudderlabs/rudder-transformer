const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
require('dotenv').config();
const gracefulShutdown = require('http-graceful-shutdown');
const logger = require('./logger');

const { router } = require('./versionedRouter');
const { testRouter } = require('./testRouter');
const cluster = require('./util/cluster');
const { addPrometheusMiddleware } = require('./middleware');
const { logProcessInfo } = require('./util/utils');

const clusterEnabled = process.env.CLUSTER_ENABLED !== 'false';

const port = parseInt(process.env.PORT || '9090', 10);
const app = new Koa();
addPrometheusMiddleware(app);

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
