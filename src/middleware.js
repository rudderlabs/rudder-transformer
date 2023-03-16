const prometheus = require('./util/prometheus');

function durationMiddleware() {
  return async (ctx, next) => {
    const end = prometheus.getMetrics().httpRequestDurationSummary.startTimer();
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
