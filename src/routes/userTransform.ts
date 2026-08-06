import Router from '@koa/router';
import { UserTransformController } from '../controllers/userTransform';
import { FeatureFlagMiddleware } from '../middlewares/featureFlag';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { StatsMiddleware } from '../middlewares/stats';
import { responseSchemaValidationMiddleware } from '../middlewares/responseSchemaValidation';
import { UserTransformationResponseListSchema } from '../types/zodTypes';

const router = new Router();

const validateCustomTransformResponse = responseSchemaValidationMiddleware({
  endpoint: 'custom transform',
  schema: UserTransformationResponseListSchema,
});

router.post(
  '/workspaces/:wId/reconcileFunction',
  RouteActivationMiddleware.isUserTransformRouteActive,
  UserTransformController.reconcileFunction,
);

router.post(
  '/customTransform',
  RouteActivationMiddleware.isUserTransformRouteActive,
  FeatureFlagMiddleware.handle,
  StatsMiddleware.executionStats,
  validateCustomTransformResponse,
  UserTransformController.transform,
);
router.post(
  '/transformation/test',
  RouteActivationMiddleware.isUserTransformTestRouteActive,
  UserTransformController.testTransform,
);
router.post(
  '/transformation/testRun',
  RouteActivationMiddleware.isUserTransformTestRouteActive,
  UserTransformController.testRun,
);
router.post(
  '/transformationLibrary/test',
  RouteActivationMiddleware.isUserTransformTestRouteActive,
  UserTransformController.testTransformLibrary,
);
router.post(
  '/transformation/sethandle',
  RouteActivationMiddleware.isUserTransformTestRouteActive,
  UserTransformController.testTransformSethandle,
);
router.post(
  '/extractLibs',
  RouteActivationMiddleware.isUserTransformRouteActive,
  UserTransformController.extractLibhandle,
);

const userTransformRoutes = router.routes();
export default userTransformRoutes;
