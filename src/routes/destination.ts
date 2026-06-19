import Router from '@koa/router';
import { DestinationController } from '../controllers/destination';
import { RegulationController } from '../controllers/regulation';
import { FeatureFlagMiddleware } from '../middlewares/featureFlag';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { SecretSpreader } from '../middlewares/arraySpreader';
import { DestTransformCompactedPayloadV1Middleware } from '../middlewares/destTransformCompactedPayloadV1';
import { RouterTransformCompactedPayloadV1Middleware } from '../middlewares/routerTransformCompactedPayloadV1';
import { DestinationValidationMiddleware } from '../middlewares/destinationValidation';

const router = new Router();

router.post(
  '/:version/destinations/:destination',
  DestinationValidationMiddleware.pathParam,
  RouteActivationMiddleware.isDestinationRouteActive,
  RouteActivationMiddleware.destinationProcFilter,
  FeatureFlagMiddleware.handle,
  DestTransformCompactedPayloadV1Middleware,
  DestinationController.destinationTransformAtProcessor,
);
router.post(
  '/routerTransform',
  RouteActivationMiddleware.isDestinationRouteActive,
  DestinationValidationMiddleware.bodyDestType,
  RouteActivationMiddleware.destinationRtFilter,
  FeatureFlagMiddleware.handle,
  RouterTransformCompactedPayloadV1Middleware,
  SecretSpreader.middleware(),
  DestinationController.destinationTransformAtRouter,
);
router.post(
  '/batch',
  RouteActivationMiddleware.isDestinationRouteActive,
  DestinationValidationMiddleware.bodyDestType,
  RouteActivationMiddleware.destinationBatchFilter,
  FeatureFlagMiddleware.handle,
  RouterTransformCompactedPayloadV1Middleware,
  DestinationController.batchProcess,
);

router.post(
  '/deleteUsers',
  DestinationValidationMiddleware.userDeletionBody,
  RegulationController.deleteUsers,
);

const destinationRoutes = router.routes();
export default destinationRoutes;
