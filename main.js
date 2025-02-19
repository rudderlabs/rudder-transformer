var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var cluster = require('./src/util/cluster');
var metricsRouter = require('./src/routes/metricsRouter').metricsRouter;
var transformRoute = require('./src/routes/userTransformer');
const { transform } = require('lodash');

const app = new Koa();

const metricsApp = new Koa();
metricsApp.use(metricsRouter.routes()).use(metricsRouter.allowedMethods());

const clusterEnabled = process.env.CLUSTER_ENABLED !== 'false';
const port = parseInt(process.env.PORT ?? '9090', 10);

app.use(
  bodyParser({
    jsonLimit: '200mb',
  }),
);

app.use(transformRoute);

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
    console.error(`SIGTERM signal received`);
  });

  process.on('SIGINT', () => {
    console.error(`SIGINT signal received`);
  });

  process.on('SIGSEGV', () => {
    console.error(`SIGSEGV - JavaScript memory error occurred`);
  });

  gracefulShutdown(server, {
    signals: 'SIGINT SIGTERM SIGSEGV',
    timeout: 30000, // timeout: 30 secs
    forceExit: true, // triggers process.exit() at the end of shutdown process
    finally: finalFunction,
  });

  console.info(`App started. Listening on port: ${port}`);
}

module.exports = app;
