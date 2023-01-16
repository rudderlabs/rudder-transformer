const prometheusClient = require('prom-client');
// const gcStats = require("prometheus-gc-stats");

const prometheusRegistry = new prometheusClient.Registry();
prometheusClient.collectDefaultMetrics({ register: prometheusRegistry });

// const startGcStats = gcStats(prometheusRegistry); // gcStats() would have the same effect in this case
// startGcStats();

function durationMiddleware() {
  const httpRequestDurationSummary = new prometheusClient.Summary({
    name: 'http_request_duration_summary_seconds',
    help: 'Summary of HTTP requests duration in seconds',
    labelNames: ['method', 'route', 'code'],
    percentiles: [0.01, 0.1, 0.9, 0.99],
  });

  prometheusRegistry.registerMetric(httpRequestDurationSummary);

  return async (ctx, next) => {
    const end = httpRequestDurationSummary.startTimer();
    await next();

    const labels = {
      method: ctx.method,
      code: ctx.status,
      // eslint-disable-next-line no-underscore-dangle
      route: ctx._matchedRoute,
    };
    end(labels);
  };
}

function addPrometheusMiddleware(app) {
  app.use(durationMiddleware());
}

module.exports = {
  addPrometheusMiddleware,
  durationMiddleware,
  prometheusRegistry,
};
