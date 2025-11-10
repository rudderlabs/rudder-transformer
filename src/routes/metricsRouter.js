const KoaRouter = require('@koa/router');
const logger = require('../logger');
const stats = require('../util/stats');

const metricsRouter = new KoaRouter();


metricsRouter.get('/metrics', async (ctx) => {
  try {
    await stats.metricsController(ctx);
  } catch (error) {
    logger.error(error);
    ctx.status = 400;
    ctx.body = error.message;
  }
});

metricsRouter.get('/resetMetrics', async (ctx) => {
  try {
    await stats.resetMetricsController(ctx);
  } catch (error) {
    logger.error(error);
    ctx.status = 400;
    ctx.body = error.message;
  }
});

module.exports = { metricsRouter };
