import Router from '@koa/router';
import DestinationController from '../controllers/destination';
import RegulationController from '../controllers/regulation';
import RouteActivationController from '../middlewares/routeActivation';

const router = new Router();

router.post(
  '/:version/destinations/:destination',
  RouteActivationController.isDestinationRouteActive,
  RouteActivationController.destinationProcFilter,
  DestinationController.destinationTransformAtProcessor,
);
router.post(
  '/routerTransform',
  RouteActivationController.isDestinationRouteActive,
  RouteActivationController.destinationRtFilter,
  DestinationController.destinationTransformAtRouter,
);
router.post(
  '/batch',
  RouteActivationController.isDestinationRouteActive,
  RouteActivationController.destinationBatchFilter,
  DestinationController.batchProcess,
);

router.post('/deleteUsers', RegulationController.deleteUsers);

const destinationRoutes = router.routes();
export default destinationRoutes;