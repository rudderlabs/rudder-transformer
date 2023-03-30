const stats = require('./util/stats');

function durationMiddleware() {
  return async (ctx, next) => {
    const startTime = new Date();

    await next();

    const labels = {
      method: ctx.method,
      code: ctx.status,
      // eslint-disable-next-line no-underscore-dangle
      route: ctx._matchedRoute,
    };
    stats.timing('http_request_duration', startTime, labels);
  };
}

function addStatMiddleware(app) {
  app.use(durationMiddleware());
}

module.exports = {
  addStatMiddleware,
};
