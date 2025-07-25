import Router from '@koa/router';
import { MiscController } from '../controllers/misc';

const router = new Router();

router.get('/health', MiscController.healthStats);
router.get('/transformerBuildVersion', MiscController.buildVersion); // depriciating
router.get('/buildVersion', MiscController.buildVersion);
router.get('/version', MiscController.version);
router.get('/features', MiscController.features);

const miscRoutes = router.routes();
export default miscRoutes;
