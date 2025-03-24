import Router from '@koa/router';
import { DestinationController } from '../controllers/destination';
import { RegulationController } from '../controllers/regulation';
import { FeatureFlagMiddleware } from '../middlewares/featureFlag';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { SecretSpreader } from '../middlewares/arraySpreader';

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
  SecretSpreader.middleware,
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
