import Router from '@koa/router';
import ProfileController from '../controllers/profile';
import MiscController from '../controllers/misc';

const router = new Router();

router.post('/heapdump', ProfileController.profile);
router.get('/health', MiscController.healthStats);
router.get('/transformerBuildVersion', MiscController.buildVersion); // depriciating
router.get('/buildVersion', MiscController.buildVersion);
router.get('/version', MiscController.version);
router.get('/features', MiscController.features);
router.get('/debug/pprof/profile', MiscController.getCPUProfile);
router.get('/debug/pprof/heap', MiscController.getHeapProfile);

const miscRoutes = router.routes();
export default miscRoutes;
