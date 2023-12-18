import Router from '@koa/router';
import { DestinationController } from '../controllers/destination';
import { RegulationController } from '../controllers/regulation';
import { FeatureFlagMiddleware } from '../middlewares/featureFlag';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';

const router = new Router();

router.post(
  '/:version/destinations/:destination',
  RouteActivationMiddleware.isDestinationRouteActive,
  RouteActivationMiddleware.destinationProcFilter,
  FeatureFlagMiddleware.handle,
  DestinationController.destinationTransformAtProcessor,
);
router.post(
  '/routerTransform',
  RouteActivationMiddleware.isDestinationRouteActive,
  RouteActivationMiddleware.destinationRtFilter,
  FeatureFlagMiddleware.handle,
  DestinationController.destinationTransformAtRouter,
);
router.post(
  '/batch',
  RouteActivationMiddleware.isDestinationRouteActive,
  RouteActivationMiddleware.destinationBatchFilter,
  FeatureFlagMiddleware.handle,
  DestinationController.batchProcess,
);

router.post('/deleteUsers', RegulationController.deleteUsers);

const destinationRoutes = router.routes();
export default destinationRoutes;
