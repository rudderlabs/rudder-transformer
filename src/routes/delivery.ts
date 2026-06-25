import Router from '@koa/router';
import { DeliveryController } from '../controllers/delivery';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';

const router = new Router();

router.post(
  '/v0/destinations/:destination/proxy',
  RouteActivationMiddleware.isDeliveryRouteActive,
  DeliveryController.deliverToDestination,
);

router.post(
  '/v1/destinations/:destination/proxy',
  RouteActivationMiddleware.isDeliveryRouteActive,
  DeliveryController.deliverToDestinationV1,
);

router.post(
  '/:version/destinations/:destination/proxyTest',
  RouteActivationMiddleware.isDeliveryTestRouteActive,
  DeliveryController.testDestinationDelivery,
);

const proxyRoutes = router.routes();
export default proxyRoutes;
