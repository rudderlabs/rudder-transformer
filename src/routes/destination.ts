import Router from 'koa-router';
import DestinationController from '../controllers/destination';
import RegulationController from '../controllers/regulation';
import RouteActivationController from '../controllers/routeActivation';

const router = new Router();

router.post(
  '/:version/destinations/:destination',
  RouteActivationController.isDestinationRouteActive,
  DestinationController.destinationTransformAtProcessor,
);
router.post(
  '/routerTransform',
  RouteActivationController.isDestinationRouteActive,
  DestinationController.destinationTransformAtRouter,
);
router.post(
  '/batch',
  RouteActivationController.isDestinationRouteActive,
  DestinationController.batchProcess,
);

router.post('/deleteUsers', RegulationController.handleUserDeletion);

export const destinationRoutes = router.routes();
