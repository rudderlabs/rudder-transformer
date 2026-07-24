import Router from '@koa/router';
import { DeliveryController } from '../controllers/delivery';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { DestinationValidationMiddleware } from '../middlewares/destinationValidation';
import { responseSchemaValidationMiddleware } from '../middlewares/responseSchemaValidation';
import {
  DeliveryProxyTestResponseOutputSchema,
  DeliveryV0ResponseOutputSchema,
  DeliveryV1ResponseOutputSchema,
} from '../types/zodTypes';

const router = new Router();

const validateDeliveryV0Response = responseSchemaValidationMiddleware({
  endpoint: 'delivery proxy v0',
  schema: DeliveryV0ResponseOutputSchema,
});

const validateDeliveryV1Response = responseSchemaValidationMiddleware({
  endpoint: 'delivery proxy v1',
  schema: DeliveryV1ResponseOutputSchema,
});

const validateDeliveryProxyTestResponse = responseSchemaValidationMiddleware({
  endpoint: 'delivery proxy test',
  schema: DeliveryProxyTestResponseOutputSchema,
});

router.post(
  '/v0/destinations/:destination/proxy',
  DestinationValidationMiddleware.pathParam,
  RouteActivationMiddleware.isDeliveryRouteActive,
  validateDeliveryV0Response,
  DeliveryController.deliverToDestination,
);

router.post(
  '/v1/destinations/:destination/proxy',
  DestinationValidationMiddleware.pathParam,
  RouteActivationMiddleware.isDeliveryRouteActive,
  validateDeliveryV1Response,
  DeliveryController.deliverToDestinationV1,
);

router.post(
  '/:version/destinations/:destination/proxyTest',
  DestinationValidationMiddleware.pathParam,
  RouteActivationMiddleware.isDeliveryTestRouteActive,
  validateDeliveryProxyTestResponse,
  DeliveryController.testDestinationDelivery,
);

const proxyRoutes = router.routes();
export default proxyRoutes;
