const { getDestTypeFromContext } = require('@rudderstack/integrations-lib');
// eslint-disable-next-line import/no-extraneous-dependencies
const { wrapWithLabels } = require('@pyroscope/nodejs');
const stats = require('./util/stats');
const logger = require('./logger');

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

    let outputLength = 0;
    try {
      // For an object body, Koa's `length` getter JSON.stringifies it to compute this. A body
      // over ~512MB throws RangeError: Invalid string length here - and Koa's own respond()
      // would hit the identical error immediately after this middleware returns, with no
      // middleware left to catch it, sending back a bare non-JSON 500. Replace the body now so
      // respond() serializes something small and valid instead.
      outputLength = ctx.response?.length || 0;
    } catch (err) {
      logger.error('[Middleware] Response body too large to serialize', {
        error: err.message,
        route: ctx.request.url,
        method: ctx.method,
      });
      ctx.status = 500;
      ctx.body = {
        error: 'ResponseTooLarge',
        message: 'Response payload was too large to serialize',
      };
      labels.code = ctx.status;
      outputLength = Buffer.byteLength(JSON.stringify(ctx.body));
    }
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
