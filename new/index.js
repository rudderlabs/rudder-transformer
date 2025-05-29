const dotenv = require('dotenv');
const Koa = require('koa');
const { addRequestSizeMiddleware } = require('./middleware');
const transformRoutes = require('./routes');
const cluster = require('./utils/cluster');
const redisConnector = require('./utils/redis');

dotenv.config();

const port = parseInt(process.env.PORT || '9090', 10);

// Initialize Redis if enabled
if (process.env.REDIS_ENABLED === 'true') {
  redisConnector.init();
}

const app = new Koa();

// Create a conditional bodyParser middleware that skips parsing for the /customTransform route
app.use(async (ctx, next) => {
  if (
    ctx.path === '/customTransform' ||
    ctx.path === '/v0/destinations/webhook' ||
    ctx.path === '/health'
  ) {
    // Skip bodyParser for this route
    await next();
  } else {
    // This is a simplified version that only handles the /customTransform route
    ctx.status = 404;
    ctx.body = { error: 'Not Found' };
  }
});

addRequestSizeMiddleware(app);
app.use(transformRoutes);

// Start the server with clustering support
cluster.start(port, app);

module.exports = app;
