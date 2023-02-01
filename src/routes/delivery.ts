import Router from 'koa-router';
import DeliveryController from '../controllers/delivery';
import RouteActivationController from '../controllers/routeActivation';

const router = new Router();

router.post(
  '/:version/destinations/:destination/proxy',
  RouteActivationController.isDeliveryRouteActive,
  DeliveryController.deliverToDestination,
);

router.post(
  '/:version/destinations/:destination/proxyTest',
  RouteActivationController.isDeliveryTestRouteActive,
  DeliveryController.testDestinationDelivery,
);

export const proxyRoutes = router.routes();
