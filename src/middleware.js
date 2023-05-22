const logger = require('./logger');
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

function blockLocalhostMiddleware() {
  return async (ctx, next) => {
    const remoteAddress = ctx.request.ip;
    // Check if the request is originating from the localhost
    if (remoteAddress.includes('127.0.0.1')) {
      logger.info(`localhost request blocked: ${remoteAddress}`);
      ctx.status = 403;
      ctx.body = 'localhost requests are not allowed.';
      return;
    }
    await next();
  };
}

function addStatMiddleware(app) {
  app.use(durationMiddleware());
}

function addRequestSizeMiddleware(app) {
  app.use(requestSizeMiddleware());
}

function localhostMiddleware(app) {
  app.use(blockLocalhostMiddleware());
}

module.exports = {
  addStatMiddleware,
  addRequestSizeMiddleware,
  localhostMiddleware,
};
