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
      // For an object body, Koa's `length` getter JSON.stringifies it to compute this, so a body
      // JSON.stringify rejects - over ~512MB (RangeError: Invalid string length), or circular -
      // throws here. `errorHandlerMiddleware` is registered upstream of this one (see
      // src/index.ts), so it would catch that and still return a well-formed JSON 500, but only
      // after logging it as an unhandled error and emitting an app-level `error` event, with a
      // body that says nothing about what actually went wrong. Handle it here instead, where the
      // cause is known, and still record a response size for the request.
      outputLength = ctx.response?.length || 0;
    } catch (err) {
      const tooLarge = err instanceof RangeError;
      logger.error('[Middleware] Response body could not be serialized', {
        error: err.message,
        reason: tooLarge ? 'tooLarge' : 'unserializable',
        route: ctx.request.url,
        method: ctx.method,
      });
      ctx.status = 500;
      ctx.body = tooLarge
        ? { error: 'ResponseTooLarge', message: 'Response payload was too large to serialize' }
        : {
            error: 'ResponseSerializationFailed',
            message: 'Response payload could not be serialized',
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
