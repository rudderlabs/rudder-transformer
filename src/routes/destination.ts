import Router from '@koa/router';
import { DestinationController } from '../controllers/destination';
import { RegulationController } from '../controllers/regulation';
import { FeatureFlagMiddleware } from '../middlewares/featureFlag';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { SecretSpreader } from '../middlewares/arraySpreader';
import { DestTransformCompactedPayloadV1Middleware } from '../middlewares/destTransformCompactedPayloadV1';
import { RouterTransformCompactedPayloadV1Middleware } from '../middlewares/routerTransformCompactedPayloadV1';
import { DestinationValidationMiddleware } from '../middlewares/destinationValidation';
import { responseSchemaValidationMiddleware } from '../middlewares/responseSchemaValidation';
import {
  ProcessorOrStreamingResponseListSchema,
  RouterOrStreamingResponseListSchema,
  RouterTransformationResponseOutputSchema,
} from '../types/zodTypes';

const router = new Router();

const validateProcessorTransformResponse = responseSchemaValidationMiddleware({
  endpoint: 'destination processor transform',
  schema: ProcessorOrStreamingResponseListSchema,
});

const validateRouterTransformResponse = responseSchemaValidationMiddleware({
  endpoint: 'destination router transform',
  schema: RouterTransformationResponseOutputSchema,
});

const validateBatchTransformResponse = responseSchemaValidationMiddleware({
  endpoint: 'destination batch transform',
  schema: RouterOrStreamingResponseListSchema,
});

router.post(
  '/:version/destinations/:destination',
  DestinationValidationMiddleware.pathParam,
  RouteActivationMiddleware.isDestinationRouteActive,
  FeatureFlagMiddleware.handle,
  DestTransformCompactedPayloadV1Middleware,
  validateProcessorTransformResponse,
  DestinationController.destinationTransformAtProcessor,
);
router.post(
  '/routerTransform',
  RouteActivationMiddleware.isDestinationRouteActive,
  DestinationValidationMiddleware.bodyDestType,
  FeatureFlagMiddleware.handle,
  RouterTransformCompactedPayloadV1Middleware,
  SecretSpreader.middleware(),
  validateRouterTransformResponse,
  DestinationController.destinationTransformAtRouter,
);
router.post(
  '/batch',
  RouteActivationMiddleware.isDestinationRouteActive,
  DestinationValidationMiddleware.bodyDestType,
  FeatureFlagMiddleware.handle,
  RouterTransformCompactedPayloadV1Middleware,
  validateBatchTransformResponse,
  DestinationController.batchProcess,
);

router.post(
  '/deleteUsers',
  DestinationValidationMiddleware.userDeletionBody,
  RegulationController.deleteUsers,
);

const destinationRoutes = router.routes();
export default destinationRoutes;
