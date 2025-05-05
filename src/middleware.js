const Pyroscope = require('@rudderstack/pyroscope-nodejs').default;

const { getDestTypeFromContext } = require('@rudderstack/integrations-lib');
const stats = require('./util/stats');

Pyroscope.init({
  appName: 'rudder-transformer',
  wall: {
    collectCpuTime: true, // Enable CPU time collection
  },
});

function durationMiddleware() {
  return async (ctx, next) => {
    const startTime = new Date();

    await next();

    const labels = {
      method: ctx.method,
      code: ctx.status,
      route: ctx.request.url,
      destType: getDestTypeFromContext(ctx),
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

    const inputLength = ctx.request?.body ? Buffer.byteLength(JSON.stringify(ctx.request.body)) : 0;
    stats.histogram('http_request_size', inputLength, labels);
    const outputLength = ctx.response?.body
      ? Buffer.byteLength(JSON.stringify(ctx.response.body))
      : 0;
    stats.histogram('http_response_size', outputLength, labels);
  };
}

function addStatMiddleware(app) {
  app.use(durationMiddleware());
}

function addRequestSizeMiddleware(app) {
  app.use(requestSizeMiddleware());
}

function addProfilingMiddleware(app) {
  app.use(Pyroscope.koaMiddleware());
}

module.exports = {
  addStatMiddleware,
  addRequestSizeMiddleware,
  addProfilingMiddleware,
};
