const jwt = require('jsonwebtoken');

/**
 * Authentication middleware for the Rudder Transformer Custom
 * Uses JWT for authentication
 */

/**
 * Middleware to authenticate requests using JWT
 * @param {Object} ctx - Koa context
 * @param {Function} next - Next middleware
 */
async function authenticate(ctx, next) {
  // Skip authentication if not enabled
  if (process.env.AUTH_ENABLED !== 'true') {
    return next();
  }

  try {
    // Get the authorization header
    const authHeader = ctx.headers.authorization;
    
    if (!authHeader) {
      ctx.status = 401;
      ctx.body = { error: 'Authorization header is missing' };
      return;
    }
    
    // Check if it's a Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      ctx.status = 401;
      ctx.body = { error: 'Authorization header format is invalid. Use "Bearer <token>"' };
      return;
    }
    
    const token = parts[1];
    
    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
      
      // Add the decoded token to the context state
      ctx.state.user = decoded;
      
      // Continue to the next middleware
      await next();
    } catch (error) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid token' };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error during authentication' };
  }
}

module.exports = {
  authenticate
};