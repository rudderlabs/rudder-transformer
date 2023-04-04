import Router from '@koa/router';
import { Context } from 'koa';
import ProfileController from '../controllers/profile';
import MiscController from '../controllers/misc';
import stats from '../util/stats';
import logger from '../logger';
const router = new Router();

router.post('/heapdump', ProfileController.profile);
router.get('/health', MiscController.healthStats);
router.get('/transformerBuildVersion', MiscController.buildVersion); // depriciating
router.get('/buildVersion', MiscController.buildVersion);
router.get('/version', MiscController.version);
router.get('/features', MiscController.features);
router.get('/metrics', async (ctx: Context) => {
  try {
    await stats.metricsController(ctx);
  } catch (error: any) {
    logger.error(error);
    ctx.status = 400;
    ctx.body = error.message;
  }
});

export const miscRoutes = router.routes();
