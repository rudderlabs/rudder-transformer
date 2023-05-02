const KoaRouter = require('@koa/router');
const logger = require('../logger');
const stats = require('../util/stats');

const metricsRouter = new KoaRouter();

const enableStats = process.env.ENABLE_STATS !== 'false';

if (enableStats) {
  metricsRouter.get('/metrics', async (ctx) => {
    try {
      await stats.metricsController(ctx);
    } catch (error) {
      logger.error(error);
      ctx.status = 400;
      ctx.body = error.message;
    }
  });
}

module.exports = { metricsRouter };
