import Router from '@koa/router';
import DeliveryController from '../controllers/delivery';
import RouteActivationMiddleware from '../middlewares/routeActivation';

const router = new Router();

router.post(
  '/:version/destinations/:destination/proxy',
  RouteActivationMiddleware.isDeliveryRouteActive,
  RouteActivationMiddleware.destinationDeliveryFilter,
  DeliveryController.deliverToDestination,
);

router.post(
  '/:version/destinations/:destination/proxyTest',
  RouteActivationMiddleware.isDeliveryTestRouteActive,
  DeliveryController.testDestinationDelivery,
);

const proxyRoutes = router.routes();
export default proxyRoutes;
