// Middleware to track request size
function addRequestSizeMiddleware(app) {
  app.use(async (ctx, next) => {
    const requestSize = Number(ctx.request.get('content-length'));
    ctx.state.requestSize = requestSize;
    await next();
  });
}

// Middleware to check if user transform route is active
function isUserTransformRouteActive(ctx, next) {
  // In the simplified version, we always consider the route active
  return next();
}

// Feature flag middleware
function handleFeatureFlags(ctx, next) {
  // In the simplified version, we don't use feature flags
  ctx.state.features = {};
  return next();
}

// Stats middleware
function executionStats(ctx, next) {
  // In the simplified version, we don't track stats
  return next();
}

module.exports = {
  addRequestSizeMiddleware,
  isUserTransformRouteActive,
  handleFeatureFlags,
  executionStats
};