const Pyroscope = require('@rudderstack/pyroscope-nodejs').default;

const { getDestTypeFromContext } = require('@rudderstack/integrations-lib');
const stats = require('./util/stats');

function parseEnvInt(envVar, defaultValue) {
  const value = process.env[envVar];
  if (!value) return defaultValue;

  const trimmed = value.trim();
  if (!trimmed) return defaultValue;

  const parsed = Number(trimmed);
  return Number.isInteger(parsed) ? parsed : defaultValue;
}

const PYROSCOPE_WALL_SAMPLING_DURATION_MS = parseEnvInt(
  'PYROSCOPE_WALL_SAMPLING_DURATION_MS',
  60000,
);
const PYROSCOPE_WALL_SAMPLING_INTERVAL_MICROS = parseEnvInt(
  'PYROSCOPE_WALL_SAMPLING_INTERVAL_MICROS',
  10000,
);
const PYROSCOPE_HEAP_SAMPLING_INTERVAL_BYTES = parseEnvInt(
  'PYROSCOPE_HEAP_SAMPLING_INTERVAL_BYTES',
  512 * 1024,
);
const PYROSCOPE_HEAP_STACK_DEPTH = parseEnvInt('PYROSCOPE_HEAP_STACK_DEPTH', 64);

Pyroscope.init({
  appName: 'rudder-transformer',
  // For pull mode, don't set serverAddress - let Grafana Agent scrape
  wall: {
    collectCpuTime: true, // Enable CPU time collection - REQUIRED for CPU profiling
    samplingDurationMs: PYROSCOPE_WALL_SAMPLING_DURATION_MS, // Duration of a single wall profile (60 seconds)
    samplingIntervalMicros: PYROSCOPE_WALL_SAMPLING_INTERVAL_MICROS, // Interval between samples (10ms in microseconds)
  },
  heap: {
    samplingIntervalBytes: PYROSCOPE_HEAP_SAMPLING_INTERVAL_BYTES, // 512KB - heap sampling interval
    stackDepth: PYROSCOPE_HEAP_STACK_DEPTH, // Reduced stack depth to limit deep node_modules traces
  },
});

// Start the profiler - REQUIRED for profiling to work
Pyroscope.start();

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

function addStatMiddleware(app) {
  app.use(durationMiddleware());
}

/**
 * Adds middleware to track request and response sizes.
 *
 * It depends on `koa-bodyparser` for parsing request bodies,
 * since it makes use of `ctx.request.rawBody`.
 *
 * @param {Object} app - The Koa application instance.
 * @returns {void}
 */
function addRequestSizeMiddleware(app) {
  app.use(async (ctx, next) => {
    await next();

    const labels = {
      method: ctx.method,
      code: ctx.status,
      route: ctx.request.url,
    };

    const inputLength = ctx.request?.rawBody ? Buffer.byteLength(ctx.request.rawBody) : 0;
    stats.histogram('http_request_size', inputLength, labels);
    const outputLength = ctx.response?.length || 0;
    stats.histogram('http_response_size', outputLength, labels);
  });
}

function addProfilingMiddleware(app) {
  app.use(Pyroscope.koaMiddleware());
}

module.exports = {
  addStatMiddleware,
  addRequestSizeMiddleware,
  addProfilingMiddleware,
  parseEnvInt,
  PYROSCOPE_WALL_SAMPLING_DURATION_MS,
  PYROSCOPE_WALL_SAMPLING_INTERVAL_MICROS,
  PYROSCOPE_HEAP_SAMPLING_INTERVAL_BYTES,
  PYROSCOPE_HEAP_STACK_DEPTH,
};
