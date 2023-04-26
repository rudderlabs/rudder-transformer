const stats = require('./util/stats');

function durationMiddleware() {
  return async (ctx, next) => {
    const startTime = new Date();

    await next();

    const labels = {
      method: ctx.method,
      code: ctx.status,
      route: ctx.request.url,
    };
    stats.timing('http_request_duration', startTime, labels);
  };
}

function requestSizeMiddleware() {
  return async (ctx, next) => {
    await next();

    const labels = {
      method: ctx.method,
      code: ctx.status,
      route: ctx.request.url,
    };

    const inputLength =
      ctx.request && ctx.request.body ? Buffer.byteLength(JSON.stringify(ctx.request.body)) : 0;
    stats.histogram('http_request_size', inputLength, labels);
    const outputLength =
      ctx.response && ctx.response.body ? Buffer.byteLength(JSON.stringify(ctx.response.body)) : 0;
    stats.histogram('http_response_size', outputLength, labels);
  };
}

function addStatMiddleware(app) {
  app.use(durationMiddleware());
}

function addRequestSizeMiddleware(app) {
  app.use(requestSizeMiddleware());
}

module.exports = {
  addStatMiddleware,
  addRequestSizeMiddleware,
};
