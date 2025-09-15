const { getDestTypeFromContext } = require('@rudderstack/integrations-lib');
// eslint-disable-next-line import/no-extraneous-dependencies
const { wrapWithLabels } = require('@pyroscope/nodejs');
const stats = require('./util/stats');

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

function addProfilingLabelsMiddleware(app) {
  app.use((ctx, next) => {
    let resp;
    wrapWithLabels(
      {
        integration_type: ctx.path.includes('/source') ? 'source' : 'destination',
        integration_name: getDestTypeFromContext(ctx) || 'unknown',
      },
      () => {
        resp = next();
      },
    );
    return resp;
  });
}

module.exports = {
  addStatMiddleware,
  addRequestSizeMiddleware,
  addProfilingLabelsMiddleware,
};
