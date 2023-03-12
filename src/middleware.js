const prometheus = require('./util/prometheus');

function durationMiddleware() {
  const httpRequestDurationSummary = prometheus.newHistogramStat(
    'http_request_duration',
    'Summary of HTTP requests duration in seconds',
    ['method', 'route', 'code'],
  );

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
};
