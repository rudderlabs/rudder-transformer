const stats = require('./util/stats');
const Pyroscope = require('@pyroscope/nodejs');

Pyroscope.init({
  appName: 'rudder-transformer',
});

function pyroscopeMiddleware(ctx, next) {
  Pyroscope.startHeapCollecting();
  return (ctx, next) => {
    if (ctx.method === 'GET' && ctx.path === '/debug/pprof/profile') {
      return handlerCpu(ctx).then(() => next());
    }
    if (ctx.method === 'GET' && ctx.path === '/debug/pprof/heap') {
      return handlerHeap(ctx).then(() => next());
    }
    next();
  };
}

async function handlerCpu(ctx) {
  try {
    const p = await Pyroscope.collectCpu(Number(ctx.query.seconds));
    ctx.body = p;
    ctx.status = 200;
  }
  catch (e) {
    console.log(e);
    ctx.status = 500;
  }
}

async function handlerHeap(ctx) {
  try {
    const p = await Pyroscope.collectHeap();
    ctx.body = p;
    ctx.status = 200;
  }
  catch (e) {
    console.log(e);
    ctx.status = 500;
  }
}

function addPyroscopeMiddleware(app) {
  app.use(pyroscopeMiddleware())
}

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

module.exports = {
  addStatMiddleware,
  addRequestSizeMiddleware,
  addPyroscopeMiddleware,
};
