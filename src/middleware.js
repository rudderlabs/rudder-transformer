import { init, collectCpu, collectHeap, startHeapCollecting } from '@pyroscope/nodejs';
import { timing, histogram } from './util/stats';
import { error } from './logger';

init({
  appName: 'rudder-transformer',
});

async function handlerCpu(ctx) {
  try {
    const p = await collectCpu(Number(ctx.query.seconds));
    ctx.body = p;
    ctx.status = 200;
  } catch (e) {
    error(e);
    ctx.status = 500;
  }
}

async function handlerHeap(ctx) {
  try {
    const p = await collectHeap();
    ctx.body = p;
    ctx.status = 200;
  } catch (e) {
    error(e);
    ctx.status = 500;
  }
}

function pyroscopeMiddleware() {
  startHeapCollecting();
  return (ctx, next) => {
    if (ctx.method === 'GET' && ctx.path === '/debug/pprof/profile') {
      return handlerCpu(ctx).then(() => next());
    }
    if (ctx.method === 'GET' && ctx.path === '/debug/pprof/heap') {
      return handlerHeap(ctx).then(() => next());
    }
    return next();
  };
}

function addPyroscopeMiddleware(app) {
  app.use(pyroscopeMiddleware());
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
    timing('http_request_duration', startTime, labels);
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
    histogram('http_request_size', inputLength, labels);
    const outputLength = ctx.response?.body
      ? Buffer.byteLength(JSON.stringify(ctx.response.body))
      : 0;
    histogram('http_response_size', outputLength, labels);
  };
}

function addStatMiddleware(app) {
  app.use(durationMiddleware());
}

function addRequestSizeMiddleware(app) {
  app.use(requestSizeMiddleware());
}

export default {
  addStatMiddleware,
  addRequestSizeMiddleware,
  addPyroscopeMiddleware,
};
