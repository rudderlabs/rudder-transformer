const ratelimit = require('koa-ratelimit');
const redisConnector = require('../utils/redis');

/**
 * Rate limiting middleware for the Rudder Transformer Custom
 * Uses Redis for storage
 */

/**
 * Create a rate limiting middleware
 * @returns {Function} - Koa middleware
 */
function createRateLimitMiddleware() {
  // Skip rate limiting if not enabled
  if (process.env.RATE_LIMIT_ENABLED !== 'true') {
    return async (ctx, next) => next();
  }

  // Initialize Redis if not already initialized
  redisConnector.init();

  // Create the rate limiting middleware
  return ratelimit({
    driver: 'redis',
    db: redisConnector.client,
    duration: parseInt(process.env.RATE_LIMIT_DURATION || '60000', 10), // default: 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // default: 100 requests per duration
    id: (ctx) => {
      // Use the user ID from the JWT token if available, otherwise use the IP
      return ctx.state.user?.id || ctx.ip;
    },
    headers: {
      remaining: 'X-RateLimit-Remaining',
      reset: 'X-RateLimit-Reset',
      total: 'X-RateLimit-Limit'
    },
    disableHeader: false,
    whitelist: (ctx) => {
      // Whitelist certain IPs or users if needed
      const whitelistedIPs = (process.env.RATE_LIMIT_WHITELIST_IPS || '').split(',');
      return whitelistedIPs.includes(ctx.ip);
    },
    blacklist: (ctx) => {
      // Blacklist certain IPs or users if needed
      const blacklistedIPs = (process.env.RATE_LIMIT_BLACKLIST_IPS || '').split(',');
      return blacklistedIPs.includes(ctx.ip);
    }
  });
}

module.exports = {
  createRateLimitMiddleware
};