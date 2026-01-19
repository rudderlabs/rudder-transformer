import Router from '@koa/router';
import { UserTransformController } from '../controllers/userTransform';
import { FeatureFlagMiddleware } from '../middlewares/featureFlag';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { StatsMiddleware } from '../middlewares/stats';
import { UserTransformerV1Controller } from '../userTransformerV1/userTransformerV1.controller';

const router = new Router();

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
  UserTransformerV1Controller.testRun,
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
