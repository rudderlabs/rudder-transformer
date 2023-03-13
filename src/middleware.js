function durationMiddleware(metrics) {
  return async (ctx, next) => {
    const end = metrics?.httpRequestDurationSummary.startTimer();
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

function addPrometheusMiddleware(app, metrics) {
  app.use(durationMiddleware(metrics));
}

module.exports = {
  addPrometheusMiddleware,
};
