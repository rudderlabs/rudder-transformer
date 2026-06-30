import Router from '@koa/router';
import { DeliveryController } from '../controllers/delivery';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { DestinationValidationMiddleware } from '../middlewares/destinationValidation';

const router = new Router();

router.post(
  '/v0/destinations/:destination/proxy',
  DestinationValidationMiddleware.pathParam,
  RouteActivationMiddleware.isDeliveryRouteActive,
  DeliveryController.deliverToDestination,
);

router.post(
  '/v1/destinations/:destination/proxy',
  DestinationValidationMiddleware.pathParam,
  RouteActivationMiddleware.isDeliveryRouteActive,
  DeliveryController.deliverToDestinationV1,
);

router.post(
  '/:version/destinations/:destination/proxyTest',
  DestinationValidationMiddleware.pathParam,
  RouteActivationMiddleware.isDeliveryTestRouteActive,
  DeliveryController.testDestinationDelivery,
);

const proxyRoutes = router.routes();
export default proxyRoutes;
