const prometheusClient = require("prom-client");

const prometheusRegistry = new prometheusClient.Registry();
prometheusClient.collectDefaultMetrics({ register: prometheusRegistry });

function durationMiddleware() {
  const httpRequestDurationSummary = new prometheusClient.Summary({
    name: "http_request_duration_summary_seconds",
    help: "Summary of HTTP requests duration in seconds",
    labelNames: ["method", "route", "code"],
    percentiles: [0.01, 0.1, 0.9, 0.99]
  });

  prometheusRegistry.registerMetric(httpRequestDurationSummary);

  return async (ctx, next) => {
    const end = httpRequestDurationSummary.startTimer();
    await next();

    const labels = {
      method: ctx.method,
      code: ctx.status,
      route: ctx._matchedRoute
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
  prometheusRegistry
};
