import Router from '@koa/router';
import { DestinationController } from '../controllers/destination';
import { RegulationController } from '../controllers/regulation';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';

const router = new Router();

router.post(
  '/:version/destinations/:destination',
  RouteActivationMiddleware.isDestinationRouteActive,
  RouteActivationMiddleware.destinationProcFilter,
  DestinationController.destinationTransformAtProcessor,
);
router.post(
  '/routerTransform',
  RouteActivationMiddleware.isDestinationRouteActive,
  RouteActivationMiddleware.destinationRtFilter,
  DestinationController.destinationTransformAtRouter,
);
router.post(
  '/batch',
  RouteActivationMiddleware.isDestinationRouteActive,
  RouteActivationMiddleware.destinationBatchFilter,
  DestinationController.batchProcess,
);

router.post('/deleteUsers', RegulationController.deleteUsers);

export const destinationRoutes = router.routes();
