import Router from '@koa/router';
import TrackingPlanController from '../controllers/trackingPlan';

const router = new Router();

router.post('/:version/validate', TrackingPlanController.validateTrackingPlan);

export const trackingPlanRoutes = router.routes();
