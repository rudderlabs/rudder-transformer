const Router = require('@koa/router');
const { isUserTransformRouteActive, handleFeatureFlags, executionStats } = require('./middleware');
const { authenticate } = require('./middleware/auth');
const { createRateLimitMiddleware } = require('./middleware/ratelimit');
const { transformRaw } = require('./controllers/transform');

const router = new Router();

// Create the rate limit middleware
const rateLimitMiddleware = createRateLimitMiddleware();

// Health check endpoint
router.get('/health', (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'rudder-transformer-custom'
  };
});

router.post(
  '/customTransform',
  authenticate, // Authentication middleware
  rateLimitMiddleware, // Rate limiting middleware
  isUserTransformRouteActive,
  handleFeatureFlags,
  executionStats,
  transformRaw
);

router.post( // TODO hack to get past processor error
  '/v0/destinations/webhook',
  authenticate, // Authentication middleware
  rateLimitMiddleware, // Rate limiting middleware
  isUserTransformRouteActive,
  handleFeatureFlags,
  executionStats,
  transformRaw
);

module.exports = router.routes();
