import Router from '@koa/router';
import DestinationController from '../controllers/destination';
import RegulationController from '../controllers/regulation';
import FeatureFlagController from '../middlewares/featureFlag';
import RouteActivationController from '../middlewares/routeActivation';

const router = new Router();

router.post(
  '/:version/destinations/:destination',
  RouteActivationController.isDestinationRouteActive,
  RouteActivationController.destinationProcFilter,
  FeatureFlagController.handle,
  DestinationController.destinationTransformAtProcessor,
);
router.post(
  '/routerTransform',
  RouteActivationController.isDestinationRouteActive,
  RouteActivationController.destinationRtFilter,
  FeatureFlagController.handle,
  DestinationController.destinationTransformAtRouter,
);
router.post(
  '/batch',
  RouteActivationController.isDestinationRouteActive,
  RouteActivationController.destinationBatchFilter,
  FeatureFlagController.handle,
  DestinationController.batchProcess,
);

router.post('/deleteUsers', RegulationController.deleteUsers);

const destinationRoutes = router.routes();
export default destinationRoutes;
